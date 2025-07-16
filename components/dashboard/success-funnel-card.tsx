import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Target, Lightbulb, Rocket, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { withDefault, DEFAULT_BANNER_URL } from "@/lib/defaults";

interface NextStepCourse {
  title: string;
  description: string;
  action: string;
  course?: {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    level: string;
    price: number;
    content_type: string;
  };
}

interface SuccessFunnelCardProps {
  funnelStage: string;
  nextStep: NextStepCourse;
  userName: string;
  completedStages?: string[];
}

export function SuccessFunnelCard({ 
  funnelStage, 
  nextStep, 
  userName, 
  completedStages = [] 
}: SuccessFunnelCardProps) {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Idea':
        return <Lightbulb className="h-8 w-8 text-yellow-500" />;
      case 'MVP':
        return <Rocket className="h-8 w-8 text-blue-500" />;
      case 'Growth':
        return <TrendingUp className="h-8 w-8 text-green-500" />;
      default:
        return <Target className="h-8 w-8 text-orange-500" />;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Idea':
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-200';
      case 'MVP':
        return 'from-blue-500/20 to-purple-500/20 border-blue-200';
      case 'Growth':
        return 'from-green-500/20 to-teal-500/20 border-green-200';
      default:
        return 'from-orange-500/20 to-red-500/20 border-orange-200';
    }
  };

  const getProgressSteps = (currentStage: string) => {
    const stages = [
      { name: 'Idea', label: 'Validate', description: 'Research & validate your business idea' },
      { name: 'MVP', label: 'Build', description: 'Create your minimum viable product' },
      { name: 'Growth', label: 'Scale', description: 'Grow and scale your business' }
    ];
    
    const currentIndex = stages.findIndex(s => s.name === currentStage);
    
    return stages.map((stage, index) => ({
      ...stage,
      completed: completedStages.includes(stage.name) || index < currentIndex,
      current: index === currentIndex,
      upcoming: index > currentIndex
    }));
  };

  const getMotivationalMessage = (stage: string) => {
    switch (stage) {
      case 'Idea':
        return "Every successful business starts with a validated idea. Let's make sure yours is one of them! 💡";
      case 'MVP':
        return "Time to bring your idea to life! Build something your customers will love. 🚀";
      case 'Growth':
        return "Your business is ready to scale! Let's take it to the next level. 📈";
      default:
        return "Your entrepreneurial journey starts here! 🌟";
    }
  };

  const progressSteps = getProgressSteps(funnelStage);
  const currentStepIndex = progressSteps.findIndex(step => step.current);
  const progressPercentage = ((currentStepIndex + 1) / progressSteps.length) * 100;

  return (
    <Card className={`p-8 bg-gradient-to-br ${getStageColor(funnelStage)} border-2 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-y-12"></div>
      </div>
      
      <div className="relative space-y-6">
        {/* Header with Progress */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {getStageIcon(funnelStage)}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4ECDC4] rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">
                {nextStep.title}
              </h2>
              <p className="text-[#2C3E50]/70 text-lg">
                Welcome back, {userName}! 👋
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="outline" className="bg-white/80 text-[#2C3E50] border-[#2C3E50]/20 mb-2">
              {funnelStage} Stage
            </Badge>
            <div className="text-sm text-[#2C3E50]/60">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-white/60 rounded-lg p-4 border border-white/40">
          <p className="text-[#2C3E50] font-medium text-center">
            {getMotivationalMessage(funnelStage)}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#2C3E50]">Your Entrepreneurial Journey</h3>
            <div className="text-sm text-[#2C3E50]/60">
              Step {currentStepIndex + 1} of {progressSteps.length}
            </div>
          </div>
          
          <div className="space-y-3">
            {progressSteps.map((step, index) => (
              <div key={step.name} className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${step.completed 
                    ? 'bg-[#4ECDC4] text-white shadow-lg' 
                    : step.current
                    ? 'bg-[#FF6B35] text-white shadow-lg ring-2 ring-[#FF6B35]/30'
                    : 'bg-white/50 text-[#2C3E50]/50'
                  }
                `}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : step.current ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${
                      step.current ? 'text-[#FF6B35]' : 
                      step.completed ? 'text-[#4ECDC4]' : 
                      'text-[#2C3E50]/60'
                    }`}>
                      {step.label}
                    </h4>
                    {step.completed && (
                      <Badge className="bg-[#4ECDC4] text-white text-xs">
                        Completed
                      </Badge>
                    )}
                    {step.current && (
                      <Badge className="bg-[#FF6B35] text-white text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#2C3E50]/70">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Preview */}
        {nextStep.course && (
          <div className="bg-white/70 rounded-lg p-5 border border-white/50 shadow-sm">
            <h4 className="font-semibold text-[#2C3E50] mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#FF6B35]" />
              Recommended Next Course
            </h4>
            
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#4ECDC4]/20 to-[#FF6B35]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src={withDefault(nextStep.course?.thumbnail_url, DEFAULT_BANNER_URL)}
                  alt={nextStep.course?.title || "Course Thumbnail"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-[#2C3E50] mb-2">
                  {nextStep.course.title}
                </h5>
                <p className="text-sm text-[#2C3E50]/70 line-clamp-2 mb-3">
                  {nextStep.course.description}
                </p>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {nextStep.course.level}
                  </Badge>
                  {nextStep.course.content_type === 'tabor_original' && (
                    <Badge className="text-xs bg-[#FF6B35] text-white">
                      Tabor Verified
                    </Badge>
                  )}
                  <span className="text-sm font-medium text-[#4ECDC4]">
                    {nextStep.course.price === 0 ? 'Free' : `$${nextStep.course.price}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-[#2C3E50]/80 text-lg leading-relaxed">
          {nextStep.description}
        </p>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] hover:from-[#FF6B35]/90 hover:to-[#4ECDC4]/90 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link 
              href={nextStep.course ? `/courses/${nextStep.course.id}` : '/courses'}
              className="flex items-center gap-3"
            >
              {nextStep.action}
              <ArrowRight className="h-6 w-6" />
            </Link>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#2C3E50]/70">
            <span>Journey Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white/50 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-[#4ECDC4] to-[#FF6B35] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}