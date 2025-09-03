"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
class Step2WebviewViewProvider {
    _extensionUri;
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
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
                    vscode.window.showInformationMessage(`React에서 보낸 메시지: ${message.data.text}`);
                    break;
            }
        });
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    _getHtmlForWebview(webview) {
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
        }
        else {
            // 프로덕션 모드: 빌드된 파일 사용
            const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "webview.js"));
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
function activate(context) {
    console.log("Extension activating...");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    const provider = new Step2WebviewViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("step2WebviewView", provider));
    console.log("Extension activated successfully");
}
function deactivate() { }
//# sourceMappingURL=extension.js.map