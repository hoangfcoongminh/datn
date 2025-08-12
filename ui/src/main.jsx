import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import App from "./App.jsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#a50034",
          borderRadius: 2,

          // Alias Token
          // colorBgContainer: '#f6ffed',
        },
      }}
    >
      <App />

    </ConfigProvider>,
  /* </StrictMode>, */
);
