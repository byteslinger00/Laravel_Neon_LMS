-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2022 at 05:48 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rvtsmdqo_vw_diagnosiaziendale`
--

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `help_info` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `questionimage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT 0,
  `userid` int(10) UNSIGNED DEFAULT NULL,
  `test_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`test_id`)),
  `questiontype` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `questionpage` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `questionorder` int(11) DEFAULT NULL,
  `width` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indent` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `required` tinyint(1) NOT NULL DEFAULT 0,
  `more_than_one_answer` tinyint(1) NOT NULL DEFAULT 0,
  `fontsize` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titlelocation` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answerposition` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imageposition` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `help_info_location` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_width` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_width` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title_location` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_aligment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer_aligment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagefit` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagewidth` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageheight` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `columncount` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `logic` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `question_bg_color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `question`, `help_info`, `questionimage`, `score`, `userid`, `test_id`, `questiontype`, `questionpage`, `questionorder`, `width`, `indent`, `required`, `more_than_one_answer`, `fontsize`, `state`, `titlelocation`, `answerposition`, `imageposition`, `help_info_location`, `max_width`, `min_width`, `size`, `title_location`, `image_aligment`, `answer_aligment`, `imagefit`, `imagewidth`, `imageheight`, `columncount`, `content`, `logic`, `created_at`, `updated_at`, `deleted_at`, `question_bg_color`) VALUES
(729, '<p>question 3 radio bax 2 line ff; gg; HH; score 10,20,30</p>', NULL, '', 0, 1, '[\"65\",\"66\"]', '2', NULL, 728, '', '', 0, 0, '', 'deafult', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '[{\"label\":\"ff\",\"score\":\"10\",\"is_checked\":0},{\"label\":\"gg\",\"score\":\"20\",\"is_checked\":0},{\"label\":\"hh\",\"score\":\"30\",\"is_checked\":0},{\"col\":\"col-6\"},{\"display\":\"2\"}]', '[]', NULL, NULL, NULL, '#fff'),
(736, '<p>image sample 1</p>', NULL, '', 0, 1, '[\"48\"]', '3', NULL, 732, '', '', 0, 0, '', 'deafult', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '[{\"image\":[\"165690877769.png\",\"165690877759.png\",\"165690877751.png\",\"165690877773.png\"],\"score\":[\"10\",\"20\",\"30\",\"40\"]},{\"col\":\"col-12\"},{\"display\":\"1\"}]', '[]', NULL, '2022-07-15 11:07:45', '2022-07-15 11:07:45', '#fff'),
(740, '<p>QUESTION IMAGE -- 1</p>', '<p>DF</p>', '', 0, 1, '[\"65\",\"66\"]', '3', NULL, 733, '', '', 0, 0, '', 'deafult', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '[{\"image\":[\"165695102457.png\",\"165691572394.jpg\",\"165691565867.png\",\"165691565831.png\",\"165691565854.png\"],\"score\":[\"5\",\"4\",\"1\",\"2\",\"3\"]},{\"col\":\"col-12\"},{\"display\":\"1\"}]', '[[\"0\",\"728\",\"0\",[\"1\"]],[\"0\",\"729\",\"0\",[\"30\"]]]', NULL, NULL, NULL, '#fff'),
(742, '<p>QUESTION CHECKBOX&nbsp;FOR PROVA17MAZRO 2<img alt=\"\" src=\"http://localhost:8000/storage/photos/1/Capture1898988374.jpg\" style=\"height:181px; width:759px\" /></p>', '<p><img alt=\"\" src=\"http://localhost:8000/storage/photos/1/Capture1488378644.jpg\" style=\"height:181px; width:759px\" /></p>', '', 0, 1, '[\"1\",\"43\"]', '1', NULL, 734, '', '', 0, 0, '', 'deafult', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '[{\"label\":\"Check1\",\"score\":\"10\",\"is_checked\":0},{\"label\":\"Check2\",\"score\":\"20\",\"is_checked\":1},{\"label\":\"Check3\",\"score\":\"30\",\"is_checked\":0},{\"label\":\"Check4\",\"score\":\"40\",\"is_checked\":0},{\"col\":\"col-6\"},{\"display\":\"2\"}]', '[]', NULL, NULL, NULL, '#fff'),
(743, '<p>QUESTION RADIOGROUP FOR PROVA17MAZRO 2</p>', NULL, '', 0, 1, '[\"43\"]', '2', NULL, 735, '', '', 0, 0, '', 'deafult', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '[{\"label\":\"radio1\",\"score\":\"1\",\"is_checked\":0},{\"label\":\"radio2\",\"score\":\"2\",\"is_checked\":0},{\"label\":\"radio3\",\"score\":\"3\",\"is_checked\":0},{\"label\":\"radio4\",\"score\":\"4\",\"is_checked\":0},{\"col\":\"col-6\"},{\"display\":\"2\"}]', '[]', NULL, NULL, NULL, '#fff'),
(745, '<p>QUESTION MATRIX&nbsp;SINGLE FOR PROVA17MAZRO 2</p>', '', '', 0, 1, '[\"43\"]', '4', NULL, 736, '', '', 0, 0, '', 'default', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '<table id=\"add-matrix\" name=\"matrix\" data-id=\"745\" class=\"ml-2 table table-striped\">\n            <thead id=\"symbol_matrix_value\"><tr><th>Value in €</th></tr></thead>\n        <tr id=\"header_row_col1\"><th class=\"custom-hide\"></th><th class=\"\"></th><th scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label\">1990</label></th><th scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label\">1991</label></th></tr><tr id=\"mr1\"><td class=\"custom-hide\"><button class=\"hide_btn\" id=\"\"><i class=\"fa fa-trash\"></i></button></td><td scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label \">EARN</label></td><td class=\"col-3 custom-border\"><input id=\"q_id1\" type=\"text\" value=\"\" name=\"matrixtext1\" class=\"form-control radioselected d-inline  q_id7451\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id1\"></td><td class=\"col-3 custom-border\"><input id=\"q_id2\" type=\"text\" value=\"\" name=\"matrixtext1\" class=\"form-control radioselected d-inline  q_id7452\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id2\"></td></tr><tr id=\"mr2\"><td class=\"custom-hide\"><button class=\"hide_btn\" id=\"\"><i class=\"fa fa-trash\"></i></button></td><td scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label \">PAY</label></td><td class=\"col-3 custom-border\"><input id=\"q_id3\" type=\"text\" value=\"\" name=\"matrixtext2\" class=\"form-control radioselected d-inline  q_id7453\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id3\"></td><td class=\"col-3 custom-border\"><input id=\"q_id4\" type=\"text\" value=\"\" name=\"matrixtext2\" class=\"form-control radioselected d-inline  q_id7454\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id4\"></td></tr></table>', '[]', NULL, NULL, NULL, '#fff'),
(746, '<p>QUESTION MATRIX MULTIPLE&nbsp;FOR PROVA17MAZRO 2</p>', NULL, '', 0, 1, '[\"43\"]', '4', NULL, 738, '', '', 0, 0, '', 'deafult', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, '<table id=\"add-matrix\" name=\"matrix\" data-id=\"746\" class=\"ml-2 table table-striped\" matrix-type=\"radio\">\n            <thead id=\"symbol_matrix_value\"><tr><th>Value in €</th></tr></thead>\n        <tbody><tr id=\"header_row_col1\"><th class=\"custom-hide\"></th><th class=\"\"></th><th scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label\">2021</label></th><th scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label\">2022</label></th></tr><tr id=\"mr1\"><td class=\"custom-hide\"><button class=\"hide_btn\" id=\"\"><i class=\"fa fa-trash\"></i></button></td><td scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label \">EARN</label></td><td class=\"col-3 custom-border\"><input id=\"q_id1\" type=\"radio\" value=\"100\" name=\"matrixradio1\" class=\"form-control radioselected d-inline col-2 q_id7461\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id1\"><input type=\"text\" data-q_id=\"q_id1\" data-value=\"\" class=\"form-control col-10 d-inline radioscore\" value=\"100\" onchange=\"radioScore(this)\"></td><td class=\"col-3 custom-border\"><input id=\"q_id2\" type=\"radio\" value=\"200\" name=\"matrixradio1\" class=\"form-control radioselected d-inline col-2 q_id7462\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id2\"><input type=\"text\" data-q_id=\"q_id2\" data-value=\"\" class=\"form-control col-10 d-inline radioscore\" value=\"200\" onchange=\"radioScore(this)\"></td></tr><tr id=\"mr2\"><td class=\"custom-hide\"><button class=\"hide_btn\" id=\"\"><i class=\"fa fa-trash\"></i></button></td><td scope=\"row\" class=\"custom-border\"><label contenteditable=\"false\" class=\"form-label \">PAY</label></td><td class=\"col-3 custom-border\"><input id=\"q_id3\" type=\"radio\" value=\"300\" name=\"matrixradio2\" class=\"form-control radioselected d-inline col-2 q_id7463\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id3\"><input type=\"text\" data-q_id=\"q_id3\" data-value=\"\" class=\"form-control col-10 d-inline radioscore\" value=\"300\" onchange=\"radioScore(this)\"></td><td class=\"col-3 custom-border\"><input id=\"q_id4\" type=\"radio\" value=\"400\" name=\"matrixradio2\" class=\"form-control radioselected d-inline col-2 q_id7464\" onchange=\"inputToData(this)\" data-questiontype=\"€\" data-value=\"\" data-selected=\"false\" data-q_id=\"q_id4\"><input type=\"text\" data-q_id=\"q_id4\" data-value=\"\" class=\"form-control col-10 d-inline radioscore\" value=\"400\" onchange=\"radioScore(this)\"></td></tr></tbody></table>', '[]', NULL, NULL, NULL, '#fff'),
(758, '<p>Question File</p>', '', '', 0, 1, '[\"1\"]', '7', NULL, 739, '', '', 0, 0, '', 'default', 'col-12 order-1', 'col-12 order-3', 'col-12 order-2', '', '', '', '', NULL, 'col-12', 'offset-md-0', '0', '', '', NULL, NULL, '[]', NULL, NULL, NULL, '#fff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`) USING BTREE,
  ADD KEY `multiquestions_userid_foreign` (`userid`) USING BTREE,
  ADD KEY `multiquestions_deleted_at_index` (`deleted_at`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=759;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `multiquestions_userid_foreign` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
