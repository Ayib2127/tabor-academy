"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ReviewInstructorApplication() {
  const router = useRouter();
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApp = async () => {
      const res = await fetch(`/api/instructor-applications/${id}`);
      const data = await res.json();
      setApp(data.application);
      setLoading(false);
    };
    fetchApp();
  }, [id]);

  const handleAction = async (action: "approve" | "reject") => {
    setError("");
    const res = await fetch(`/api/instructor-applications/${id}/${action}`, { method: "POST" });
    if (res.ok) {
      router.push("/dashboard/admin/instructor-applications");
    } else {
      const data = await res.json();
      setError(data.error || "Action failed.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!app) return <div>Application not found.</div>;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Review Application</h1>
      <div className="mb-4">
        <strong>LinkedIn/Website:</strong> <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#4ECDC4] underline">{app.linkedin_url}</a>
      </div>
      <div className="mb-4">
        <strong>Expertise:</strong> {app.expertise_description}
      </div>
      <div className="mb-4">
        <strong>Motivation:</strong>
        <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded">{app.motivation}</div>
      </div>
      {app.sample_video_url && (
        <div className="mb-4">
          <strong>Sample Video:</strong>
          <div className="mt-2">
            <video src={app.sample_video_url} controls className="w-full rounded" />
          </div>
        </div>
      )}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleAction("approve")}
          className="bg-[#4ECDC4] text-white px-4 py-2 rounded hover:bg-[#FF6B35] transition"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("reject")}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Reject
        </button>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </main>
  );
}