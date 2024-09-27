-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2024 at 03:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30
SET
  SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
  time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!40101 SET NAMES utf8mb4 */
;

--
-- Database: `products_store_db`
--
DROP DATABASE IF EXISTS `products_store_db`;

CREATE DATABASE IF NOT EXISTS `products_store_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `products_store_db`;

-- --------------------------------------------------------
--
-- Table structure for table `location`
--
-- Creation: Sep 27, 2024 at 01:13 AM
-- Last update: Sep 27, 2024 at 01:13 AM
--
CREATE TABLE `location` (
  `location_id` varchar(45) NOT NULL,
  `city` text NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `location`:
--
--
-- Dumping data for table `location`
--
INSERT INTO
  `location` (`location_id`, `city`)
VALUES
  ('1', 'Hebron'),
  ('2', 'Jenin'),
  ('3', 'Ramallah');

-- --------------------------------------------------------
--
-- Table structure for table `product`
--
-- Creation: Sep 27, 2024 at 01:01 AM
-- Last update: Sep 27, 2024 at 01:01 AM
--
CREATE TABLE `product` (
  `product_id` varchar(45) NOT NULL,
  `name` text NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `product`:
--
--
-- Dumping data for table `product`
--
INSERT INTO
  `product` (`product_id`, `name`)
VALUES
  ('1', 'Laptop'),
  ('2', 'Tablet'),
  ('3', 'Phone'),
  ('4', 'Phone Cover'),
  ('5', 'Clock'),
  ('6', 'Shoes'),
  ('7', 'Glass'),
  ('8', 'T-Shirt');

-- --------------------------------------------------------
--
-- Table structure for table `productmovement`
--
-- Creation: Sep 27, 2024 at 01:01 AM
--
CREATE TABLE `productmovement` (
  `movement_id` varchar(45) NOT NULL,
  `movement_timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `from_location` text DEFAULT NULL,
  `to_location` text DEFAULT NULL,
  `product_id` varchar(45) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- Insert product movements into `productmovement` table
INSERT INTO
  `productmovement` (
    `movement_id`,
    `from_location`,
    `to_location`,
    `product_id`,
    `qty`
  )
VALUES
  ('1', 'Hebron', 'Ramallah', '1', 10),
  -- Moving 10 Laptops from Hebron to Ramallah
  ('2', 'Jenin', 'Hebron', '2', 5),
  -- Moving 5 Tablets from Jenin to Hebron
  ('3', 'Ramallah', 'Jenin', '3', 20),
  -- Moving 20 Phones from Ramallah to Jenin
  ('4', NULL, 'Ramallah', '4', 50),
  -- Adding 50 Phone Covers to Ramallah (no from_location, initial stock)
  ('5', 'Hebron', NULL, '5', 10),
  -- Removing 10 Clocks from Hebron (no to_location, stock deduction)
  ('6', 'Jenin', 'Hebron', '6', 25),
  -- Moving 25 Shoes from Jenin to Hebron
  ('7', 'Ramallah', 'Hebron', '7', 12),
  -- Moving 12 Glasses from Ramallah to Hebron
  ('8', 'Hebron', 'Jenin', '8', 30);

-- Moving 30 T-Shirts from Hebron to Jenin
--
-- RELATIONSHIPS FOR TABLE `productmovement`:
--   `product_id`
--       `product` -> `product_id`
--
--
-- Indexes for dumped tables
--
--
-- Indexes for table `product`
--
ALTER TABLE
  `product`
ADD
  PRIMARY KEY (`product_id`);

--
-- Indexes for table `productmovement`
--
ALTER TABLE
  `productmovement`
ADD
  PRIMARY KEY (`movement_id`),
ADD
  KEY `product_id` (`product_id`);

--
-- Constraints for dumped tables
--
--
-- Constraints for table `productmovement`
--
ALTER TABLE
  `productmovement`
ADD
  CONSTRAINT `productmovement_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
