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
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "media")],
      portMapping: [
        {
          webviewPort: 5173,
          extensionHostPort: 5173,
        },
      ],
    };

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "ready":
          webviewView.webview.postMessage({
            command: "init",
            data: { count: 40 },
          });
          break;

        case "hello":
          vscode.window.showInformationMessage(
            `React에서 보낸 메시지: ${message.data.text}`
          );
          break;
      }
    });

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const isDevelopment = process.env.NODE_ENV === "development";
    console.log("isDevelopment:", isDevelopment);

    if (isDevelopment) {
      // 개발 모드: Vite 개발 서버 사용
      return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Webview Dev</title>
        </head>
        <body>
          <div id="root"></div>
          
          <script type="module">
            import RefreshRuntime from "http://localhost:5173/@react-refresh"
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
          </script>
          
          <script type="module" src="http://localhost:5173/src/main.tsx"></script>
        </body>
      </html>`;
    } else {
      // 프로덕션 모드: 빌드된 파일 사용
      const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(this._extensionUri, "media", "webview.js")
      );

      return `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Webview Prod</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="${scriptUri}"></script>
        </body>
      </html>`;
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension activating...");
  console.log("NODE_ENV:", process.env.NODE_ENV);

  const provider = new Step2WebviewViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("step2WebviewView", provider)
  );

  console.log("Extension activated successfully");
}

export function deactivate() {}
