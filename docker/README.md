# Neo4j as a Starbase Storage Endpoint

With the initial release of Starbase, functionality has been provided to use
Neo4j as a storage endpoint for saving and viewing ingested data from
integrations. Adding a `storage` configuration to your `config.yaml` file
similar to that found in the provided `config.yaml.example` will send ingested
data to a local instance of Neo4j as part of the `yarn starbase run` command.

## Neo4j Docker Instance

Additionally, we have provided a Docker Composer file that can be used to stand
up a local neo4j database for those that do not want to stand up one manually.
The yarn commands `yarn neo4j:start` and `yarn neo4j:stop` can be used to start
and stop the Neo4j server.

Once the Neo4j server is running, you can access the Neo4j browser at
<http://localhost:7474/browser/>. The `neo4j.yml` docker-compose config sets the
default username to `neo4j` and the default password to `devpass`.

The provided Neo4j configuration includes access to the standard Neo4j command
set. Additionally, the `yarn neo4j:start:plugins` command will start the Neo4j
instance including the Graph Data Science and APOC libraries. For more
information on their included functionality and proper use, see their
docuementation here:

[Graph Data Science (GDS)](https://neo4j.com/docs/graph-data-science/current/)

[Awesome Procedures on Cypher (APOC)](https://neo4j.com/labs/apoc/)

NOTE: An existing installation of Docker Engine and Docker Composer are needed
to use the above commands. [Docker Desktop](https://docs.docker.com/desktop/)
for Windows and Mac includes Docker Composer. Linux users will need to install
[Docker Engine](https://docs.docker.com/engine/install/) and
[Docker Composer](https://docs.docker.com/compose/install/) manually until
Docker Desktop for Linux is available.

# JupiterOne as a Storage Endpoint

In addition to a local Neo4J storage endpoint, Starbase supports a remote
JupiterOne storage endpoint, allowing you to run your integrations locally (or
on-premise) and persist your integration data directly to a configured
JupiterOne account.

You may specify multiple storage endpoints in the `storage` list, for example if
you also wanted to persist data to a local Neo4J storage endpoint.

## Configuring the JupiterOne Storage Endpoint

Add a configuration stanza like the following to your `config.yaml`:

```
storage:
  -
    engine: jupiterone
    config:
      apiKey: your-unique-api-key  (may be either user or account key, needs graph write permission)
      accountId: your-j1-account-id
```

NOTE: if the canonical API URL for your account/region is not
`https://api.us.jupiterone.io`, you will need to specify an additional storage
configuration parameter, `apiBaseUrl`, with the HTTPS URL appropriate for the
token and account you've provided.

See [JupiterOne API](https://community.askj1.com/kb/articles/794-jupiterone-api)
and
[Creating User and Account API Keys](https://community.askj1.com/kb/articles/785-creating-user-and-account-api-keys)
docs for additional details.
