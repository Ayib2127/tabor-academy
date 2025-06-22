import { FC, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  Search,
  Zap,
  FileText,
  Video,
  HelpCircle,
  BookOpen,
  Settings,
  Eye,
  Save,
  History,
  Sparkles,
  Calendar,
  Users,
  Target,
  ArrowRight,
  Keyboard,
} from 'lucide-react';

interface CommandAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'navigation' | 'content' | 'ai' | 'tools' | 'preview';
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onAIAction: (action: string) => void;
  onPreview: (mode: string) => void;
  courseData?: any;
}

const CommandPalette: FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAIAction,
  onPreview,
  courseData,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredActions, setFilteredActions] = useState<CommandAction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  // Define all available commands
  const allActions: CommandAction[] = [
    // Navigation
    {
      id: 'nav-structure',
      title: 'Go to Course Structure',
      description: 'Navigate to the course structure view',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'navigation',
      shortcut: '⌘ + 1',
      action: () => onNavigate('structure'),
    },
    {
      id: 'nav-schedule',
      title: 'Go to Content Schedule',
      description: 'Navigate to the drip content schedule',
      icon: <Calendar className="w-4 h-4" />,
      category: 'navigation',
      shortcut: '⌘ + 2',
      action: () => onNavigate('schedule'),
    },
    {
      id: 'nav-sessions',
      title: 'Go to Live Sessions',
      description: 'Navigate to live session management',
      icon: <Users className="w-4 h-4" />,
      category: 'navigation',
      shortcut: '⌘ + 3',
      action: () => onNavigate('sessions'),
    },
    
    // Content Creation
    {
      id: 'content-text',
      title: 'Create Text Lesson',
      description: 'Add a new text-based lesson',
      icon: <FileText className="w-4 h-4" />,
      category: 'content',
      shortcut: '⌘ + T',
      action: () => console.log('Create text lesson'),
    },
    {
      id: 'content-video',
      title: 'Create Video Lesson',
      description: 'Add a new video lesson',
      icon: <Video className="w-4 h-4" />,
      category: 'content',
      shortcut: '⌘ + V',
      action: () => console.log('Create video lesson'),
    },
    {
      id: 'content-quiz',
      title: 'Create Quiz',
      description: 'Add a new quiz or assessment',
      icon: <HelpCircle className="w-4 h-4" />,
      category: 'content',
      shortcut: '⌘ + Q',
      action: () => console.log('Create quiz'),
    },
    {
      id: 'content-module',
      title: 'Add Module',
      description: 'Create a new course module',
      icon: <BookOpen className="w-4 h-4" />,
      category: 'content',
      shortcut: '⌘ + M',
      action: () => console.log('Add module'),
    },

    // AI Actions
    {
      id: 'ai-rewrite',
      title: 'AI Rewrite Content',
      description: 'Improve selected content with AI',
      icon: <Sparkles className="w-4 h-4" />,
      category: 'ai',
      shortcut: '⌘ + R',
      action: () => onAIAction('rewrite'),
    },
    {
      id: 'ai-expand',
      title: 'AI Expand Content',
      description: 'Add more detail with AI assistance',
      icon: <Zap className="w-4 h-4" />,
      category: 'ai',
      shortcut: '⌘ + E',
      action: () => onAIAction('expand'),
    },
    {
      id: 'ai-quiz',
      title: 'AI Generate Quiz',
      description: 'Create quiz questions from content',
      icon: <HelpCircle className="w-4 h-4" />,
      category: 'ai',
      shortcut: '⌘ + G',
      action: () => onAIAction('quiz'),
    },
    {
      id: 'ai-outline',
      title: 'AI Create Outline',
      description: 'Generate lesson structure',
      icon: <FileText className="w-4 h-4" />,
      category: 'ai',
      shortcut: '⌘ + O',
      action: () => onAIAction('outline'),
    },

    // Tools
    {
      id: 'tool-save',
      title: 'Save Changes',
      description: 'Save all current changes',
      icon: <Save className="w-4 h-4" />,
      category: 'tools',
      shortcut: '⌘ + S',
      action: () => console.log('Save changes'),
    },
    {
      id: 'tool-history',
      title: 'Version History',
      description: 'View and restore previous versions',
      icon: <History className="w-4 h-4" />,
      category: 'tools',
      shortcut: '⌘ + H',
      action: () => console.log('Open version history'),
    },
    {
      id: 'tool-settings',
      title: 'Course Settings',
      description: 'Configure course properties',
      icon: <Settings className="w-4 h-4" />,
      category: 'tools',
      shortcut: '⌘ + ,',
      action: () => console.log('Open settings'),
    },

    // Preview
    {
      id: 'preview-student',
      title: 'Preview as Student',
      description: 'See how students will view the course',
      icon: <Eye className="w-4 h-4" />,
      category: 'preview',
      shortcut: '⌘ + P',
      action: () => onPreview('student'),
    },
    {
      id: 'preview-week1',
      title: 'Preview Week 1',
      description: 'View course as it appears in week 1',
      icon: <Calendar className="w-4 h-4" />,
      category: 'preview',
      action: () => onPreview('week-1'),
    },
    {
      id: 'preview-week2',
      title: 'Preview Week 2',
      description: 'View course as it appears in week 2',
      icon: <Calendar className="w-4 h-4" />,
      category: 'preview',
      action: () => onPreview('week-2'),
    },
  ];

  // Filter actions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredActions(allActions);
    } else {
      const filtered = allActions.filter(action =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredActions(filtered);
    }
    setSelectedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredActions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredActions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            filteredActions[selectedIndex].action();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation':
        return <ArrowRight className="w-3 h-3" />;
      case 'content':
        return <FileText className="w-3 h-3" />;
      case 'ai':
        return <Sparkles className="w-3 h-3" />;
      case 'tools':
        return <Settings className="w-3 h-3" />;
      case 'preview':
        return <Eye className="w-3 h-3" />;
      default:
        return <Command className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'navigation':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'content':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ai':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'tools':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'preview':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[10vh] z-50">
      <Card ref={paletteRef} className="w-full max-w-2xl shadow-2xl border-[#E5E8E8]">
        <CardContent className="p-0">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[#E5E8E8]">
            <Search className="w-5 h-5 text-[#2C3E50]/60" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands... (⌘K)"
              className="border-0 focus:ring-0 text-lg bg-transparent"
            />
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs border-[#E5E8E8] text-[#2C3E50]/60">
                <Keyboard className="w-3 h-3 mr-1" />
                ⌘K
              </Badge>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-[#2C3E50]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#2C3E50] mb-2">No commands found</h3>
                <p className="text-[#2C3E50]/60">
                  Try searching for something else or browse available categories.
                </p>
              </div>
            ) : (
              <div className="p-2">
                {filteredActions.map((action, index) => (
                  <div
                    key={action.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-[#4ECDC4]/10 border border-[#4ECDC4]/30'
                        : 'hover:bg-[#F7F9F9]'
                    }`}
                    onClick={() => {
                      action.action();
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        index === selectedIndex ? 'bg-[#4ECDC4] text-white' : 'bg-[#F7F9F9] text-[#2C3E50]'
                      }`}>
                        {action.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#2C3E50]">{action.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(action.category)}`}
                          >
                            {getCategoryIcon(action.category)}
                            <span className="ml-1 capitalize">{action.category}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-[#2C3E50]/60">{action.description}</p>
                      </div>
                    </div>
                    {action.shortcut && (
                      <Badge variant="outline" className="text-xs border-[#E5E8E8] text-[#2C3E50]/60">
                        {action.shortcut}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#E5E8E8] bg-[#F7F9F9]">
            <div className="flex items-center justify-between text-xs text-[#2C3E50]/60">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E8E8] rounded text-xs">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E8E8] rounded text-xs">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E8E8] rounded text-xs">esc</kbd>
                  Close
                </span>
              </div>
              <span>{filteredActions.length} commands</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandPalette;