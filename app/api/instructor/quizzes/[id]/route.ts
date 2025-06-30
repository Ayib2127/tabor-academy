import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { Quiz } from '@/types/quiz';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createApiSupabaseClient();
    
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(quiz);
  } catch (error: any) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createApiSupabaseClient();
    
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quiz: Quiz = await req.json();

    // Update quiz
    const { error } = await supabase
      .from('quizzes')
      .update({
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        attemptsAllowed: quiz.attemptsAllowed,
        shuffleQuestions: quiz.shuffleQuestions,
        showCorrectAnswers: quiz.showCorrectAnswers,
        showExplanations: quiz.showExplanations,
      })
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Quiz updated successfully' });
  } catch (error: any) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update quiz' },
      { status: 500 }
    );
  }
} 