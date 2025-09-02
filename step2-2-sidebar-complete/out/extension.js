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
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this._getHtmlForWebview();
    }
    _getHtmlForWebview() {
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
function activate(context) {
    const provider = new Step2WebviewViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("step2WebviewView", provider));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map