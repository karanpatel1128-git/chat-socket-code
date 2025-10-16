-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 15, 2025 at 04:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `is_group` tinyint(1) DEFAULT 0,
  `chat_name` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `is_group`, `chat_name`, `created_by`, `createdAt`, `updatedAt`) VALUES
(35, 0, NULL, 1, '2025-04-15 10:57:36', '2025-04-15 16:27:36'),
(36, 0, NULL, 4, '2025-04-15 10:58:42', '2025-04-15 16:28:42'),
(37, 1, 'backend-developers', 1, '2025-04-15 10:59:57', '2025-04-15 16:29:57'),
(38, 0, NULL, 2, '2025-04-15 11:03:49', '2025-04-15 16:33:49'),
(39, 0, NULL, 2, '2025-04-15 11:09:03', '2025-04-15 16:39:03');

-- --------------------------------------------------------

--
-- Table structure for table `chat_member`
--

CREATE TABLE `chat_member` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_member`
--

INSERT INTO `chat_member` (`id`, `chat_id`, `user_id`, `createdAt`, `updatedAt`) VALUES
(37, 35, 1, '2025-04-15 10:57:36', '2025-04-15 10:57:36'),
(38, 35, 3, '2025-04-15 10:57:36', '2025-04-15 10:57:36'),
(39, 36, 4, '2025-04-15 10:58:42', '2025-04-15 10:58:42'),
(40, 36, 1, '2025-04-15 10:58:42', '2025-04-15 10:58:42'),
(41, 37, 2, '2025-04-15 10:59:57', '2025-04-15 10:59:57'),
(42, 37, 3, '2025-04-15 10:59:57', '2025-04-15 10:59:57'),
(43, 37, 4, '2025-04-15 10:59:57', '2025-04-15 10:59:57'),
(44, 37, 1, '2025-04-15 10:59:57', '2025-04-15 10:59:57'),
(45, 38, 2, '2025-04-15 11:03:49', '2025-04-15 11:03:49'),
(46, 38, 1, '2025-04-15 11:03:49', '2025-04-15 11:03:49'),
(47, 39, 2, '2025-04-15 11:09:03', '2025-04-15 11:09:03'),
(48, 39, 4, '2025-04-15 11:09:03', '2025-04-15 11:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `is_read` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `message_type` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `chat_id`, `sender_id`, `is_read`, `message`, `message_type`, `createdAt`, `updatedAt`) VALUES
(179, 35, 1, 1, 'hello ayushma are u there', 'text', '2025-04-15 10:57:54', '2025-04-15 16:27:54'),
(180, 35, 3, 1, 'yes i am', 'text', '2025-04-15 10:58:08', '2025-04-15 16:28:08'),
(181, 35, 1, 1, 'ok only testing', 'text', '2025-04-15 10:58:15', '2025-04-15 16:28:15'),
(182, 35, 3, 1, 'yes i know', 'text', '2025-04-15 10:58:22', '2025-04-15 16:28:22'),
(183, 36, 1, 1, 'hello beauty', 'text', '2025-04-15 10:58:57', '2025-04-15 16:28:57'),
(184, 36, 4, 1, 'hello yashraj', 'text', '2025-04-15 10:59:27', '2025-04-15 16:29:27'),
(185, 37, 1, 1, 'hello everyone', 'text', '2025-04-15 11:00:23', '2025-04-15 16:30:23'),
(186, 37, 3, 1, 'hello', 'text', '2025-04-15 11:00:46', '2025-04-15 16:30:46'),
(187, 37, 4, 1, 'hello', 'text', '2025-04-15 11:00:54', '2025-04-15 16:30:54'),
(188, 37, 2, 1, 'helooo', 'text', '2025-04-15 11:01:03', '2025-04-15 16:31:03'),
(189, 38, 2, 1, 'hello karan', 'text', '2025-04-15 11:03:54', '2025-04-15 16:33:54'),
(190, 37, 1, 1, 'update docs plz', 'text', '2025-04-15 11:04:22', '2025-04-15 16:34:22'),
(191, 37, 4, 1, 'hello everyone this is beauty', 'text', '2025-04-15 11:07:55', '2025-04-15 16:37:55'),
(192, 37, 2, 1, 'ok do there work', 'text', '2025-04-15 11:08:05', '2025-04-15 16:38:05'),
(193, 37, 4, 1, 'yashraj please', 'text', '2025-04-15 11:08:35', '2025-04-15 16:38:35'),
(194, 37, 1, 1, 'ok sir koi nn', 'text', '2025-04-15 11:08:38', '2025-04-15 16:38:38'),
(195, 39, 2, 1, 'hello', 'text', '2025-04-15 11:09:11', '2025-04-15 16:39:11'),
(196, 39, 4, 1, 'hello yashraj', 'text', '2025-04-15 11:09:17', '2025-04-15 16:39:17'),
(197, 39, 4, 1, 'how you doing?', 'text', '2025-04-15 11:09:23', '2025-04-15 16:39:23'),
(198, 39, 2, 1, 'hello beauty', 'text', '2025-04-15 11:09:40', '2025-04-15 16:39:40'),
(199, 37, 3, 1, 'hjWDBBBBBBBBBBBBBBBBBBBBK', 'text', '2025-04-15 11:10:29', '2025-04-15 16:40:29'),
(200, 35, 3, NULL, 'GO DO YOUR WORK', 'text', '2025-04-15 11:10:59', '2025-04-15 16:40:59'),
(201, 39, 4, 1, 'GO DO YOUR WORK', 'text', '2025-04-15 11:11:17', '2025-04-15 16:41:17'),
(202, 39, 4, 1, 'YOU GUYS DONT TALK', 'text', '2025-04-15 11:11:25', '2025-04-15 16:41:25'),
(203, 39, 4, 1, 'KARAN BEAUTY', 'text', '2025-04-15 11:11:31', '2025-04-15 16:41:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `socket_id` varchar(100) DEFAULT NULL,
  `profile_image` longtext DEFAULT NULL,
  `is_online` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `socket_id`, `profile_image`, `is_online`, `createdAt`, `updatedAt`) VALUES
(1, 'karan', NULL, '', 'UkdXe480hz39kDWIAAAH', NULL, 0, '2025-04-15 10:53:30', '2025-04-15 10:53:31'),
(2, 'Yashraj', NULL, '', 'zr4DJnd3gZMSzdU8AAAJ', NULL, 0, '2025-04-15 10:53:46', '2025-04-15 10:53:47'),
(3, 'ayushma', NULL, '', 'mIynYbSzuk8LsgKGAAAL', NULL, 0, '2025-04-15 10:56:16', '2025-04-15 10:56:17'),
(4, 'beauty', NULL, '', 'pEv92IAkEZUD6_heAAAN', NULL, 0, '2025-04-15 10:56:45', '2025-04-15 10:56:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_member`
--
ALTER TABLE `chat_member`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `chat_member`
--
ALTER TABLE `chat_member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=204;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
