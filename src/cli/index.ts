import { createCommand } from 'commander';
import { run } from './run';
import { setup } from './setup';
import { wipe, wipeAll } from './wipe';

export function createStarbaseCli() {
  return createCommand()
    .name('yarn starbase')
    .description('Starbase graph ingestion orchestrator')
    .addCommand(run())
    .addCommand(setup())
    .addCommand(wipe())
    .addCommand(wipeAll());
}
