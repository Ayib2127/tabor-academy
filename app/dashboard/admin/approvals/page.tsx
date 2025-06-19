import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'auto';

export default async function ApprovalsListPage() {
  const supabase = createRouteHandlerClient({ cookies });
  // Check user & role
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/');

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, instructor_id, created_at')
    .eq('status', 'pending_review')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Courses Awaiting Approval</h1>
      {courses?.length ? (
        <ul className="space-y-4">
          {courses.map((c) => (
            <li key={c.id} className="border p-4 rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-gray-500">Created: {new Date(c.created_at).toLocaleDateString()}</p>
              </div>
              <Link
                href={`/dashboard/admin/approvals/${c.id}`}
                className="text-blue-600 hover:underline"
              >
                Review
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses are currently pending review.</p>
      )}
    </main>
  );
}
