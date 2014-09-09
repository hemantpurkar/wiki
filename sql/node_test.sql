-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 09, 2014 at 01:50 PM
-- Server version: 5.5.24-log
-- PHP Version: 5.4.3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `node_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE IF NOT EXISTS `documents` (
  `document_id` int(11) NOT NULL,
  `document_name` varchar(100) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`document_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `text` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) NOT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`event_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=49 ;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `start_date`, `end_date`, `text`, `type`, `userId`, `is_deleted`) VALUES
(20, '2014-07-01 00:00:00', '2014-07-06 00:05:00', 'New event', 1, 1, 0),
(21, '2014-08-15 00:00:00', '2014-08-16 00:00:00', 'Holiday - Independence Day', 5, 5, 0),
(47, '2014-09-25 00:00:00', '2014-09-27 00:00:00', 'Long Leaves - User3', 7, 6, 0),
(23, '2014-08-29 00:00:00', '2014-08-30 00:00:00', 'My holiday', 7, 5, 0),
(24, '2014-09-04 03:00:00', '2014-09-04 03:30:00', 'Weekly report meeting', 2, 6, 0),
(25, '2014-09-11 00:00:00', '2014-09-15 00:00:00', 'Sprint - 1.10', 5, 6, 0),
(26, '2014-09-15 00:00:00', '2014-09-18 00:00:00', 'Sprint 1.11', 8, 6, 0),
(48, '2014-09-29 10:00:00', '2014-10-01 18:00:00', 'Node JS training session', 3, 5, 0);

-- --------------------------------------------------------

--
-- Table structure for table `event_type`
--

CREATE TABLE IF NOT EXISTS `event_type` (
  `event_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_type` varchar(150) DEFAULT NULL,
  `event_color` varchar(25) NOT NULL DEFAULT '#698490',
  `is_deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`event_type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `event_type`
--

INSERT INTO `event_type` (`event_type_id`, `event_type`, `event_color`, `is_deleted`) VALUES
(2, 'Meeting', '#996666', 0),
(3, 'Training', '#698490', 1),
(4, 'Leave', '#990000', 0),
(5, 'Sprint', '#a36800', 0),
(6, 'Release management', '#FF00FF', 0),
(7, 'Holiday', '#FF0000', 0),
(8, 'Event  90', '#330000', 1),
(9, 'trtgdggsdf RRT', '#FF3300', 1),
(10, 'Tests 45 5', '#009999', 1),
(11, 'xczxczxc', '#003399', 1),
(12, 'vvvv', '#33FF00', 1),
(13, 'RTfdsdf', '#0033FF', 1),
(14, 'Rgfgs', '#0066FF', 1),
(15, 'TTTT', '#00FFFF', 1),
(16, 'E1', '#111111', 1),
(17, 'cdzczc', '#003399', 1),
(18, 'xczxcz', '#0066FF', 1),
(19, 'Test fff', '#000033', 1),
(20, 'CRT', '#006699', 1),
(21, 'Test456', '#339900', 0);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `group_id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  `group_email` varchar(100) DEFAULT NULL,
  `group_desc` tinytext,
  `created_by` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_on` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Table to contain user group information' AUTO_INCREMENT=40 ;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`group_id`, `group_name`, `group_email`, `group_desc`, `created_by`, `created_on`, `updated_on`, `is_deleted`) VALUES
(1, 'Web Player Test', '', '', 6, '2014-09-08 06:28:11', '2014-09-04 13:21:46', 1),
(2, 'Gin team', '', '', 6, '2014-09-08 06:28:05', '2014-09-04 13:24:36', 1),
(3, 'Web Player 45', '', '', 6, '2014-09-08 06:28:09', '2014-09-05 04:24:09', 1),
(4, 'barista', '', '', 6, '2014-09-08 06:27:58', '2014-09-05 04:28:01', 1),
(5, 'Bar1', 'ERGG@adad.com', '', 6, '2014-09-08 06:27:52', '2014-09-08 04:15:48', 1),
(6, 'hello group', '', '', 6, '2014-09-08 06:28:07', '2014-09-05 07:11:27', 1),
(7, 'Web Player Test 56', '', '', 6, '2014-09-08 06:28:23', '2014-09-05 04:33:30', 1),
(8, 'Ct', '', '', 6, '2014-09-08 06:28:01', '2014-09-05 04:34:55', 1),
(9, 'Gin team 45', '', '', 6, '2014-09-08 06:28:04', '2014-09-05 04:36:30', 1),
(10, 'tyuu', '', '', 6, '2014-09-08 06:28:12', '2014-09-05 04:37:20', 1),
(11, 'Bar14', '', '', 6, '2014-09-08 06:27:57', '2014-09-05 04:38:57', 1),
(12, 'Web Player Test  77', '', '', 6, '2014-09-08 06:28:20', '2014-09-05 04:40:56', 1),
(13, 'Web Player Test 56', '', '', 6, '2014-09-08 06:28:32', '2014-09-05 04:44:21', 1),
(14, 'Web Player Test 34', '', '', 6, '2014-09-08 06:28:17', '2014-09-05 04:45:42', 1),
(15, 'Web Player Test 34', '', '', 6, '2014-09-08 06:28:18', '2014-09-05 04:47:42', 1),
(16, 'FR', '', '', 6, '2014-09-08 06:28:00', '2014-09-05 04:54:59', 1),
(17, 'Web Player Test 1', '', '', 6, '2014-09-08 06:28:14', '2014-09-05 04:56:03', 1),
(18, 'Web Player Test 1', '', '', 6, '2014-09-08 06:28:15', '2014-09-05 04:58:03', 1),
(19, 'Web Player Test 35', '', '', 6, '2014-09-08 06:28:21', '2014-09-05 05:04:18', 1),
(20, 'Web Player Test 383', '', '', 6, '2014-09-08 06:28:25', '2014-09-05 05:05:21', 1),
(21, 'Web Player Test 73', '', '', 6, '2014-09-08 06:28:30', '2014-09-05 05:06:53', 1),
(22, 'Bar1 46', '', '', 6, '2014-09-08 06:27:55', '2014-09-05 05:11:54', 1),
(23, 'Web Player Test 578', '', '', 6, '2014-09-08 06:28:28', '2014-09-05 05:13:56', 1),
(24, 'Web Player Test 5698', '', '', 6, '2014-09-08 06:28:27', '2014-09-05 05:48:07', 1),
(25, 'Web Player Test 777', '', '', 6, '2014-09-08 06:28:43', '2014-09-05 05:48:43', 1),
(26, 'Bar1', '', '', 6, '2014-09-08 06:27:53', '2014-09-05 06:16:09', 1),
(27, 'Web Player Test 777', '', '', 6, '2014-09-08 06:28:35', '2014-09-05 06:18:20', 1),
(28, 'Web Player Test 777', '', '', 6, '2014-09-08 06:28:37', '2014-09-05 06:53:51', 1),
(29, 'Web Player Test 777', '', '', 6, '2014-09-08 06:28:39', '2014-09-05 07:00:11', 1),
(30, 'Web Player Test 8', '', '', 6, '2014-09-08 06:28:42', '2014-09-05 10:36:05', 1),
(31, 'G1', 'G1@test.com', NULL, 6, '2014-09-08 06:28:02', '2014-09-08 04:16:11', 1),
(32, 'A1', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:22:40', '2014-09-08 05:55:29', 1),
(33, 'A2', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:25:48', '2014-09-08 06:02:44', 1),
(34, 'A3', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:25:51', '2014-09-08 06:07:24', 1),
(35, 'A4', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:28:48', '2014-09-08 06:09:05', 1),
(36, 'A5', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:28:46', '2014-09-08 06:11:42', 1),
(37, 'A6', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:28:45', '2014-09-08 06:26:50', 1),
(38, 'Web Player Backend', 'hemantp@smartek21.com', NULL, 6, '2014-09-08 06:29:23', '2014-09-08 06:29:23', 0),
(39, 'Web player frontend', 'webplayer_frontend@yopmail.com', NULL, 6, '2014-09-08 06:44:40', '2014-09-08 06:44:40', 0);

-- --------------------------------------------------------

--
-- Table structure for table `group_users`
--

CREATE TABLE IF NOT EXISTS `group_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  `is_lead` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=172 ;

--
-- Dumping data for table `group_users`
--

INSERT INTO `group_users` (`id`, `user_id`, `group_id`, `is_lead`) VALUES
(1, 2, 2, 0),
(2, 8, 2, 0),
(3, 1, 3, 0),
(4, 2, 3, 0),
(5, 1, 4, 0),
(6, 2, 4, 0),
(7, 3, 4, 0),
(12, 1, 6, 0),
(13, 2, 6, 0),
(14, 3, 6, 0),
(15, 7, 6, 0),
(16, 8, 6, 0),
(17, 1, 7, 0),
(18, 7, 7, 0),
(19, 8, 7, 0),
(20, 1, 8, 0),
(21, 2, 8, 0),
(22, 7, 8, 0),
(23, 8, 8, 0),
(24, 1, 9, 0),
(25, 2, 9, 0),
(26, 7, 9, 0),
(27, 8, 9, 0),
(28, 2, 10, 0),
(29, 3, 10, 0),
(30, 8, 10, 0),
(31, 1, 11, 0),
(32, 2, 11, 0),
(33, 7, 11, 0),
(34, 8, 11, 0),
(35, 2, 12, 0),
(36, 3, 12, 0),
(37, 4, 12, 0),
(38, 7, 12, 0),
(39, 8, 12, 0),
(40, 4, 13, 0),
(41, 7, 13, 0),
(42, 8, 13, 0),
(43, 1, 14, 0),
(44, 7, 14, 0),
(45, 1, 15, 0),
(46, 7, 15, 0),
(47, 1, 16, 0),
(48, 7, 16, 0),
(49, 4, 17, 0),
(50, 7, 17, 0),
(51, 8, 17, 0),
(52, 4, 18, 0),
(53, 7, 18, 0),
(54, 8, 18, 0),
(55, 1, 19, 0),
(56, 2, 19, 0),
(57, 8, 19, 0),
(58, 1, 20, 0),
(59, 2, 20, 0),
(60, 7, 20, 0),
(61, 8, 20, 0),
(62, 1, 21, 0),
(63, 2, 21, 0),
(64, 7, 21, 0),
(65, 8, 21, 0),
(66, 1, 22, 0),
(67, 7, 22, 0),
(68, 8, 22, 0),
(69, 1, 23, 0),
(70, 2, 23, 0),
(71, 7, 23, 0),
(72, 8, 23, 0),
(74, 1, 24, 0),
(75, 2, 24, 0),
(76, 7, 24, 0),
(77, 8, 24, 0),
(78, 5, 24, 1),
(79, 1, 25, 1),
(80, 7, 25, 0),
(81, 8, 25, 0),
(82, 1, 26, 1),
(83, 2, 26, 0),
(84, 3, 26, 0),
(85, 7, 26, 0),
(86, 8, 26, 0),
(87, 1, 27, 0),
(88, 7, 27, 0),
(89, 8, 27, 0),
(90, 5, 27, 1),
(91, 5, 28, 0),
(92, 1, 28, 0),
(93, 3, 28, 0),
(94, 7, 28, 0),
(95, 8, 28, 0),
(96, 4, 28, 1),
(97, 5, 29, 1),
(98, 1, 29, 0),
(99, 3, 29, 0),
(100, 4, 29, 0),
(101, 7, 29, 0),
(102, 8, 29, 0),
(144, 1, 30, 0),
(145, 3, 30, 0),
(146, 7, 30, 0),
(147, 8, 30, 0),
(148, 5, 30, 1),
(155, 5, 5, 0),
(156, 2, 5, 0),
(157, 3, 5, 1),
(158, 5, 31, 0),
(159, 1, 31, 0),
(160, 2, 31, 0),
(161, 3, 31, 0),
(162, 4, 31, 1),
(163, 7, 31, 0),
(164, 8, 31, 0),
(165, 10, 36, 1),
(166, 1, 37, 0),
(167, 10, 37, 1),
(168, 1, 38, 0),
(169, 10, 38, 1),
(170, 2, 39, 0),
(171, 9, 39, 1);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE IF NOT EXISTS `permissions` (
  `perm_id` int(11) NOT NULL,
  `perm_desc` varchar(50) NOT NULL,
  `is_active` int(1) NOT NULL DEFAULT '1' COMMENT '0:Inactive, 1:Active',
  PRIMARY KEY (`perm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table to contain list of Permissions';

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(125) NOT NULL,
  `is_admin` int(1) NOT NULL DEFAULT '0' COMMENT '0:Normal User, 1:Administrator',
  `is_deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `email`, `is_admin`, `is_deleted`) VALUES
(1, 'user1', '827ccb0eea8a706c4c34a16891f84e7b', 'user1@yopmail.com', 0, 0),
(2, 'user2', '827ccb0eea8a706c4c34a16891f84e7b', 'user2@yopmail.com', 0, 0),
(3, 'user3', '827ccb0eea8a706c4c34a16891f84e7b', 'user3@yopmail.com', 0, 0),
(4, 'user4', '827ccb0eea8a706c4c34a16891f84e7b', 'user4@yopmail.com', 0, 0),
(5, 'hemant3', '827ccb0eea8a706c4c34a16891f84e7b', 'hemant3@yopmail.com', 0, 0),
(6, 'admin', '827ccb0eea8a706c4c34a16891f84e7b', 'admin@yopmail.com', 1, 0),
(7, 'user5', '827ccb0eea8a706c4c34a16891f84e7b', 'user5@yopmail.com', 0, 0),
(8, 'user6', '827ccb0eea8a706c4c34a16891f84e7b', 'user6@yopmail.com', 0, 0),
(9, 'hemant2', 'cc4a2c1a9521bbfeb2554a2f8597539f', 'hemant2@yopmail.com', 0, 0),
(10, 'hemant1', '827ccb0eea8a706c4c34a16891f84e7b', 'hemant1@yopmail.com', 0, 0),
(11, 'test', 'a05783f07a0c24763903298e936e83be', 'test@test.com', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE IF NOT EXISTS `user_permissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Mapping between user/user group and their permissions';

-- --------------------------------------------------------

--
-- Table structure for table `wiki`
--

CREATE TABLE IF NOT EXISTS `wiki` (
  `wiki_id` int(11) NOT NULL AUTO_INCREMENT,
  `wiki_title` varchar(150) DEFAULT NULL,
  `wiki_content` text,
  `created_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_id` int(11) NOT NULL,
  `wiki_type` int(11) NOT NULL DEFAULT '1',
  `home_page` int(1) NOT NULL DEFAULT '0',
  `wiki_active` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`wiki_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=56 ;

--
-- Dumping data for table `wiki`
--

INSERT INTO `wiki` (`wiki_id`, `wiki_title`, `wiki_content`, `created_date`, `updated_date`, `user_id`, `wiki_type`, `home_page`, `wiki_active`) VALUES
(1, 'hello latest page !!!', '<p><span style="background-color: #ff9900;"><strong>hello latest page &nbsp;</strong></span></p>\r\n<p><span style="color: #888888; background-color: #ff0000;"><strong>Text in red !!!!</strong></span></p>\r\n<p>&nbsp;</p>', '2014-08-25 11:37:04', '2014-09-05 09:42:20', 6, 1, 1, 1),
(11, 'hello latest page', '<p><span style="background-color: #ff9900;"><strong>hello latest page</strong></span></p>', '2014-08-26 12:30:01', '2014-08-26 12:30:01', 5, 1, 0, 1),
(15, 'This is final test', '<p>This is final test</p>', '2014-08-27 10:30:37', '2014-08-27 13:01:45', 7, 1, 1, 1),
(16, 'One more test', '<p>One more test</p>', '2014-08-27 10:32:15', '2014-08-27 12:56:02', 5, 1, 1, 1),
(17, 'Good test it ', '<p>Good test it&nbsp;</p>', '2014-08-27 10:51:21', '2014-08-27 12:55:36', 5, 1, 1, 1),
(34, 'Wiki page with atttachment', '<p><span style="font-size: small;">Wiki page with atttachment </span>: <span style="background-color: #ff0000;">Check it out !!!</span></p>\r\n<p>&nbsp;SERT</p>', '2014-09-02 05:19:55', '2014-09-02 10:20:16', 6, 1, 1, 1),
(35, 'Server Request Form', '<p align="center">&nbsp;</p>\r\n<p align="center"><strong><span style="text-decoration: underline;">&nbsp;</span></strong></p>\r\n<table style="width: 649px;" border="1" cellspacing="0" cellpadding="0">\r\n<tbody>\r\n<tr>\r\n<td colspan="2" valign="bottom" nowrap="nowrap" width="649">\r\n<p align="center"><strong><span style="text-decoration: underline;">Server Request Form</span></strong></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Request Date</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>20-Nov-13</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Project Name</p>\r\n<p>&nbsp;</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Wiki App</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Project Manager Name</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Venkateswaran R</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Project Manager Email</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>venkateswaranr@smartek21.com</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Primary Contact Number</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>+919840348405</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Server&rsquo;s Preferred Location</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>India</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>If its Cloud Server please specify Region</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Choose an item.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Who will be the person responsible</p>\r\n<p>for software installation and support</p>\r\n<p>(Name and Email ID)</p>\r\n<p>If SCSIT please mention scsit@smartek21.com</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>scsit@smartek21.com</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Server Usage</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Test/Development</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p><strong>Server Configuration <br /> (Ram above 16GB will need approval from Manager)</strong></p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p><strong>Operating System&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : Linux - 64 Bit</strong></p>\r\n<p><strong>If Linux(Please specify Package ) : Ubuntu Server 14.04.1&nbsp; LTS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </strong></p>\r\n<p><strong>No. of Processors&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : 2</strong></p>\r\n<p><strong>RAM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 8GB</strong></p>\r\n<p><strong>Virtual or Physical&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : Virtual</strong></p>\r\n<p><strong>OS Drive Size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : 50GB</strong></p>\r\n<p><strong>Data Drive Size&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : 100GB</strong></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>List the other applications required</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>1-</p>\r\n<p>2-</p>\r\n<p>3-</p>\r\n<p>4-</p>\r\n<p>5-</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Do you require DB?</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>MySQL</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Does the Server need internet access and public URL?</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Yes</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Do you required Backup?</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Yes</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>List of users who needs access</p>\r\n<p>&lt;Domain&gt;\\&lt;Username&gt;</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>1- venkateswaranr@smartek21.com</p>\r\n<p>2- hemantp@smartek21.com</p>\r\n<p>3-</p>\r\n<p>4-</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Does the hosted application need public URL,&nbsp; If Yes please specify reason and the Port to be mapped with public IP and the DNS you would need in the format (&lt;XXX&gt;.smartek.co.in)</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p><br /> No<br /> <br /> <br /> <strong>Reason:</strong></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Does the server needs RDP/SSH access over WAN?</p>\r\n<p>If yes please specify the reason</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>\r\n<p>&nbsp;</p>\r\n<p><strong>Reason: </strong></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Will there be a setup instruction document for the application.</p>\r\n<p>(If Yes, please send it to <a href="mailto:scsit@smartek21.com">scsit@smartek21.com</a>)</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>Choose an item.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td valign="top" nowrap="nowrap" width="257">\r\n<p>Please specify the End Date for usage of this server, The User /Manager need to keep&nbsp; <a href="mailto:scsit@smartek21.com">scsit@smartek21.com</a>&nbsp; informed for extensions else the server will be closed automatically after the end date without prior notice.</p>\r\n</td>\r\n<td valign="top" nowrap="nowrap" width="392">\r\n<p>31-Dec-14</p>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p align="center"><strong><span style="text-decoration: underline;">&nbsp;</span></strong></p>\r\n<p><strong><span style="text-decoration: underline;"><br clear="all" /> </span></strong></p>\r\n<p><strong><span style="text-decoration: underline;">&nbsp;</span></strong></p>\r\n<p><strong><span style="text-decoration: underline;">Terms:</span></strong></p>\r\n<ul>\r\n<li>Manager&rsquo;s /Lead need to send the filled form in PDF format to <a href="mailto:scsit@smartek21.com">scsit@smartek21.com</a> .</li>\r\n<li>IT will not allocate the server if the form is not filled.</li>\r\n<li>All fields are Mandatory.</li>\r\n<li>IT will provide an SLA for setting up the server.</li>\r\n<li>Any change request in configuration after the equipment allocation will need minimum of 45 days to process.</li>\r\n</ul>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>\r\n<p><strong><span style="text-decoration: underline;">Accepted by PM /Lead Name:</span></strong></p>\r\n<p><strong><span style="text-decoration: underline;">Name:</span></strong></p>', '2014-09-03 06:38:35', '2014-09-04 08:41:25', 6, 1, 1, 1),
(36, 'Test Full page', '<p>Test FG GC</p>', '2014-09-03 13:03:00', '2014-09-03 13:04:46', 6, 1, 1, 1),
(37, 'Risk Register', '<table style="height: 186px; width: 497px;" border="1">\r\n<tbody>\r\n<tr>\r\n<td>Id</td>\r\n<td>Risk Identified</td>\r\n<td>Risk Severity</td>\r\n<td>Probability</td>\r\n<td>Impact</td>\r\n</tr>\r\n<tr>\r\n<td>1</td>\r\n<td>No VPN for team&nbsp;</td>\r\n<td>High</td>\r\n<td>10</td>\r\n<td>10</td>\r\n</tr>\r\n<tr>\r\n<td>&nbsp;</td>\r\n<td>&nbsp;</td>\r\n<td>&nbsp;</td>\r\n<td>&nbsp;</td>\r\n<td>&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>', '2014-09-04 09:01:29', '2014-09-05 09:57:50', 6, 1, 1, 1),
(38, 'New Wiki Venky', '<p>New Wiki Venky</p>', '2014-09-05 09:58:18', '2014-09-05 10:46:48', 6, 1, 1, 1),
(39, 'Risk Register 789', '<p>New Wiki Venky</p>', '2014-09-05 10:00:08', '2014-09-05 10:45:05', 6, 1, 1, 1),
(40, 'asdasd', '<p>asdasdasd</p>', '2014-09-05 10:02:48', '2014-09-05 10:02:48', 6, 1, 1, 1),
(41, 'Email Wiki', '<p>Email Wiki&nbsp;Email Wiki&nbsp;Email Wiki&nbsp;Email Wiki</p>', '2014-09-08 06:54:41', '2014-09-08 06:54:41', 6, 1, 0, 1),
(42, 'Email Wiki 2', '<p>Email Wiki 2&nbsp;<strong>Email Wiki 2</strong></p>', '2014-09-08 07:17:42', '2014-09-08 07:17:42', 6, 1, 0, 1),
(43, 'Email Wiki 3', '<p>Email Wiki 3&nbsp;Email Wiki 3&nbsp;Email Wiki 3</p>', '2014-09-08 07:24:21', '2014-09-08 07:24:21', 6, 1, 0, 1),
(44, 'Email Wiki 4', '<p>Email Wiki 4</p>', '2014-09-08 07:25:02', '2014-09-08 07:25:02', 6, 1, 0, 1),
(45, 'Email Wiki 5', '<p>Email Wiki 5</p>', '2014-09-08 07:45:44', '2014-09-08 07:45:44', 6, 1, 0, 1),
(46, 'Email Wiki 6', '<p>Email Wiki 6</p>', '2014-09-08 07:58:04', '2014-09-08 07:58:04', 6, 1, 0, 1),
(47, 'Email Wiki 7', '<p>Email Wiki 7&nbsp;Email Wiki 7&nbsp;Email Wiki 7&nbsp;Email &nbsp;Email 7</p>', '2014-09-08 08:00:51', '2014-09-08 08:00:51', 6, 1, 0, 1),
(48, 'Email Wiki 8', '<p>Email test</p>', '2014-09-08 08:23:44', '2014-09-08 08:23:44', 6, 1, 0, 1),
(49, 'Email Wiki 9', '<p>Email Wiki 9&nbsp;Email Wiki 9&nbsp;Email Wiki 9</p>', '2014-09-08 08:24:47', '2014-09-08 08:24:47', 6, 1, 0, 1),
(50, 'Email Wiki 11', '<p>Email Wiki 11</p>', '2014-09-08 08:37:13', '2014-09-08 08:46:09', 6, 1, 0, 1),
(51, 'Email Wiki 11', '<p>Email Wiki 11 &nbsp;Changed</p>', '2014-09-08 09:29:18', '2014-09-09 12:14:20', 6, 1, 0, 1),
(52, 'Email Wiki 202', '<p>Hello All,</p>\r\n<p>Kindly find the MOM for today&rsquo;s stand up call:</p>\r\n<table style="width: 494px;" border="1" cellspacing="0" cellpadding="0"><colgroup><col width="122" /><col width="128" /><col width="71" /><col width="173" /></colgroup>\r\n<tbody>\r\n<tr style="background-color: #3db7c2;">\r\n<td class="xl66" style="text-align: center;" colspan="4" height="25"><span style="color: #000000;">Meeting Minutes&nbsp;&nbsp;</span></td>\r\n</tr>\r\n<tr>\r\n<td class="xl67" width="122" height="52">Subject</td>\r\n<td class="xl68" width="128">Discussion on web player project requirements</td>\r\n<td class="xl69" width="71">Date</td>\r\n<td class="xl70" align="right" width="173">02-08-2014</td>\r\n</tr>\r\n<tr>\r\n<td class="xl71" width="122" height="35">Facilitator</td>\r\n<td class="xl72" width="128">Zaheer Syed</td>\r\n<td class="xl71" width="71">Time</td>\r\n<td class="xl73" width="173">11.10 AM to 11.20 AM <br /> IST</td>\r\n</tr>\r\n<tr>\r\n<td class="xl71" width="122" height="21">Location</td>\r\n<td class="xl74" width="128">VOIP - 408</td>\r\n<td class="xl71" width="71">Scribe</td>\r\n<td class="xl75" width="173">&nbsp;</td>\r\n</tr>\r\n<tr>\r\n<td class="xl71" width="122" height="21">Attendees</td>\r\n<td class="xl76" colspan="3" width="372">Zaheer, Ranjan, Sandipan, Surya, Hemant</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>&nbsp;</p>\r\n<table style="width: 436px;" border="1" cellspacing="0" cellpadding="0"><colgroup><col width="64" /> <col width="154" /> <col width="218" /> </colgroup>\r\n<tbody>\r\n<tr style="background-color: #40adbf;">\r\n<td class="xl70" style="text-align: center;" colspan="3" width="436" height="21">Key Points Discussed</td>\r\n</tr>\r\n<tr>\r\n<td class="xl65" style="text-align: center;" width="64" height="20">No.</td>\r\n<td class="xl66" style="text-align: center;" width="154">Topic</td>\r\n<td class="xl66" style="text-align: center;" width="218">Highlights</td>\r\n</tr>\r\n<tr>\r\n<td class="xl67" style="text-align: center;" width="64" height="34">1</td>\r\n<td class="xl69" width="154">Unit test cases</td>\r\n<td class="xl68" width="218">Remove xdescribe and execute these test cases</td>\r\n</tr>\r\n<tr>\r\n<td class="xl67" style="text-align: center;" width="64" height="20">2</td>\r\n<td class="xl69" width="154">Integration test cases</td>\r\n<td class="xl68" width="218">e2e test case stabilization</td>\r\n</tr>\r\n<tr>\r\n<td class="xl67" style="text-align: center;" width="64" height="34">3</td>\r\n<td class="xl69" width="154">Next track and log event&nbsp;</td>\r\n<td class="xl68" width="218">To be discussed in detail in a separate call with Ranjan</td>\r\n</tr>\r\n<tr>\r\n<td class="xl67" style="text-align: center;" width="64" height="34">5</td>\r\n<td class="xl69" width="154">UI testing</td>\r\n<td class="xl68" width="218">To be discussed in detail in a separate call with Surya</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>&nbsp;</p>\r\n<table style="width: 489px;" border="1" cellspacing="0" cellpadding="0"><colgroup><col width="64" /> <col width="178" /> <col width="108" /> <col width="139" /> </colgroup>\r\n<tbody>\r\n<tr style="background-color: #42a9bc;">\r\n<td class="xl70" style="text-align: center;" colspan="4" width="489" height="20">Action Plan</td>\r\n</tr>\r\n<tr>\r\n<td class="xl68" style="text-align: center;" width="64" height="20">No.&nbsp;</td>\r\n<td class="xl68" style="text-align: center;" width="178">Action Item(s)</td>\r\n<td class="xl68" style="text-align: center;" width="108">Owner</td>\r\n<td class="xl68" style="text-align: center;" width="139">Target Date</td>\r\n</tr>\r\n<tr>\r\n<td class="xl65" style="text-align: center;" width="64" height="34">1</td>\r\n<td class="xl69" width="178">Unit test and e2e test cases</td>\r\n<td class="xl65" width="108">Hemant/Sandipan</td>\r\n<td class="xl67" align="right" width="139">02-07-2014</td>\r\n</tr>\r\n<tr>\r\n<td class="xl65" style="text-align: center;" width="64" height="85">4</td>\r\n<td class="xl66" width="178">Next track and log event related changes and inputs to be discussed in separate call and work on the next given things after call</td>\r\n<td class="xl65" width="108">Ranjan</td>\r\n<td class="xl67" align="right" width="139">02-07-2014</td>\r\n</tr>\r\n<tr>\r\n<td class="xl65" style="text-align: center;" width="64" height="85">5</td>\r\n<td class="xl66" width="178">UI testing related changes and inputs to be discussed in separate call and work on the next given things after call</td>\r\n<td class="xl65" width="108">Surya</td>\r\n<td class="xl67" align="right" width="139">02-07-2014</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<p>Thanks,</p>\r\n<p>Hemant D. Purkar</p>', '2014-09-08 09:37:43', '2014-09-09 12:51:28', 6, 1, 0, 1),
(53, 'Recent on 9th Sept', '<p>Recent on 9th Sept page</p>', '2014-09-09 12:15:48', '2014-09-09 12:15:48', 6, 1, 0, 1),
(54, 'L1', '<p>L116</p>', '2014-09-09 12:46:51', '2014-09-09 12:49:35', 6, 1, 0, 1),
(55, 'F', '<p>FFF</p>', '2014-09-09 13:02:21', '2014-09-09 13:02:21', 6, 1, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `wiki_documents`
--

CREATE TABLE IF NOT EXISTS `wiki_documents` (
  `document_id` int(11) NOT NULL AUTO_INCREMENT,
  `document_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `wiki_id` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` int(1) NOT NULL,
  PRIMARY KEY (`document_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Dumping data for table `wiki_documents`
--

INSERT INTO `wiki_documents` (`document_id`, `document_name`, `original_name`, `mime_type`, `wiki_id`, `created_on`, `is_active`) VALUES
(6, '1409653182__e32af6f03761afb2bf96177d8810fa94.xls', 'JIRA.xls', 'application/vnd.ms-excel', 34, '2014-09-02 10:19:41', 1),
(7, '1409653216__e6335441604e8234a68c55eef7d47b71.pdf', 'MobileBill-112-101622789.pdf', 'application/pdf', 34, '2014-09-02 10:20:16', 1),
(8, '1409820085__b81323a6996dd3c8aae932388a01e44c.xlsx', 'test_statistics - Copy.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 35, '2014-09-04 08:41:25', 1),
(10, '1410172956__78c40cf10b0d5f6512de8c2b8710519d.xls', 'MOM.xls', 'application/vnd.ms-excel', 52, '2014-09-08 10:42:36', 1),
(11, '1410237873__bf8d4fbcd99ffb5f83daced73ff5ef90.xlsx', 'leave_plan.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 52, '2014-09-09 04:44:32', 1);

-- --------------------------------------------------------
--
-- Table structure for table `wiki_type`
--

CREATE TABLE IF NOT EXISTS `wiki_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `wiki_type` varchar(150) DEFAULT NULL,
  `is_deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `wiki_type`
--

INSERT INTO `wiki_type` (`type_id`, `wiki_type`, `is_deleted`) VALUES
(1, 'Page', 0),
(2, 'Blog', 0),
(3, 'GeTy23378', 1),
(4, 'Rtyunnvn', 1),
(5, 'dfgdfgdfg', 1),
(6, 'Fsdfsdf', 1),
(7, 'sdfsdfsdf', 1),
(8, 'hello ', 1),
(9, 'Ttetd', 1),
(10, 'Rwtwt', 1),
(11, 'Test 28 7', 1),
(12, 'vv', 1),
(13, 'RTwsfdfsdf', 1),
(14, 'Test fff', 1),
(15, 'Test', 1),
(16, 'Test', 1),
(17, 'Test1', 1),
(18, 'Test3', 1),
(19, 'Test5', 1),
(20, 'Test7', 1),
(21, 'Test6', 1),
(22, 'p1', 1),
(23, 'p2', 1),
(24, 'p3', 1),
(25, 'p4', 1),
(26, 'p5', 1),
(27, 'p6', 1),
(28, 'p7', 0),
(29, 'p8', 0),
(30, 'TyeG', 0);

-- --------------------------------------------------------

--
-- Table structure for table `wiki_users`
--

CREATE TABLE IF NOT EXISTS `wiki_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wiki_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=100 ;

--
-- Dumping data for table `wiki_users`
--

INSERT INTO `wiki_users` (`id`, `wiki_id`, `group_id`) VALUES
(12, 37, 5),
(13, 37, 22),
(14, 37, 16),
(15, 37, 7),
(16, 37, 24),
(17, 37, 27),
(18, 37, 29),
(32, 40, 15),
(33, 40, 13),
(34, 40, 25),
(35, 40, 30),
(41, 39, 30),
(42, 38, 5),
(43, 38, 4),
(44, 38, 9),
(45, 38, 21),
(46, 38, 25),
(47, 38, 28),
(48, 38, 29),
(49, 38, 30),
(50, 41, 38),
(51, 41, 39),
(52, 42, 38),
(53, 43, 38),
(54, 43, 39),
(55, 44, 38),
(56, 45, 38),
(57, 46, 38),
(58, 46, 39),
(59, 47, 38),
(60, 47, 39),
(61, 48, 38),
(62, 49, 38),
(75, 50, 38),
(76, 50, 39),
(94, 51, 38),
(95, 53, 38),
(98, 54, 38),
(99, 52, 38);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
