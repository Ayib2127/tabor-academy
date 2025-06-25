import { Analytics } from '@vercel/analytics/react';

// Google Analytics 4 setup
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageview = (url: string) => {
  if (typeof window === 'undefined') return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track events
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window === 'undefined') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Custom events for our application
export const trackCourseStart = (courseId: string, courseTitle: string) => {
  trackEvent({
    action: 'start_course',
    category: 'Course',
    label: courseTitle,
    value: 1,
  });
};

export const trackCourseComplete = (courseId: string, courseTitle: string) => {
  trackEvent({
    action: 'complete_course',
    category: 'Course',
    label: courseTitle,
    value: 1,
  });
};

export const trackLessonComplete = (lessonId: string, lessonTitle: string) => {
  trackEvent({
    action: 'complete_lesson',
    category: 'Lesson',
    label: lessonTitle,
    value: 1,
  });
};

export const trackQuizComplete = (quizId: string, score: number) => {
  trackEvent({
    action: 'complete_quiz',
    category: 'Quiz',
    label: quizId,
    value: score,
  });
};

export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultsCount,
  });
};

export const trackError = (error: Error, componentStack: string) => {
  trackEvent({
    action: 'error',
    category: 'Error',
    label: `${error.name}: ${error.message}`,
  });
};