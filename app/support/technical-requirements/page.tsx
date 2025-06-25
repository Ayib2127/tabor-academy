"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  ChevronRight,
  Globe,
  Laptop,
  Smartphone,
  Wifi,
  Monitor,
  HardDrive,
  Cpu,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Volume2,
  MousePointer,
  Keyboard,
  HelpCircle
} from "lucide-react"
import Link from "next/link"

export default function TechnicalRequirementsPage() {
  const [isTestingSystem, setIsTestingSystem] = useState(false)
  const [testResults, setTestResults] = useState<{
    browser: boolean;
    connection: boolean;
    storage: boolean;
    media: boolean;
  } | null>(null)

  const handleSystemTest = async () => {
    setIsTestingSystem(true)
    // Simulate system testing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setTestResults({
      browser: true,
      connection: true,
      storage: true,
      media: true
    })
    setIsTestingSystem(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/support" className="hover:text-foreground">Support</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Technical Requirements</span>
          </div>

          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
              System Requirements & Compatibility
            </h1>
            <p className="text-muted-foreground">
              Check if your device meets the requirements for the best learning experience
            </p>
          </div>

          {/* System Test Card */}
          <Card className="p-6 mb-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">Test Your System</h2>
              <Button
                onClick={handleSystemTest}
                disabled={isTestingSystem}
                className="mb-6"
              >
                {isTestingSystem ? "Testing..." : "Run Compatibility Check"}
              </Button>

              {testResults && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-accent text-center">
                    <div className="flex justify-center mb-2">
                      {testResults.browser ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium">Browser</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent text-center">
                    <div className="flex justify-center mb-2">
                      {testResults.connection ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium">Connection</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent text-center">
                    <div className="flex justify-center mb-2">
                      {testResults.storage ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium">Storage</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent text-center">
                    <div className="flex justify-center mb-2">
                      {testResults.media ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium">Media</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Desktop Requirements */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 rounded-full p-2">
                  <Laptop className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Desktop Requirements</h2>
                  <p className="text-sm text-muted-foreground">
                    Minimum specifications for desktop computers
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                  <Monitor className="h-5 w-5 mt-1" />
                  <div>
                    <p className="font-medium">Operating System</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      <li>Windows 10 or later</li>
                      <li>macOS 10.14 (Mojave) or later</li>
                      <li>Ubuntu 18.04 LTS or later</li>
                      <li>Chrome OS (latest version)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                  <HardDrive className="h-5 w-5 mt-1" />
                  <div>
                    <p className="font-medium">Storage & Memory</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      <li>4GB RAM minimum (8GB recommended)</li>
                      <li>2GB available storage space</li>
                      <li>SSD recommended for optimal performance</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                  <Cpu className="h-5 w-5 mt-1" />
                  <div>
                    <p className="font-medium">Processor</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      <li>Dual-core 2.0 GHz or equivalent</li>
                      <li>Intel Core i3/AMD Ryzen 3 or better</li>
                      <li>64-bit processor architecture</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mobile Requirements */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-100 rounded-full p-2">
                  <Smartphone className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Mobile Requirements</h2>
                  <p className="text-sm text-muted-foreground">
                    Specifications for mobile devices
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                  <Monitor className="h-5 w-5 mt-1" />
                  <div>
                    <p className="font-medium">Android Devices</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      <li>Android 8.0 (API level 26) or higher</li>
                      <li>3GB RAM minimum (4GB recommended)</li>
                      <li>1GB available storage space</li>
                      <li>Screen resolution: 1280x720 minimum</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                  <Monitor className="h-5 w-5 mt-1" />
                  <div>
                    <p className="font-medium">iOS Devices</p>
                    <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                      <li>iOS 12.0 or later</li>
                      <li>iPhone 7 or newer</li>
                      <li>iPad (6th generation) or newer</li>
                      <li>1GB available storage space</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-accent">
                  <Download className="h-5 w-5 mt-1" />
                  <div>
                    <p className="font-medium">App Download</p>
                    <div className="flex gap-4 mt-2">
                      <Button variant="outline" className="flex-1">
                        Google Play
                      </Button>
                      <Button variant="outline" className="flex-1">
                        App Store
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Browser Compatibility */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 rounded-full p-2">
                  <Globe className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Browser Compatibility</h2>
                  <p className="text-sm text-muted-foreground">
                    Supported web browsers and versions
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-accent">
                    <p className="font-medium mb-2">Google Chrome</p>
                    <p className="text-sm text-muted-foreground">Version 90+</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      Recommended
                    </span>
                  </div>
                  <div className="p-4 rounded-lg bg-accent">
                    <p className="font-medium mb-2">Mozilla Firefox</p>
                    <p className="text-sm text-muted-foreground">Version 88+</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent">
                    <p className="font-medium mb-2">Safari</p>
                    <p className="text-sm text-muted-foreground">Version 14+</p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent">
                    <p className="font-medium mb-2">Microsoft Edge</p>
                    <p className="text-sm text-muted-foreground">Version 90+</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent">
                  <p className="font-medium mb-2">Required Browser Settings</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>JavaScript enabled</li>
                    <li>Cookies enabled</li>
                    <li>Local storage permissions</li>
                    <li>Pop-up blocker exceptions</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Network Requirements */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-100 rounded-full p-2">
                  <Wifi className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Network Requirements</h2>
                  <p className="text-sm text-muted-foreground">
                    Internet connectivity specifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-accent">
                  <p className="font-medium mb-2">Bandwidth Requirements</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Video streaming: 5 Mbps (HD), 2 Mbps (SD)</li>
                    <li>Live video calls: 3 Mbps upload/download</li>
                    <li>General browsing: 1 Mbps minimum</li>
                    <li>File downloads: Variable based on size</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-accent">
                  <p className="font-medium mb-2">Connection Types</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Broadband/WiFi connection</li>
                    <li>3G/4G/5G mobile data</li>
                    <li>Ethernet connection</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-accent">
                  <p className="font-medium mb-2">Offline Access</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Download content for offline viewing</li>
                    <li>Automatic sync when reconnected</li>
                    <li>Background sync functionality</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Accessibility Requirements */}
          <Card className="p-6 mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 rounded-full p-2">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h2 className="font-semibold">Accessibility Support</h2>
                <p className="text-sm text-muted-foreground">
                  Requirements for assistive technologies
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  <h3 className="font-medium">Visual Accessibility</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Screen reader compatibility (NVDA, JAWS, VoiceOver)</li>
                  <li>High contrast mode support</li>
                  <li>Text scaling capabilities</li>
                  <li>Color blind friendly design</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  <h3 className="font-medium">Audio Accessibility</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Closed captions availability</li>
                  <li>Audio description support</li>
                  <li>Volume control and audio settings</li>
                  <li>Sign language interpretation</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  <h3 className="font-medium">Input Accessibility</h3>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Keyboard navigation support</li>
                  <li>Voice control compatibility</li>
                  <li>Switch device support</li>
                  <li>Touch screen optimization</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Help Section */}
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <HelpCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">Need Technical Support?</h2>
                  <p className="text-sm text-muted-foreground">
                    Our support team is here to help you with any technical issues
                  </p>
                </div>
                <Button asChild>
                  <Link href="/support/contact">Contact Support</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}