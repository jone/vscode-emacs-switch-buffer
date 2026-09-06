# Emacs Switch Buffer

Emacs-style `switch-to-buffer` (`C-x b`) for VS Code: one quick pick, MRU-ordered, that covers both halves of the real Emacs command:

- Press `Ctrl+X B` and hit **Enter with nothing typed** → jumps straight to the *previous* buffer. Press it again → jumps back. `Ctrl+X B` `Enter` `Ctrl+X B` `Enter` toggles between your last two buffers, like Alt-Tab.
- Start **typing** → fuzzy-filters the full list of open buffers by name.

## Usage

- Keybinding: `Ctrl+X B` (same physical chord on every OS — not remapped to `Cmd+X B` on Mac, matching Emacs convention), active while an editor has focus, or while an empty split pane (no file open) has focus, so a fresh split is a valid switch target. Disabled while the integrated terminal has focus, since many shells use `Ctrl+X` chords of their own.
- Command Palette: "Switch to Buffer: Switch to Buffer".

## How it works

The quick pick always lists open buffers most-recently-used first, excluding the current one. VS Code's QuickPick widget shows `items[0]` pre-highlighted and doesn't reorder the list while the filter box is empty — so an empty-input Enter naturally lands on the previous buffer, with no special-case logic needed. Typing a filter hands off to VS Code's normal fuzzy matching over the same list.

## Known limitations

- **Text editor tabs only.** Terminals, webviews, notebooks, diff editors, and other custom tab kinds are not tracked or switchable.
- **No persistence of closed buffers.** Unlike Emacs, closing a tab in VS Code discards it — there's no way to switch back to a buffer after its tab is closed.
- **MRU is global, not per split group**, and doesn't exclude buffers currently visible in another split (real Emacs excludes buffers visible in any window from being the implicit default). Switching replaces the buffer in whichever editor group is currently active.
- **No persistence across a window reload.** The MRU order lives in memory for the current window session only.

## Requirements

VS Code `^1.85.0` or later.

## Development

```sh
npm install
npm run watch   # rebuild on change
```

Press `F5` in VS Code to launch an Extension Development Host for manual testing.

```sh
npm run typecheck
npm run lint
npm test
npm run package   # produces a .vsix via vsce
```

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## License

[MIT](LICENSE)
