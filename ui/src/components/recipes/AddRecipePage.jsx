import React, { useState, useEffect } from 'react';
import { Select, Input, InputNumber, Button, Form, Space, Card, Upload, message } from 'antd';
import { fetchAllCategories } from '../../api/category';
import { fetchIngredients } from '../../api/ingredient';
import { fetchUnits } from '../../api/unit';
import { Link, useNavigate } from 'react-router-dom';
import { createRecipe } from '../../api/recipe';
import { toast } from 'react-toastify';

const { Option } = Select;

const AddRecipePage = () => {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchAllCategories().then(setCategories).catch(() => setCategories([]));
    fetchIngredients().then(setIngredients).catch(() => setIngredients([]));
    fetchUnits().then(setUnits).catch(() => setUnits([]));
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const recipe = {
        categoryId: values.categoryId,
        authorUsername: user?.user.username || 'system',
        title: values.title,
        description: values.description,
        prepTime: values.prepTime,
        cookTime: values.cookTime,
        servings: values.servings,
        // imgUrl sẽ được backend xử lý từ file upload
        ingredients: (values.ingredients || []).map(ing => ({
          ingredientId: ing.ingredientId,
          actualUnitId: ing.actualUnitId,
          quantity: ing.quantity
        })),
        steps: (values.steps || []).map((step, idx) => ({
          stepNumber: idx + 1,
          stepInstruction: step.stepInstruction
        }))
      };
      await createRecipe(recipe, imageFile);
      toast.success('Thêm công thức thành công!');
      navigate('/recipes');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu công thức.');
      toast.error(err.message || 'Có lỗi xảy ra khi lưu công thức.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-page" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Card title={<span>Thêm công thức mới</span>} extra={<Link to="/recipes">Quay lại danh sách</Link>}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item label="Tên công thức" name="title" required>
            <Input placeholder="Nhập tên công thức" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về công thức" />
          </Form.Item>
          <Form.Item label="Danh mục" name="categoryId" required>
            <Select placeholder="Chọn danh mục">
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Thời gian chuẩn bị (giờ)" name="prepTime">
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Nhập số giờ" />
          </Form.Item>
          <Form.Item label="Thời gian nấu (giờ)" name="cookTime">
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Nhập số giờ" />
          </Form.Item>
          <Form.Item label="Số người ăn" name="servings">
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số người" />
          </Form.Item>
          {/* Ảnh minh họa */}
          <Form.Item label="Ảnh minh họa" name="imgFile">
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                } else {
                  setImageFile(null);
                }
              }}
            />
          </Form.Item>

          {/* Ingredient List */}
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <div>
                <label><b>Nguyên liệu</b></label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'ingredientId']} rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
                      style={{ minWidth: 180 }}>
                      <Select placeholder="Nguyên liệu">
                        {ingredients.map(ing => (
                          <Option key={ing.id} value={ing.id}>{ing.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'actualUnitId']} rules={[{ required: true, message: 'Chọn đơn vị' }]}
                      style={{ minWidth: 120 }}>
                      <Select placeholder="Đơn vị">
                        {units.map(unit => (
                          <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'quantity']} rules={[{ required: true, message: 'Nhập số lượng' }]}
                      style={{ minWidth: 100 }}>
                      <InputNumber min={0} step={0.01} placeholder="Số lượng" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm nguyên liệu
                </Button>
              </div>
            )}
          </Form.List>

          {/* Step List */}
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <div style={{ marginTop: 24 }}>
                <label><b>Các bước nấu ăn</b></label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item {...restField} name={[name, 'stepInstruction']} rules={[{ required: true, message: 'Nhập hướng dẫn' }]}
                      style={{ minWidth: 300 }}>
                      <Input.TextArea rows={1} placeholder={`Bước ${name + 1}`} />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm bước nấu
                </Button>
              </div>
            )}
          </Form.List>

          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <Form.Item style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={loading}>Lưu công thức</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddRecipePage; 