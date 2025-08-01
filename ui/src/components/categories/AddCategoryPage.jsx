import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { addCategory } from "../../api/category";
import { toast } from "react-toastify";

const AddCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await addCategory({ name: values.name, description: values.description });
      toast.success("Thêm danh mục thành công!");
      navigate("/categories");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra.");
      toast.error(err.message || "Có lỗi xảy ra khi thêm danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: 500, maxWidth: "100%" }}>
        <div style={{ marginBottom: 8 }}>
          <Link to="/categories">
            <Button
              type="text"
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 18,
                padding: 10,
                background: "#a50034",
                marginBottom: 14,
                borderRadius: 8,
              }}
            >
              Quay lại Danh sách
            </Button>
          </Link>
        </div>
        <Card
          style={{ borderRadius: 18, boxShadow: "0 2px 16px #fbe0ea" }}
          styles={{ body: { padding: 32 } }}
          title={
            <div style={{ textAlign: "center", width: "100%" }}>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#a50034",
                  letterSpacing: 1,
                }}
              >
                Thêm danh mục mới
              </span>
            </div>
          }
        >
          <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
            <Form.Item
              label={
                <span style={{ color: "#a50034", fontWeight: 600 }}>
                  Tên danh mục
                </span>
              }
              name="name"
              rules={[{ required: true, message: "Nhập tên danh mục" }]}
            >
              <Input
                placeholder="Nhập tên danh mục"
                style={{ fontWeight: 500, fontSize: 16 }}
              />
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: "#a50034", fontWeight: 600, marginTop: 10 }}>Mô tả</span>
              }
              name="description"
            >
              <Input.TextArea
                rows={3}
                placeholder="Mô tả ngắn về danh mục"
                style={{ fontSize: 15 }}
              />
            </Form.Item>
            {error && (
              <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
            )}
            <Form.Item style={{ marginTop: 24, textAlign: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: "#a50034",
                  borderColor: "#a50034",
                  fontWeight: 600,
                  fontSize: 16,
                  minWidth: 120,
                  borderRadius: 8,
                }}
              >
                Thêm mới
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddCategoryPage;
