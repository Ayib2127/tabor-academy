"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Smartphone, Download, CheckCircle, Globe, Wifi, HardDrive, Zap, Clock, AlertCircle, HelpCircle, Plus, ArrowRight, Chrome, Variable as Safari, Laptop } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AppDownloadPage() {
  const [installProgress, setInstallProgress] = useState(0)
  const [isInstalling, setIsInstalling] = useState(false)

  const handleInstall = async () => {
    setIsInstalling(true)
    // Simulate installation progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setInstallProgress(i)
    }
    setIsInstalling(false)
  }

  const features = [
    {
      icon: Globe,
      title: "Works Everywhere",
      description: "Access your courses on any device with a web browser"
    },
    {
      icon: Wifi,
      title: "Offline Access",
      description: "Download content for offline learning"
    },
    {
      icon: HardDrive,
      title: "Minimal Storage",
      description: "Uses less space than traditional apps"
    },
    {
      icon: Zap,
      title: "Fast Updates",
      description: "Always get the latest features automatically"
    }
  ]

  const installSteps = {
    android: [
      "Open Chrome browser on your Android device",
      "Visit app.taboracademy.com",
      "Tap the menu icon (three dots)",
      "Select 'Add to Home Screen'",
      "Confirm installation"
    ],
    ios: [
      "Open Safari browser on your iOS device",
      "Visit app.taboracademy.com",
      "Tap the Share icon",
      "Select 'Add to Home Screen'",
      "Tap 'Add' to confirm"
    ],
    desktop: [
      "Open Chrome or Edge browser",
      "Visit app.taboracademy.com",
      "Click the install icon in the address bar",
      "Click 'Install' in the prompt",
      "Launch from your desktop"
    ]
  }

  const systemRequirements = {
    browsers: [
      { name: "Chrome", version: "70+" },
      { name: "Safari", version: "13+" },
      { name: "Firefox", version: "63+" },
      { name: "Edge", version: "79+" }
    ],
    storage: "50MB minimum",
    connection: "2G or better",
    os: "Any modern operating system"
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
            <span>Download App</span>
          </div>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold tracking-tighter gradient-text mb-4">
              Learn Anywhere, Anytime - No App Store Required
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get instant access to your courses with our Progressive Web App. No app store downloads needed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={handleInstall} disabled={isInstalling}>
                <Download className="mr-2 h-5 w-5" />
                {isInstalling ? "Installing..." : "Install App Now"}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/learn-more">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            {isInstalling && (
              <div className="mt-4">
                <Progress value={installProgress} className="h-2 max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">
                  Installing... {installProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Installation Instructions */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Installation Guide</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Android</h3>
                    </div>
                    <ol className="space-y-2">
                      {installSteps.android.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">iOS</h3>
                    </div>
                    <ol className="space-y-2">
                      {installSteps.ios.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Desktop</h3>
                    </div>
                    <ol className="space-y-2">
                      {installSteps.desktop.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="bg-primary/10 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Card>

              {/* Comparison Section */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">PWA vs Native App</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Progressive Web App</h3>
                    <ul className="space-y-2">
                      {[
                        "Instant access - no app store needed",
                        "Automatic updates",
                        "Works on any device",
                        "Minimal storage required",
                        "No installation permissions needed",
                        "Offline functionality"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Traditional Native App</h3>
                    <ul className="space-y-2">
                      {[
                        "App store download required",
                        "Manual updates needed",
                        "Platform-specific versions",
                        "Larger storage space needed",
                        "Multiple permissions required",
                        "Limited offline access"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Requirements */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">System Requirements</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Supported Browsers</p>
                    <div className="space-y-2">
                      {systemRequirements.browsers.map((browser, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                        >
                          <span className="text-sm">{browser.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {browser.version}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded-lg hover:bg-accent">
                      <span className="text-sm">Storage Space</span>
                      <span className="text-sm text-muted-foreground">
                        {systemRequirements.storage}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg hover:bg-accent">
                      <span className="text-sm">Internet Connection</span>
                      <span className="text-sm text-muted-foreground">
                        {systemRequirements.connection}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg hover:bg-accent">
                      <span className="text-sm">Operating System</span>
                      <span className="text-sm text-muted-foreground">
                        {systemRequirements.os}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Troubleshooting */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <HelpCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Installation support
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/support/installation">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Installation Guide
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/support/faq">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      FAQs
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/support/contact">
                      <Plus className="mr-2 h-4 w-4" />
                      Contact Support
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