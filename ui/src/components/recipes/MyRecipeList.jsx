import React, { useEffect, useState } from 'react';
import { Table, Button, Image, Tag, Rate, Space } from 'antd';
import { StopOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HeartOutlined, EyeFilled } from "@ant-design/icons";
import { filterRecipes } from '../../api/recipe';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ChatLauncher from '../common/chatbot/ChatLauncher';
import ScrollToTopButton from '../common/ScrollToTopButton';
import { fetchAllCategories } from "../../api/category";

const MyRecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [sort, setSort] = useState("id,desc");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRecipes = async () => {
            setLoading(true);
            try {
                const currentUser = JSON.parse(localStorage.getItem('user'))?.user;
                if (!currentUser) {
                    navigate('/login');
                    return;
                }

                const response = await filterRecipes({
                    keyword: '',
                    categoryIds: [],
                    ingredientIds: [],
                    authorUsernames: [currentUser.username],
                    status: -1,
                    page: 0,
                    size: 10,
                    sort: 'createdAt,desc',
                });

                setRecipes(response.data);
                setTotal(response.total);

                const categoriesResponse = await fetchAllCategories();
                setCategories(categoriesResponse.data);
            } catch (error) {
                toast.error(error.message || 'Lỗi khi tải danh sách công thức');
            } finally {
                setLoading(false);
            }
        };

        fetchMyRecipes();
    }, [navigate]);

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => (page - 1) * size + index + 1,
            width: 80,
        },
        {
            title: "Hình ảnh",
            dataIndex: "imgUrl",
            key: "imgUrl",
            render: (imgUrl) => (
                <Image
                    width={60}
                    height={60}
                    src={imgUrl}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
            ),
            width: 100,
        },
        {
            title: "Tên công thức",
            dataIndex: "title",
            key: "title",
            render: (title) => (
                <div style={{ fontWeight: 600, color: '#1890ff', maxWidth: 200 }}>
                    {title}
                </div>
            ),
        },
        {
            title: "Danh mục",
            dataIndex: "categoryId",
            key: "categoryId",
            render: (categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return (
                    <Tag color="blue">
                        {category?.name || "Không phân loại"}
                    </Tag>
                );
            }
        },
        {
            title: "Đánh giá",
            key: "rating",
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* hiển thị sao trung bình */}
                    <Rate
                        disabled
                        value={record.averageRating.toFixed(1) || 0}
                        style={{ fontSize: 12 }}
                    />
                    {/* hiển thị số điểm & tổng lượt */}
                    <span style={{ fontSize: 12, color: '#666' }}>
                        ({record.totalReview} lượt)
                    </span>
                </div>
            ),
        },
        {
            title: "Lượt thích",
            dataIndex: "totalFavorite",
            key: "totalFavorite",
            render: (count) => (
                <div style={{ color: '#a50034', fontWeight: 500 }}>
                    <HeartOutlined /> {' '}
                    {count ? `${count} lượt thích` : "Chưa có lượt thích"}
                </div>
            ),
        },
        {
            title: "Lượt xem",
            dataIndex: "viewCount",
            key: "viewCount",
            render: (count) => (
                <div style={{ fontWeight: 500 }}>
                    <EyeOutlined /> {' '}
                    {count ? `${count} lượt xem` : "Chưa có lượt xem"}
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === 1 ? "green" : "red"}>
                    {status === 1 ? "Hoạt động" : "Ngưng hoạt động"}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeFilled />}
                        onClick={() => navigate(`/recipes/${record.id}`)}
                    >
                        Xem
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/recipes/edit/${record.id}`)}
                    >
                        Sửa
                    </Button>
                </Space>
            ),
            width: 200,
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Danh sách công thức của tôi</h1>
            <Table
                columns={columns}
                dataSource={recipes}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
            <ScrollToTopButton />
            <ChatLauncher />
        </div>
    );
};

export default MyRecipeList;
