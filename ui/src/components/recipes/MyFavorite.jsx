import React, { useEffect, useState } from "react";
import { Table, Button, Image, Tag, Rate, Space, Spin, Empty } from "antd";
import { EyeFilled, HeartOutlined } from "@ant-design/icons";
import { getFavoriteRecipes } from "../../api/recipe";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChatLauncher from "../common/chatbot/ChatLauncher";
import ScrollToTopButton from "../common/ScrollToTopButton";
import { FaArrowLeft } from "react-icons/fa";
import { addFavorite } from "../../api/user";

export default function MyFavorite() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const data = await getFavoriteRecipes({
                page: page - 1,
                size: pageSize,
                sort: "id,desc",
            });
            setFavorites(data.data || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error("Error fetching favorite recipes:", err);
            toast.error("Lỗi khi tải danh sách yêu thích");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [page, pageSize]);

    const handleRemoveFavorite = async (id) => {
        try {
            await addFavorite(id); // Assuming this toggles the favorite status
            toast.success("Đã bỏ yêu thích thành công");
            fetchFavorites(); // Refresh the list after removing
        } catch (err) {
            toast.error("Lỗi khi bỏ yêu thích");
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
            width: 70,
        },
        {
            title: "Hình ảnh",
            dataIndex: "imgUrl",
            key: "imgUrl",
            render: (imgUrl) => (
                <Image
                    width={60}
                    height={60}
                    src={imgUrl || "https://via.placeholder.com/60x60?text=No+Image"}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                />
            ),
            width: 100,
        },
        {
            title: "Tên công thức",
            dataIndex: "title",
            key: "title",
            render: (title) => (
                <div style={{ fontWeight: 600, color: "#1890ff", maxWidth: 200 }}>
                    {title}
                </div>
            ),
            width: 200,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            width: 250,
        },
        {
            title: "Đánh giá",
            key: "rating",
            render: (_, record) => (
                <Rate disabled value={record.averageRating || 0} style={{ fontSize: 12 }} />
            ),
            width: 120,
        },
        {
            title: "Lượt thích",
            dataIndex: "totalFavorite",
            key: "totalFavorite",
            render: (count) => (
                <div style={{ color: "#a50034", fontWeight: 500 }}>
                    <HeartOutlined /> {count || 0}
                </div>
            ),
            width: 100,
        },
        {
            title: "Lượt xem",
            dataIndex: "viewCount",
            key: "viewCount",
            render: (count) => count || 0,
            width: 100,
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
                        Chi tiết
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        onClick={() => handleRemoveFavorite(record.id)}
                    >
                        Bỏ yêu thích
                    </Button>
                </Space>
            ),
            width: 180,
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ textAlign: "center", fontWeight: 600, color: "#a50034" }}>Công thức yêu thích của tôi</h1>
            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : favorites.length > 0 ? (
                <>
                    <Link to="/recipes" className="back-button" onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                        Quay lại
                    </Link>
                    <Table
                        columns={columns}
                        dataSource={favorites}
                        rowKey="id"
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: total,
                            onChange: (p, s) => {
                                setPage(p);
                                setPageSize(s);
                            },
                            showSizeChanger: true,
                            showTotal: (total) => `${total} công thức`,
                        }}
                    />
                </>
            ) : (
                <Empty description="Không có công thức yêu thích nào" />
            )}
            <ScrollToTopButton />
            <ChatLauncher />
        </div>
    );
}
