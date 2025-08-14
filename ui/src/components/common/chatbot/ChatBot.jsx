import React, { useState } from "react";
import { Input, Button, Spin, Card } from "antd";
import { SendOutlined, RobotOutlined } from "@ant-design/icons";
import "./ChatBot.css";

// Dummy API for chatbot (replace with real API call)
async function askChatbot(message) {
  // You can replace this with a real API call to HuggingFace or your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Gợi ý công thức cho: " + message);
    }, 1200);
  });
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Bạn muốn tìm công thức gì hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setLoading(true);
    const reply = await askChatbot(input);
    setMessages((msgs) => [...msgs, { sender: "bot", text: reply }]);
    setInput("");
    setLoading(false);
  };

  return (
    <Card className="chatbot-root" title={<span><RobotOutlined /> ChatBot Công thức</span>}>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-msg chatbot-msg-${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chatbot-msg chatbot-msg-bot">
            <span className="chatbot-typing">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}
      </div>
      <div className="chatbot-input-row">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Nhập món ăn, nguyên liệu, ..."
          disabled={loading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ marginLeft: 8 }}
        >
          Gửi
        </Button>
      </div>
    </Card>
  );
}
