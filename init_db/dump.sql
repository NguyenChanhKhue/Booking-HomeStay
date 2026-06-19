-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: localhost    Database: bookinghomestay_db
-- ------------------------------------------------------
-- Server version	8.4.9

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_confirmation_code` varchar(255) DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date DEFAULT NULL,
  `room_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `number_of_guests` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FKrgoycol97o21kpjodw1qox4nc` (`room_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  KEY `idx_booking_code` (`booking_confirmation_code`),
  KEY `idx_booking_status` (`status`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrgoycol97o21kpjodw1qox4nc` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'E49823185C','2026-05-20','2026-05-22',2,4,NULL,NULL,NULL,NULL,NULL,1),(3,'0D27F4519A','2026-05-20','2026-05-22',5,4,NULL,NULL,NULL,NULL,NULL,1),(22,'9BBF1169D7','2026-06-19','2026-06-21',3,7,'PENDING','VNPAY','PAID','2026-06-19 02:04:13.115813',900000.00,1),(23,'FD90DC7F3B_31955825','2026-06-22','2026-06-24',3,7,'CANCELLED','CASH','UNPAID','2026-06-19 02:20:53.903408',1000000.00,1),(24,'563E9A4631','2026-06-19','2026-06-21',2,7,'PENDING','VNPAY','PAID','2026-06-19 12:23:15.089163',1000000.00,1),(25,'3F09F5D644','2026-06-22','2026-06-24',2,7,'CANCELLED','CASH','UNPAID','2026-06-19 12:23:57.238800',1000000.00,1),(26,'EB18A08D62','2026-06-19','2026-06-20',1,2,'CANCELLED','CASH','UNPAID','2026-06-19 17:25:38.006514',50000000.00,6),(27,'39D1CB4953','2026-06-21','2026-06-22',1,2,'CANCELLED','CASH','UNPAID','2026-06-19 17:26:15.084594',50000000.00,1),(28,'B9602EFC90','2026-06-20','2026-06-21',1,2,'PENDING','VNPAY','PAID','2026-06-19 17:26:46.610737',50000000.00,4),(29,'E1C290085C','2026-06-19','2026-06-20',9,7,'PENDING','VNPAY','PAID','2026-06-19 17:28:29.775068',2000000.00,1);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `purpose` enum('REGISTER','RESET_PASSWORD') NOT NULL,
  `used` bit(1) NOT NULL,
  `verified` bit(1) NOT NULL,
  `attempts` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_otp_email_purpose` (`email`,`purpose`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
INSERT INTO `otp_verifications` VALUES (1,'2026-05-15 21:56:35.447632','nhatkhang@gmail.com','2026-05-15 22:06:35.446633','438789','RESET_PASSWORD',_binary '\0',_binary '\0',0),(2,'2026-05-15 22:02:30.223304','nhatkhang7122005@gmail.com','2026-05-15 22:12:30.222292','905282','RESET_PASSWORD',_binary '',_binary '',0),(3,'2026-06-18 16:47:15.501530','chanhkhue7122005@gmail.com','2026-06-18 16:57:15.500153','294820','RESET_PASSWORD',_binary '',_binary '',0);
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_amenities`
--

DROP TABLE IF EXISTS `room_amenities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_amenities` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `amenity` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKps6ofup9gxhn8juqvproxbaud` (`room_id`),
  CONSTRAINT `FKps6ofup9gxhn8juqvproxbaud` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=158 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_amenities`
--

LOCK TABLES `room_amenities` WRITE;
/*!40000 ALTER TABLE `room_amenities` DISABLE KEYS */;
INSERT INTO `room_amenities` VALUES (1,2,'Wi-Fi tốc độ cao'),(2,2,'Máy lạnh'),(3,2,'TV màn hình phẳng'),(4,2,'Máy nước nóng'),(5,2,'Hồ bơi'),(6,3,'Bếp nấu ăn'),(7,3,'Wi-Fi tốc độ cao'),(8,3,'Máy lạnh'),(9,3,'TV màn hình phẳng'),(10,3,'Hồ bơi'),(11,4,'Wi-Fi tốc độ cao'),(12,4,'Bếp nấu ăn'),(13,4,'Máy lạnh'),(14,4,'Phòng gym'),(15,4,'Ban công/View đẹp'),(16,5,'Wi-Fi tốc độ cao'),(17,5,'Máy lạnh'),(18,5,'TV màn hình phẳng'),(19,5,'Máy nước nóng'),(20,5,'Hồ bơi'),(21,9,'Wi-Fi tốc độ cao'),(22,9,'Máy lạnh'),(23,9,'TV màn hình phẳng'),(24,9,'Máy nước nóng'),(25,9,'Bếp nấu ăn'),(26,9,'Hồ bơi'),(27,9,'Ban công/View đẹp'),(28,11,'Bếp nấu ăn'),(29,11,'Wi-Fi tốc độ cao'),(30,11,'Máy lạnh'),(31,11,'Phòng gym'),(32,12,'Bếp nấu ăn'),(33,12,'TV màn hình phẳng'),(34,12,'Chỗ đỗ xe miễn phí'),(35,12,'Máy lạnh'),(36,12,'Wi-Fi tốc độ cao'),(37,13,'Hồ bơi'),(38,13,'Wi-Fi tốc độ cao'),(39,13,'Máy lạnh'),(40,13,'Bếp nấu ăn'),(41,13,'TV màn hình phẳng'),(42,14,'Bếp nấu ăn'),(43,14,'Wi-Fi tốc độ cao'),(44,14,'Máy lạnh'),(45,14,'Phòng gym'),(46,14,'Ban công/View đẹp'),(47,15,'Wi-Fi tốc độ cao'),(48,15,'Máy lạnh'),(49,15,'Bếp nấu ăn'),(50,15,'Phòng gym'),(51,15,'Ban công/View đẹp'),(52,15,'TV màn hình phẳng'),(53,15,'Máy nước nóng'),(54,15,'Hồ bơi'),(55,16,'Wi-Fi tốc độ cao'),(56,16,'Máy lạnh'),(57,16,'Bếp nấu ăn'),(58,16,'Phòng gym'),(59,16,'Ban công/View đẹp'),(60,16,'TV màn hình phẳng'),(61,16,'Máy nước nóng'),(62,17,'Wi-Fi tốc độ cao'),(63,17,'Máy lạnh'),(64,17,'Bếp nấu ăn'),(65,18,'Wi-Fi tốc độ cao'),(66,18,'Máy lạnh'),(67,18,'Bếp nấu ăn'),(68,18,'Phòng gym'),(69,19,'Hồ bơi'),(70,19,'Wi-Fi tốc độ cao'),(71,19,'Máy lạnh'),(72,19,'Bếp nấu ăn'),(73,19,'Phòng gym'),(74,19,'TV màn hình phẳng'),(75,20,'Wi-Fi tốc độ cao'),(76,20,'Bếp nấu ăn'),(77,20,'Máy lạnh'),(78,20,'Phòng gym'),(79,20,'TV màn hình phẳng'),(80,20,'Hồ bơi'),(81,21,'Wi-Fi tốc độ cao'),(82,21,'Máy lạnh'),(83,21,'Bếp nấu ăn'),(84,21,'Phòng gym'),(85,21,'TV màn hình phẳng'),(86,21,'Máy nước nóng'),(87,27,'Bếp nấu ăn'),(88,27,'Hồ bơi'),(89,27,'Wi-Fi tốc độ cao'),(90,27,'Máy lạnh'),(91,27,'Phòng gym'),(92,28,'Hồ bơi'),(93,28,'Wi-Fi tốc độ cao'),(94,28,'Máy lạnh'),(95,28,'Bếp nấu ăn'),(96,28,'Phòng gym'),(97,30,'Bếp nấu ăn'),(98,30,'Wi-Fi tốc độ cao'),(99,30,'Máy lạnh'),(100,30,'Phòng gym'),(101,29,'Wi-Fi tốc độ cao'),(102,29,'Máy lạnh'),(103,29,'Bếp nấu ăn'),(104,29,'Phòng gym'),(105,29,'Ban công/View đẹp'),(106,31,'Bếp nấu ăn'),(107,31,'Wi-Fi tốc độ cao'),(108,31,'Máy lạnh'),(109,31,'Ban công/View đẹp'),(110,31,'Phòng gym'),(111,32,'Wi-Fi tốc độ cao'),(112,32,'Máy lạnh'),(113,32,'TV màn hình phẳng'),(114,32,'Máy nước nóng'),(115,32,'Hồ bơi'),(116,32,'Chỗ đỗ xe miễn phí'),(117,33,'Wi-Fi tốc độ cao'),(118,33,'Máy lạnh'),(119,33,'Bếp nấu ăn'),(120,33,'Hồ bơi'),(121,33,'Chỗ đỗ xe miễn phí'),(122,33,'Phục vụ bữa sáng'),(123,33,'Dọn phòng hằng ngày'),(124,24,'Bếp nấu ăn'),(125,24,'Wi-Fi tốc độ cao'),(126,24,'Máy lạnh'),(127,24,'Chỗ đỗ xe miễn phí'),(128,24,'Phục vụ bữa sáng'),(129,26,'Wi-Fi tốc độ cao'),(130,26,'Máy lạnh'),(131,26,'Bếp nấu ăn'),(132,26,'Phòng gym'),(133,26,'Hồ bơi'),(134,26,'Máy nước nóng'),(135,25,'Wi-Fi tốc độ cao'),(136,25,'Máy lạnh'),(137,25,'Bếp nấu ăn'),(138,25,'Phòng gym'),(139,22,'Wi-Fi tốc độ cao'),(140,22,'Máy lạnh'),(141,22,'Bếp nấu ăn'),(142,22,'Phòng gym'),(143,23,'Hồ bơi'),(144,23,'Wi-Fi tốc độ cao'),(145,23,'Máy lạnh'),(146,23,'TV màn hình phẳng'),(147,23,'Máy nước nóng'),(148,1,'Wi-Fi tốc độ cao'),(149,1,'Máy lạnh'),(150,1,'Bếp nấu ăn'),(151,1,'TV màn hình phẳng'),(152,1,'Máy nước nóng'),(153,10,'Hồ bơi'),(154,10,'Máy lạnh'),(155,10,'Wi-Fi tốc độ cao'),(156,10,'Bếp nấu ăn'),(157,10,'Máy nước nóng');
/*!40000 ALTER TABLE `room_amenities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_id` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtky1jnwoh1hv50m263p2vlt0y` (`room_id`),
  CONSTRAINT `FKtky1jnwoh1hv50m263p2vlt0y` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,1,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781853678/booking-home-stay/rooms/additional/ilomwhai5fjbby2wd69u.jpg'),(2,1,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781853681/booking-home-stay/rooms/additional/xbdhclxj7emdkxtefvt4.jpg'),(3,1,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781853683/booking-home-stay/rooms/additional/vbvhtlbjh3nmiv71cd61.jpg'),(4,1,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781853685/booking-home-stay/rooms/additional/yqu685kmbqh8h3dnsfvd.jpg'),(5,33,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868507/booking-home-stay/rooms/additional/gvilbsw8ykvf9dhvbsdj.jpg'),(6,33,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868511/booking-home-stay/rooms/additional/wzhl1igaitfqnrd1zntm.jpg'),(7,33,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868513/booking-home-stay/rooms/additional/ol7bsw34sloa75lyuvxw.jpg'),(8,33,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868515/booking-home-stay/rooms/additional/e8u7ez9vsy6bdvuxweha.jpg'),(9,9,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868556/booking-home-stay/rooms/additional/exn2azvrhkuuq8x2u1qp.jpg'),(10,9,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868558/booking-home-stay/rooms/additional/tqerlxjvjkckvphish43.jpg'),(11,9,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868561/booking-home-stay/rooms/additional/zry0mmwbmzlodvmwsdgt.jpg'),(12,9,'https://res.cloudinary.com/dri1spe3b/image/upload/v1781868564/booking-home-stay/rooms/additional/ps6amtffvcddenl758mc.jpg');
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_description` varchar(255) DEFAULT NULL,
  `room_location` varchar(255) DEFAULT NULL,
  `room_photo_url` varchar(255) DEFAULT NULL,
  `room_price` decimal(18,2) DEFAULT NULL,
  `room_type` varchar(255) DEFAULT NULL,
  `max_capacity` int NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'- The five star room\r\n- Chất lượng cao','Da Lat, Lam Dong','https://res.cloudinary.com/dri1spe3b/image/upload/v1778858197/booking-home-stay/rooms/eatpzhc8yfoszhl5plr0.jpg',5000000.00,'Suite Room',6),(2,'The room for family','Hoi An, Quang Nam','https://res.cloudinary.com/dri1spe3b/image/upload/v1778858583/booking-home-stay/rooms/uswvlbfknk6uu6eqgojz.jpg',500000.00,'Studio Room',2),(3,'The single room','Sa Pa, Lao Cai','https://res.cloudinary.com/dri1spe3b/image/upload/v1778998395/booking-home-stay/rooms/owk2eouaaftazc6qsdbf.jpg',500000.00,'Single room',2),(4,'The single room','Ninh Binh','https://res.cloudinary.com/dri1spe3b/image/upload/v1778998423/booking-home-stay/rooms/yqsj8litic941macvhok.jpg',500000.00,'Single room',2),(5,'The Delexe room','Vung Tau, Ba Ria - Vung Tau','https://res.cloudinary.com/dri1spe3b/image/upload/v1778998506/booking-home-stay/rooms/gzxu7glsgbmv690osf8y.jpg',500000.00,'Deluxe Room',2),(9,'view xịn\r\ncảnh đẹp','Gia Lai','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868555/booking-home-stay/rooms/j2watlhhabd27az26ltg.jpg',2000000.00,'single room',2),(10,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781867681/booking-home-stay/rooms/fd4tchu56ybk6af1l0br.jpg',2000000.00,'Suite Room',2),(11,'Trải nghiệm không gian sống lý tưởng tại Nha Trang.\r\n Nơi tuyệt vời cho kỳ nghỉ của bạn.','Nha Trang','https://res.cloudinary.com/dri1spe3b/image/upload/v1781867731/booking-home-stay/rooms/jhy1zhngjgkcs6vj6cza.jpg',1500000.00,'Double Room',4),(12,'Trải nghiệm không gian sống lý tưởng tại Hội An. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Hội An','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868041/booking-home-stay/rooms/qm6dtlftiwwldov6twnn.jpg',1700000.00,'VIP Room',5),(13,'Trải nghiệm không gian sống lý tưởng tại Hội An. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Hội An','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868063/booking-home-stay/rooms/xefns4jgnbhxo4ieojfa.jpg',2100000.00,'Family Room',4),(14,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868083/booking-home-stay/rooms/ai0dhtqawzdjsxrfmj8i.jpg',1200000.00,'Family Room',3),(15,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868104/booking-home-stay/rooms/y2ckd2y7mlitmcpgg3es.jpg',1550000.00,'Deluxe Room',3),(16,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868127/booking-home-stay/rooms/wp2uvxhqyridl7jy7xkg.jpg',700000.00,'Studio Room',3),(17,'Trải nghiệm không gian sống lý tưởng tại Hội An. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Hội An','https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80',750000.00,'Single Room',2),(18,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868160/booking-home-stay/rooms/y2eifktkwjyj4dpa1t9a.jpg',1600000.00,'Double Room',5),(19,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868187/booking-home-stay/rooms/pttph94leyjqgi13zqcq.jpg',1300000.00,'Family Room',3),(20,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868210/booking-home-stay/rooms/qnx2vc1ngtf57ulvv9kp.jpg',2300000.00,'Family Room',5),(21,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868236/booking-home-stay/rooms/nxfijymozvij9dpxhisl.jpg',2500000.00,'Deluxe Room',4),(22,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu.\r\n Nơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868261/booking-home-stay/rooms/y3yilicgnjqls7avhjhp.jpg',1900000.00,'Double Room',4),(23,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868283/booking-home-stay/rooms/yhawxqqwjogjkk5cpfhd.jpg',1600000.00,'VIP Room',3),(24,'Trải nghiệm không gian sống lý tưởng tại Hội An. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Hội An','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868307/booking-home-stay/rooms/gt8qcmqdme52zr4tvvsq.jpg',2500000.00,'Double Room',3),(25,'Trải nghiệm không gian sống lý tưởng tại Đà Lạt. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Đà Lạt','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868326/booking-home-stay/rooms/dikqy7nwsz0fk1b1jvjm.jpg',2500000.00,'Studio Room',4),(26,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868350/booking-home-stay/rooms/atzyimmdzxjsjgwxrqic.jpg',2100000.00,'Studio Room',3),(27,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868370/booking-home-stay/rooms/kuhbkkmcs7z9yrvpoapy.jpg',1000000.00,'Double Room',2),(28,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868395/booking-home-stay/rooms/ddajuquwckciowsx9fys.jpg',1500000.00,'Double Room',4),(29,'Trải nghiệm không gian sống lý tưởng tại Hội An. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Hội An','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868416/booking-home-stay/rooms/hwmvme0uzz7jctezbvtj.jpg',1000000.00,'Deluxe Room',2),(30,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868436/booking-home-stay/rooms/ezjqqdgtbfpswf48rpgj.jpg',1300000.00,'Family Room',3),(31,'Trải nghiệm không gian sống lý tưởng tại Nha Trang. Nơi tuyệt vời cho kỳ nghỉ của bạn.','Nha Trang','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868452/booking-home-stay/rooms/eduhuamm9z8hyetqbxo1.jpg',1200000.00,'VIP Room',3),(32,'Trải nghiệm không gian sống lý tưởng tại Vũng Tàu. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Vũng Tàu','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868475/booking-home-stay/rooms/sbtw6jooyngt8shloc5h.jpg',1500000.00,'Studio Room',2),(33,'Trải nghiệm không gian sống lý tưởng tại Sa Pa. \r\nNơi tuyệt vời cho kỳ nghỉ của bạn.','Sa Pa','https://res.cloudinary.com/dri1spe3b/image/upload/v1781868506/booking-home-stay/rooms/yhclsvgszlkukcvbwqt4.jpg',1500000.00,'Double Room',4);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `role` enum('ADMIN','CUSTOMER') NOT NULL,
  `is_active` bit(1) NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'admin@gmail.com','ADMIN','$2a$10$LgkRB0btnXMijniXgiR2D.9VrxO.43f29GDREpkf3kFXmjP7TWrH6','013123123','ADMIN',_binary '',NULL),(4,'nhatkhang7122005@gmail.com','Nguyen Nhat Khang','$2a$10$Ao4yTuM51YlO4GQu2AE6ju9DDOrqG8Ev4GQCO9owjM82m/22SZ6Ae','012312312','CUSTOMER',_binary '',NULL),(7,'chanhkhue7122005@gmail.com','Nguyễn Chánh Khuê','$2a$10$w0ItClEdu/mxsReaXTB5NekYhYWb.LOv/l7e89l5xQ9BKPXpmNzOS','0867149109','CUSTOMER',_binary '','https://res.cloudinary.com/dri1spe3b/image/upload/v1781775991/booking-home-stay/avatars/wsd0rf0toddd0garkhpk.jpg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-19 19:50:23
