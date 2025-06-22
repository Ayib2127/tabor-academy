import { FC, useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  weekly_sprint_goal?: string;
  unlocks_on_week?: number;
  lessons: any[];
}

interface WeeklyGoalEditorProps {
  module: Module;
  onUpdate: (moduleId: string, updates: Partial<Module>) => void;
  weekNumber?: number;
}

const WeeklyGoalEditor: FC<WeeklyGoalEditorProps> = ({
  module,
  onUpdate,
  weekNumber,
}) => {
  const [goal, setGoal] = useState(module.weekly_sprint_goal || '');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setGoal(module.weekly_sprint_goal || '');
    setHasChanges(false);
  }, [module.weekly_sprint_goal]);

  const handleGoalChange = (value: string) => {
    setGoal(value);
    setHasChanges(value !== (module.weekly_sprint_goal || ''));
  };

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      
      // Update the module with the new goal
      onUpdate(module.id, { weekly_sprint_goal: goal });
      
      setSaveStatus('saved');
      setHasChanges(false);
      toast.success('Weekly goal updated successfully');
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
      
    } catch (error: any) {
      console.error('Error saving weekly goal:', error);
      setSaveStatus('error');
      toast.error('Failed to save weekly goal');
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-2 text-blue-600" aria-live="polite">
            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-2 text-green-600" aria-live="polite">
            <CheckCircle className="w-3 h-3" />
            <span className="text-xs">Saved ✓</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600" aria-live="polite">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">Save failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getGoalStatus = () => {
    if (!goal.trim()) {
      return { status: 'empty', message: 'No goal set for this week' };
    }
    if (goal.length < 20) {
      return { status: 'short', message: 'Consider adding more detail to your goal' };
    }
    if (goal.length > 500) {
      return { status: 'long', message: 'Goal is quite detailed - consider summarizing key points' };
    }
    return { status: 'good', message: 'Goal looks good!' };
  };

  const goalStatus = getGoalStatus();

  return (
    <Card className="border-[#E5E8E8] shadow-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#FF6B35]" />
            <CardTitle className="text-[#2C3E50]">
              Weekly Sprint Goal
              {weekNumber && (
                <span className="ml-2 text-sm font-normal text-[#2C3E50]/60">
                  (Week {weekNumber})
                </span>
              )}
            </CardTitle>
          </div>
          {renderSaveStatus()}
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="weekly-goal" className="text-[#2C3E50] font-semibold">
            Define the key outcome for this week
          </Label>
          <p className="text-sm text-[#2C3E50]/60 mt-1 mb-3">
            What should students achieve by the end of this week? This will be prominently displayed to help them stay focused.
          </p>
          <Textarea
            id="weekly-goal"
            value={goal}
            onChange={(e) => handleGoalChange(e.target.value)}
            placeholder="e.g., By the end of this week, students will be able to create their first landing page using no-code tools and understand the fundamentals of conversion optimization."
            className="border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 min-h-[120px]"
            rows={5}
          />
          
          {/* Character count and status */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  goalStatus.status === 'good' 
                    ? 'border-green-200 text-green-700 bg-green-50' 
                    : goalStatus.status === 'empty'
                    ? 'border-gray-200 text-gray-600 bg-gray-50'
                    : 'border-yellow-200 text-yellow-700 bg-yellow-50'
                }`}
              >
                {goalStatus.message}
              </Badge>
            </div>
            <span className="text-xs text-[#2C3E50]/60">
              {goal.length} characters
            </span>
          </div>
        </div>

        {/* Module Info */}
        <div className="bg-[#F7F9F9] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#2C3E50] mb-2">Module: {module.title}</h4>
          <div className="flex items-center gap-4 text-xs text-[#2C3E50]/60">
            <span>{module.lessons.length} lessons</span>
            {weekNumber && <span>Week {weekNumber}</span>}
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Goal
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setGoal(module.weekly_sprint_goal || '');
                setHasChanges(false);
              }}
              className="border-[#E5E8E8] hover:border-[#4ECDC4]"
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips for Effective Weekly Goals</h5>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Be specific about what students will accomplish</li>
            <li>• Focus on outcomes rather than activities</li>
            <li>• Make it measurable and achievable within the week</li>
            <li>• Connect to the overall course objectives</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyGoalEditor;