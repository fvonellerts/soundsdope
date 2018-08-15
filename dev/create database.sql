-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Erstellungszeit: 15. Aug 2018 um 19:48
-- Server-Version: 5.7.21
-- PHP-Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Datenbank: `soundsdope`
--
CREATE DATABASE IF NOT EXISTS `soundsdope` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `soundsdope`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `albums`
--

CREATE TABLE `albums` (
  `id` int(11) NOT NULL,
  `artistid` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8_bin NOT NULL,
  `genreid` int(11) NOT NULL,
  `time` date NOT NULL,
  `verified` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(200) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `artists`
--

INSERT INTO `artists` (`id`, `name`) VALUES
(2, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `subgenre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `genres`
--

INSERT INTO `genres` (`id`, `name`, `subgenre`) VALUES
(1, 'Electronic', 0),
(2, 'Hip-Hop', 0),
(3, 'Pop', 0),
(4, 'Rock', 0),
(5, 'African', 0),
(6, 'Country & Folk', 0),
(7, 'Classical', 0),
(8, 'Club House', 1),
(9, 'Deep House & Ambient', 1),
(10, 'Drum & Bass', 1),
(11, 'Trance & Techno', 1),
(12, 'Crossover Electro', 1),
(13, 'EDM Trap', 1),
(14, 'Trap & Drill', 2),
(15, 'Weed Influenced', 2),
(16, 'Gangsta', 2),
(17, 'Oldschool', 2),
(18, 'R&B', 2),
(19, 'Crossover Rap', 2),
(20, 'Classic Rock', 4),
(21, 'Hard Rock', 4),
(22, 'Pop Rock', 4),
(23, 'Grunge', 4),
(24, 'Heavy Metal', 4),
(25, 'Crossover Metal', 4),
(26, 'Jazz & Soul', 5),
(27, 'Blues', 5),
(28, 'Reggae & Ska', 5),
(29, 'Boogie', 5),
(30, 'Crossover Jazz', 5),
(31, 'Indie', 0),
(32, 'International', 2),
(33, 'Hardstyle', 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `playlist` longtext COLLATE utf8_bin NOT NULL,
  `name` varchar(25) COLLATE utf8_bin NOT NULL,
  `time` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `tracks`
--

CREATE TABLE `tracks` (
  `id` int(11) NOT NULL,
  `track` int(11) NOT NULL,
  `playtime` varchar(100) COLLATE utf8_bin NOT NULL,
  `hash` varchar(100) COLLATE utf8_bin NOT NULL,
  `name` varchar(300) COLLATE utf8_bin NOT NULL,
  `albumid` int(11) NOT NULL,
  `URL` varchar(200) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indizes für die Tabelle `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `tracks`
--
ALTER TABLE `tracks`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT für Tabelle `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `tracks`
--
ALTER TABLE `tracks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
