import React from "react";
import { Modal, Spin, Input, Button, Form } from "antd";

const DetailModal = ({
  open,
  onCancel,
  title,
  loading,
  values = {},
  onEdit,
  onSave,
  onChange,
  isEditing,
  children
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title={<span style={{ color: '#a50034', fontWeight: 700 }}>{title}</span>}
      footer={null}
      centered
      maskClosable={true}
      width={480}
      // style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><Spin size="large" /></div>
      ) : (
        <>
          {children}
        </>
      )}
    </Modal>
  );
};

export default DetailModal;
