# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-09-11

### Fixed

- Switching a buffer now targets the split-pane group the command was invoked from, instead of racing focus restoration after the QuickPick closes.
- The command now also works when invoked from an empty split pane (no file open in that group yet), so a fresh split is a valid switch target. Disabled while the integrated terminal has focus to avoid intercepting shell `Ctrl+X` chords.

## [0.0.1] - 2026-09-06

### Added

- Initial MVP: `switchToBuffer.switch` command bound to `Ctrl+X B`, showing an MRU-ordered quick pick of open text-editor buffers.
- Empty-input Enter jumps to the previous buffer (Emacs `C-x b RET` behavior); typing fuzzy-filters the full buffer list by name.
- Known limitations documented in README (text editors only, no persistence across reload or tab close, global MRU across split groups).
