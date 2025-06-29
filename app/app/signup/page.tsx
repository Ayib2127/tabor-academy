"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Mail, Phone, Globe, ArrowLeft, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/site-header"
import { getCountries, getCountryCallingCode } from 'libphonenumber-js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SocialIcons } from '@/components/ui/social-icons'

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
  privacy: z.boolean().refine((val) => val === true, "You must accept the privacy policy"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState<"email" | "phone" | "social">("email")
  const [step, setStep] = useState(1)
  const countries = getCountries()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: any) => {
    console.log('onSubmit triggered', data);
    try {
      setIsLoading(true)
      
      // Sign up with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            full_name: `${data.firstName} ${data.lastName}`,
            role: 'student',
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (authData.user) {
        // Profile creation is now handled by a database trigger.
        // The client-side insertion code is removed to avoid RLS violations.
        // The trigger ensures the profile is created with the correct auth.uid()

        toast.success("Account created successfully! Please check your email for verification.")
        setStep(2)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account")
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with social provider")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container max-w-6xl py-10">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-orange-500 text-white" : "bg-gray-200"
                }`}>
                  {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <div className={`h-1 w-24 ${
                  step > 1 ? "bg-orange-500" : "bg-gray-200"
                }`} />
              </div>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2 ? "bg-orange-500 text-white" : "bg-gray-200"
                }`}>
                  2
                </div>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tighter gradient-text mb-4">
                  Join Tabor Digital Academy
                </h1>
                <p className="text-xl text-muted-foreground">
                  Start your journey to digital success in Africa
                </p>
              </div>

              <Tabs defaultValue="email" className="max-w-md mx-auto">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <Card className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-red-500">{errors.firstName.message as string}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-red-500">{errors.lastName.message as string}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...register("password")}
                          className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && (
                          <p className="text-sm text-red-500">{errors.password.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...register("confirmPassword")}
                          className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        {errors.confirmPassword && (
                          <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Controller
                            name="terms"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id="terms"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the <Link href="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
                          </Label>
                        </div>
                        {errors.terms && (
                          <p className="text-sm text-red-500">{errors.terms.message as string}</p>
                        )}

                        <div className="flex items-center space-x-2">
                          <Controller
                            name="privacy"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                id="privacy"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            )}
                          />
                          <Label htmlFor="privacy" className="text-sm">
                            I agree to the <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
                          </Label>
                        </div>
                        {errors.privacy && (
                          <p className="text-sm text-red-500">{errors.privacy.message as string}</p>
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
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Card>
                </TabsContent>

                <TabsContent value="social">
                  <Card className="p-6">
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => handleSocialLogin('google')} disabled={isLoading}>
                        <SocialIcons.Google className="mr-2" />
                        Continue with Google
                      </Button>
                      <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => handleSocialLogin('facebook')} disabled={isLoading}>
                        <SocialIcons.Facebook className="mr-2" />
                        Continue with Facebook
                      </Button>
                      <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => handleSocialLogin('linkedin')} disabled={isLoading}>
                        <SocialIcons.LinkedIn className="mr-2" />
                        Continue with LinkedIn
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>

              <p className="text-center mt-8 text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-orange-500 hover:underline">
                  Log in
                </Link>
              </p>
            </>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Account Created Successfully!</h2>
                <p className="text-muted-foreground">
                  Please check your email to verify your account and complete your profile.
                </p>
              </div>
              <Button
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                asChild
              >
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}