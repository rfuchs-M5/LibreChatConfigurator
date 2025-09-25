#!/usr/bin/env node

import { spawn } from 'child_process';
import { platform } from 'os';
import { resolve } from 'path';

// Set NODE_ENV for development
process.env.NODE_ENV = 'development';

// Check if we're in WSL running from Windows mount
const cwd = process.cwd();
const isWSLOnWindowsMount = platform() === 'linux' && cwd.startsWith('/mnt/');

if (isWSLOnWindowsMount) {
  console.log('\n⚠️  WSL SETUP ISSUE DETECTED');
  console.log('You\'re running from a Windows drive mount (/mnt/c/...) which can cause permission issues.');
  console.log('\nRecommended fix:');
  console.log('  cp -r . ~/LibreChatConfigurator');
  console.log('  cd ~/LibreChatConfigurator');
  console.log('  npm run dev');
  console.log('\nOr use PowerShell instead of WSL for this project.\n');
}

// Spawn tsx server with inherited stdio for live output
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: resolve(process.cwd()),
  env: { ...process.env }
});

// Handle process termination
process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

// Exit with same code as child process
serverProcess.on('exit', (code) => {
  process.exit(code || 0);
});