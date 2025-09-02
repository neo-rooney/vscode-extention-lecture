import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "step2-webview.helloWorld",
    () => {
      vscode.window.showInformationMessage(`Hello World from step1-basic!`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
