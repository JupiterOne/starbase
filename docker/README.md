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

NOTE: An existing installation of Docker Engine and Docker Composer are needed
to use the above commands. [Docker Desktop](https://docs.docker.com/desktop/)
for Windows and Mac includes Docker Composer. Linux users will need to install
[Docker Engine](https://docs.docker.com/engine/install/) and
[Docker Composer](https://docs.docker.com/compose/install/) manually until
Docker Desktop for Linux is available.
