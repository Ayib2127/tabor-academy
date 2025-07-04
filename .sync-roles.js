import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase project URL and service role key
const supabaseUrl = 'https://fmbakckfxuabratissxg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYmFrY2tmeHVhYnJhdGlzc3hnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1MjAyNiwiZXhwIjoyMDY0NjI4MDI2fQ.qFJj-GkdS-Z3N-7ssO5pBlSHoiF9lQtoa3XjN45Ijvo';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function syncUserRoles() {
  // 1. Get all users from your users table
  const { data: users, error } = await supabase
    .from('users')
    .select('id, role');

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  for (const user of users) {
    // 2. Update user_metadata in Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { role: user.role }
    });
    if (updateError) {
      console.error(`Failed to update user ${user.id}:`, updateError);
    } else {
      console.log(`Updated user ${user.id} to role ${user.role}`);
    }
  }
}

syncUserRoles();