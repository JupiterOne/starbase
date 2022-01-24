import { IntegrationError } from '@jupiterone/integration-sdk-core';

export class StarbaseConfigurationError extends IntegrationError {
  constructor(message: string) {
    super({
      code: 'INVALID_STARBASE_CONFIG',
      message,
    });
  }
}
