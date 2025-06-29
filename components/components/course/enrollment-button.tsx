"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Loader2, 
  Lock, 
  CheckCircle, 
  CreditCard, 
  Gift,
  Shield,
  Users,
  Globe,
  MapPin
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getUserLocation, type LocationData } from '@/lib/utils/geolocation'
import { EthiopianPaymentOptions } from '@/components/payment/ethiopian-payment-options'

interface EnrollmentButtonProps {
  courseId: string
  courseTitle: string
  price: number
  isEnrolled?: boolean
  isOwnCourse?: boolean
  contentType?: string
  enrollmentCount?: number
  className?: string
}

export function EnrollmentButton({
  courseId,
  courseTitle,
  price,
  isEnrolled = false,
  isOwnCourse = false,
  contentType,
  enrollmentCount = 0,
  className = ""
}: EnrollmentButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<LocationData | null>(null)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [showEthiopianPayment, setShowEthiopianPayment] = useState(false)
  const [locationLoading, setLocationLoading] = useState(true)

  // Detect user location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLocationLoading(true)
        const location = await getUserLocation()
        setUserLocation(location)
      } catch (error) {
        console.error('Location detection failed:', error)
      } finally {
        setLocationLoading(false)
      }
    }

    detectLocation()
  }, [])

  const handleEnrollment = async () => {
    try {
      setIsLoading(true)

      // For free courses, proceed with normal enrollment
      if (price === 0) {
        const response = await fetch(`/api/courses/${courseId}/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: price,
            currency: 'USD'
          })
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please log in to enroll in this course')
            router.push('/login')
            return
          }
          
          if (data.enrolled) {
            toast.info('You are already enrolled in this course')
            router.push(`/courses/${courseId}`)
            return
          }

          throw new Error(data.error || 'Enrollment failed')
        }

        toast.success(data.message || 'Successfully enrolled!')
        router.push(data.redirect_url || `/courses/${courseId}`)
        return
      }

      // For paid courses, show payment options
      setShowPaymentOptions(true)

    } catch (error: any) {
      console.error('Enrollment error:', error)
      toast.error(error.message || 'Failed to enroll in course')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStripePayment = async () => {
    try {
      setIsLoading(true)
      setShowPaymentOptions(false)

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          currency: 'USD'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed')
      }

      if (data.payment_required) {
        toast.success('Redirecting to payment...')
        window.location.href = data.payment_url
      }

    } catch (error: any) {
      console.error('Stripe payment error:', error)
      toast.error(error.message || 'Failed to initialize payment')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEthiopianPayment = () => {
    setShowPaymentOptions(false)
    setShowEthiopianPayment(true)
  }

  const handleEthiopianPaymentSubmitted = () => {
    setShowEthiopianPayment(false)
    toast.success('Payment submitted! You will receive course access within 24 hours.')
    router.push('/dashboard')
  }

  // If user owns the course
  if (isOwnCourse) {
    return (
      <div className="space-y-3">
        <Button 
          disabled 
          className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
        >
          <Users className="h-4 w-4 mr-2" />
          Your Course
        </Button>
        <p className="text-sm text-center text-gray-500">
          You are the instructor of this course
        </p>
      </div>
    )
  }

  // If already enrolled
  if (isEnrolled) {
    return (
      <div className="space-y-3">
        <Button 
          onClick={() => router.push(`/courses/${courseId}`)}
          className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Continue Learning
        </Button>
        <p className="text-sm text-center text-green-600">
          ✅ You are enrolled in this course
        </p>
      </div>
    )
  }

  const isFree = price === 0
  const isTaborOriginal = contentType === 'tabor_original'

  return (
    <div className="space-y-4">
      {/* Location Display */}
      {userLocation && (
        <div className="flex items-center justify-center gap-2 text-sm text-[#2C3E50]/60">
          <MapPin className="w-4 h-4" />
          <span>{userLocation.country}</span>
          {userLocation.isEthiopia && (
            <Badge className="bg-green-100 text-green-700 text-xs">
              Ethiopian Payment Available
            </Badge>
          )}
        </div>
      )}

      {/* Price Display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-[#2C3E50] mb-2">
          {isFree ? (
            <span className="text-[#4ECDC4]">Free</span>
          ) : (
            <span>${price}</span>
          )}
        </div>
        
        {/* Course Type Badge */}
        {isTaborOriginal && (
          <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 text-white mb-3">
            <Shield className="w-3 h-3 mr-1" />
            Tabor Verified Course
          </Badge>
        )}
      </div>

      {/* Enrollment Button */}
      <Button
        onClick={handleEnrollment}
        disabled={isLoading || locationLoading}
        className={`w-full h-12 text-lg font-medium ${
          isFree 
            ? 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white' 
            : 'bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 hover:from-[#FF6B35]/90 hover:to-[#FF6B35]/70 text-white'
        } ${className}`}
      >
        {isLoading || locationLoading ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            {locationLoading ? 'Detecting location...' : isFree ? 'Enrolling...' : 'Processing...'}
          </>
        ) : (
          <>
            {isFree ? (
              <>
                <Gift className="h-5 w-5 mr-2" />
                Enroll for Free
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Enroll Now - ${price}
              </>
            )}
          </>
        )}
      </Button>

      {/* Additional Info */}
      <div className="space-y-2 text-sm text-center text-gray-600">
        <div className="flex items-center justify-center gap-1">
          <Users className="h-4 w-4" />
          <span>{enrollmentCount} students enrolled</span>
        </div>

        {isFree && (
          <p className="text-[#4ECDC4] font-medium">
            🎉 No payment required - Start learning immediately!
          </p>
        )}
      </div>

      {/* Payment Options Dialog */}
      <Dialog open={showPaymentOptions} onOpenChange={setShowPaymentOptions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
            <DialogDescription>
              Select your preferred payment option to enroll in this course
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Stripe Payment (International) */}
            <Button
              onClick={handleStripePayment}
              disabled={isLoading}
              className="w-full h-12 bg-[#635BFF] hover:bg-[#635BFF]/90 text-white"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Pay with Card (Stripe)
              <Badge className="ml-2 bg-white/20 text-white">International</Badge>
            </Button>

            {/* Ethiopian Payment Options */}
            {userLocation?.isEthiopia && (
              <Button
                onClick={handleEthiopianPayment}
                variant="outline"
                className="w-full h-12 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
              >
                <Globe className="h-5 w-5 mr-2" />
                Ethiopian Payment Methods
                <Badge className="ml-2 bg-[#4ECDC4]/10 text-[#4ECDC4]">Local</Badge>
              </Button>
            )}

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setShowPaymentOptions(false)}
                className="text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
              <Lock className="h-4 w-4" />
              <span>Secure payment with Stripe</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ethiopian Payment Dialog */}
      <Dialog open={showEthiopianPayment} onOpenChange={setShowEthiopianPayment}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <EthiopianPaymentOptions
            courseId={courseId}
            courseTitle={courseTitle}
            amount={price}
            currency="USD"
            onPaymentSubmitted={handleEthiopianPaymentSubmitted}
            onCancel={() => setShowEthiopianPayment(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Money-back guarantee for paid courses */}
      {!isFree && (
        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700 font-medium">
            💰 30-day money-back guarantee
          </p>
          <p className="text-xs text-green-600">
            Not satisfied? Get a full refund within 30 days
          </p>
        </div>
      )}
    </div>
  )
}