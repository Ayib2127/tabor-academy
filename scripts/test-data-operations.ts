require('dotenv').config({ path: '.env.local' });

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Loaded' : 'Not Loaded');

import { supabase } from '../lib/supabase/client';
import { User } from '@supabase/supabase-js';

async function testDataOperations() {
  console.log('Testing data operations...\n');

  let testUser: User | null = null;
  let testCourseId: string | null = null;
  let testLessonId: string | null = null;
  let testEnrollmentId: string | null = null;
  let testProgressId: string | null = null;

  try {
    // 1. Sign up and sign in a test user
    console.log('1. Signing up and signing in a test user...');
    const userEmail = 'testuser@example.com'; // Use example.com for better compatibility
    const userPassword = 'password123'; // Use a strong password in real apps

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userEmail,
      password: userPassword,
    });

    if (signUpError) {
       // If user already exists, try signing in
       if (signUpError.message.includes('User already registered')) {
           console.log('Test user already exists, attempting to sign in...');
           const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
               email: userEmail,
               password: userPassword,
           });
            if (signInError) throw signInError;
            testUser = signInData.user;
            console.log('✅ Test user signed in successfully\n');
       } else {
           throw signUpError; // Throw other sign up errors
       }
    } else {
        testUser = signUpData.user;
        console.log('✅ Test user signed up and signed in successfully\n');
    }

    if (!testUser) {
        throw new Error('Failed to get test user after sign up/in');
    }

    // Ensure the Supabase client is using the authenticated session for subsequent calls
    // The client from '../lib/supabase/client' should handle this automatically
    // as it listens to auth state changes, but we can explicitly check the session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('Failed to get authenticated session after sign in');
    }
    console.log('✅ Authenticated session obtained\n');

    // 2. Test Course Creation (requires authenticated user with instructor role in a real app)
    // For this test, we'll skip strict role check or assume the test user can create.
    console.log('2. Testing course creation...');
    const testCourse = {
      title: 'Test Course ', // Adding space to make title unique for potential re-runs
      description: 'Test course description',
      instructor_id: testUser.id, // Link to the authenticated test user
      level: 'beginner',
      duration: 60,
      price: 0,
      is_published: true
    };

    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .insert(testCourse)
      .select()
      .single();

    if (courseError) throw courseError;
    testCourseId = courseData.id;
    console.log('✅ Course creation successful\n');

    // 3. Test Lesson Creation
    console.log('3. Testing lesson creation...');
    const testLesson = {
      course_id: testCourseId,
      title: 'Test Lesson',
      description: 'Test lesson description',
      content: 'Test content',
      position: 1,
      is_published: true
    };

    const { data: lessonData, error: lessonError } = await supabase
      .from('lessons')
      .insert(testLesson)
      .select()
      .single();

    if (lessonError) throw lessonError;
    testLessonId = lessonData.id;
    console.log('✅ Lesson creation successful\n');

    // 4. Test Enrollment
    console.log('4. Testing enrollment...');
    const { data: enrollmentData, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: testUser.id,
        course_id: testCourseId
      })
      .select()
      .single();

    if (enrollmentError) throw enrollmentError;
    testEnrollmentId = enrollmentData.id;
    console.log('✅ Enrollment successful\n');

    // 5. Test Progress Tracking
    console.log('5. Testing progress tracking...');
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .insert({
        user_id: testUser.id,
        lesson_id: testLessonId,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (progressError) throw progressError;
    testProgressId = progressData.id;
    console.log('✅ Progress tracking successful\n');

    // 6. Test Data Retrieval (as the authenticated user)
    console.log('6. Testing data retrieval...');
    const { data: retrievedData, error: retrieveError } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*),
        enrollments (
          user:users (*),
          progress (*)
        )
      `)
      .eq('id', testCourseId)
      .single();

    if (retrieveError) throw retrieveError;
    console.log('✅ Data retrieval successful\n');

    console.log('All data operation tests completed successfully! 🎉');

  } catch (error) {
    console.error('❌ Data operation test failed:', error);
    // Do not exit here to allow cleanup
  } finally {
    // 7. Cleanup Test Data
    console.log('\n7. Cleaning up test data...');
    if (testProgressId) {
        console.log('Deleting progress...');
        const { error } = await supabase.from('progress').delete().eq('id', testProgressId);
        if (error) console.error('Error deleting progress:', error);
        else console.log('Progress deleted.');
    }
    if (testEnrollmentId) {
        console.log('Deleting enrollment...');
        const { error } = await supabase.from('enrollments').delete().eq('id', testEnrollmentId);
         if (error) console.error('Error deleting enrollment:', error);
         else console.log('Enrollment deleted.');
    }
    if (testLessonId) {
        console.log('Deleting lesson...');
        const { error } = await supabase.from('lessons').delete().eq('id', testLessonId);
        if (error) console.error('Error deleting lesson:', error);
        else console.log('Lesson deleted.');
    }
    if (testCourseId) {
        console.log('Deleting course...');
        const { error } = await supabase.from('courses').delete().eq('id', testCourseId);
         if (error) console.error('Error deleting course:', error);
         else console.log('Course deleted.');
    }
    if (testUser) {
        console.log('Signing out test user...');
         const { error } = await supabase.auth.signOut();
          if (error) console.error('Error signing out:', error);
          else console.log('Test user signed out.');

        // Note: Deleting the user via client-side isn't standard due to RLS
        // A server-side function or admin call would be needed for full cleanup.
        console.log('Manual deletion of test user in Supabase dashboard may be required.');
    }
    console.log('Cleanup process finished.');
     process.exit(0); // Exit cleanly after cleanup
  }
}

// Run the tests
testDataOperations(); 