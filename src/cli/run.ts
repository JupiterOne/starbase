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
    .action(async (cmd) => {
      const config = cmd.parent.config;
      await executeStarbase(await parseConfigYaml(config), {
        onSkipIntegrationExecution,
      });
    });
}
