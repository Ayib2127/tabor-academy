'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Lightbulb, ArrowRight } from 'lucide-react';

export function AIDemoCard() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessIdea.trim()) return;

    setIsLoading(true);
    setHasSubmitted(true);

    try {
      const res = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessIdea }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data.refinedIdea);
      } else {
        setResponse('Sorry, there was an error processing your idea. Please try again.');
      }
    } catch (error) {
      setResponse('Sorry, there was an error processing your idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBusinessIdea('');
    setResponse('');
    setHasSubmitted(false);
  };

  return (
    <Card className="relative overflow-hidden border-2 border-[#4ECDC4]/20 bg-gradient-to-br from-[#4ECDC4]/5 to-[#FF6B35]/5 hover:border-[#4ECDC4]/40 transition-all duration-300">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#4ECDC4]/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#FF6B35]/10 rounded-full blur-xl animate-pulse delay-1000" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-medium text-[#4ECDC4] uppercase tracking-wide">
            AI-Powered Demo
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-[#2C3E50]">
          Refine Your Business Idea
        </CardTitle>
        <p className="text-sm text-[#2C3E50]/70">
          Experience our AI mentor in action. Share your business idea and get instant, personalized feedback.
        </p>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="e.g., I want to start a food business..."
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={!businessIdea.trim() || isLoading}
              className="w-full bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white transition-all duration-300 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  AI is thinking...
                </>
              ) : (
                <>
                  Get AI Feedback
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center mx-auto">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                  <p className="text-sm text-[#2C3E50]/70">
                    Our AI mentor is analyzing your idea...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/50 rounded-lg p-4 border border-[#E5E8E8]">
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-[#FF6B35] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#2C3E50] text-sm">AI Mentor Feedback:</h4>
                    </div>
                  </div>
                  <p className="text-sm text-[#2C3E50]/80 leading-relaxed">
                    {response}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white"
                  >
                    Try Another Idea
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className="flex-1 bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white"
                  >
                    <a href="/signup">Start Learning</a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demo indicator */}
        <div className="text-center pt-2">
          <span className="text-xs text-[#2C3E50]/50">
            ✨ This is just a taste of our AI-powered learning experience
          </span>
        </div>
      </CardContent>
    </Card>
  );
}