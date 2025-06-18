"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Globe, Menu, ChevronDown, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)
    }
    
    checkAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Helper function to get the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) {
      return '/dashboard'
    }

    const role = user.user_metadata?.role

    switch (role) {
      case 'admin':
        return '/dashboard/admin'
      case 'instructor':
        return '/dashboard/instructor'
      case 'mentor':
        return '/dashboard/mentor'
      case 'student': // Explicitly define student role if it exists
      default:
        return '/dashboard' // Fallback for 'student' or any other undefined role
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.jpg"
              alt="Tabor Digital Academy"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
              Tabor Digital Academy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link href="/about" className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4]">
            About
          </Link>
          
          {/* Courses Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto font-medium text-sm flex items-center gap-1 text-[#2C3E50] hover:text-[#4ECDC4]">
                Courses <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 border-[#E5E8E8] shadow-sm">
              <div className="p-2">
                <div className="grid gap-1">
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/digital-marketing" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">Digital Marketing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/no-code-development" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">No-Code Development</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/e-commerce" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">E-commerce</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/ai-tools" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">AI Tools</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/civil-engineering" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">Civil Engineering</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/financial-literacy" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">Financial Literacy</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/entrepreneurship" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">Entrepreneurship</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/freelancing" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50]">Freelancing</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-2 bg-[#E5E8E8]" />
                <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                  <Link href="/courses" className="cursor-pointer font-medium flex items-center gap-2">
                    <span className="text-[#2C3E50]">All Courses</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/pricing" className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4]">
            Pricing
          </Link>
          <Link href="/success-stories" className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4]">
            Success Stories
          </Link>
          <Link href="/faq" className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4]">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#2C3E50] hover:text-[#4ECDC4]">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-[#E5E8E8] shadow-sm">
              <DropdownMenuItem className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4]">English</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4]">French</DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4]">Swahili</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {loading ? (
            <div className="h-9 w-9 rounded-full bg-[#E5E8E8] animate-pulse"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-[#2C3E50] hover:text-[#4ECDC4]">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-[#E5E8E8] shadow-sm">
                <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4]">
                  <Link href={getDashboardPath()}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4]">
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4]">
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E5E8E8]" />
                <DropdownMenuItem onClick={handleSignOut} className="focus:bg-red-50 focus:text-red-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild className="text-[#2C3E50] hover:text-[#4ECDC4]">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#2C3E50] hover:text-[#4ECDC4]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E8E8]">
          <div className="container py-4 space-y-2">
            <Link
              href="/about"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Mobile Courses Submenu */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md">
                <Link
                  href="/courses"
                  className="block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="pl-4 mt-2 space-y-1">
                <Link
                  href="/courses/digital-marketing"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Digital Marketing
                </Link>
                <Link
                  href="/courses/no-code-development"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  No-Code Development
                </Link>
                <Link
                  href="/courses/e-commerce"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  E-commerce
                </Link>
                <Link
                  href="/courses/ai-tools"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Tools
                </Link>
                <Link
                  href="/courses/civil-engineering"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Civil Engineering
                </Link>
                <Link
                  href="/courses/financial-literacy"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Financial Literacy
                </Link>
                <Link
                  href="/courses/entrepreneurship"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrepreneurship
                </Link>
                <Link
                  href="/courses/freelancing"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Freelancing
                </Link>
              </div>
            </div>

            <Link
              href="/pricing"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/success-stories"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Success Stories
            </Link>
            <Link
              href="/faq"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}