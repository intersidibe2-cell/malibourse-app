-- Add source tracking to etudiants
ALTER TABLE etudiants ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'inscription';
ALTER TABLE etudiants ADD COLUMN IF NOT EXISTS propose_par VARCHAR(50);
ALTER TABLE etudiants ADD COLUMN IF NOT EXISTS statut_ministere VARCHAR(30) DEFAULT 'Approuvé' CHECK (statut_ministere IN ('Approuvé', 'Proposé', 'En attente', 'Modifié', 'Suppression demandée'));

-- Ministere profile account (password: ministere2026)
INSERT INTO profiles (login, email, nom, prenom, password_hash, role, role_specifique)
VALUES (
  'ministere',
  'ministere@education.mali',
  'Ministère',
  'Éducation',
  '$2b$12$TtPjf3/sJm6OGuJ81n/5UOtnQ5RoXgRT2BvbLkuKXFx.VDfIK8joi',
  'user',
  'ministere'
) ON CONFLICT (login) DO NOTHING;

-- Index for source queries
CREATE INDEX IF NOT EXISTS idx_etudiants_source ON etudiants(source);
CREATE INDEX IF NOT EXISTS idx_etudiants_propose_par ON etudiants(propose_par);
