CREATE TABLE IF NOT EXISTS annonces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(255) NOT NULL,
  contenu TEXT NOT NULL,
  categorie VARCHAR(50) NOT NULL DEFAULT 'Information' CHECK (categorie IN ('Note officielle', 'Communiqué', 'Information', 'Avis', 'Urgent')),
  date_publication DATE DEFAULT CURRENT_DATE,
  statut VARCHAR(20) NOT NULL DEFAULT 'Brouillon' CHECK (statut IN ('Brouillon', 'Publié')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_annonces_statut ON annonces(statut);
CREATE INDEX idx_annonces_date ON annonces(date_publication);
CREATE INDEX idx_annonces_categorie ON annonces(categorie);
