"use client";

import { FC, useState, useRef, useEffect } from 'react';
import { Lesson } from '@/types/course';
import QuizPlayer from './QuizPlayer';
import { toast } from 'react-hot-toast';
import { QuizResults } from '@/types/quiz';
import Link from 'next/link';
import LessonContentDisplay from '@/components/student/lesson-content';
import { Play, Download, Bookmark, Share2, CheckCircle } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { showApiErrorToast } from "@/lib/utils/showApiErrorToast";

interface LessonContentProps {
  lesson: Lesson;
  isPreview?: boolean;
  completed?: boolean; // Added prop for completion status
  onLessonCompleted?: () => void; // <-- add this
}

const LessonContent: FC<LessonContentProps> = ({ lesson, isPreview = false, completed = false }) => {
  console.log('LessonContent RENDER', lesson);
  const [showCompletionAnim, setShowCompletionAnim] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notes, setNotes] = useState('');
  const [originalNotes, setOriginalNotes] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [completing, setCompleting] = useState(false);
  const [showResourcesModal, setShowResourcesModal] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<number | null>(null);
  const [quizAttemptsAllowed, setQuizAttemptsAllowed] = useState<number | null>(null);
  const [quizCheckLoading, setQuizCheckLoading] = useState(false);
  const [quizCheckError, setQuizCheckError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(completed);

  useEffect(() => {
    setIsCompleted(completed);
  }, [completed]);

  useEffect(() => {
    if (videoStarted && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoStarted]);

  // Load notes when panel opens
  useEffect(() => {
    if (showNotesPanel) {
      setLoadingNotes(true);
      // Try to fetch from API first
      fetch(`/api/lessons/${lesson.id}/notes`)
        .then(async (res) => {
          if (!res.ok) throw new Error();
          const data = await res.json();
          setNotes(data.notes || '');
          setOriginalNotes(data.notes || '');
        })
        .catch(() => {
          // Fallback: load from localStorage
          const local = localStorage.getItem(`lesson-notes-${lesson.id}`) || '';
          setNotes(local);
          setOriginalNotes(local);
        })
        .finally(() => setLoadingNotes(false));
    }
  }, [showNotesPanel, lesson.id]);

  useEffect(() => {
    if (lesson.type !== 'quiz' || !lesson.id) return;
    let isMounted = true;
    setQuizCheckLoading(true);
    setQuizCheckError(null);
    (async () => {
      try {
        // Fetch quiz config
        const { data: quiz, error: quizError } = await supabase
          .from('quizzes')
          .select('id, attemptsallowed')
          .eq('lesson_id', lesson.id)
          .single();
        if (quizError || !quiz) throw new Error('Quiz not found');
        if (!isMounted) return;
        setQuizAttemptsAllowed(quiz.attemptsallowed ?? null);
        // Fetch user attempts
        const { data: attempts, error: attemptsError } = await supabase
          .from('quiz_attempts')
          .select('id')
          .eq('quiz_id', quiz.id);
        if (attemptsError) throw new Error('Failed to fetch attempts');
        if (!isMounted) return;
        setQuizAttempts(attempts.length);
      } catch (err: any) {
        if (!isMounted) return;
        setQuizCheckError(err.message || 'Failed to check quiz attempts');
      } finally {
        if (isMounted) setQuizCheckLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [lesson.type, lesson.id]);

  const handleCompleteContinue = async () => {
    setCompleting(true);
    try {
      // Mark as completed via API
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to complete lesson");
      toast.success("Lesson marked as complete!");
      setIsCompleted(true);
      // Show completion animation
      setShowCompletionAnim(true);
      setTimeout(() => {
        setShowCompletionAnim(false);
      }, 1500);
      if (onLessonCompleted) onLessonCompleted();
    } catch (err) {
      if ((err as any).code) {
        showApiErrorToast({
          code: (err as any).code,
          error: (err as any).message,
          details: (err as any).details,
          lessonId: lesson.id,
        });
      } else {
        toast.error("Could not complete lesson.");
      }
    } finally {
      setCompleting(false);
    }
  };

  const handleTakeNotes = () => setShowNotesPanel(true);
  const handleCloseNotes = () => setShowNotesPanel(false);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      // Save to API
      const res = await fetch(`/api/lessons/${lesson.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      toast.success("Notes saved!");
      setOriginalNotes(notes);
    } catch (err) {
      // Fallback: save to localStorage
      localStorage.setItem(`lesson-notes-${lesson.id}`, notes);
      toast.success("Notes saved locally!");
      setOriginalNotes(notes);
    } finally {
      setSavingNotes(false);
      setShowNotesPanel(false);
    }
  };

  const handleResources = () => {
    if (lesson.resources && lesson.resources.length > 0) {
      setShowResourcesModal(true);
    } else {
      toast("No resources available for this lesson.");
    }
  };

  // --- Action Buttons (shared for all lesson types) ---
  const ActionButtons = (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
      <button
        className={`px-6 py-3 rounded-lg font-bold shadow-md flex items-center gap-2 transition-transform duration-200
          ${isCompleted ? 'bg-[#E5E8E8] text-[#6E6C75] cursor-not-allowed' : 'bg-[#FF6B35] text-white hover:scale-105'}`}
        onClick={handleCompleteContinue}
        disabled={completing || isCompleted}
      >
        {isCompleted ? (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Lesson Completed
          </>
        ) : completing ? (
          <>
            <span>Completing...</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Complete Lesson
          </>
        )}
      </button>
      <button
        className="px-6 py-3 rounded-lg border-2 border-[#4ECDC4] text-[#2C3E50] font-bold bg-white hover:bg-[#F7F9F9] transition"
        onClick={handleTakeNotes}
      >
        Take Notes
      </button>
      <button
        className="px-6 py-3 rounded-lg border-2 border-[#FF6B35] text-[#FF6B35] font-bold bg-white hover:bg-[#FF6B35]/10 transition flex items-center gap-2"
        onClick={handleResources}
        disabled={!lesson.resources || lesson.resources.length === 0}
      >
        <Download className="h-5 w-5" />
        Resources
      </button>
    </div>
  );

  const renderContent = () => {
    switch (lesson.type) {
      case 'video': {
        // Robustly extract video URL from lesson.content
        let videoUrl = '';
        if (lesson.content && typeof lesson.content === 'object') {
          videoUrl = (lesson.content.url || lesson.content.src) ?? '';
        } else if (typeof lesson.content === 'string') {
          try {
            const parsed = JSON.parse(lesson.content);
            videoUrl = (parsed.url || parsed.src) ?? '';
          } catch {
            videoUrl = lesson.content;
          }
        }
        return (
          <>
            {/* Add lesson title and duration for video lessons */}
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-4xl font-extrabold mb-2 text-center"
                style={{
                  background: "linear-gradient(90deg, #4ECDC4 0%, #FF6B35 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {lesson.title}
              </h1>
              {typeof lesson.duration === 'number' && (
                <div className="flex flex-row items-center gap-4 mt-2">
                  <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#FF6B35] font-semibold text-base">
                    ⏱ {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                  </span>
                </div>
              )}
            </div>
            <div className="video-container aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
              {videoUrl ? (
                <VideoPlayer src={videoUrl} poster={`/api/thumbnails/${lesson.id}`} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  Video content not available
                  <BackToCourseButton courseId={lesson['course_id']} />
                </div>
              )}
            </div>
            {ActionButtons}
          </>
        );
      }
      case 'text': {
        if (!lesson.content) {
          return (
            <div className="flex flex-col items-center text-gray-500">
              No content available
              <BackToCourseButton courseId={lesson['course_id']} />
            </div>
          );
        }
        let tiptapContent = null;
        if (typeof lesson.content === 'object' && lesson.content.type === 'doc') {
          tiptapContent = lesson.content;
        } else if (typeof lesson.content === 'string') {
          try {
            const parsed = JSON.parse(lesson.content);
            if (parsed && parsed.type === 'doc') tiptapContent = parsed;
          } catch {}
        }
        return (
          <div className="text-container">
            {tiptapContent ? (
              <LessonContentDisplay content={tiptapContent} type="text" />
            ) : (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            )}
            {ActionButtons}
          </div>
        );
      }
      case 'quiz': {
        let quizContent = null;
        if (typeof lesson.content === 'object' && lesson.content !== null) {
          quizContent = lesson.content;
        } else if (typeof lesson.content === 'string') {
          try {
            quizContent = JSON.parse(lesson.content);
          } catch { quizContent = null; }
        }
        if (quizCheckLoading) {
          return <div className="flex flex-col items-center text-gray-500">Checking quiz attempts...</div>;
        }
        if (quizCheckError) {
          return <div className="flex flex-col items-center text-red-500">{quizCheckError}</div>;
        }
        if (
          quizAttemptsAllowed !== null &&
          quizAttempts !== null &&
          quizAttempts >= quizAttemptsAllowed
        ) {
          // Instead of just showing a message, show the results page
          // Try to get saved results from localStorage
          const savedResults = localStorage.getItem(`quiz-results-${lesson.id}`);
          if (savedResults) {
            return (
              <>
                <QuizPlayer
                  quiz={quizContent}
                  onComplete={() => {}}
                />
                {ActionButtons}
              </>
            );
          } else {
            // Generate a default results object with all answers incorrect
            const defaultResults = {
              score: 0,
              correctAnswers: 0,
              totalQuestions: quizContent?.questions?.length || 0,
              timeSpent: 0,
              answers: (quizContent?.questions || []).map((q: any) => ({
                questionId: q.id,
                userAnswer: '',
                isCorrect: false,
              })),
            };
            return (
              <>
                <QuizPlayer
                  quiz={quizContent}
                  onComplete={() => {}}
                  // @ts-ignore
                  forceShowResults={true}
                  // @ts-ignore
                  forcedResults={defaultResults}
                />
                {ActionButtons}
              </>
            );
          }
        }
        return (
          <>
          <div className="quiz-container">
            {quizContent ? (
              <QuizPlayer
                quiz={quizContent}
                onComplete={(results: QuizResults) => {
                  // Show results immediately (QuizPlayer does this)
                  // Submit to API in the background
                  fetch(`/api/student/quizzes/${lesson.id}/submit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(results),
                  }).then(async (response) => {
                    const data = await response.json();
                    if (!response.ok) {
                      if (data.code) {
                        showApiErrorToast({
                          code: data.code,
                          error: data.error,
                          details: data.details,
                          lessonId: lesson.id,
                        });
                      } else {
                        toast.error(data.error || 'Failed to submit quiz');
                      }
                      return;
                    }
                    if (data.passed) {
                      toast.success('Congratulations! You passed the quiz!');
                    } else {
                      toast.error('You did not pass the quiz. Please try again.');
                    }
                  }).catch((error) => {
                    console.error('Error submitting quiz:', error);
                    if (error.code) {
                      showApiErrorToast({
                        code: error.code,
                        error: error.message,
                        details: error.details,
                        lessonId: lesson.id,
                      });
                    } else {
                      toast.error('Failed to submit quiz');
                    }
                  });
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                Quiz content not available
                <BackToCourseButton courseId={lesson['course_id']} />
              </div>
            )}
          </div>
          {/* Do NOT render ActionButtons here for quiz question page */}
          </>
        );
      }
      case 'assignment': {
        let assignment = null;
        if (typeof lesson.content === 'object' && lesson.content !== null) {
          assignment = lesson.content;
        } else if (typeof lesson.content === 'string') {
          try {
            assignment = JSON.parse(lesson.content);
          } catch {
            assignment = null;
          }
        }
        const isTiptapDoc = assignment && assignment.type === 'doc' && Array.isArray(assignment.content);
        return (
          <>
          <div className="assignment-container space-y-8">
            {/* Project Brief */}
            {assignment?.brief && (
              <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Project Brief</h2>
                  <p className="text-[#2C3E50] text-lg">{assignment.brief}</p>
                </Card>
              )}

              {/* Render Tiptap content if present */}
              {isTiptapDoc && (
                <Card className="p-6">
                  <LessonContentDisplay content={assignment} type="text" />
              </Card>
            )}

            {/* Requirements */}
              {assignment?.requirements && Array.isArray(assignment.requirements) && assignment.requirements.length > 0 && (
              <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Requirements</h2>
                  <ul className="list-disc list-inside text-[#2C3E50] text-lg space-y-1">
                    {assignment.requirements.map((req: string, idx: number) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Submission Guidelines */}
              {assignment?.guidelines && Array.isArray(assignment.guidelines) && assignment.guidelines.length > 0 && (
              <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Submission Guidelines</h2>
                  <ul className="list-disc list-inside text-[#2C3E50] text-lg space-y-1">
                    {assignment.guidelines.map((g: string, idx: number) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Grading Rubric */}
              {assignment?.rubric && Array.isArray(assignment.rubric) && assignment.rubric.length > 0 && (
              <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#FF6B35' }}>Grading Criteria</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-[#2C3E50] text-lg">
                    <thead>
                      <tr>
                        <th className="text-left font-semibold p-2">Criterion</th>
                        <th className="text-left font-semibold p-2">Weight (%)</th>
                        <th className="text-left font-semibold p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                        {assignment.rubric.map((row: any, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">{row.criterion}</td>
                          <td className="p-2">{row.weight}</td>
                          <td className="p-2">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

              {/* Resources Section */}
              {assignment?.resources && Array.isArray(assignment.resources) && assignment.resources.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: '#FF6B35' }}>Resources</h2>
                  <ul className="space-y-2">
                    {assignment.resources.map((res: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-[#4ECDC4]" />
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2C3E50] hover:underline"
                        >
                          {res.name} <span className="text-xs text-[#6E6C75]">({res.type}, {res.size})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Peer Review Section */}
              {assignment?.peerReviews && (
            <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: '#FF6B35' }}>Peer Reviews</h2>
                  <div className="space-y-4">
                    <p className="text-lg text-[#2C3E50]">
                      You need to complete <b>{assignment.peerReviews.required}</b> peer reviews
                      by <b>{assignment.peerReviews.deadline ? new Date(assignment.peerReviews.deadline).toLocaleDateString() : ''}</b>.
                    </p>
                    <div className="flex items-center justify-between">
                      <span>Reviews Completed</span>
                      <span>
                        {assignment.peerReviews.completed}/{assignment.peerReviews.required}
                      </span>
                    </div>
                    <Button className="w-full bg-[#4ECDC4] text-white hover:bg-[#4ECDC4]/90">
                      Start Peer Review
                    </Button>
                  </div>
                </Card>
              )}

              {/* Submission Area */}
              <Card className="p-6 border-2 border-dashed border-[#4ECDC4] bg-[#F7F9F9]">
                <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Submit Your Work</h2>
                <div className="flex flex-col items-center justify-center mb-6">
                  <span className="text-5xl mb-2">🚀</span>
                  <p className="text-lg text-[#2C3E50] text-center">Ready to launch your campaign?<br />Upload your presentation, assets, and video pitch</p>
                </div>
              {/* File Upload */}
                {assignment?.submission_types?.includes('file') && (
                <div className="mb-6">
                  <Label className="text-[#2C3E50] font-semibold">File Upload</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4 border-[#FF6B35]">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                        Drag and drop your files here, or{' '}
                        <button className="text-primary hover:underline">browse</button>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, DOCX, PPT, JPG, PNG (max 10MB)
                    </p>
                      <input type="file" className="hidden" multiple />
                  </div>
                </div>
              )}
              {/* Text Entry */}
                {assignment?.submission_types?.includes('text') && (
                <div className="mb-6">
                  <Label className="text-[#2C3E50] font-semibold">Text Entry</Label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    placeholder="Type or paste your answer here..."
                    rows={6}
                  />
                </div>
              )}
              {/* Link Submission */}
                {assignment?.submission_types?.includes('link') && (
                <div className="mb-6">
                  <Label className="text-[#2C3E50] font-semibold">Link Submission</Label>
                  <Input
                    type="url"
                    className="input input-bordered w-full"
                    placeholder="Paste your submission link (e.g., Google Docs, YouTube, etc.)"
                  />
                </div>
              )}
              {/* Submission Checklist */}
              <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-[#FF6B35]">Before Submitting</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                      <Checkbox />
                    <Label className="leading-none">
                      I have reviewed all requirements and included all necessary files
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                      <Checkbox />
                    <Label className="leading-none">
                      I confirm this is my own work and I have cited all sources
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                      <Checkbox />
                    <Label className="leading-none">
                      I understand this is my final submission
                    </Label>
                  </div>
                </div>
              </div>
              {/* Submit and Save Draft Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button className="flex-1 bg-[#FF6B35] text-white hover:bg-[#FF6B35]/90">
                  Submit Assignment
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
              </div>
            </Card>
                  </div>
            {ActionButtons}
          </>
        );
      }
      default:
        return (
          <>
          <div className="flex flex-col items-center text-gray-500">
            Unsupported content type
            <div className="mt-2 text-xs text-red-500">Type: {lesson.type ? lesson.type : 'undefined'}</div>
            <div className="mt-1 text-xs text-red-500 max-w-xl break-all">Content: {JSON.stringify(lesson.content)}</div>
            <BackToCourseButton courseId={lesson['course_id']} />
          </div>
            {ActionButtons}
          </>
        );
    }
  };

  return (
    <div className="lesson-content">
      {renderContent()}
      {/* Completion animation/effect */}
      {showCompletionAnim && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white/80 rounded-full p-12 shadow-lg flex flex-col items-center animate-fade-in-out">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" stroke="#4ECDC4" strokeWidth="6" fill="none" />
              <polyline points="28,44 38,54 54,34" fill="none" stroke="#FF6B35" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="mt-4 text-2xl font-bold text-[#4ECDC4]">Completed!</span>
          </div>
        </div>
      )}
      {/* Side panel for note-taking */}
      {showNotesPanel && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30" onClick={handleCloseNotes} />
          {/* Panel on the LEFT */}
          <div className="mr-auto w-full max-w-md h-full bg-white shadow-xl p-8 flex flex-col animate-slide-in-left relative">
            <button
              className="absolute top-4 right-4 text-[#FF6B35] text-2xl font-bold"
              onClick={handleCloseNotes}
              aria-label="Close notes panel"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Lesson Notes</h2>
            {loadingNotes ? (
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[#4ECDC4] font-semibold">Loading...</span>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full h-64 p-3 border border-[#E5E8E8] rounded-lg focus:outline-none focus:border-[#4ECDC4] resize-none mb-4"
                  placeholder="Write your notes here..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  disabled={savingNotes}
                />
                <button
                  className="mt-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold shadow-md hover:scale-105 transition-transform duration-200 disabled:opacity-60"
                  onClick={handleSaveNotes}
                  disabled={savingNotes || notes === originalNotes}
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Modal for resources */}
      {showResourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowResourcesModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-lg w-full z-10">
            <button
              className="absolute top-4 right-4 text-[#FF6B35] text-2xl font-bold"
              onClick={() => setShowResourcesModal(false)}
              aria-label="Close resources modal"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Lesson Resources</h2>
            <ul className="space-y-4">
              {lesson.resources && lesson.resources.length > 0 ? (
                lesson.resources.map((res, idx) => (
                  <li key={idx}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#FF6B35] hover:underline"
                      download
                    >
                      <Download className="h-5 w-5" />
                      {res.name || res.url}
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-[#6E6C75]">No resources available.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {/* Placeholder for side panel */}
      {/* TODO: Add side panel for note-taking here */}
    </div>
  );
};

// Add a reusable back button
const BackToCourseButton = ({ courseId }: { courseId?: string }) => (
  <Link href={courseId ? `/courses/${courseId}` : '/courses'}>
    <button className="mt-4 px-4 py-2 bg-[#4ECDC4] text-white rounded hover:bg-[#4ECDC4]/90 transition">
      Back to Course
    </button>
  </Link>
);

export default LessonContent; 