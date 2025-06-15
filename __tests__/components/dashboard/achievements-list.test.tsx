import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { AchievementsList } from '@/components/dashboard/achievements-list'
import { describe, it, expect } from '@jest/globals'

describe('AchievementsList', () => {
  const mockAchievements = [
    {
      id: '1',
      title: 'Fast Learner',
      description: 'Completed 3 lessons in one day',
      icon: 'zap' as const,
      date: 'Today'
    },
    {
      id: '2',
      title: 'Perfect Score',
      description: '100% on Marketing Quiz',
      icon: 'star' as const,
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