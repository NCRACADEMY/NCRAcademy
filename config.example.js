/*
  N.C.R AI Academy V3 — Configuration
  -------------------------------------
  Deux modes disponibles :

  1) DEMO_LOCAL
     - Fonctionne directement sur GitHub Pages.
     - Utilise les comptes de démonstration.
     - Données stockées dans le navigateur.

  2) SUPABASE
     - Utilise Supabase Auth + Database.
     - Nécessite de créer un projet Supabase.
     - Voir SETUP_SUPABASE_V3.md et sql/01_schema_supabase_v3.sql.

  Pour passer en production :
  - APP_MODE: "SUPABASE"
  - renseigner SUPABASE_URL
  - renseigner SUPABASE_ANON_KEY
*/

window.NCR_CONFIG = {
  APP_MODE: "SUPABASE", // "DEMO_LOCAL" ou "SUPABASE"

  ACADEMY_NAME: "N.C.R AI Academy",
  PRODUCT_NAME: "N.C.R AI Academy V3 Connected",
  BRAND_NAME: "N.C.R Solutions",

  CONTACT_EMAIL: "ncr-formations@outlook.fr",
  SIRET: "98862540600018",
  ADDRESS: "191 Impasse Missiri, 83600 Fréjus",

  SUPABASE_URL: "https://TON-PROJET.supabase.co",
  SUPABASE_ANON_KEY: "TA_CLE_ANON_PUBLIC",

  CERTIFICATION_PASS_SCORE: 80,
  DEFAULT_THEME: "dark"
};
