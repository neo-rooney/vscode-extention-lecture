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
function activate(context) {
    let disposable = vscode.commands.registerCommand("step2-webview.openWebview", () => {
        const panel = vscode.window.createWebviewPanel("helloWebview", // 고유 ID
        "Hello World Webview", // 탭 제목
        vscode.ViewColumn.One, // 표시 위치
        {
            enableScripts: true, // JavaScript 실행 허용
            retainContextWhenHidden: true,
        });
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(disposable);
}
function getWebviewContent() {
    return `<!DOCTYPE html>
   <html lang="ko">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Hello World Webview</title>
       <style>
                   body {
               background-color: var(--vscode-editor-background);
               color: var(--vscode-editor-foreground);
               font-family: var(--vscode-font-family);
               padding: 20px;
           }
           button {
               background-color: var(--vscode-button-background);
               color: var(--vscode-button-foreground);
               border: 1px solid var(--vscode-button-border);
               padding: 8px 16px;
               border-radius: 3px;
               cursor: pointer;
           }          
           button:hover {
               background-color: var(--vscode-button-hoverBackground);
           }
           #counter {
               font-size: 24px;
               font-weight: bold;
               margin: 20px 0;
               color: var(--vscode-textLink-foreground);
           }
      </style>
   </head>
   <body>
       <h1>Hello World from Webview!</h1>
       <p>이것은 VSCode 내부의 웹페이지입니다.</p>
       <div id="counter">카운트: 0</div>
       <button id="clickMe">카운트 증가</button>
       <button id="resetBtn">리셋</button>
       
       <script>
                     let count = 0;
           const button = document.getElementById('clickMe');
           const resetBtn = document.getElementById('resetBtn');
           const counter = document.getElementById('counter');
           
           button.addEventListener('click', () => {
               count++;
               counter.innerHTML = '카운트: ' + count;
           });
           
           resetBtn.addEventListener('click', () => {
               count = 0;
               counter.innerHTML = '카운트: ' + count;
           });
       </script>
   </body>
   </html>`;
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map