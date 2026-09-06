import * as vscode from 'vscode';
import { MruTracker } from './mruTracker';

interface BufferQuickPickItem extends vscode.QuickPickItem {
  uri: vscode.Uri;
}

function collectOpenTextUris(): vscode.Uri[] {
  const uris: vscode.Uri[] = [];
  const seen = new Set<string>();
  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (tab.input instanceof vscode.TabInputText) {
        const key = tab.input.uri.toString();
        if (!seen.has(key)) {
          seen.add(key);
          uris.push(tab.input.uri);
        }
      }
    }
  }
  return uris;
}

// URI-based, not Node `path`/`fsPath`-based, so it stays correct for
// Remote-SSH / WSL / Containers workspaces where the extension host's OS
// and the file's actual path syntax can differ.
function basenameOf(uri: vscode.Uri): string {
  const segments = uri.path.split('/');
  return segments[segments.length - 1] || uri.path;
}

function toQuickPickItem(uri: vscode.Uri): BufferQuickPickItem {
  return {
    label: basenameOf(uri),
    description: vscode.workspace.asRelativePath(uri, false),
    uri,
  };
}

export async function showSwitchToBufferQuickPick(tracker: MruTracker): Promise<void> {
  // Capture the invoking editor's group up front. The QuickPick steals focus
  // while open, and re-reading `vscode.window.activeTextEditor` after it
  // closes races focus restoration -- it can resolve before the previous
  // group has regained focus, silently targeting the wrong split pane.
  const invokingEditor = vscode.window.activeTextEditor;
  const currentId = invokingEditor?.document.uri.toString();
  const targetColumn = invokingEditor?.viewColumn ?? vscode.ViewColumn.Active;
  const openUris = collectOpenTextUris();
  const byId = new Map(openUris.map((u) => [u.toString(), u]));

  const orderedIds = tracker.getOrdered(currentId).filter((id) => byId.has(id));
  const unseenIds = openUris
    .map((u) => u.toString())
    .filter((id) => id !== currentId && !orderedIds.includes(id));

  const items = [...orderedIds, ...unseenIds].map((id) => toQuickPickItem(byId.get(id)!));
  if (items.length === 0) {
    vscode.window.showInformationMessage('Switch to Buffer: no other open buffers.');
    return;
  }

  const quickPick = vscode.window.createQuickPick<BufferQuickPickItem>();
  // Plan A: rely on stable QuickPick behavior (no re-sort while the filter is
  // empty, items[0] pre-highlighted) so empty-Enter lands on the previous
  // buffer with no special-case logic. See README's "How it works" section.
  quickPick.items = items;
  quickPick.placeholder = 'Switch to buffer (Enter with empty filter = previous buffer)';
  quickPick.matchOnDescription = true;

  const picked = await new Promise<BufferQuickPickItem | undefined>((resolve) => {
    quickPick.onDidAccept(() => {
      resolve(quickPick.selectedItems[0]);
      quickPick.hide();
    });
    quickPick.onDidHide(() => {
      resolve(undefined);
      quickPick.dispose();
    });
    quickPick.show();
  });

  if (picked) {
    await vscode.window.showTextDocument(picked.uri, { viewColumn: targetColumn, preview: false });
  }
}
