'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, CheckCircle, MessageSquare, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ActivityItem {
  id: string;
  type: 'enrollment' | 'completion' | 'assignment' | 'question';
  student: string;
  action: string;
  course: string;
  time: string;
  avatar?: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <Users className="w-4 h-4 text-[#4ECDC4]" />;
      case 'completion':
        return <CheckCircle className="w-4 h-4 text-[#1B4D3E]" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-[#FF6B35]" />;
      case 'question':
        return <MessageSquare className="w-4 h-4 text-[#4ECDC4]" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20';
      case 'completion':
        return 'bg-[#1B4D3E]/10 text-[#1B4D3E] border-[#1B4D3E]/20';
      case 'assignment':
        return 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20';
      case 'question':
        return 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatTimeAgo = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50]">Recent Activity</h2>
        <Link href="/dashboard/instructor/activity">
          <Button variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            View All
          </Button>
        </Link>
      </div>
      
      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No recent activity</p>
            <p className="text-sm text-gray-400">Student activities will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-[#E5E8E8] rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full border-2 border-[#4ECDC4]/20 overflow-hidden bg-[#4ECDC4] flex items-center justify-center">
                  {activity.avatar ? (
                    <Image 
                      src={activity.avatar} 
                      alt={activity.student} 
                      width={32} 
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-white font-medium">
                      {getInitials(activity.student)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActivityIcon(activity.type)}
                    <span className="font-medium text-sm text-[#2C3E50] truncate">
                      {activity.student}
                    </span>
                    <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    {activity.action} <span className="font-medium text-[#2C3E50]">{activity.course}</span>
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(activity.time)}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {activities.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
                <Link href="/dashboard/instructor/students">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white">
                <Link href="/community/messages">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 