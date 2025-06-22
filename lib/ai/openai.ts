import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODEL = 'gpt-4o-mini';

// AI prompt templates for different actions
export const AI_PROMPTS = {
  rewrite: (content: string) => `
Please rewrite the following educational content to improve clarity, engagement, and readability while maintaining the original meaning and educational value. Make it more engaging for students:

Content to rewrite:
${content}

Return the response in valid Tiptap JSON format with proper structure including paragraphs, headings, lists, etc.
`,

  expand: (content: string) => `
Please expand the following educational content by adding more detail, examples, explanations, and practical applications. Make it more comprehensive while keeping it engaging:

Content to expand:
${content}

Return the response in valid Tiptap JSON format with proper structure including paragraphs, headings, lists, examples, etc.
`,

  summarize: (content: string) => `
Please create a concise summary of the following educational content, highlighting the key points and main takeaways:

Content to summarize:
${content}

Return the response in valid Tiptap JSON format with proper structure.
`,

  improve: (content: string) => `
Please improve the following educational content by enhancing readability, flow, structure, and educational effectiveness:

Content to improve:
${content}

Return the response in valid Tiptap JSON format with proper structure including paragraphs, headings, lists, etc.
`,

  outline: (title: string, description?: string) => `
Create a comprehensive course outline for a lesson titled "${title}"${description ? ` with the following description: ${description}` : ''}.

Generate a well-structured lesson outline that includes:
1. Learning objectives
2. Introduction section
3. Core concepts with explanations
4. Practical examples
5. Summary and next steps

Return the response in valid Tiptap JSON format with proper heading hierarchy (h1, h2, h3), paragraphs, and bullet lists.
`,

  quiz: (content: string, questionCount: number = 5) => `
Based on the following educational content, generate ${questionCount} quiz questions that test student understanding. Include a mix of question types:

Content:
${content}

Generate questions that cover the key concepts and learning objectives. For each question, provide:
1. The question text
2. Multiple choice options (4 options each)
3. The correct answer
4. An explanation of why the answer is correct

Return the response as a JSON object with this structure:
{
  "id": "quiz-[timestamp]",
  "title": "Quiz: [derived from content]",
  "description": "Assessment based on lesson content",
  "questions": [
    {
      "id": "q[number]",
      "type": "multiple_choice",
      "question": "Question text",
      "points": 1,
      "options": [
        {"id": "opt1", "text": "Option 1", "isCorrect": false},
        {"id": "opt2", "text": "Option 2", "isCorrect": true},
        {"id": "opt3", "text": "Option 3", "isCorrect": false},
        {"id": "opt4", "text": "Option 4", "isCorrect": false}
      ],
      "explanation": "Explanation of correct answer"
    }
  ],
  "passingScore": 70,
  "attemptsAllowed": 3,
  "shuffleQuestions": false,
  "showCorrectAnswers": true,
  "showExplanations": true
}
`,

  custom: (prompt: string, content?: string) => `
${prompt}

${content ? `Context/Content:\n${content}` : ''}

If the request is for text content, return the response in valid Tiptap JSON format with proper structure.
If the request is for a quiz, return a properly structured quiz JSON object.
`,
};

// Helper function to convert text to Tiptap JSON
export function textToTiptapJSON(text: string) {
  // Split text into paragraphs and create basic Tiptap structure
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  return {
    type: 'doc',
    content: paragraphs.map(paragraph => ({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: paragraph.trim()
        }
      ]
    }))
  };
}

// Helper function to extract text from Tiptap JSON
export function extractTextFromTiptap(tiptapJSON: any): string {
  if (!tiptapJSON || !tiptapJSON.content) return '';
  
  function extractFromNode(node: any): string {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractFromNode).join(' ');
    }
    
    return '';
  }
  
  return tiptapJSON.content.map(extractFromNode).join('\n\n');
}