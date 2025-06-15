import { Progress } from '@/components/ui/progress'

interface CourseProgressProps {
  course: {
    title: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    timeInvested: string;
  };
}

export function CourseProgress({ course }: CourseProgressProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{course.title}</h3>
        <span className="text-sm text-muted-foreground">{course.progress}%</span>
      </div>
      <Progress 
        value={course.progress} 
        className="mb-4"
        role="progressbar"
        aria-valuenow={course.progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Lessons Completed</p>
          <p className="font-medium">{course.lessonsCompleted}/{course.totalLessons}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Time Invested</p>
          <p className="font-medium">{course.timeInvested}</p>
        </div>
      </div>
    </div>
  )
}