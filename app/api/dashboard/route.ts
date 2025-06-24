import { NextResponse } from "next/server";

// Temporary mock data returned by the dashboard API.
// TODO: replace with real DB queries once backend is ready.
const mockDashboardData = {
  user: {
    id: "demo-user",
    name: "Demo User",
    avatar: null,
    funnelStage: "Idea",
    memberSince: "2024-01-01",
  },
  stats: {
    totalCourses: 12,
    learningStreak: 5,
    achievementPoints: 1200,
    completedCourses: 3,
  },
  enrolledCourses: [],
  recommendedCourses: [],
  allRecommendations: [],
  recentAchievements: [],
  nextStepCourse: {
    title: "Validate Your Idea",
    description:
      "Learn proven methods to validate your business idea before investing heavily.",
    action: "Start Course",
    course: {
      id: "idea-validation-101",
      title: "Idea Validation 101",
      description: "Step-by-step guide to evaluating market demand and customer needs.",
      level: "Beginner",
      price: 0,
      content_type: "tabor_original",
    },
  },
  completedStages: ["Idea"],
};

export async function GET() {
  return NextResponse.json(mockDashboardData);
}
