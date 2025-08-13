# Cài thư viện
# !pip install mysql-connector-python sentence-transformers faiss-cpu pandas

import mysql.connector
import pandas as pd
from sentence_transformers import SentenceTransformer
import faiss

# ==== 1. Kết nối MySQL ====
conn = mysql.connector.connect(
    host="localhost",      # Hoặc IP/ngrok nếu remote
    port=3306,
    user="root",
    password="root",
    database="cook_craft_db"
)
cursor = conn.cursor(dictionary=True)

# ==== 2. Lấy dữ liệu recipes ====
cursor.execute("""
SELECT id, title, description, cook_time, prep_time, servings, category_id
FROM recipes
WHERE status = 1
""")
recipes = cursor.fetchall()
df = pd.DataFrame(recipes)

# ==== 3. Lấy nguyên liệu ====
cursor.execute("""
SELECT recipe_id, GROUP_CONCAT(name SEPARATOR ', ') AS ingredients
FROM ingredients
GROUP BY recipe_id
""")
ingredients_map = {row["recipe_id"]: row["ingredients"] for row in cursor.fetchall()}

# ==== 4. Lấy các bước ====
cursor.execute("""
SELECT recipe_id, GROUP_CONCAT(step_text ORDER BY step_number SEPARATOR ' -> ') AS steps
FROM steps
GROUP BY recipe_id
""")
steps_map = {row["recipe_id"]: row["steps"] for row in cursor.fetchall()}

# ==== 5. Build text đầy đủ ====
def build_recipe_text(recipe):
    ingr = ingredients_map.get(recipe['id'], "Không có dữ liệu")
    stps = steps_map.get(recipe['id'], "Không có dữ liệu")
    return f"""
    Tiêu đề: {recipe['title']}
    Mô tả: {recipe['description']}
    Nguyên liệu: {ingr}
    Các bước: {stps}
    Thời gian chuẩn bị: {recipe['prep_time']} phút
    Thời gian nấu: {recipe['cook_time']} phút
    Khẩu phần: {recipe['servings']}
    """

df["full_text"] = df.apply(build_recipe_text, axis=1)

# ==== 6. Load model embeddings (nhẹ, đa ngôn ngữ) ====
print("🔄 Đang load model embeddings...")
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# ==== 7. Encode dữ liệu ====
print("🔄 Đang encode dữ liệu...")
embeddings = model.encode(df["full_text"].tolist(), convert_to_numpy=True)

# ==== 8. Tạo FAISS index ====
dim = embeddings.shape[1]
index = faiss.IndexFlatL2(dim)
index.add(embeddings)

# ==== 9. Lưu index & data ====
faiss.write_index(index, "recipes.index")
df.to_pickle("recipes.pkl")

print("✅ Đã train xong! Lưu recipes.index & recipes.pkl thành công.")

# ==== 10. Đóng kết nối ====
cursor.close()
conn.close()
