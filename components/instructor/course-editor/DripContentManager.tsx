import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  Clock,
  Lock,
  Unlock,
  ArrowRight,
  BookOpen,
  Users,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  lessons: any[];
  unlocks_on_week?: number;
  weekly_sprint_goal?: string;
  order: number;
}

interface DripContentManagerProps {
  modules: Module[];
  onModuleUpdate: (moduleId: string, updates: Partial<Module>) => void;
  startDate?: string;
  totalWeeks?: number;
}

const DripContentManager: FC<DripContentManagerProps> = ({
  modules,
  onModuleUpdate,
  startDate,
  totalWeeks = 12,
}) => {
  const [draggedModule, setDraggedModule] = useState<string | null>(null);

  // Calculate week dates based on start date
  const getWeekDates = () => {
    if (!startDate) return [];
    
    const dates = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + (i * 7));
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      dates.push({
        week: i + 1,
        startDate: weekStart,
        endDate: weekEnd,
        isCurrentWeek: isCurrentWeek(weekStart, weekEnd),
        isPastWeek: isPastWeek(weekEnd),
      });
    }
    
    return dates;
  };

  const isCurrentWeek = (weekStart: Date, weekEnd: Date) => {
    const now = new Date();
    return now >= weekStart && now <= weekEnd;
  };

  const isPastWeek = (weekEnd: Date) => {
    const now = new Date();
    return now > weekEnd;
  };

  // Group modules by week
  const getModulesByWeek = () => {
    const weekGroups: { [key: number]: Module[] } = {};
    const unassignedModules: Module[] = [];

    modules.forEach(module => {
      const week = module.unlocks_on_week;
      if (week && week > 0) {
        if (!weekGroups[week]) {
          weekGroups[week] = [];
        }
        weekGroups[week].push(module);
      } else {
        unassignedModules.push(module);
      }
    });

    return { weekGroups, unassignedModules };
  };

  const handleWeekChange = (moduleId: string, newWeek: number) => {
    onModuleUpdate(moduleId, { unlocks_on_week: newWeek });
    toast.success('Module week updated successfully');
  };

  const handleDragStart = (moduleId: string) => {
    setDraggedModule(moduleId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetWeek: number) => {
    e.preventDefault();
    if (draggedModule) {
      handleWeekChange(draggedModule, targetWeek);
      setDraggedModule(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getWeekStatus = (week: number, weekData: any) => {
    if (weekData?.isPastWeek) {
      return { status: 'past', icon: <Clock className="w-4 h-4" />, color: 'text-gray-500' };
    }
    if (weekData?.isCurrentWeek) {
      return { status: 'current', icon: <Users className="w-4 h-4" />, color: 'text-[#4ECDC4]' };
    }
    return { status: 'future', icon: <Calendar className="w-4 h-4" />, color: 'text-[#2C3E50]' };
  };

  const { weekGroups, unassignedModules } = getModulesByWeek();
  const weekDates = getWeekDates();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50]">Drip Content Schedule</h3>
          <p className="text-sm text-[#2C3E50]/60 mt-1">
            Organize modules by week to control when content becomes available to students.
          </p>
        </div>
        {startDate && (
          <Badge variant="outline" className="border-[#4ECDC4]/30 text-[#4ECDC4]">
            <Calendar className="w-4 h-4 mr-1" />
            Starts {formatDate(new Date(startDate))}
          </Badge>
        )}
      </div>

      {/* Course Timeline */}
      <div className="grid gap-4">
        {Array.from({ length: totalWeeks }, (_, index) => {
          const week = index + 1;
          const weekData = weekDates[index];
          const weekModules = weekGroups[week] || [];
          const weekStatus = getWeekStatus(week, weekData);

          return (
            <Card
              key={week}
              className={`border transition-all duration-200 ${
                weekStatus.status === 'current'
                  ? 'border-[#4ECDC4] bg-[#4ECDC4]/5'
                  : weekStatus.status === 'past'
                  ? 'border-gray-200 bg-gray-50'
                  : 'border-[#E5E8E8] hover:border-[#4ECDC4]/50'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, week)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      weekStatus.status === 'current'
                        ? 'bg-[#4ECDC4] text-white'
                        : weekStatus.status === 'past'
                        ? 'bg-gray-400 text-white'
                        : 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white'
                    }`}>
                      {week}
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${weekStatus.color}`}>
                        Week {week}
                      </CardTitle>
                      {weekData && (
                        <p className="text-sm text-[#2C3E50]/60">
                          {formatDate(weekData.startDate)} - {formatDate(weekData.endDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {weekStatus.icon}
                    {weekStatus.status === 'current' && (
                      <Badge className="bg-[#4ECDC4] text-white">Active</Badge>
                    )}
                    {weekStatus.status === 'past' && (
                      <Badge variant="secondary">Completed</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {weekModules.length > 0 ? (
                  <div className="space-y-3">
                    {weekModules.map((module) => (
                      <div
                        key={module.id}
                        draggable
                        onDragStart={() => handleDragStart(module.id)}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E5E8E8] cursor-move hover:border-[#4ECDC4]/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[#4ECDC4]" />
                          <div>
                            <h4 className="font-medium text-[#2C3E50]">{module.title}</h4>
                            <p className="text-sm text-[#2C3E50]/60">
                              {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {module.weekly_sprint_goal && (
                            <Target className="w-4 h-4 text-[#FF6B35]" title="Has weekly goal" />
                          )}
                          <Select
                            value={module.unlocks_on_week?.toString() || ''}
                            onValueChange={(value) => handleWeekChange(module.id, parseInt(value))}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs border-[#E5E8E8]">
                              <SelectValue placeholder="Week" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: totalWeeks }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  Week {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-[#E5E8E8] rounded-lg">
                    <Lock className="w-8 h-8 text-[#2C3E50]/40 mx-auto mb-2" />
                    <p className="text-sm text-[#2C3E50]/60">
                      No modules assigned to this week
                    </p>
                    <p className="text-xs text-[#2C3E50]/40 mt-1">
                      Drag modules here or use the dropdown to assign
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Unassigned Modules */}
      {unassignedModules.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-yellow-800">Unassigned Modules</CardTitle>
            </div>
            <p className="text-sm text-yellow-700">
              These modules are not assigned to any week and won't be accessible to students.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {unassignedModules.map((module) => (
                <div
                  key={module.id}
                  draggable
                  onDragStart={() => handleDragStart(module.id)}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200 cursor-move hover:border-yellow-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-[#2C3E50]">{module.title}</h4>
                      <p className="text-sm text-[#2C3E50]/60">
                        {module.lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <Select
                    value=""
                    onValueChange={(value) => handleWeekChange(module.id, parseInt(value))}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs border-yellow-300">
                      <SelectValue placeholder="Assign to week" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: totalWeeks }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Week {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-blue-900 mb-2">💡 Drip Content Best Practices</h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Assign modules to weeks based on learning progression</li>
          <li>• Ensure each week has a balanced workload</li>
          <li>• Set clear weekly goals to guide student focus</li>
          <li>• Consider prerequisites when scheduling content</li>
          <li>• Leave buffer time for student questions and review</li>
        </ul>
      </div>
    </div>
  );
};

export default DripContentManager;