"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Camera, User as UserIcon, X } from "lucide-react";
import Image from "next/image";

export default function InstructorProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    photo: "",
    title: "",
    bio: "",
    expertise: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changed, setChanged] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile from API on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const res = await fetch("/api/instructor/profile", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.full_name || "",
          photo: data.avatar_url || "",
          title: data.title || "",
          bio: data.bio || "",
          expertise: data.expertise || [],
        });
      } else {
        toast.error("Failed to load profile.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setChanged(true);
  };

  const handleSkillInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      (e.key === "Enter" || e.key === ",") &&
      skillInputRef.current &&
      skillInputRef.current.value.trim()
    ) {
      e.preventDefault();
      const newSkill = skillInputRef.current.value.trim();
      if (
        newSkill &&
        !profile.expertise.includes(newSkill)
      ) {
        setProfile((prev) => ({
          ...prev,
          expertise: [...prev.expertise, newSkill],
        }));
        setChanged(true);
      }
      skillInputRef.current.value = "";
    }
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((s) => s !== skill),
    }));
    setChanged(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/instructor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.name,
          avatar_url: profile.photo,
          title: profile.title,
          bio: profile.bio,
          expertise: profile.expertise,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Profile updated!");
      setChanged(false);
    } catch (e) {
      toast.error("Failed to update profile.");
    }
    setSaving(false);
  };

  const isValid =
    profile.name.trim() &&
    profile.title.trim() &&
    profile.bio.trim() &&
    profile.expertise.length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow bg-gradient-to-r from-[#FF6B35]/10 to-[#4ECDC4]/10">
      <h1 className="text-3xl font-bold mb-8 text-[#2C3E50] text-center">Edit Instructor Profile</h1>
      <form
        className="flex flex-col items-center gap-6"
        onSubmit={e => {
          e.preventDefault();
          if (isValid && changed) handleSave();
        }}
      >
        {/* Avatar */}
        <div className="relative w-28 h-28 mb-2 group">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt="Avatar"
              width={112}
              height={112}
              className="rounded-full border-4 border-[#4ECDC4] object-cover"
            />
          ) : (
            <div className="rounded-full w-28 h-28 flex items-center justify-center bg-[#F7F9F9] border-4 border-[#4ECDC4]">
              <UserIcon className="w-14 h-14 text-[#6E6C75]" />
            </div>
          )}
          <label className="absolute bottom-2 right-2 bg-[#FF6B35] rounded-full p-2 cursor-pointer shadow-lg hover:scale-105 transition">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('image', file);
                try {
                  const response = await fetch('/api/instructor/images/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to upload image');
                  }
                  const data = await response.json();
                  setProfile((prev) => ({ ...prev, photo: data.url }));
                  setChanged(true);
                  toast.success('Profile photo updated!');
                } catch (error) {
                  toast.error('Failed to upload image');
                }
              }}
            />
          </label>
        </div>

        {/* Name */}
        <div className="w-full">
          <label className="block text-[#2C3E50] font-semibold mb-1" htmlFor="name">Full Name</label>
          <input
            id="name"
            className="input input-bordered w-full font-bold text-lg"
            value={profile.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>

        {/* Title/Role */}
        <div className="w-full">
          <label className="block text-[#2C3E50] font-semibold mb-1" htmlFor="title">Title/Role</label>
          <input
            id="title"
            className="input input-bordered w-full"
            value={profile.title}
            onChange={e => handleChange("title", e.target.value)}
            placeholder="Your Title (e.g., Senior Data Scientist)"
            required
          />
        </div>

        {/* Bio */}
        <div className="w-full">
          <label className="block text-[#2C3E50] font-semibold mb-1" htmlFor="bio">Short Bio</label>
          <textarea
            id="bio"
            className="textarea textarea-bordered w-full"
            value={profile.bio}
            onChange={e => handleChange("bio", e.target.value)}
            placeholder="Short professional bio (2-4 sentences)"
            rows={3}
            required
          />
        </div>

        {/* Expertise/Skills */}
        <div className="w-full">
          <label className="block text-[#2C3E50] font-semibold mb-1" htmlFor="expertise">Expertise/Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.expertise.map((skill, i) => (
              <span key={i} className="flex items-center px-2 py-1 bg-[#E5E8E8] rounded text-sm text-[#2C3E50]">
                {skill}
                <button
                  type="button"
                  className="ml-1 text-[#FF6B35] hover:text-red-600 focus:outline-none"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
          <input
            id="expertise"
            ref={skillInputRef}
            className="input input-bordered w-full"
            placeholder="Type a skill and press Enter or comma"
            onKeyDown={handleSkillInput}
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className={`btn w-full bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white font-bold text-lg shadow-md hover:scale-105 transition
            ${(!isValid || !changed || saving) ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={!isValid || !changed || saving}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Preview */}
      <div className="mt-10 p-6 rounded bg-gradient-to-r from-[#FF6B35]/5 to-[#4ECDC4]/5">
        <h2 className="font-bold text-[#2C3E50] mb-2">Preview</h2>
        <div className="flex items-center gap-4 mb-2">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt="Avatar"
              width={64}
              height={64}
              className="rounded-full border-2 border-[#4ECDC4] object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-[#6E6C75]" />
          )}
          <div>
            <div className="font-bold text-lg">{profile.name}</div>
            <div className="text-[#6E6C75]">{profile.title}</div>
          </div>
        </div>
        <div className="text-[#2C3E50] mb-2">{profile.bio}</div>
        <div className="flex flex-wrap gap-2">
          {profile.expertise.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-[#E5E8E8] rounded text-sm text-[#2C3E50]">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
} 