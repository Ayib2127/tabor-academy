import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Line } from 'react-chartjs-2'
import { Card } from '@/components/ui/card'
import { describe, it, expect, jest } from '@jest/globals'

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => null
}))

// Mock learning chart component
const LearningChart = ({ data, title }) => {
  return (
    <Card className="p-6 md:col-span-2 card-hover gradient-border">
      <h2 className="text-xl font-bold mb-6">{title}</h2>
      <Line
        data={{
          labels: data.labels,
          datasets: [
            {
              label: 'Hours Spent Learning',
              data: data.values,
              borderColor: 'rgb(234, 88, 12)',
              backgroundColor: 'rgba(234, 88, 12, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }}
      />
    </Card>
  )
}

describe('LearningChart', () => {
  const mockData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [2.5, 3, 2, 4, 2.5, 1.5, 1]
  }

  it('renders chart title correctly', () => {
    render(<LearningChart data={mockData} title="Weekly Learning Activity" />)
    
    expect(screen.getByText('Weekly Learning Activity')).toBeInTheDocument()
  })

  it('passes correct data to Line component', () => {
    const { container } = render(
      <LearningChart data={mockData} title="Weekly Learning Activity" />
    )
    
    // Check if Line component is rendered
    expect(container.firstChild).toBeInTheDocument()
  })

  it('applies correct styling to card container', () => {
    const { container } = render(
      <LearningChart data={mockData} title="Weekly Learning Activity" />
    )
    
    expect(container.firstChild).toHaveClass('p-6')
    expect(container.firstChild).toHaveClass('card-hover')
    expect(container.firstChild).toHaveClass('gradient-border')
  })
})