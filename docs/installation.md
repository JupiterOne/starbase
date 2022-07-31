# Installation

## Starbase Usage and Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/) using the
   [installer](https://nodejs.org/en/download/) or a version manager such as
   [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
2. Install [`yarn`](https://yarnpkg.com/getting-started/install).
3. Install dependencies with `yarn install`.
4. Register an account in the system each integration targets for ingestion and
   obtain API credentials.

### Configuring Starbase

Starbase leverages credentials from external services to authenticate and
collect data. When Starbase is started, it reads configuration data from a
single configuration file named `config.yaml` at the root of the project.

1. Copy `config.yaml.example` to `config.yaml`

```bash
cp config.yaml.example config.yaml
```

2. Supply configuration values in `config.yaml` for each integration

!!! note annotate "Configuring individual Starbase integrations"

    The individual graph integration configuration field names can be found in
    their respective open source integration projects (GitHub repositories
    prefixed with `graph-*`)

```yaml
integrations:
  - name: graph-google-cloud
    instanceId: testInstanceId
    directory: ./.integrations/graph-google-cloud
    gitRemoteUrl: https://github.com/JupiterOne/graph-google-cloud.git
    config:
      SERVICE_ACCOUNT_KEY_FILE: {}
      PROJECT_ID: '...'
      ORGANIZATION_ID: '...'
      CONFIGURE_ORGANIZATION_PROJECTS: false
storage:
  engine: neo4j
  config:
    username: neo4j
    password: devpass
    uri: bolt://localhost:7687
```

### Running Starbase

Starbase exposes a CLI for bootstrapping graph integration development and
execution.

```
❯ yarn starbase --help

Usage: yarn starbase [options] [command]

Starbase graph ingestion orchestrator

Options:
  -h, --help      display help for command

Commands:
  run             collect and upload entities and relationships
  setup           clone repositories listed in config.yaml
  help [command]  display help for command
```

1. Run `yarn starbase setup` to clone or update all integrations listed in the
   `config.yaml` file as well as install all dependencies for each integration.
2. Run `yarn starbase run` to collect data for each listed integration and then
   push collected data to the storage endpoint listed in `config.yaml`.

For additional information on using Neo4j as a storage endpoint, please see the
[README.md](docker/README.md) provided.
