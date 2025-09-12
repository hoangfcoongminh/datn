import React, { useState } from "react";
import { FloatButton, Badge } from "antd";
import { MessageOutlined, CloseOutlined } from "@ant-design/icons";
import ChatBot from "./ChatBot";
import "./ChatLauncher.css";

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {open && (
        <div className="chatlauncher-panel">
          <div className="chatlauncher-header">
            <div className="chatlauncher-title">Trợ lý ORDER</div>
            <button className="chatlauncher-close" onClick={() => setOpen(false)}>
              <CloseOutlined />
            </button>
          </div>
          <div className="chatlauncher-body">
            <ChatBot />
          </div>
        </div>
      )}

      <div className="chatlauncher-fab">
        <Badge dot={open} offset={[-2, 2]}>
          <FloatButton
            shape="circle"
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => setOpen(!open)}
          />
        </Badge>
      </div>
    </div>
  );
} 