-- MySQL dump 10.13  Distrib 5.7.24, for osx11.1 (x86_64)
--
-- Host: vlai-rds.cb40uq8wcu0z.ap-south-1.rds.amazonaws.com    Database: indiArunachal
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED='';

--
-- Table structure for table `attribute_types`
--

DROP TABLE IF EXISTS `attribute_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attribute_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `validation_rules` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attribute_types`
--

LOCK TABLES `attribute_types` WRITE;
/*!40000 ALTER TABLE `attribute_types` DISABLE KEYS */;
INSERT INTO `attribute_types` VALUES (1,'Text','Simple text content','{\"allow_html\": false, \"max_length\": 50000, \"min_length\": 1}','2025-02-08 10:52:39','2025-02-08 10:52:39'),(2,'Media','Media storage for images, videos, and audio','{\"max_size_mb\": {\"audio\": 100, \"image\": 10, \"video\": 500}, \"allowed_types\": [\"image/jpeg\", \"image/png\", \"image/webp\", \"video/mp4\", \"audio/mp3\", \"audio/wav\"], \"allowed_dimensions\": {\"image\": {\"max_width\": 4096, \"max_height\": 4096}, \"video\": {\"max_resolution\": \"4K\"}}}','2025-02-08 10:52:39','2025-02-08 10:52:39'),(3,'Array','List of values with labels','{\"max_items\": 100, \"allow_duplicates\": false}','2025-02-08 10:52:39','2025-02-08 10:52:39'),(4,'Date','Date values','{\"format\": \"YYYY-MM-DD\", \"max_date\": \"2100-12-31\", \"min_date\": \"1800-01-01\"}','2025-02-08 10:52:39','2025-02-08 10:52:39'),(5,'Number','Numeric values','{\"precision\": 2, \"allow_decimal\": true}','2025-02-08 10:52:39','2025-02-08 10:52:39'),(6,'Boolean','True/False values','{}','2025-02-08 10:52:39','2025-02-08 10:52:39');
/*!40000 ALTER TABLE `attribute_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attributes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attribute_type_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `is_required` tinyint(1) DEFAULT '0',
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `attribute_type_id` (`attribute_type_id`),
  CONSTRAINT `attributes_ibfk_1` FOREIGN KEY (`attribute_type_id`) REFERENCES `attribute_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,1,'tribeName','Name of the tribe',1,NULL,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(2,1,'tribeAbout','Description about the tribe',1,NULL,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(3,1,'tribeHistory','Historical information of tribe',1,NULL,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(4,1,'tribeDistribution','Geographical distribution of tribe',1,NULL,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(5,1,'categoryName','Name of category',1,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39'),(6,1,'categoryDescription','Description of category',1,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39'),(7,3,'categoryTribeAssociation','Associated tribes',1,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39'),(8,1,'categoryGenre','Genre of the music',1,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39'),(9,3,'categoryInstruments','Traditional instruments used',1,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39'),(10,1,'categoryDuration','Duration of the piece',0,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39'),(11,1,'categoryContext','Cultural and historical context',1,NULL,'2025-02-08 10:55:39','2025-02-08 10:55:39');
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Folk Music','Traditional folk music of tribes','2025-02-08 10:54:16','2025-02-08 10:54:16');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `associated_table` enum('tribe','category') NOT NULL,
  `associated_table_id` int NOT NULL,
  `attribute_id` int DEFAULT NULL,
  `value` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `associated_table` (`associated_table`,`associated_table_id`,`attribute_id`),
  KEY `attribute_id` (`attribute_id`),
  KEY `idx_content_search` (`associated_table`,`associated_table_id`,`name`),
  KEY `idx_json_search` ((cast(json_unquote(json_extract(`value`,_utf8mb3'$.data')) as char(255) charset utf8mb3))),
  CONSTRAINT `content_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,'Adi Name','tribe',1,1,'{\"data\": \"Adi\", \"type\": \"normalText\"}','2025-02-08 10:53:24','2025-02-08 10:53:24'),(2,'Adi About','tribe',1,2,'{\"data\": \"The Adi tribe is known for their rich cultural heritage\", \"type\": \"normalText\"}','2025-02-08 10:53:24','2025-02-08 10:53:24'),(3,'Adi History','tribe',1,3,'{\"data\": \"Ancient tribe with strong community traditions\", \"type\": \"normalText\"}','2025-02-08 10:53:24','2025-02-08 10:53:24'),(4,'Adi Distribution','tribe',1,4,'{\"data\": \"East Siang, Upper Siang districts\", \"type\": \"normalText\"}','2025-02-08 10:53:24','2025-02-08 10:53:24'),(5,'Folk Music Name','category',1,5,'{\"data\": \"Folk Music\", \"type\": \"normalText\"}','2025-02-08 10:56:20','2025-02-08 10:56:20'),(6,'Folk Music Description','category',1,6,'{\"data\": \"Traditional folk music representing cultural heritage through songs and melodies\", \"type\": \"normalText\"}','2025-02-08 10:56:20','2025-02-08 10:56:20'),(7,'Folk Music Tribes','category',1,7,'{\"data\": {\"label\": \"Associated Tribes\", \"value\": [\"Adi\", \"Apatani\", \"Nyishi\"]}, \"type\": \"normalArray\"}','2025-02-08 10:56:20','2025-02-08 10:56:20'),(8,'Folk Music Genre','category',1,8,'{\"data\": \"Traditional, Ceremonial\", \"type\": \"normalText\"}','2025-02-08 10:56:20','2025-02-08 10:56:20'),(9,'Folk Music Instruments','category',1,9,'{\"data\": {\"label\": \"Traditional Instruments\", \"value\": [\"Drums\", \"Flutes\", \"String instruments\"]}, \"type\": \"normalArray\"}','2025-02-08 10:56:20','2025-02-08 10:56:20');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tribe_attribute_config`
--

DROP TABLE IF EXISTS `tribe_attribute_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tribe_attribute_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attribute_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `attribute_id` (`attribute_id`),
  CONSTRAINT `tribe_attribute_config_ibfk_1` FOREIGN KEY (`attribute_id`) REFERENCES `attributes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tribe_attribute_config`
--

LOCK TABLES `tribe_attribute_config` WRITE;
/*!40000 ALTER TABLE `tribe_attribute_config` DISABLE KEYS */;
INSERT INTO `tribe_attribute_config` VALUES (1,1,1,1,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(2,2,1,2,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(3,3,1,3,'2025-02-08 10:52:50','2025-02-08 10:52:50'),(4,4,1,4,'2025-02-08 10:52:50','2025-02-08 10:52:50');
/*!40000 ALTER TABLE `tribe_attribute_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tribes`
--

DROP TABLE IF EXISTS `tribes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tribes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tribes`
--

LOCK TABLES `tribes` WRITE;
/*!40000 ALTER TABLE `tribes` DISABLE KEYS */;
INSERT INTO `tribes` VALUES (1,'Adi','2025-02-08 10:53:24','2025-02-08 10:53:24');
/*!40000 ALTER TABLE `tribes` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-08 16:29:56
