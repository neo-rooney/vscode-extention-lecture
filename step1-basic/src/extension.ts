import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "step1-basic.helloWorld",
    () => {
      vscode.window.showInformationMessage(`Hello World from step1-basic!`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
