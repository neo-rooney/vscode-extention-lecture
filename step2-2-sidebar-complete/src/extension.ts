import * as vscode from "vscode";

class Step2WebviewViewProvider implements vscode.WebviewViewProvider {
  constructor(private _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    return `<!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <title>Hello Sidebar</title>
            <style>
                body {
                    color: var(--vscode-editor-foreground);
                    font-family: var(--vscode-font-family);
                    padding: 15px; margin: 0;
                }
                h2 { color: var(--vscode-textLink-foreground); margin-top: 0; }
                p { line-height: 1.5; }
            </style>
        </head>
        <body>
            <h2>Hello Sidebar</h2>
            <p>사이드바에서 안녕하세요!</p>
            <p>이것은 step2-2-sidebar extension의 사이드바 뷰입니다.</p>
        </body>
        </html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const provider = new Step2WebviewViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("step2WebviewView", provider)
  );
}

export function deactivate() {}
