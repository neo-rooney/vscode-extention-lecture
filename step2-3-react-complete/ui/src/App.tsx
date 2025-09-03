import { sendMessage } from "@/utils/vscode";
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event);
      const { command, data } = event.data;
      if (command === "init") {
        setCount(data.count); // 확장에서 보낸 초기값 반영
      }
    };

    window.addEventListener("message", handler);

    sendMessage("ready", {});

    return () => window.removeEventListener("message", handler);
  }, []);

  const sendToExtension = () => {
    sendMessage("hello", { text: message, timestamp: Date.now() });
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "var(--vscode-font-family)",
        backgroundColor: "var(--vscode-editor-background)",
        color: "var(--vscode-editor-foreground)",
      }}
    >
      <h1>React in VSCode Extension!</h1>

      <div>
        <button onClick={() => setCount(count + 1)}>카운트: {count}</button>
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Extension에 메시지 보내기"
      />
      <button onClick={sendToExtension}>전송</button>
    </div>
  );
}

export default App;
