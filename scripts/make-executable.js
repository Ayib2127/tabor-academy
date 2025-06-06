#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`)
};

// Scripts directory
const scriptsDir = path.join(__dirname);

// Make scripts executable
const makeExecutable = () => {
  try {
    // Get all .js files in the scripts directory
    const files = fs.readdirSync(scriptsDir)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(scriptsDir, file));
    
    log.info(`Found ${files.length} script files`);
    
    // Make each file executable
    files.forEach(file => {
      try {
        // Check if running on Windows
        if (process.platform === 'win32') {
          log.info(`Skipping chmod on Windows for: ${file}`);
        } else {
          log.info(`Making executable: ${file}`);
          fs.chmodSync(file, '755');
        }
        
        // Add shebang line if it doesn't exist
        const content = fs.readFileSync(file, 'utf8');
        if (!content.startsWith('#!/usr/bin/env node')) {
          const newContent = `#!/usr/bin/env node\n\n${content}`;
          fs.writeFileSync(file, newContent);
          log.info(`Added shebang to: ${file}`);
        }
        
        log.success(`Successfully processed: ${file}`);
      } catch (err) {
        log.error(`Failed to process ${file}: ${err.message}`);
      }
    });
    
    log.success('All scripts processed');
    return true;
  } catch (err) {
    log.error(`Failed to make scripts executable: ${err.message}`);
    return false;
  }
};

// Run the function
makeExecutable();