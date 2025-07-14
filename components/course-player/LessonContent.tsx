"use client";

import { FC, useState, useRef, useEffect } from 'react';
import { Lesson } from '@/types/course';
import QuizPlayer from './QuizPlayer';
import { toast } from 'react-hot-toast';
import { QuizResults } from '@/types/quiz';
import Link from 'next/link';
import LessonContentDisplay from '@/components/student/lesson-content';
import { Play } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface LessonContentProps {
  lesson: Lesson;
  isPreview?: boolean;
  completed?: boolean; // Added prop for completion status
}

const LessonContent: FC<LessonContentProps> = ({ lesson, isPreview = false, completed = false }) => {
  console.log('LessonContent RENDER', lesson);
  const [showCompletionAnim, setShowCompletionAnim] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [notes, setNotes] = useState('');
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoStarted && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoStarted]);

  const handleCompleteContinue = () => {
    setShowCompletionAnim(true);
    setTimeout(() => {
      setShowCompletionAnim(false);
      // TODO: Navigate to next lesson here
    }, 1500); // Animation duration
  };

  const handleTakeNotes = () => {
    setShowNotesPanel(true);
  };

  const handleSaveNotes = () => {
    setShowNotesPanel(false);
    // TODO: Persist notes if needed
  };

  const handleCloseNotes = () => {
    setShowNotesPanel(false);
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
        // If content is Tiptap JSON, render with LessonContentDisplay; else, render as HTML
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
        if (tiptapContent) {
          return <LessonContentDisplay content={tiptapContent} type="text" />;
        } else {
          return (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          );
        }
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

      case 'assignment':
        return (
          <div className="assignment-container">
            {lesson.content ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                Assignment content not available
                <BackToCourseButton courseId={lesson['course_id']} />
              </div>
            )}
          </div>
        );

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
          {/* Panel */}
          <div className="ml-auto w-full max-w-md h-full bg-white shadow-xl p-8 flex flex-col animate-slide-in-right relative">
            <button
              className="absolute top-4 right-4 text-[#FF6B35] text-2xl font-bold"
              onClick={handleCloseNotes}
              aria-label="Close notes panel"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-[#2C3E50]">Lesson Notes</h2>
            <textarea
              className="w-full h-64 p-3 border border-[#E5E8E8] rounded-lg focus:outline-none focus:border-[#4ECDC4] resize-none mb-4"
              placeholder="Write your notes here..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button
              className="mt-auto px-6 py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold shadow-md hover:scale-105 transition-transform duration-200"
              onClick={handleSaveNotes}
            >
              Save Notes
            </button>
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