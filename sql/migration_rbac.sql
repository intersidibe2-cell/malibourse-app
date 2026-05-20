-- Ajout du role specifique
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role_specifique VARCHAR(20) DEFAULT NULL;
-- Note: CHECK contrainte sera ajoutée manuellement

-- Mise à jour des rôles existants
UPDATE profiles SET role_specifique = role WHERE role != 'user' AND (role_specifique IS NULL OR role_specifique = '');

-- Table coordonnées bancaires
CREATE TABLE IF NOT EXISTS coordonnees_bancaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID REFERENCES etudiants(id),
  banque VARCHAR(200),
  bik VARCHAR(50),
  compte VARCHAR(50),
  inn VARCHAR(50),
  kpp VARCHAR(50),
  nom_compte_ru VARCHAR(200),
  nom_compte_fr VARCHAR(200),
  est_actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table fichiers uploadés
CREATE TABLE IF NOT EXISTS fichiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  etudiant_id UUID,
  type VARCHAR(50),
  chemin_fichier TEXT,
  date_upload TIMESTAMP DEFAULT NOW()
);

-- Ajouts colonnes aux tables existantes
ALTER TABLE declarations_arrivee ADD COLUMN IF NOT EXISTS provenance VARCHAR(100);
ALTER TABLE declarations_arrivee ADD COLUMN IF NOT EXISTS vol VARCHAR(50);
ALTER TABLE declarations_arrivee ADD COLUMN IF NOT EXISTS accueil_ambassade BOOLEAN DEFAULT FALSE;

ALTER TABLE paiements ADD COLUMN IF NOT EXISTS numero_ordre VARCHAR(50);
ALTER TABLE paiements ADD COLUMN IF NOT EXISTS date_envoi_banque DATE;
ALTER TABLE paiements ADD COLUMN IF NOT EXISTS reference_banque VARCHAR(100);
ALTER TABLE paiements ADD COLUMN IF NOT EXISTS valide_agent BOOLEAN DEFAULT FALSE;
ALTER TABLE paiements ADD COLUMN IF NOT EXISTS valide_comptable BOOLEAN DEFAULT FALSE;
