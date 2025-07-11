"use client";

import { FC } from 'react';
import { Lesson } from '@/types/course';
import QuizPlayer from './QuizPlayer';
import { toast } from 'react-hot-toast';
import { QuizResults } from '@/types/quiz';
import Link from 'next/link';
import LessonContentDisplay from '@/components/student/lesson-content';

interface LessonContentProps {
  lesson: Lesson;
  isPreview?: boolean;
}

const LessonContent: FC<LessonContentProps> = ({ lesson, isPreview = false }) => {
  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="video-container aspect-video bg-black rounded-lg overflow-hidden">
            {lesson.content ? (
              <video
                controls
                className="w-full h-full"
                src={lesson.content}
                poster={`/api/thumbnails/${lesson.id}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white">
                Video content not available
                <BackToCourseButton courseId={lesson['course_id']} />
              </div>
            )}
          </div>
        );

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