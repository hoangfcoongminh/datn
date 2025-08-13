// Dummy API for NewsFeed extra sections
export async function getPopularRecipes() {
  return [
    { id: 1, title: "Bún bò Huế", imgUrl: "https://via.placeholder.com/120x80?text=Bun+Bo", favorite: 120 },
    { id: 2, title: "Phở Hà Nội", imgUrl: "https://via.placeholder.com/120x80?text=Pho", favorite: 110 },
    { id: 3, title: "Bánh mì", imgUrl: "https://via.placeholder.com/120x80?text=Banh+Mi", favorite: 95 },
  ];
}
export async function getMostFavoriteRecipes() {
  return [
    { id: 4, title: "Gỏi cuốn", imgUrl: "https://via.placeholder.com/120x80?text=Goi+Cuon", favorite: 150 },
    { id: 5, title: "Cơm tấm", imgUrl: "https://via.placeholder.com/120x80?text=Com+Tam", favorite: 140 },
    { id: 6, title: "Chả giò", imgUrl: "https://via.placeholder.com/120x80?text=Cha+Gio", favorite: 130 },
  ];
}
export async function getTopUsersByFavorite() {
  return [
    { id: 101, name: "Nguyen Van A", imgUrl: "https://randomuser.me/api/portraits/men/32.jpg", totalFavorite: 320 },
    { id: 102, name: "Tran Thi B", imgUrl: "https://randomuser.me/api/portraits/women/44.jpg", totalFavorite: 280 },
    { id: 103, name: "Le Van C", imgUrl: "https://randomuser.me/api/portraits/men/45.jpg", totalFavorite: 250 },
  ];
}
export async function getTopUsersByRating() {
  return [
    { id: 104, name: "Pham Thi D", imgUrl: "https://randomuser.me/api/portraits/women/55.jpg", totalRating: 98 },
    { id: 105, name: "Hoang Van E", imgUrl: "https://randomuser.me/api/portraits/men/66.jpg", totalRating: 90 },
    { id: 106, name: "Do Thi F", imgUrl: "https://randomuser.me/api/portraits/women/77.jpg", totalRating: 85 },
  ];
}
