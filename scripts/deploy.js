#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define deployment targets
const DEPLOYMENT_TARGETS = {
  VERCEL: 'vercel',
  NETLIFY: 'netlify',
  CUSTOM: 'custom'
};

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
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}[STEP]${colors.reset} ${msg}`)
};

const runCommand = (command) => {
  try {
    log.info(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log.error(`Failed to execute: ${command}`);
    log.error(error.message);
    return false;
  }
};

const checkEnvironmentVariables = () => {
  log.step('Checking environment variables...');
  
  const requiredVars = ['NEXT_PUBLIC_GA_ID', 'NEXT_PUBLIC_SENTRY_DSN', 'JWT_SECRET'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    log.warning(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  log.success('All required environment variables are set');
  return true;
};

const runTests = () => {
  log.step('Running tests...');
  
  if (!runCommand('npm run lint')) {
    log.error('Linting failed');
    return false;
  }
  
  if (!runCommand('npm run test')) {
    log.error('Unit tests failed');
    return false;
  }
  
  log.success('All tests passed');
  return true;
};

const buildProject = () => {
  log.step('Building project...');
  return runCommand('npm run build');
};

const deployToVercel = () => {
  log.step('Deploying to Vercel...');
  return runCommand('vercel --prod');
};

const deployToNetlify = () => {
  log.step('Deploying to Netlify...');
  return runCommand('netlify deploy --prod');
};

const deployToCustom = () => {
  log.step('Running custom deployment...');
  // Add your custom deployment logic here
  log.warning('Custom deployment not implemented. Please modify this script.');
  return false;
};

// Main deployment function
const deploy = async (target) => {
  log.info(`Starting deployment to ${target}...`);
  
  // Check environment variables
  if (!checkEnvironmentVariables()) {
    log.warning('Continuing despite missing environment variables...');
  }
  
  // Run tests
  if (!runTests()) {
    log.error('Tests failed. Aborting deployment.');
    return false;
  }
  
  // Build project
  if (!buildProject()) {
    log.error('Build failed. Aborting deployment.');
    return false;
  }
  
  // Deploy based on target
  let deploymentSuccess = false;
  
  switch (target) {
    case DEPLOYMENT_TARGETS.VERCEL:
      deploymentSuccess = deployToVercel();
      break;
    case DEPLOYMENT_TARGETS.NETLIFY:
      deploymentSuccess = deployToNetlify();
      break;
    case DEPLOYMENT_TARGETS.CUSTOM:
      deploymentSuccess = deployToCustom();
      break;
    default:
      log.error(`Unknown deployment target: ${target}`);
      return false;
  }
  
  if (deploymentSuccess) {
    log.success(`Deployment to ${target} completed successfully!`);
    return true;
  } else {
    log.error(`Deployment to ${target} failed.`);
    return false;
  }
};

// Interactive CLI
const promptForDeploymentTarget = () => {
  log.info('Welcome to the Tabor Digital Academy deployment script');
  
  rl.question(`
${colors.cyan}Select a deployment target:${colors.reset}
1. Vercel
2. Netlify
3. Custom
4. Exit

Your choice (1-4): `, (answer) => {
    let target;
    
    switch (answer.trim()) {
      case '1':
        target = DEPLOYMENT_TARGETS.VERCEL;
        break;
      case '2':
        target = DEPLOYMENT_TARGETS.NETLIFY;
        break;
      case '3':
        target = DEPLOYMENT_TARGETS.CUSTOM;
        break;
      case '4':
        log.info('Exiting deployment script');
        rl.close();
        return;
      default:
        log.error('Invalid choice. Exiting.');
        rl.close();
        return;
    }
    
    rl.question(`Are you sure you want to deploy to ${target}? (y/n): `, async (confirmation) => {
      if (confirmation.toLowerCase() === 'y') {
        const result = await deploy(target);
        log.info(`Deployment ${result ? 'succeeded' : 'failed'}`);
      } else {
        log.info('Deployment cancelled');
      }
      rl.close();
    });
  });
};

// Start the script
promptForDeploymentTarget();