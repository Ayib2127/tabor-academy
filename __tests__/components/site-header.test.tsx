import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { describe, it, expect, jest } from '@jest/globals'

// Mock Supabase client used in components
// Mock Supabase client BEFORE importing component
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => ({ data: { session: null }, error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } }, error: null })),
      signOut: jest.fn(),
    },
  },
}));

import { SiteHeader } from '@/components/site-header'

// Utility to set viewport width for responsive behaviour in tests
function setViewportWidth(width: number) {
  (window as any).innerWidth = width;
  window.dispatchEvent(new Event('resize'));
}

// Mock next/link
jest.mock('next/link', () => ({ __esModule: true, default: (props: any) => {
  const { href, children, ...rest } = props
  return <a href={href} {...rest}>{children}</a>
}}));

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
    setViewportWidth(1024);
    render(<SiteHeader />)
    
    // Check if logo is present
    expect(screen.getByAltText('Tabor Academy')).toBeInTheDocument()
    
    // Check if main navigation links are present
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Courses')).toBeInTheDocument()
    expect(screen.getByText('Success Stories')).toBeInTheDocument()
    expect(screen.getByText('FAQs')).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', async () => {
    setViewportWidth(500);
    render(<SiteHeader />)
    
    // Only the desktop nav (hidden) should be rendered initially
    expect(screen.getAllByRole('navigation', { hidden: true }).length).toBe(1)
    
    // Click the menu button
    const menuButton = screen.getAllByRole('button').find(btn => btn.querySelector('svg.lucide-menu')) as HTMLElement
    fireEvent.click(menuButton)
    
    // Mobile menu should now be rendered (two nav elements total)
    await waitFor(() => {
      const navsAfterOpen = screen.getAllByRole('navigation', { hidden: true })
      expect(navsAfterOpen.length).toBe(2)
    });
    
    
    // Click again to close
    fireEvent.click(menuButton)
    
    // Mobile menu should be removed (back to single nav)
    await waitFor(() => {
      expect(screen.getAllByRole('navigation', { hidden: true }).length).toBe(1)
    });
  })

  it('renders authentication buttons', async () => {
    setViewportWidth(1024);
    render(<SiteHeader />)
    
    await waitFor(async () => {
      expect(await screen.findByRole('link', { name: /login/i })).toBeInTheDocument()
      expect(await screen.findByRole('link', { name: /start learning free/i })).toBeInTheDocument()
    });
  })

  it('renders language selector dropdown', async () => {
    setViewportWidth(1024);
    render(<SiteHeader />)
    
    const languageButton = await screen.findByRole('button', { name: /language/i })
    expect(languageButton).toBeInTheDocument()
    
    // Open the dropdown using realistic user click
    await userEvent.pointer({ keys: '[MouseLeft]', target: languageButton })
    
    // Check if language options are present (they are rendered in a portal)
    expect(await screen.findByText('English')).toBeInTheDocument()
    expect(await screen.findByText('French')).toBeInTheDocument()
    expect(await screen.findByText('Swahili')).toBeInTheDocument()
  })
})