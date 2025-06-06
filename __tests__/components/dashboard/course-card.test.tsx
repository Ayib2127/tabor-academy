import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Play } from 'lucide-react'
import Image from 'next/image'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock course card component
const CourseCard = ({ course, onContinue }) => {
  return (
    <Card className="card-hover gradient-border">
      <div className="relative h-48">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
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
        <Progress value={course.progress} className="mb-4" />
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

describe('CourseCard', () => {
  const mockCourse = {
    id: 1,
    title: 'Digital Marketing Fundamentals',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    progress: 65,
    nextLesson: 'Social Media Strategy',
    duration: '45 mins',
    instructor: 'John Smith'
  }

  it('renders course information correctly', () => {
    render(<CourseCard course={mockCourse} onContinue={() => {}} />)
    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument()
    expect(screen.getByText(`${mockCourse.progress}%`)).toBeInTheDocument()
    expect(screen.getByText(mockCourse.nextLesson)).toBeInTheDocument()
    
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', mockCourse.image)
    expect(image).toHaveAttribute('alt', mockCourse.title)
  })

  it('shows continue button on hover', async () => {
    render(<CourseCard course={mockCourse} onContinue={() => {}} />)
    
    const overlay = screen.getByText('Continue Learning').parentElement
    expect(overlay).toHaveClass('opacity-0')
    
    // Simulate hover
    fireEvent.mouseEnter(overlay)
    expect(overlay).toHaveClass('opacity-100')
  })

  it('calls onContinue with course id when continue button is clicked', () => {
    const handleContinue = jest.fn()
    render(<CourseCard course={mockCourse} onContinue={handleContinue} />)
    
    const continueButton = screen.getByText('Continue Learning')
    fireEvent.click(continueButton)
    
    expect(handleContinue).toHaveBeenCalledWith(mockCourse.id)
  })

  it('displays progress bar correctly', () => {
    render(<CourseCard course={mockCourse} onContinue={() => {}} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', mockCourse.progress.toString())
  })
})