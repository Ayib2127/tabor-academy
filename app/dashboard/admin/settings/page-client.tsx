'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Settings,
  Shield,
  Users,
  Bell,
  Globe,
  Database,
  Save,
  AlertTriangle,
  CheckCircle,
  Megaphone,
  Lock,
  Unlock,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface PlatformSettings {
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  globalAnnouncement: {
    enabled: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
  };
  emailNotifications: boolean;
  courseApprovalRequired: boolean;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
}

export default function AdminSettingsPageClient() {
  const [settings, setSettings] = useState<PlatformSettings>({
    registrationEnabled: true,
    maintenanceMode: false,
    globalAnnouncement: {
      enabled: false,
      title: '',
      message: '',
      type: 'info',
    },
    emailNotifications: true,
    courseApprovalRequired: true,
    maxFileUploadSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4'],
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // For MVP, we'll use localStorage to persist settings
      // In production, this would come from a database
      const savedSettings = localStorage.getItem('platformSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // For MVP, we'll save to localStorage
      // In production, this would save to a database
      localStorage.setItem('platformSettings', JSON.stringify(settings));
      
      // If global announcement is enabled, we would also save it to the database
      // so it can be displayed on user dashboards
      if (settings.globalAnnouncement.enabled && settings.globalAnnouncement.message) {
        // TODO: Save announcement to database
        console.log('Global announcement would be saved:', settings.globalAnnouncement);
      }
      
      setHasChanges(false);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  };

  const updateAnnouncementSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      globalAnnouncement: {
        ...prev.globalAnnouncement,
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Platform Settings</h1>
        <p className="text-[#2C3E50]/70">
          Configure platform-wide settings and controls.
        </p>
        <div className="mt-4">
          <Link href="/dashboard/admin/settings/course">
            <Button className="flex items-center gap-2 bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white">
              <Users className="w-4 h-4" />
              Course Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {/* Security & Access Controls */}
        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF6B35]" />
              Security & Access Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">New User Registrations</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">
                  Allow new users to register for accounts
                </p>
              </div>
              <div className="flex items-center gap-2">
                {settings.registrationEnabled ? (
                  <Unlock className="w-4 h-4 text-green-600" />
                ) : (
                  <Lock className="w-4 h-4 text-red-600" />
                )}
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => updateSetting('registrationEnabled', checked)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Maintenance Mode</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">
                  Put the platform in maintenance mode
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Course Approval Required</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">
                  Require admin approval before courses are published
                </p>
              </div>
              <Switch
                checked={settings.courseApprovalRequired}
                onCheckedChange={(checked) => updateSetting('courseApprovalRequired', checked)}
              />
            </div>

            {!settings.registrationEnabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    New user registrations are currently disabled
                  </span>
                </div>
              </div>
            )}

            {settings.maintenanceMode && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Platform is in maintenance mode - users cannot access the site
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Announcements */}
        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#4ECDC4]" />
              Global Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Enable Global Announcement</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">
                  Display an announcement banner to all users
                </p>
              </div>
              <Switch
                checked={settings.globalAnnouncement.enabled}
                onCheckedChange={(checked) => updateAnnouncementSetting('enabled', checked)}
              />
            </div>

            {settings.globalAnnouncement.enabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="announcement-title" className="text-[#2C3E50] font-semibold">
                    Announcement Title
                  </Label>
                  <Input
                    id="announcement-title"
                    value={settings.globalAnnouncement.title}
                    onChange={(e) => updateAnnouncementSetting('title', e.target.value)}
                    placeholder="e.g., New Feature Release"
                    className="mt-1 border-[#E5E8E8] focus:border-[#4ECDC4]"
                  />
                </div>

                <div>
                  <Label htmlFor="announcement-message" className="text-[#2C3E50] font-semibold">
                    Announcement Message
                  </Label>
                  <Textarea
                    id="announcement-message"
                    value={settings.globalAnnouncement.message}
                    onChange={(e) => updateAnnouncementSetting('message', e.target.value)}
                    placeholder="Enter your announcement message..."
                    className="mt-1 border-[#E5E8E8] focus:border-[#4ECDC4]"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-[#2C3E50] font-semibold">Announcement Type</Label>
                  <select
                    value={settings.globalAnnouncement.type}
                    onChange={(e) => updateAnnouncementSetting('type', e.target.value)}
                    className="mt-1 w-full h-10 px-3 py-2 border border-[#E5E8E8] rounded-md focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                {settings.globalAnnouncement.title && settings.globalAnnouncement.message && (
                  <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4`}>
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Preview:</h4>
                    <div className={`p-3 rounded-lg ${
                      settings.globalAnnouncement.type === 'info' ? 'bg-blue-100 border border-blue-200' :
                      settings.globalAnnouncement.type === 'success' ? 'bg-green-100 border border-green-200' :
                      settings.globalAnnouncement.type === 'warning' ? 'bg-yellow-100 border border-yellow-200' :
                      'bg-red-100 border border-red-200'
                    }`}>
                      <h5 className="font-semibold text-sm">{settings.globalAnnouncement.title}</h5>
                      <p className="text-sm mt-1">{settings.globalAnnouncement.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Configuration */}
        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#FF6B35]" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Email Notifications</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">
                  Send email notifications for important events
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>

            <div>
              <Label htmlFor="max-upload-size" className="text-[#2C3E50] font-semibold">
                Max File Upload Size (MB)
              </Label>
              <Input
                id="max-upload-size"
                type="number"
                value={settings.maxFileUploadSize}
                onChange={(e) => updateSetting('maxFileUploadSize', parseInt(e.target.value))}
                min="1"
                max="100"
                className="mt-1 w-32 border-[#E5E8E8] focus:border-[#4ECDC4]"
              />
            </div>

            <div>
              <Label className="text-[#2C3E50] font-semibold">Allowed File Types</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {settings.allowedFileTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-[#4ECDC4]/10 text-[#4ECDC4] rounded text-sm"
                  >
                    .{type}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {hasChanges && (
          <div className="sticky bottom-4 bg-white border border-[#E5E8E8] rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2C3E50]/70">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">You have unsaved changes</span>
              </div>
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 