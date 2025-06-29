"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Mail, Phone, Loader2, Eye, EyeOff } from "lucide-react"
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

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

const phoneLoginSchema = z.object({
  country: z.string().min(1, "Please select a country"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const countries = getCountries()

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    // Temporarily remove zodResolver to always trigger onSubmitEmail for testing
    // resolver: zodResolver(emailLoginSchema), // <--- COMMENT THIS LINE OUT
  })

  console.log('Current Email Form Errors (outside submit):', emailErrors);

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm({
    resolver: zodResolver(phoneLoginSchema),
  })

  const onSubmitEmail = async (data: any) => {
    try {
      setIsLoading(true)
      setError("")

      // Sign in with credentials
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        throw new Error(signInError.message)
      }

      // Get user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user?.id)
        .single()

      if (userError) {
        console.error('Error fetching user data:', userError)
        throw new Error('Failed to fetch user data')
      }

      // Redirect based on role
      if (userData?.role === 'instructor') {
        router.push('/dashboard/instructor')
      } else if (userData?.role === 'student') {
        router.push('/dashboard/student')
      } else {
        router.push('/dashboard')
      }

      toast.success("Logged in successfully!")
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
      console.log('Login process finished (finally block).')
    }
  }

  const onSubmitPhone = async (data: any) => {
    setIsLoading(true)
    setError("")
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Redirect to phone verification page
    } catch (err) {
      setError("Invalid phone number")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'linkedin') => {
    setIsLoading(true)
    setError("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message || "Failed to login with social provider")
      toast.error(error.message || "Failed to login with social provider")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container max-w-lg py-10">
          <Card className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold gradient-text mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Continue your learning journey with Tabor Digital Academy
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <Tabs defaultValue="email" className="mb-8">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={(e) => {
                    console.log('Form onSubmit event triggered.');
                    handleSubmitEmail(onSubmitEmail)(e);
                }} className="space-y-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...registerEmail("password")}
                        className={emailErrors.password ? "border-red-500 pr-10" : "pr-10"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {emailErrors.password && (
                      <p className="text-sm text-red-500">{emailErrors.password.message as string}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rememberMe" {...registerEmail("rememberMe")} />
                      <Label htmlFor="rememberMe" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/reset-password"
                      className="text-sm text-orange-500 hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                    disabled={isLoading}
                    onClick={() => {
                      console.log('Login button clicked!');
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="social">
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
              </TabsContent>
            </Tabs>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                New to Tabor Digital Academy?{" "}
                <Link href="/signup" className="text-orange-500 hover:underline">
                  Sign up for free
                </Link>
              </p>

              <div className="text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-orange-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-500 hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}