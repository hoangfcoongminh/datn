
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { fetchAllCategories, updateCategory } from '../../api/category';

const EditCategoryPage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategory() {
      setLoading(true);
      setError(null);
      try {
        // Có thể dùng fetchAllCategories hoặc fetchCategories để lấy danh mục, sau đó tìm theo id
        const allCats = await fetchAllCategories();
        const found = Array.isArray(allCats) ? allCats.find(cat => String(cat.id) === String(id)) : null;
        if (!found) throw new Error('Không tìm thấy danh mục');
        setCategory(found);
        form.setFieldsValue({ name: found.name, description: found.description });
      } catch (err) {
        setError(err.message || 'Lỗi khi tải danh mục');
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
    // eslint-disable-next-line
  }, [id]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await updateCategory({ id, name: values.name, description: values.description, status: 1 });
      message.success('Cập nhật danh mục thành công!');
      navigate('/categories');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) return <div style={{ padding: 32 }}>Đang tải dữ liệu...</div>;
  if (error && !category) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div className="edit-category-page" style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <Card title="Chỉnh sửa danh mục">
        <Form layout="vertical" form={form} onFinish={onFinish} initialValues={category}>
          <Form.Item label="Tên danh mục" name="name" rules={[{ required: true, message: 'Nhập tên danh mục' }]}> 
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về danh mục" />
          </Form.Item>
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCategoryPage;
