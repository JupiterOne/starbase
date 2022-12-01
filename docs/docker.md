# Starbase in Docker

Starbase can also be run inside of Docker, minimizing the need to locally
install node and yarn.

## Execution Flow Diagram

```mermaid
sequenceDiagram
    participant Docker
    participant GitHubContainerRegistry
    participant GitHub
    participant IntegrationTarget
    participant Neo4J
    participant JupiterOne
    alt Using pre-built Docker image
      GitHubContainerRegistry-->>Docker: Pull image locally
    else Using self-built Docker image
      Docker-->>Docker: Build image locally
    end
    opt docker run starbase setup
      loop Foreach integration in config.yaml
        GitHub-->>Docker: clone public repo into local .integrations folder
        Docker-->>Docker: install integration dependencies
        Note over Docker,GitHub: NOTE: requires volume mount to host for .integrations folder
      end
    end
    opt docker run starbase run
      loop Foreach integration in config.yaml
        IntegrationTarget-->>Docker: Collect raw api data in .integrations
        opt if configured
          Docker-->>Neo4J: Sync data to Neo4J database
        end
        opt if configured
          Docker-->>JupiterOne: Sync data with JupiterOne platform
        end
      end
      Note over Docker: NOTE: requires volume mount to host for .integrations folder
    end
```

## Running Starbase - Docker

1. Run `docker build --no-cache -t starbase:latest .` to create the Starbase
   docker image.
2. Run `docker-compose run starbase setup` to clone or update all integrations
   listed in the `config.yaml` file as well as install all dependencies for each
   integration.
3. Run `docker-compose run starbase run` to collect data for each listed
   integration and then push collected data to the storage endpoint listed in
   `config.yaml`.

Note that macOS users in particular may see slower execution times when running
Starbase in a Docker container.

## Customizable Base Container Image

A public
[base container image is available via GitHub Container Registry](https://github.com/jupiterone/starbase/pkgs/container/starbase).
This image only has Starbase installed, without any configuration or graph
integrations. This means you'll need to pass configuration to Starbase by making
your `config.yaml` available to your running container, for example via a
[Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/#using-configmaps-as-files-from-a-pod),
and run `starbase setup` to install your graph integrations before using them.
