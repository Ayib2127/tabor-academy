// This is a simple script to make certain files executable
import fs from 'fs';
import path from 'path';

// Add any files that need to be made executable here
const files = [
  // Add file paths if needed
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    fs.chmodSync(filePath, '755');
    console.log(`Made ${file} executable`);
  } catch (error) {
    console.warn(`Warning: Could not make ${file} executable:`, error.message);
  }
}); 