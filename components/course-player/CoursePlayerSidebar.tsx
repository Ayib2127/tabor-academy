import { FC, useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Rocket, BarChart, Video, HelpCircle, FileText, Lock, CheckCircle, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LessonType = "video" | "quiz" | "assignment" | "text";

interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  is_published: boolean;
  completed: boolean;
  locked: boolean;
  duration?: string | number;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CoursePlayerSidebarProps {
  modules: Module[];
  currentLessonId: string;
  progress: { percent: number; completed: number; total: number };
  onNavigate?: (lessonId: string) => void;
}

// Custom icons for lesson types (emoji for demo, replace with SVGs if desired)
const lessonTypeIcon = (type: LessonType) => {
  switch (type) {
    case "video":
      return <Video className="h-6 w-6 text-[#4ECDC4]" />;
    case "quiz":
      return <HelpCircle className="h-6 w-6 text-[#FF6B35]" />;
    case "assignment":
      return <FileText className="h-6 w-6 text-[#2C3E50]" />;
    case "text":
      return <Rocket className="h-6 w-6 text-[#FF6B35]" />;
    case "research":
      return <BarChart className="h-6 w-6 text-[#4ECDC4]" />;
    default:
      return <FileText className="h-6 w-6 text-[#6E6C75]" />;
  }
};

const lessonStateIcon = (lesson: Lesson, isCurrent: boolean) => {
  if (lesson.locked) return <Lock className="h-5 w-5 text-[#FF6B35] ml-2" />;
  if (lesson.completed) return <CheckCircle className="h-5 w-5 text-[#4ECDC4] ml-2" />;
  if (isCurrent) return <Play className="h-5 w-5 text-[#FF6B35] ml-2" />;
  return null;
};

// Add a simple circular progress ring component
const CircularProgress = ({ percent }: { percent: number }) => {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} className="block">
      <circle
        stroke="#E5E8E8"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#sidebar-gradient)"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <defs>
        <linearGradient id="sidebar-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#4ECDC4" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy="0.35em"
        fontSize="1.25rem"
        fontWeight="bold"
        fill="#FF6B35"
      >
        {percent}%
      </text>
    </svg>
  );
};

export const CoursePlayerSidebar: FC<CoursePlayerSidebarProps & { courseTitle?: string }> = ({
  modules,
  currentLessonId,
  progress,
  onNavigate,
  courseTitle,
}) => {
  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-[#E5E8E8] rounded-full p-2 shadow-lg"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        onClick={() => setSidebarOpen((v) => !v)}
      >
        <span className="sr-only">Toggle Sidebar</span>
        <svg width="24" height="24" fill="none" stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
      </button>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
      <aside
        className={`z-50 md:z-auto fixed md:static top-0 left-0 h-screen overflow-y-auto bg-white border-r border-[#E5E8E8] px-2 py-6 space-y-8 min-w-[260px] max-w-xs transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:block`}
        aria-label="Course Navigation Sidebar"
        role="navigation"
      >
        {/* Course Title */}
        {courseTitle && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-extrabold text-[#2C3E50] tracking-tight mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{courseTitle}</h2>
          </div>
        )}
        {/* Circular Progress Ring */}
        <div className="flex flex-col items-center mb-6">
          <CircularProgress percent={progress.percent} />
          <div className="text-sm text-[#6E6C75] mt-2">
            {progress.completed} / {progress.total} Lessons Complete
          </div>
        </div>
        {/* Modules & Lessons (all expanded, no accordion) */}
        <nav className="space-y-10" aria-label="Modules">
          {modules.map((module, mIdx) => {
            const total = module.lessons.length;
            const completed = module.lessons.filter((l) => l.completed).length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <div key={module.id} className="space-y-4">
                {/* Module Title with colored accent bar */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-6 w-1 rounded bg-gradient-to-b from-[#FF6B35] to-[#4ECDC4]`} />
                  <h3 className="text-lg font-bold text-[#2C3E50]" style={{ fontFamily: 'Inter, sans-serif' }}>{module.title}</h3>
                </div>
                {/* Per-module progress bar */}
                <div className="px-2 mb-2">
                  <Progress value={percent} className="h-1 bg-[#E5E8E8]" />
                  <div className="text-xs text-[#6E6C75] mt-1">{completed} / {total} Complete</div>
                </div>
                <ul className="space-y-3">
                  {module.lessons.map((lesson) => {
                    const isCurrent = lesson.id === currentLessonId;
                    return (
                      <li key={lesson.id}>
                        <div
                          className={`flex items-center justify-between rounded-xl border transition-all shadow-sm px-4 py-3 cursor-pointer
                            ${isCurrent ? "bg-gradient-to-r from-[#FF6B35]/90 to-[#4ECDC4]/90 text-white border-transparent shadow-lg" : "bg-[#F7F9F9] border-[#E5E8E8] hover:bg-[#FF6B35]/10"}
                            ${lesson.locked ? "opacity-60 cursor-not-allowed" : ""}
                          `}
                          tabIndex={lesson.locked ? -1 : 0}
                          aria-current={isCurrent ? "page" : undefined}
                          aria-label={lesson.title}
                          aria-selected={isCurrent}
                          role="button"
                          onClick={() => !lesson.locked && onNavigate?.(lesson.id)}
                          onKeyDown={e => {
                            if (!lesson.locked && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              onNavigate?.(lesson.id);
                            }
                          }}
                        >
                          <span className="flex items-center gap-3">
                            {lessonTypeIcon(lesson.type)}
                            <span className={`font-medium text-base ${isCurrent ? "text-white" : "text-[#2C3E50]"}`}>{lesson.title}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            {lesson.duration && (
                              <span className={`text-xs ${isCurrent ? "text-white/80" : "text-[#6E6C75]"}`}>{lesson.duration}</span>
                            )}
                            {lessonStateIcon(lesson, isCurrent)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default CoursePlayerSidebar; 