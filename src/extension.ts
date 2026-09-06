import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('switchToBuffer.switch', () => {
      vscode.window.showInformationMessage('Switch to Buffer: not implemented yet');
    }),
  );
}

export function deactivate(): void {}
