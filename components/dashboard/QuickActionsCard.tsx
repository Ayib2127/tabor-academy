'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Settings, 
  BarChart,
  FileText,
  CheckCircle,
  Calendar,
  Bell
} from 'lucide-react';
import Link from 'next/link';

interface QuickActionsCardProps {
  actionItems: Array<{
    type: 'assignment' | 'question' | 'review';
    count: number;
    urgent: boolean;
  }>;
}

export default function QuickActionsCard({ actionItems }: QuickActionsCardProps) {
  const getActionItemCount = (type: string) => {
    return actionItems.find(item => item.type === type)?.count || 0;
  };

  const getActionItemUrgent = (type: string) => {
    return actionItems.find(item => item.type === type)?.urgent || false;
  };

  const quickActions = [
    {
      title: 'Create Course',
      description: 'Start building a new course',
      icon: PlusCircle,
      href: '/dashboard/instructor/course-builder',
      color: 'bg-[#FF6B35] hover:bg-[#FF6B35]/90',
      badge: null
    },
    {
      title: 'Manage Courses',
      description: 'Edit existing courses',
      icon: BookOpen,
      href: '/dashboard/instructor/courses',
      color: 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90',
      badge: null
    },
    {
      title: 'View Students',
      description: 'Manage student enrollments',
      icon: Users,
      href: '/dashboard/instructor/students',
      color: 'bg-[#2C3E50] hover:bg-[#2C3E50]/90',
      badge: null
    },
    {
      title: 'Grade Assignments',
      description: 'Review student submissions',
      icon: CheckCircle,
      href: '/dashboard/instructor/assignments',
      color: 'bg-[#FF6B35] hover:bg-[#FF6B35]/90',
      badge: getActionItemCount('assignment'),
      urgent: getActionItemUrgent('assignment')
    },
    {
      title: 'Answer Questions',
      description: 'Respond to student queries',
      icon: MessageSquare,
      href: '/community/messages',
      color: 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90',
      badge: getActionItemCount('question'),
      urgent: getActionItemUrgent('question')
    },
    {
      title: 'View Analytics',
      description: 'Check course performance',
      icon: BarChart,
      href: '/dashboard/instructor/analytics',
      color: 'bg-[#1B4D3E] hover:bg-[#1B4D3E]/90',
      badge: null
    }
  ];

  const upcomingTasks = [
    {
      title: 'Course Review',
      description: 'Review pending course submissions',
      icon: FileText,
      href: '/dashboard/instructor/courses',
      badge: getActionItemCount('review'),
      urgent: getActionItemUrgent('review')
    },
    {
      title: 'Schedule Session',
      description: 'Plan live teaching sessions',
      icon: Calendar,
      href: '/dashboard/instructor/schedule',
      badge: null,
      urgent: false
    },
    {
      title: 'Notifications',
      description: 'Manage notification settings',
      icon: Bell,
      href: '/dashboard/instructor/settings',
      badge: null,
      urgent: false
    }
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-[#2C3E50]">Quick Actions</h2>
        <Link href="/dashboard/instructor/settings">
          <Button variant="outline" size="sm" className="border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </Link>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Primary Actions */}
        <div>
          <h3 className="text-sm font-semibold text-[#2C3E50] mb-3">Primary Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                asChild
                className={`${action.color} text-white h-auto p-4 flex flex-col items-center gap-2`}
              >
                <Link href={action.href}>
                  <action.icon className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                  {action.badge && action.badge > 0 && (
                    <Badge 
                      variant={action.urgent ? "destructive" : "secondary"}
                      className="absolute -top-1 -right-1 text-xs"
                    >
                      {action.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <h3 className="text-sm font-semibold text-[#2C3E50] mb-3">Upcoming Tasks</h3>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <Button
                key={task.title}
                asChild
                variant="outline"
                className="w-full justify-start h-auto p-3 border-gray-200 hover:bg-[#E5E8E8] hover:border-[#4ECDC4]"
              >
                <Link href={task.href}>
                  <task.icon className="w-4 h-4 mr-3 text-[#4ECDC4]" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm text-[#2C3E50]">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.description}</div>
                  </div>
                  {task.badge && task.badge > 0 && (
                    <Badge 
                      variant={task.urgent ? "destructive" : "secondary"}
                      className="ml-2"
                    >
                      {task.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Urgent Items Summary */}
        {actionItems.some(item => item.urgent) && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="text-sm font-semibold text-red-800 mb-2">Urgent Items</h4>
            <div className="space-y-1">
              {actionItems.filter(item => item.urgent).map((item) => (
                <div key={item.type} className="flex items-center justify-between text-sm">
                  <span className="text-red-700 capitalize">{item.type}s</span>
                  <Badge variant="destructive" className="text-xs">
                    {item.count} pending
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
} 