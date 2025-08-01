import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { SiteFooter } from '@/components/site-footer'
import { describe, it, expect } from '@jest/globals'

describe('SiteFooter', () => {
  it('renders company information', () => {
    render(<SiteFooter />)
    
    expect(screen.getByText('Tabor Academy')).toBeInTheDocument()
    expect(screen.getByText(/empowering entrepreneurs/i)).toBeInTheDocument()
  })

  it('renders quick links section', () => {
    render(<SiteFooter />)
    
    const links = [
      'About Us',
      'All Courses',
      'Success Stories',
      'Blog'
    ]
    links.forEach(link => {
      // Use getByRole to ensure we're only matching links
      expect(screen.getByRole('link', { name: link })).toBeInTheDocument()
    })
  })

  it('renders contact information', () => {
    render(<SiteFooter />)
    
    expect(screen.getByText('academy@tabordigital.com')).toBeInTheDocument()
    expect(screen.getByText('+251936747488')).toBeInTheDocument()
    expect(screen.getByText('Addis Ababa, Ethiopia')).toBeInTheDocument()
  })

  it('renders newsletter subscription form', () => {
    render(<SiteFooter />)
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i })
    
    expect(emailInput).toBeInTheDocument()
    expect(subscribeButton).toBeInTheDocument()
  })

  it('handles newsletter subscription', () => {
    render(<SiteFooter />)
    
    const emailInput = screen.getByPlaceholderText(/enter your email/i)
    const subscribeButton = screen.getByRole('button', { name: /subscribe/i })
    
    // Fill in email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    // Submit form
    fireEvent.click(subscribeButton)
    
    // Add assertions for form submission handling when implemented
  })

  it('renders social media links', () => {
    render(<SiteFooter />)
    
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /twitter/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
  })

  it('renders legal links', () => {
    render(<SiteFooter />)
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
  })
})