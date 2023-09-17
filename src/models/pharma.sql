-- Create the "pharmacie" table without the foreign key constraint
CREATE TABLE IF NOT EXISTS `pharmacie` (
    pharmacie_id INT AUTO_INCREMENT PRIMARY KEY,
    id_owner INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    phone VARCHAR(20)
);

-- Create the "users" table
CREATE TABLE IF NOT EXISTS `users` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT 0,
    idpharmacie INT,
    isarchived BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (idpharmacie) REFERENCES pharmacie (pharmacie_id)
);

-- Create the "medicament" table
CREATE TABLE IF NOT EXISTS `medicament` (
   id INT NOT NULL,
   num_enregistrement VARCHAR(59) DEFAULT NULL,
   code VARCHAR(10) DEFAULT NULL,
   denomination_commune_internationale VARCHAR(193) DEFAULT NULL,
   nom_de_marque VARCHAR(271) DEFAULT NULL,
   forme VARCHAR(93) DEFAULT NULL,
   dosage VARCHAR(290) DEFAULT NULL,
   cond VARCHAR(574) DEFAULT NULL,
   liste VARCHAR(11) DEFAULT NULL,
   p1 VARCHAR(59) DEFAULT NULL,
   p2 VARCHAR(34) DEFAULT NULL,
   obs VARCHAR(69) DEFAULT NULL,
   laboratoires_detenteur_de_la_decision_d_enregistrement VARCHAR(75) DEFAULT NULL,
   pays_du_laboratoire_detenteur_de_la_decision_d_enregistrement VARCHAR(21) DEFAULT NULL,
   date_d_enregistrement_initial DATE DEFAULT NULL,
   date_d_enregistrement_final DATE DEFAULT NULL,
   type VARCHAR(13) DEFAULT NULL,
   statut VARCHAR(49) DEFAULT NULL,
   duree_de_stabilite VARCHAR(56) DEFAULT NULL,
   prix_porte_sur_la_decision_d_enregistrement VARCHAR(138) DEFAULT NULL,
   remboursement VARCHAR(10) DEFAULT NULL,
   reserve VARCHAR(52) DEFAULT NULL,
   PRIMARY KEY (id)
);

-- Create the "stock" table
CREATE TABLE IF NOT EXISTS `stock` (
    pharmacie_id INT NOT NULL,
    medicament_id INT NOT NULL,
    stock_date TIMESTAMP NOT NULL,
    quantity INT NOT NULL,
    expiration_date DATE NOT NULL,
    PRIMARY KEY (pharmacie_id, medicament_id, stock_date)
) ENGINE=InnoDB;


-- Add foreign key constraint to "pharmacie" table
ALTER TABLE `pharmacie`
ADD FOREIGN KEY (id_owner) REFERENCES `users` (user_id);


-- Add foreign key constraints to "stock" table
ALTER TABLE `stock`
ADD FOREIGN KEY (pharmacie_id) REFERENCES `pharmacie` (pharmacie_id);


-- Adding foreign key for medicament_id
ALTER TABLE `stock`
ADD FOREIGN KEY (medicament_id) REFERENCES medicament (id);