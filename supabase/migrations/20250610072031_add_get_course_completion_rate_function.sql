-- Migration to add a PostgreSQL function for calculating course completion rate.

CREATE OR REPLACE FUNCTION public.get_course_completion_rate(
    p_course_id uuid,
    p_user_id uuid
)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
    completed_lessons_count integer;
    total_lessons_count integer;
    completion_rate numeric;
BEGIN
    -- Count completed lessons for the user in the specified course
    SELECT COUNT(p.lesson_id)
    INTO completed_lessons_count
    FROM public.progress p
    JOIN public.lessons l ON p.lesson_id = l.id
    WHERE p.user_id = p_user_id
      AND l.course_id = p_course_id
      AND p.completed = true;

    -- Count total published lessons for the specified course
    SELECT COUNT(id)
    INTO total_lessons_count
    FROM public.lessons
    WHERE course_id = p_course_id
      AND is_published = true;

    -- Calculate completion rate
    IF total_lessons_count = 0 THEN
        completion_rate := 0;
    ELSE
        completion_rate := (completed_lessons_count * 100.0 / total_lessons_count);
    END IF;

    RETURN completion_rate;
END;
$$;

-- Grant execution permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_course_completion_rate(uuid, uuid) TO authenticated;
