import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { full_name, avatar_url, title, bio, expertise } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { error } = await supabase
    .from('users')
    .update({
      full_name,
      avatar_url,
      title,
      bio,
      expertise
    })
    .eq('id', user.id);

  if (error) return new Response(error.message, { status: 400 });
  return new Response(JSON.stringify({ message: "Profile updated" }), { status: 200 });
}

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Fetch user profile
  const { data, error } = await supabase
    .from('users')
    .select('full_name, avatar_url, title, bio, expertise')
    .eq('id', user.id)
    .single();

  if (error) return new Response(error.message, { status: 400 });
  return new Response(JSON.stringify(data), { status: 200 });
} 