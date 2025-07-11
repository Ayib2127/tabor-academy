import { supabase } from '@/lib/supabase/client';

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Array<{
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz' | 'assignment';
    position: number;
    dueDate?: string;
    needsGrading?: boolean;
  }>;
}

export interface CourseWithModules {
  id: string;
  title: string;
  status: string;
  modules: Module[];
}

export async function fetchCourseModules(courseIds: string[]): Promise<CourseWithModules[]> {
  
  try {
    const { data: modulesData, error: modulesError } = await supabase
      .from('course_modules')
      .select(`
        id,
        title,
        order,
        course_id,
        module_lessons (
          id,
          title,
          type,
          position,
          due_date,
          needs_grading
        )
      `)
      .in('course_id', courseIds)
      .order('order', { ascending: true });

    if (modulesError) {
      console.error('Error fetching course modules:', modulesError);
      return [];
    }

    // Group modules by course_id
    const courseModulesMap = new Map<string, Module[]>();
    
    (modulesData || []).forEach(module => {
      const courseId = module.course_id;
      if (!courseModulesMap.has(courseId)) {
        courseModulesMap.set(courseId, []);
      }
      
      const lessons = (module.module_lessons || []).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        type: lesson.type as 'video' | 'text' | 'quiz' | 'assignment',
        position: lesson.position,
        dueDate: lesson.due_date,
        needsGrading: lesson.needs_grading || false,
      })).sort((a, b) => a.position - b.position);

      courseModulesMap.get(courseId)!.push({
        id: module.id,
        title: module.title,
        order: module.order,
        lessons,
      });
    });

    // Convert to array format
    return courseIds.map(courseId => ({
      id: courseId,
      title: '', // Will be filled by parent component
      status: '', // Will be filled by parent component
      modules: courseModulesMap.get(courseId) || [],
    }));
  } catch (error) {
    console.error('Error in fetchCourseModules:', error);
    return [];
  }
} 