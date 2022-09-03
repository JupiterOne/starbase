import { createCommand } from 'commander';
import { executeWithLogging } from '../starbase/process';

export function wipe() {
  return createCommand('wipe')
    .description('wipes data from Neo4j instance with specified instance ID')
    .requiredOption(
      '-i, --integration-instance-id <id>',
      '_integrationInstanceId assigned to uploaded entities that should be wiped from Neo4j',
    )
    .option(
      '-db, --database-name <database>',
      'optional database to wipe data from (only available for enterprise Neo4j databases)',
      'neo4j',
    )
    .action(async (options) => {
      executeWithLogging(
        `yarn j1-integration neo4j wipe -i ${options.integrationInstanceId} -db ${options.databaseName}`,
      );
    });
}

export function wipeAll() {
  return createCommand('wipe-all')
    .description('wipes all data from Neo4j instance')
    .option(
      '-db, --database-name <database>',
      'optional database to wipe data from (only available for enterprise Neo4j databases)',
      'neo4j',
    )
    .action(async (options) => {
      executeWithLogging(`yarn j1-integration neo4j wipe-all -db ${options.databaseName}`);
    });
}
