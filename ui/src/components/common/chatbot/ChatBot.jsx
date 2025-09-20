import React, { useEffect, useRef, useState } from "react";
import { Input, Button, Card, Avatar } from "antd";
import { SendOutlined, RobotOutlined } from "@ant-design/icons";
import "./ChatBot.css";
import { askChatbot, fetchChatHistory } from '../../../api/chatbot';
import { toast } from 'react-toastify';

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào! Bạn muốn tìm công thức gì hôm nay?", data: null, timestamp: null }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'))?.user;
  const chatbotAvatar = "http://localhost:9000/images/chat-bot-avt.jpg"

  const scrollToBottom = (smooth = true) => {
    const el = messagesRef.current;
    if (!el) return;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    } else {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    // auto scroll khi messages thay đổi
    scrollToBottom(false);
  }, [messages]);

  useEffect(() => {
    // khi component mount, đảm bảo input có thể nhìn thấy
    // và scroll xuống dưới
    setTimeout(() => scrollToBottom(false), 100);
  }, []);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await fetchChatHistory();
        console.log("Chat history:", history);

        setMessages(history.length > 0
          ? history.map(msg => ({
            sender: msg.sender === 'chatbot' ? 'bot' : msg.sender, // map 'chatbot' → 'bot'
            text: typeof msg.message === 'string' ? msg.message : null,
            data: typeof msg.message === 'object' ? msg.message : null,
            timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : null
          }))
          : [{ sender: "bot", text: "Xin chào! Bạn muốn tìm công thức gì hôm nay?", data: null, timestamp: null }]
        );
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử chat:", err);
        setMessages([{ sender: "bot", text: "Không thể tải lịch sử chat.", data: null, timestamp: null }]);
      }
    };

    loadChatHistory();
  }, []);


  const renderBotData = (data) => (
    <div className="chatbot-reply">
      {data.ingredients && data.ingredients.length > 0 && (
        <div className="chatbot-reply-section">
          <h3>Nguyên liệu</h3>
          <ul>{data.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>
        </div>
      )}
      {data.steps && data.steps.length > 0 && (
        <div className="chatbot-reply-section">
          <h3>Các bước thực hiện</h3>
          <ol>{data.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
      {data.notes && (
        <div className="chatbot-reply-section">
          {data.ingredients && data.ingredients.length > 0 && data.steps && data.steps.length > 0 && <h3>Ghi chú</h3>}
          <p>{data.notes}</p>
        </div>
      )}
    </div>
  );

  const handleSend = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để sử dụng ChatBot.');
      return;
    }
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await askChatbot(trimmed); // backend trả object hoặc string
      if (reply && typeof reply === 'object' && (reply.ingredients || reply.steps || reply.notes)) {
        setMessages(prev => [...prev, { sender: "bot", data: reply }]);
      } else {
        const str = typeof reply === 'string' ? reply : JSON.stringify(reply);
        setMessages(prev => [...prev, { sender: "bot", text: str }]);
      }
      // scroll xuống để input luôn nhìn thấy (đặc biệt trên mobile)
      setTimeout(() => scrollToBottom(true), 100);
      // focus input lại để người dùng nhập tiếp
      inputRef.current?.focus();
    } catch (err) {
      console.error("askChatbot error:", err);
      toast.error("Lỗi khi gọi chatbot. Vui lòng thử lại.");
      setMessages(prev => [...prev, { sender: "bot", text: "Lỗi: không thể kết nối tới chatbot." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, idx) => (
    <div key={idx} className={`chatbot-msg chatbot-msg-${msg.sender}`} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
      {msg.sender === "bot" && (
        <Avatar
          size={32}
          src={chatbotAvatar}
          alt="Bot Avatar"
          style={{ flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1 }}>
        {msg.sender === "bot" ? (msg.data ? renderBotData(msg.data) : <p>{msg.text}</p>) : <p>{msg.text}</p>}
      </div>
      {msg.sender === "user" && (
        <Avatar
          size={32}
          src={user?.imgUrl || "/user-avatar.png"}
          alt="User Avatar"
          style={{ flexShrink: 0 }}
        />
      )}
    </div>
  );

  return (
    <Card className="chatbot-root" title={<span><RobotOutlined /> ChatBot Công thức</span>}>
      <div className="chatbot-messages" ref={messagesRef} style={{ maxHeight: "calc(100% - 80px)", overflowY: "auto" }}>
        {messages.map(renderMessage)}

        {loading && (
          <div className="chatbot-msg chatbot-msg-bot">
            <span className="chatbot-typing"><span></span><span></span><span></span></span>
          </div>
        )}
      </div>

      <div className="chatbot-input-row" style={{ position: "sticky", bottom: 0, backgroundColor: "#fff", zIndex: 10 }}>
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onPressEnter={handleSend}
          onFocus={() => setTimeout(() => scrollToBottom(true), 120)}
          placeholder="Nhập món ăn, nguyên liệu, hoặc câu hỏi về nấu nướng..."
          disabled={loading}
          allowClear
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ marginLeft: 8, minWidth: 90 }}
        >
          {loading ? 'Đang...' : 'Gửi'}
        </Button>
      </div>
    </Card>
  );
}
