import json
import requests
import os
from dotenv import load_dotenv

# Load biến môi trường
load_dotenv(dotenv_path="config.env", override=True)

LOGIN_URL = os.getenv("LOGIN_URL")
DATA_URL = os.getenv("DATA_URL")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")

def get_token():
    print("🔍 Đang lấy JWT token...")
    response = requests.post(LOGIN_URL, json={"username": USERNAME, "password": PASSWORD})
    
    if response.status_code == 200:
        body = response.json()
        if body.get('success') and body.get('code') == 200:
            token = body.get('data', {}).get('token')
            if token:
                print("✅ Lấy token thành công!")
                return token
    print(f"❌ Không lấy được token! Message: {response.json().get('message', 'Không rõ lý do')}")
    return None

def fetch_data(token):
    print(f"🔍 Đang gọi API dữ liệu: {DATA_URL}")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.get(DATA_URL, headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Lỗi HTTP khi gọi API! Message: {response.json().get('message', 'Không rõ lý do')}")
        return []
    
    try:
        body = response.json()
    except json.JSONDecodeError:
        print("❌ Không đọc được JSON từ API!")
        return []
    
    if body.get('success') and body.get('code') == 200 and 'data' in body:
        print("✅ Lấy dữ liệu thành công từ trường 'data'")
        return body['data']
    else:
        print("❌ API trả về không hợp lệ hoặc không thành công!")
        return []

def normalize_data(data):
    normalized_data = []

    for recipe in data:
        recipe_id = recipe.get('id')
        title = recipe.get('title', '').strip()
        description = recipe.get('description', '').strip() if recipe.get('description') else ""
        category = recipe.get('category', '').strip() if recipe.get('category') else "Khác"
        prep_time = int(recipe.get('prepTime', 0)) if recipe.get('prepTime') else 0
        cook_time = int(recipe.get('cookTime', 0)) if recipe.get('cookTime') else 0
        servings = int(recipe.get('servings', 0)) if recipe.get('servings') else 0

        ingredients = []
        if 'ingredients' in recipe and isinstance(recipe['ingredients'], list):
            for ing in recipe['ingredients']:
                name = ing.get('name', '').strip()
                quantity = float(ing.get('quantity', 0)) if ing.get('quantity') else 0
                unit = ing.get('unit', '').strip()
                if name:
                    ingredients.append({
                        "name": name,
                        "quantity": quantity,
                        "unit": unit
                    })

        steps = []
        if 'steps' in recipe and isinstance(recipe['steps'], list):
            for step in recipe['steps']:
                step_text = str(step).strip()
                if step_text:
                    steps.append(step_text)

        normalized_data.append({
            "id": recipe_id,
            "title": title,
            "description": description,
            "category": category,
            "prepTime": prep_time,
            "cookTime": cook_time,
            "servings": servings,
            "ingredients": ingredients,
            "steps": steps
        })

    return normalized_data

def save_to_file(data, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✅ Chuẩn hóa xong! File đã lưu tại: {output_file}")

if __name__ == "__main__":
    token = get_token()
    if not token:
        print("❌ Không thể lấy token. Dừng chương trình!")
        exit()

    raw_data = fetch_data(token)
    if raw_data:
        normalized = normalize_data(raw_data)
        save_to_file(normalized, "recipes_clean.json")
    else:
        print("❌ Không có dữ liệu để xử lý!")
