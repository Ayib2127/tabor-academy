"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Send, Heart, Shield, Award, Users, Globe, Zap } from "lucide-react"
import { SafeImage } from "@/components/ui/safe-image"

export function SiteFooter() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Newsletter signup logic would go here
  }

  return (
    <footer className="bg-gradient-to-br from-[#2C3E50] via-[#1B4D3E] to-[#2C3E50] text-white relative overflow-hidden" suppressHydrationWarning>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#4ECDC4]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#FF6B35]/10 rounded-full blur-3xl" />

      <div className="container py-16 md:py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
          
          {/* Company Info - Spans 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <SafeImage
                src="/logo.jpg"
                alt="Tabor Academy"
                width={50}
                height={50}
                className="rounded-lg group-hover:scale-105 transition-transform"
              />
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent group-hover:from-[#4ECDC4] group-hover:to-[#FF6B35] transition-colors">
                  Tabor Academy
                </h3>
                <p className="text-white/70 text-sm">The Skills to Build. The Tools to Launch. Your Business Starts Here!</p>
              </div>
            </Link>
            
            {/* Mission Statement */}
            <p className="text-white/80 leading-relaxed max-w-md">
              Empowering entrepreneurs with mobile-first, project-based education. 
              We combine cutting-edge technology with deep understanding of Ethiopian markets 
              to deliver practical, affordable, and accessible entrepreneurial education.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-[#4ECDC4]">10K+</div>
                <div className="text-xs text-white/70">Active Students</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-[#FF6B35]">15+</div>
                <div className="text-xs text-white/70">Countries</div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link href="https://facebook.com" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#4ECDC4] transition-colors group">
                  <Facebook className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="https://t.me/tabor_academy" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#4ECDC4] transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white group-hover:scale-110 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 3.75l-3.75 16.5-5.25-4.5-3.75 3-1.5-6.75 14.25-8.25z" />
                  </svg>
                  <span className="sr-only">Telegram</span>
                </Link>
                <Link href="https://www.linkedin.com/company/taboracademy-official" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#4ECDC4] transition-colors group">
                  <Linkedin className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF6B35]" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { text: "About Us", href: "/about" },
                { text: "All Courses", href: "/courses" },
                { text: "Success Stories", href: "/success-stories" },
                { text: "For Partners", href: "/partners" },
                { text: "Become Instructor", href: "/instructor", highlight: true },
                { text: "Community", href: "https://t.me/tabor_academy" }
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className={
                      link.highlight
                        ? "font-semibold text-[#FF6B35] hover:text-[#4ECDC4] transition-colors text-sm"
                        : "text-white/70 hover:text-[#4ECDC4] transition-colors text-sm flex items-center gap-2 group"
                    }
                  >
                    {!link.highlight && (
                      <span className="w-1 h-1 bg-[#4ECDC4] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    )}
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#4ECDC4]" />
              Support
            </h4>
            <ul className="space-y-3">
              {[
                { text: "Help Center", href: "/help" },
                { text: "FAQs", href: "/faqs" },
                { text: "Contact Support", href: "/contact" },
                { text: "Live Chat", href: "https://t.me/tabor_support" }
              ].map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#4ECDC4] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#4ECDC4] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#FF6B35]" />
              Stay Updated
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <Mail className="h-4 w-4 text-[#4ECDC4]" />
                <span>academy@tabordigital.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <Phone className="h-4 w-4 text-[#4ECDC4]" />
                <span>+251936747488</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 text-[#4ECDC4]" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                Get weekly entrepreneurship tips, course updates, and success stories delivered to your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 pr-12"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="absolute right-1 top-1 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white border-0 h-8 px-3"
                  >
                    <Send className="w-3 h-3" />
                    <span className="sr-only">Subscribe</span>
                  </Button>
                </div>
                <p className="text-xs text-white/50">
                  Join 5,000+ entrepreneurs. Unsubscribe anytime.
                </p>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Shield className="w-3 h-3" />
                <span>Your data is secure with us</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <Award className="w-3 h-3" />
                <span>Trusted by 10,000+ students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-12 bg-white/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-white/60">
            <p>© {new Date().getFullYear()} Tabor Academy. All rights reserved.</p>
          </div>

          {/* Centered Made By Link */}
          <div className="flex items-center justify-center text-sm">
            <span className="text-white/60">Made by </span>
            <a
              href="https://www.tabordigital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent hover:from-[#4ECDC4] hover:to-[#FF6B35] transition-colors duration-300 flex items-center"
              style={{marginLeft: 0, paddingLeft: 0}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline align-middle" style={{marginRight: '2px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
              Tabor Digital Solutions
            </a>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-white/60 hover:text-[#4ECDC4] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/60 hover:text-[#4ECDC4] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-white/60 hover:text-[#4ECDC4] transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}