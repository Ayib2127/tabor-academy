#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test database connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) throw error;
    console.log('✅ Database connection successful');
    
    // Test authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    });
    
    if (authError) throw authError;
    console.log('✅ Authentication test successful');
    
    // Test course creation
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert([
        {
          title: 'Test Course',
          description: 'This is a test course',
          level: 'beginner',
          duration: 60,
          price: 0,
          is_published: true,
        },
      ])
      .select();
    
    if (courseError) throw courseError;
    console.log('✅ Course creation test successful');
    
    // Clean up test data
    await supabase.from('courses').delete().eq('title', 'Test Course');
    console.log('✅ Cleanup successful');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testConnection(); 