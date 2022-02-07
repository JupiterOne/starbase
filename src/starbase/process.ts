import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

async function executeWithLogging(command: string) {
  const result = await execPromise(command);

  if (result && result.stdout) {
    console.log(result.stdout);
  }
}

export { executeWithLogging };
