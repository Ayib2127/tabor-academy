"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SupabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authStatus, setAuthStatus] = useState<string>("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test the connection by querying the profiles table
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setConnectionStatus("error");
          setErrorMessage(error.message);
          return;
        }
        
        setConnectionStatus("success");
        setData(data);
      } catch (error) {
        console.error("Unexpected error:", error);
        setConnectionStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "Unknown error");
      }
    }

    testConnection();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus("loading");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setAuthStatus("success");
      console.log("Signup successful:", data);
    } catch (error: any) {
      setAuthStatus("error");
      console.error("Signup error:", error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStatus("loading");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setAuthStatus("success");
      console.log("Sign in successful:", data);
    } catch (error: any) {
      setAuthStatus("error");
      console.error("Sign in error:", error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setAuthStatus("signed_out");
    } catch (error: any) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
                  {connectionStatus === "loading" && (
                    <p className="text-yellow-500">Testing connection...</p>
                  )}
                  {connectionStatus === "success" && (
                    <p className="text-green-500">Connection successful!</p>
                  )}
                  {connectionStatus === "error" && (
                    <div>
                      <p className="text-red-500">Connection failed</p>
                      {errorMessage && (
                        <p className="text-sm mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          Error: {errorMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {connectionStatus === "success" && data && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Data</h2>
                    <pre className="p-4 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div>
                  <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
                  <p>
                    <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{" "}
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set"}
                  </p>
                  <p>
                    <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{" "}
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-2">Authentication Test</h2>
                
                {session ? (
                  <div>
                    <p className="text-green-500 mb-4">✅ Signed in as: {session.user.email}</p>
                    <Button onClick={handleSignOut}>Sign Out</Button>
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={handleSignUp}>Sign Up</Button>
                      <Button onClick={handleSignIn}>Sign In</Button>
                    </div>
                    {authStatus === "loading" && (
                      <p className="text-yellow-500">Processing...</p>
                    )}
                    {authStatus === "success" && (
                      <p className="text-green-500">Operation successful!</p>
                    )}
                    {authStatus === "error" && (
                      <p className="text-red-500">Operation failed</p>
                    )}
                  </form>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}