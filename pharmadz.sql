-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 09 août 2023 à 02:57
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pharma_dz`
--

-- --------------------------------------------------------

--
-- Structure de la table `medicament`
--

CREATE TABLE `medicament` (
  `id` int(11) NOT NULL,
  `num_enregistrement` varchar(59) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `denomination_commune_internationale` varchar(193) DEFAULT NULL,
  `nom_de_marque` varchar(271) DEFAULT NULL,
  `forme` varchar(93) DEFAULT NULL,
  `dosage` varchar(290) DEFAULT NULL,
  `cond` varchar(574) DEFAULT NULL,
  `liste` varchar(11) DEFAULT NULL,
  `p1` varchar(59) DEFAULT NULL,
  `p2` varchar(34) DEFAULT NULL,
  `obs` varchar(69) DEFAULT NULL,
  `laboratoires_detenteur_de_la_decision_d_enregistrement` varchar(75) DEFAULT NULL,
  `pays_du_laboratoire_detenteur_de_la_decision_d_enregistrement` varchar(21) DEFAULT NULL,
  `date_d_enregistrement_initial` date DEFAULT NULL,
  `date_d_enregistrement_final` date DEFAULT NULL,
  `type` varchar(13) DEFAULT NULL,
  `statut` varchar(49) DEFAULT NULL,
  `duree_de_stabilite` varchar(56) DEFAULT NULL,
  `prix_porte_sur_la_decision_d_enregistrement` varchar(138) DEFAULT NULL,
  `remboursement` varchar(10) DEFAULT NULL,
  `reserve` varchar(52) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `pharmacie`
--

CREATE TABLE `pharmacie` (
  `pharmacie_id` int(11) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stock`
--

CREATE TABLE `stock` (
  `pharmacie_id` int(11) NOT NULL,
  `medicament_id` int(11) NOT NULL,
  `stock_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `quantity` int(11) NOT NULL,
  `expiration_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT 0,
  `idpharmacie` int(11) DEFAULT NULL,
  `isarchived` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `medicament`
--
ALTER TABLE `medicament`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `pharmacie`
--
ALTER TABLE `pharmacie`
  ADD PRIMARY KEY (`pharmacie_id`),
  ADD KEY `id_owner` (`id_owner`);

--
-- Index pour la table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`pharmacie_id`,`medicament_id`,`stock_date`),
  ADD KEY `medicament_id` (`medicament_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `idpharmacie` (`idpharmacie`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `pharmacie`
--
ALTER TABLE `pharmacie`
  MODIFY `pharmacie_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `pharmacie`
--
ALTER TABLE `pharmacie`
  ADD CONSTRAINT `pharmacie_ibfk_1` FOREIGN KEY (`id_owner`) REFERENCES `users` (`user_id`);

--
-- Contraintes pour la table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacie` (`pharmacie_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stock_ibfk_2` FOREIGN KEY (`medicament_id`) REFERENCES `medicament` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idpharmacie`) REFERENCES `pharmacie` (`pharmacie_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
