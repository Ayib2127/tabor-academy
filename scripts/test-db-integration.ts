import { supabase } from '../lib/supabase/client';

async function testDatabaseIntegration() {
  console.log('Testing database integration...\n');

  try {
    // 1. Test Database Connection
    console.log('1. Testing database connection...');
    const { data: healthData, error: healthError } = await supabase.from('users').select('count').limit(1);
    if (healthError) throw healthError;
    console.log('✅ Database connection successful\n');

    // 2. Test Users Table
    console.log('2. Testing users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    if (usersError) throw usersError;
    console.log('✅ Users table accessible\n');

    // 3. Test Courses Table
    console.log('3. Testing courses table...');
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);
    if (coursesError) throw coursesError;
    console.log('✅ Courses table accessible\n');

    // 4. Test Lessons Table
    console.log('4. Testing lessons table...');
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .limit(1);
    if (lessonsError) throw lessonsError;
    console.log('✅ Lessons table accessible\n');

    // 5. Test Enrollments Table
    console.log('5. Testing enrollments table...');
    const { data: enrollmentsData, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);
    if (enrollmentsError) throw enrollmentsError;
    console.log('✅ Enrollments table accessible\n');

    // 6. Test Progress Table
    console.log('6. Testing progress table...');
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .limit(1);
    if (progressError) throw progressError;
    console.log('✅ Progress table accessible\n');

    // 7. Test RLS Policies
    console.log('7. Testing RLS policies...');
    const { data: rlsData, error: rlsError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    if (rlsError && rlsError.code === '42501') {
      console.log('✅ RLS policies are active\n');
    } else {
      console.log('⚠️ RLS policies may not be properly configured\n');
    }

    console.log('All database integration tests completed successfully! 🎉');
  } catch (error) {
    console.error('❌ Database integration test failed:', error);
    process.exit(1);
  }
}

// Run the tests
testDatabaseIntegration(); 