"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

type PaymentStatus = "processing" | "success" | "failed" | "cancelled"

function PaymentCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PaymentStatus>("processing")
  const [message, setMessage] = useState("")
  const [courseId, setCourseId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment parameters from URL (Stripe uses session_id)
        const sessionId = searchParams.get('session_id')
        const paymentStatus = searchParams.get('status')

        if (!sessionId) {
          setStatus("failed")
          setError("No payment session found")
          return
        }

        // Check if payment was cancelled
        if (paymentStatus === 'cancelled') {
          setStatus("cancelled")
          setMessage("Payment was cancelled")
          return
        }

        // Verify payment with backend
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId
          })
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus("success")
          setMessage(data.message || "Payment successful! You have been enrolled in the course.")
          setCourseId(data.course_id)
          
          // Redirect to course after a delay
          setTimeout(() => {
            if (data.course_id) {
              router.push(`/courses/${data.course_id}`)
            } else {
              router.push('/dashboard')
            }
          }, 3000)
        } else {
          setStatus("failed")
          setError(data.error || "Payment verification failed")
        }

      } catch (err: any) {
        console.error('Payment verification error:', err)
        setStatus("failed")
        setError("An error occurred while verifying your payment")
      }
    }

    verifyPayment()
  }, [searchParams, router])

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Loader2 className="h-16 w-16 animate-spin text-[#4ECDC4]" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case "failed":
        return <XCircle className="h-16 w-16 text-red-500" />
      case "cancelled":
        return <AlertCircle className="h-16 w-16 text-yellow-500" />
      default:
        return <Loader2 className="h-16 w-16 animate-spin text-[#4ECDC4]" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "processing":
        return "Processing Payment..."
      case "success":
        return "Payment Successful!"
      case "failed":
        return "Payment Failed"
      case "cancelled":
        return "Payment Cancelled"
      default:
        return "Processing..."
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Please wait while we verify your payment. This may take a few moments."
      case "success":
        return message || "Your payment has been processed successfully. You now have access to the course!"
      case "failed":
        return error || "There was an issue processing your payment. Please try again or contact support."
      case "cancelled":
        return "You cancelled the payment. You can try again anytime."
      default:
        return "Processing your payment..."
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "from-green-500/20 to-emerald-500/20 border-green-200"
      case "failed":
        return "from-red-500/20 to-rose-500/20 border-red-200"
      case "cancelled":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-200"
      default:
        return "from-[#4ECDC4]/20 to-[#FF6B35]/20 border-[#4ECDC4]/20"
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <Card className={`p-8 text-center bg-gradient-to-br ${getStatusColor()} border-2`}>
            <div className="space-y-6">
              {/* Status Icon */}
              <div className="flex justify-center">
                {getStatusIcon()}
              </div>

              {/* Status Title */}
              <h1 className="text-3xl font-bold text-[#2C3E50]">
                {getStatusTitle()}
              </h1>

              {/* Status Message */}
              <p className="text-lg text-[#2C3E50]/80 max-w-md mx-auto">
                {getStatusMessage()}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {status === "success" && (
                  <>
                    {courseId && (
                      <Button 
                        asChild
                        className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                      >
                        <Link href={`/courses/${courseId}`}>
                          Start Learning
                        </Link>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      asChild
                    >
                      <Link href="/dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                  </>
                )}

                {status === "failed" && (
                  <>
                    <Button 
                      onClick={() => window.history.back()}
                      className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                    >
                      <Link href="/contact">
                        Contact Support
                      </Link>
                    </Button>
                  </>
                )}

                {status === "cancelled" && (
                  <>
                    <Button 
                      onClick={() => window.history.back()}
                      className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                    >
                      <Link href="/courses">
                        Browse Courses
                      </Link>
                    </Button>
                  </>
                )}

                {status === "processing" && (
                  <Button 
                    variant="outline" 
                    asChild
                  >
                    <Link href="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                )}
              </div>

              {/* Additional Info */}
              {status === "success" && (
                <div className="mt-8 p-4 bg-white/60 rounded-lg border border-white/40">
                  <p className="text-sm text-[#2C3E50]/70">
                    🎉 Welcome to your learning journey! You'll receive a confirmation email shortly.
                  </p>
                </div>
              )}

              {status === "processing" && (
                <div className="mt-8 p-4 bg-white/60 rounded-lg border border-white/40">
                  <p className="text-sm text-[#2C3E50]/70">
                    ⏳ This page will automatically redirect once payment is confirmed.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 py-16">
          <div className="container max-w-2xl">
            <Card className="p-8 text-center">
              <Loader2 className="h-16 w-16 animate-spin text-[#4ECDC4] mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#2C3E50]">Loading...</h1>
            </Card>
          </div>
        </main>
      </div>
    }>
      <PaymentCallbackInner />
    </Suspense>
  )
}