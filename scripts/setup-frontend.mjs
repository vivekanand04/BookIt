import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const frontendDir = resolve(__dirname, '..', 'frontend');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

try {
  execSync(`${npmCmd} install`, {
    cwd: frontendDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_production: 'false'
    }
  });
} catch (error) {
  console.error('Failed to install frontend dependencies:', error);
  process.exitCode = error.status ?? 1;
}

