import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile, getUserProfile } from '../../api/user';
import { toast } from 'react-toastify';
import './EditProfile.css';
import ScrollToTopButton from '../common/ScrollToTopButton';
import ChatLauncher from '../common/chatbot/ChatLauncher';

const EditProfile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user'))?.user;
        if (!currentUser) {
          navigate('/login');
          return;
        }

        const response = await getUserProfile(currentUser.username);
        const userData = response.data;

        form.setFieldsValue({
          fullName: userData.fullName,
          email: userData.email,
          description: userData.description,
        });

        if (userData.imgUrl) {
          setPreviewImage(userData.imgUrl);
        }
      } catch (error) {
        toast.error('Không thể tải thông tin người dùng');
      }
    };

    fetchUserData();
  }, [form, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'))?.user;
      
      // Tạo object với thông tin mới từ form
      const updatedUser = {
        username: currentUser.username,
        email: values.email || currentUser.email,
        fullName: values.fullName,
        description: values.description
      };

      const response = await updateUserProfile(updatedUser, imageFile);
      
      if (response.success && response.code === 200) {
        toast.success('Cập nhật thông tin thành công!');
        // Cập nhật lại thông tin user trong localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        user.user = { ...user.user, ...response.data };
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));
        // navigate(-1);
      } else {
        toast.error(response?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
      }
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Sửa thông tin cá nhân</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="edit-profile-form"
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input required={false} placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <Input.TextArea
              rows={4}
              placeholder="Giới thiệu về bản thân"
            />
          </Form.Item>

          <Form.Item label="Ảnh đại diện">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '10px' }}
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginTop: '10px'
                }}
              />
            )}
          </Form.Item>

          <div className="button-group">
            <Button onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </div>
      <ScrollToTopButton />
      <ChatLauncher />
    </div>
  );
};

export default EditProfile;
