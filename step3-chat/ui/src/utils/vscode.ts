// VS Code API 타입 정의
type VSCodeMessage = {
  command: string;
  data?: unknown;
};

type VSCodeAPI = {
  postMessage: (message: VSCodeMessage) => void;
  getState: () => unknown;
  setState: (state: unknown) => void;
};

// VS Code API 싱글톤
let vscodeInstance: VSCodeAPI | null = null;

export const getVSCodeAPI = (): VSCodeAPI | null => {
  if (!vscodeInstance && window.acquireVsCodeApi) {
    vscodeInstance = window.acquireVsCodeApi();
  }
  return vscodeInstance;
};

export const sendMessage = (command: string, data?: unknown) => {
  console.log("sendMessage:", command, data);
  const vscode = getVSCodeAPI();
  if (vscode) {
    vscode.postMessage({ command, data });
  }
};
