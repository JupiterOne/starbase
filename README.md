<h1 align="center">
  <img src="./branding/logo-light-bg.png" alt="Starbase" width="250" /></br></br>
  <strong style="font-size:75px;">Democratizing graph-based security analysis 🚀</strong>
</h1></br>

Starbase from [JupiterOne](https://jupiterone.com), consolidates assets and relationships from
providers including cloud infrastructure, SaaS applications, security controls,
and more in an intuitive graph view backed by the [Neo4j](https://neo4j.com/) database.

## Available Integrations / Connectors

Starbase supports [70+](https://github.com/jupiterone?q=graph-&type=all&language=&sort=)
open source graph integrations!

Here are some highlights:

- [Azure](https://github.com/jupiterone/graph-azure)
- [GitHub](https://github.com/jupiterone/graph-azure)
- [Google Cloud](https://github.com/jupiterone/graph-azure)
- [Google Workspace](https://github.com/jupiterone/graph-azure)
- [Jira](https://github.com/jupiterone/graph-azure)
- ...

<details>
  <summary><b>Click here to expand a full list of supported graph integrations!</b></summary>

  - [Addigy](https://github.com/jupiterone/graph-addigy)
  - airwatch
  - artifactory
  - atspoke
  - auth0
  - aws[^1]
  - azure
  - azure-devops
  - azure-extender-ad-audit-logs
  - bamboohr
  - bitbucket
  - bugcrowd
  - cbdefense
  - checkmarx
  - cisco-amp
  - cisco-meraki
  - cloudflare
  - cobalt
  - crowdstrike
  - cybereason
  - databricks
  - datadog
  - detectify
  - digicert
  - duo
  - enrichment-examples
  - fastly
  - feroot
  - github
  - gitlab
  - gitleaks-findings
  - godaddy
  - google
  - google-cloud
  - hackerone
  - heroku
  - hubspot
  - jamf
  - jira
  - jumpcloud
  - knowbe4
  - kubernetes
  - malwarebytes
  - microsoft-365
  - mimecast
  - nmap
  - nowsecure
  - npm
  - okta
  - onelogin
  - openshift
  - pagerduty
  - qualys
  - rapid7
  - salesforce
  - sentinelone
  - sentry
  - servicenow
  - signal-sciences
  - slack
  - snipe-it
  - snowflake
  - snyk
  - sonarqube
  - sysdig
  - tenable-io
  - terraform-cloud
  - threatstack
  - trend-micro
  - veracode
  - vuls-findings
  - wazuh
  - whitehat
  - whois
  - wpengine
  - zeit
  - zendesk
  - zoom
</details>

[^1]: JupiterOne Starbase and the [Lyft Cartography](https://github.com/lyft/cartography)
    projects compliment each other as both projects push graph data to a Neo4j
    database instance. As such, users of Starbase can leverage the AWS connector
    from Cartography to ingest AWS assets and relationships. A more
    comprehensive AWS integration is used by the cloud hosted JupiterOne
    platform and we are considering making the J1 AWS integration available as
    open source in the future. Additionally, JupiterOne already provides a free
    tier of its cloud hosted service.

## Usage and Development

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
collect data. When Starbase is started, it reads configuration data from
a single configuration file named `config.yaml` at the root of the project.

1. Copy `config.yaml.example` to `config.yaml`

```
cp config.yaml.example config.yaml
```

2. Supply configuration values in `config.yaml` for each integration

> **NOTE**: The individual graph integration configuration field names can be
> found in their respective `graph-*` projects.
>
> For example: https://github.com/JupiterOne/graph-google-cloud/blob/main/.env.example
>
> The `config.yaml` would resemble the following for Google Cloud:
>
> ```yaml
> integrations:
>  -
>    name: graph-google-cloud
>    instanceId: testInstanceId
>    directory: ./.integrations/graph-google-cloud
>    gitRemoteUrl: https://github.com/JupiterOne/graph-google-cloud.git
>    config:
>      SERVICE_ACCOUNT_KEY_FILE={}
>      PROJECT_ID="..."
>      ORGANIZATION_ID="..."
>      CONFIGURE_ORGANIZATION_PROJECTS=false
> storage:
>  engine: neo4j
>  config: 
>    username: neo4j
>    password: devpass
>    uri: bolt://localhost:7687
> ```

### Running Starbase

1. Perform `yarn starbase setup` to perform a clone or update of all integrations
   listed in the `config.yaml` file as well as install all dependencies for each
   integration.
2. Perform `yarn starbase run` to collect data for each listed integration and
   then push collected data if a storage endpoint has been listed in
   `config.yaml`.

For additional information on using Neo4j as a storage endpoint, please see the
[README.md](docker/README.md) provided.

### Contributing

Start by taking a look at the source code. Each integration is basically a set
of functions called steps, each of which ingests a collection of resources and
relationships. The goal is to limit each step to as few resource types as
possible so that should the ingestion of one type of data fail, it does not
necessarily prevent the ingestion of other, unrelated data. That connectorsshould be
enough information to allow you to get started coding!

See the
[SDK development documentation](https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md)
for a deep dive into the mechanics of how integrations work.

See the [docs/development.md](docs/development.md) in any of the existing
integrations for any additional details about developing other integrations.

### Changelog

The history of this project's development can be viewed at
[CHANGELOG.md](CHANGELOG.md).

### Contact

Join us on `#starbase` on the [JupiterOne Community Slack](slack).

## JupiterOne

If this is too much work, you can create a free cloud-hosted account at 
https://login.us.jupiterone.io/sign-up. 

[slack]: https://join.slack.com/t/jupiterone-community/shared_invite/zt-9b0a2htx-m8PmSWMbkjqCzF2dIZiabw
