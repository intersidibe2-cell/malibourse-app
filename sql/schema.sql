-- MaliBourse Russie - Database Schema
-- PostgreSQL 15

-- 1. Profiles (users with roles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 2. Etudiants Boursiers
CREATE TABLE IF NOT EXISTS etudiants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
  numero_passeport VARCHAR(50),
  telephone VARCHAR(50),
  email VARCHAR(255),
  ville VARCHAR(100),
  adresse_residence TEXT,
  universite VARCHAR(255),
  filiere VARCHAR(200),
  niveau VARCHAR(50) CHECK (niveau IN ('Licence', 'Master', 'Doctorat', 'Spécialiste', 'Résidence médicale')),
  annee_etude VARCHAR(20),
  date_arrivee DATE,
  date_fin_cycle DATE,
  date_depart DATE,
  montant_mensuel DECIMAL(12, 2),
  devise VARCHAR(5) DEFAULT 'RUB',
  statut_bourse VARCHAR(30) DEFAULT 'Actif' CHECK (statut_bourse IN ('Actif', 'Suspendu', 'Terminé', 'En attente')),
  type_bourse VARCHAR(100),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_etudiants_nom ON etudiants(nom);
CREATE INDEX idx_etudiants_passeport ON etudiants(numero_passeport);
CREATE INDEX idx_etudiants_statut ON etudiants(statut_bourse);
CREATE INDEX idx_etudiants_ville ON etudiants(ville);

-- 3. Etudiants Contractuels
CREATE TABLE IF NOT EXISTS etudiants_contractuels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
  numero_passeport VARCHAR(50),
  telephone VARCHAR(50),
  email VARCHAR(255),
  ville VARCHAR(100),
  adresse_residence TEXT,
  universite VARCHAR(255),
  filiere VARCHAR(200),
  niveau VARCHAR(50),
  annee_etude VARCHAR(20),
  date_arrivee DATE,
  date_fin_cycle DATE,
  frais_scolarite_annuels DECIMAL(12, 2),
  devise_frais VARCHAR(5) DEFAULT 'RUB',
  contact_urgence_nom VARCHAR(200),
  contact_urgence_telephone VARCHAR(50),
  type_visa VARCHAR(100),
  date_expiration_visa DATE,
  statut VARCHAR(30) DEFAULT 'Actif',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Etudiants Militaires
CREATE TABLE IF NOT EXISTS etudiants_militaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  grade VARCHAR(50),
  matricule VARCHAR(50),
  numero_passeport VARCHAR(50),
  date_naissance DATE,
  sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
  telephone VARCHAR(50),
  email VARCHAR(255),
  etablissement_formation VARCHAR(255),
  ville VARCHAR(100),
  specialite VARCHAR(200),
  type_formation VARCHAR(100),
  duree_formation_annees INTEGER,
  annee_etude VARCHAR(20),
  date_arrivee DATE,
  date_fin_formation DATE,
  arme_service VARCHAR(100),
  montant_bourse_mensuelle DECIMAL(12, 2),
  devise VARCHAR(5) DEFAULT 'RUB',
  contact_urgence_nom VARCHAR(200),
  contact_urgence_telephone VARCHAR(50),
  type_visa VARCHAR(100),
  date_expiration_visa DATE,
  statut VARCHAR(30) DEFAULT 'En formation' CHECK (statut IN ('En formation', 'Diplômé', 'Rapatrié', 'Suspendu', 'Décédé')),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Paiements
CREATE TABLE IF NOT EXISTS paiements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID REFERENCES etudiants(id) ON DELETE CASCADE,
  etudiant_nom VARCHAR(255),
  type_paiement VARCHAR(50) CHECK (type_paiement IN ('Bourse mensuelle', 'Trousseau', 'Allocation spéciale', 'Remboursement frais médicaux', 'Autre')),
  montant DECIMAL(12, 2),
  devise VARCHAR(5) DEFAULT 'RUB',
  mois_concerne VARCHAR(20),
  annee_concerne VARCHAR(10),
  date_paiement DATE,
  statut VARCHAR(20) DEFAULT 'En attente' CHECK (statut IN ('Payé', 'En attente', 'Annulé')),
  reference VARCHAR(100),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_paiements_etudiant ON paiements(etudiant_id);
CREATE INDEX idx_paiements_statut ON paiements(statut);
CREATE INDEX idx_paiements_date ON paiements(date_paiement);

-- 6. Conges Academiques
CREATE TABLE IF NOT EXISTS conges_academiques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID REFERENCES etudiants(id) ON DELETE CASCADE,
  etudiant_nom VARCHAR(255),
  type_conge VARCHAR(50) CHECK (type_conge IN ('Congé médical', 'Congé familial', 'Congé académique', 'Autre')),
  motif TEXT,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  date_demande DATE DEFAULT CURRENT_DATE,
  statut VARCHAR(20) DEFAULT 'Demande' CHECK (statut IN ('Demande', 'Approuvé', 'Refusé', 'Terminé')),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conges_etudiant ON conges_academiques(etudiant_id);
CREATE INDEX idx_conges_statut ON conges_academiques(statut);

-- 7. Doleances
CREATE TABLE IF NOT EXISTS doleances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_nom VARCHAR(100),
  etudiant_prenom VARCHAR(100),
  telephone VARCHAR(50),
  email VARCHAR(255),
  type VARCHAR(100),
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  priorite VARCHAR(20) DEFAULT 'Normale' CHECK (priorite IN ('Faible', 'Normale', 'Urgente')),
  statut VARCHAR(20) DEFAULT 'Nouveau' CHECK (statut IN ('Nouveau', 'En cours', 'Résolu', 'Rejeté')),
  reponse_admin TEXT,
  date_soumission TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_resolution TIMESTAMP WITH TIME ZONE,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_doleances_statut ON doleances(statut);
CREATE INDEX idx_doleances_priorite ON doleances(priorite);

-- 8. Billets de Voyage
CREATE TABLE IF NOT EXISTS billets_voyage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID REFERENCES etudiants(id) ON DELETE CASCADE,
  etudiant_nom VARCHAR(100),
  etudiant_prenom VARCHAR(100),
  numero_passeport VARCHAR(50),
  universite VARCHAR(255),
  ville VARCHAR(100),
  type_billet VARCHAR(50),
  annee_academique VARCHAR(20),
  date_depart_prevu DATE,
  date_retour_prevu DATE,
  compagnie_aerienne VARCHAR(100),
  numero_vol VARCHAR(50),
  itineraire VARCHAR(255) DEFAULT 'Moscou → Paris → Bamako',
  cout_billet DECIMAL(12, 2),
  devise VARCHAR(5) DEFAULT 'RUB',
  statut VARCHAR(30) DEFAULT 'Demande soumise' CHECK (statut IN ('Demande soumise', 'Approuvé', 'Billet émis', 'Voyage effectué', 'Annulé', 'Refusé')),
  motif_demande TEXT,
  observations TEXT,
  date_demande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Declarations d'Arrivee
CREATE TABLE IF NOT EXISTS declarations_arrivee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  numero_passeport VARCHAR(50),
  nationalite VARCHAR(50) DEFAULT 'Malienne',
  date_arrivee DATE,
  ville_arrivee VARCHAR(100),
  motif_sejour TEXT,
  adresse_sejour TEXT,
  telephone VARCHAR(50),
  email VARCHAR(255),
  statut VARCHAR(20) DEFAULT 'En attente' CHECK (statut IN ('En attente', 'Arrivé', 'Absent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Travailleurs
CREATE TABLE IF NOT EXISTS travailleurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
  numero_passeport VARCHAR(50),
  telephone VARCHAR(50),
  email VARCHAR(255),
  profession VARCHAR(200),
  employeur VARCHAR(255),
  ville VARCHAR(100),
  adresse_residence TEXT,
  type_visa VARCHAR(100),
  date_expiration_visa DATE,
  statut VARCHAR(20) DEFAULT 'Actif',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Visiteurs
CREATE TABLE IF NOT EXISTS visiteurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
  numero_passeport VARCHAR(50),
  telephone VARCHAR(50),
  email VARCHAR(255),
  motif_visite TEXT,
  duree_sejour_jours INTEGER,
  date_arrivee DATE,
  date_depart_prevue DATE,
  hebergement TEXT,
  statut VARCHAR(20) DEFAULT 'En séjour',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Residents
CREATE TABLE IF NOT EXISTS residents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  date_naissance DATE,
  sexe VARCHAR(10) CHECK (sexe IN ('M', 'F')),
  numero_passeport VARCHAR(50),
  telephone VARCHAR(50),
  email VARCHAR(255),
  profession VARCHAR(200),
  employeur VARCHAR(255),
  ville VARCHAR(100),
  adresse_residence TEXT,
  type_permis VARCHAR(100),
  date_expiration_permis DATE,
  statut VARCHAR(20) DEFAULT 'Actif',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
