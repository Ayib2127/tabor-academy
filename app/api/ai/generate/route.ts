import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL, AI_PROMPTS, textToTiptapJSON, extractTextFromTiptap } from '@/lib/ai/openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { action, input, customPrompt, questionCount = 5 } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    let prompt: string;
    let inputText: string = '';

    // Extract text from input if it's Tiptap JSON
    if (typeof input === 'object' && input !== null) {
      inputText = extractTextFromTiptap(input);
    } else if (typeof input === 'string') {
      inputText = input;
    }

    // Generate appropriate prompt based on action
    switch (action) {
      case 'rewrite':
        if (!inputText) {
          return NextResponse.json({ error: 'Content is required for rewrite action' }, { status: 400 });
        }
        prompt = AI_PROMPTS.rewrite(inputText);
        break;

      case 'expand':
        if (!inputText) {
          return NextResponse.json({ error: 'Content is required for expand action' }, { status: 400 });
        }
        prompt = AI_PROMPTS.expand(inputText);
        break;

      case 'summarize':
        if (!inputText) {
          return NextResponse.json({ error: 'Content is required for summarize action' }, { status: 400 });
        }
        prompt = AI_PROMPTS.summarize(inputText);
        break;

      case 'improve':
        if (!inputText) {
          return NextResponse.json({ error: 'Content is required for improve action' }, { status: 400 });
        }
        prompt = AI_PROMPTS.improve(inputText);
        break;

      case 'outline':
        const title = body.title || 'Lesson Outline';
        const description = body.description;
        prompt = AI_PROMPTS.outline(title, description);
        break;

      case 'quiz':
        if (!inputText) {
          return NextResponse.json({ error: 'Content is required for quiz generation' }, { status: 400 });
        }
        prompt = AI_PROMPTS.quiz(inputText, questionCount);
        break;

      case 'custom':
        if (!customPrompt) {
          return NextResponse.json({ error: 'Custom prompt is required for custom action' }, { status: 400 });
        }
        prompt = AI_PROMPTS.custom(customPrompt, inputText);
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational content creator and instructional designer. You help create engaging, clear, and effective educational materials.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Process response based on action type
    let processedResponse;
    let responseType: 'text' | 'quiz' = 'text';

    if (action === 'quiz') {
      try {
        // Try to parse as JSON for quiz
        processedResponse = JSON.parse(aiResponse);
        responseType = 'quiz';
      } catch (error) {
        // If JSON parsing fails, treat as text and convert to basic quiz structure
        processedResponse = {
          id: `ai-quiz-${Date.now()}`,
          title: 'AI Generated Quiz',
          description: 'Quiz generated from lesson content',
          questions: [],
          passingScore: 70,
          attemptsAllowed: 3,
          shuffleQuestions: false,
          showCorrectAnswers: true,
          showExplanations: true,
        };
        responseType = 'quiz';
      }
    } else {
      // For text-based actions, try to parse as JSON first (in case AI returns Tiptap JSON)
      try {
        const parsedJSON = JSON.parse(aiResponse);
        if (parsedJSON.type === 'doc' && parsedJSON.content) {
          processedResponse = parsedJSON;
        } else {
          throw new Error('Not valid Tiptap JSON');
        }
      } catch (error) {
        // If not valid JSON, convert plain text to Tiptap JSON
        processedResponse = textToTiptapJSON(aiResponse);
      }
    }

    // Calculate confidence score (mock implementation)
    const confidence = Math.min(0.95, 0.7 + (aiResponse.length / 1000) * 0.2);

    // Generate suggestions based on action type
    const suggestions = generateSuggestions(action, inputText);

    return NextResponse.json({
      content: processedResponse,
      type: responseType,
      confidence,
      suggestions,
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      }
    });

  } catch (error: any) {
    console.error('AI API Error:', error);
    
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
      error: 'Failed to generate AI content. Please try again.' 
    }, { status: 500 });
  }
}

function generateSuggestions(action: string, content: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    rewrite: [
      'Review the rewritten content for accuracy',
      'Consider adding more examples if needed',
      'Check if the tone matches your course style'
    ],
    expand: [
      'Add visual aids to complement the expanded content',
      'Include interactive elements for better engagement',
      'Consider breaking into smaller sections if too long'
    ],
    summarize: [
      'Use the summary as a lesson introduction or conclusion',
      'Consider creating a downloadable summary for students',
      'Add key takeaways as bullet points'
    ],
    improve: [
      'Review improvements for consistency with course goals',
      'Test readability with your target audience',
      'Consider adding assessment questions'
    ],
    outline: [
      'Customize the outline to match your teaching style',
      'Add time estimates for each section',
      'Include practical exercises or activities'
    ],
    quiz: [
      'Review questions for accuracy and clarity',
      'Adjust difficulty level as needed',
      'Consider adding more question types for variety'
    ],
    custom: [
      'Review the generated content carefully',
      'Adapt the content to your specific needs',
      'Consider combining with other AI-generated content'
    ]
  };

  return suggestions[action] || ['Review and customize the generated content as needed'];
}