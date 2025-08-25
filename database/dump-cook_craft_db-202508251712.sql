-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: cook_craft_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'2025-08-04 10:10:10.000000','system',NULL,NULL,1,0,'Món chính trong bữa ăn','Món chính','http://localhost:9000/images/default-category.jpg'),(2,'2025-08-04 10:10:10.000000','system',NULL,NULL,1,0,'Món ăn nhẹ trước bữa chính','Khai vị','http://localhost:9000/images/default-category.jpg'),(3,'2025-08-04 10:10:10.000000','system',NULL,NULL,1,0,'Món ngọt kết thúc bữa ăn','Tráng miệng','http://localhost:9000/images/default-category.jpg'),(4,'2025-08-04 10:10:10.000000','system',NULL,NULL,1,0,'Món ăn nhẹ lúc đói','Ăn vặt','http://localhost:9000/images/default-category.jpg'),(5,'2025-08-04 10:10:10.000000','system',NULL,NULL,1,0,'Các loại nước uống','Thức uống','http://localhost:9000/images/default-category.jpg'),(6,'2025-08-05 10:44:05.348732','1','2025-08-05 10:49:04.544052','1',0,1,'5','5','http://localhost:9000/images/default-category.jpg'),(7,'2025-08-05 10:59:10.641774','1','2025-08-05 10:59:10.641774','1',1,0,'5','5','http://localhost:9000/images/default-category.jpg'),(8,'2025-08-05 11:00:06.698690','1','2025-08-05 11:00:06.698690','1',1,0,'2','2','http://localhost:9000/images/default-ingredient.jpg'),(9,'2025-08-05 11:00:44.136966','1','2025-08-05 14:41:19.148022','1',0,3,'3            2                1','update               3           5','http://localhost:9000/images/iced-matcha-latte.jpg'),(10,'2025-08-05 11:20:54.802323','1','2025-08-05 11:20:54.802323','1',1,0,'','1','http://localhost:9000/images/iced-matcha-latte.jpg'),(11,'2025-08-05 15:09:12.272266','1','2025-08-05 15:09:59.088591','1',0,2,'1.5 11.6','1.5 1.6','http://localhost:9000/images/default-ingredient.jpg'),(12,'2025-08-06 13:09:31.407601','2','2025-08-06 13:09:31.407601','2',1,0,'FOR TEST','TEST CATEGORY','http://localhost:9000/images/default-category.jpg'),(13,'2025-08-13 09:24:52.814908','3','2025-08-13 09:24:52.814908','3',1,0,'Các món ăn cho bữa tối gia đình, hẹn hò, ...','Bữa tối','http://localhost:9000/images/default-category.jpg'),(14,'2025-08-13 09:28:49.507269','3','2025-08-13 09:28:49.507269','3',1,0,'Những món ăn healthy, tốt cho sức khỏe. Phù hợp với người muốn giảm cân, giữ dáng, ...','Healthy','http://localhost:9000/images/default-category.jpg'),(15,'2025-08-13 09:30:32.542828','3','2025-08-13 09:30:32.542828','3',1,0,'Những món nấu nhanh, đủ dinh dưỡng cho cả trẻ em và người lớn để khởi động một ngày làm việc hiệu quả.','Bữa sáng','http://localhost:9000/images/default-category.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKt6pu0r6ncht2r2b7y00xh4lw0` (`user_id`,`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,'2025-08-08 13:23:29.221716','2','2025-08-08 15:35:00.836622','2',1,30,1,2),(2,'2025-08-08 13:26:26.844625','6','2025-08-08 13:26:39.601029','6',1,2,2,8),(3,'2025-08-08 13:28:43.885416','2','2025-08-08 15:41:12.601577','2',1,8,3,2),(4,'2025-08-08 13:51:59.551825','2','2025-08-08 15:41:19.316456','2',1,4,5,2),(5,'2025-08-08 13:54:19.160540','2','2025-08-08 15:20:17.932695','2',0,9,4,2),(6,'2025-08-08 15:41:29.836407','1','2025-08-12 09:32:26.797879','1',0,1,5,1),(7,'2025-08-12 10:01:13.766620','1','2025-08-12 10:01:13.766620','1',1,0,6,1),(8,'2025-08-13 10:25:54.888837','3','2025-08-13 10:25:54.888837','3',1,0,4,3),(9,'2025-08-13 10:26:01.403919','3','2025-08-13 10:26:01.403919','3',1,0,6,3),(10,'2025-08-13 10:26:02.787693','3','2025-08-13 14:25:42.388971','3',1,10,8,3),(11,'2025-08-13 10:26:08.508363','3','2025-08-13 10:38:06.608483','3',0,1,3,3),(12,'2025-08-13 10:37:01.361237','3','2025-08-13 10:38:13.051849','3',1,2,5,3),(13,'2025-08-13 10:37:58.479586','3','2025-08-13 10:37:58.479586','3',1,0,2,3),(14,'2025-08-13 14:26:59.726985','3','2025-08-13 14:26:59.726985','3',1,0,1,3),(15,'2025-08-20 15:37:03.289682','1','2025-08-20 15:37:03.289682','1',1,0,2,1),(16,'2025-08-25 15:27:40.198111','hoangfcoongminh','2025-08-25 15:27:40.198111','hoangfcoongminh',1,0,9,9),(17,'2025-08-25 15:27:59.977074','hoangfcoongminh','2025-08-25 15:27:59.977074','hoangfcoongminh',1,0,4,9);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `unit_id` bigint DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Bột mì',1,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(2,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Đường',1,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(3,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Sữa tươi',2,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(4,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Trứng gà',9,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(5,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Muối',3,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(6,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Dầu ăn',2,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(7,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Chuối',9,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(8,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Cam',9,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(9,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Nước lọc',2,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(10,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Bột nở',1,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(11,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Phô mai',7,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(12,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Xúc xích',5,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(13,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Tỏi băm',10,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(14,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Nước tương',3,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(15,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Thịt gà',1,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(16,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Cà rốt',9,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(17,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Hành tím',9,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(18,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Tiêu',3,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(19,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Bơ lạt',1,NULL,'http://localhost:9000/images/default-ingredient.jpg'),(20,'2025-08-04 10:10:16.000000','system',NULL,NULL,1,0,'Khoai tây',9,NULL,'http://localhost:9000/images/default-ingredient.jpg');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredient_details`
--

DROP TABLE IF EXISTS `recipe_ingredient_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredient_details` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `actual_unit_id` bigint DEFAULT NULL,
  `ingredient_id` bigint DEFAULT NULL,
  `quantity` decimal(38,2) DEFAULT NULL,
  `recipe_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredient_details`
--

LOCK TABLES `recipe_ingredient_details` WRITE;
/*!40000 ALTER TABLE `recipe_ingredient_details` DISABLE KEYS */;
INSERT INTO `recipe_ingredient_details` VALUES (1,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,1,1,100.00,1),(2,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,1,2,30.00,1),(3,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,2,3,100.00,1),(4,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,6,4,1.00,1),(5,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,9,7,1.00,1),(6,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,3,2,100.00,2),(7,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,8,2,1.00,2),(8,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,20,3,6.00,3),(9,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,6,3,4.00,3),(10,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,3,5,1.00,3),(11,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,1,15,150.00,1),(12,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,1,16,50.00,1),(13,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,3,13,1.00,1),(14,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,2,14,30.00,1),(15,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,6,4,1.00,5),(16,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,6,12,2.00,5),(17,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,1,17,30.00,5),(18,'2025-08-04 10:10:25.000000','system',NULL,NULL,1,0,4,6,1.00,5),(19,'2025-08-08 14:09:11.687463','2','2025-08-08 14:09:11.687463','2',1,0,1,1,2.00,4),(20,'2025-08-08 14:09:11.711801','2','2025-08-08 14:09:11.711801','2',1,0,3,3,3.00,4),(21,'2025-08-12 09:49:16.371962','1','2025-08-12 09:49:16.371962','1',1,0,1,1,1.00,6),(22,'2025-08-12 09:49:16.386198','1','2025-08-12 09:49:16.386198','1',1,0,2,2,1.00,6),(23,'2025-08-12 09:49:16.394151','1','2025-08-12 09:49:16.394151','1',1,0,5,8,3.00,6),(25,'2025-08-12 15:40:16.565557','1','2025-08-12 15:40:16.565557','1',1,0,7,2,1.00,8),(26,'2025-08-19 09:33:27.947541','4','2025-08-19 09:33:27.947541','4',1,0,4,2,3.00,9),(27,'2025-08-19 09:33:27.967018','4','2025-08-19 09:33:27.967018','4',1,0,6,1,34.00,9),(28,'2025-08-19 09:33:27.977580','4','2025-08-19 09:33:27.977580','4',1,0,9,18,1.00,9),(29,'2025-08-25 15:34:23.112284','hoangfcoongminh','2025-08-25 15:34:23.112284','hoangfcoongminh',1,0,2,1,1.00,10),(30,'2025-08-25 15:34:23.121259','hoangfcoongminh','2025-08-25 15:34:23.121259','hoangfcoongminh',1,0,3,4,2.00,10),(31,'2025-08-25 15:34:23.127003','hoangfcoongminh','2025-08-25 15:34:23.127003','hoangfcoongminh',1,0,7,16,4.00,10);
/*!40000 ALTER TABLE `recipe_ingredient_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_steps`
--

DROP TABLE IF EXISTS `recipe_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_steps` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `step_instruction` varchar(255) DEFAULT NULL,
  `step_number` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_steps`
--

LOCK TABLES `recipe_steps` WRITE;
/*!40000 ALTER TABLE `recipe_steps` DISABLE KEYS */;
INSERT INTO `recipe_steps` VALUES (1,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,1,'Nghiền chuối chín',1),(2,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,1,'Trộn bột mì, đường, sữa và trứng vào chuối',2),(3,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,1,'Chiên bánh trên chảo chống dính đến vàng 2 mặt',3),(4,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,2,'Vắt nước cam',1),(5,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,2,'Trộn sữa chua và nước cam',2),(6,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,3,'Gọt khoai, cắt miếng dài và ngâm nước muối',1),(7,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,3,'Chiên khoai trong dầu sôi đến khi vàng',2),(8,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,4,'Luộc thịt gà và xé sợi',1),(9,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,4,'Trộn các nguyên liệu với sốt mè và tỏi',2),(10,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,5,'Phi hành với dầu ăn cho thơm',1),(11,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,5,'Thêm xúc xích và trứng đảo đều',2),(12,'2025-08-04 10:10:29.000000','system',NULL,NULL,1,0,5,'Cho cơm vào chiên cùng, nêm nếm gia vị vừa ăn',3),(13,'2025-08-12 09:49:16.407415','1','2025-08-12 09:49:16.407415','1',1,0,6,'1',1),(14,'2025-08-12 09:49:16.415213','1','2025-08-12 09:49:16.415213','1',1,0,6,'2',2),(15,'2025-08-12 09:49:16.421458','1','2025-08-12 09:49:16.421458','1',1,0,6,'3',3),(17,'2025-08-12 15:40:16.586942','1','2025-08-12 15:40:16.586942','1',1,0,8,'232323',1),(18,'2025-08-19 09:33:27.989963','4','2025-08-19 09:33:27.989963','4',1,0,9,'12346',1),(19,'2025-08-19 09:33:28.057937','4','2025-08-19 09:33:28.057937','4',1,0,9,'12345678',2),(20,'2025-08-19 09:33:28.064142','4','2025-08-19 09:33:28.064142','4',1,0,9,'654321',3),(21,'2025-08-19 09:33:28.072133','4','2025-08-19 09:33:28.072133','4',1,0,9,'64321',4),(22,'2025-08-19 09:33:28.078140','4','2025-08-19 09:33:28.078140','4',1,0,9,'6432',5),(23,'2025-08-25 15:34:23.136701','hoangfcoongminh','2025-08-25 15:34:23.136701','hoangfcoongminh',1,0,10,'1',1),(24,'2025-08-25 15:34:23.142483','hoangfcoongminh','2025-08-25 15:34:23.142483','hoangfcoongminh',1,0,10,'2',2),(25,'2025-08-25 15:34:23.147386','hoangfcoongminh','2025-08-25 15:34:23.147386','hoangfcoongminh',1,0,10,'3',3);
/*!40000 ALTER TABLE `recipe_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `cook_time` decimal(38,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `prep_time` decimal(38,2) DEFAULT NULL,
  `servings` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `author_username` varchar(255) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `view_count` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,'2025-08-04 10:10:20.000000','system',NULL,NULL,1,0,1,0.50,'Bánh mềm xốp từ chuối',0.25,2,'Bánh kếp chuối','http://localhost:9000/images/default-recipe.jpg','1','https://www.youtube.com/watch?v=Xw7v-w6kc_0&ab_channel=AnhLuc',52),(2,'2025-08-04 10:10:20.000000','system',NULL,NULL,1,0,2,0.00,'Thức uống mát lạnh từ cam và sữa chua',0.10,1,'Sữa chua cam','http://localhost:9000/images/default-recipe.jpg','3','https://www.youtube.com/watch?v=Xw7v-w6kc_0&ab_channel=AnhLuc',30),(3,'2025-08-04 10:10:20.000000','system',NULL,NULL,1,0,3,0.30,'Món ăn vặt đơn giản, giòn tan',0.20,2,'Khoai tây chiên','http://localhost:9000/images/default-recipe.jpg','4','https://www.youtube.com/watch?v=Xw7v-w6kc_0&ab_channel=AnhLuc',5),(4,'2025-08-04 10:10:20.000000','system','2025-08-08 14:19:11.256230','2',1,1,4,0.50,'Salad thanh mát với gà xé và sốt mè',0.30,2,'Salad gà sốt mè','http://localhost:9000/images/default-recipe.jpg','2','https://www.youtube.com/watch?v=Xw7v-w6kc_0&ab_channel=AnhLuc',9),(5,'2025-08-04 10:10:20.000000','system',NULL,NULL,1,0,5,0.40,'Món cơm chiên quen thuộc cho bữa sáng',0.20,2,'Cơm chiên trứng xúc xích','http://localhost:9000/images/default-recipe.jpg','1','https://www.youtube.com/watch?v=Xw7v-w6kc_0&ab_channel=AnhLuc',4),(6,'2025-08-12 09:49:16.211718','1','2025-08-12 09:49:16.211718','1',1,0,12,3.00,'FOR TEST',2.00,2,'TESTING ','http://localhost:9000/images/Screenshot 2025-08-08 145117.png','1','https://www.youtube.com/watch?v=Xw7v-w6kc_0&ab_channel=AnhLuc',15),(8,'2025-08-12 15:40:16.422812','1','2025-08-12 15:40:16.422812','1',1,0,12,1.00,'FOR TESTING',1.00,1,'TEST 2','http://localhost:9000/images/default-recipe.jpg','1',NULL,28),(9,'2025-08-19 09:33:27.607306','4','2025-08-19 09:33:27.607306','4',1,0,12,1.00,'cong thuc',1.00,3,'cong thuc 2','http://localhost:9000/images/default-ingredient.jpg','4',NULL,87),(10,'2025-08-25 15:34:23.086810','hoangfcoongminh','2025-08-25 15:34:23.086810','hoangfcoongminh',1,0,12,1.00,'heheeheheheh',1.00,5,'hoangfcoongminh','http://localhost:9000/images/images.jpg','hoangfcoongminh',NULL,1);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `comment` text,
  `rating` float DEFAULT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'2025-08-08 08:50:56.082375','1','2025-08-08 08:50:56.082375','1',1,0,'1.5 rating',1.5,1,1,'1'),(2,'2025-08-08 08:51:39.036470','2','2025-08-08 08:51:39.036470','2',1,0,'5 rating',5,1,2,'2'),(5,'2025-08-08 09:48:07.497804','1','2025-08-08 09:48:07.497804','1',1,0,'1.5 rating asdfa sdfasdf asdfffffff    Trong bối cảnh Việt Nam xác định khoa học công nghệ, đổi mới sáng tạo và chuyển đổi số là động lực cho phát triển, ông Khải chia sẻ với VnExpress về việc phát triển nền tảng của người Việt cho người Việt, khoảnh khắc đối mặt với những thất bại, cũng như những định hướng trong kỷ nguyên AI.',1.5,1,3,'3'),(6,'2025-08-08 09:54:56.162288','1','2025-08-08 09:54:56.162288','1',1,0,'1.5 rating asdfa sdfasdf asdfffffff    Trong bối cảnh Việt Nam xác định khoa học công nghệ, đổi mới sáng tạo và chu.',1.5,1,4,'4'),(7,'2025-08-08 09:54:58.438658','1','2025-08-08 09:54:58.438658','1',1,0,'1.5 rating asdfa sdfasdf asdfffffff    Trong bối cảnh Việt Nam xác định khoa học công nghệ, đổi mới sáng tạo và chu.',1.5,1,5,'5'),(11,'2025-08-08 10:54:49.213025','6','2025-08-08 10:54:49.213025','6',1,0,'tệ vcl',0.5,1,8,'6'),(12,'2025-08-08 14:05:02.158522','2','2025-08-08 14:05:02.158522','2',1,0,'tuyệt vời',5,5,2,'2'),(13,'2025-08-08 14:07:43.606427','2','2025-08-08 14:07:43.606427','2',1,0,'ngolllllllllllllllllllllllllllllll',5,4,2,'2'),(14,'2025-08-08 14:16:00.076062','2','2025-08-08 14:16:00.076062','2',1,0,'sadfasdfasdfasd fasdf',3.5,3,2,'2'),(15,'2025-08-12 10:04:49.110528','1','2025-08-12 10:13:26.099516','1',0,1,NULL,NULL,6,1,'1'),(16,'2025-08-12 10:21:05.804991','1','2025-08-12 10:21:08.715467','1',0,1,NULL,NULL,6,1,'1'),(17,'2025-08-12 10:21:15.007522','1','2025-08-12 10:22:10.677017','1',0,1,NULL,NULL,6,1,'1'),(18,'2025-08-12 10:23:03.055321','1','2025-08-12 10:23:03.055321','1',1,0,'121212',0.5,6,1,'1'),(19,'2025-08-12 11:00:58.497708','1','2025-08-12 11:00:58.497708','1',1,0,'oke',1.5,5,1,'1'),(20,'2025-08-13 10:15:42.137599','3','2025-08-13 10:15:42.137599','3',1,0,'ngol vclon',1.5,2,3,'3'),(21,'2025-08-25 15:27:36.963380','hoangfcoongminh','2025-08-25 15:27:36.963380','hoangfcoongminh',1,0,'tam dc',3.5,9,9,'hoangfcoongminh'),(22,'2025-08-25 15:27:55.446728','hoangfcoongminh','2025-08-25 15:27:55.446728','hoangfcoongminh',1,0,'okela',4.5,4,9,'hoangfcoongminh');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Gram'),(2,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Ml'),(3,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Muỗng cà phê'),(4,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Muỗng canh'),(5,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Trái'),(6,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Cái'),(7,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Gói'),(8,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Miếng'),(9,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Quả'),(10,'2025-08-04 10:10:12.000000','system',NULL,NULL,1,0,'Chén');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_at` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-07-28 14:46:27.165858','system','2025-07-28 14:46:27.165858','system',1,0,'1@g','HCM','$2a$10$j/UHN/dj2uPD3fq8vK.xkuImNhhFU38/g3FnbdD/f8o9a9YDNonN.','USER','1','http://localhost:9000/images/default-avt.jpg','Xin chào! Tôi là người yêu thích nấu ăn và luôn muốn chia sẻ những công thức món ăn đơn giản nhưng ngon miệng. Trang cá nhân này là nơi tôi lưu lại trải nghiệm bếp núc, từ những bữa cơm gia đình đến các món ăn thử nghiệm. Hy vọng công thức của tôi sẽ giúp bạn có thêm cảm hứng để vào bếp và tạo ra thật nhiều bữa ăn ấm áp.'),(2,'2025-07-28 14:46:51.296667','system','2025-07-28 14:46:51.296667','system',1,0,'2@g','HCM2','$2a$10$WMmMykizTTYPT8/eDGidJ.3fiKv6Qn/ngfBzrYbhI4lCIKcrVu4nm','USER','2','http://localhost:9000/images/default-avt.jpg','Tôi thích khám phá hương vị qua từng món ăn và biến căn bếp thành nơi đầy sáng tạo. Tại đây, tôi chia sẻ những công thức dễ làm, phù hợp cho cả những bữa ăn nhanh lẫn những dịp đặc biệt. Hy vọng bạn sẽ tìm thấy niềm vui khi nấu và thưởng thức cùng tôi.'),(3,'2025-07-28 14:46:58.499968','system','2025-07-28 14:46:58.499968','system',1,0,'3@g','HCM3','$2a$10$7Tlv/klZsMmdiN1iuitMQOhNlifdfhpZhL5j4cS2vIA/Nq9Hqf7cO','USER','3','http://localhost:9000/images/default-avt.jpg','Xin chào! Tôi là người yêu thích nấu ăn và luôn muốn chia sẻ những công thức món ăn đơn giản nhưng ngon miệng. Trang cá nhân này là nơi tôi lưu lại trải nghiệm bếp núc, từ những bữa cơm gia đình đến các món ăn thử nghiệm. Hy vọng công thức của tôi sẽ giúp bạn có thêm cảm hứng để vào bếp và tạo ra thật nhiều bữa ăn ấm áp.'),(4,'2025-07-28 14:47:07.744984','system','2025-07-28 14:47:07.744984','system',1,0,'4@g','HCM4','$2a$10$MFwf9Vp8cYQaPnQ1118oc.bAItJeFcXV1NnXHjZZQ/XEaxdz9XynC','USER','4','http://localhost:9000/images/default-avt.jpg','Tôi thích khám phá hương vị qua từng món ăn và biến căn bếp thành nơi đầy sáng tạo. Tại đây, tôi chia sẻ những công thức dễ làm, phù hợp cho cả những bữa ăn nhanh lẫn những dịp đặc biệt. Hy vọng bạn sẽ tìm thấy niềm vui khi nấu và thưởng thức cùng tôi.'),(5,'2025-07-28 14:47:14.749119','system','2025-07-28 14:47:14.749119','system',1,0,'5@g','HCM5','$2a$10$R9QCdMB0RPaFlLW7Oq/rD.hMr8yR91g6k1vXiUxk2s/n3WeI8ErOe','USER','5','http://localhost:9000/images/default-avt.jpg','Xin chào! Tôi là người yêu thích nấu ăn và luôn muốn chia sẻ những công thức món ăn đơn giản nhưng ngon miệng. Trang cá nhân này là nơi tôi lưu lại trải nghiệm bếp núc, từ những bữa cơm gia đình đến các món ăn thử nghiệm. Hy vọng công thức của tôi sẽ giúp bạn có thêm cảm hứng để vào bếp và tạo ra thật nhiều bữa ăn ấm áp.'),(7,'2025-08-06 15:09:47.442188','system','2025-08-06 15:09:47.442188','system',1,0,NULL,'admin','$2a$10$wZDa1VQ5ibtAssMay/6vA.OdB3mEQmHFbefcAKLsxGBuABibKFGM.','ADMIN','admin','http://localhost:9000/images/default-avt.jpg','tao là admin'),(8,'2025-08-08 10:54:19.869221','system','2025-08-08 10:54:19.869221','system',1,0,'','6','$2a$10$1lqzVxvxYIh.6xTKdXgsg.6mYvnNoIOIdYIw4j6onn3QaavXdNm7C','USER','6','http://localhost:9000/images/default-avt.jpg','Xin chào! Tôi là người yêu thích nấu ăn và luôn muốn chia sẻ những công thức món ăn đơn giản nhưng ngon miệng. Trang cá nhân này là nơi tôi lưu lại trải nghiệm bếp núc, từ những bữa cơm gia đình đến các món ăn thử nghiệm. Hy vọng công thức của tôi sẽ giúp bạn có thêm cảm hứng để vào bếp và tạo ra thật nhiều bữa ăn ấm áp.'),(9,'2025-08-25 15:26:45.888271','system','2025-08-25 16:52:40.208914','hoangfcoongminh',1,2,'hoangfcoongminh@gmail.com','Hoàng Công Minh','$2a$10$7h7b0SxUeBCF/KOcEi0xWemAZlY9NQ7XLO2jVzWYaFLQglj8CEG9C','USER','hoangfcoongminh','http://localhost:9000/images/avt1.jpg','123465789 testtttttttt');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'cook_craft_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-25 17:12:33
