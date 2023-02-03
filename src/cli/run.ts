import { createCommand } from 'commander';
import {
  executeStarbase,
  OnSkipIntegrationExecutionFunctionParams,
  parseConfigYaml,
} from '../starbase';
import { StarbaseIntegration } from '../starbase/types';

function withIntegrationLogData(
  message: string,
  integration: StarbaseIntegration,
) {
  return `${message} (instanceId=${integration.instanceId}, directory=${integration.directory})`;
}

function onSkipIntegrationExecution({
  integration,
  reason,
}: OnSkipIntegrationExecutionFunctionParams) {
  console.log(
    withIntegrationLogData(
      `Skipping integration execution: ${reason}`,
      integration,
    ),
  );
}

export function run() {
  return createCommand('run')
    .description('collect and upload entities and relationships')
    .option(
      '-c, --config <path>',
      'optional path to config file',
      'config.yaml',
    )
    .action(async (options) => {
      await executeStarbase(await parseConfigYaml(options.config), {
        onSkipIntegrationExecution,
      });
    });
}
