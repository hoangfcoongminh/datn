SET NAMES utf8mb4;

USE cook_craft_db;
-- ========================
-- CATEGORIES
-- ========================
INSERT INTO categories (name, description, created_at, created_by, status, version)
VALUES 
  ('Món chính', 'Món chính trong bữa ăn', NOW(), 'system', 1, 0),
  ('Khai vị', 'Món ăn nhẹ trước bữa chính', NOW(), 'system', 1, 0),
  ('Tráng miệng', 'Món ngọt kết thúc bữa ăn', NOW(), 'system', 1, 0),
  ('Ăn vặt', 'Món ăn nhẹ lúc đói', NOW(), 'system', 1, 0),
  ('Thức uống', 'Các loại nước uống', NOW(), 'system', 1, 0);



-- ========================
-- UNITS
-- ========================
INSERT INTO units (name, created_at, created_by, status, version)
VALUES 
  ('gram', NOW(), 'system', 1, 0),
  ('ml', NOW(), 'system', 1, 0),
  ('muỗng cà phê', NOW(), 'system', 1, 0),
  ('muỗng canh', NOW(), 'system', 1, 0),
  ('trái', NOW(), 'system', 1, 0),
  ('cái', NOW(), 'system', 1, 0),
  ('gói', NOW(), 'system', 1, 0),
  ('miếng', NOW(), 'system', 1, 0),
  ('quả', NOW(), 'system', 1, 0),
  ('chén', NOW(), 'system', 1, 0);



-- ========================
-- INGREDIENTS
-- ========================
INSERT INTO ingredients (unit_id, name, created_at, created_by, status, version)
VALUES 
  (1, 'Bột mì', NOW(), 'system', 1, 0),
  (1, 'Đường', NOW(), 'system', 1, 0),
  (2, 'Sữa tươi', NOW(), 'system', 1, 0),
  (9, 'Trứng gà', NOW(), 'system', 1, 0),
  (3, 'Muối', NOW(), 'system', 1, 0),
  (2, 'Dầu ăn', NOW(), 'system', 1, 0),
  (9, 'Chuối', NOW(), 'system', 1, 0),
  (9, 'Cam', NOW(), 'system', 1, 0),
  (2, 'Nước lọc', NOW(), 'system', 1, 0),
  (1, 'Bột nở', NOW(), 'system', 1, 0),
  (7, 'Phô mai', NOW(), 'system', 1, 0),
  (5, 'Xúc xích', NOW(), 'system', 1, 0),
  (10, 'Tỏi băm', NOW(), 'system', 1, 0),
  (3, 'Nước tương', NOW(), 'system', 1, 0),
  (1, 'Thịt gà', NOW(), 'system', 1, 0),
  (9, 'Cà rốt', NOW(), 'system', 1, 0),
  (9, 'Hành tím', NOW(), 'system', 1, 0),
  (3, 'Tiêu', NOW(), 'system', 1, 0),
  (1, 'Bơ lạt', NOW(), 'system', 1, 0),
  (9, 'Khoai tây', NOW(), 'system', 1, 0);



-- ========================
-- RECIPES
-- ========================
INSERT INTO recipes (category_id, author_username, title, description, prep_time, cook_time, servings, created_at, created_by, status, version)
VALUES 
  (1, 1, 'Bánh kếp chuối', 'Bánh mềm xốp từ chuối', 0.25, 0.5, 2, NOW(), 'system', 1, 0),
  (2, 3, 'Sữa chua cam', 'Thức uống mát lạnh từ cam và sữa chua', 0.1, 0.0, 1, NOW(), 'system', 1, 0),
  (3, 4, 'Khoai tây chiên', 'Món ăn vặt đơn giản, giòn tan', 0.2, 0.3, 2, NOW(), 'system', 1, 0),
  (4, 2, 'Salad gà sốt mè', 'Salad thanh mát với gà xé và sốt mè', 0.3, 0.0, 2, NOW(), 'system', 1, 0),
  (5, 1, 'Cơm chiên trứng xúc xích', 'Món cơm chiên quen thuộc cho bữa sáng', 0.2, 0.4, 2, NOW(), 'system', 1, 0);



-- ========================
-- RECIPE INGREDIENT DETAILS
-- ========================
-- Recipe 1: Bánh kếp chuối
INSERT INTO recipe_ingredient_details (recipe_id, ingredient_id, actual_unit_id, quantity, created_at, created_by, status, version)
VALUES 
  (1, 1, 1, 100, NOW(), 'system', 1, 0),
  (1, 2, 1, 30, NOW(), 'system', 1, 0),
  (1, 3, 2, 100, NOW(), 'system', 1, 0),
  (1, 4, 6, 1, NOW(), 'system', 1, 0),
  (1, 7, 9, 1, NOW(), 'system', 1, 0),

  (2, 2, 3, 100, NOW(), 'system', 1, 0),
  (2, 2, 8, 1, NOW(), 'system', 1, 0),

  (3, 3, 20, 6, NOW(), 'system', 1, 0),
  (3, 3, 6, 4, NOW(), 'system', 1, 0),
  (3, 5, 3, 1, NOW(), 'system', 1, 0),

  (1, 15, 1, 150, NOW(), 'system', 1, 0),
  (1, 16, 1, 50, NOW(), 'system', 1, 0),
  (1, 13, 3, 1, NOW(), 'system', 1, 0),
  (1, 14, 2, 30, NOW(), 'system', 1, 0),

  (5, 4, 6, 1, NOW(), 'system', 1, 0),
  (5, 12, 6, 2, NOW(), 'system', 1, 0),
  (5, 17, 1, 30, NOW(), 'system', 1, 0),
  (5, 6, 4, 1, NOW(), 'system', 1, 0);



-- ========================
-- RECIPE STEPS
-- ========================
-- Recipe 1
INSERT INTO recipe_steps(recipe_id, step_number, step_instruction, created_at, created_by, status, version) VALUES
  (1, 1, 'Nghiền chuối chín', NOW(), 'system', 1, 0),
  (1, 2, 'Trộn bột mì, đường, sữa và trứng vào chuối', NOW(), 'system', 1, 0),
  (1, 3, 'Chiên bánh trên chảo chống dính đến vàng 2 mặt', NOW(), 'system', 1, 0),

  (2, 1, 'Vắt nước cam', NOW(), 'system', 1, 0),
  (2, 2, 'Trộn sữa chua và nước cam', NOW(), 'system', 1, 0),

  (3, 1, 'Gọt khoai, cắt miếng dài và ngâm nước muối', NOW(), 'system', 1, 0),
  (3, 2, 'Chiên khoai trong dầu sôi đến khi vàng', NOW(), 'system', 1, 0),

  (4, 1, 'Luộc thịt gà và xé sợi', NOW(), 'system', 1, 0),
  (4, 2, 'Trộn các nguyên liệu với sốt mè và tỏi', NOW(), 'system', 1, 0),

  (5, 1, 'Phi hành với dầu ăn cho thơm', NOW(), 'system', 1, 0),
  (5, 2, 'Thêm xúc xích và trứng đảo đều', NOW(), 'system', 1, 0),
  (5, 3, 'Cho cơm vào chiên cùng, nêm nếm gia vị vừa ăn', NOW(), 'system', 1, 0);
  
 
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE recipe_steps;
TRUNCATE TABLE recipe_ingredient_details;
TRUNCATE TABLE recipes;
TRUNCATE TABLE ingredients;
TRUNCATE TABLE units;
TRUNCATE TABLE categories;

SET FOREIGN_KEY_CHECKS = 1;


