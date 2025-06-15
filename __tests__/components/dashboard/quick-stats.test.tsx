import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/card'
import { Brain, Trophy, Star, Target } from 'lucide-react'
import { describe, it, expect } from '@jest/globals'

interface Stats {
  learningHours: number
  learningTrend: string
  coursesCompleted: number
  coursesTrend: string
  achievementPoints: number
  achievementTrend: string
  nextMilestone: string
  milestoneDue: string
}

interface QuickStatsProps {
  stats: Stats
}

// Mock stats component that represents the quick stats section
const QuickStats = ({ stats }: QuickStatsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-brand-orange-100 rounded-full p-3">
            <Brain className="h-6 w-6 text-brand-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Learning Hours</p>
            <p className="text-2xl font-bold">{stats.learningHours}</p>
            <p className="text-sm text-green-500">{stats.learningTrend}</p>
          </div>
        </div>
      </Card>
      {/* Additional stat cards */}
    </div>
  )
}

describe('QuickStats', () => {
  const mockStats = {
    learningHours: 45,
    learningTrend: '+5 this week',
    coursesCompleted: 3,
    coursesTrend: '1 in progress',
    achievementPoints: 850,
    achievementTrend: 'Top 10%',
    nextMilestone: 'Complete Advanced Marketing',
    milestoneDue: '2 days left'
  }

  it('renders all stat cards with correct data', () => {
    render(<QuickStats stats={mockStats} />)
    
    // Check learning hours card
    expect(screen.getByText('Learning Hours')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('+5 this week')).toBeInTheDocument()

    // Check courses card
    expect(screen.getByText('Courses Completed')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('1 in progress')).toBeInTheDocument()

    // Check achievements card
    expect(screen.getByText('Achievement Points')).toBeInTheDocument()
    expect(screen.getByText('850')).toBeInTheDocument()
    expect(screen.getByText('Top 10%')).toBeInTheDocument()

    // Check milestone card
    expect(screen.getByText('Next Milestone')).toBeInTheDocument()
    expect(screen.getByText('Complete Advanced Marketing')).toBeInTheDocument()
    expect(screen.getByText('2 days left')).toBeInTheDocument()
  })

  it('applies correct styling to stat cards', () => {
    render(<QuickStats stats={mockStats} />)
    
    // Check if cards have the correct classes
    const cards = screen.getAllByRole('article')
    cards.forEach(card => {
      expect(card).toHaveClass('p-6')
      expect(card).toHaveClass('card-hover')
      expect(card).toHaveClass('gradient-border')
    })

    // Check icon containers
    const iconContainers = screen.getAllByTestId('icon-container')
    iconContainers.forEach(container => {
      expect(container).toHaveClass('rounded-full')
      expect(container).toHaveClass('p-3')
    })
  })
})