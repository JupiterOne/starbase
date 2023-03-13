import { exec } from 'child_process';

async function executeWithLogging(command: string) {
  return new Promise<void>((resolve, reject) => {
    const childProcess = exec(command);

    if (childProcess.stdout) {
      childProcess.stdout.pipe(process.stdout);
    }

    if (childProcess.stderr) {
      childProcess.stderr.pipe(process.stderr);
    }

    childProcess.on('exit', () => {
      resolve();
    });

    childProcess.on('error', (err) => {
      reject(err);
    });
  });
}

export { executeWithLogging };
