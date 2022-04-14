# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2022-04-14

### Fixed

- Working on fix for Starbase npm package.

## [0.2.0] - 2022-04-13

### Changed

- Swapped out `nodegit` for `simple-git` as it has a simpler interface and some
  users encountered a known issue with `libgit2`/`nodegit` where OSX is unable
  to verify certs from `github.com`

### Added

- Commands to wipe and wipe-all now support the ability to wipe data in the
  Neo4j database, either by integrationID or completely.
- The additional `yarn neo4j:start:plugins` command starts the Neo4j Docker
  image including the GDS and APOC libraries.

### Changed

- Commands now only include setup and run. The update-integrations command has
  now been absorbed into setup and it now performs clone, update, and dependency
  installation.

### Fixed

- Steps are now properly awaiting prior to final push to Neo4j.

## [0.1.0] - 2021-12-27

### Added

- Initial definition of project.
- Individual commands for setup, update-integrations, and run defined via
  commander.
