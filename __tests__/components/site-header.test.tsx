import { render, screen, fireEvent } from '@testing-library/react'
import { SiteHeader } from '@/components/site-header'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

describe('SiteHeader', () => {
  it('renders logo and navigation links', () => {
    render(<SiteHeader />)
    
    // Check if logo is present
    expect(screen.getByAltText('Tabor Digital Academy')).toBeInTheDocument()
    
    // Check if main navigation links are present
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Success Stories')).toBeInTheDocument()
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', () => {
    render(<SiteHeader />)
    
    // Mobile menu should be hidden initially
    expect(screen.queryByRole('navigation', { hidden: true })).not.toBeVisible()
    
    // Click the menu button
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)
    
    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).toBeVisible()
    
    // Click again to close
    fireEvent.click(menuButton)
    
    // Mobile menu should be hidden again
    expect(screen.queryByRole('navigation', { hidden: true })).not.toBeVisible()
  })

  it('renders authentication buttons', () => {
    render(<SiteHeader />)
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('renders language selector dropdown', () => {
    render(<SiteHeader />)
    
    const languageButton = screen.getByRole('button', { name: /language/i })
    expect(languageButton).toBeInTheDocument()
    
    // Click to open dropdown
    fireEvent.click(languageButton)
    
    // Check if language options are present
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('French')).toBeInTheDocument()
    expect(screen.getByText('Swahili')).toBeInTheDocument()
  })
})