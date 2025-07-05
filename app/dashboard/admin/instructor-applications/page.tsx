"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InstructorApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pending applications from your API
    const fetchApplications = async () => {
      const res = await fetch("/api/instructor-applications?status=pending");
      const data = await res.json();
      setApplications(data.applications || []);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Pending Instructor Applications</h1>
      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <div>No pending applications.</div>
      ) : (
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Applicant</th>
              <th className="py-2 px-4 text-left">Expertise</th>
              <th className="py-2 px-4 text-left">Submitted</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app: any) => (
              <tr key={app.id} className="border-t">
                <td className="py-2 px-4">{app.linkedin_url}</td>
                <td className="py-2 px-4">{app.expertise_description}</td>
                <td className="py-2 px-4">{new Date(app.created_at).toLocaleDateString()}</td>
                <td className="py-2 px-4">
                  <Link
                    href={`/dashboard/admin/instructor-applications/${app.id}`}
                    className="text-[#4ECDC4] hover:underline"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
} 