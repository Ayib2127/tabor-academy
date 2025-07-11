import { Course, Lesson } from '@/types/course';

/**
 * Aggregates all assignment lessons from an array of courses and provides summary stats.
 * @param courses Array of Course objects
 * @returns Summary: total, dueSoon, needsGrading, urgentAssignments
 */
export function getAssignmentDashboardSummary(courses: Course[]) {
  const assignments: Lesson[] = [];
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  let dueSoon = 0;
  let needsGrading = 0;
  const urgentAssignments: Lesson[] = [];

  for (const course of courses) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.type === 'assignment') {
          assignments.push(lesson);
          // Due soon logic
          if (lesson.dueDate) {
            const due = new Date(lesson.dueDate);
            if (due > now && due <= in7Days) {
              dueSoon++;
              urgentAssignments.push(lesson);
            }
          }
          // Needs grading logic
          if (lesson.needsGrading) {
            needsGrading++;
            if (!urgentAssignments.includes(lesson)) {
              urgentAssignments.push(lesson);
            }
          }
        }
      }
    }
  }

  return {
    total: assignments.length,
    dueSoon,
    needsGrading,
    urgentAssignments,
    assignments,
  };
}

/**
 * Aggregates all assignment lessons from an array of courses.
 * @param courses Array of Course objects
 * @returns Array of assignment lessons (type === 'assignment')
 */
export function getAllAssignmentsFromCourses(courses: Course[]): Lesson[] {
  const assignments: Lesson[] = [];
  for (const course of courses) {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.type === 'assignment') {
          assignments.push(lesson);
        }
      }
    }
  }
  return assignments;
} 