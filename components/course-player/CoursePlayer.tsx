import { FC } from 'react';
import { Module, Lesson } from '@/types/course';
import LessonContent from './LessonContent';
import PreviewBanner from './PreviewBanner';

interface CoursePlayerProps {
  modules: Module[];
  isPreview?: boolean;
  onExitPreview?: () => void;
}

const CoursePlayer: FC<CoursePlayerProps> = ({
  modules,
  isPreview = false,
  onExitPreview
}) => {
  return (
    <div className="course-player">
      {isPreview && <PreviewBanner onExit={onExitPreview} />}
      
      <div className="container mx-auto px-4 py-6">
        {modules.map((module) => (
          <div key={module.id} className="module-container mb-8">
            <div className="module-header mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">{module.title}</h3>
              {module.description && (
                <p className="mt-2 text-gray-600">{module.description}</p>
              )}
            </div>
            
            <div className="lessons-container space-y-6">
              {module.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className="lesson-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {lesson.title}
                      </h4>
                      {lesson.duration && (
                        <span className="text-sm text-gray-500">
                          {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                        </span>
                      )}
                    </div>
                    
                    <LessonContent lesson={lesson} isPreview={isPreview} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer; 