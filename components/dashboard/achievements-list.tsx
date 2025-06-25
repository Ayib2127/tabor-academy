// project/components/dashboard/achievements-list.tsx
import { Card } from '@/components/ui/card'
import { Zap, Star } from 'lucide-react'

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: 'zap' | 'star';
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <Card className="p-6 card-hover gradient-border">
      <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
      <ul className="space-y-6">
        {achievements.map((achievement) => (
          <li key={achievement.id} className="flex items-start gap-4">
            <div className="bg-brand-orange-100 rounded-full p-3" data-testid="icon-container">
              {achievement.icon === 'zap' ? (
                <Zap className="h-6 w-6 text-brand-orange-500" data-testid="achievement-icon" />
              ) : (
                <Star className="h-6 w-6 text-brand-orange-500" data-testid="achievement-icon" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              <p className="text-sm text-brand-orange-500">{achievement.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}