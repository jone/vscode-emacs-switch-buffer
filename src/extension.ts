import * as vscode from 'vscode';
import { MruTracker } from './mruTracker';
import { showSwitchToBufferQuickPick } from './quickPickCommand';

const idFor = (uri: vscode.Uri) => uri.toString();

export function activate(context: vscode.ExtensionContext): void {
  const tracker = new MruTracker();

  for (const group of vscode.window.tabGroups.all) {
    for (const tab of group.tabs) {
      if (tab.input instanceof vscode.TabInputText) {
        tracker.seed([idFor(tab.input.uri)]);
      }
    }
  }
  if (vscode.window.activeTextEditor) {
    tracker.recordActivation(idFor(vscode.window.activeTextEditor.document.uri));
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) tracker.recordActivation(idFor(editor.document.uri));
    }),
    // Recompute the still-open set on every tab change rather than trusting
    // `e.closed` directly: the same URI can be open in two split groups, and
    // closing only one of them must not purge it while the other remains open.
    vscode.window.tabGroups.onDidChangeTabs(() => {
      const openIds = new Set<string>();
      for (const group of vscode.window.tabGroups.all) {
        for (const tab of group.tabs) {
          if (tab.input instanceof vscode.TabInputText) openIds.add(idFor(tab.input.uri));
        }
      }
      for (const id of tracker.getOrdered()) {
        if (!openIds.has(id)) tracker.remove(id);
      }
    }),
    vscode.commands.registerCommand('switchToBuffer.switch', () => showSwitchToBufferQuickPick(tracker)),
  );
}

export function deactivate(): void {}
