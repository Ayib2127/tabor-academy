import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/ai/openai';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const supabase = await createApiSupabaseClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { content, customInstructions, courseType, wordCount, fileCount } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create comprehensive prompt for course generation
    const prompt = `
You are an expert instructional designer and course creator. Based on the provided content, create a comprehensive course structure that is engaging, well-organized, and pedagogically sound.

CONTENT TO ANALYZE:
${content}

REQUIREMENTS:
- Course Type: ${courseType}
- Word Count: ${wordCount} words
- Number of Files: ${fileCount}
- Custom Instructions: ${customInstructions || 'None provided'}

TASK:
Create a complete course structure with the following specifications:

1. **Course Overview:**
   - Compelling title that reflects the content
   - Comprehensive description (2-3 sentences)
   - Appropriate category (e.g., "Digital Marketing", "Business", "Technology", etc.)
   - Difficulty level (beginner, intermediate, or advanced)
   - Estimated duration (e.g., "4-6 weeks", "2-3 hours")

2. **Learning Framework:**
   - 3-5 clear learning objectives
   - Prerequisites (if any)

3. **Course Structure:**
   - Organize content into 3-6 logical modules
   - Each module should have 3-7 lessons
   - Mix lesson types: text lessons, video placeholders, and quizzes
   - Ensure logical progression and flow

4. **Module Guidelines:**
   - Each module should focus on a specific theme or skill
   - Include a clear title and description
   - Balance content distribution across modules

5. **Lesson Guidelines:**
   - Create engaging, descriptive lesson titles
   - Assign appropriate lesson types:
     * "text" for content-heavy lessons
     * "video" for demonstrations or explanations
     * "quiz" for assessments (place strategically)
   - Estimate duration (5-30 minutes per lesson)

IMPORTANT: Return ONLY a valid JSON object with this exact structure:

{
  "title": "Course Title",
  "description": "Course description",
  "category": "Category Name",
  "level": "beginner|intermediate|advanced",
  "estimatedDuration": "Duration estimate",
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "lessons": [
        {
          "title": "Lesson Title",
          "type": "text|video|quiz",
          "duration": 15
        }
      ]
    }
  ],
  "learningObjectives": [
    "Learning objective 1",
    "Learning objective 2"
  ],
  "prerequisites": [
    "Prerequisite 1 (if any)"
  ]
}

Ensure the JSON is valid and properly formatted. Do not include any text before or after the JSON object.
`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert instructional designer who creates well-structured, engaging online courses. You always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Parse the JSON response
    let courseData;
    try {
      courseData = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', aiResponse);
      return NextResponse.json({ 
        error: 'Failed to generate valid course structure. Please try again.' 
      }, { status: 500 });
    }

    // Validate the course structure
    if (!courseData.title || !courseData.modules || !Array.isArray(courseData.modules)) {
      return NextResponse.json({ 
        error: 'Invalid course structure generated. Please try again.' 
      }, { status: 500 });
    }

    // Add IDs and additional metadata
    const processedCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      deliveryType: courseType,
      modules: courseData.modules.map((module: any, moduleIndex: number) => ({
        ...module,
        id: `module-${Date.now()}-${moduleIndex}`,
        order: moduleIndex,
        lessons: module.lessons.map((lesson: any, lessonIndex: number) => ({
          ...lesson,
          id: `lesson-${Date.now()}-${moduleIndex}-${lessonIndex}`,
          order: lessonIndex,
          is_published: false,
          content: null, // Will be filled by instructor
        }))
      })),
      tags: generateTags(courseData.title, courseData.description, courseData.category),
      price: 0, // Default price
      thumbnailUrl: null,
      promoVideoUrl: null,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      course: processedCourse,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
      metadata: {
        originalWordCount: wordCount,
        filesProcessed: fileCount,
        modulesGenerated: courseData.modules.length,
        lessonsGenerated: courseData.modules.reduce((total: number, module: any) => 
          total + (module.lessons?.length || 0), 0
        ),
      }
    });

  } catch (error: any) {
    console.error('Content import API Error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ 
        error: 'AI service quota exceeded. Please try again later.' 
      }, { status: 429 });
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json({ 
        error: 'AI service configuration error.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: 'Failed to process content and generate course. Please try again.' 
    }, { status: 500 });
  }
}

// Helper function to generate relevant tags
function generateTags(title: string, description: string, category: string): string[] {
  const text = `${title} ${description} ${category}`.toLowerCase();
  const commonTags = [
    'online learning', 'digital skills', 'professional development',
    'business', 'technology', 'marketing', 'entrepreneurship',
    'beginner friendly', 'practical', 'hands-on'
  ];

  const relevantTags = commonTags.filter(tag => 
    text.includes(tag.toLowerCase()) || 
    tag.toLowerCase().includes(category.toLowerCase())
  );

  // Add category as a tag
  relevantTags.unshift(category.toLowerCase());

  // Return unique tags, limited to 5
  return [...new Set(relevantTags)].slice(0, 5);
}