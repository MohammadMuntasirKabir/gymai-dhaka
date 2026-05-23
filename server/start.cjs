const { spawn } = require('child_process');
const path = require('path');

const child = spawn(process.execPath, [
  '-e',
  `
  const { createRequire } = require('module');
  const require = createRequire(import.meta.url);
  
  // Set up tsx environment
  process.chdir('${path.resolve(__dirname)}');
  
  // Use tsx programmatically
  const { register } = require('tsx/esm');
  register();
  
  // Now import the server
  require('./src/index.ts');
  `
], {
  stdio: 'inherit',
  cwd: __dirname,
});

child.on('exit', (code) => {
  process.exit(code);
});

// Keep alive
process.stdin.resume();
