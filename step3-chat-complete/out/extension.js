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
const answer_1 = require("./answer");
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
                case "chat-message":
                    const userMessage = message.data.message;
                    const attachedFile = message.data.attachedFile;
                    // 스트리밍 응답 시뮬레이션
                    this.simulateStreamingResponse(webviewView, userMessage, attachedFile);
                    break;
                case "select-file":
                    // 파일 선택 다이얼로그 열기
                    this.showFilePicker(webviewView);
                    break;
                default:
                    break;
            }
        });
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    }
    async showFilePicker(webviewView) {
        try {
            // 파일 선택 다이얼로그 열기
            const fileUri = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                canSelectFolders: false,
                canSelectMany: false,
                openLabel: "파일 선택",
                filters: {
                    "All Files": ["*"],
                    TypeScript: ["ts", "tsx"],
                    JavaScript: ["js", "jsx"],
                    Python: ["py"],
                    Java: ["java"],
                    "C++": ["cpp", "c", "h", "hpp"],
                    "C#": ["cs"],
                    Go: ["go"],
                    Rust: ["rs"],
                    PHP: ["php"],
                    Ruby: ["rb"],
                    HTML: ["html", "htm"],
                    CSS: ["css"],
                    JSON: ["json"],
                    XML: ["xml"],
                    YAML: ["yml", "yaml"],
                    Markdown: ["md"],
                    Text: ["txt"],
                },
            });
            if (fileUri && fileUri[0]) {
                const uri = fileUri[0];
                // 파일 내용 읽기
                const fileContent = await vscode.workspace.fs.readFile(uri);
                const content = Buffer.from(fileContent).toString("utf8");
                // 파일 확장자로 언어 감지
                const language = this.getLanguageFromExtension(uri.fsPath);
                // 웹뷰에 파일 정보 전송
                webviewView.webview.postMessage({
                    command: "file-selected",
                    data: {
                        fileName: uri.fsPath.split("/").pop() || uri.fsPath.split("\\").pop(),
                        content: content,
                        language: language,
                    },
                });
            }
        }
        catch (error) {
            console.error("파일 선택 중 오류:", error);
            vscode.window.showErrorMessage("파일을 선택하는 중 오류가 발생했습니다.");
        }
    }
    getLanguageFromExtension(filePath) {
        const extension = filePath.split(".").pop()?.toLowerCase();
        const languageMap = {
            ts: "typescript",
            tsx: "typescript",
            js: "javascript",
            jsx: "javascript",
            py: "python",
            java: "java",
            cpp: "cpp",
            c: "c",
            h: "c",
            hpp: "cpp",
            cs: "csharp",
            go: "go",
            rs: "rust",
            php: "php",
            rb: "ruby",
            html: "html",
            htm: "html",
            css: "css",
            json: "json",
            xml: "xml",
            yml: "yaml",
            yaml: "yaml",
            md: "markdown",
            txt: "text",
        };
        return languageMap[extension || ""] || "text";
    }
    detectFileWriteRequest(message) {
        const lowerMessage = message.toLowerCase();
        // 파일 쓰기 패턴 감지 (더 간단하고 정확한 패턴)
        const patterns = [
            // "README.md에 내용을 써줘" 패턴
            /([a-zA-Z0-9._-]+\.(md|txt|json|js|ts|py|html|css|xml|yml|yaml))\s*에\s*(.+?)\s*(?:을|를)?\s*(?:써|쓰|작성|생성|만들|추가)/,
            // "README.md에 내용을 써줘" 패턴 (더 유연한 버전)
            /([a-zA-Z0-9._-]+\.(md|txt|json|js|ts|py|html|css|xml|yml|yaml))\s*에\s*(.+)/,
        ];
        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match) {
                const fileName = match[1].trim();
                const content = match[3].trim();
                // 파일명이 유효한지 확인
                if (fileName && content && this.isValidFileName(fileName)) {
                    return { fileName, content };
                }
            }
        }
        return null;
    }
    isValidFileName(fileName) {
        // 기본적인 파일명 유효성 검사
        const validExtensions = [
            ".md",
            ".txt",
            ".json",
            ".js",
            ".ts",
            ".py",
            ".html",
            ".css",
            ".xml",
            ".yml",
            ".yaml",
        ];
        const hasValidExtension = validExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
        // 파일명에 금지된 문자가 없는지 확인
        const invalidChars = /[<>:"/\\|?*]/;
        const hasInvalidChars = invalidChars.test(fileName);
        return hasValidExtension && !hasInvalidChars && fileName.length > 0;
    }
    async handleFileWriteRequest(webviewView, request) {
        try {
            // 스트리밍 시작
            webviewView.webview.postMessage({
                command: "stream-start",
                data: {
                    messageId: Date.now().toString(),
                    answerType: "file-write",
                },
            });
            // 파일 경로 생성 (워크스페이스 루트에 생성)
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error("워크스페이스가 열려있지 않습니다.");
            }
            const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, request.fileName);
            // 파일이 이미 존재하는지 확인
            let fileExists = false;
            try {
                await vscode.workspace.fs.stat(fileUri);
                fileExists = true;
            }
            catch {
                fileExists = false;
            }
            // 파일 내용 생성
            let finalContent = request.content;
            if (fileExists) {
                // 기존 파일이 있으면 내용을 추가
                const existingContent = await vscode.workspace.fs.readFile(fileUri);
                const existingText = Buffer.from(existingContent).toString("utf8");
                finalContent = existingText + "\n\n" + request.content;
            }
            // 파일 쓰기
            const contentBuffer = Buffer.from(finalContent, "utf8");
            await vscode.workspace.fs.writeFile(fileUri, contentBuffer);
            // 성공 메시지 전송
            webviewView.webview.postMessage({
                command: "file-write-result",
                data: {
                    success: true,
                    fileName: request.fileName,
                    message: fileExists
                        ? `기존 파일에 내용이 추가되었습니다.`
                        : `새로운 파일이 생성되었습니다.`,
                },
            });
        }
        catch (error) {
            console.error("파일 쓰기 중 오류:", error);
            // 실패 메시지 전송
            webviewView.webview.postMessage({
                command: "file-write-result",
                data: {
                    success: false,
                    fileName: request.fileName,
                    message: `파일 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
                },
            });
        }
    }
    async simulateStreamingResponse(webviewView, userMessage, attachedFile) {
        // 파일 쓰기 요청인지 확인
        const fileWriteRequest = this.detectFileWriteRequest(userMessage);
        if (fileWriteRequest) {
            await this.handleFileWriteRequest(webviewView, fileWriteRequest);
            return;
        }
        // 답변 생성 (첨부 파일 정보 포함)
        const answer = (0, answer_1.generateAnswer)(userMessage, attachedFile);
        const fullResponse = answer.content;
        // 문장별로 분할 (마침표, 느낌표, 물음표 기준)
        const sentences = fullResponse
            .split(/([.!?]\s+)/)
            .filter((sentence) => sentence.trim().length > 0)
            .map((sentence) => sentence.trim())
            .filter((sentence) => sentence.length > 0);
        // 스트리밍 시작 신호
        webviewView.webview.postMessage({
            command: "stream-start",
            data: {
                messageId: Date.now().toString(),
                answerType: answer.type,
            },
        });
        // 각 문장을 순차적으로 전송
        sentences.forEach((sentence, index) => {
            setTimeout(() => {
                webviewView.webview.postMessage({
                    command: "stream-chunk",
                    data: {
                        chunk: sentence + (index < sentences.length - 1 ? " " : ""),
                        isLast: index === sentences.length - 1,
                    },
                });
            }, (index + 1) * 800); // 800ms 간격으로 전송
        });
        // 스트리밍 완료 신호 (마지막 문장 전송 후)
        setTimeout(() => {
            webviewView.webview.postMessage({
                command: "stream-end",
                data: {},
            });
        }, sentences.length * 800 + 500);
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