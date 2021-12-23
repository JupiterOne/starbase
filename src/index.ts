import { createCommand } from 'commander';
import { run, setup, updateIntegrations } from './commands';

export function createStarbase() {
  return createCommand()
    .name('yarn starbase')
    .description('Starbase graph ingestion orchestrator')
    .addCommand(run())
    .addCommand(setup())
    .addCommand(updateIntegrations());
}

createStarbase()
  .parseAsync(process.argv)
  .catch(err => {
    console.error(err);
    process.exitCode = 1;
  })

