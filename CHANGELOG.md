# Changelog

All notable changes to [`avl-bst`][gh] will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Replaced deprecated [Subpath folder mappings](https://nodejs.org/api/packages.html#packages_subpath_folder_mappings)
with [Subpath patterns](https://nodejs.org/api/packages.html#packages_subpath_patterns) in package.json.

## [0.2.1] (2021-04-27)

### Fixed

- Added dedicated module entry point for CommonJS environments.

### Added

- Added `"exports"` definitions in package.json.
- Added UMD bundle pointers for CDN services.

## [0.2.0] (2021-04-25)

### Added
- method `IAVLTree.isEmpty()`
- method `IAVLTree.size()`

## [0.1.1] (2021-04-25)

### Fixed
- Renamed UMD bundle names to match the npm package name.
- package.json path to type declarations.

## [0.1.0] (2021-04-25, initial release)

### Added
Initial version featuring the basic BST operations:
- Insert values
- Search values
- Traverse tree
- Delete values

[gh]: https://github.com/JJWesterkamp/avl-bst


[Unreleased]: https://github.com/JJWesterkamp/avl-bst/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/JJWesterkamp/avl-bst/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JJWesterkamp/avl-bst/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/JJWesterkamp/avl-bst/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/JJWesterkamp/avl-bst/tree/v0.1.0
