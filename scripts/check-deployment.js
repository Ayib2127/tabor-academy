#!/usr/bin/env node

const https = require('https');
const { URL } = require('url');

// Configuration
const DEPLOYMENT_URL = process.env.DEPLOYMENT_URL || 'https://taboracademy.com';
const ENDPOINTS_TO_CHECK = [
  '/',
  '/about',
  '/courses',
  '/login',
  '/signup'
];
const TIMEOUT_MS = 10000; // 10 seconds

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`)
};

// Function to check a single endpoint
const checkEndpoint = (endpoint) => {
  return new Promise((resolve) => {
    const url = new URL(endpoint, DEPLOYMENT_URL);
    const startTime = Date.now();
    
    log.info(`Checking ${url.toString()}...`);
    
    const req = https.get(url, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        log.success(`✓ ${endpoint} - ${res.statusCode} (${responseTime}ms)`);
        resolve({
          endpoint,
          status: res.statusCode,
          responseTime,
          success: true
        });
      } else {
        log.error(`✗ ${endpoint} - ${res.statusCode} (${responseTime}ms)`);
        resolve({
          endpoint,
          status: res.statusCode,
          responseTime,
          success: false
        });
      }
    });
    
    req.on('error', (error) => {
      log.error(`✗ ${endpoint} - ${error.message}`);
      resolve({
        endpoint,
        error: error.message,
        success: false
      });
    });
    
    req.setTimeout(TIMEOUT_MS, () => {
      req.abort();
      log.error(`✗ ${endpoint} - Timeout after ${TIMEOUT_MS}ms`);
      resolve({
        endpoint,
        error: 'Timeout',
        success: false
      });
    });
  });
};

// Main function to check all endpoints
const checkDeployment = async () => {
  log.info(`Checking deployment at ${DEPLOYMENT_URL}...`);
  
  const results = await Promise.all(
    ENDPOINTS_TO_CHECK.map(endpoint => checkEndpoint(endpoint))
  );
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount) * 100;
  
  console.log('\n--- Deployment Check Summary ---');
  console.log(`Success Rate: ${successRate.toFixed(2)}% (${successCount}/${totalCount})`);
  
  if (successRate === 100) {
    log.success('All endpoints are working correctly!');
    process.exit(0);
  } else if (successRate >= 80) {
    log.warning('Most endpoints are working, but some issues were detected.');
    process.exit(1);
  } else {
    log.error('Significant issues detected with the deployment.');
    process.exit(2);
  }
};

// Run the deployment check
checkDeployment().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(3);
});