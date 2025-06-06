import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/card'
import { Zap, Star } from 'lucide-react'

// Mock achievements list component
const AchievementsList = ({ achievements }) => {
  return (
    <Card className="p-6 card-hover gradient-border">
      <h2 className="text-xl font-bold mb-6">Recent Achievements</h2>
      <div className="space-y-6">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="flex items-start gap-4">
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
          </div>
        ))}
      </div>
    </Card>
  )
}

describe('AchievementsList', () => {
  const mockAchievements = [
    {
      id: 1,
      title: 'Fast Learner',
      description: 'Completed 3 lessons in one day',
      icon: 'zap',
      date: 'Today'
    },
    {
      id: 2,
      title: 'Perfect Score',
      description: '100% on Marketing Quiz',
      icon: 'star',
      date: 'Yesterday'
    }
  ]

  it('renders achievements correctly', () => {
    render(<AchievementsList achievements={mockAchievements} />)
    
    expect(screen.getByText('Recent Achievements')).toBeInTheDocument()
    
    mockAchievements.forEach(achievement => {
      expect(screen.getByText(achievement.title)).toBeInTheDocument()
      expect(screen.getByText(achievement.description)).toBeInTheDocument()
      expect(screen.getByText(achievement.date)).toBeInTheDocument()
    })
  })

  it('renders correct icons for achievements', () => {
    render(<AchievementsList achievements={mockAchievements} />)
    
    const icons = screen.getAllByTestId('achievement-icon')
    expect(icons).toHaveLength(mockAchievements.length)
    
    // First achievement should have Zap icon
    expect(icons[0]).toHaveClass('lucide-zap')
    
    // Second achievement should have Star icon
    expect(icons[1]).toHaveClass('lucide-star')
  })

  it('applies correct styling to achievement items', () => {
    render(<AchievementsList achievements={mockAchievements} />)
    
    const achievementItems = screen.getAllByRole('listitem')
    achievementItems.forEach(item => {
      expect(item).toHaveClass('flex')
      expect(item).toHaveClass('items-start')
      expect(item).toHaveClass('gap-4')
    })
    
    const iconContainers = screen.getAllByTestId('icon-container')
    iconContainers.forEach(container => {
      expect(container).toHaveClass('bg-brand-orange-100')
      expect(container).toHaveClass('rounded-full')
      expect(container).toHaveClass('p-3')
    })
  })
})