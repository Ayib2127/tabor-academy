import { createApiSupabaseClient } from '@/lib/supabase/standardized-client';
import { sendWelcomeEmail } from '@/lib/email/resend';

export interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  welcome_email_sent: boolean;
}

/**
 * Checks if a user needs a welcome email and sends it if they haven't received one yet
 * @param userId - The user's ID
 * @returns Promise<{ success: boolean; emailSent?: boolean; error?: any }>
 */
export async function handleWelcomeEmail(userId: string) {
  try {
    const { supabase } = await createApiSupabaseClient();
    
    // Get user data including welcome_email_sent flag
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, role, welcome_email_sent')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return { success: false, error: userError };
    }

    if (!userData) {
      console.error('User not found:', userId);
      return { success: false, error: 'User not found' };
    }

    // Check if welcome email has already been sent
    if (userData.welcome_email_sent) {
      console.log('Welcome email already sent for user:', userId);
      return { success: true, emailSent: false };
    }

    // Send welcome email
    const userName = userData.full_name || userData.email.split('@')[0];
    const emailResult = await sendWelcomeEmail({
      userEmail: userData.email,
      userName: userName,
      userRole: userData.role,
    });

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
      return { success: false, error: emailResult.error };
    }

    // Mark welcome email as sent in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ welcome_email_sent: true, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating welcome_email_sent flag:', updateError);
      // Don't fail the entire operation if the flag update fails
      // The email was sent successfully
    }

    console.log('Welcome email sent and marked as sent for user:', userId);
    return { success: true, emailSent: true };

  } catch (error) {
    console.error('Error in handleWelcomeEmail:', error);
    return { success: false, error };
  }
}

/**
 * Force send a welcome email to a user (for admin purposes)
 * @param userId - The user's ID
 * @returns Promise<{ success: boolean; error?: any }>
 */
export async function forceSendWelcomeEmail(userId: string) {
  try {
    const { supabase } = await createApiSupabaseClient();
    
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user data:', userError);
      return { success: false, error: userError || 'User not found' };
    }

    // Send welcome email
    const userName = userData.full_name || userData.email.split('@')[0];
    const emailResult = await sendWelcomeEmail({
      userEmail: userData.email,
      userName: userName,
      userRole: userData.role,
    });

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
      return { success: false, error: emailResult.error };
    }

    // Mark welcome email as sent
    const { error: updateError } = await supabase
      .from('users')
      .update({ welcome_email_sent: true, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating welcome_email_sent flag:', updateError);
      return { success: false, error: updateError };
    }

    console.log('Welcome email force-sent for user:', userId);
    return { success: true };

  } catch (error) {
    console.error('Error in forceSendWelcomeEmail:', error);
    return { success: false, error };
  }
} 