import { createCommand } from 'commander';
import { executeWithLogging } from '../starbase/process';

export function wipe() {
  return createCommand('wipe')
    .description('wipes data from Neo4j instance')
    .option(
      '-i, --integration-instance-id <id>',
      '_integrationInstanceId assigned to uploaded entities',
      'defaultLocalInstanceID',
    )
    .action(async (options) => {
      executeWithLogging(`yarn j1-integration neo4j wipe -i ${options.integrationInstanceId}`);
    });
}

export function wipeAll() {
  return createCommand('wipe-all')
    .description('wipes all data from Neo4j instance')
    .action(async (options) => {
      executeWithLogging(`yarn j1-integration neo4j wipe-all`)
    });
}