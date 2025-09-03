import { sendMessage as sendMessageToExtension } from "@/utils/vscode";
import { useEffect, useState } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "loading" | "streaming";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  answerType?: "weather" | "button" | "default";
  attachedFile?: {
    name: string;
    content: string;
    language: string;
  };
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    content: string;
    language: string;
  } | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event);
      const { command, data } = event.data;

      if (command === "ai-response") {
        // 기존 AI 응답 처리 (호환성을 위해 유지)
        setIsLoading(false);
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.type !== "loading");
          return [
            ...filtered,
            {
              id: Date.now().toString(),
              type: "ai",
              content: data.response,
              timestamp: Date.now(),
            },
          ];
        });
      } else if (command === "stream-start") {
        // 스트리밍 시작
        setIsLoading(false);
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.type !== "loading");
          return [
            ...filtered,
            {
              id: data.messageId,
              type: "streaming",
              content: "",
              timestamp: Date.now(),
              isStreaming: true,
              answerType: data.answerType,
            },
          ];
        });
      } else if (command === "stream-chunk") {
        // 스트리밍 청크 수신
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.type === "streaming" && msg.isStreaming) {
              return {
                ...msg,
                content: msg.content + data.chunk,
              };
            }
            return msg;
          });
        });
      } else if (command === "stream-end") {
        // 스트리밍 완료
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.type === "streaming" && msg.isStreaming) {
              return {
                ...msg,
                type: "ai",
                isStreaming: false,
              };
            }
            return msg;
          });
        });
      } else if (command === "file-selected") {
        // 파일 선택 완료
        setSelectedFile({
          name: data.fileName,
          content: data.content,
          language: data.language,
        });
      }
    };

    window.addEventListener("message", handler);
    sendMessageToExtension("ready", {});

    return () => window.removeEventListener("message", handler);
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: Date.now(),
      attachedFile: selectedFile || undefined,
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "loading",
      content: "AI가 응답을 생성하고 있습니다...",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputMessage("");
    setIsLoading(true);

    // VSCode 확장으로 메시지 전송 (파일 정보 포함)
    sendMessageToExtension("chat-message", {
      message: inputMessage,
      attachedFile: selectedFile,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectFile = () => {
    sendMessageToExtension("select-file", {});
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--vscode-font-family)",
        backgroundColor: "var(--vscode-editor-background)",
        color: "var(--vscode-editor-foreground)",
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid var(--vscode-panel-border)",
          backgroundColor: "var(--vscode-panel-background)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "16px" }}>AI Chat Assistant</h2>
      </div>

      {/* 메시지 리스트 */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--vscode-descriptionForeground)",
              marginTop: "40px",
            }}
          >
            AI와 대화를 시작해보세요!
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor:
                  message.type === "user"
                    ? "var(--vscode-button-background)"
                    : message.type === "loading"
                    ? "var(--vscode-input-background)"
                    : message.answerType === "weather"
                    ? "var(--vscode-editor-background)"
                    : message.answerType === "button"
                    ? "var(--vscode-editor-background)"
                    : "var(--vscode-panel-background)",
                color:
                  message.type === "user"
                    ? "var(--vscode-button-foreground)"
                    : "var(--vscode-editor-foreground)",
                border:
                  message.type === "loading"
                    ? "1px solid var(--vscode-input-border)"
                    : message.answerType === "button"
                    ? "1px solid var(--vscode-panel-border)"
                    : "none",
                fontSize: "14px",
                lineHeight: "1.4",
                wordWrap: "break-word",
                fontFamily:
                  message.answerType === "button"
                    ? "var(--vscode-editor-font-family)"
                    : "inherit",
              }}
            >
              {message.type === "loading" && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      border: "2px solid var(--vscode-progressBar-background)",
                      borderTop: "2px solid var(--vscode-button-background)",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  {message.content}
                </div>
              )}
              {message.type === "streaming" && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  {message.answerType === "button" ? (
                    <pre
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "var(--vscode-editor-font-family)",
                        fontSize: "13px",
                        margin: 0,
                        padding: 0,
                        display: "inline",
                      }}
                    >
                      {message.content}
                    </pre>
                  ) : (
                    <span>{message.content}</span>
                  )}
                  <span
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "16px",
                      backgroundColor: "var(--vscode-editor-foreground)",
                      animation: "blink 1s infinite",
                    }}
                  />
                </div>
              )}
              {message.type !== "loading" &&
                message.type !== "streaming" &&
                (message.answerType === "button" ? (
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "var(--vscode-editor-font-family)",
                      fontSize: "13px",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    {message.content}
                  </pre>
                ) : (
                  message.content
                ))}

              {/* 첨부 파일 표시 */}
              {message.attachedFile && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "var(--vscode-input-background)",
                    border: "1px solid var(--vscode-input-border)",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    📎 {message.attachedFile.name}
                  </div>
                  <div style={{ color: "var(--vscode-descriptionForeground)" }}>
                    {message.attachedFile.language} •{" "}
                    {message.attachedFile.content.length} characters
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--vscode-panel-border)",
          backgroundColor: "var(--vscode-panel-background)",
        }}
      >
        {/* 선택된 파일 표시 */}
        {selectedFile && (
          <div
            style={{
              marginBottom: "8px",
              padding: "8px",
              backgroundColor: "var(--vscode-input-background)",
              border: "1px solid var(--vscode-input-border)",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📎</span>
              <span style={{ fontSize: "14px" }}>{selectedFile.name}</span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--vscode-descriptionForeground)",
                }}
              >
                ({selectedFile.language})
              </span>
            </div>
            <button
              onClick={clearSelectedFile}
              style={{
                background: "none",
                border: "none",
                color: "var(--vscode-foreground)",
                cursor: "pointer",
                fontSize: "16px",
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="AI에게 메시지를 보내세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
            disabled={isLoading}
            style={{
              flex: 1,
              minHeight: "40px",
              maxHeight: "120px",
              padding: "8px 12px",
              border: "1px solid var(--vscode-input-border)",
              borderRadius: "4px",
              backgroundColor: "var(--vscode-input-background)",
              color: "var(--vscode-input-foreground)",
              fontFamily: "inherit",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
            }}
          />
          <button
            onClick={selectFile}
            disabled={isLoading}
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--vscode-button-secondaryBackground)",
              color: "var(--vscode-button-secondaryForeground)",
              border: "1px solid var(--vscode-button-border)",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              opacity: isLoading ? 0.5 : 1,
            }}
            title="워크스페이스에서 파일 선택"
          >
            📁
          </button>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--vscode-button-background)",
              color: "var(--vscode-button-foreground)",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              opacity: !inputMessage.trim() || isLoading ? 0.5 : 1,
            }}
          >
            전송
          </button>
        </div>
      </div>

      {/* 애니메이션 */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

export default App;
