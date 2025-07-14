"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Copy, Check, Phone, Building2, CreditCard, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface EthiopianPaymentOption {
  id: string
  name: string
  logo: string
  accountNumber: string
  accountName: string
  instructions: string[]
  color: string
}

const ETHIOPIAN_PAYMENT_OPTIONS: EthiopianPaymentOption[] = [
  {
    id: 'telebirr',
    name: 'TeleBirr',
    logo: '/payment-logos/telebirr.png', // You'll need to add these logos
    accountNumber: '0910083733',
    accountName: 'YIBELTAL EBABU DIRES',
    instructions: [
      'Open your TeleBirr app',
      'Select "Send Money" or "Transfer"',
      'Enter the account number: 0910083733',
      'Enter the exact amount shown above',
      'Complete the transaction',
      'Take a screenshot of the confirmation',
      'Upload the screenshot below'
    ],
    color: 'bg-blue-600'
  },
  {
    id: 'awash',
    name: 'Awash Bank',
    logo: '/payment-logos/awash.png',
    accountNumber: '013201480291700',
    accountName: 'YIBELTAL EBABU DIRES',
    instructions: [
      'Visit Awash Bank mobile app or nearest branch',
      'Select "Transfer" or "Send Money"',
      'Enter account number: 013201480291700',
      'Enter account name: YIBELTAL EBABU DIRES',
      'Enter the exact amount shown above',
      'Complete the transaction',
      'Keep your transaction receipt',
      'Upload the receipt below'
    ],
    color: 'bg-green-700'
  },
  {
    id: 'boa',
    name: 'Bank of Abyssinia',
    logo: '/payment-logos/boa.png',
    accountNumber: '130958176',
    accountName: 'YIBELTAL EBABU DIRES',
    instructions: [
      'Open BOA mobile app or visit branch',
      'Select "Fund Transfer"',
      'Enter account number: 130958176',
      'Enter account name: YIBELTAL EBABU DIRES',
      'Enter the exact amount shown above',
      'Complete the transaction',
      'Save your transaction receipt',
      'Upload the receipt below'
    ],
    color: 'bg-red-600'
  },
  {
    id: 'mpesa',
    name: 'M-PESA Ethiopia',
    logo: '/payment-logos/mpesa.png',
    accountNumber: '0777188677',
    accountName: 'YIBELTAL EBABU DIRES',
    instructions: [
      'Dial *665# or open M-PESA app',
      'Select "Send Money"',
      'Enter phone number: 0777188677',
      'Enter the exact amount shown above',
      'Enter your M-PESA PIN',
      'Confirm the transaction',
      'Save the confirmation SMS',
      'Upload screenshot of confirmation below'
    ],
    color: 'bg-green-600'
  }
]

interface EthiopianPaymentOptionsProps {
  courseId: string
  courseTitle: string
  amount: number
  currency: string
  onPaymentSubmitted: () => void
  onCancel: () => void
}

export function EthiopianPaymentOptions({
  courseId,
  courseTitle,
  amount,
  currency,
  onPaymentSubmitted,
  onCancel
}: EthiopianPaymentOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<EthiopianPaymentOption | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload an image (JPG, PNG, WebP) or PDF file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      setPaymentProof(file)
      toast.success('Payment proof uploaded successfully')
    }
  }

  const handleSubmitPayment = async () => {
    if (!selectedOption || !paymentProof || !transactionId.trim()) {
      toast.error('Please fill all required fields and upload payment proof')
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('courseId', courseId)
      formData.append('courseTitle', courseTitle)
      formData.append('amount', amount.toString())
      formData.append('currency', currency)
      formData.append('paymentMethod', selectedOption.id)
      formData.append('paymentMethodName', selectedOption.name)
      formData.append('accountNumber', selectedOption.accountNumber)
      formData.append('transactionId', transactionId.trim())
      formData.append('paymentProof', paymentProof)

      const response = await fetch('/api/payment/ethiopian/submit', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit payment')
      }

      toast.success('Payment submitted successfully! We will verify and activate your course within 24 hours.')
      onPaymentSubmitted()

    } catch (error: any) {
      console.error('Payment submission error:', error)
      toast.error(error.message || 'Failed to submit payment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#2C3E50]">Ethiopian Payment Options</h2>
        <p className="text-[#2C3E50]/70">
          Choose your preferred payment method below
        </p>
        <div className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 px-4 py-2 rounded-lg">
          <span className="text-lg font-bold text-[#2C3E50]">
            Amount: {amount} {currency}
          </span>
        </div>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ETHIOPIAN_PAYMENT_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
              selectedOption?.id === option.id
                ? 'border-[#4ECDC4] bg-[#4ECDC4]/5 shadow-lg'
                : 'border-[#E5E8E8] hover:border-[#4ECDC4]/50 hover:shadow-md'
            }`}
            onClick={() => setSelectedOption(option)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center`}>
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#2C3E50]">{option.name}</h3>
                <p className="text-sm text-[#2C3E50]/60">Mobile & Bank Transfer</p>
              </div>
              {selectedOption?.id === option.id && (
                <Check className="w-6 h-6 text-[#4ECDC4]" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Instructions Dialog */}
      <Dialog open={!!selectedOption} onOpenChange={() => setSelectedOption(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 ${selectedOption?.color} rounded-lg flex items-center justify-center`}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              Pay with {selectedOption?.name}
            </DialogTitle>
            <DialogDescription>
              Follow the instructions below to complete your payment
            </DialogDescription>
          </DialogHeader>

          {selectedOption && (
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="bg-[#4ECDC4]/10 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-[#2C3E50]">Payment Details</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#2C3E50]/70">Account Number</label>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-2 rounded border flex-1 font-mono">
                        {selectedOption.accountNumber}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedOption.accountNumber, 'account')}
                      >
                        {copiedField === 'account' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#2C3E50]/70">Account Name</label>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-2 rounded border flex-1">
                        {selectedOption.accountName}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(selectedOption.accountName, 'name')}
                      >
                        {copiedField === 'name' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#2C3E50]/70">Amount</label>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-3 py-2 rounded border flex-1 font-bold text-[#FF6B35]">
                        {amount} {currency}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(`${amount}`, 'amount')}
                      >
                        {copiedField === 'amount' ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#2C3E50]/70">Course</label>
                    <div className="bg-white px-3 py-2 rounded border">
                      <p className="text-sm truncate">{courseTitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#2C3E50]">Payment Instructions</h4>
                <ol className="space-y-2">
                  {selectedOption.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="bg-[#4ECDC4] text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-[#2C3E50]">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Upload Section */}
              <div className="space-y-4 border-t pt-6">
                <h4 className="font-semibold text-[#2C3E50]">Submit Payment Proof</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50]/70 mb-2">
                      Transaction ID / Reference Number *
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter your transaction ID"
                      className="w-full px-3 py-2 border border-[#E5E8E8] rounded-lg focus:border-[#4ECDC4] focus:ring-1 focus:ring-[#4ECDC4] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C3E50]/70 mb-2">
                      Payment Screenshot / Receipt *
                    </label>
                    <div className="border-2 border-dashed border-[#E5E8E8] rounded-lg p-6 text-center relative">
                      {paymentProof ? (
                        <div className="space-y-2">
                          <Check className="w-8 h-8 text-green-500 mx-auto" />
                          <p className="text-sm text-green-600 font-medium">
                            {paymentProof.name}
                          </p>
                          <p className="text-xs text-[#2C3E50]/60">
                            {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPaymentProof(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-[#2C3E50]/40 mx-auto" />
                          <p className="text-sm text-[#2C3E50]/70">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-[#2C3E50]/50">
                            PNG, JPG, WebP or PDF (max 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOption(null)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitPayment}
                  disabled={!paymentProof || !transactionId.trim() || isSubmitting}
                  className="flex-1 bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Submit Payment
                    </>
                  )}
                </Button>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="font-medium text-yellow-800 mb-2">Important Notice</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Your course access will be activated within 24 hours after payment verification</li>
                  <li>• Make sure the transaction ID and amount are correct</li>
                  <li>• Keep your payment receipt for your records</li>
                  <li>• Contact support if you don't receive access within 24 hours</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}