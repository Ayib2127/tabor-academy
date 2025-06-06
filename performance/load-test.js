import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests can fail
  },
};

export default function () {
  const BASE_URL = 'http://localhost:3000';

  // Homepage
  const homeRes = http.get(BASE_URL);
  check(homeRes, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads within 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Course listing
  const coursesRes = http.get(`${BASE_URL}/courses`);
  check(coursesRes, {
    'courses status is 200': (r) => r.status === 200,
    'courses load within 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Course details
  const courseRes = http.get(`${BASE_URL}/courses/1`);
  check(courseRes, {
    'course status is 200': (r) => r.status === 200,
    'course loads within 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}