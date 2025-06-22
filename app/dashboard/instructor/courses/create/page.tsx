'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Upload,
  Sparkles,
  ArrowRight,
  Clock,
  Users,
  Target,
  Wand2,
} from 'lucide-react';
import ContentImporter from '@/components/instructor/course-editor/ContentImporter';
import { toast } from 'sonner';

export default function CreateCoursePage() {
  const router = useRouter();
  const [showContentImporter, setShowContentImporter] = useState(false);

  const handleManualCreate = () => {
    // Navigate to the course builder with empty state
    router.push('/dashboard/instructor/courses/create/builder');
  };

  const handleAIGenerated = (courseData: any) => {
    // Store the generated course data and navigate to builder
    sessionStorage.setItem('generatedCourseData', JSON.stringify(courseData));
    router.push('/dashboard/instructor/courses/create/builder?from=ai');
    toast.success('Course structure loaded! You can now customize and add content.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9F9] to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-4">
            Create Your Course
          </h1>
          <p className="text-xl text-[#2C3E50]/70 max-w-2xl mx-auto">
            Choose how you'd like to start building your course. You can create from scratch or let AI help you structure your existing content.
          </p>
        </div>

        {/* Creation Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Manual Creation */}
          <Card className="border-[#E5E8E8] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-6 bg-gradient-to-r from-[#4ECDC4]/5 to-[#FF6B35]/5">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center text-[#2C3E50]">
                Start from Scratch
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-[#2C3E50]/70 mb-6">
                Build your course step by step using our intuitive course builder. Perfect for creating custom, structured learning experiences.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                  <Target className="w-4 h-4 text-[#4ECDC4]" />
                  <span>Full control over course structure</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                  <Clock className="w-4 h-4 text-[#4ECDC4]" />
                  <span>Rich content editor with AI assistance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                  <Users className="w-4 h-4 text-[#4ECDC4]" />
                  <span>Interactive quizzes and assessments</span>
                </div>
              </div>

              <Button
                onClick={handleManualCreate}
                className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] hover:from-[#4ECDC4]/90 hover:to-[#FF6B35]/90 text-white"
              >
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* AI-Powered Creation */}
          <Card className="border-[#E5E8E8] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            
            <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center text-[#2C3E50]">
                Create from Content
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="text-[#2C3E50]/70 mb-6">
                Upload your existing content and let AI automatically structure it into a complete course with modules, lessons, and quizzes.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                  <Upload className="w-4 h-4 text-purple-500" />
                  <span>Upload documents, PDFs, or text files</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI generates course structure automatically</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                  <Target className="w-4 h-4 text-purple-500" />
                  <span>Smart lesson organization and quizzes</span>
                </div>
              </div>

              <Button
                onClick={() => setShowContentImporter(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Import & Generate
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-8">
            Powerful Course Creation Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-[#4ECDC4]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <h3 className="font-semibold text-[#2C3E50] mb-2">AI Co-pilot</h3>
              <p className="text-sm text-[#2C3E50]/60">
                Get AI assistance for content creation, quiz generation, and course improvement suggestions.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <h3 className="font-semibold text-[#2C3E50] mb-2">Rich Content Editor</h3>
              <p className="text-sm text-[#2C3E50]/60">
                Create engaging lessons with text, images, videos, and interactive elements.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-[#2C3E50] mb-2">Smart Assessments</h3>
              <p className="text-sm text-[#2C3E50]/60">
                Build quizzes and assessments that adapt to your content and learning objectives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Importer Modal */}
      {showContentImporter && (
        <ContentImporter
          onCourseGenerated={handleAIGenerated}
          onClose={() => setShowContentImporter(false)}
        />
      )}
    </div>
  );
}