import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock recommendations component
const Recommendations = ({ courses, onLearnMore }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className="card-hover gradient-border">
          <div className="relative h-40">
            <Image
              src={course.image}
              alt={course.title}
              fill
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

describe('Recommendations', () => {
  const mockCourses = [
    {
      id: 1,
      title: "Social Media Marketing Advanced",
      reason: "Based on your interests",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0"
    },
    {
      id: 2,
      title: "E-commerce Analytics",
      reason: "Popular in your field",
      image: "https://images.unsplash.com/photo-1512054502232-10640d5d078c"
    }
  ]

  it('renders recommended courses correctly', () => {
    render(<Recommendations courses={mockCourses} onLearnMore={() => {}} />)
    
    mockCourses.forEach(course => {
      expect(screen.getByText(course.title)).toBeInTheDocument()
      expect(screen.getByText(course.reason)).toBeInTheDocument()
      
      const image = screen.getByAltText(course.title)
      expect(image).toHaveAttribute('src', course.image)
    })
  })

  it('calls onLearnMore with course id when button is clicked', () => {
    const handleLearnMore = jest.fn()
    render(<Recommendations courses={mockCourses} onLearnMore={handleLearnMore} />)
    
    const buttons = screen.getAllByText('Learn More')
    fireEvent.click(buttons[0])
    
    expect(handleLearnMore).toHaveBeenCalledWith(mockCourses[0].id)
  })

  it('applies correct styling to course cards', () => {
    render(<Recommendations courses={mockCourses} onLearnMore={() => {}} />)
    
    const cards = screen.getAllByRole('article')
    cards.forEach(card => {
      expect(card).toHaveClass('card-hover')
      expect(card).toHaveClass('gradient-border')
    })
  })

  it('renders empty state when no recommendations', () => {
    render(<Recommendations courses={[]} onLearnMore={() => {}} />)
    
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
  })
})