INSTALLATION V6

1. Télécharge le ZIP.
2. Dézippe-le.
3. Sur GitHub, remplace les fichiers de la V5 par ceux de ce dossier.
4. Commit changes.
5. Attends 1 à 2 minutes.
6. Recharge avec Cmd + Shift + R.

Supabase :
- config.js est déjà en mode SUPABASE avec ton URL et ta clé publishable.
- Si le site ne charge pas les comptes Supabase, vérifie que tes utilisateurs existent dans Authentication et profiles.
- Le SQL 01_safe_upgrade_v6.sql est à copier dans Supabase SQL Editor si tu veux ajouter academy_access et les colonnes V6.

Documents :
- Tous les PDF sont dans docs/.
- Ils sont déjà référencés dans js/data.js.
