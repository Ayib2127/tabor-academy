"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Wifi,
  WifiOff,
  RefreshCcw,
  Smartphone,
  Download,
  Signal,
  Gauge,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  Globe,
  BookOpen,
  PenTool
} from "lucide-react"
import Link from "next/link"

export default function NetworkErrorPage() {
  const [isOnline, setIsOnline] = useState(true)
  const [networkType, setNetworkType] = useState<string>("unknown")
  const [signalStrength, setSignalStrength] = useState<number>(0)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get connection info if available
    if ('connection' in navigator) {
      const conn = (navigator as any).connection
      setNetworkType(conn.effectiveType || 'unknown')
      setSignalStrength(conn.downlink || 0)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleConnectivityCheck = async () => {
    setIsChecking(true)
    try {
      // Simulate connectivity check
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsChecking(false)
    } catch (error) {
      setIsChecking(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Network Status */}
            <div className="space-y-4">
              <div className={`rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center ${
                isOnline ? "bg-green-100" : "bg-red-100"
              }`}>
                {isOnline ? (
                  <Wifi className="h-8 w-8 text-green-600" />
                ) : (
                  <WifiOff className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {isOnline ? "Network Connection Restored" : "Network Connection Lost"}
              </h1>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                {isOnline 
                  ? "Your connection has been restored. You can continue learning."
                  : "We're having trouble connecting to our servers. Let's check your connection."}
              </p>
            </div>

            {/* Connection Details */}
            <Card className="w-full max-w-md p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connection Status</span>
                  <span className={`flex items-center ${
                    isOnline ? "text-green-600" : "text-red-600"
                  }`}>
                    {isOnline ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {isOnline ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network Type</span>
                  <span className="flex items-center">
                    <Signal className="h-4 w-4 mr-1" />
                    {networkType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Signal Strength</span>
                  <span className="flex items-center">
                    <Gauge className="h-4 w-4 mr-1" />
                    {signalStrength} Mbps
                  </span>
                </div>
                <Button 
                  onClick={handleConnectivityCheck}
                  disabled={isChecking}
                  className="w-full"
                >
                  <RefreshCcw className={`mr-2 h-4 w-4 ${
                    isChecking ? "animate-spin" : ""
                  }`} />
                  {isChecking ? "Checking Connection..." : "Check Connection"}
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Troubleshooting Steps</h2>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center gap-2">
                    <RefreshCcw className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Check your WiFi or mobile data connection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Toggle airplane mode on and off</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Try a different network if available</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Access offline content while reconnecting</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Available Offline</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/downloads">
                      <Download className="mr-2 h-4 w-4" />
                      Downloaded Courses
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/resources/offline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Study Materials
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/practice">
                      <PenTool className="mr-2 h-4 w-4" />
                      Practice Exercises
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Network Optimization */}
            <Card className="w-full max-w-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Network Optimization</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/settings/data-saving"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Data Saving Mode</p>
                    <p className="text-sm text-muted-foreground">Reduce data usage</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/settings/offline"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Offline Settings</p>
                    <p className="text-sm text-muted-foreground">Manage downloads</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/settings/bandwidth"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">Bandwidth Control</p>
                    <p className="text-sm text-muted-foreground">Optimize streaming</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link
                  href="/wifi-finder"
                  className="flex items-center p-3 rounded-lg hover:bg-accent group"
                >
                  <div className="flex-1">
                    <p className="font-medium">WiFi Finder</p>
                    <p className="text-sm text-muted-foreground">Find nearby hotspots</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </Card>

            {/* Support Options */}
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
              <Card className="flex-1 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">Contact support</p>
                  </div>
                </div>
                <div className="space-y-2">
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

              <Card className="flex-1 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Smartphone className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Mobile App</h3>
                    <p className="text-sm text-muted-foreground">Better offline support</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/mobile">Download Mobile App</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/mobile/features">Learn More</Link>
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