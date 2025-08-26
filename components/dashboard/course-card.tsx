import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play } from 'lucide-react'
import Image from 'next/image'
import { withDefault, DEFAULT_BANNER_URL } from "@/lib/defaults";
import { SafeImage } from "@/components/ui/safe-image"

interface Course {
  id: number;
  title: string;
  image: string;
  progress: number;
  nextLesson: string;
  duration: string;
  instructor: string;
}

interface CourseCardProps {
  course: Course;
  onContinue: (id: number) => void;
}

export function CourseCard({ course, onContinue }: CourseCardProps) {
  return (
    <Card className="card-hover gradient-border">
      <div className="relative h-48">
        <SafeImage
          src={course.image}
          alt={course.title}
          fill
          className="object-cover rounded-t-lg"
        />
        <div 
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity"
          data-testid="overlay"
          onMouseEnter={(e) => e.currentTarget.classList.add('opacity-100')}
          onMouseLeave={(e) => e.currentTarget.classList.remove('opacity-100')}
        >
          <button
            onClick={() => onContinue(course.id)}
            className="bg-white/90 text-black hover:bg-white p-3 rounded-lg flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Continue Learning
          </button>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4">{course.title}</h3>
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
            <p className="text-muted-foreground">Progress</p>
            <p className="font-medium">{course.progress}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Up</p>
            <p className="font-medium">{course.nextLesson}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
