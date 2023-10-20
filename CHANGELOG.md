# v0.10.0 (Fri Oct 20 2023)

#### 🚀 Enhancement

- Bump @babel/traverse from 7.16.10 to 7.23.2 [#106](https://github.com/JupiterOne/starbase/pull/106) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### ⚠️ Pushed to `main`

- Populate CODEOWENRS, baseline package.json and baseline cortex.yaml ([@jablonnc](https://github.com/jablonnc))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Noah Jablonski ([@jablonnc](https://github.com/jablonnc))

---

# v0.9.0 (Wed Jul 19 2023)

#### 🚀 Enhancement

- Revising node version requirements [#98](https://github.com/JupiterOne/starbase/pull/98) ([@dependabot[bot]](https://github.com/dependabot[bot]) [@adam-in-ict](https://github.com/adam-in-ict))

#### 🐛 Bug Fix

- Merge branch 'dependabot/npm_and_yarn/word-wrap-1.2.4' of https://github.com/JupiterOne/starbase into revise-engine-requirements [#96](https://github.com/JupiterOne/starbase/pull/96) ([@adam-in-ict](https://github.com/adam-in-ict))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Adam Pierson ([@adam-in-ict](https://github.com/adam-in-ict))

---

# v0.8.0 (Tue Jun 27 2023)

#### 🚀 Enhancement

- Update to use Node.js 18 [#95](https://github.com/JupiterOne/starbase/pull/95) ([@austinkelleher](https://github.com/austinkelleher))

#### 🐛 Bug Fix

- Remove J1 free account reference [#94](https://github.com/JupiterOne/starbase/pull/94) ([@austinkelleher](https://github.com/austinkelleher))

#### Authors: 1

- Austin Kelleher ([@austinkelleher](https://github.com/austinkelleher))

---

# v0.7.0 (Mon Mar 13 2023)

#### 🚀 Enhancement

- Merge branch 'dependabot/npm_and_yarn/simple-git-3.16.0' of https://github.com/JupiterOne/starbase into expose-stderr [#88](https://github.com/JupiterOne/starbase/pull/88) ([@adam-in-ict](https://github.com/adam-in-ict))

#### 🐛 Bug Fix

- Exposing stderr output [#89](https://github.com/JupiterOne/starbase/pull/89) ([@dependabot[bot]](https://github.com/dependabot[bot]) [@adam-in-ict](https://github.com/adam-in-ict))

#### Authors: 2

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Adam Pierson ([@adam-in-ict](https://github.com/adam-in-ict))

---

# v0.6.0 (Mon Feb 06 2023)

#### 🚀 Enhancement

- Bumping minor revision to fix past manual tag creation [#87](https://github.com/JupiterOne/starbase/pull/87) ([@adam-in-ict](https://github.com/adam-in-ict))

#### 🐛 Bug Fix

- Updating to latest SDK [#86](https://github.com/JupiterOne/starbase/pull/86) ([@adam-in-ict](https://github.com/adam-in-ict))

#### Authors: 1

- Adam Pierson ([@adam-in-ict](https://github.com/adam-in-ict))

---

# v0.5.0 (Thu Oct 20 2022)

#### 🚀 Enhancement

- Add 'jupiterone' storage engine
  [#79](https://github.com/JupiterOne/starbase/pull/79)
  ([@erichs](https://github.com/erichs))

#### Authors: 1

- Erich Smith ([@erichs](https://github.com/erichs))

---

# v0.3.1 (Wed Sep 07 2022)

#### 🐛 Bug Fix

- Adding in optional Neo4j database name configuration
  [#78](https://github.com/JupiterOne/starbase/pull/78)
  ([@adam-in-ict](https://github.com/adam-in-ict))
- Initial Starbase documentation website
  [#75](https://github.com/JupiterOne/starbase/pull/75)
  ([@austinkelleher](https://github.com/austinkelleher))

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
