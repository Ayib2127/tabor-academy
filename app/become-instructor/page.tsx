"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, CheckCircle, Shield, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  "Professional Background",
  "Expertise & Motivation",
  "Sample Content",
];

export default function BecomeInstructorPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    linkedin: "",
    expertise: "",
    motivation: "",
    sampleVideo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/instructor-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Submission failed.");
      }
    } catch (err) {
      setError("Submission failed. Please try again.");
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <section className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-[#4ECDC4]">Thank you for applying!</h2>
        <p className="mb-4">Your application has been received. Our team will review it and get back to you within 7-10 business days.</p>
        <p className="text-sm text-gray-500">You'll receive a confirmation email soon.</p>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#FF6B35]/10 via-[#4ECDC4]/10 to-white dark:from-[#FF6B35]/20 dark:via-[#4ECDC4]/20 dark:to-gray-900 flex flex-col items-center py-12 px-4">
      {/* Hero */}
      <section className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
          Share Your Expertise. Empower an Entrepreneur.
        </h1>
        <p className="text-lg text-[#2C3E50]/80 dark:text-white/80 mb-6">
          Become a Verified Instructor on Tabor Academy. Earn revenue, build your brand, and make a real impact on the next generation of entrepreneurs.
        </p>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl w-full grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">💸</span>
          <h3 className="font-bold mb-1">Earn Revenue</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Monetize your knowledge and get paid for every student you teach.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🌟</span>
          <h3 className="font-bold mb-1">Build Your Brand</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Grow your reputation as a thought leader in your field.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🌍</span>
          <h3 className="font-bold mb-1">Make a Real Impact</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Help entrepreneurs succeed and change lives across Africa.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl w-full mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full md:w-1/3 transition-transform hover:scale-105">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#FF6B35]/20 mb-3 text-3xl">
              📝
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[#FF6B35]">Apply</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Fill out a quick application to share your expertise and passion for teaching.
            </p>
          </div>
          {/* Arrow */}
          <span className="hidden md:block text-4xl text-[#4ECDC4]">→</span>
          {/* Step 2 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full md:w-1/3 transition-transform hover:scale-105">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#4ECDC4]/20 mb-3 text-3xl">
              🔍
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[#4ECDC4]">Get Approved</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Our team reviews your application to ensure a high-quality learning experience.
            </p>
          </div>
          {/* Arrow */}
          <span className="hidden md:block text-4xl text-[#FF6B35]">→</span>
          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full md:w-1/3 transition-transform hover:scale-105">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#FF6B35]/20 mb-3 text-3xl">
              🚀
            </div>
            <h3 className="font-semibold text-lg mb-1 text-[#FF6B35]">Create &amp; Earn</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              Start building courses, inspire learners, and earn revenue as a Verified Instructor!
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4 text-center">Instructor Application</h2>
        <form onSubmit={handleSubmit}>
          {step === 0 && (
            <div>
              <label className="block mb-2 font-medium">LinkedIn Profile or Website <span className="text-red-500">*</span></label>
              <input
                type="url"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="https://linkedin.com/in/yourprofile"
              />
              <div className="flex justify-end">
                <button type="button" onClick={nextStep} className="bg-[#4ECDC4] text-white px-4 py-2 rounded hover:bg-[#FF6B35] transition">Next</button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <label className="block mb-2 font-medium">Area of Expertise <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="expertise"
                value={form.expertise}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="e.g. Digital Marketing, AI, E-commerce"
              />
              <label className="block mb-2 font-medium">Why do you want to teach on Tabor Academy? <span className="text-red-500">*</span></label>
              <textarea
                name="motivation"
                value={form.motivation}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Share your motivation..."
                rows={4}
              />
              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">Back</button>
                <button type="button" onClick={nextStep} className="bg-[#4ECDC4] text-white px-4 py-2 rounded hover:bg-[#FF6B35] transition">Next</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block mb-2 font-medium">Sample Video (Optional)</label>
              <input
                type="url"
                name="sampleVideo"
                value={form.sampleVideo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Link to a 2-3 min video of you teaching"
              />
              <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition">Back</button>
                <button type="submit" disabled={submitting} className="bg-[#FF6B35] text-white px-4 py-2 rounded hover:bg-[#4ECDC4] transition">
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
              {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
          )}
        </form>
        </section>
       {/* 7. Pricing Section */}
      <section id="pricing" className="py-20 bg-[#F7F9F9] dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-[#4ECDC4]/10 rounded-full px-4 py-2 mb-6">
              <DollarSign className="w-4 h-4 text-[#4ECDC4]" />
              <span className="text-sm font-medium text-[#4ECDC4]">Pricing Plans</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#2C3E50] dark:text-white mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
                Learning Path
              </span>
          </h2>
            
            <p className="text-xl text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
              Start free and upgrade when you're ready. All plans include our core features 
              and access to our supportive community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 border border-[#E5E8E8] dark:border-gray-700 rounded-2xl hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#2C3E50] dark:text-white">Free Access</h3>
                <div className="text-4xl font-bold text-[#4ECDC4] mb-4">$0</div>
                <p className="text-[#2C3E50]/70 dark:text-white/70 mb-6">Perfect for getting started</p>
                <ul className="space-y-3 text-sm text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Access to 3 introductory courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Basic community access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Mobile learning app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Progress tracking</span>
                  </li>
                </ul>
                <Button className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="p-8 border-2 border-[#FF6B35] rounded-2xl hover:border-[#FF6B35]/80 transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-900 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#2C3E50] dark:text-white">Premium</h3>
                <div className="text-4xl font-bold text-[#FF6B35] mb-4">$29<span className="text-lg">/month</span></div>
                <p className="text-[#2C3E50]/70 dark:text-white/70 mb-6">For serious learners</p>
                <ul className="space-y-3 text-sm text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Access to all courses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">1-on-1 mentorship sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Project-based learning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Priority community support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Offline content access</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white" asChild>
                  <Link href="/signup?plan=premium">Start Premium</Link>
                </Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 border border-[#E5E8E8] dark:border-gray-700 rounded-2xl hover:border-[#2C3E50]/40 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#2C3E50] dark:text-white">Enterprise</h3>
                <div className="text-4xl font-bold text-[#2C3E50] dark:text-white mb-4">Custom</div>
                <p className="text-[#2C3E50]/70 dark:text-white/70 mb-6">For organizations</p>
                <ul className="space-y-3 text-sm text-left mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Custom learning paths</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Team management tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">Dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">White-label options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-[#2C3E50] dark:text-white">API access</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-[#2C3E50]/60 dark:text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1B4D3E]" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4ECDC4]" />
                <span>entrepreneurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FF6B35]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 