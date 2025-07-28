export function isLessonLocked(modules, lessonId) {
  // Find the module and index of the lesson
  let lessonModuleIdx = -1;
  modules.forEach((mod, idx) => {
    if (mod.lessons.some(l => l.id === lessonId)) lessonModuleIdx = idx;
  });
  if (lessonModuleIdx === -1) return true; // Not found, lock by default

  // If any previous module has an incomplete lesson, lock
  for (let i = 0; i < lessonModuleIdx; i++) {
    if (modules[i].lessons.some(l => !l.completed)) return true;
  }
  return false;
} 