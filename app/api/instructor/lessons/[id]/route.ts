import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const bodySchema = z.object({
  content: z.string(),
  type: z.string().optional(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const lessonId = params.id;
  const supabase = await createApiSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parse = bodySchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  // Ensure user owns the lesson via join
  const { error: lessonFetchError, data: lesson } = await supabase
    .from('module_lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  if (lessonFetchError) {
    return NextResponse.json({ error: lessonFetchError.message }, { status: 500 });
  }

  // Parse content if it's a string
  let parsedContent: any = parse.data.content;
  if (typeof parsedContent === 'string') {
    try {
      parsedContent = JSON.parse(parsedContent) || {};
    } catch {
      parsedContent = {};
    }
  }
  if (!parsedContent || typeof parsedContent !== 'object') parsedContent = {};
  console.log('[LESSON PATCH] parsedContent:', JSON.stringify(parsedContent));

  // If lesson is being updated to type 'quiz', ensure a quiz row exists
  if ((parse.data.type === 'quiz' || lesson.type === 'quiz')) {
    // Check if a quiz exists for this lesson
    const { data: quiz, error: quizFetchError } = await supabase
      .from('quizzes')
      .select('id, questions')
      .eq('lesson_id', lessonId)
      .maybeSingle(); // Use maybeSingle for robustness
    console.log('[LESSON PATCH] quiz existence:', quiz, quizFetchError);
    if (quizFetchError) {
      return NextResponse.json({ error: quizFetchError.message }, { status: 500 });
    }
    // Defensive: ensure parsedContent is an object
    const quizTitle = ('title' in parsedContent) ? parsedContent.title : lesson.title;
    const quizQuestions = ('questions' in parsedContent) ? parsedContent.questions : [];
    if (!quiz) {
      // Try to create a new quiz row
      let newQuiz, quizInsertError;
      try {
        const insertResult = await supabase
          .from('quizzes')
          .insert({
            lesson_id: lessonId,
            title: quizTitle,
            attemptsallowed: 3,
            passing_score: 70,
            shuffle_questions: false,
            show_correct_answers: true,
            show_explanations: true,
            questions: quizQuestions,
          })
          .select()
          .maybeSingle();
        newQuiz = insertResult.data;
        quizInsertError = insertResult.error;
      } catch (err) {
        // If error is unique violation, fetch and update instead
        if (err && err.code === '23505') { // 23505 = unique_violation
          const { data: existingQuiz } = await supabase
            .from('quizzes')
            .select('id')
            .eq('lesson_id', lessonId)
            .maybeSingle();
          if (existingQuiz) {
            await supabase
              .from('quizzes')
              .update({
                questions: quizQuestions,
                title: quizTitle,
              })
              .eq('id', existingQuiz.id);
          }
        } else {
          return NextResponse.json({ error: err.message || 'Quiz insert error' }, { status: 500 });
        }
      }
      if (quizInsertError) {
        return NextResponse.json({ error: quizInsertError.message }, { status: 500 });
      }
      if (!newQuiz) {
        // If insert failed but quiz now exists, update it
        const { data: existingQuiz } = await supabase
          .from('quizzes')
          .select('id')
          .eq('lesson_id', lessonId)
          .maybeSingle();
        if (existingQuiz) {
          await supabase
            .from('quizzes')
            .update({
              questions: quizQuestions,
              title: quizTitle,
            })
            .eq('id', existingQuiz.id);
        } else {
          return NextResponse.json({ error: 'Failed to create or fetch quiz row after insert.' }, { status: 500 });
        }
      }
    } else {
      // Update the quiz questions/content if provided
      if (quizQuestions && Array.isArray(quizQuestions)) {
        const { data: updatedQuiz, error: quizUpdateError } = await supabase
          .from('quizzes')
          .update({
            questions: quizQuestions,
            title: quizTitle,
          })
          .eq('id', quiz.id)
          .select()
          .maybeSingle();
        console.log('[LESSON PATCH] quiz update result:', updatedQuiz, quizUpdateError);
        if (quizUpdateError) {
          return NextResponse.json({ error: quizUpdateError.message }, { status: 500 });
        }
        if (!updatedQuiz) {
          return NextResponse.json({ error: 'Failed to update or fetch quiz row after update.' }, { status: 500 });
        }
      }
    }
  }

  // Update the lesson as before
  const { error } = await supabase
    .from('module_lessons')
    .update({ content: parse.data.content, type: parse.data.type ?? 'text', updated_at: new Date().toISOString() })
    .eq('id', lessonId)
    .eq('instructor_id', session.user.id); // assumes column exists or RLS enforces

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
