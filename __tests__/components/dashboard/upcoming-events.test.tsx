import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/card'
import { Calendar, Users } from 'lucide-react'
import { describe, it, expect } from '@jest/globals'

interface Event {
  id: number
  title: string
  date: string
  type: 'workshop' | 'mentoring'
}

interface UpcomingEventsProps {
  events: Event[]
}

// Mock upcoming events component
const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  return (
    <Card className="p-6 card-hover gradient-border">
      <h2 className="text-xl font-bold mb-6">Upcoming Events</h2>
      <div className="space-y-6">
        {events.map((event: Event) => (
          <div key={event.id} className="flex items-start gap-4" role="listitem">
            <div className="bg-brand-orange-100 rounded-full p-3" data-testid="event-icon">
              {event.type === "workshop" ? (
                <Users className="h-6 w-6 text-brand-orange-500" />
              ) : (
                <Calendar className="h-6 w-6 text-brand-orange-500" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-brand-orange-500">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

describe('UpcomingEvents', () => {
  const mockEvents: Event[] = [
    {
      id: 1,
      title: "Digital Marketing Workshop",
      date: "Tomorrow, 2 PM",
      type: "workshop" as const
    },
    {
      id: 2,
      title: "Mentor Session",
      date: "Friday, 10 AM",
      type: "mentoring" as const
    }
  ]

  it('renders events list correctly', () => {
    render(<UpcomingEvents events={mockEvents} />)
    
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    
    mockEvents.forEach(event => {
      expect(screen.getByText(event.title)).toBeInTheDocument()
      expect(screen.getByText(event.date)).toBeInTheDocument()
    })
  })

  it('displays correct icons for different event types', () => {
    render(<UpcomingEvents events={mockEvents} />)
    
    const icons = screen.getAllByTestId('event-icon')
    
    // Workshop event should have Users icon
    expect(icons[0].firstChild).toHaveClass('lucide-users')
    
    // Mentoring event should have Calendar icon
    expect(icons[1].firstChild).toHaveClass('lucide-calendar')
  })

  it('applies correct styling to event items', () => {
    render(<UpcomingEvents events={mockEvents} />)
    
    const eventItems = screen.getAllByRole('listitem')
    eventItems.forEach(item => {
      expect(item).toHaveClass('flex')
      expect(item).toHaveClass('items-start')
      expect(item).toHaveClass('gap-4')
    })
  })

  it('renders empty state when no events', () => {
    render(<UpcomingEvents events={[]} />)
    
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })
})