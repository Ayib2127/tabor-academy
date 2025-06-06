"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Globe, Menu, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/TaborAcademy Logo.png"
              alt="Tabor Digital Academy"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden font-bold sm:inline-block gradient-text">
              Tabor Digital Academy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          
          {/* Courses Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto font-medium text-sm flex items-center gap-1 hover:text-primary">
                Courses <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/courses/digital-marketing" className="cursor-pointer">
                  Digital Marketing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses/e-commerce" className="cursor-pointer">
                  E-commerce
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses/no-code" className="cursor-pointer">
                  No-Code Development
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses/financial-literacy" className="cursor-pointer">
                  Financial Literacy
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses/entrepreneurship" className="cursor-pointer">
                  Entrepreneurship
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/courses" className="cursor-pointer font-medium">
                  All Courses
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="/success-stories" className="text-sm font-medium transition-colors hover:text-primary">
            Success Stories
          </Link>
          <Link href="/faq" className="text-sm font-medium transition-colors hover:text-primary">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center ml-auto space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>French</DropdownMenuItem>
              <DropdownMenuItem>Swahili</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-2">
            <Link
              href="/about"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Mobile Courses Submenu */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between text-sm hover:bg-accent rounded-md">
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
                  className="block px-4 py-1 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Digital Marketing
                </Link>
                <Link
                  href="/courses/e-commerce"
                  className="block px-4 py-1 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  E-commerce
                </Link>
                <Link
                  href="/courses/no-code"
                  className="block px-4 py-1 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  No-Code Development
                </Link>
                <Link
                  href="/courses/financial-literacy"
                  className="block px-4 py-1 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Financial Literacy
                </Link>
                <Link
                  href="/courses/entrepreneurship"
                  className="block px-4 py-1 text-sm hover:bg-accent rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrepreneurship
                </Link>
              </div>
            </div>
            
            <Link
              href="/pricing"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/success-stories"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Success Stories
            </Link>
            <Link
              href="/faq"
              className="block px-4 py-2 text-sm hover:bg-accent rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="border-t pt-4 mt-4">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="w-full mt-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}