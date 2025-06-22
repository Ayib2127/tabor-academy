import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Eye,
  Calendar,
  Users,
  Lock,
  Unlock,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Clock,
  Target,
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  X,
} from 'lucide-react';

interface CoursePreviewProps {
  courseData: any;
  isOpen: boolean;
  onClose: () => void;
  previewMode: 'student' | 'week-1' | 'week-2' | 'week-3' | 'instructor';
  onModeChange: (mode: string) => void;
}

const CoursePreview: FC<CoursePreviewProps> = ({
  courseData,
  isOpen,
  onClose,
  previewMode,
  onModeChange,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Filter content based on preview mode
  const getVisibleContent = () => {
    if (!courseData) return { modules: [], sessions: [] };

    if (previewMode === 'instructor') {
      return {
        modules: courseData.modules,
        sessions: courseData.live_sessions || [],
      };
    }

    if (previewMode === 'student') {
      // Show all published content
      return {
        modules: courseData.modules.filter((module: any) => 
          module.lessons.some((lesson: any) => lesson.is_published)
        ).map((module: any) => ({
          ...module,
          lessons: module.lessons.filter((lesson: any) => lesson.is_published),
        })),
        sessions: courseData.live_sessions || [],
      };
    }

    // Week-specific preview
    const weekNumber = parseInt(previewMode.split('-')[1]);
    return {
      modules: courseData.modules.filter((module: any) => 
        module.unlocks_on_week && module.unlocks_on_week <= weekNumber
      ),
      sessions: (courseData.live_sessions || []).filter((session: any) => 
        session.week_number <= weekNumber
      ),
    };
  };

  const { modules, sessions } = getVisibleContent();

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-[#FF6B35]" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-[#4ECDC4]" />;
    }
  };

  const getPreviewModeLabel = (mode: string) => {
    switch (mode) {
      case 'student':
        return 'Student View';
      case 'instructor':
        return 'Instructor View';
      default:
        return `Week ${mode.split('-')[1]} View`;
    }
  };

  const getPreviewModeDescription = (mode: string) => {
    switch (mode) {
      case 'student':
        return 'See how students view the complete course';
      case 'instructor':
        return 'Full instructor view with all content';
      default:
        const week = mode.split('-')[1];
        return `Content available to students in week ${week}`;
    }
  };

  const handleLessonClick = (lesson: any) => {
    setSelectedLesson(lesson);
  };

  const handleLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  const calculateProgress = () => {
    const totalLessons = modules.reduce((total: number, module: any) => 
      total + module.lessons.length, 0
    );
    const completed = completedLessons.size;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E8E8]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#4ECDC4]" />
              <h2 className="text-xl font-bold text-[#2C3E50]">Course Preview</h2>
            </div>
            <Select value={previewMode} onValueChange={onModeChange}>
              <SelectTrigger className="w-48 border-[#E5E8E8]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Student View
                  </div>
                </SelectItem>
                <SelectItem value="instructor">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Instructor View
                  </div>
                </SelectItem>
                {courseData?.delivery_type === 'cohort' && (
                  <>
                    <SelectItem value="week-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Week 1 View
                      </div>
                    </SelectItem>
                    <SelectItem value="week-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Week 2 View
                      </div>
                    </SelectItem>
                    <SelectItem value="week-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Week 3 View
                      </div>
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview Mode Info */}
        <div className="px-6 py-4 bg-[#F7F9F9] border-b border-[#E5E8E8]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#2C3E50]">
                {getPreviewModeLabel(previewMode)}
              </h3>
              <p className="text-sm text-[#2C3E50]/60">
                {getPreviewModeDescription(previewMode)}
              </p>
            </div>
            {previewMode === 'student' && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-[#2C3E50]/60">
                  Progress: {calculateProgress()}%
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4ECDC4] transition-all duration-300"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Course Content */}
          <div className="w-1/2 border-r border-[#E5E8E8] overflow-y-auto">
            <div className="p-6">
              {/* Course Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">
                  {courseData?.title}
                </h1>
                <p className="text-[#2C3E50]/70 mb-4">
                  {courseData?.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
                    {courseData?.level}
                  </Badge>
                  <Badge variant="outline" className="border-[#FF6B35]/30 text-[#FF6B35]">
                    {courseData?.category}
                  </Badge>
                  {courseData?.delivery_type === 'cohort' && (
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      <Users className="w-3 h-3 mr-1" />
                      Cohort Course
                    </Badge>
                  )}
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-6">
                {modules.length === 0 ? (
                  <div className="text-center py-12">
                    <Lock className="w-12 h-12 text-[#2C3E50]/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                      No Content Available
                    </h3>
                    <p className="text-[#2C3E50]/60">
                      {previewMode.startsWith('week-') 
                        ? `Content for this week hasn't been unlocked yet.`
                        : 'No published content available.'
                      }
                    </p>
                  </div>
                ) : (
                  modules.map((module: any, moduleIndex: number) => (
                    <Card key={module.id} className="border-[#E5E8E8] shadow-sm">
                      <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {moduleIndex + 1}
                            </div>
                            <div>
                              <CardTitle className="text-[#2C3E50]">{module.title}</CardTitle>
                              {module.weekly_sprint_goal && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Target className="w-3 h-3 text-[#FF6B35]" />
                                  <span className="text-xs text-[#2C3E50]/60">
                                    Week {module.unlocks_on_week} Goal
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {module.unlocks_on_week && previewMode.startsWith('week-') && (
                            <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
                              <Calendar className="w-3 h-3 mr-1" />
                              Week {module.unlocks_on_week}
                            </Badge>
                          )}
                        </div>
                        {module.weekly_sprint_goal && (
                          <div className="mt-3 p-3 bg-white rounded border border-[#FF6B35]/20">
                            <p className="text-sm text-[#2C3E50]">{module.weekly_sprint_goal}</p>
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {module.lessons.map((lesson: any, lessonIndex: number) => {
                            const isCompleted = completedLessons.has(lesson.id);
                            const isSelected = selectedLesson?.id === lesson.id;
                            
                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                  isSelected 
                                    ? 'bg-[#4ECDC4]/10 border border-[#4ECDC4]/30' 
                                    : 'bg-[#F7F9F9] hover:bg-[#4ECDC4]/5'
                                }`}
                                onClick={() => handleLessonClick(lesson)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-[#2C3E50]/60 w-6">
                                      {lessonIndex + 1}.
                                    </span>
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-[#2C3E50]">
                                      {lesson.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {lesson.type}
                                      </Badge>
                                      {lesson.duration && (
                                        <span className="text-xs text-[#2C3E50]/60 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {lesson.duration} min
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {previewMode === 'student' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLessonComplete(lesson.id);
                                    }}
                                    className={`${
                                      isCompleted 
                                        ? 'text-green-600 hover:text-green-700' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Live Sessions */}
              {sessions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">Live Sessions</h3>
                  <div className="space-y-3">
                    {sessions.map((session: any) => (
                      <Card key={session.id} className="border-[#E5E8E8] shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Video className="w-5 h-5 text-[#FF6B35]" />
                              <div>
                                <h4 className="font-medium text-[#2C3E50]">{session.title}</h4>
                                <p className="text-sm text-[#2C3E50]/60">
                                  {new Date(`${session.date} ${session.time}`).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-[#FF6B35]/30 text-[#FF6B35]">
                              Week {session.week_number}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lesson Content Preview */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6">
              {selectedLesson ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    {getLessonIcon(selectedLesson.type)}
                    <div>
                      <h2 className="text-xl font-bold text-[#2C3E50]">
                        {selectedLesson.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {selectedLesson.type}
                        </Badge>
                        {selectedLesson.duration && (
                          <span className="text-xs text-[#2C3E50]/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {selectedLesson.duration} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="bg-white border border-[#E5E8E8] rounded-lg p-6">
                    {selectedLesson.type === 'video' ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Play className="w-12 h-12 text-[#FF6B35] mx-auto mb-2" />
                            <p className="text-[#2C3E50]/60">Video Player</p>
                          </div>
                        </div>
                        <p className="text-[#2C3E50]">
                          Video lesson content would be displayed here.
                        </p>
                      </div>
                    ) : selectedLesson.type === 'quiz' ? (
                      <div className="space-y-4">
                        <div className="bg-[#F7F9F9] rounded-lg p-4">
                          <h3 className="font-semibold text-[#2C3E50] mb-2">Quiz Preview</h3>
                          <p className="text-[#2C3E50]/70">
                            Interactive quiz content would be displayed here.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-[#2C3E50]">
                          Text lesson content would be displayed here. This is where students would read the lesson material, view images, and interact with the content.
                        </p>
                        <p className="text-[#2C3E50]/70 mt-4">
                          The actual lesson content from the Tiptap editor would be rendered here in the student view.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Lesson Navigation */}
                  <div className="flex items-center justify-between mt-6">
                    <Button variant="outline" className="border-[#E5E8E8] hover:border-[#4ECDC4]">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous Lesson
                    </Button>
                    <Button className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
                      Next Lesson
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">
                    Select a Lesson
                  </h3>
                  <p className="text-[#2C3E50]/60">
                    Click on a lesson from the course content to preview how it appears to students.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;