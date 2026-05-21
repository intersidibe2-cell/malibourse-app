-- Rendez-vous consulaires
CREATE TABLE IF NOT EXISTS rendez_vous (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(20) UNIQUE NOT NULL,
  nom_complet VARCHAR(200) NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  motif VARCHAR(50) NOT NULL CHECK (motif IN ('Visa', 'Passeport', 'Légalisation', 'Bourse', 'Notariat', 'État civil', 'Information', 'Autre')),
  description TEXT,
  date_souhaitee DATE NOT NULL,
  creneau_horaire VARCHAR(20) NOT NULL,
  statut VARCHAR(20) DEFAULT 'En attente' CHECK (statut IN ('En attente', 'Confirmé', 'Annulé', 'Effectué')),
  notes_admin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rdv_statut ON rendez_vous(statut);
CREATE INDEX IF NOT EXISTS idx_rdv_date ON rendez_vous(date_souhaitee);
CREATE INDEX IF NOT EXISTS idx_rdv_reference ON rendez_vous(reference);

-- Renouvellement de passeport
CREATE TABLE IF NOT EXISTS renouvellements_passeport (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(20) UNIQUE NOT NULL,
  nom_complet VARCHAR(200) NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  numero_passeport VARCHAR(50) NOT NULL,
  date_naissance DATE,
  lieu_naissance VARCHAR(100),
  adresse_russie TEXT,
  motif_renouvellement VARCHAR(50) NOT NULL CHECK (motif_renouvellement IN ('Expiré', 'Plein', 'Perdu', 'Volé', 'Détérioré', 'Autre')),
  pieces_jointes JSONB DEFAULT '[]',
  statut VARCHAR(20) DEFAULT 'Demande' CHECK (statut IN ('Demande', 'En cours', 'Prêt', 'Livré', 'Rejeté')),
  notes_admin TEXT,
  date_soumission TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_renouv_statut ON renouvellements_passeport(statut);
CREATE INDEX IF NOT EXISTS idx_renouv_reference ON renouvellements_passeport(reference);

-- FAQ (gérée depuis le dashboard)
CREATE TABLE IF NOT EXISTS faq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  reponse TEXT NOT NULL,
  categorie VARCHAR(50) NOT NULL DEFAULT 'Général' CHECK (categorie IN ('Général', 'Visa', 'Passeport', 'Bourse', 'Légalisation', 'Consulaire', 'Inscription')),
  ordre INTEGER DEFAULT 0,
  statut VARCHAR(20) DEFAULT 'Publié' CHECK (statut IN ('Publié', 'Brouillon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faq_ordre ON faq(ordre);
CREATE INDEX IF NOT EXISTS idx_faq_categorie ON faq(categorie);

-- Téléchargements/gabarits
CREATE TABLE IF NOT EXISTS telechargements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  categorie VARCHAR(50) NOT NULL DEFAULT 'Formulaire' CHECK (categorie IN ('Formulaire', 'Guide', 'Modèle', 'Règlement', 'Autre')),
  fichier_url VARCHAR(500) NOT NULL,
  fichier_nom VARCHAR(200),
  fichier_taille INTEGER,
  ordre INTEGER DEFAULT 0,
  statut VARCHAR(20) DEFAULT 'Publié' CHECK (statut IN ('Publié', 'Brouillon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telech_ordre ON telechargements(ordre);
CREATE INDEX IF NOT EXISTS idx_telech_categorie ON telechargements(categorie);
