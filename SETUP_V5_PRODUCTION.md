# Setup V5 Production

1. Remplace la V3 par la V5 sur GitHub Pages.
2. Dans Supabase SQL Editor, exécute `sql/01_schema_supabase_v5.sql`.
3. Ensuite exécute `sql/02_seed_full_v5.sql`.
4. Vérifie tes utilisateurs et la table `profiles`.
5. Dans `config.js`, remets APP_MODE: "SUPABASE" et colle ton URL + ta publishable key.
6. Commit/push GitHub.

Important : pour créer automatiquement des comptes depuis l’espace formateur, il faut une Edge Function côté Supabase avec service_role en secret, jamais dans le front-end.
