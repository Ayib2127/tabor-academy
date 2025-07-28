'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Calendar,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Filter,
  Search,
  AlertTriangle,
  Star,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface PendingCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  content_type: 'tabor_original' | 'community';
  status: 'pending_review';
  created_at: string;
  updated_at: string;
  instructor: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      type: 'text' | 'video' | 'quiz';
      content: any;
      is_published: boolean;
    }>;
  }>;
  _stats: {
    totalModules: number;
    totalLessons: number;
    completedLessons: number;
    estimatedDuration: number;
  };
}

export default function AdminApprovalsPage() {
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<PendingCourse | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'tabor_original' | 'community'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [statusTab, setStatusTab] = useState<'pending_review' | 'published' | 'rejected' | 'all'>('pending_review');

  const supabase = createClientComponentClient();

  // Wrap fetchPendingCourses in useCallback
  const fetchPendingCourses = useCallback(async () => {
    try {
      setLoading(true);

      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          description,
          category,
          level,
          content_type,
          status,
          created_at,
          updated_at,
          users!courses_instructor_id_fkey (
            full_name,
            email,
            avatar_url
          ),
          course_modules (
            id,
            title,
            module_lessons (
              id,
              title,
              type,
              content,
              is_published
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Process courses to add statistics
      const processedCourses = courses.map(course => {
        const totalModules = course.course_modules.length;
        const totalLessons = course.course_modules.reduce((sum, module) => 
          sum + module.module_lessons.length, 0
        );
        const completedLessons = course.course_modules.reduce((sum, module) => 
          sum + module.module_lessons.filter(lesson => lesson.content).length, 0
        );
        const estimatedDuration = totalLessons * 15; // Estimate 15 min per lesson

        return {
          ...course,
          instructor: course.users,
          modules: course.course_modules,
          _stats: {
            totalModules,
            totalLessons,
            completedLessons,
            estimatedDuration,
          }
        };
      });

      setPendingCourses(processedCourses);
    } catch (error: any) {
      console.error('Error fetching pending courses:', error);
      toast.error('Failed to load pending courses');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPendingCourses();
  }, [fetchPendingCourses]);

  const handleReviewCourse = async (courseId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      setIsProcessing(true);

      const response = await fetch(`/api/admin/courses/${courseId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          rejection_reason: reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to review course');
      }

      const result = await response.json();

      toast.success(
        action === 'approve' 
          ? 'Course approved and published successfully!' 
          : 'Course rejected with feedback sent to instructor'
      );

      // Remove the course from pending list
      setPendingCourses(prev => prev.filter(course => course.id !== courseId));
      setSelectedCourse(null);
      setReviewAction(null);
      setRejectionReason('');

    } catch (error: any) {
      console.error('Review error:', error);
      toast.error(error.message || 'Failed to review course');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFilteredAndSortedCourses = () => {
    let filtered = pendingCourses;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply content type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(course => course.content_type === filterBy);
    }

    // Add this status filter:
    if (statusTab !== 'all') {
      filtered = filtered.filter(course => course.status === statusTab);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContentTypeIcon = (contentType: string) => {
    return contentType === 'tabor_original' ? (
      <Shield className="w-4 h-4 text-[#FF6B35]" />
    ) : (
      <User className="w-4 h-4 text-[#4ECDC4]" />
    );
  };

  const getContentTypeBadge = (contentType: string) => {
    return contentType === 'tabor_original' ? (
      <Badge className="bg-gradient-to-r from-[#FF6B35] to-[#FF6B35]/80 text-white">
        <Shield className="w-3 h-3 mr-1" />
        Tabor Verified
      </Badge>
    ) : (
      <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
        <User className="w-3 h-3 mr-1" />
        Community
      </Badge>
    );
  };

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

  const filteredCourses = getFilteredAndSortedCourses();

  // Calculate stats for the cards
  const pendingCount = pendingCourses.filter(c => c.status === 'pending_review').length;
  const taborVerifiedCount = pendingCourses.filter(c => c.content_type === 'tabor_original').length;
  const communityCount = pendingCourses.filter(c => c.content_type === 'community').length;
  const totalLessons = pendingCourses.reduce(
    (sum, c) => sum + (c._stats?.totalLessons || 0),
    0
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 bg-white border-r border-[#E5E8E8] shadow-lg">
        {/* ...sidebar content... */}
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        {/* ...top bar for mobile, etc... */}
        <main>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Course Approvals</h1>
            <p className="text-[#2C3E50]/70">
              Review and approve courses submitted by instructors. Ensure content meets Tabor Academy's quality standards.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {/* Pending Review */}
            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{pendingCount}</p>
                    <p className="text-sm text-[#2C3E50]/60">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tabor Verified */}
            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{taborVerifiedCount}</p>
                    <p className="text-sm text-[#2C3E50]/60">Tabor Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Community */}
            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-[#4ECDC4]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{communityCount}</p>
                    <p className="text-sm text-[#2C3E50]/60">Community</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Total Lessons */}
            <Card className="border-[#E5E8E8]">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#2C3E50]">{totalLessons}</p>
                    <p className="text-sm text-[#2C3E50]/60">Total Lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Tab Bar */}
          <div className="flex gap-2 mb-4">
            {[
              { label: 'Pending', value: 'pending_review' },
              { label: 'Approved', value: 'published' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'All', value: 'all' },
            ].map(tab => (
              <button
                key={tab.value}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  statusTab === tab.value
                    ? 'bg-[#4ECDC4] text-white'
                    : 'bg-[#F7F9F9] text-[#2C3E50] hover:bg-[#E5E8E8]'
                }`}
                onClick={() => setStatusTab(tab.value as any)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters and Search */}
          <Card className="border-[#E5E8E8] mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C3E50]/40 w-4 h-4" />
                    <Input
                      placeholder="Search courses, instructors, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-[#E5E8E8] focus:border-[#4ECDC4]"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                    <SelectTrigger className="w-40 border-[#E5E8E8]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="tabor_original">Tabor Verified</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32 border-[#E5E8E8]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Courses List */}
          {filteredCourses.length === 0 ? (
            <Card className="border-[#E5E8E8]">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-[#4ECDC4] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2C3E50] mb-2">
                  {pendingCourses.length === 0 ? 'No Pending Reviews' : 'No Matching Courses'}
                </h3>
                <p className="text-[#2C3E50]/60">
                  {pendingCourses.length === 0 
                    ? 'All courses have been reviewed. Great job keeping up with submissions!'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-[#2C3E50]">{course.title}</h3>
                          {getContentTypeBadge(course.content_type)}
                        </div>
                        <p className="text-[#2C3E50]/70 mb-3 line-clamp-2">{course.description}</p>
                        
                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-sm text-[#2C3E50]/60 mb-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{course._stats.totalModules} modules</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{course._stats.totalLessons} lessons</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>~{Math.round(course._stats.estimatedDuration / 60)}h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{course._stats.completedLessons}/{course._stats.totalLessons} with content</span>
                          </div>
                        </div>

                        {/* Instructor Info */}
                        <div className="flex items-center gap-2 text-sm text-[#2C3E50]/60">
                          <User className="w-4 h-4" />
                          <span>By {course.instructor.full_name}</span>
                          <span>•</span>
                          <span>{course.category}</span>
                          <span>•</span>
                          <span>{course.level}</span>
                          <span>•</span>
                          <span>Submitted {formatDate(course.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedCourse(course)}
                              className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-[#4ECDC4]" />
                                Course Review: {selectedCourse?.title}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedCourse && (
                              <div className="space-y-6">
                                {/* Course Overview */}
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="font-semibold text-[#2C3E50] mb-2">Course Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Title:</strong> {selectedCourse.title}</div>
                                      <div><strong>Category:</strong> {selectedCourse.category}</div>
                                      <div><strong>Level:</strong> {selectedCourse.level}</div>
                                      <div><strong>Type:</strong> {getContentTypeBadge(selectedCourse.content_type)}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-[#2C3E50] mb-2">Instructor</h4>
                                    <div className="space-y-2 text-sm">
                                      <div><strong>Name:</strong> {selectedCourse.instructor.full_name}</div>
                                      <div><strong>Email:</strong> {selectedCourse.instructor.email}</div>
                                      <div><strong>Submitted:</strong> {formatDate(selectedCourse.created_at)}</div>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-[#2C3E50] mb-2">Description</h4>
                                  <p className="text-[#2C3E50]/70">{selectedCourse.description}</p>
                                </div>

                                {/* Course Structure */}
                                <div>
                                  <h4 className="font-semibold text-[#2C3E50] mb-4">Course Structure</h4>
                                  <div className="space-y-4">
                                    {selectedCourse.modules.map((module, moduleIndex) => (
                                      <Card key={module.id} className="border-[#E5E8E8]">
                                        <CardHeader className="pb-3">
                                          <CardTitle className="text-[#2C3E50] flex items-center gap-2">
                                            <span className="w-6 h-6 bg-[#4ECDC4] text-white rounded-full flex items-center justify-center text-sm">
                                              {moduleIndex + 1}
                                            </span>
                                            {module.title}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2">
                                            {module.lessons.map((lesson, lessonIndex) => (
                                              <div
                                                key={lesson.id}
                                                className="flex items-center justify-between p-2 bg-[#F7F9F9] rounded"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <span className="text-sm text-[#2C3E50]/60 w-6">
                                                    {lessonIndex + 1}.
                                                  </span>
                                                  {getLessonIcon(lesson.type)}
                                                  <span className="text-sm font-medium text-[#2C3E50]">
                                                    {lesson.title}
                                                  </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <Badge variant="outline" className="text-xs">
                                                    {lesson.type}
                                                  </Badge>
                                                  {lesson.content ? (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                  ) : (
                                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>

                                {/* Review Actions */}
                                <div className="border-t pt-6">
                                  <h4 className="font-semibold text-[#2C3E50] mb-4">Review Decision</h4>
                                  
                                  {reviewAction === 'reject' && (
                                    <div className="mb-4">
                                      <Label htmlFor="rejection-reason" className="text-[#2C3E50] font-semibold">
                                        Rejection Reason *
                                      </Label>
                                      <Textarea
                                        id="rejection-reason"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Provide specific feedback on what needs to be improved..."
                                        className="mt-2 border-[#E5E8E8] focus:border-red-400"
                                        rows={4}
                                      />
                                    </div>
                                  )}

                                  <div className="flex items-center gap-3">
                                    <Button
                                      onClick={() => {
                                        if (reviewAction === 'approve') {
                                          handleReviewCourse(selectedCourse.id, 'approve');
                                        } else {
                                          setReviewAction('approve');
                                        }
                                      }}
                                      disabled={isProcessing}
                                      className={`${
                                        reviewAction === 'approve'
                                          ? 'bg-green-600 hover:bg-green-700'
                                          : 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90'
                                      } text-white`}
                                    >
                                      {isProcessing && reviewAction === 'approve' ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                          Approving...
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          {reviewAction === 'approve' ? 'Confirm Approval' : 'Approve & Publish'}
                                        </>
                                      )}
                                    </Button>

                                    <Button
                                      onClick={() => {
                                        if (reviewAction === 'reject' && rejectionReason.trim()) {
                                          handleReviewCourse(selectedCourse.id, 'reject', rejectionReason);
                                        } else {
                                          setReviewAction('reject');
                                        }
                                      }}
                                      disabled={isProcessing || (reviewAction === 'reject' && !rejectionReason.trim())}
                                      variant="destructive"
                                    >
                                      {isProcessing && reviewAction === 'reject' ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                          Rejecting...
                                        </>
                                      ) : (
                                        <>
                                          <XCircle className="w-4 h-4 mr-2" />
                                          {reviewAction === 'reject' ? 'Confirm Rejection' : 'Reject Course'}
                                        </>
                                      )}
                                    </Button>

                                    {reviewAction && (
                                      <Button
                                        variant="ghost"
                                        onClick={() => {
                                          setReviewAction(null);
                                          setRejectionReason('');
                                        }}
                                        disabled={isProcessing}
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Content Completeness Warning */}
                    {course._stats.completedLessons < course._stats.totalLessons && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-800">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Incomplete Content: {course._stats.totalLessons - course._stats.completedLessons} lessons missing content
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}