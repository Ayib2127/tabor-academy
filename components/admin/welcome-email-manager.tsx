"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface WelcomeEmailManagerProps {
  className?: string;
}

export function WelcomeEmailManager({ className }: WelcomeEmailManagerProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUsersWithoutWelcomeEmails();
  }, []);

  const fetchUsersWithoutWelcomeEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/welcome-email');
      const data = await response.json();
      console.log('API response for welcome-email:', data); // Debug line
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users without welcome emails');
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeEmail = async (userId: string) => {
    try {
      setSendingEmails(prev => new Set(prev).add(userId));
      
      const response = await fetch('/api/admin/welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send welcome email');
      }

      toast.success('Welcome email sent successfully');
      
      // Remove user from the list
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast.error('Failed to send welcome email');
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const sendWelcomeEmailsToAll = async () => {
    try {
      setLoading(true);
      
      for (const user of users) {
        await sendWelcomeEmail(user.id);
        // Small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      toast.success(`Welcome emails sent to ${users.length} users`);
      setUsers([]);
    } catch (error) {
      console.error('Error sending welcome emails to all:', error);
      toast.error('Failed to send welcome emails to all users');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Welcome Email Manager
          </CardTitle>
          <CardDescription>
            Managing users who haven't received welcome emails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Welcome Email Manager
        </CardTitle>
        <CardDescription>
          {users.length} users haven't received welcome emails yet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Set!</h3>
            <p className="text-muted-foreground">
              All users have received their welcome emails.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {users.length} users pending
                </span>
              </div>
              <Button
                onClick={sendWelcomeEmailsToAll}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Send to All
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {user.full_name || 'No name provided'}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined: {formatDate(user.created_at)}
                    </div>
                  </div>
                  <Button
                    onClick={() => sendWelcomeEmail(user.id)}
                    disabled={sendingEmails.has(user.id)}
                    size="sm"
                    variant="outline"
                  >
                    {sendingEmails.has(user.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 