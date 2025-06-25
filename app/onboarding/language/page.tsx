"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Globe,
  ArrowLeft,
  Save,
  HelpCircle,
  Volume2,
  BookOpen,
  MessageSquare,
  Subtitles,
  Check
} from "lucide-react"
import Link from "next/link"

export default function LanguageSelectionPage() {
  const router = useRouter()
  const [primaryLanguage, setPrimaryLanguage] = useState("")
  const [secondaryLanguages, setSecondaryLanguages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const languages = [
    {
      code: "en",
      name: "English",
      nativeName: "English",
      availability: "100% content available",
      communitySize: "500,000+ learners"
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      availability: "80% content available",
      communitySize: "100,000+ learners"
    },
    {
      code: "sw",
      name: "Swahili",
      nativeName: "Kiswahili",
      availability: "70% content available",
      communitySize: "50,000+ learners"
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      availability: "60% content available",
      communitySize: "75,000+ learners"
    },
    {
      code: "am",
      name: "Amharic",
      nativeName: "አማርኛ",
      availability: "40% content available",
      communitySize: "25,000+ learners"
    }
  ]

  const contentTypes = [
    {
      id: "interface",
      icon: Globe,
      title: "Interface Language",
      description: "Platform navigation and menus"
    },
    {
      id: "subtitles",
      icon: Subtitles,
      title: "Video Subtitles",
      description: "Captions for video content"
    },
    {
      id: "materials",
      icon: BookOpen,
      title: "Learning Materials",
      description: "Course content and resources"
    },
    {
      id: "community",
      icon: MessageSquare,
      title: "Community Discussions",
      description: "Forums and chat interactions"
    }
  ]

  const handleSecondaryLanguageToggle = (code: string) => {
    setSecondaryLanguages(prev => 
      prev.includes(code)
        ? prev.filter(lang => lang !== code)
        : [...prev, code]
    )
  }

  const handleContinue = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/onboarding/profile")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Progress Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Progress value={80} className="w-40" />
            <span className="text-sm text-muted-foreground">Step 4 of 5</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 py-10">
        <div className="container">
          {/* Introduction */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter gradient-text mb-4">
              Choose Your Learning Language
            </h1>
            <p className="text-lg text-muted-foreground">
              Select your preferred language for learning. You can also choose additional languages
              for a multilingual experience.
            </p>
          </div>

          {/* Primary Language Selection */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Select Your Primary Language</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {languages.map((language) => (
                <Card 
                  key={language.code}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    primaryLanguage === language.code ? 'ring-2 ring-teal-500 shadow-lg' : ''
                  }`}
                  onClick={() => setPrimaryLanguage(language.code)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-1">{language.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {language.nativeName}
                      </p>
                    </div>
                    {primaryLanguage === language.code && (
                      <Check className="h-5 w-5 text-teal-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {language.availability}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language.communitySize}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {primaryLanguage && (
            <>
              {/* Secondary Languages */}
              <div className="mb-16">
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-6">Additional Languages (Optional)</h3>
                  <p className="text-muted-foreground mb-6">
                    Select additional languages if you'd like to access content in multiple languages.
                    This can be especially helpful for technical terms and global perspectives.
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {languages
                      .filter(lang => lang.code !== primaryLanguage)
                      .map((language) => (
                        <div
                          key={language.code}
                          className="flex items-start space-x-3"
                        >
                          <Checkbox
                            id={`lang-${language.code}`}
                            checked={secondaryLanguages.includes(language.code)}
                            onCheckedChange={() => handleSecondaryLanguageToggle(language.code)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label
                              htmlFor={`lang-${language.code}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {language.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {language.availability}
                            </p>
                          </div>
                        </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Content Type Preferences */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center">Content Language Preferences</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contentTypes.map((type) => (
                    <Card key={type.id} className="p-6">
                      <type.icon className="h-8 w-8 text-teal-600 mb-4" />
                      <h3 className="font-semibold mb-2">{type.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {type.description}
                      </p>
                      <select className="w-full p-2 border rounded-md">
                        <option value={primaryLanguage}>Primary Language</option>
                        {secondaryLanguages.map(code => (
                          <option key={code} value={code}>
                            {languages.find(lang => lang.code === code)?.name}
                          </option>
                        ))}
                      </select>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Audio Preferences */}
              <div className="mb-16">
                <Card className="p-8">
                  <div className="flex items-start gap-4">
                    <Volume2 className="h-8 w-8 text-teal-600" />
                    <div>
                      <h3 className="text-xl font-bold mb-4">Audio Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="narration" />
                          <Label htmlFor="narration">Enable voice narration when available</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="pronunciation" />
                          <Label htmlFor="pronunciation">Include pronunciation guides</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="translation" />
                          <Label htmlFor="translation">Enable automatic audio translation</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Continue Button */}
              <div className="max-w-xl mx-auto">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-500"
                  onClick={handleContinue}
                  disabled={!primaryLanguage || isLoading}
                >
                  {isLoading ? "Saving Preferences..." : "Continue to Profile Setup"}
                </Button>
                <p className="text-sm text-center text-muted-foreground mt-4">
                  You can always change these settings later
                </p>
              </div>
            </>
          )}

          {/* Help and Support */}
          <div className="mt-12 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Need Help?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Language Selection Help</DialogTitle>
                  <DialogDescription>
                    Choose how you'd like to get assistance:
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <Button variant="outline" className="justify-start">
                    Chat with Support
                  </Button>
                  <Button variant="outline" className="justify-start">
                    View Language FAQ
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Content Availability Guide
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container">
          <div className="flex justify-between items-center">
            <Progress value={80} className="w-40" />
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}