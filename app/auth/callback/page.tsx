"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, AlertCircle, ChevronLeft, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type AuthState = "loading" | "linking" | "completing" | "success" | "error"

function SocialAuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authState, setAuthState] = useState<AuthState>("loading")
  const [error, setError] = useState("")
  const provider = searchParams.get("provider") || "social"
  const isExistingUser = searchParams.get("existing") === "true"

  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // After successful authentication callback, get user session
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
           const user = session.user;
           console.log('User session obtained:', user);

          if (user) {
            console.log('Fetching user data for user ID:', user.id);
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('role')
              .eq('id', user.id)
              .single()

            if (userError) {
              console.error('Error fetching user data:', userError)
              setAuthState("error")
              setError("Failed to fetch user data. Please try again.")
              return
            }

            if (userData) {
              console.log('User data fetched, user role:', userData.role);
              // Redirect based on role
              if (userData.role === 'admin') {
                console.log('Redirecting to admin dashboard');
                router.push('/dashboard/admin')
              } else if (userData.role === 'mentor') {
                console.log('Redirecting to mentor dashboard');
                router.push('/dashboard/mentor')
              } else if (userData.role === 'instructor') {
                console.log('Redirecting to instructor dashboard');
                router.push('/dashboard/instructor')
              } else {
                console.log('Redirecting to default dashboard');
                // Default to student dashboard for other roles or if role is null/undefined
                router.push('/dashboard')
              }
            } else {
              // If no user data found, maybe redirect to profile completion or handle as error
              console.log('No user data found for user:', user.id);
              setAuthState("error")
              setError("User data not found.")
            }

          } else {
             // Handle case where session exists but user object is null (shouldn't happen often)
             console.log('Session exists but user object is null.');
             setAuthState("error")
             setError("User object not found in session.")
          }

        } else {
           // Handle case where no session is found after callback
           console.log('No session found after callback.');
           setAuthState("error")
           setError("Authentication failed: No session.")
           // Optionally redirect to login if no session
           // router.push('/login');
        }

      } catch (err) {
        console.error('Authentication callback error:', err);
        setAuthState("error")
        setError("Authentication failed. Please try again.")
      }
    }

    handleAuth()
  }, [router, supabase]) // Simplified dependency array, removed isExistingUser

  const handleAccountLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthState("loading")
    
    try {
      // Simulate API call for account linking
      await new Promise(resolve => setTimeout(resolve, 2000))
      setAuthState("success")
    } catch (err) {
      setAuthState("error")
      setError("Failed to link account. Please try again.")
    }
  }

  const handleProfileComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthState("loading")
    
    try {
      // Simulate API call for profile completion
      await new Promise(resolve => setTimeout(resolve, 2000))
      setAuthState("success")
    } catch (err) {
      setAuthState("error")
      setError("Failed to complete profile. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="container max-w-lg py-10">
          <Card className="p-6">
            {authState === "loading" && (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  Connecting Your Account
                </h2>
                <p className="text-muted-foreground">
                  Please wait while we authenticate your {provider} account...
                </p>
              </div>
            )}

            {authState === "linking" && (
              <div className="space-y-6">
                <div className="text-center">
                  <LinkIcon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold gradient-text mb-2">
                    Link Your Account
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Connect your {provider} account with your existing Tabor Digital Academy account
                  </p>
                </div>

                <form onSubmit={handleAccountLink} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                  >
                    Link Account
                  </Button>
                </form>
              </div>
            )}

            {authState === "completing" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold gradient-text mb-2">
                    Complete Your Profile
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Please provide additional information to complete your registration
                  </p>
                </div>

                <form onSubmit={handleProfileComplete} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" required />
                    <p className="text-xs text-muted-foreground">
                      Required for account security and SMS notifications
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select your country</option>
                      <option value="KE">Kenya</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                      <option value="ZA">South Africa</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400"
                  >
                    Complete Profile
                  </Button>
                </form>
              </div>
            )}

            {authState === "success" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Authentication Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Your account has been successfully authenticated. Redirecting...
                </p>
              </div>
            )}

            {authState === "error" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Authentication Failed</h2>
                <p className="text-red-500 mb-6">{error}</p>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setAuthState("loading")}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    asChild
                  >
                    <Link href="/login">Return to Login</Link>
                  </Button>
                </div>
              </div>
            )}

            {["linking", "completing"].includes(authState) && (
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Having trouble? <Link href="/contact" className="text-orange-500 hover:underline">Contact Support</Link>
                </p>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function SocialAuthCallback() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <SocialAuthCallbackInner />
    </Suspense>
  )
}