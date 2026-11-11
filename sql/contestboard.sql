-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 11, 2026 at 06:17 PM
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
-- Database: `contestboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `contests`
--

CREATE TABLE `contests` (
  `contest_id` int(10) UNSIGNED NOT NULL,
  `organizer_id` int(10) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `banner_url` varchar(2048) DEFAULT NULL,
  `event_mode` enum('Online','Offline','Hybrid') NOT NULL DEFAULT 'Online',
  `venue` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `eligibility` text NOT NULL,
  `team_min` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `team_max` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `rules` text NOT NULL,
  `registration_start` date NOT NULL,
  `registration_deadline` date NOT NULL,
  `contest_start` date NOT NULL,
  `contest_end` date NOT NULL,
  `results_date` date DEFAULT NULL,
  `registration_url` varchar(2048) NOT NULL,
  `registration_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `participant_limit` int(10) UNSIGNED DEFAULT NULL,
  `prize_first` varchar(500) DEFAULT NULL,
  `prize_second` varchar(500) DEFAULT NULL,
  `prize_third` varchar(500) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(30) DEFAULT NULL,
  `faq` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `reviewed_by` int(10) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contests`
--

INSERT INTO `contests` (`contest_id`, `organizer_id`, `title`, `category`, `banner_url`, `event_mode`, `venue`, `description`, `eligibility`, `team_min`, `team_max`, `rules`, `registration_start`, `registration_deadline`, `contest_start`, `contest_end`, `results_date`, `registration_url`, `registration_fee`, `participant_limit`, `prize_first`, `prize_second`, `prize_third`, `contact_email`, `contact_phone`, `faq`, `status`, `reviewed_by`, `reviewed_at`, `rejection_reason`, `created_at`, `updated_at`) VALUES
(1, 3, 'Inter University Programming Contest', 'Programming', 'https://th.bing.com/th/id/OIP.mREyw6ZJt2Yj_9XhhJJ5twHaFx?w=227&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'Online', 'UITS Campus', 'This is an inter university programming contest. Students comes here and participating the contest with some interesting problem set , they can participate and climed for the fantastic gift. and explore the journey of coding ....', 'this is for only the university students ..', 1, 3, 'given later (so pls wait for that....).', '2026-11-10', '2026-11-30', '2026-12-01', '2026-12-02', '2026-12-05', 'https://classroom.google.com/', 500.00, 20, '500 tk with certificate', '3000 tk with certificate', '1000 tk with certificate', 'organaizer@gmail.com', '01615056277', NULL, 'approved', NULL, NULL, NULL, '2026-11-10 01:08:00', '2026-11-10 02:59:03'),
(2, 3, 'Intra University Hackathon ', 'Programming', 'https://th.bing.com/th/id/OIP.luZAYL5o0T9zdeE2VKz66QHaCR?w=350&h=107&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3', 'Hybrid', 'UITS Campus', 'for the university student only .. ', 'Student under graduation', 3, 5, 'follow the given rulebook', '2026-11-02', '2026-11-30', '2026-12-03', '2026-12-04', '2026-12-06', 'https://classroom.google.com/', 3000.00, 20, '5000 tk with certificate', '3000 tk with certificate', '1000 tk with certificate', 'organaizer@gmail.com', '01615056277', NULL, 'approved', NULL, NULL, NULL, '2026-11-10 13:01:14', '2026-11-10 13:02:03');

-- --------------------------------------------------------

--
-- Table structure for table `contest_registrations`
--

CREATE TABLE `contest_registrations` (
  `registration_id` int(10) UNSIGNED NOT NULL,
  `contest_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `result_status` enum('pending','participated','1st','2nd','3rd','not_participated') NOT NULL DEFAULT 'pending',
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `result_submitted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_registrations`
--

INSERT INTO `contest_registrations` (`registration_id`, `contest_id`, `user_id`, `result_status`, `registered_at`, `result_submitted_at`) VALUES
(1, 1, 2, '2nd', '2026-11-10 12:17:20', '2026-11-10 12:31:42');

-- --------------------------------------------------------

--
-- Table structure for table `organizer_profiles`
--

CREATE TABLE `organizer_profiles` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `photo_url` varchar(2048) DEFAULT NULL,
  `organization_name` varchar(200) DEFAULT NULL,
  `organization_type` varchar(100) DEFAULT NULL,
  `organization_website` varchar(2048) DEFAULT NULL,
  `about_organization` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizer_profiles`
--

INSERT INTO `organizer_profiles` (`user_id`, `phone`, `photo_url`, `organization_name`, `organization_type`, `organization_website`, `about_organization`) VALUES
(3, '0149233989', 'uploads/profiles/org_3_1794236937.jpg', 'UITS PROGRAMMING CLUB', 'University', 'https://open.spotify.com/playlist/37i9dQZF1E4mFcb8TyZl7v', 'This is a program which show how to work the robot. In this era..');

-- --------------------------------------------------------

--
-- Table structure for table `student_profiles`
--

CREATE TABLE `student_profiles` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `university` varchar(200) DEFAULT NULL,
  `photo_url` varchar(2048) DEFAULT NULL,
  `department` varchar(150) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `about` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_profiles`
--

INSERT INTO `student_profiles` (`user_id`, `phone`, `university`, `photo_url`, `department`, `skills`, `about`) VALUES
(2, '016150675656', 'uits', 'uploads/profiles/user_2_1794165974.jpg', 'Computer Science & Engineering', 'C++, React, Problem Solving', 'I enjoy programming, problem-solving, and participating in competitions.');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('student','organizer','admin') NOT NULL DEFAULT 'student',
  `account_status` enum('active','suspended') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`, `role`, `account_status`, `created_at`) VALUES
(1, 'Test Student', 'teststudent@gmail.com', '$2y$10$iTXiqPsNwBuZRFQ6GU8ig.xSNsKrSBtfEcmRyrerg8crxYqURlT.m', 'student', 'active', '2026-11-02 17:32:22'),
(2, 'Imtiaz Bin Hasn (nehal)', 'imtiaznehal2004@gmail.com', '$2y$10$/.uta7NAQo/W1v0ZmnIAge5PAk.H.COmYn1got0b6jCSLbP6bp78y', 'student', 'active', '2026-11-04 17:57:38'),
(3, 'Nehal', 'imtiazbinhasan2021@gmail.com', '$2y$10$v4CCQIcjCqC1Xab7zOJO0.BhXhvNG2559SjSKTghTgP/eDRSYfao6', 'organizer', 'active', '2026-11-04 18:48:45'),
(4, 'admin', 'admin@gmail.com', '$2y$10$n0PLcFi/bvgD6S.segDk/uhcj75mN0w9N1sy579nBvN7XWHZDZ/iC', 'admin', 'active', '2026-11-06 05:35:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contests`
--
ALTER TABLE `contests`
  ADD PRIMARY KEY (`contest_id`),
  ADD KEY `fk_contests_reviewer` (`reviewed_by`),
  ADD KEY `idx_contests_status` (`status`),
  ADD KEY `idx_contests_category` (`category`),
  ADD KEY `idx_contests_organizer` (`organizer_id`);

--
-- Indexes for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  ADD PRIMARY KEY (`registration_id`),
  ADD UNIQUE KEY `unique_contest_user` (`contest_id`,`user_id`),
  ADD KEY `idx_registration_user` (`user_id`);

--
-- Indexes for table `organizer_profiles`
--
ALTER TABLE `organizer_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `student_profiles`
--
ALTER TABLE `student_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contests`
--
ALTER TABLE `contests`
  MODIFY `contest_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  MODIFY `registration_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contests`
--
ALTER TABLE `contests`
  ADD CONSTRAINT `fk_contests_organizer` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_contests_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `contest_registrations`
--
ALTER TABLE `contest_registrations`
  ADD CONSTRAINT `fk_registration_contest` FOREIGN KEY (`contest_id`) REFERENCES `contests` (`contest_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_registration_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `organizer_profiles`
--
ALTER TABLE `organizer_profiles`
  ADD CONSTRAINT `fk_organizer_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_profiles`
--
ALTER TABLE `student_profiles`
  ADD CONSTRAINT `fk_student_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
