import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Course {
  id: number;
  title: string;
  reason: string;
  image: string;
}

interface RecommendationsProps {
  courses: Course[];
  onLearnMore: (id: number) => void;
}

export function Recommendations({ courses, onLearnMore }: RecommendationsProps) {
  if (courses.length === 0) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          role="article"
          className="card-hover gradient-border"
        >
          <div className="relative h-40">
            <Image
              src={course.image}
              alt={course.title}
              fill="true"
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="p-6">
            <h3 className="font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{course.reason}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onLearnMore(course.id)}
            >
              Learn More
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
