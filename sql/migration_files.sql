-- Add pieces_jointes (JSON array of {id, nom, type, url}) to conges and billets
ALTER TABLE conges_academiques ADD COLUMN IF NOT EXISTS pieces_jointes TEXT DEFAULT '[]';
ALTER TABLE billets_voyage ADD COLUMN IF NOT EXISTS pieces_jointes TEXT DEFAULT '[]';

-- Add email field to conges/billets for public submission identification
ALTER TABLE conges_academiques ADD COLUMN IF NOT EXISTS email VARCHAR(255) DEFAULT '';
ALTER TABLE billets_voyage ADD COLUMN IF NOT EXISTS email VARCHAR(255) DEFAULT '';

-- Enhance fichiers table
ALTER TABLE fichiers ADD COLUMN IF NOT EXISTS nom_original VARCHAR(255) DEFAULT '';
ALTER TABLE fichiers ADD COLUMN IF NOT EXISTS taille INTEGER DEFAULT 0;
