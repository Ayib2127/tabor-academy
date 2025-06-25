export function calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0;
    if (completed >= total) return 100;
    return Math.round((completed / total) * 100);
  }
  
  export function getCompletionStatus(progress: number): 'not-started' | 'in-progress' | 'completed' {
    if (progress <= 0) return 'not-started';
    if (progress >= 100) return 'completed';
    return 'in-progress';
  }