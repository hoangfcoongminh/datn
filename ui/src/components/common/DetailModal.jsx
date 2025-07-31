import React from "react";
import { Modal, Spin, Input, Button, Form } from "antd";

const DetailModal = ({
  open,
  onCancel,
  title,
  loading,
  values = {},
  editable = false,
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
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><Spin size="large" /></div>
      ) : (
        <>
          {children ? (
            children
          ) : (
            <Form layout="vertical">
              <Form.Item label="Tên">
                <Input
                  value={values.name || ''}
                  disabled={!editable}
                  onChange={e => onChange && onChange({ ...values, name: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="Đơn vị">
                <Input
                  value={values.unit?.name || ''}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Mô tả">
                <Input.TextArea
                  value={values.description || ''}
                  disabled={!editable}
                  autoSize
                  onChange={e => onChange && onChange({ ...values, description: e.target.value })}
                />
              </Form.Item>
              <div style={{ textAlign: 'right' }}>
                {editable ? (
                  <Button type="primary" onClick={onSave} style={{ minWidth: 80 }}>
                    Lưu
                  </Button>
                ) : (
                  <Button onClick={onEdit} style={{ minWidth: 80 }}>
                    Sửa
                  </Button>
                )}
              </div>
            </Form>
          )}
        </>
      )}
    </Modal>
  );
};

export default DetailModal;
