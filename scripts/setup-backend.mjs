import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backendDir = resolve(__dirname, '..', 'backend');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(command) {
  execSync(command, {
    stdio: 'inherit',
    cwd: backendDir,
    env: {
      ...process.env,
      npm_config_production: 'false'
    }
  });
}

try {
  run(`${npmCmd} install --include=dev`);
  run(`${npmCmd} run build`);
} catch (error) {
  console.error('Failed to prepare backend dependencies:', error);
  process.exitCode = error.status ?? 1;
}

