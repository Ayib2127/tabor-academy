"use client";

import { FC, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sparkles,
  RefreshCw,
  Zap,
  FileText,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Bot,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Brain,
  Target,
  Palette,
  Code,
  Globe,
  Users,
  Award,
  Star,
  Heart,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Zap as ZapIcon,
  Lightbulb as LightbulbIcon,
  Target as TargetIcon,
  Palette as PaletteIcon,
  Code as CodeIcon,
  Globe as GlobeIcon,
  Users as UsersIcon,
  Award as AwardIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Eye as EyeIcon,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  Activity as ActivityIcon,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIAssistantProps {
  selectedText?: string;
  onContentGenerated: (content: any) => void;
  onQuizGenerated: (quiz: any) => void;
  lessonType?: 'text' | 'video' | 'quiz';
  lessonTitle?: string;
  moduleTitle?: string;
  currentContent?: any;
  isVisible?: boolean;
}

interface AIAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'rewrite' | 'expand' | 'summarize' | 'quiz' | 'outline' | 'improve';
  requiresInput?: boolean;
}

interface AIResponse {
  content: any;
  type: 'text' | 'quiz';
  confidence: number;
  suggestions?: string[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const AIAssistant: FC<AIAssistantProps> = ({
  selectedText,
  onContentGenerated,
  onQuizGenerated,
  lessonType,
  lessonTitle,
  moduleTitle,
  currentContent,
  isVisible = true,
}) => {
  // All hooks must be called at the top level
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<AIResponse | null>(null);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [copiedContent, setCopiedContent] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(5);

  const assistantRef = useRef<HTMLDivElement>(null);

  // AI Actions available based on context
  const aiActions: AIAction[] = [
    {
      id: 'rewrite',
      title: 'Rewrite',
      description: 'Improve clarity and engagement',
      icon: <RefreshCw className="w-4 h-4" />,
      type: 'rewrite',
      requiresInput: true,
    },
    {
      id: 'expand',
      title: 'Expand',
      description: 'Add more detail and examples',
      icon: <Zap className="w-4 h-4" />,
      type: 'expand',
      requiresInput: true,
    },
    {
      id: 'summarize',
      title: 'Summarize',
      description: 'Create a concise summary',
      icon: <FileText className="w-4 h-4" />,
      type: 'summarize',
      requiresInput: true,
    },
    {
      id: 'quiz',
      title: 'Create Quiz',
      description: 'Generate quiz questions',
      icon: <HelpCircle className="w-4 h-4" />,
      type: 'quiz',
      requiresInput: true,
    },
    {
      id: 'outline',
      title: 'Create Outline',
      description: 'Generate lesson structure',
      icon: <BookOpen className="w-4 h-4" />,
      type: 'outline',
      requiresInput: false,
    },
    {
      id: 'improve',
      title: 'Improve',
      description: 'Enhance readability and flow',
      icon: <Lightbulb className="w-4 h-4" />,
      type: 'improve',
      requiresInput: true,
    },
  ];

  // Real AI API call
  const callAI = async (action: string, input?: string, customPrompt?: string): Promise<AIResponse> => {
    const requestBody: any = {
      action,
      input: input || selectedText || currentContent,
      customPrompt,
    };

    // Add specific parameters for different actions
    if (action === 'quiz') {
      requestBody.questionCount = questionCount;
    }

    if (action === 'outline') {
      requestBody.title = lessonTitle || 'Lesson Outline';
      requestBody.description = moduleTitle;
    }

    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate AI content');
    }

    return await response.json();
  };

  const handleAIAction = async (actionId: string) => {
    const action = aiActions.find(a => a.id === actionId);
    if (!action) return;

    setActiveAction(actionId);
    setIsLoading(true);

    try {
      const response = await callAI(action.type);
      setGeneratedContent(response);
      setIsOpen(true);
    } catch (error) {
      console.error('AI action failed:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleCustomAIAction = async () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter a custom prompt');
      return;
    }

    setIsLoading(true);
    try {
      const response = await callAI('custom', undefined, customPrompt);
      setGeneratedContent(response);
      setIsOpen(true);
      setShowCustomPrompt(false);
      setCustomPrompt('');
    } catch (error) {
      console.error('Custom AI action failed:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptContent = () => {
    if (!generatedContent) return;

    if (generatedContent.type === 'quiz') {
      onQuizGenerated(generatedContent.content);
    } else {
      onContentGenerated(generatedContent.content);
    }

    setGeneratedContent(null);
    setIsOpen(false);
    toast.success('Content applied successfully!');
  };

  const handleCopyContent = async () => {
    if (!generatedContent) return;

    try {
      const contentText = typeof generatedContent.content === 'string' 
        ? generatedContent.content 
        : JSON.stringify(generatedContent.content, null, 2);
      
      await navigator.clipboard.writeText(contentText);
      setCopiedContent(generatedContent.type);
      toast.success('Content copied to clipboard!');
      
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div ref={assistantRef} className="relative">
      {/* AI Assistant Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg rounded-full p-4 h-14 w-14"
        aria-label="AI Assistant"
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Sparkles className="h-6 w-6" />
        )}
      </Button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* AI Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {aiActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAIAction(action.id)}
                  disabled={isLoading}
                  className="h-auto p-3 flex flex-col items-center gap-2 text-xs"
                >
                  {action.icon}
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Custom Prompt Section */}
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Custom Prompt
                {showCustomPrompt ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
              
              {showCustomPrompt && (
                <div className="mt-3 space-y-3">
                  <Textarea
                    placeholder="Enter your custom prompt..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCustomAIAction}
                      disabled={isLoading || !customPrompt.trim()}
                      className="flex-1"
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Generate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCustomPrompt(false);
                        setCustomPrompt('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quiz Settings */}
            {lessonType === 'quiz' && (
              <div className="mb-4">
                <Label className="text-sm font-medium">Number of Questions</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Slider
                    value={[questionCount]}
                    onValueChange={(value) => setQuestionCount(value[0])}
                    max={10}
                    min={3}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{questionCount}</span>
                </div>
              </div>
            )}

            {/* Generated Content Display */}
            {generatedContent && (
              <Card className="mt-4">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Generated Content</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyContent}
                        disabled={copiedContent === generatedContent.type}
                      >
                        {copiedContent === generatedContent.type ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copiedContent === generatedContent.type ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    <pre className="text-xs bg-gray-50 p-3 rounded border">
                      {typeof generatedContent.content === 'string' 
                        ? generatedContent.content 
                        : JSON.stringify(generatedContent.content, null, 2)}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleAcceptContent}
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setGeneratedContent(null)}
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Usage Stats */}
            {generatedContent?.usage && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tokens used:</span>
                    <span>{generatedContent.usage.totalTokens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span>{(generatedContent.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;