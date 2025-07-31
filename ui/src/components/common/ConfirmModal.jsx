import React from "react";
import { Modal } from "antd";

const ConfirmModal = ({ open, onOk, onCancel, title, content, okText = "Xác nhận", cancelText = "Huỷ" }) => {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      title={<span style={{ color: '#a50034', fontWeight: 700 }}>{title}</span>}
      okText={okText}
      cancelText={cancelText}
      centered
      maskClosable={false}
      closable={false}
      okButtonProps={{ style: { background: '#a50034', borderColor: '#a50034', fontWeight: 600 } }}
    >
      <div style={{ fontSize: 16 }}>{content}</div>
    </Modal>
  );
};

export default ConfirmModal;
