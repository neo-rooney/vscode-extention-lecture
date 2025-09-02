import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "step1-basic.helloWorld",
    () => {
      vscode.window
        .showInputBox({
          prompt: "이름을 입력하세요",
        })
        .then((input) => {
          if (input) {
            vscode.window.showInformationMessage(`안녕하세요, ${input}님!`);
          }
        });
    }
  );

  let timeCommand = vscode.commands.registerCommand(
    "step1-basic.showTime",
    () => {
      console.log("extention loaded");
      const now = new Date().toLocaleString();
      vscode.window.showErrorMessage(`현재 시간: ${now}`);
    }
  );
  context.subscriptions.push(timeCommand);

  context.subscriptions.push(disposable);
}

export function deactivate() {}
