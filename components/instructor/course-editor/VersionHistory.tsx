import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  History,
  Clock,
  User,
  RotateCcw,
  Eye,
  GitBranch,
  Calendar,
  FileText,
  Diff,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface VersionSnapshot {
  id: string;
  timestamp: Date;
  content: any;
  author: string;
  changeType: 'auto_save' | 'manual_save' | 'major_edit' | 'ai_generated';
  description: string;
  wordCount: number;
  characterCount: number;
}

interface VersionHistoryProps {
  lessonId: string;
  currentContent: any;
  onRestore: (content: any) => void;
  onClose: () => void;
}

const VersionHistory: FC<VersionHistoryProps> = ({
  lessonId,
  currentContent,
  onRestore,
  onClose,
}) => {
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDiff, setShowDiff] = useState(false);

  // Mock version history data
  useEffect(() => {
    const loadVersionHistory = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock version data
      const mockVersions: VersionSnapshot[] = [
        {
          id: 'v1',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          content: currentContent,
          author: 'Current User',
          changeType: 'auto_save',
          description: 'Auto-saved changes',
          wordCount: 245,
          characterCount: 1456,
        },
        {
          id: 'v2',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          content: { /* previous content */ },
          author: 'Current User',
          changeType: 'manual_save',
          description: 'Added examples and improved formatting',
          wordCount: 198,
          characterCount: 1203,
        },
        {
          id: 'v3',
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          content: { /* previous content */ },
          author: 'AI Assistant',
          changeType: 'ai_generated',
          description: 'AI-enhanced content with better structure',
          wordCount: 156,
          characterCount: 945,
        },
        {
          id: 'v4',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          content: { /* previous content */ },
          author: 'Current User',
          changeType: 'major_edit',
          description: 'Complete rewrite of introduction section',
          wordCount: 134,
          characterCount: 823,
        },
        {
          id: 'v5',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          content: { /* previous content */ },
          author: 'Current User',
          changeType: 'manual_save',
          description: 'Initial lesson content creation',
          wordCount: 89,
          characterCount: 567,
        },
      ];
      
      setVersions(mockVersions);
      setIsLoading(false);
    };

    loadVersionHistory();
  }, [lessonId, currentContent]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return timestamp.toLocaleDateString();
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'auto_save':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'manual_save':
        return <User className="w-4 h-4 text-green-500" />;
      case 'major_edit':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'ai_generated':
        return <GitBranch className="w-4 h-4 text-purple-500" />;
      default:
        return <History className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeTypeBadge = (type: string) => {
    const variants = {
      auto_save: 'bg-blue-100 text-blue-700 border-blue-200',
      manual_save: 'bg-green-100 text-green-700 border-green-200',
      major_edit: 'bg-orange-100 text-orange-700 border-orange-200',
      ai_generated: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    const labels = {
      auto_save: 'Auto Save',
      manual_save: 'Manual Save',
      major_edit: 'Major Edit',
      ai_generated: 'AI Generated',
    };

    return (
      <Badge 
        variant="outline" 
        className={variants[type as keyof typeof variants] || 'bg-gray-100 text-gray-700 border-gray-200'}
      >
        {labels[type as keyof typeof labels] || 'Unknown'}
      </Badge>
    );
  };

  const handlePreview = (version: VersionSnapshot) => {
    setSelectedVersion(version.id);
    setPreviewContent(version.content);
  };

  const handleRestore = (version: VersionSnapshot) => {
    if (window.confirm('Are you sure you want to restore this version? Current changes will be lost.')) {
      onRestore(version.content);
      toast.success(`Restored version from ${formatTimestamp(version.timestamp)}`);
      onClose();
    }
  };

  const calculateDiff = (oldVersion: VersionSnapshot, newVersion: VersionSnapshot) => {
    const wordDiff = newVersion.wordCount - oldVersion.wordCount;
    const charDiff = newVersion.characterCount - oldVersion.characterCount;
    
    return {
      words: wordDiff,
      characters: charDiff,
      wordsPercent: oldVersion.wordCount > 0 ? Math.round((wordDiff / oldVersion.wordCount) * 100) : 0,
      charactersPercent: oldVersion.characterCount > 0 ? Math.round((charDiff / oldVersion.characterCount) * 100) : 0,
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#4ECDC4]" />
              <CardTitle className="text-[#2C3E50]">Version History</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-[#2C3E50]/60">
            View and restore previous versions of your lesson content
          </p>
        </CardHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Version List */}
          <div className="w-1/2 border-r">
            <div className="p-4 border-b bg-[#F7F9F9]">
              <h3 className="font-semibold text-[#2C3E50]">Versions</h3>
              <p className="text-sm text-[#2C3E50]/60">
                {versions.length} versions available
              </p>
            </div>
            
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  versions.map((version, index) => {
                    const isSelected = selectedVersion === version.id;
                    const previousVersion = versions[index + 1];
                    const diff = previousVersion ? calculateDiff(previousVersion, version) : null;

                    return (
                      <Card
                        key={version.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'border-[#4ECDC4] bg-[#4ECDC4]/5' 
                            : 'border-[#E5E8E8] hover:border-[#4ECDC4]/50'
                        }`}
                        onClick={() => handlePreview(version)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getChangeTypeIcon(version.changeType)}
                              <span className="text-sm font-medium text-[#2C3E50]">
                                {formatTimestamp(version.timestamp)}
                              </span>
                            </div>
                            {getChangeTypeBadge(version.changeType)}
                          </div>
                          
                          <p className="text-sm text-[#2C3E50]/70 mb-2">
                            {version.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-[#2C3E50]/60">
                            <span>By {version.author}</span>
                            <div className="flex items-center gap-3">
                              <span>{version.wordCount} words</span>
                              <span>{version.characterCount} chars</span>
                            </div>
                          </div>

                          {diff && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              {diff.words !== 0 && (
                                <span className={`${
                                  diff.words > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {diff.words > 0 ? '+' : ''}{diff.words} words
                                </span>
                              )}
                              {diff.characters !== 0 && (
                                <span className={`${
                                  diff.characters > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {diff.characters > 0 ? '+' : ''}{diff.characters} chars
                                </span>
                              )}
                            </div>
                          )}

                          {isSelected && (
                            <div className="mt-3 flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestore(version);
                                }}
                                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Restore
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowDiff(!showDiff);
                                }}
                                className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                              >
                                <Diff className="w-3 h-3 mr-1" />
                                {showDiff ? 'Hide' : 'Show'} Diff
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2">
            <div className="p-4 border-b bg-[#F7F9F9]">
              <h3 className="font-semibold text-[#2C3E50]">Preview</h3>
              <p className="text-sm text-[#2C3E50]/60">
                {selectedVersion ? 'Content preview' : 'Select a version to preview'}
              </p>
            </div>
            
            <ScrollArea className="h-full">
              <div className="p-4">
                {selectedVersion ? (
                  <div className="space-y-4">
                    {showDiff ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                          Content Differences
                        </h4>
                        <div className="text-sm text-yellow-700 space-y-2">
                          <div className="bg-green-100 border border-green-200 rounded p-2">
                            <span className="text-green-800">+ Added content</span>
                          </div>
                          <div className="bg-red-100 border border-red-200 rounded p-2">
                            <span className="text-red-800">- Removed content</span>
                          </div>
                          <div className="bg-blue-100 border border-blue-200 rounded p-2">
                            <span className="text-blue-800">~ Modified content</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-white border border-[#E5E8E8] rounded-lg p-4">
                          <p className="text-[#2C3E50]">
                            Content preview for selected version...
                          </p>
                          <p className="text-sm text-[#2C3E50]/60 mt-2">
                            This would show the actual content from the selected version.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-[#4ECDC4] mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">
                      No Version Selected
                    </h4>
                    <p className="text-[#2C3E50]/60">
                      Click on a version from the list to preview its content.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-[#F7F9F9]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#2C3E50]/60">
              Versions are automatically saved every few minutes and when you make significant changes.
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#E5E8E8] hover:border-[#4ECDC4]"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VersionHistory;