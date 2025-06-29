'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Globe, Menu, ChevronDown, User, LogOut, HelpCircle, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function SiteHeader() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Dark mode functionality
  useEffect(() => {
    // Check for saved dark mode preference or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedDarkMode ? JSON.parse(savedDarkMode) : systemDarkMode;
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Helper function to get the correct dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) {
      return '/dashboard';
    }

    const role = user.user_metadata?.role;

    switch (role) {
      case 'admin':
        return '/dashboard/admin';
      case 'instructor':
        return '/dashboard/instructor';
      case 'mentor':
        return '/dashboard/mentor';
      case 'student': // Explicitly define student role if it exists
      default:
        return '/dashboard'; // Fallback for 'student' or any other undefined role
    }
  };

  // Smooth scroll function for anchor links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMobileMenuOpen(false);
  };

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
          <Link 
            href="/#partners" 
            className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]"
            onClick={(e) => handleSmoothScroll(e, 'partners')}
          >
            For Partners
          </Link>
          
          <Link 
            href="/about" 
            className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]"
          >
            About
          </Link>
          
          {/* Courses Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto font-medium text-sm flex items-center gap-1 text-[#2C3E50] hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]">
                Courses <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 border-[#E5E8E8] shadow-sm">
              <div className="p-2">
                <div className="grid gap-1">
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/digital-marketing" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">Digital Marketing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/no-code-development" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">No-Code Development</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/e-commerce" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">E-commerce</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/ai-tools" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">AI Tools</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/civil-engineering" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">Civil Engineering</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/financial-literacy" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">Financial Literacy</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/entrepreneurship" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">Entrepreneurship</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                    <Link href="/courses/freelancing" className="cursor-pointer flex items-center gap-2">
                      <span className="text-[#2C3E50] dark:text-white">Freelancing</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-2 bg-[#E5E8E8]" />
                <DropdownMenuItem asChild className="focus:bg-[#4ECDC4]/10 focus:text-[#4ECDC4] rounded-md">
                  <Link 
                    href="/courses" 
                    className="cursor-pointer font-medium flex items-center gap-2"
                  >
                    <span className="text-[#2C3E50] dark:text-white">All Courses</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            href="/#pricing" 
            className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]"
            onClick={(e) => handleSmoothScroll(e, 'pricing')}
          >
            Pricing
          </Link>
          <Link 
            href="/#success-stories" 
            className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]"
            onClick={(e) => handleSmoothScroll(e, 'success-stories')}
          >
            Success Stories
          </Link>

          {/* FAQs Link */}
          <Link 
            href="/faqs" 
            className="text-sm font-medium text-[#2C3E50] transition-colors hover:text-[#4ECDC4] flex items-center gap-1 dark:text-white dark:hover:text-[#4ECDC4]"
          >
            <HelpCircle className="w-4 h-4" />
            FAQs
          </Link>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-[#2C3E50] dark:text-white" />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              className="data-[state=checked]:bg-[#4ECDC4]"
            />
            <Moon className="h-4 w-4 text-[#2C3E50] dark:text-white" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-[#2C3E50] hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]"
                aria-label="Language"
              >
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
                <Button variant="ghost" size="icon" className="rounded-full text-[#2C3E50] hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]">
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
              <Button variant="ghost" asChild className="text-[#2C3E50] hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white" asChild>
                <Link href="/signup">Start Learning Free</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#2C3E50] hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-[#E5E8E8]" aria-label="Mobile Navigation">
          <div className="container py-4 space-y-2">
            <Link
              href="/#partners"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
              onClick={(e) => handleSmoothScroll(e, 'partners')}
            >
              For Partners
            </Link>
            
            <Link
              href="/about"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
            >
              About
            </Link>
            
            {/* Mobile Courses Submenu */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]">
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
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Digital Marketing
                </Link>
                <Link
                  href="/courses/no-code-development"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  No-Code Development
                </Link>
                <Link
                  href="/courses/e-commerce"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  E-commerce
                </Link>
                <Link
                  href="/courses/ai-tools"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Tools
                </Link>
                <Link
                  href="/courses/civil-engineering"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Civil Engineering
                </Link>
                <Link
                  href="/courses/financial-literacy"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Financial Literacy
                </Link>
                <Link
                  href="/courses/entrepreneurship"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrepreneurship
                </Link>
                <Link
                  href="/courses/freelancing"
                  className="block px-4 py-1 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Freelancing
                </Link>
              </div>
            </div>

            <Link
              href="/#pricing"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
              onClick={(e) => handleSmoothScroll(e, 'pricing')}
            >
              Pricing
            </Link>
            <Link
              href="/#success-stories"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md dark:text-white dark:hover:text-[#4ECDC4]"
              onClick={(e) => handleSmoothScroll(e, 'success-stories')}
            >
              Success Stories
            </Link>

            {/* Mobile FAQs Link */}
            <Link
              href="/faqs"
              className="block px-4 py-2 text-sm text-[#2C3E50] hover:bg-[#4ECDC4]/10 hover:text-[#4ECDC4] rounded-md flex items-center gap-2 dark:text-white dark:hover:text-[#4ECDC4]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HelpCircle className="w-4 h-4" />
              FAQs
            </Link>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="pt-4 space-y-2">
                <Button variant="ghost" asChild className="w-full text-[#2C3E50] hover:text-[#4ECDC4] dark:text-white dark:hover:text-[#4ECDC4]">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white" asChild>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Start Learning Free</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}