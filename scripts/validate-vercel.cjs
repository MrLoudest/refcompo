/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'frontend', 'vercel.json'),
  path.join(__dirname, '..', 'backend', 'vercel.json')
];

try {
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf8');
    JSON.parse(raw);
    console.log(`Validated: ${file}`);
  }
  console.log('All Vercel config files are valid JSON.');
} catch (err) {
  console.error('Vercel config validation failed:', err);
  process.exit(1);
}


