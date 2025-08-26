"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  ChevronRight,
  Clock,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  Phone,
  Send,
  Settings,
  Share2,
  SmilePlus,
  User,
  Video,
  Volume2,
  X
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LiveChatPage() {
  const [chatStep, setChatStep] = useState<"pre-chat" | "queue" | "chat">("pre-chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{
    id: string;
    type: "user" | "agent" | "system";
    content: string;
    timestamp: Date;
  }>>([])
  const [isTyping, setIsTyping] = useState(false)

  // Mock agent data
  const agent = {
    name: "Sarah Mwangi",
    role: "Senior Support Specialist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 4.9,
    languages: ["English", "Swahili"],
    expertise: ["Technical Support", "Course Access", "Mobile App"]
  }

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setChatStep("queue")
    // Simulate queue waiting
    await new Promise(resolve => setTimeout(resolve, 2000))
    setChatStep("chat")
    setMessages([
      {
        id: "1",
        type: "system",
        content: "You are now connected with Sarah",
        timestamp: new Date()
      },
      {
        id: "2",
        type: "agent",
        content: "Hi! I'm Sarah. How can I help you today?",
        timestamp: new Date()
      }
    ])
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const newMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: message,
      timestamp: new Date()
    }
    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate agent typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "I understand. Let me help you with that...",
        timestamp: new Date()
      }])
    }, 2000)
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
            <span>Live Chat</span>
          </div>

          <div className="max-w-4xl mx-auto">
            {chatStep === "pre-chat" && (
              <Card className="p-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-4">
                    Start Live Chat Support
                  </h1>
                  <p className="text-muted-foreground">
                    Please provide some information to help us serve you better
                  </p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue">Issue Category</Label>
                    <select
                      id="issue"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="course">Course Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Brief Description</Label>
                    <textarea
                      id="description"
                      className="w-full h-24 p-2 border rounded-md resize-none"
                      placeholder="Please describe your issue..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Start Chat
                  </Button>
                </form>
              </Card>
            )}

            {chatStep === "queue" && (
              <Card className="p-6 text-center">
                <Clock className="h-12 w-12 text-primary mx-auto animate-spin mb-4" />
                <h2 className="text-xl font-semibold mb-2">Finding an Agent</h2>
                <p className="text-muted-foreground mb-4">
                  Estimated wait time: 2-3 minutes
                </p>
                <Progress value={40} className="mb-4" />
                <p className="text-sm text-muted-foreground">
                  You are number 2 in queue
                </p>
              </Card>
            )}

            {chatStep === "chat" && (
              <div className="grid md:grid-cols-4 gap-6">
                {/* Chat Interface */}
                <Card className="md:col-span-3 flex flex-col h-[600px]">
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={agent.image}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.type === "system" ? (
                          <div className="text-center w-full">
                            <span className="text-sm text-muted-foreground">
                              {msg.content}
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`max-w-[80%] ${
                              msg.type === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-accent"
                            } rounded-lg p-3`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <SmilePlus className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Agent Info Sidebar */}
                <Card className="p-4 space-y-6">
                  <div className="text-center">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      width={80}
                      height={80}
                      className="rounded-full mx-auto mb-2"
                    />
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm">{agent.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-xs px-2 py-1 rounded-full bg-accent"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 rounded-full bg-accent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Screen
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Send File
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Request Call
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}