#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

const runCommand = (command, silent = false) => {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (!silent) {
      log.info(`Command output: ${output}`);
    }
    return { success: true, output };
  } catch (error) {
    if (!silent) {
      log.error(`Failed to execute: ${command}`);
      log.error(error.message);
    }
    return { success: false, error: error.message };
  }
};

// Security checks
const checkNpmAudit = () => {
  log.step('Running npm audit...');
  const { success, output } = runCommand('npm audit --json', true);
  
  if (!success) {
    log.error('npm audit failed to run');
    return false;
  }
  
  try {
    const auditResult = JSON.parse(output);
    const vulnerabilities = auditResult.vulnerabilities || {};
    const totalVulnerabilities = Object.values(vulnerabilities).reduce((acc, curr) => acc + curr.length, 0);
    
    if (totalVulnerabilities > 0) {
      log.warning(`Found ${totalVulnerabilities} vulnerabilities`);
      
      // Check for high or critical vulnerabilities
      const highOrCritical = Object.entries(vulnerabilities)
        .filter(([severity]) => ['high', 'critical'].includes(severity))
        .reduce((acc, [_, vulns]) => acc + vulns.length, 0);
      
      if (highOrCritical > 0) {
        log.error(`Found ${highOrCritical} high or critical vulnerabilities`);
        log.info('Run "npm audit fix" to attempt automatic fixes');
        return false;
      } else {
        log.warning('Only low or moderate vulnerabilities found');
        return true;
      }
    } else {
      log.success('No vulnerabilities found');
      return true;
    }
  } catch (error) {
    log.error('Failed to parse npm audit output');
    return false;
  }
};

const checkSecretLeaks = () => {
  log.step('Checking for potential secret leaks in the codebase...');
  
  // Define patterns to look for
  const patterns = [
    'password',
    'secret',
    'api[_-]?key',
    'auth[_-]?token',
    'access[_-]?token',
    'credentials',
    'private[_-]?key'
  ];
  
  const excludeDirs = ['node_modules', '.next', 'out', '.git'];
  const excludeFiles = ['.env.example', 'security-check.js'];
  
  const findSecrets = (dir, results = []) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // Skip excluded directories
      if (stat.isDirectory() && !excludeDirs.includes(file)) {
        findSecrets(filePath, results);
        continue;
      }
      
      // Skip excluded files
      if (excludeFiles.includes(file)) {
        continue;
      }
      
      // Skip non-text files
      const ext = path.extname(file).toLowerCase();
      const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.html', '.css', '.scss', '.yml', '.yaml'];
      if (!textExtensions.includes(ext)) {
        continue;
      }
      
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        for (const pattern of patterns) {
          const regex = new RegExp(`("|')?(${pattern})("|')?\\s*(:|=)\\s*("|')([^\\s"']+)("|')`, 'gi');
          let match;
          
          while ((match = regex.exec(content)) !== null) {
            results.push({
              file: filePath,
              line: content.substring(0, match.index).split('\n').length,
              match: match[0]
            });
          }
        }
      } catch (error) {
        log.warning(`Could not read file: ${filePath}`);
      }
    }
    
    return results;
  };
  
  const potentialSecrets = findSecrets('.');
  
  if (potentialSecrets.length > 0) {
    log.warning(`Found ${potentialSecrets.length} potential secrets in the codebase:`);
    potentialSecrets.forEach(({ file, line, match }) => {
      log.warning(`${file}:${line} - ${match}`);
    });
    return false;
  } else {
    log.success('No potential secrets found in the codebase');
    return true;
  }
};

const checkMiddlewareConfig = () => {
  log.step('Checking middleware configuration...');
  
  try {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    
    if (nextConfig.includes("output: 'export'")) {
      log.error('Middleware will not run with "output: export" in next.config.js');
      log.error('This will disable security headers, CORS policies, and API rate limiting');
      return false;
    }
    
    log.success('Middleware configuration looks good');
    return true;
  } catch (error) {
    log.error('Failed to check middleware configuration');
    return false;
  }
};

const checkEnvFiles = () => {
  log.step('Checking environment files...');
  
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  let gitignoreContent = '';
  
  try {
    gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  } catch (error) {
    log.warning('Could not read .gitignore file');
  }
  
  let allGood = true;
  
  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      if (!gitignoreContent.includes(envFile)) {
        log.error(`${envFile} exists but is not in .gitignore`);
        allGood = false;
      } else {
        log.success(`${envFile} exists and is properly gitignored`);
      }
    }
  }
  
  return allGood;
};

// Main function
const runSecurityChecks = () => {
  log.info('Starting security checks...');
  
  const results = {
    npmAudit: checkNpmAudit(),
    secretLeaks: checkSecretLeaks(),
    middlewareConfig: checkMiddlewareConfig(),
    envFiles: checkEnvFiles()
  };
  
  console.log('\n--- Security Check Summary ---');
  
  Object.entries(results).forEach(([check, passed]) => {
    if (passed) {
      log.success(`✓ ${check}`);
    } else {
      log.error(`✗ ${check}`);
    }
  });
  
  const allPassed = Object.values(results).every(Boolean);
  
  if (allPassed) {
    log.success('All security checks passed!');
    return 0;
  } else {
    log.error('Some security checks failed. Please address the issues before deploying.');
    return 1;
  }
};

// Run the security checks
process.exit(runSecurityChecks());