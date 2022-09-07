# v0.3.1 (Wed Sep 07 2022)

#### 🐛 Bug Fix

- Adding in optional Neo4j database name configuration [#78](https://github.com/JupiterOne/starbase/pull/78) ([@adam-in-ict](https://github.com/adam-in-ict))
- Initial Starbase documentation website [#75](https://github.com/JupiterOne/starbase/pull/75) ([@austinkelleher](https://github.com/austinkelleher))

#### Authors: 2

- Adam Pierson ([@adam-in-ict](https://github.com/adam-in-ict))
- Austin Kelleher ([@austinkelleher](https://github.com/austinkelleher))

---

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Make customisable base container image available on GitHub Container Registry.

## [0.2.4] - 2022-05-13

### Fixed

- Bumped SDK version to pull in fix for issue where we would periodically see
  duplicate nodes.

## [0.2.3] - 2022-05-05

### Changed

- Bumped SDK version to get access to performance improvements for Neo4j
  uploads.

## [0.2.2] - 2022-04-14

### Fixed

- Updated publish command.

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
