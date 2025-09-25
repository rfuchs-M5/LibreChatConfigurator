#!/usr/bin/env node

import { spawn } from 'child_process';
import { resolve } from 'path';

// Set NODE_ENV for production
process.env.NODE_ENV = 'production';

// Spawn production server with inherited stdio
const serverProcess = spawn('node', ['dist/index.js'], {
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