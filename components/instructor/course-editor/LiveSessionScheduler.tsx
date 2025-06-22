import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Users,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';

interface LiveSession {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  meeting_link?: string;
  week_number: number;
  max_participants?: number;
  location?: string; // for in-person sessions
  type: 'online' | 'in_person' | 'hybrid';
}

interface LiveSessionSchedulerProps {
  courseId: string;
  sessions: LiveSession[];
  onSessionsChange: (sessions: LiveSession[]) => void;
  startDate?: string;
  endDate?: string;
}

const LiveSessionScheduler: FC<LiveSessionSchedulerProps> = ({
  courseId,
  sessions,
  onSessionsChange,
  startDate,
  endDate,
}) => {
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [newSession, setNewSession] = useState<Partial<LiveSession>>({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    type: 'online',
    week_number: 1,
  });

  const handleAddSession = () => {
    if (!newSession.title || !newSession.date || !newSession.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    const session: LiveSession = {
      id: `session-${Date.now()}`,
      title: newSession.title!,
      description: newSession.description,
      date: newSession.date!,
      time: newSession.time!,
      duration: newSession.duration || 60,
      meeting_link: newSession.meeting_link,
      week_number: newSession.week_number || 1,
      max_participants: newSession.max_participants,
      location: newSession.location,
      type: newSession.type || 'online',
    };

    onSessionsChange([...sessions, session]);
    setNewSession({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: 60,
      type: 'online',
      week_number: 1,
    });
    setIsAddingSession(false);
    toast.success('Live session added successfully');
  };

  const handleUpdateSession = (sessionId: string, updates: Partial<LiveSession>) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId ? { ...session, ...updates } : session
    );
    onSessionsChange(updatedSessions);
    toast.success('Session updated successfully');
  };

  const handleDeleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    onSessionsChange(updatedSessions);
    toast.success('Session deleted successfully');
  };

  const getSessionsByWeek = () => {
    const weekGroups: { [key: number]: LiveSession[] } = {};
    sessions.forEach(session => {
      const week = session.week_number;
      if (!weekGroups[week]) {
        weekGroups[week] = [];
      }
      weekGroups[week].push(session);
    });

    return Object.entries(weekGroups)
      .map(([week, sessions]) => ({
        week: parseInt(week),
        sessions: sessions.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()),
      }))
      .sort((a, b) => a.week - b.week);
  };

  const formatDateTime = (date: string, time: string) => {
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Video className="w-4 h-4 text-[#4ECDC4]" />;
      case 'in_person':
        return <MapPin className="w-4 h-4 text-[#FF6B35]" />;
      case 'hybrid':
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Video className="w-4 h-4 text-[#4ECDC4]" />;
    }
  };

  const getSessionTypeBadge = (type: string) => {
    const variants = {
      online: 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20',
      in_person: 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20',
      hybrid: 'bg-purple-100 text-purple-600 border-purple-200',
    };

    return (
      <Badge variant="outline" className={variants[type as keyof typeof variants] || variants.online}>
        {getSessionTypeIcon(type)}
        <span className="ml-1 capitalize">{type.replace('_', ' ')}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#2C3E50]">Live Sessions</h3>
          <p className="text-sm text-[#2C3E50]/60 mt-1">
            Schedule and manage live sessions for your cohort course.
          </p>
        </div>
        <Button
          onClick={() => setIsAddingSession(true)}
          className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Session
        </Button>
      </div>

      {/* Add Session Form */}
      {isAddingSession && (
        <Card className="border-[#4ECDC4] shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#4ECDC4]/5 to-[#FF6B35]/5">
            <CardTitle className="text-[#2C3E50]">Add New Live Session</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-title" className="text-[#2C3E50] font-semibold">
                  Session Title *
                </Label>
                <Input
                  id="session-title"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  placeholder="e.g., Week 1 Kickoff Session"
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
              <div>
                <Label htmlFor="session-week" className="text-[#2C3E50] font-semibold">
                  Week Number *
                </Label>
                <Input
                  id="session-week"
                  type="number"
                  min="1"
                  value={newSession.week_number}
                  onChange={(e) => setNewSession({ ...newSession, week_number: parseInt(e.target.value) })}
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="session-description" className="text-[#2C3E50] font-semibold">
                Description
              </Label>
              <Textarea
                id="session-description"
                value={newSession.description}
                onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                placeholder="Describe what will be covered in this session..."
                className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="session-date" className="text-[#2C3E50] font-semibold">
                  Date *
                </Label>
                <Input
                  id="session-date"
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
              <div>
                <Label htmlFor="session-time" className="text-[#2C3E50] font-semibold">
                  Time *
                </Label>
                <Input
                  id="session-time"
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
              <div>
                <Label htmlFor="session-duration" className="text-[#2C3E50] font-semibold">
                  Duration (minutes)
                </Label>
                <Input
                  id="session-duration"
                  type="number"
                  min="15"
                  step="15"
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-type" className="text-[#2C3E50] font-semibold">
                  Session Type
                </Label>
                <select
                  id="session-type"
                  value={newSession.type}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value as 'online' | 'in_person' | 'hybrid' })}
                  className="w-full h-10 px-3 py-2 border border-[#E5E8E8] rounded-md focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                >
                  <option value="online">Online</option>
                  <option value="in_person">In Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="session-participants" className="text-[#2C3E50] font-semibold">
                  Max Participants
                </Label>
                <Input
                  id="session-participants"
                  type="number"
                  min="1"
                  value={newSession.max_participants || ''}
                  onChange={(e) => setNewSession({ ...newSession, max_participants: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="Unlimited"
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            </div>

            {newSession.type !== 'in_person' && (
              <div>
                <Label htmlFor="session-link" className="text-[#2C3E50] font-semibold">
                  Meeting Link
                </Label>
                <Input
                  id="session-link"
                  type="url"
                  value={newSession.meeting_link}
                  onChange={(e) => setNewSession({ ...newSession, meeting_link: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            )}

            {newSession.type !== 'online' && (
              <div>
                <Label htmlFor="session-location" className="text-[#2C3E50] font-semibold">
                  Location
                </Label>
                <Input
                  id="session-location"
                  value={newSession.location}
                  onChange={(e) => setNewSession({ ...newSession, location: e.target.value })}
                  placeholder="e.g., Conference Room A, 123 Main St"
                  className="border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <Button
                onClick={handleAddSession}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                Add Session
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingSession(false);
                  setNewSession({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    duration: 60,
                    type: 'online',
                    week_number: 1,
                  });
                }}
                className="border-[#E5E8E8] hover:border-[#4ECDC4]"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-[#4ECDC4] mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-[#2C3E50] mb-2">No Live Sessions Yet</h4>
          <p className="text-[#2C3E50]/60 mb-4">
            Add your first live session to start engaging with your cohort students.
          </p>
          <Button
            onClick={() => setIsAddingSession(true)}
            className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Session
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {getSessionsByWeek().map(({ week, sessions: weekSessions }) => (
            <div key={week}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {week}
                </div>
                <h4 className="text-lg font-semibold text-[#2C3E50]">Week {week}</h4>
              </div>

              <div className="grid gap-4">
                {weekSessions.map((session) => (
                  <Card key={session.id} className="border-[#E5E8E8] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="text-lg font-semibold text-[#2C3E50]">{session.title}</h5>
                            {getSessionTypeBadge(session.type)}
                          </div>

                          {session.description && (
                            <p className="text-[#2C3E50]/70 mb-3">{session.description}</p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-[#2C3E50]/60">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDateTime(session.date, session.time)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{session.duration} minutes</span>
                            </div>
                            {session.max_participants && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>Max {session.max_participants}</span>
                              </div>
                            )}
                          </div>

                          {session.meeting_link && (
                            <div className="mt-3">
                              <a
                                href={session.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#4ECDC4] hover:text-[#4ECDC4]/80 text-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Join Meeting
                              </a>
                            </div>
                          )}

                          {session.location && (
                            <div className="mt-2 flex items-center gap-1 text-sm text-[#2C3E50]/60">
                              <MapPin className="w-4 h-4" />
                              <span>{session.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSession(session.id)}
                            className="text-[#4ECDC4] hover:text-[#4ECDC4]/80 hover:bg-[#4ECDC4]/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveSessionScheduler;