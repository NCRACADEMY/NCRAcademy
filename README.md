# N.C.R AI Academy — WebApp V3 Connected

## Ce que contient la V3
Cette V3 est la première version vraiment structurée pour devenir une plateforme connectée.

Elle inclut :
- mode démo local compatible GitHub Pages ;
- mode Supabase prêt à activer ;
- login stagiaire / formateur ;
- tableau de bord ;
- parcours de formation ;
- progression modules ;
- Prompt Lab avec générateur ;
- prompts favoris ;
- diagnostic IA avec score ;
- sauvegarde diagnostic prévue Supabase ;
- certification QCM + cas pratique ;
- sauvegarde QCM prévue Supabase ;
- certificat imprimable ;
- documents filtrables ;
- messagerie simple ;
- espace formateur ;
- export JSON local ;
- SQL Supabase + RLS ;
- guide de mise en production.

## Accès démo local
- Stagiaire : `stagiaire` / `stagiaire123`
- Formateur : `admin` / `admin123`

## Mise en ligne GitHub Pages
1. Dézipper.
2. Envoyer tout le contenu à la racine du dépôt.
3. Vérifier que `index.html` est à la racine.
4. GitHub > Settings > Pages.
5. Source : Deploy from branch.
6. Branch : main.
7. Folder : /root.

## Passage en mode Supabase
Voir `SETUP_SUPABASE_V3.md`.

## Fichiers principaux
- `index.html`
- `styles.css`
- `config.js`
- `app.js`
- `js/data.js`
- `js/localStore.js`
- `js/supabaseService.js`
- `sql/01_schema_supabase_v3.sql`
- `sql/02_seed_demo_v3.sql`
