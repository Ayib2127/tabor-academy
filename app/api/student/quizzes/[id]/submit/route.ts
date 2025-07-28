import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { QuizResults } from '@/types/quiz';
import { ValidationError, ForbiddenError, handleApiError } from '@/lib/utils/error-handling';

export async function POST(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  console.log("Quiz submit: params.id =", params.id);
  try {
    const supabase = await createApiSupabaseClient();
    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }

    // Log the incoming payload for debugging
    let results: QuizResults;
    try {
      results = await req.json();
    } catch (err) {
      throw new ValidationError('Invalid JSON in request body');
    }
    console.log("Quiz submission payload:", JSON.stringify(results, null, 2));

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('lesson_id', params.id)
      .single();
    console.log("Quiz submit: quiz =", quiz, "quizError =", quizError);

    if (quizError || !quiz) {
      throw new ValidationError('Quiz not found');
    }

    // Defensive check for attemptsAllowed
    if (typeof quiz.attemptsallowed !== 'number' || isNaN(quiz.attemptsallowed)) {
      throw new ValidationError('Quiz configuration error: attemptsAllowed missing or invalid');
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

    if (attempts.length >= quiz.attemptsallowed) {
      throw new ValidationError('Maximum attempts exceeded');
    }

    // Save attempt
    const { error: saveError } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quiz.id, // Use the actual quiz PK from the fetched quiz row
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
    const apiError = handleApiError(error);
    return NextResponse.json(
      { code: apiError.code, error: apiError.message, details: apiError.details },
      { status: apiError.code === 'VALIDATION_ERROR' ? 400 : apiError.code === 'FORBIDDEN' ? 403 : 500 }
    );
  }
} 