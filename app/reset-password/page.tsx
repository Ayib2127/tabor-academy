"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Mail, Phone, ArrowLeft, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

const phoneSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const [method, setMethod] = useState<"email" | "phone">("email")
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const countries = getCountries()

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  })

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm({
    resolver: zodResolver(phoneSchema),
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmitEmail = async (data: any) => {
    setIsLoading(true)
    setError("")
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(2)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPhone = async (data: any) => {
    setIsLoading(true)
    setError("")
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(2)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPassword = async (data: any) => {
    setIsLoading(true)
    setError("")
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(3)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container max-w-lg py-10">
          <Link href="/login">
            <Button
              variant="ghost"
              className="mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>

          <Card className="p-6">
            {step === 1 && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold gradient-text mb-2">
                    Reset Your Password
                  </h1>
                  <p className="text-muted-foreground">
                    Choose how you want to reset your password
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}

                <Tabs defaultValue="email" className="mb-8" onValueChange={(value) => setMethod(value as "email" | "phone")}>
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...registerEmail("email")}
                          className={emailErrors.email ? "border-red-500" : ""}
                        />
                        {emailErrors.email && (
                          <p className="text-sm text-red-500">{emailErrors.email.message as string}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Reset Link...
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="phone">
                    <form onSubmit={handleSubmitPhone(onSubmitPhone)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <select
                          id="country"
                          className="w-full p-2 border rounded-md"
                          {...registerPhone("country")}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country} (+{getCountryCallingCode(country)})
                            </option>
                          ))}
                        </select>
                        {phoneErrors.country && (
                          <p className="text-sm text-red-500">{phoneErrors.country.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...registerPhone("phone")}
                          className={phoneErrors.phone ? "border-red-500" : ""}
                        />
                        {phoneErrors.phone && (
                          <p className="text-sm text-red-500">{phoneErrors.phone.message as string}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          "Send Verification Code"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold gradient-text mb-2">
                    Create New Password
                  </h2>
                  <p className="text-muted-foreground">
                    Please enter your new password
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...registerPassword("password")}
                      className={passwordErrors.password ? "border-red-500" : ""}
                    />
                    {passwordErrors.password && (
                      <p className="text-sm text-red-500">{passwordErrors.password.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...registerPassword("confirmPassword")}
                      className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500">{passwordErrors.confirmPassword.message as string}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </form>
              </>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Password Reset Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your password has been updated. You can now log in with your new password.
                </p>
                <Button
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                  asChild
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )}