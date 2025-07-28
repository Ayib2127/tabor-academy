import { NextRequest, NextResponse } from 'next/server';
import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { handleApiError, ForbiddenError } from '@/lib/utils/error-handling';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<any>> {
  try {
    const supabase = await createApiSupabaseClient();

    // Get the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new ForbiddenError('Unauthorized');
    }

    // Get user profile with funnel stage
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, full_name, funnel_stage, avatar_url, created_at')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Get user's enrolled courses with enhanced data
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        courses (
          id,
          title,
          description,
          thumbnail_url,
          level,
          price,
          content_type,
          users!courses_instructor_id_fkey (
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('user_id', session.user.id)
      .order('enrolled_at', { ascending: false });

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      throw enrollmentsError;
    }

    // Calculate progress for each enrollment (mock data for now)
    const enrolledCoursesWithProgress = (enrollments || []).map(enrollment => {
      const mockProgress = Math.floor(Math.random() * 100);
      const mockTotalLessons = Math.floor(Math.random() * 20) + 5;
      const mockCompletedLessons = Math.floor((mockProgress / 100) * mockTotalLessons);
      
      return {
        id: enrollment.courses?.id,
        title: enrollment.courses?.title,
        description: enrollment.courses?.description,
        thumbnail: enrollment.courses?.thumbnail_url,
        level: enrollment.courses?.level,
        price: enrollment.courses?.price,
        instructor: enrollment.courses?.users,
        enrolledAt: enrollment.enrolled_at,
        progress: mockProgress,
        totalLessons: mockTotalLessons,
        completedLessons: mockCompletedLessons,
        estimatedTimeLeft: mockProgress > 80 ? '1-2 hours' : mockProgress > 50 ? '3-5 hours' : '5+ hours',
        lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    });

    // Get recommended courses based on funnel stage
    const funnelStage = profile.funnel_stage || 'Idea';
    let recommendedCourses = [];

    // Define course recommendations based on funnel stage
    const stageRecommendations = {
      'Idea': {
        tags: ['business-validation', 'market-research', 'idea-validation'],
        categories: ['Business & Entrepreneurship', 'Financial Literacy']
      },
      'MVP': {
        tags: ['no-code-development', 'product-development', 'mvp-building'],
        categories: ['Technology & Development', 'Business & Entrepreneurship']
      },
      'Growth': {
        tags: ['digital-marketing', 'scaling-business', 'growth-hacking'],
        categories: ['Digital Marketing', 'Business & Entrepreneurship']
      }
    };

    const stageRec = stageRecommendations[funnelStage as keyof typeof stageRecommendations] || stageRecommendations['Idea'];

    // Fetch recommended courses (excluding already enrolled ones)
    const enrolledCourseIds = enrollments?.map(e => e.courses?.id).filter(Boolean) || [];
    
    let recommendedQuery = supabase
      .from('courses')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        level,
        price,
        content_type,
        category,
        tags,
        users!courses_instructor_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('is_published', true)
      .limit(8);

    // Exclude enrolled courses
    if (enrolledCourseIds.length > 0) {
      recommendedQuery = recommendedQuery.not('id', 'in', `(${enrolledCourseIds.join(',')})`);
    }

    const { data: recommended, error: recommendedError } = await recommendedQuery;

    if (!recommendedError && recommended) {
      // Filter and score recommendations based on funnel stage
      recommendedCourses = recommended
        .map(course => {
          let score = 0;
          
          // Score based on category match
          if (stageRec.categories.includes(course.category)) {
            score += 3;
          }
          
          // Score based on tag overlap
          const tagOverlap = (course.tags || []).filter(tag => 
            stageRec.tags.some(recTag => tag.toLowerCase().includes(recTag.toLowerCase()))
          ).length;
          score += tagOverlap * 2;
          
          // Boost Tabor Original content
          if (course.content_type === 'tabor_original') {
            score += 2;
          }
          
          // Prefer beginner courses for Idea stage
          if (funnelStage === 'Idea' && course.level === 'beginner') {
            score += 1;
          }
          
          return { ...course, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    }

    // Calculate learning statistics
    const totalCourses = enrollments?.length || 0;
    const completedCourses = enrolledCoursesWithProgress.filter(c => c.progress >= 100).length;
    const learningStreak = calculateLearningStreak(session.user.id);
    const achievementPoints = calculateAchievementPoints(enrollments || [], completedCourses);

    // Get recent achievements
    const recentAchievements = generateAchievements(totalCourses, completedCourses, learningStreak);

    // Determine completed stages based on course completions and funnel stage
    const completedStages = getCompletedStages(funnelStage, completedCourses, enrolledCoursesWithProgress);

    // Prepare dashboard data
    const dashboardData = {
      user: {
        id: profile.id,
        name: profile.full_name,
        avatar: profile.avatar_url,
        funnelStage,
        memberSince: profile.created_at
      },
      stats: {
        totalCourses,
        learningStreak,
        achievementPoints,
        completedCourses
      },
      enrolledCourses: enrolledCoursesWithProgress,
      recommendedCourses: recommendedCourses.slice(0, 3),
      allRecommendations: recommendedCourses,
      recentAchievements,
      nextStepCourse: getNextStepCourse(funnelStage, recommendedCourses),
      completedStages
    };

    return NextResponse.json(dashboardData);

  } catch (error: any) {
    console.error('Dashboard API error:', error);
    const apiError = handleApiError(error);
    return NextResponse.json({ code: apiError.code, error: apiError.message, details: apiError.details }, { status: apiError.code === 'FORBIDDEN' ? 403 : 500 });
  }
}

// Helper functions
function calculateLearningStreak(userId: string): number {
  // This would typically query a learning_activity table
  // For now, return a mock value based on user activity
  return Math.floor(Math.random() * 15) + 1;
}

function calculateAchievementPoints(enrollments: any[], completedCourses: number): number {
  // Points calculation: 10 per enrollment, 50 per completion, bonus for streaks
  const enrollmentPoints = enrollments.length * 10;
  const completionPoints = completedCourses * 50;
  const bonusPoints = completedCourses > 3 ? 100 : 0; // Bonus for completing multiple courses
  
  return enrollmentPoints + completionPoints + bonusPoints;
}

function generateAchievements(totalCourses: number, completedCourses: number, learningStreak: number) {
  const achievements = [];
  
  if (totalCourses > 0) {
    achievements.push({
      id: '1',
      title: 'Learning Journey Begins',
      description: 'Enrolled in your first course',
      icon: 'star',
      date: 'Recently'
    });
  }
  
  if (completedCourses > 0) {
    achievements.push({
      id: '2',
      title: 'Course Completer',
      description: `Completed ${completedCourses} course${completedCourses > 1 ? 's' : ''}`,
      icon: 'trophy',
      date: 'Recently'
    });
  }
  
  if (learningStreak >= 3) {
    achievements.push({
      id: '3',
      title: 'Consistent Learner',
      description: `${learningStreak} day learning streak`,
      icon: 'flame',
      date: 'Today'
    });
  }
  
  if (totalCourses >= 3) {
    achievements.push({
      id: '4',
      title: 'Knowledge Seeker',
      description: 'Enrolled in 3+ courses',
      icon: 'brain',
      date: 'Recently'
    });
  }
  
  return achievements.slice(0, 3); // Return max 3 recent achievements
}

function getCompletedStages(funnelStage: string, completedCourses: number, enrolledCourses: any[]): string[] {
  const completed = [];
  
  // Simple logic: if user has completed courses in a stage, mark it as completed
  // In a real implementation, you'd track this more precisely
  
  if (funnelStage === 'MVP' || funnelStage === 'Growth') {
    completed.push('Idea');
  }
  
  if (funnelStage === 'Growth') {
    completed.push('MVP');
  }
  
  // Additional logic based on course completions
  if (completedCourses >= 2 && funnelStage === 'Idea') {
    // If they've completed 2+ courses in Idea stage, they might be ready for MVP
    // This would trigger a funnel stage update in a real system
  }
  
  return completed;
}

function getNextStepCourse(funnelStage: string, recommendedCourses: any[]) {
  const stageDescriptions = {
    'Idea': {
      title: "Let's Validate Your Business Idea! 💡",
      description: "Every successful business starts with a validated idea. Learn proven frameworks to research your market, understand your customers, and validate your business concept before investing time and money.",
      action: "Start Validation Journey"
    },
    'MVP': {
      title: "Time to Build Your Product! 🚀",
      description: "Transform your validated idea into a working product using no-code tools and lean development strategies. Build fast, test quickly, and iterate based on real user feedback.",
      action: "Start Building Course"
    },
    'Growth': {
      title: "Scale Your Business! 📈",
      description: "Your product is ready - now it's time to grow! Learn advanced marketing strategies, customer acquisition techniques, and scaling frameworks used by successful entrepreneurs.",
      action: "Start Growth Course"
    }
  };

  const stageInfo = stageDescriptions[funnelStage as keyof typeof stageDescriptions] || stageDescriptions['Idea'];
  const nextCourse = recommendedCourses[0] || null;

  return {
    ...stageInfo,
    course: nextCourse
  };
}