import { FC, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sparkles,
  Wand2,
  FileText,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  X,
  Loader2,
  MessageSquare,
  BookOpen,
  Target,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

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
  if (!isVisible) return null;

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

    // Check if action requires input
    if (action.requiresInput && !selectedText && !currentContent && !customPrompt) {
      showApiErrorToast({
        code: 'VALIDATION_ERROR',
        error: 'Please select some text, add content, or provide a custom prompt',
      });
      return;
    }

    setIsLoading(true);
    setActiveAction(actionId);

    try {
      const input = selectedText || currentContent;
      const response = await callAI(actionId, input, customPrompt);
      
      setGeneratedContent(response);
      toast.success('AI content generated successfully!');
    } catch (error: any) {
      console.error('AI generation error:', error);
      if (error.code) {
        showApiErrorToast({
          code: error.code,
          error: error.message,
          details: error.details,
        });
      } else {
        toast.error(error.message || 'Failed to generate content. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const handleCustomAIAction = async () => {
    if (!customPrompt.trim()) {
      showApiErrorToast({
        code: 'VALIDATION_ERROR',
        error: 'Please provide a custom prompt',
      });
      return;
    }

    setIsLoading(true);
    setActiveAction('custom');

    try {
      const input = selectedText || currentContent;
      const response = await callAI('custom', input, customPrompt);
      
      setGeneratedContent(response);
      toast.success('AI content generated successfully!');
    } catch (error: any) {
      console.error('AI generation error:', error);
      if (error.code) {
        showApiErrorToast({
          code: error.code,
          error: error.message,
          details: error.details,
        });
      } else {
        toast.error(error.message || 'Failed to generate content. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setActiveAction(null);
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
      const textContent = JSON.stringify(generatedContent.content, null, 2);
      await navigator.clipboard.writeText(textContent);
      setCopiedContent(generatedContent.content);
      toast.success('Content copied to clipboard!');
      
      setTimeout(() => setCopiedContent(null), 2000);
    } catch (error) {
      showApiErrorToast({
        code: 'INTERNAL_ERROR',
        error: 'Failed to copy content',
      });
    }
  };

  // Close assistant when clicking outside
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

  return (
    <div className="relative" ref={assistantRef}>
      {/* AI Assistant Trigger */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg ${
          isOpen ? 'ring-2 ring-purple-300' : ''
        }`}
        size="sm"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        AI Assistant
      </Button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <Card className="absolute top-12 right-0 w-96 z-50 shadow-xl border-purple-200">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-purple-900">AI Co-pilot</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-purple-600 hover:text-purple-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {selectedText && (
              <div className="mt-2 p-2 bg-white rounded border border-purple-200">
                <p className="text-xs text-purple-700 mb-1">Selected text:</p>
                <p className="text-sm text-gray-700 truncate">
                  {selectedText.substring(0, 100)}...
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {aiActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAIAction(action.id)}
                    disabled={isLoading}
                    className="flex items-center gap-2 h-auto p-3 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    {isLoading && activeAction === action.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      action.icon
                    )}
                    <div className="text-left">
                      <div className="text-xs font-medium">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Quiz Settings */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-sm font-semibold text-blue-900 mb-2">Quiz Settings</h5>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-blue-800">Number of Questions:</label>
                  <Select value={questionCount.toString()} onValueChange={(value) => setQuestionCount(parseInt(value))}>
                    <SelectTrigger className="w-full h-8 text-xs border-blue-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 5, 7, 10, 15].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} questions</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Custom Prompt */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomPrompt(!showCustomPrompt)}
                className="w-full justify-start text-purple-600 hover:text-purple-800 hover:bg-purple-50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Custom AI Request
              </Button>
              
              {showCustomPrompt && (
                <div className="mt-3 space-y-3">
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe what you'd like the AI to help you with..."
                    className="border-purple-200 focus:border-purple-400"
                    rows={3}
                  />
                  <Button
                    onClick={handleCustomAIAction}
                    disabled={isLoading || !customPrompt.trim()}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    Generate Content
                  </Button>
                </div>
              )}
            </div>

            {/* Generated Content Preview */}
            {generatedContent && (
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-900">
                      AI Generated Content
                    </span>
                  </div>
                  <Badge variant="outline" className="border-purple-300 text-purple-700">
                    {Math.round(generatedContent.confidence * 100)}% confidence
                  </Badge>
                </div>

                <div className="bg-white rounded border border-purple-200 p-3 mb-3 max-h-40 overflow-y-auto">
                  <div className="text-sm text-gray-700">
                    {generatedContent.type === 'quiz' ? (
                      <div>
                        <p className="font-medium mb-2">{generatedContent.content.title}</p>
                        <p className="text-xs text-gray-500">
                          {generatedContent.content.questions?.length || 0} questions generated
                        </p>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-600">Content generated successfully. Click "Apply" to use it.</p>
                      </div>
                    )}
                  </div>
                </div>

                {generatedContent.suggestions && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-purple-700 mb-1">AI Suggestions:</p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      {generatedContent.suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedContent.usage && (
                  <div className="mb-3 text-xs text-gray-500">
                    Tokens used: {generatedContent.usage.totalTokens}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAcceptContent}
                    size="sm"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Apply
                  </Button>
                  <Button
                    onClick={handleCopyContent}
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    {copiedContent === generatedContent.content ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => setGeneratedContent(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-xs font-semibold text-blue-900 mb-2">💡 AI Tips</h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Select text for context-aware suggestions</li>
                <li>• Use custom prompts for specific needs</li>
                <li>• Review AI content before applying</li>
                <li>• Combine AI suggestions with your expertise</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIAssistant;