-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 08. Mrz 2023 um 18:57
-- Server-Version: 10.4.27-MariaDB
-- PHP-Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `cm`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `courses`
--

CREATE TABLE `courses` (
  `courses_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `subject` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `courses`
--

INSERT INTO `courses` (`courses_id`, `name`, `subject`) VALUES
(1, '6b', 'Mathe');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `results`
--

CREATE TABLE `results` (
  `results_id` int(11) NOT NULL,
  `sheet_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `done` int(11) NOT NULL,
  `reached_points` float NOT NULL,
  `number_of_exercises` int(11) NOT NULL,
  `ans0` float NOT NULL DEFAULT 0,
  `p0` float NOT NULL DEFAULT 0,
  `ans1` float NOT NULL DEFAULT 0,
  `p1` float NOT NULL DEFAULT 0,
  `ans2` float NOT NULL DEFAULT 0,
  `p2` float NOT NULL DEFAULT 0,
  `ans3` float NOT NULL DEFAULT 0,
  `p3` float NOT NULL DEFAULT 0,
  `ans4` float NOT NULL DEFAULT 0,
  `p4` float NOT NULL DEFAULT 0,
  `ans5` float NOT NULL DEFAULT 0,
  `p5` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `results`
--

INSERT INTO `results` (`results_id`, `sheet_id`, `username`, `done`, `reached_points`, `number_of_exercises`, `ans0`, `p0`, `ans1`, `p1`, `ans2`, `p2`, `ans3`, `p3`, `ans4`, `p4`, `ans5`, `p5`) VALUES
(1, 1, 'v', 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(2, 1, 's', 1, 2, 6, 0.75, 0.5, 0.16, 1, 1.5, 0.5, 3.8, 0, 1, 1, 1.5, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sheets`
--

CREATE TABLE `sheets` (
  `sheet_id` int(11) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `max_points` int(11) NOT NULL,
  `number_of_exercises` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `sheets`
--

INSERT INTO `sheets` (`sheet_id`, `subject`, `name`, `description`, `max_points`, `number_of_exercises`) VALUES
(1, 'Mathe', 'Bruch_T1', 'Teste dich: Brüche und Dezimalzahlen', 6, 6);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `comments` text NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'active',
  `username` varchar(50) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `phone`, `comments`, `status`, `username`, `password`, `role`, `course_id`) VALUES
(1, 'Amanda', 'Nunes', 'anunes@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(2, 'Alexander', 'Volkanovski', 'avolkanovski@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(3, 'Khabib', 'Nurmagomedov', 'knurmagomedov@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(4, 'Kamaru', 'Usman', 'kusman@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(5, 'Israel', 'Adesanya', 'iadesanya@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(6, 'Henry', 'Cejudo', 'hcejudo@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(7, 'Valentina', 'Shevchenko', 'vshevchenko@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(8, 'Tyron', 'Woodley', 'twoodley@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(9, 'Rose', 'Namajunas ', 'rnamajunas@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(10, 'Tony', 'Ferguson ', 'tferguson@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(11, 'Jorge', 'Masvidal ', 'jmasvidal@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(12, 'Nate', 'Diaz ', 'ndiaz@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(13, 'Conor', 'McGregor ', 'cmcGregor@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(14, 'Cris', 'Cyborg ', 'ccyborg@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(15, 'Tecia', 'Torres ', 'ttorres@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(16, 'Ronda', 'Rousey ', 'rrousey@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(17, 'Holly', 'Holm ', 'hholm@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(18, 'Joanna', 'Jedrzejczyk ', 'jjedrzejczyk@ufc.com', '012345 678910', '', 'active', '', NULL, NULL, NULL),
(19, 'v', 'c', '', '', '', 'active', 'v', 'v', 'teacher', 1),
(20, 's', 's', '', '', '', 'active', 's', 's', NULL, 1);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`courses_id`);

--
-- Indizes für die Tabelle `results`
--
ALTER TABLE `results`
  ADD PRIMARY KEY (`results_id`);

--
-- Indizes für die Tabelle `sheets`
--
ALTER TABLE `sheets`
  ADD PRIMARY KEY (`sheet_id`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `courses`
--
ALTER TABLE `courses`
  MODIFY `courses_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `results`
--
ALTER TABLE `results`
  MODIFY `results_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `sheets`
--
ALTER TABLE `sheets`
  MODIFY `sheet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
