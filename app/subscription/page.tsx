"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronRight,
  CreditCard,
  Download,
  FileText,
  Settings,
  Users,
  Smartphone,
  Wallet,
  Bell,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false)

  // Mock subscription data
  const subscription = {
    plan: "Premium Mentorship",
    status: "active",
    nextBilling: new Date(2024, 3, 15),
    amount: 199.00,
    features: [
      "Unlimited Course Access",
      "1-on-1 Mentorship Sessions",
      "Project Reviews",
      "Career Support",
      "Industry Certifications"
    ],
    usage: {
      coursesAccessed: 15,
      mentorshipHours: 8,
      projectReviews: 4,
      certificatesEarned: 2
    },
    billingHistory: [
      {
        date: new Date(2024, 2, 15),
        amount: 199.00,
        status: "paid",
        reference: "INV-2024-001"
      },
      {
        date: new Date(2024, 1, 15),
        amount: 199.00,
        status: "paid",
        reference: "INV-2024-002"
      }
    ],
    paymentMethods: [
      {
        type: "card",
        last4: "4242",
        expiry: "12/25",
        isDefault: true
      },
      {
        type: "mobile",
        provider: "M-Pesa",
        number: "****1234",
        isDefault: false
      }
    ]
  }

  const handlePlanChange = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Subscription</span>
          </div>

          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Subscription Management
              </h1>
              <p className="text-muted-foreground">
                Manage your subscription, billing, and payment methods
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/billing/history">
                <FileText className="h-4 w-4 mr-2" />
                Billing History
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Current Plan */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{subscription.plan}</h2>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Next billing on {format(subscription.nextBilling, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handlePlanChange} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Change Plan"}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold gradient-text">{subscription.usage.coursesAccessed}</p>
                      <p className="text-sm text-muted-foreground">Courses Accessed</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold gradient-text">{subscription.usage.mentorshipHours}</p>
                      <p className="text-sm text-muted-foreground">Mentorship Hours</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold gradient-text">{subscription.usage.projectReviews}</p>
                      <p className="text-sm text-muted-foreground">Project Reviews</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <p className="text-2xl font-bold gradient-text">{subscription.usage.certificatesEarned}</p>
                      <p className="text-sm text-muted-foreground">Certificates Earned</p>
                    </Card>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Plan Features</h3>
                    <ul className="space-y-2">
                      {subscription.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Payment Methods</h2>
                <div className="space-y-4">
                  {subscription.paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent"
                    >
                      <div className="flex items-center gap-4">
                        {method.type === "card" ? (
                          <CreditCard className="h-5 w-5" />
                        ) : (
                          <Smartphone className="h-5 w-5" />
                        )}
                        <div>
                          <p className="font-medium">
                            {method.type === "card"
                              ? `•••• ${method.last4}`
                              : `${method.provider} (${method.number})`}
                          </p>
                          {method.type === "card" && (
                            <p className="text-sm text-muted-foreground">
                              Expires {method.expiry}
                            </p>
                          )}
                        </div>
                      </div>
                      {method.isDefault ? (
                        <span className="text-sm text-muted-foreground">Default</span>
                      ) : (
                        <Button variant="ghost" size="sm">
                          Make Default
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Recent Transactions</h2>
                <div className="space-y-4">
                  {subscription.billingHistory.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-accent"
                    >
                      <div>
                        <p className="font-medium">
                          ${transaction.amount.toFixed(2)} - {subscription.plan}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(transaction.date, "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/invoice/${transaction.reference}`}>
                            <Download className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Manage Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Add Team Members
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="font-semibold mb-4">Need Help?</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Having trouble with your subscription? Our support team is here to help.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-red-200">
                <h2 className="font-semibold mb-4">Cancel Subscription</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your subscription will remain active until the end of the current billing period.
                </p>
                <Button variant="destructive" className="w-full">
                  Cancel Subscription
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}