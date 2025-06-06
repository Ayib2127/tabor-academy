"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Users,
  Star,
  Settings,
  PlusCircle,
  Send,
  Image as ImageIcon,
  Paperclip,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Info,
  Pin,
  Archive,
  Bell,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import Image from "next/image"

// Mock messages data
const messagesData = {
  contacts: [
    {
      id: 1,
      name: "John Okafor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      status: "online",
      lastMessage: "Thanks for the help with the project!",
      timestamp: "2024-02-29T10:30:00",
      unread: 2,
      type: "student"
    },
    {
      id: 2,
      name: "Sarah Kimani",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      status: "offline",
      lastMessage: "Let's schedule our next mentoring session",
      timestamp: "2024-02-29T09:15:00",
      unread: 0,
      type: "mentor"
    },
    {
      id: 3,
      name: "Digital Marketing Group",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      status: "group",
      lastMessage: "New study materials uploaded",
      timestamp: "2024-02-29T08:45:00",
      unread: 5,
      type: "group",
      members: 15
    }
  ],
  selectedChat: {
    id: 1,
    name: "John Okafor",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    status: "online",
    type: "student",
    messages: [
      {
        id: 1,
        sender: "John Okafor",
        content: "Hi! I need some help with the digital marketing assignment.",
        timestamp: "2024-02-29T10:15:00",
        status: "read"
      },
      {
        id: 2,
        sender: "You",
        content: "Sure, what specific part are you struggling with?",
        timestamp: "2024-02-29T10:16:00",
        status: "read"
      },
      {
        id: 3,
        sender: "John Okafor",
        content: "I'm having trouble understanding the social media analytics section.",
        timestamp: "2024-02-29T10:18:00",
        status: "read"
      },
      {
        id: 4,
        sender: "You",
        content: "Let me share some resources that might help.",
        timestamp: "2024-02-29T10:20:00",
        status: "sent"
      }
    ]
  }
}

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [selectedContact, setSelectedContact] = useState(messagesData.contacts[0])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    // Add message sending logic here
    setMessageInput("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid md:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
            {/* Contacts Sidebar */}
            <div className="md:col-span-4 lg:col-span-3">
              <Card className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Messages</h2>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="p-2 border-b">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      All
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Unread
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Starred
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {messagesData.contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                        selectedContact.id === contact.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={contact.image}
                            alt={contact.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          {contact.status === "online" && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{contact.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {new Date(contact.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {contact.lastMessage}
                          </p>
                        </div>
                        {contact.unread > 0 && (
                          <div className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                            {contact.unread}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t">
                  <Button className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-8 lg:col-span-9">
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={selectedContact.image}
                      alt={selectedContact.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedContact.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedContact.type === "group" 
                          ? `${selectedContact.members} members`
                          : selectedContact.status === "online" ? "Online" : "Offline"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesData.selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "You" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender === "You"
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent"
                        } rounded-lg p-3`}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.sender === "You" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button variant="ghost" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}