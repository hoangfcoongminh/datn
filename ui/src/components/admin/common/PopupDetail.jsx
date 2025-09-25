import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Select, Upload, Image } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const PopupDetail = ({ open, onClose, data, onUpdate, fields = [] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 1, label: "Hoạt động" },
    { value: 0, label: "Ngưng hoạt động" },
  ];

  useEffect(() => {
    // đảm bảo formData luôn là object (không null)
    if (data) {
      setFormData(data);
    } else {
      const initial = (fields || []).reduce(
        (acc, field) => ({ ...acc, [field.name]: "" }),
        {}
      );
      setFormData({ status: 1, ...initial });
    }
    setSelectedFile(null); // reset file khi mở popup mới
    setIsEditing(!data); // Nếu không có data, bật chế độ chỉnh sửa
  }, [data, fields]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(formData, selectedFile);
      setIsEditing(false);
      onClose && onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 25,
          }}
        >
          <span>Chi tiết</span>
          <div>
            <span>Trạng thái: </span>
            <Select
              style={{ width: 150 }}
              value={formData?.status ?? 1}
              disabled={!isEditing}
              onChange={(value) => handleChange("status", value)}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  <span
                    style={{
                      color: option.value === 1 ? "green" : "red",
                    }}
                  >
                    {option.label}
                  </span>
                </Option>
              ))}
            </Select>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Render dynamic fields */}
        {(fields || []).map((field) => {
  if (!field || !field.name) return null;

  // text input
  if (field.type === "text") {
    return (
      <div key={field.name} style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
        >
          {field.label}
        </label>
        <Input
          placeholder={field.label}
          value={formData[field.name] || ""}
          disabled={!isEditing}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      </div>
    );
  }

  // textarea
  if (field.type === "textarea") {
    return (
      <div key={field.name} style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
        >
          {field.label}
        </label>
        <Input.TextArea
          placeholder={field.label}
          value={formData[field.name] || ""}
          disabled={!isEditing}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      </div>
    );
  }

  // image
  if (field.type === "image") {
    return (
      <div key={field.name} style={{ marginBottom: 16, textAlign: "center" }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
        >
          {field.label}
        </label>
        <Image
          src={
            selectedFile
              ? URL.createObjectURL(selectedFile)
              : formData[field.name] || field.defaultImage
          }
          alt={field.label}
          style={{ maxWidth: "100%", maxHeight: 200 }}
        />
        {isEditing && (
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              setSelectedFile(file);
              return false;
            }}
          >
            <Button icon={<UploadOutlined />} style={{ marginTop: 8 }}>
              Chọn ảnh mới
            </Button>
          </Upload>
        )}
      </div>
    );
  }

  // select
  if (field.type === "select" && Array.isArray(field.options)) {
    return (
      <div key={field.name} style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
        >
          {field.label}
        </label>
        <Select
          placeholder={field.label}
          value={formData[field.name] || undefined}
          disabled={!isEditing}
          onChange={(value) => handleChange(field.name, value)}
        >
          {field.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  // password (chỉ hiện khi thêm mới, tức là data = null)
  if (field.type === "password" && !data) {
    return (
      <div key={field.name} style={{ marginBottom: 16 }}>
        <label
          style={{ display: "block", marginBottom: 8, fontWeight: 600 }}
        >
          {field.label}
        </label>
        <Input.Password
          placeholder={field.label}
          value={formData[field.name] || ""}
          onChange={(e) => handleChange(field.name, e.target.value)}
          style={{ borderRadius: 8 }}
        />
      </div>
    );
  }

  return null;
})}

      </div>

      {/* Footer buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 24,
        }}
      >
        {isEditing ? (
          <>
            <Button
              type="primary"
              loading={loading}
              style={{
                backgroundColor: "#349f4aff",
                borderColor: "green",
              }}
              onClick={handleSave}
              icon={<SaveOutlined />}
            >
              Lưu
            </Button>
            <Button
              type="default"
              onClick={onClose} // Đóng modal ngay lập tức
              icon={<CloseOutlined />}
            >
              Đóng
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              style={{
                backgroundColor: "#246badff",
                borderColor: "blue",
              }}
              onClick={handleEdit}
              icon={<EditOutlined />}
            >
              Sửa
            </Button>
            <Button type="default" onClick={onClose} icon={<CloseOutlined />}>
              Đóng
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PopupDetail;
