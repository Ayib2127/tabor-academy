"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
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
import { getName } from 'country-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SocialIcons } from '@/components/ui/social-icons'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

const emailLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

const phoneLoginSchema = z.object({
  phone: z.string()
    .min(8, "Please enter a valid phone number")
    .regex(/^\+?[1-9]\d{7,14}$/, "Please enter a valid phone number with country code"),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const countries = getCountries()

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({
    // Temporarily remove zodResolver to always trigger onSubmitEmail for testing
    // resolver: zodResolver(emailLoginSchema), // <--- COMMENT THIS LINE OUT
  })

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    control: controlPhone, // <-- Add this
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

      if (userData?.role === 'admin') {
        router.push('/dashboard/admin');
      } else if (userData?.role === 'mentor') {
        router.push('/dashboard/mentor');
      } else if (userData?.role === 'instructor') {
        router.push('/dashboard/instructor');
      } else if (userData?.role === 'student') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }

      toast.success("Logged in successfully!")
      
      // Trigger welcome email check (non-blocking)
      if (authData.user?.id) {
        fetch('/api/auth/welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: authData.user.id }),
        }).catch(error => {
          console.error('Welcome email check failed:', error);
        });
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      if (error.code) {
        showApiErrorToast({
          code: error.code,
          error: error.message,
          details: error.details,
        });
      } else {
        showApiErrorToast({
          code: 'INTERNAL_ERROR',
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPhone = async (data: any) => {
    setIsLoading(true)
    setError("")
    try {
      // Compose full phone number with country code
      const fullPhone = `+${getCountryCallingCode(data.country)}${data.phone.replace(/^0+/, '')}`;
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
      if (error) throw error;
      // Redirect to phone verification page, pass phone in query
      router.push(`/verify/phone?phone=${encodeURIComponent(fullPhone)}`);
    } catch (err: any) {
      setError(err.message || "Invalid phone number");
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
      if (error.code) {
        showApiErrorToast({
          code: error.code,
          error: error.message,
          details: error.details,
        });
      } else {
        showApiErrorToast({
          code: 'INTERNAL_ERROR',
          error: error.message || "Failed to login with social provider",
        });
      }
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
                Continue your learning journey with Tabor Academy
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <Tabs defaultValue="email" className="mb-8">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={(e) => {
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

                  {/* --- Resend Confirmation Email Button --- */}
                  <div className="flex items-center justify-between mt-2">
                    <button
                      type="button"
                      className="text-xs text-orange-500 hover:underline"
                      disabled={resendLoading}
                      onClick={async () => {
                        setResendLoading(true);
                        setResendMessage("");
                        try {
                          const emailValue = (document.getElementById("email") as HTMLInputElement)?.value;
                          if (!emailValue) {
                            setResendMessage("Please enter your email above first.");
                            setResendLoading(false);
                            return;
                          }
                          const { error } = await supabase.auth.resend({
                            type: "signup",
                            email: emailValue,
                          });
                          if (error) {
                            setResendMessage("Failed to resend confirmation email. " + error.message);
                          } else {
                            setResendMessage("If your account exists and is not confirmed, a new confirmation email has been sent.");
                          }
                        } catch (err) {
                          setResendMessage("Something went wrong. Please try again.");
                        }
                        setResendLoading(false);
                      }}
                    >
                      {resendLoading ? "Sending..." : "Resend confirmation email"}
                    </button>
                  </div>
                  {resendMessage && (
                    <div className="text-xs text-muted-foreground mt-1">{resendMessage}</div>
                  )}
                  {/* --- End Resend Confirmation Email Button --- */}

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

              <TabsContent value="phone">
                <Card className="p-6">
                  <form onSubmit={handleSubmitPhone(onSubmitPhone)} className="space-y-4">
                    <div className="space-y-2">
                      <Controller
                        name="phone"
                        control={controlPhone}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <PhoneInput
                            {...field}
                            country={'et'}
                            inputProps={{
                              name: 'phone',
                              required: true,
                              autoFocus: true,
                              className: phoneErrors.phone ? "border-red-500" : ""
                            }}
                            onChange={field.onChange}
                            value={field.value}
                            enableSearch
                            containerClass="custom-phone-input w-full"
                            inputClass="w-full"
                            buttonClass="bg-white"
                            dropdownClass="bg-white"
                            placeholder="e.g. 912345678"
                            inputStyle={{
                              height: '48px',
                              fontSize: '1rem',
                              paddingLeft: '56px',
                              borderRadius: '0.5rem',
                              border: phoneErrors.phone ? '1.5px solid #ef4444' : '1.5px solid #E5E8E8',
                            }}
                            buttonStyle={{
                              borderTopLeftRadius: '0.5rem',
                              borderBottomLeftRadius: '0.5rem',
                              borderRight: 'none',
                              background: '#fff',
                              paddingLeft: '12px',
                              paddingRight: '8px',
                            }}
                            countryCodeEditable={false}
                          />
                        )}
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
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Card>
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
                New to Tabor Academy?{" "}
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