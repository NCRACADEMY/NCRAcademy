# Setup Supabase — N.C.R AI Academy V3

## Objectif
Connecter la WebApp V3 à Supabase pour avoir :
- vrais comptes utilisateurs ;
- authentification sécurisée ;
- profils stagiaire / formateur ;
- progression sauvegardée ;
- diagnostic sauvegardé ;
- QCM sauvegardé ;
- base prête pour messagerie et documents.

## Étape 1 — Créer le projet Supabase
1. Crée un compte Supabase.
2. Crée un nouveau projet.
3. Note :
   - Project URL
   - anon public key

## Étape 2 — Exécuter le SQL
Dans Supabase > SQL Editor :

1. Copie-colle le contenu de :
   `sql/01_schema_supabase_v3.sql`
2. Exécute.
3. Puis optionnellement :
   `sql/02_seed_demo_v3.sql`

## Étape 3 — Créer les utilisateurs
Dans Supabase > Authentication > Users :

Crée un utilisateur stagiaire :
- email : par exemple `stagiaire@tondomaine.fr`
- mot de passe : à définir

Crée un utilisateur formateur :
- email : par exemple `admin@tondomaine.fr`
- mot de passe : à définir

## Étape 4 — Créer les profils
Après création des utilisateurs, récupère leur UUID dans Supabase Auth.

Puis dans SQL Editor :

```sql
insert into profiles (id, full_name, role, job, company, cohort)
values
('UUID_DU_STAGIAIRE', 'Nom Stagiaire', 'stagiaire', 'Formateur / Dirigeant', 'Entreprise', 'Promotion IA'),
('UUID_DU_FORMATEUR', 'Nacer - Formateur', 'formateur', 'Formateur N.C.R', 'N.C.R Solutions', 'Administration');
```

## Étape 5 — Modifier config.js
Dans `config.js` :

```js
APP_MODE: "SUPABASE",
SUPABASE_URL: "https://xxxxx.supabase.co",
SUPABASE_ANON_KEY: "ta_cle_anon"
```

## Étape 6 — Commit GitHub
1. Envoie les fichiers modifiés sur GitHub.
2. Attends le déploiement GitHub Pages.
3. Connecte-toi avec les emails Supabase.

## Important
Ne mets jamais la clé `service_role` dans le front-end.
Utilise uniquement la clé `anon public`.
