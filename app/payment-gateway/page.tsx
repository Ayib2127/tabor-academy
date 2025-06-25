"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { QRCodeSVG } from "qrcode.react"
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Lock,
  Phone,
  Shield,
  Smartphone,
  Wallet,
  Bitcoin,
  Users,
  Building2,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PaymentGatewayPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [paymentStep, setPaymentStep] = useState<number>(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setPaymentStep(3)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
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
            <Link href="/cart" className="hover:text-foreground">Cart</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Payment</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Cart</span>
              <span className="text-sm font-medium">Payment</span>
              <span className="text-sm font-medium">Confirmation</span>
            </div>
            <Progress value={paymentStep * 33.33} className="h-2" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="md:col-span-2 space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Smartphone className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Mobile Money</h2>
                    <p className="text-sm text-muted-foreground">
                      Pay using your mobile money account
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      name: "M-Pesa",
                      logo: "https://images.unsplash.com/photo-1623282033815-40b05d96c903",
                      countries: ["Kenya", "Tanzania"]
                    },
                    {
                      name: "Airtel Money",
                      logo: "https://images.unsplash.com/photo-1623282033815-40b05d96c903",
                      countries: ["Uganda", "Rwanda"]
                    },
                    {
                      name: "MTN Mobile Money",
                      logo: "https://images.unsplash.com/photo-1623282033815-40b05d96c903",
                      countries: ["Ghana", "Uganda"]
                    }
                  ].map((provider) => (
                    <Button
                      key={provider.name}
                      variant={selectedMethod === provider.name ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setSelectedMethod(provider.name)}
                    >
                      <Image
                        src={provider.logo}
                        alt={provider.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                      <span className="font-medium">{provider.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {provider.countries.join(", ")}
                      </span>
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-100 rounded-full p-2">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Card Payment</h2>
                    <p className="text-sm text-muted-foreground">
                      Pay using credit or debit card
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}