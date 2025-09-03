import { sendMessage as sendMessageToExtension } from "@/utils/vscode";
import { useEffect, useState } from "react";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "loading";
  content: string;
  timestamp: number;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event);
      const { command, data } = event.data;

      if (command === "ai-response") {
        // AI 응답을 받았을 때
        setIsLoading(false);
        setMessages((prev) => {
          // 로딩 메시지 제거하고 AI 응답 추가
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

    // VSCode 확장으로 메시지 전송
    sendMessageToExtension("chat-message", { message: inputMessage });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
                    : "var(--vscode-panel-background)",
                color:
                  message.type === "user"
                    ? "var(--vscode-button-foreground)"
                    : "var(--vscode-editor-foreground)",
                border:
                  message.type === "loading"
                    ? "1px solid var(--vscode-input-border)"
                    : "none",
                fontSize: "14px",
                lineHeight: "1.4",
                wordWrap: "break-word",
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
              {message.type !== "loading" && message.content}
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

      {/* 스피너 애니메이션 */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
