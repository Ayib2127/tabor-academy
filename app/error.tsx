"use client"

import { useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  AlertCircle,
  RefreshCcw,
  ChevronLeft,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  Smartphone,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Error Communication Section */}
            <div className="space-y-4">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Something went wrong on our end
              </h1>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                We're experiencing some technical difficulties. Our team has been notified and is working to fix the issue. We apologize for any inconvenience.
              </p>
            </div>

            {/* Immediate Action Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => reset()}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => window.history.back()}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>

            {/* Alternative Access Section */}
            <Card className="w-full max-w-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Alternative Ways to Continue Learning</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-accent">
                  <Smartphone className="h-6 w-6 mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Mobile App</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Access your courses through our mobile app
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/mobile">Download App</Link>
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-accent">
                  <Clock className="h-6 w-6 mb-2 text-primary" />
                  <h3 className="font-medium mb-1">Offline Content</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Access your downloaded materials
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/downloads">View Downloads</Link>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Status & Support Section */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Course Access</span>
                    <span className="flex items-center text-yellow-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Degraded
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mobile App</span>
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Operational
                    </span>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/status">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Status Page
                    </Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Contact Support</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="tel:+254700000000">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="mailto:support@taboracademy.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Support
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/chat">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Live Chat
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}