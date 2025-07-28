"use client"

import { useState, useRef, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Users,
  Star,
  MessageSquare,
  ChevronRight,
  Save,
  Eye,
  Download,
  Edit,
  Trash2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

// Mock assignment data
const assignment = {
  id: 1,
  title: "Digital Marketing Campaign Analysis",
  course: "Digital Marketing Mastery",
  module: "Campaign Strategy",
  dueDate: "2024-03-15T23:59:59",
  timeLeft: "5 days",
  status: "in-progress",
  description: "Analyze a successful digital marketing campaign from an Ethiopian brand and create a detailed case study highlighting key strategies, metrics, and learnings.",
  objectives: [
    "Identify key success factors in the campaign",
    "Analyze target audience and messaging strategy",
    "Evaluate campaign metrics and ROI",
    "Provide actionable recommendations"
  ],
  requirements: [
    {
      type: "document",
      description: "Case study report (PDF, 5-10 pages)",
      required: true
    },
    {
      type: "presentation",
      description: "Campaign analysis slides (PPT/PDF)",
      required: true
    },
    {
      type: "link",
      description: "Campaign URL or reference materials",
      required: false
    }
  ],
  rubric: [
    {
      criterion: "Research Depth",
      weight: 25,
      description: "Thorough analysis of campaign elements"
    },
    {
      criterion: "Data Analysis",
      weight: 25,
      description: "Effective use of metrics and insights"
    },
    {
      criterion: "Recommendations",
      weight: 25,
      description: "Quality and feasibility of suggestions"
    },
    {
      criterion: "Presentation",
      weight: 25,
      description: "Clear and professional documentation"
    }
  ],
  resources: [
    {
      name: "Case Study Template",
      type: "DOCX",
      size: "245 KB",
      url: "#"
    },
    {
      name: "Analysis Framework",
      type: "PDF",
      size: "1.2 MB",
      url: "#"
    },
    {
      name: "Metrics Guide",
      type: "PDF",
      size: "850 KB",
      url: "#"
    }
  ],
  submissions: [
    {
      id: 1,
      filename: "campaign-analysis-draft.pdf",
      size: "2.4 MB",
      uploadedAt: "2024-02-28T14:30:00",
      status: "draft"
    }
  ],
  peerReviews: {
    required: 2,
    completed: 0,
    deadline: "2024-03-20T23:59:59"
  },
  submission_types: ['file', 'text', 'link'] // Added for dynamic submission types
}

export default function AssignmentSubmissionPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showRubric, setShowRubric] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editorContent, setEditorContent] = useState("")
  const [checklist, setChecklist] = useState({
    requirements: false,
    plagiarism: false,
    final: false
  })
  const [linkValue, setLinkValue] = useState("") // Added for link submission

  // Restore draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(`assignment-submission-draft-${assignment.id}`);
    if (draft) {
      const { text, link, files: savedFiles } = JSON.parse(draft);
      setEditorContent(text || '');
      setLinkValue(link || '');
      // File restoration is limited by browser security, so only restore text/link
    }
  }, [assignment.id]);

  // Auto-save on change
  useEffect(() => {
    localStorage.setItem(
      `assignment-submission-draft-${assignment.id}`,
      JSON.stringify({ text: editorContent, link: linkValue })
    );
  }, [editorContent, linkValue, assignment.id]);

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles])
    // simulateUpload() // Removed simulateUpload
  }

  // Removed simulateUpload function

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = new FormData();
      // These would be dynamic in a real app
      formData.append('courseId', assignment.course);
      formData.append('assignmentId', assignment.id.toString());
      files.forEach((file) => formData.append('files', file));
      const response = await fetch('/api/assignments/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload assignment files');
      }
      const data = await response.json();
      // Optionally: Show uploaded file URLs or update UI
      setFiles([]);
      setUploadProgress(100);
      toast.success('Assignment submitted successfully!');
      localStorage.removeItem(`assignment-submission-draft-${assignment.id}`);
    } catch (error) {
      console.error('Assignment upload error:', error);
      if ((error as any).code) {
        showApiErrorToast({
          code: (error as any).code,
          error: (error as any).message,
          details: (error as any).details,
          assignmentId: assignment.id,
        });
      } else {
        toast.error('Failed to submit assignment');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Assignment Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/courses" className="hover:text-foreground">Courses</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/courses/${assignment.course}`} className="hover:text-foreground">
                {assignment.course}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span>{assignment.module}</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-500">{assignment.timeLeft} remaining</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={() => setShowRubric(!showRubric)}>
                View Rubric
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Assignment Brief */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Assignment Brief</h2>
                <p className="text-muted-foreground mb-6">{assignment.description}</p>
                
                <h3 className="font-semibold mb-3">Learning Objectives</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                  {assignment.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mb-3">Submission Requirements</h3>
                <div className="space-y-3">
                  {assignment.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{req.description}</p>
                        {req.required && (
                          <span className="text-sm text-orange-500">Required</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* File Upload */}
              {assignment.submission_types?.includes('file') && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Submit Your Work</h2>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${
                      isDragging ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop your files here, or{" "}
                      <button
                        className="text-primary hover:underline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        browse
                      </button>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOCX, PPT, JPG, PNG (max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileInput}
                    />
                  </div>

                  {/* Uploaded Files */}
                  {files.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </Card>
              )}

              {assignment.submission_types?.includes('text') && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Text Entry</h2>
                  <Label className="text-[#2C3E50] font-semibold">Text Entry</Label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={editorContent}
                    onChange={e => setEditorContent(e.target.value)}
                    placeholder="Type or paste your answer here..."
                    rows={6}
                  />
                </Card>
              )}

              {assignment.submission_types?.includes('link') && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Link Submission</h2>
                  <Label className="text-[#2C3E50] font-semibold">Link Submission</Label>
                  <Input
                    type="url"
                    className="input input-bordered w-full"
                    value={linkValue}
                    onChange={e => setLinkValue(e.target.value)}
                    placeholder="Paste your submission link (e.g., Google Docs, YouTube, etc.)"
                  />
                </Card>
              )}

              {/* Submission Checklist */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold">Before Submitting</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="requirements"
                      checked={checklist.requirements}
                      onCheckedChange={(checked) =>
                        setChecklist(prev => ({ ...prev, requirements: checked as boolean }))
                      }
                    />
                    <Label htmlFor="requirements" className="leading-none">
                      I have reviewed all requirements and included all necessary files
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="plagiarism"
                      checked={checklist.plagiarism}
                      onCheckedChange={(checked) =>
                        setChecklist(prev => ({ ...prev, plagiarism: checked as boolean }))
                      }
                    />
                    <Label htmlFor="plagiarism" className="leading-none">
                      I confirm this is my own work and I have cited all sources
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="final"
                      checked={checklist.final}
                      onCheckedChange={(checked) =>
                        setChecklist(prev => ({ ...prev, final: checked as boolean }))
                      }
                    />
                    <Label htmlFor="final" className="leading-none">
                      I understand this is my final submission
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    files.length === 0 ||
                    !Object.values(checklist).every(Boolean)
                  }
                >
                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resources */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Resources</h2>
                <div className="space-y-4">
                  {assignment.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{resource.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.type} • {resource.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Rubric */}
              <Card className={`p-6 ${showRubric ? '' : 'hidden'}`}>
                <h2 className="text-lg font-semibold mb-4">Grading Rubric</h2>
                <div className="space-y-4">
                  {assignment.rubric.map((criterion, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{criterion.criterion}</span>
                        <span className="text-sm text-muted-foreground">
                          {criterion.weight}%
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {criterion.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Peer Reviews */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Peer Reviews</h2>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You need to complete {assignment.peerReviews.required} peer reviews
                    by {new Date(assignment.peerReviews.deadline).toLocaleDateString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <span>Reviews Completed</span>
                    <span>
                      {assignment.peerReviews.completed}/{assignment.peerReviews.required}
                    </span>
                  </div>
                  <Button className="w-full">
                    Start Peer Review
                  </Button>
                </div>
              </Card>

              {/* Help & Support */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    View Guidelines
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}