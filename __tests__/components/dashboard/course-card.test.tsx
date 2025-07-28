import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CourseCard } from '@/components/dashboard/course-card'
import { describe, it, expect, jest } from '@jest/globals'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} style={{ position: 'absolute', height: '100%', width: '100%' }} />
  },
}))

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
    expect(image).toHaveAttribute('alt', mockCourse.title)
    // Optionally, you can check that the src attribute exists:
    expect(image).toHaveAttribute('src')
  })

  it('shows continue button on hover', async () => {
    render(<CourseCard course={mockCourse} onContinue={() => {}} />)
    
    const overlay = screen.getByTestId('overlay')
    expect(overlay).toHaveClass('opacity-0')
    
    // Simulate hover
    fireEvent.mouseEnter(overlay)
    // Wait for the transition
    await waitFor(() => {
      expect(overlay).toHaveClass('opacity-100')
    });
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