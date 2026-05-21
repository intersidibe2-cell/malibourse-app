-- Signalements table for incident/emergency reporting
CREATE TABLE IF NOT EXISTS signalements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_complet VARCHAR(200),
  telephone VARCHAR(50),
  email VARCHAR(255),
  type_signalement VARCHAR(50) DEFAULT 'Incident' CHECK (type_signalement IN ('Incident', 'Urgence', 'Critique', 'Suggestion')),
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  lieu VARCHAR(255),
  urgence VARCHAR(20) DEFAULT 'Normale' CHECK (urgence IN ('Normale', 'Urgente', 'Critique')),
  statut VARCHAR(20) DEFAULT 'Nouveau' CHECK (statut IN ('Nouveau', 'En cours', 'Traité', 'Rejeté')),
  reponse_admin TEXT,
  date_soumission TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_resolution TIMESTAMP WITH TIME ZONE,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signalements_statut ON signalements(statut);
CREATE INDEX IF NOT EXISTS idx_signalements_urgence ON signalements(urgence);
