import { Card } from '@/components/ui/card'
import { Brain, Trophy, Star, Target } from 'lucide-react'

interface Stats {
  learningHours: number;
  learningTrend: string;
  coursesCompleted: number;
  coursesTrend: string;
  achievementPoints: number;
  achievementTrend: string;
  nextMilestone: string;
  milestoneDue: string;
}

interface QuickStatsProps {
  stats: Stats;
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card role="article" className="p-6 card-hover gradient-border">
        <div className="flex items-center gap-4">
          <div className="bg-brand-orange-100 rounded-full p-3" data-testid="icon-container">
            <Brain className="h-6 w-6 text-brand-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Learning Hours</p>
            <p className="text-2xl font-bold">{stats.learningHours}</p>
            <p className="text-sm text-green-500">{stats.learningTrend}</p>
          </div>
        </div>
      </Card>

      <Card role="article" className="p-6 card-hover gradient-border">
        <div className="flex items-center gap-4">
          <div className="bg-brand-orange-100 rounded-full p-3" data-testid="icon-container">
            <Trophy className="h-6 w-6 text-brand-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Courses Completed</p>
            <p className="text-2xl font-bold">{stats.coursesCompleted}</p>
            <p className="text-sm text-green-500">{stats.coursesTrend}</p>
          </div>
        </div>
      </Card>

      <Card role="article" className="p-6 card-hover gradient-border">
        <div className="flex items-center gap-4">
          <div className="bg-brand-orange-100 rounded-full p-3" data-testid="icon-container">
            <Star className="h-6 w-6 text-brand-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Achievement Points</p>
            <p className="text-2xl font-bold">{stats.achievementPoints}</p>
            <p className="text-sm text-green-500">{stats.achievementTrend}</p>
          </div>
        </div>
      </Card>

      <Card role="article" className="p-6 card-hover gradient-border">
        <div className="flex items-center gap-4">
          <div className="bg-brand-orange-100 rounded-full p-3" data-testid="icon-container">
            <Target className="h-6 w-6 text-brand-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next Milestone</p>
            <p className="text-2xl font-bold">{stats.nextMilestone}</p>
            <p className="text-sm text-green-500">{stats.milestoneDue}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}