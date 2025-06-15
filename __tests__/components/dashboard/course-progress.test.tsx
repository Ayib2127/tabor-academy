import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'
import { describe, it, expect } from '@jest/globals'
import { CourseProgress } from '@/components/dashboard/course-progress'

// Mock course progress component
/*const CourseProgress = ({ course }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{course.title}</h3>
        <span className="text-sm text-muted-foreground">{course.progress}%</span>
      </div>
      <Progress value={course.progress} className="mb-4" />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Lessons Completed</p>
          <p className="font-medium">{course.lessonsCompleted}/{course.totalLessons}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Time Invested</p>
          <p className="font-medium">{course.timeInvested}</p>
        </div>
      </div>
    </div>
  )
}
*/
describe('CourseProgress', () => {
  const mockCourse = {
    title: 'Digital Marketing Mastery',
    progress: 75,
    lessonsCompleted: 15,
    totalLessons: 20,
    timeInvested: '12.5 hrs'
  }

  it('renders course progress information correctly', () => {
    render(<CourseProgress course={mockCourse} />)
    
    expect(screen.getByText(mockCourse.title)).toBeInTheDocument()
    expect(screen.getByText(`${mockCourse.progress}%`)).toBeInTheDocument()
    expect(screen.getByText(`${mockCourse.lessonsCompleted}/${mockCourse.totalLessons}`)).toBeInTheDocument()
    expect(screen.getByText(mockCourse.timeInvested)).toBeInTheDocument()
  })

  it('displays progress bar with correct value', () => {
    render(<CourseProgress course={mockCourse} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', mockCourse.progress.toString())
  })

  it('shows correct lesson completion status', () => {
    render(<CourseProgress course={mockCourse} />)
    
    expect(screen.getByText('Lessons Completed')).toBeInTheDocument()
    const completionText = screen.getByText(`${mockCourse.lessonsCompleted}/${mockCourse.totalLessons}`)
    expect(completionText).toBeInTheDocument()
  })

  it('displays time investment information', () => {
    render(<CourseProgress course={mockCourse} />)
    
    expect(screen.getByText('Time Invested')).toBeInTheDocument()
    expect(screen.getByText(mockCourse.timeInvested)).toBeInTheDocument()
  })
})