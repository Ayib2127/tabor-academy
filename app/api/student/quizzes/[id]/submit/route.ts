import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { QuizResults } from '@/types/quiz';

export async function POST(req: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context;
  console.log("DEBUG: params in quiz submit route:", params);
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

    // Log the incoming payload for debugging
    const results: QuizResults = await req.json();
    console.log("Quiz submission payload:", JSON.stringify(results, null, 2));

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', params.id)
      .single();

    if (quizError || !quiz) {
      throw new Error('Quiz not found');
    }

    // Check if student has exceeded attempts
    const { data: attempts, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', params.id)
      .eq('student_id', session.user.id);

    if (attemptsError) {
      throw attemptsError;
    }

    if (attempts.length >= quiz.attemptsAllowed) {
      return NextResponse.json(
        { error: 'Maximum attempts exceeded' },
        { status: 400 }
      );
    }

    // Save attempt
    const { error: saveError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: params.id,
        student_id: session.user.id,
        score: results.score,
        answers: results.answers,
        time_spent: results.timeSpent,
        passed: results.score >= quiz.passingScore,
      });

    if (saveError) {
      throw saveError;
    }

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      passed: results.score >= quiz.passingScore,
    });
  } catch (error: any) {
    // Log the full error stack for debugging
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit quiz', details: error.stack },
      { status: 500 }
    );
  }
} 