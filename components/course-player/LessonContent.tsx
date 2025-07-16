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

  const handleCompleteContinue = async () => {
    setCompleting(true);
    try {
      // Mark as completed via API
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to complete lesson");
      toast.success("Lesson marked as complete!");

      // Show completion animation
      setShowCompletionAnim(true);
      setTimeout(() => {
        setShowCompletionAnim(false);
      }, 1500);

      if (onLessonCompleted) onLessonCompleted(); // <-- call this
    } catch (err) {
      toast.error("Could not complete lesson.");
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
        console.log('LessonContent videoUrl:', videoUrl, 'lesson.content:', lesson.content);
        return (
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

        // --- Action Buttons ---
        const ActionButtons = (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
            <button
              className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white font-bold shadow-md hover:scale-105 transition-transform duration-200 flex items-center gap-2"
              onClick={handleCompleteContinue}
              disabled={completing}
            >
              {completing ? (
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
              <Download className="h-5 w-5" /> {/* Download icon on the left */}
              Resources
            </button>
          </div>
        );

        const cardClass =
          "bg-gradient-to-br from-[#FF6B35]/5 to-[#4ECDC4]/5 " +
          "rounded-xl border border-[#E5E8E8] p-8 shadow-sm " +
          "hover:shadow-lg hover:scale-[1.01] transition-all duration-200 " +
          "font-sans";

        // Only render the content and action buttons at the bottom
        return (
          <div className={cardClass}>
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
        return (
          <div className="quiz-container">
            {quizContent ? (
              <QuizPlayer
                quiz={quizContent}
                onComplete={async (results: QuizResults) => {
                  try {
                    const response = await fetch(`/api/student/quizzes/${lesson.id}/submit`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(results),
                    });

                    if (!response.ok) {
                      throw new Error('Failed to submit quiz');
                    }

                    const data = await response.json();
                    if (data.passed) {
                      toast.success('Congratulations! You passed the quiz!');
                    } else {
                      toast.error('You did not pass the quiz. Please try again.');
                    }
                  } catch (error) {
                    console.error('Error submitting quiz:', error);
                    toast.error('Failed to submit quiz');
                  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                Quiz content not available
                <BackToCourseButton courseId={lesson['course_id']} />
              </div>
            )}
          </div>
        );
      }

      case 'assignment': {
        // Example: parse assignment content if it's JSON, otherwise fallback to HTML
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

        return (
          <div className="assignment-container">
            {/* Assignment Title & Badges */}
            <div className="flex flex-col items-center mb-6">
              <h1 className="text-3xl font-extrabold mb-2 text-center"
                style={{
                  background: "linear-gradient(90deg, #4ECDC4 0%, #FF6B35 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {lesson.title}
              </h1>
              <div className="flex flex-row items-center gap-4">
                <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#FF6B35] font-semibold text-base">
                  📄 Assignment
                </span>
                {assignment?.dueDate && (
                  <span className="flex items-center px-4 py-1 rounded-full bg-[#F7F9F9] text-[#6E6C75] font-semibold text-base">
                    ⏰ Due: {assignment.dueDate}
                  </span>
                )}
              </div>
            </div>

            {/* Assignment Sections */}
            <div className="space-y-8">
              {/* Project Brief */}
              {assignment?.brief && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FF6B35] mb-2">Project Brief</h2>
                  <p className="text-[#2C3E50]">{assignment.brief}</p>
                </div>
              )}

              {/* Requirements */}
              {assignment?.requirements && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FF6B35] mb-2">Requirements</h2>
                  <ul className="list-disc list-inside text-[#2C3E50]">
                    {assignment.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Guidelines */}
              {assignment?.guidelines && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FF6B35] mb-2">Submission Guidelines</h2>
                  <ul className="list-disc list-inside text-[#2C3E50]">
                    {assignment.guidelines.map((g, idx) => (
                      <li key={idx}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grading Criteria */}
              {assignment?.grading && (
                <div>
                  <h2 className="text-2xl font-bold text-[#FF6B35] mb-2">Grading Criteria</h2>
                  <ul className="list-disc list-inside text-[#2C3E50]">
                    {assignment.grading.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Area */}
              <div className="border-2 border-dashed border-[#4ECDC4] rounded-lg p-8 text-center mb-6 bg-[#F7F9F9]">
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">🚀</span>
                  <p className="text-[#2C3E50] font-semibold mb-2">
                    Ready to launch your campaign? Upload your presentation, assets, and video pitch
                  </p>
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
                    <button
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold shadow-md hover:scale-105 transition-transform duration-200 flex items-center gap-2"
                    >
                      Submit Campaign
                    </button>
                    <button
                      className="px-6 py-3 rounded-lg border-2 border-[#4ECDC4] text-[#2C3E50] font-bold bg-white hover:bg-[#F7F9F9] transition"
                    >
                      Save Draft
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
              <button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold shadow-md hover:scale-105 transition-transform duration-200 flex items-center gap-2"
              >
                Complete Lesson
              </button>
              <button
                className="px-6 py-3 rounded-lg border-2 border-[#4ECDC4] text-[#2C3E50] font-bold bg-white hover:bg-[#F7F9F9] transition"
              >
                Take Notes
              </button>
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="flex flex-col items-center text-gray-500">
            Unsupported content type
            <div className="mt-2 text-xs text-red-500">Type: {lesson.type ? lesson.type : 'undefined'}</div>
            <div className="mt-1 text-xs text-red-500 max-w-xl break-all">Content: {JSON.stringify(lesson.content)}</div>
            <BackToCourseButton courseId={lesson['course_id']} />
          </div>
        );
    }
  };

  return (
    <div className="lesson-content">
      {renderContent()}
      {/* Show buttons only if lesson is completed */}
      {completed && (
        <div className="flex flex-col items-center mt-8 space-y-4">
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold shadow-md hover:scale-105 transition-transform duration-200"
            onClick={handleCompleteContinue}
          >
            Complete & Continue
          </button>
          <button
            className="px-6 py-3 rounded-lg border-2 border-[#4ECDC4] text-[#2C3E50] font-bold bg-white hover:bg-[#F7F9F9] transition"
            onClick={handleTakeNotes}
          >
            Take Notes
          </button>
        </div>
      )}
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