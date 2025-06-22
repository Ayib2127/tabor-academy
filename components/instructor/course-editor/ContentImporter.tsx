import { FC, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Upload,
  FileText,
  Sparkles,
  Wand2,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  BookOpen,
  Target,
  Clock,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentImporterProps {
  onCourseGenerated: (courseData: any) => void;
  onClose: () => void;
}

interface ImportedFile {
  file: File;
  content: string;
  wordCount: number;
  status: 'processing' | 'ready' | 'error';
}

interface GeneratedCourse {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: string;
  modules: Array<{
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      type: 'text' | 'video' | 'quiz';
      content?: any;
      duration?: number;
    }>;
  }>;
  learningObjectives: string[];
  prerequisites: string[];
}

const ContentImporter: FC<ContentImporterProps> = ({
  onCourseGenerated,
  onClose,
}) => {
  const [importedFiles, setImportedFiles] = useState<ImportedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [generatedCourse, setGeneratedCourse] = useState<GeneratedCourse | null>(null);
  const [customInstructions, setCustomInstructions] = useState('');
  const [courseType, setCourseType] = useState<'self_paced' | 'cohort'>('self_paced');

  // File processing
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: ImportedFile[] = [];

    for (const file of acceptedFiles) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      const fileData: ImportedFile = {
        file,
        content: '',
        wordCount: 0,
        status: 'processing',
      };

      newFiles.push(fileData);
    }

    setImportedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (let i = 0; i < newFiles.length; i++) {
      const fileData = newFiles[i];
      try {
        const content = await extractTextFromFile(fileData.file);
        const wordCount = content.split(/\s+/).length;

        setImportedFiles(prev => 
          prev.map(f => 
            f.file === fileData.file 
              ? { ...f, content, wordCount, status: 'ready' }
              : f
          )
        );

        toast.success(`${fileData.file.name} processed successfully`);
      } catch (error) {
        console.error('File processing error:', error);
        setImportedFiles(prev => 
          prev.map(f => 
            f.file === fileData.file 
              ? { ...f, status: 'error' }
              : f
          )
        );
        toast.error(`Failed to process ${fileData.file.name}`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
    },
    multiple: true,
  });

  // Extract text from different file types
  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        if (file.type === 'text/plain' || file.type === 'text/markdown') {
          resolve(content);
        } else if (file.type === 'application/pdf') {
          // For PDF files, we'd need a PDF parser library
          // For now, we'll ask the user to convert to text
          reject(new Error('PDF files need to be converted to text format first'));
        } else {
          // For Word documents, we'd need a proper parser
          // For now, we'll ask the user to convert to text
          reject(new Error('Word documents need to be converted to text format first'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Generate course from imported content
  const handleGenerateCourse = async () => {
    const readyFiles = importedFiles.filter(f => f.status === 'ready');
    
    if (readyFiles.length === 0) {
      toast.error('Please import and process at least one file first');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Step 1: Combine all content
      setProcessingStep('Analyzing content...');
      setProgress(20);

      const combinedContent = readyFiles
        .map(f => `=== ${f.file.name} ===\n${f.content}`)
        .join('\n\n');

      const totalWords = readyFiles.reduce((sum, f) => sum + f.wordCount, 0);

      // Step 2: Generate course structure
      setProcessingStep('Generating course structure...');
      setProgress(40);

      const response = await fetch('/api/ai/import-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: combinedContent,
          customInstructions,
          courseType,
          wordCount: totalWords,
          fileCount: readyFiles.length,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate course');
      }

      setProcessingStep('Structuring modules and lessons...');
      setProgress(70);

      const result = await response.json();

      setProcessingStep('Finalizing course...');
      setProgress(90);

      // Add some delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      setGeneratedCourse(result.course);
      setProgress(100);
      setProcessingStep('Course generated successfully!');

      toast.success('Course generated successfully from your content!');

    } catch (error: any) {
      console.error('Course generation error:', error);
      toast.error(error.message || 'Failed to generate course. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply generated course
  const handleApplyCourse = () => {
    if (!generatedCourse) return;

    onCourseGenerated(generatedCourse);
    toast.success('Course structure applied successfully!');
    onClose();
  };

  // Remove file
  const handleRemoveFile = (fileToRemove: File) => {
    setImportedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const getTotalWordCount = () => {
    return importedFiles
      .filter(f => f.status === 'ready')
      .reduce((sum, f) => sum + f.wordCount, 0);
  };

  const getEstimatedLessons = () => {
    const wordCount = getTotalWordCount();
    return Math.ceil(wordCount / 500); // Estimate 1 lesson per 500 words
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              <CardTitle className="text-[#2C3E50]">AI Course Builder</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-[#2C3E50]/60">
            Upload your content and let AI create a complete course structure for you
          </p>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {!generatedCourse ? (
            <>
              {/* File Upload Area */}
              <div>
                <Label className="text-[#2C3E50] font-semibold mb-3 block">
                  Upload Your Content
                </Label>
                <div
                  {...getRootProps()}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive 
                      ? 'border-[#4ECDC4] bg-[#4ECDC4]/5' 
                      : 'border-[#E5E8E8] hover:border-[#4ECDC4]/50'
                    }
                  `}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                  <div>
                    <p className="text-lg font-medium text-[#2C3E50] mb-2">
                      {isDragActive ? 'Drop your files here' : 'Drag & drop your content files'}
                    </p>
                    <p className="text-sm text-[#2C3E50]/60 mb-2">
                      or click to select files
                    </p>
                    <p className="text-xs text-[#2C3E50]/40">
                      Supported: TXT, MD, PDF, DOC, DOCX (Max 10MB each)
                    </p>
                  </div>
                </div>
              </div>

              {/* Imported Files */}
              {importedFiles.length > 0 && (
                <div>
                  <Label className="text-[#2C3E50] font-semibold mb-3 block">
                    Imported Files ({importedFiles.length})
                  </Label>
                  <div className="space-y-3">
                    {importedFiles.map((fileData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#F7F9F9] rounded-lg border border-[#E5E8E8]"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#4ECDC4]" />
                          <div>
                            <p className="font-medium text-[#2C3E50]">{fileData.file.name}</p>
                            <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                              <span>{(fileData.file.size / 1024).toFixed(1)} KB</span>
                              {fileData.status === 'ready' && (
                                <span>• {fileData.wordCount} words</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {fileData.status === 'processing' && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          )}
                          {fileData.status === 'ready' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {fileData.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveFile(fileData.file)}
                            className="h-6 w-6 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Content Summary */}
                  {getTotalWordCount() > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Content Summary</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-700">{getTotalWordCount()}</div>
                          <div className="text-blue-600">Total Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-700">{getEstimatedLessons()}</div>
                          <div className="text-blue-600">Est. Lessons</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-700">{Math.ceil(getEstimatedLessons() / 3)}</div>
                          <div className="text-blue-600">Est. Modules</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Instructions */}
              <div>
                <Label htmlFor="custom-instructions" className="text-[#2C3E50] font-semibold">
                  Custom Instructions (Optional)
                </Label>
                <Textarea
                  id="custom-instructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Provide specific instructions for how you want the course structured. For example: 'Focus on practical examples', 'Include quizzes after each module', 'Target beginner level', etc."
                  className="mt-2 border-[#E5E8E8] focus:border-[#4ECDC4]"
                  rows={3}
                />
              </div>

              {/* Course Type Selection */}
              <div>
                <Label className="text-[#2C3E50] font-semibold mb-3 block">
                  Course Type
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={courseType === 'self_paced' ? 'default' : 'outline'}
                    onClick={() => setCourseType('self_paced')}
                    className={`h-auto p-4 ${
                      courseType === 'self_paced' 
                        ? 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white' 
                        : 'border-[#E5E8E8] hover:border-[#4ECDC4]'
                    }`}
                  >
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Self-Paced</div>
                      <div className="text-xs opacity-80">Students learn at their own pace</div>
                    </div>
                  </Button>
                  <Button
                    variant={courseType === 'cohort' ? 'default' : 'outline'}
                    onClick={() => setCourseType('cohort')}
                    className={`h-auto p-4 ${
                      courseType === 'cohort' 
                        ? 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white' 
                        : 'border-[#E5E8E8] hover:border-[#4ECDC4]'
                    }`}
                  >
                    <div className="text-center">
                      <Users className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold">Cohort</div>
                      <div className="text-xs opacity-80">Structured timeline with groups</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleGenerateCourse}
                  disabled={isProcessing || importedFiles.filter(f => f.status === 'ready').length === 0}
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Course...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Course with AI
                    </>
                  )}
                </Button>
              </div>

              {/* Processing Progress */}
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#2C3E50]/70">{processingStep}</span>
                    <span className="text-[#2C3E50]/70">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </>
          ) : (
            /* Generated Course Preview */
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Course Generated Successfully!</h3>
                <p className="text-[#2C3E50]/60">
                  Review the generated course structure below and apply it to your course builder.
                </p>
              </div>

              {/* Course Overview */}
              <Card className="border-[#E5E8E8]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#2C3E50]">{generatedCourse.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
                      {generatedCourse.level}
                    </Badge>
                    <Badge variant="outline" className="border-[#FF6B35]/30 text-[#FF6B35]">
                      {generatedCourse.category}
                    </Badge>
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      {generatedCourse.estimatedDuration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#2C3E50]/80 mb-4">{generatedCourse.description}</p>
                  
                  {/* Learning Objectives */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#2C3E50] mb-2">Learning Objectives:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-[#2C3E50]/70">
                      {generatedCourse.learningObjectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prerequisites */}
                  {generatedCourse.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[#2C3E50] mb-2">Prerequisites:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-[#2C3E50]/70">
                        {generatedCourse.prerequisites.map((prerequisite, index) => (
                          <li key={index}>{prerequisite}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modules */}
              <div>
                <h4 className="text-lg font-semibold text-[#2C3E50] mb-4">
                  Course Modules ({generatedCourse.modules.length})
                </h4>
                <div className="space-y-4">
                  {generatedCourse.modules.map((module, moduleIndex) => (
                    <Card key={moduleIndex} className="border-[#E5E8E8]">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {moduleIndex + 1}
                          </div>
                          <div>
                            <CardTitle className="text-[#2C3E50]">{module.title}</CardTitle>
                            <p className="text-sm text-[#2C3E50]/60 mt-1">{module.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center gap-3 p-2 bg-[#F7F9F9] rounded"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#2C3E50]/60 w-6">
                                  {lessonIndex + 1}.
                                </span>
                                {lesson.type === 'text' && <FileText className="w-4 h-4 text-[#4ECDC4]" />}
                                {lesson.type === 'video' && <BookOpen className="w-4 h-4 text-[#FF6B35]" />}
                                {lesson.type === 'quiz' && <Target className="w-4 h-4 text-purple-500" />}
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-[#2C3E50]">
                                  {lesson.title}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.type}
                                  </Badge>
                                  {lesson.duration && (
                                    <span className="text-xs text-[#2C3E50]/60">
                                      {lesson.duration} min
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleApplyCourse}
                  className="flex-1 bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Course Structure
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setGeneratedCourse(null)}
                  className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                >
                  Generate Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentImporter;