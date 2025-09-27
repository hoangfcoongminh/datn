import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Space,
  Card,
  Image,
  Row,
  Col,
} from "antd";
import { fetchAllCategories } from "../../api/category";
import { fetchIngredients } from "../../api/ingredient";
import { fetchUnits } from "../../api/unit";
import { getRecipeDetail, updateRecipe } from "../../api/recipe";
import { toast } from "react-toastify";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import "./AddRecipePage.css";
import ScrollToTopButton from "../common/ScrollToTopButton";

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
  const [imagePreview, setImagePreview] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [imageFileDetail, setImageFileDetail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [preVideoFile, setPreVideoFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [{ data: recipe }, { data: cats }, { data: ings }, { data: uns }] = await Promise.all([
          getRecipeDetail(id),
          fetchAllCategories(),
          fetchIngredients(),
          fetchUnits(),
        ]);

        setImageFileDetail(recipe.imgUrl);
        if (!user || recipe.authorId !== user.id) {
          setCanEdit(false);
          setError("Bạn không có quyền sửa công thức này.");
        } else {
          setCanEdit(true);
          // Đổ dữ liệu vào form, chỉ khi form đã mount và recipe hợp lệ
          if (form && recipe) {
            form.setFieldsValue({
              ...recipe,
              ingredients: (recipe.recipeIngredients || []).map((ing) => ({
                ingredientId: ing.ingredientId,
                actualUnitId: ing.actualUnitId,
                quantity: ing.quantity,
              })),
              steps: (recipe.recipeSteps || [])
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step) => ({
                  stepInstruction: step.stepInstruction,
                })),
            });
          }
        }
        setCategories(cats || []);
        setIngredients(ings || []);
        setUnits(uns || []);

      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu.");
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
      const user = JSON.parse(localStorage.getItem("user"));
      const recipe = {
        id: Number(id),
        categoryId: values.categoryId,
        authorUsername: user?.username,
        title: values.title,
        description: values.description,
        prepTime: values.prepTime,
        cookTime: values.cookTime,
        servings: values.servings,
        status: values.status,
        ingredients: (values.ingredients || []).map((ing) => ({
          ingredientId: ing.ingredientId,
          actualUnitId: ing.actualUnitId,
          quantity: ing.quantity,
        })),
        steps: (values.steps || []).map((step, idx) => ({
          stepNumber: idx + 1,
          stepInstruction: step.stepInstruction,
        })),
      };

      if (recipe.ingredients.length === 0) {
        toast.error("Vui lòng thêm ít nhất một nguyên liệu.");
        setLoading(false);
        return;
      }
      if (recipe.steps.length === 0) {
        toast.error("Vui lòng thêm ít nhất một bước nấu.");
        setLoading(false);
        return;
      }

      await updateRecipe(recipe, imageFile, videoFile);
      toast.success("Cập nhật công thức thành công!");
      if (values.status === 1) {
        user.user.role === 'ADMIN' ? navigate('/admin/recipes') : navigate(-1);
      } else if (values.status === 0) {
        user.user.role === 'ADMIN' ? navigate('/admin/recipes') : navigate('/recipes/my-recipes');
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật công thức.");
      toast.error(err.message || "Có lỗi xảy ra khi cập nhật công thức.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !canEdit)
    return <div style={{ color: "red", padding: 32 }}>{error}</div>;

  return (
    <div
      className="edit-recipe-page"
      style={{ maxWidth: 900, margin: "0 auto", padding: 24, borderRadius: 10 }}
    >
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Nút quay lại bên trái */}
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: 90 }}
              onClick={() => navigate(-1)}
            >
              Quay về
            </Button>

            {/* Title ở giữa */}
            <h1
              style={{
                flex: 1,
                textAlign: "center",
                fontWeight: "bold",
                color: "#a50034",
              }}
            >
              Sửa công thức
            </h1>

            {/* Chừa 1 khoảng trống bên phải để giữ cân đối */}
            <span style={{ width: "120px" }}></span>
          </div>
        }
      >
        <Form layout="vertical" form={form} onFinish={handleFinish}>
          <Form.Item name="status" required>
            <Select
              placeholder="Chọn trạng thái"
              style={{ width: 160, float: "right" }}
              dropdownStyle={{ textAlign: "left" }}
            >
              <Option value={1} style={{ color: "green" }}>Hoạt động</Option>
              <Option value={0} style={{ color: "red" }}>Ngưng hoạt động</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Tên công thức" name="title" required>
            <Input placeholder="Nhập tên công thức" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về công thức" />
          </Form.Item>
          <Form.Item label="Danh mục" name="categoryId" required>
            <Select placeholder="Chọn danh mục">
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Thời gian chuẩn bị (giờ)" name="prepTime">
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: "100%" }}
                  placeholder="Nhập số giờ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời gian nấu (giờ)" name="cookTime">
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: "100%" }}
                  placeholder="Nhập số giờ"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Số người ăn" name="servings">
            <InputNumber
              min={1}
              style={{ width: "50%" }}
              placeholder="Nhập số người"
            />
          </Form.Item>
          {/* Ảnh minh họa */}
          <Form.Item label="Ảnh minh họa" name="imageFile" valuePropName="file">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                setImageFile(file || null);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setImagePreview(ev.target.result);
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
              }}
              style={{ borderRadius: 8, width: "35%" }}
            />
          </Form.Item>

          {(imagePreview || imageFileDetail) && (
            <div style={{ textAlign: "center" }}>
              <Image
                src={imagePreview || imageFileDetail}
                preview={true}
                width={"50%"}
                style={{ width: "80%", borderRadius: 8 }}
              />
            </div>
          )}
          {/* Video upload field */}
          <Form.Item label="Video hướng dẫn (tùy chọn)" name="videoFile">
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setVideoFile(file);
                  const reader = new FileReader();
                  reader.onload = (ev) => setPreVideoFile(ev.target.result);
                  reader.readAsDataURL(file);
                } else {
                  setVideoFile(null);
                  setPreVideoFile(null);
                }
              }}
              style={{ borderRadius: 8, width: "35%" }}
            />
          </Form.Item>

          {videoFile && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <video
                src={preVideoFile}
                controls
                style={{ width: "80%", borderRadius: 8 }}
              />
            </div>
          )}
          {/* Ingredient List */}
          <Form.List name="ingredients">
            {(fields, { add, remove }) => (
              <div>
                <label>
                  <b>Nguyên liệu</b>
                </label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "ingredientId"]}
                      rules={[{ required: true, message: "Chọn nguyên liệu" }]}
                      style={{ minWidth: 180 }}
                    >
                      <Select placeholder="Nguyên liệu">
                        {ingredients.map((ing) => (
                          <Option key={ing.id} value={ing.id}>
                            {ing.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "actualUnitId"]}
                      rules={[{ required: true, message: "Chọn đơn vị" }]}
                      style={{ minWidth: 120 }}
                    >
                      <Select placeholder="Đơn vị">
                        {units.map((unit) => (
                          <Option key={unit.id} value={unit.id}>
                            {unit.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      rules={[{ required: true, message: "Nhập số lượng" }]}
                      style={{ minWidth: 100 }}
                    >
                      <InputNumber min={0} step={0.01} placeholder="Số lượng" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" style={{ width: '20%' }} onClick={() => add()} block>
                  + Thêm nguyên liệu
                </Button>
              </div>
            )}
          </Form.List>
          {/* Step List */}
          <Form.List name="steps">
            {(fields, { add, remove }) => (
              <div style={{ marginTop: 24 }}>
                <label>
                  <b>Các bước nấu ăn</b>
                </label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 10,
                      width: "100%",
                    }}
                  >
                    <span style={{ minWidth: 80 }}>{`Bước ${name + 1}`}: </span>
                    <Form.Item
                      {...restField}
                      name={[name, "stepInstruction"]}
                      rules={[{ required: true, message: "Nhập hướng dẫn" }]}
                      style={{ flex: 1, marginBottom: 0, minWidth: 450 }}
                    >
                      <Input.TextArea
                        rows={1}
                        style={{ height: 50, padding: "5px 10px" }}
                        placeholder={`Bước ${name + 1}`}
                      />
                    </Form.Item>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      style={{ marginBottom: 0 }}
                    >
                      Xóa
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" style={{ width: '20%' }} onClick={() => add()} block>
                  + Thêm bước nấu
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ScrollToTopButton />
      <ChatLauncher />
    </div>
  );
};

export default EditRecipePage;
