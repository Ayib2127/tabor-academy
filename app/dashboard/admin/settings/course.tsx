"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Unlock, Eye, EyeOff, Users } from "lucide-react";

interface CourseSettings {
  enrollmentEnabled: boolean;
  defaultVisibility: "public" | "private";
  maxStudents: number;
}

export default function AdminCourseSettingsPage() {
  const [settings, setSettings] = useState<CourseSettings>({
    enrollmentEnabled: true,
    defaultVisibility: "public",
    maxStudents: 100,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState<CourseSettings | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem("adminCourseSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setInitialSettings(parsed);
      } else {
        setInitialSettings(settings);
      }
    } catch (e) {
      toast.error("Failed to load course settings");
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem("adminCourseSettings", JSON.stringify(settings));
      setHasChanges(false);
      setInitialSettings(settings);
      toast.success("Course settings saved successfully");
    } catch (e) {
      toast.error("Failed to save course settings");
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    if (initialSettings) {
      setSettings(initialSettings);
      setHasChanges(false);
    }
  };

  const updateSetting = (key: keyof CourseSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Course Settings</h1>
        <p className="text-[#2C3E50]/70">Configure default settings for all courses on the platform.</p>
      </div>
      <div className="max-w-2xl">
        <Card className="border-[#E5E8E8] shadow-sm">
          <CardHeader className="bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
            <CardTitle className="text-[#2C3E50] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#4ECDC4]" /> Course Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Enable Enrollment</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">Allow students to enroll in courses by default.</p>
              </div>
              <div className="flex items-center gap-2">
                {settings.enrollmentEnabled ? (
                  <Unlock className="w-4 h-4 text-green-600" />
                ) : (
                  <Lock className="w-4 h-4 text-red-600" />
                )}
                <Switch
                  checked={settings.enrollmentEnabled}
                  onCheckedChange={(checked) => updateSetting("enrollmentEnabled", checked)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Default Visibility</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">Set whether new courses are public or private by default.</p>
              </div>
              <div className="flex items-center gap-2">
                {settings.defaultVisibility === "public" ? (
                  <Eye className="w-4 h-4 text-[#4ECDC4]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-[#FF6B35]" />
                )}
                <Button
                  variant={settings.defaultVisibility === "public" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("defaultVisibility", "public")}
                  className={settings.defaultVisibility === "public" ? "bg-[#4ECDC4] text-white" : ""}
                >
                  Public
                </Button>
                <Button
                  variant={settings.defaultVisibility === "private" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("defaultVisibility", "private")}
                  className={settings.defaultVisibility === "private" ? "bg-[#FF6B35] text-white" : ""}
                >
                  Private
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#2C3E50] font-semibold">Max Students Per Course</Label>
                <p className="text-sm text-[#2C3E50]/60 mt-1">Limit the number of students that can enroll in a single course.</p>
              </div>
              <Input
                type="number"
                min={1}
                max={10000}
                value={settings.maxStudents}
                onChange={(e) => updateSetting("maxStudents", Number(e.target.value))}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-4 mt-8">
          <Button
            onClick={saveSettings}
            disabled={!hasChanges || saving}
            className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={cancelChanges}
            disabled={!hasChanges || saving}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
} 