import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Select, Upload, Image } from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const PopupDetail = ({ open, onClose, data, onUpdate, fields }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data || {});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 1, label: "Hoạt động" },
    { value: 0, label: "Ngưng hoạt động" },
  ];

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      const initial = fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData(data);
    setSelectedFile(null);
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
              value={
                statusOptions.find((option) => option.value === formData.status)
                  ?.value
              }
              disabled={!isEditing}
              onChange={(value) => handleChange("status", value)}
            >
              {statusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  <span
                    style={{
                      color: option.value === 1 ? "green" : "red",
                    //   fontWeight: 400,
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
        {fields.map((field) => {
          if (field.type === "text") {
            return (
              <Input
                key={field.name}
                placeholder={field.label}
                value={formData[field.name] || ""}
                disabled={!isEditing}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            );
          }
          if (field.type === "textarea") {
            return (
              <Input.TextArea
                key={field.name}
                placeholder={field.label}
                value={formData[field.name] || ""}
                disabled={!isEditing}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            );
          }
          if (field.type === "image") {
            return (
              <div key={field.name} style={{ textAlign: "center" }}>
                <Image
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : formData[field.name] || ""
                  }
                  alt={field.label}
                  style={{ maxWidth: "100%", maxHeight: 200 }}
                />
                {isEditing && (
                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                      setSelectedFile(file);
                      return false; // không upload tự động
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
              onClick={handleCancelEdit}
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
