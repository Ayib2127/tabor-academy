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
  ArrowRight,
  ChevronRight,
  Clock,
  FileText,
  HelpCircle,
  Upload,
  CheckCircle,
  XCircle,
  RefreshCcw
} from "lucide-react"
import Link from "next/link"

export default function RefundRequestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [explanation, setExplanation] = useState("")

  // Mock transaction data
  const transactions = [
    {
      id: "TXN-2024-001",
      date: "March 1, 2024",
      amount: 199.00,
      description: "Premium Mentorship Plan",
      status: "completed",
      refundEligible: true
    },
    {
      id: "TXN-2024-002",
      date: "February 15, 2024",
      amount: 99.00,
      description: "Digital Marketing Course",
      status: "completed",
      refundEligible: false
    }
  ]

  const refundReasons = [
    "Technical difficulties",
    "Course quality issues",
    "Personal circumstances",
    "Billing error",
    "Duplicate payment",
    "Service not delivered",
    "Other"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setCurrentStep(currentStep + 1)
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
            <span>Refund Request</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Select Transaction</span>
              <span className="text-sm font-medium">Refund Details</span>
              <span className="text-sm font-medium">Documentation</span>
              <span className="text-sm font-medium">Review</span>
            </div>
            <Progress value={currentStep * 25} className="h-2" />
          </div>

          {currentStep === 1 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Select Transaction</h2>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`p-4 rounded-lg border ${
                        transaction.refundEligible
                          ? "hover:border-primary cursor-pointer"
                          : "opacity-60"
                      }`}
                      onClick={() => transaction.refundEligible && setCurrentStep(2)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.date} • {transaction.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                          {transaction.refundEligible ? (
                            <span className="text-xs text-green-600">Eligible for refund</span>
                          ) : (
                            <span className="text-xs text-red-600">Not eligible</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Refund Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Refund</Label>
                    <select
                      id="reason"
                      className="w-full p-2 border rounded-md"
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      required
                    >
                      <option value="">Select a reason</option>
                      {refundReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="explanation">Detailed Explanation</Label>
                    <textarea
                      id="explanation"
                      className="w-full h-32 p-2 border rounded-md resize-none"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="Please provide details about your refund request..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Continue"}
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Supporting Documentation</h2>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Evidence of Issue</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload screenshots, documents, or other evidence
                      </p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Additional Documentation</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Any other relevant documents
                      </p>
                      <Button variant="outline">Choose Files</Button>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setCurrentStep(4)}
                    disabled={isSubmitting}
                  >
                    Continue to Review
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {currentStep === 4 && (
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <div className="text-center mb-8">
                  <Clock className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Request Submitted</h2>
                  <p className="text-muted-foreground">
                    Your refund request has been submitted successfully.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-accent rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Next Steps</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <RefreshCcw className="h-4 w-4 text-orange-500" />
                        Request review (3-5 business days)
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Email confirmation sent
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Processing time: 5-7 business days
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button className="flex-1" asChild>
                      <Link href="/dashboard">Return to Dashboard</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/refund-status">
                        Check Refund Status
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-2">
                  <HelpCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our support team is here to assist you with your refund request.
                  </p>
                </div>
                <Button variant="outline" className="ml-auto" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}