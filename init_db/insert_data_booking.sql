-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: bookinghomestay_db
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'E49823185C','2026-05-20','2026-05-22',2,1,3,2,4),(2,'0D1E1EB0A5','2026-05-20','2026-05-22',1,0,1,4,1),(3,'0D27F4519A','2026-05-20','2026-05-22',1,0,1,5,4);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `otp_verifications`
--

LOCK TABLES `otp_verifications` WRITE;
/*!40000 ALTER TABLE `otp_verifications` DISABLE KEYS */;
INSERT INTO `otp_verifications` VALUES (1,'2026-05-15 21:56:35.447632','nhatkhang@gmail.com','2026-05-15 22:06:35.446633','438789','RESET_PASSWORD',_binary '\0',_binary '\0'),(2,'2026-05-15 22:02:30.223304','nhatkhang7122005@gmail.com','2026-05-15 22:12:30.222292','905282','RESET_PASSWORD',_binary '',_binary '');
/*!40000 ALTER TABLE `otp_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'The five star room','https://res.cloudinary.com/dri1spe3b/image/upload/v1778858197/booking-home-stay/rooms/eatpzhc8yfoszhl5plr0.jpg',500.00,'Standard'),(2,'The room for family','https://res.cloudinary.com/dri1spe3b/image/upload/v1778858583/booking-home-stay/rooms/uswvlbfknk6uu6eqgojz.jpg',600.00,'Family'),(3,'The single room','https://res.cloudinary.com/dri1spe3b/image/upload/v1778998395/booking-home-stay/rooms/owk2eouaaftazc6qsdbf.jpg',300.00,'Single room'),(4,'The single room','https://res.cloudinary.com/dri1spe3b/image/upload/v1778998423/booking-home-stay/rooms/yqsj8litic941macvhok.jpg',300.00,'Single room'),(5,'The Delexe room','https://res.cloudinary.com/dri1spe3b/image/upload/v1778998506/booking-home-stay/rooms/gzxu7glsgbmv690osf8y.jpg',1500.00,'Deluxe Room');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'khue@gmail.com','Nguyen Chanh Khue','$2a$10$LgkRB0btnXMijniXgiR2D.9VrxO.43f29GDREpkf3kFXmjP7TWrH6','01232456666','CUSTOMER'),(2,'admin@gmail.com','ADMIN','$2a$10$LgkRB0btnXMijniXgiR2D.9VrxO.43f29GDREpkf3kFXmjP7TWrH6','013123123','ADMIN'),(4,'nhatkhang7122005@gmail.com','Nguyen Nhat Khang','$2a$10$Ao4yTuM51YlO4GQu2AE6ju9DDOrqG8Ev4GQCO9owjM82m/22SZ6Ae','012312312','CUSTOMER');
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

-- Dump completed on 2026-05-17 13:58:34
