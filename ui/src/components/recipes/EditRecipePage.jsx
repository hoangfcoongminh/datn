import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Select, Space, Card } from 'antd';
import { fetchAllCategories } from '../../api/category';
import { fetchIngredients } from '../../api/ingredient';
import { fetchUnits } from '../../api/unit';
import { getRecipeDetail, updateRecipe } from '../../api/recipe';

const { Option } = Select;

const EditRecipePage = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [recipe, cats, ings, uns] = await Promise.all([
          getRecipeDetail(id),
          fetchAllCategories(),
          fetchIngredients(),
          fetchUnits()
        ]);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || recipe.authorId !== user.id) {
          setCanEdit(false);
          setError('Bạn không có quyền sửa công thức này.');
        } else {
          setCanEdit(true);
          // Đổ dữ liệu vào form, chỉ khi form đã mount và recipe hợp lệ
          if (form && recipe) {
            form.setFieldsValue({
              ...recipe,
              ingredients: (recipe.recipeIngredients || []).map(ing => ({
                ingredientId: ing.ingredientId,
                actualUnitId: ing.actualUnitId,
                quantity: ing.quantity
              })),
              steps: (recipe.recipeSteps || []).sort((a, b) => a.stepNumber - b.stepNumber).map(step => ({
                stepInstruction: step.stepInstruction
              }))
            });
          }
        }
        setCategories(Array.isArray(cats) ? cats : []);
        setIngredients(Array.isArray(ings) ? ings : []);
        setUnits(Array.isArray(uns) ? uns : []);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const handleFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const recipe = {
        id: Number(id),
        categoryId: values.categoryId,
        authorUsername: user?.username,
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
      await updateRecipe(recipe, imageFile);
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi cập nhật công thức.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Đang tải dữ liệu...</div>;
  if (error && !canEdit) return <div style={{ color: 'red', padding: 32 }}>{error}</div>;

  return (
    <div className="edit-recipe-page" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Card title={<span>Sửa công thức</span>} extra={<Link to={`/recipes/${id}`}>Quay lại chi tiết</Link>}>
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item label="Tên công thức" name="title" required>
            <Input placeholder="Nhập tên công thức" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về công thức" />
          </Form.Item>
          <Form.Item label="Danh mục" name="categoryId" required>
            <Select placeholder="Chọn danh mục">
              {Array.isArray(categories) && categories.map(cat => (
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
          <Form.Item label="Ảnh minh họa mới (nếu muốn thay đổi)" name="imgFile">
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
            <Button type="primary" htmlType="submit" loading={loading}>Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditRecipePage; 