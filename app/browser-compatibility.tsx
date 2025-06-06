"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Chrome,
  Smartphone,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Eye,
  Volume2,
  MousePointer,
  MessageSquare
} from "lucide-react"
import Link from "next/link"

export default function BrowserCompatibilityPage() {
  const [browserInfo, setBrowserInfo] = useState({
    name: "Unknown",
    version: "Unknown",
    isCompatible: false,
    features: {
      webgl: false,
      webrtc: false,
      websockets: false,
      localStorage: false
    }
  })

  useEffect(() => {
    // Detect browser and features
    const ua = navigator.userAgent
    const browserName = ua.includes("Chrome") ? "Chrome" : 
                       ua.includes("Firefox") ? "Firefox" :
                       ua.includes("Safari") ? "Safari" :
                       ua.includes("Edge") ? "Edge" : "Unknown"

    // Simple feature detection
    const features = {
      webgl: !!window.WebGLRenderingContext,
      webrtc: !!window.RTCPeerConnection,
      websockets: !!window.WebSocket,
      localStorage: !!window.localStorage
    }

    setBrowserInfo({
      name: browserName,
      version: "Latest",
      isCompatible: browserName !== "Unknown",
      features
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Browser Detection */}
            <div className="space-y-4">
              <div className={`rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center ${
                browserInfo.isCompatible ? "bg-green-100" : "bg-yellow-100"
              }`}>
                <Globe className={`h-8 w-8 ${
                  browserInfo.isCompatible ? "text-green-600" : "text-yellow-600"
                }`} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Browser Compatibility Check
              </h1>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                Let's ensure your browser is optimized for the best learning experience
              </p>
            </div>

            {/* Current Browser Info */}
            <Card className="w-full max-w-md p-6">
              <h2 className="font-semibold mb-4">Your Browser</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Browser</span>
                  <span className="flex items-center">
                    {browserInfo.name} {browserInfo.version}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compatibility</span>
                  <span className={`flex items-center ${
                    browserInfo.isCompatible ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {browserInfo.isCompatible ? (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-1" />
                    )}
                    {browserInfo.isCompatible ? "Compatible" : "Update Recommended"}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Feature Support</span>
                    <span>{Object.values(browserInfo.features).filter(Boolean).length}/4</span>
                  </div>
                  <Progress 
                    value={
                      (Object.values(browserInfo.features).filter(Boolean).length / 4) * 100
                    } 
                    className="h-2"
                  />
                </div>
              </div>
            </Card>

            {/* Recommended Browsers */}
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Mobile Browsers</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Chrome className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Chrome for Android</p>
                        <p className="text-sm text-muted-foreground">Recommended</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://play.google.com/store/apps/details?id=com.android.chrome">
                        Download
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Firefox Mobile</p>
                        <p className="text-sm text-muted-foreground">Great offline support</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://play.google.com/store/apps/details?id=org.mozilla.firefox">
                        Download
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Opera Mini</p>
                        <p className="text-sm text-muted-foreground">Data saving</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://play.google.com/store/apps/details?id=com.opera.mini.native">
                        Download
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Desktop Browsers</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Chrome className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Google Chrome</p>
                        <p className="text-sm text-muted-foreground">Recommended</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://www.google.com/chrome">
                        Download
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Mozilla Firefox</p>
                        <p className="text-sm text-muted-foreground">Privacy focused</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://www.mozilla.org/firefox">
                        Download
                      </Link>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-accent">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Microsoft Edge</p>
                        <p className="text-sm text-muted-foreground">Windows integration</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://www.microsoft.com/edge">
                        Download
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Feature Requirements */}
            <Card className="w-full max-w-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Required Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(browserInfo.features).map(([feature, supported]) => (
                  <div key={feature} className="flex items-center p-3 rounded-lg bg-accent">
                    <div className="flex-1">
                      <p className="font-medium">{feature.charAt(0).toUpperCase() + feature.slice(1)}</p>
                      <p className="text-sm text-muted-foreground">Required for platform features</p>
                    </div>
                    {supported ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Accessibility Support */}
            <div className="grid md:grid-cols-3 gap-6 w-full max-w-2xl">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Visual</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>Screen reader support</li>
                  <li>High contrast mode</li>
                  <li>Text scaling</li>
                  <li>Color blind friendly</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Volume2 className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Audio</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>Closed captions</li>
                  <li>Audio descriptions</li>
                  <li>Volume controls</li>
                  <li>Transcripts</li>
                </ul>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MousePointer className="h-6 w-6 text-primary" />
                  <h3 className="font-semibold">Input</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>Keyboard navigation</li>
                  <li>Voice control</li>
                  <li>Touch support</li>
                  <li>Switch devices</li>
                </ul>
              </Card>
            </div>

            {/* Help Section */}
            <Card className="w-full max-w-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">Need Help?</h2>
                  <p className="text-muted-foreground">
                    Our support team is here to assist with any browser-related issues
                  </p>
                </div>
                <Button asChild>
                  <Link href="/support/contact">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}