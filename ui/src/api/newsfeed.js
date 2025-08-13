// Dummy API for NewsFeed
export async function getNewsFeed() {
  // Replace with real API call
  return [
    {
      id: 1,
      authorId: 101,
      authorName: "Nguyen Van A",
      authorImgUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "Hôm nay mình vừa thử công thức mới rất ngon!",
      imgUrl: "https://via.placeholder.com/180x120?text=Post+Image",
      createdAt: "12:30 13-08-2025"
    },
    {
      id: 2,
      authorId: 102,
      authorName: "Tran Thi B",
      authorImgUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      content: "Ai có mẹo nấu ăn nhanh không?",
      imgUrl: "",
      createdAt: "09:15 13-08-2025"
    }
  ];
}
