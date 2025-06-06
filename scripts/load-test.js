#!/usr/bin/env node

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('error_rate');
const pageLoadTime = new Trend('page_load_time');
const apiCallTime = new Trend('api_call_time');
const successfulLogins = new Counter('successful_logins');

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    error_rate: ['rate<0.01'], // Error rate must be less than 1%
    page_load_time: ['p(95)<1000'], // 95% of page loads must be under 1s
    api_call_time: ['p(95)<200'], // 95% of API calls must be under 200ms
  },
};

export default function () {
  const BASE_URL = 'https://taboracademy.com'; // Replace with your actual domain

  group('Static Pages', () => {
    // Homepage
    let res = http.get(`${BASE_URL}/`);
    check(res, {
      'homepage status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoadTime.add(res.timings.duration);

    // About page
    res = http.get(`${BASE_URL}/about`);
    check(res, {
      'about page status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoadTime.add(res.timings.duration);

    // Courses page
    res = http.get(`${BASE_URL}/courses`);
    check(res, {
      'courses page status is 200': (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoadTime.add(res.timings.duration);
  });

  sleep(1);

  group('Authentication', () => {
    // Login attempt
    const loginPayload = JSON.stringify({
      email: 'test@example.com',
      password: 'Password123!',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, params);
    
    check(loginRes, {
      'login successful': (r) => r.status === 200,
      'login returns token': (r) => r.json('token') !== undefined,
    }) || errorRate.add(1);
    
    apiCallTime.add(loginRes.timings.duration);
    
    if (loginRes.status === 200) {
      successfulLogins.add(1);
    }
  });

  sleep(1);

  group('Course Browsing', () => {
    // Course listing with filters
    const coursesRes = http.get(`${BASE_URL}/api/courses?category=digital-marketing&level=beginner`);
    
    check(coursesRes, {
      'courses API status is 200': (r) => r.status === 200,
      'courses API returns data': (r) => r.json('data') !== undefined,
    }) || errorRate.add(1);
    
    apiCallTime.add(coursesRes.timings.duration);

    // Course details
    const courseRes = http.get(`${BASE_URL}/api/courses/1`);
    
    check(courseRes, {
      'course details API status is 200': (r) => r.status === 200,
      'course details API returns data': (r) => r.json('data') !== undefined,
    }) || errorRate.add(1);
    
    apiCallTime.add(courseRes.timings.duration);
  });

  sleep(1);
}