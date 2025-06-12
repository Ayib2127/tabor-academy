"use client";

import { FC } from 'react';
import { Lesson } from '@/types/course';
import QuizPlayer from './QuizPlayer';
import { toast } from 'react-hot-toast';
import { QuizResults } from '@/types/quiz';

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
              <div className="flex items-center justify-center h-full text-white">
                Video content not available
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none">
            {lesson.content ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            ) : (
              <p className="text-gray-500">No content available</p>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="quiz-container">
            {lesson.content ? (
              <QuizPlayer
                quiz={JSON.parse(lesson.content)}
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
              <div className="text-gray-500">
                Quiz content not available
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-gray-500">
            Unsupported content type
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

export default LessonContent; 