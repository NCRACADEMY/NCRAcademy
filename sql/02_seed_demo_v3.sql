-- N.C.R AI Academy V3 — Données de départ
-- Optionnel : tu peux l’exécuter après le schéma.

insert into modules (id, title, track, badge, description, outcome, duration, difficulty, lessons, resources, sort_order)
values
('m01','Comprendre l’IA sans jargon','Essentiel','Fondamentaux','Bases, IA générative, hallucinations et limites.','Expliquer simplement ce qu’est une IA générative.','45 min','Débutant','["Ce que l’IA sait faire","Ce qu’elle ne garantit pas","Pourquoi elle peut se tromper"]','["Fiche mémo N.C.R AI"]',1),
('m02','Méthode N.C.R AI','Essentiel','Méthode','Nommer, Cadrer, Raffiner.','Construire une demande claire.','60 min','Débutant','["Nommer le besoin","Cadrer la demande","Raffiner le résultat"]','["Fiche mémo N.C.R AI"]',2),
('m03','Prompts professionnels avancés','Professionnel','Prompt Lab','Prompts structurés, experts et réutilisables.','Créer des prompts adaptés au métier.','90 min','Intermédiaire','["Rôle","Contexte","Mission","Contraintes","Format"]','["Bibliothèque de prompts"]',3),
('m07','Sécurité, RGPD et bonnes pratiques','Sécurité','Conformité','Données sensibles, confidentialité et vérification.','Utiliser l’IA sans exposer les données sensibles.','75 min','Obligatoire','["Données à ne pas transmettre","Anonymiser","Vérifier"]','["Charte IA entreprise"]',7)
on conflict (id) do nothing;

insert into prompts (id, title, role, objective, level, description, content)
values
('p001','Créer un déroulé pédagogique complet','Formateur','Concevoir','Avancé','Transformer un thème en séquence complète.','Agis comme un ingénieur pédagogique. Je dois créer une séquence de formation sur [thème] pour [public]. Propose un déroulé complet avec objectifs, activités, critères, évaluation et matériel.'),
('p004','Créer une procédure interne','Dirigeant','Organiser','Avancé','Formaliser un processus professionnel.','Agis comme un consultant organisation. Crée une procédure interne pour [processus] avec objectif, périmètre, étapes, responsabilités, points de contrôle et indicateurs.'),
('p010','Vérifier une réponse IA','Tous profils','Sécuriser','Intermédiaire','Repérer les risques et améliorer la fiabilité.','Analyse la réponse suivante : [réponse IA]. Identifie les affirmations à vérifier, zones floues, risques d’erreur et propose une version plus fiable.')
on conflict (id) do nothing;
