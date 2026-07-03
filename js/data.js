window.NCR_DATA = {
  demoUsers: [
    {
      id: "demo-stagiaire",
      username: "stagiaire",
      password: "stagiaire123",
      email: "stagiaire@ncr.demo",
      full_name: "Stagiaire Démo",
      role: "stagiaire",
      job: "Formateur / Dirigeant",
      company: "Entreprise Démo",
      cohort: "Promotion Démo"
    },
    {
      id: "demo-formateur",
      username: "admin",
      password: "admin123",
      email: "admin@ncr.demo",
      full_name: "Nacer - Formateur",
      role: "formateur",
      job: "Formateur N.C.R",
      company: "N.C.R Solutions",
      cohort: "Administration"
    }
  ],

  modules: [
    {
      id: "m01",
      sort: 1,
      track: "Essentiel",
      badge: "Fondamentaux",
      title: "Comprendre l’IA sans jargon",
      duration: "45 min",
      difficulty: "Débutant",
      outcome: "Expliquer simplement ce qu’est une IA générative, ce qu’elle peut faire et ce qu’elle ne garantit pas.",
      description: "Bases, IA générative, modèles de langage, hallucinations, limites et rôle de l’utilisateur.",
      lessons: [
        "Ce que l’IA sait faire",
        "Ce que l’IA ne sait pas garantir",
        "Pourquoi l’IA peut se tromper",
        "La place de l’humain dans le résultat"
      ],
      resources: ["Fiche mémo N.C.R AI", "Checklist vérification IA"]
    },
    {
      id: "m02",
      sort: 2,
      track: "Essentiel",
      badge: "Méthode",
      title: "Méthode N.C.R AI",
      duration: "60 min",
      difficulty: "Débutant",
      outcome: "Construire une demande claire avec Nommer, Cadrer, Raffiner.",
      description: "La méthode signature N.C.R pour transformer une idée floue en livrable professionnel.",
      lessons: [
        "Nommer le besoin réel",
        "Cadrer la demande avec contexte, rôle et contraintes",
        "Raffiner la réponse",
        "Transformer en document exploitable"
      ],
      resources: ["Fiche mémo N.C.R AI"]
    },
    {
      id: "m03",
      sort: 3,
      track: "Professionnel",
      badge: "Prompt Lab",
      title: "Prompts professionnels avancés",
      duration: "90 min",
      difficulty: "Intermédiaire",
      outcome: "Créer des prompts réutilisables et adaptés à son métier.",
      description: "Prompts simples, structurés, experts, multi-étapes, avec critères de qualité.",
      lessons: [
        "Prompt simple vs prompt professionnel",
        "Rôle, contexte, mission, contraintes, format",
        "Demander des questions avant production",
        "Créer une bibliothèque métier"
      ],
      resources: ["Bibliothèque de prompts"]
    },
    {
      id: "m04",
      sort: 4,
      track: "Production",
      badge: "Livrables",
      title: "Produire des documents utiles",
      duration: "120 min",
      difficulty: "Intermédiaire",
      outcome: "Créer des livrables professionnels exploitables dès la formation.",
      description: "Mails, procédures, comptes rendus, plans d’action, posts, QCM, supports et FAQ.",
      lessons: [
        "Transformer une réponse IA en livrable",
        "Créer un modèle réutilisable",
        "Améliorer le ton et la structure",
        "Valider qualité, clarté et utilité"
      ],
      resources: ["Modèles de livrables"]
    },
    {
      id: "m05",
      sort: 5,
      track: "Formateur",
      badge: "Spécialisation",
      title: "IA pour formateurs",
      duration: "120 min",
      difficulty: "Avancé",
      outcome: "Créer une séquence pédagogique complète avec activité, critères et évaluation.",
      description: "Déroulé pédagogique, objectifs, activités, cas concrets, critères de réussite et QCM.",
      lessons: [
        "Créer un déroulé pédagogique",
        "Rédiger objectifs et consignes",
        "Construire activité et cas concret",
        "Évaluer avec critères observables"
      ],
      resources: ["Modèle déroulé pédagogique", "Grille d’évaluation"]
    },
    {
      id: "m06",
      sort: 6,
      track: "Dirigeant",
      badge: "Spécialisation",
      title: "IA pour dirigeants",
      duration: "120 min",
      difficulty: "Avancé",
      outcome: "Structurer son activité, gagner du temps et mieux piloter ses documents.",
      description: "Procédures, réponses clients, décisions, organisation, communication et délégation IA.",
      lessons: [
        "Identifier les tâches à fort gain",
        "Créer procédures et modèles",
        "Préparer réunions et décisions",
        "Piloter un plan d’intégration IA"
      ],
      resources: ["Plan 90 jours", "Charte usage IA"]
    },
    {
      id: "m07",
      sort: 7,
      track: "Sécurité",
      badge: "Conformité",
      title: "Sécurité, RGPD et bonnes pratiques",
      duration: "75 min",
      difficulty: "Obligatoire",
      outcome: "Utiliser l’IA sans exposer les données sensibles ou confidentielles.",
      description: "Confidentialité, données personnelles, vérification, droits d’auteur, charte IA.",
      lessons: [
        "Données à ne pas transmettre",
        "Anonymiser une situation",
        "Vérifier une réponse IA",
        "Créer une charte interne"
      ],
      resources: ["Charte IA entreprise", "Kit sécurité IA"]
    },
    {
      id: "m08",
      sort: 8,
      track: "Certification",
      badge: "Validation",
      title: "Cas pratique final",
      duration: "90 min",
      difficulty: "Évaluation",
      outcome: "Produire un livrable métier final et justifier la méthode utilisée.",
      description: "QCM, cas pratique, livrable final, auto-évaluation, correction et certificat interne.",
      lessons: [
        "Choisir un livrable métier",
        "Construire un prompt complet",
        "Vérifier et améliorer le résultat",
        "Présenter le livrable final"
      ],
      resources: ["Grille certification"]
    }
  ],

  prompts: [
    {
      id: "p001",
      role: "Formateur",
      objective: "Concevoir",
      level: "Avancé",
      title: "Créer un déroulé pédagogique complet",
      description: "Transformer un thème en séquence complète prête à animer.",
      text: "Agis comme un ingénieur pédagogique. Je dois créer une séquence de formation sur [thème] pour [public]. Durée : [durée]. Objectif général : [objectif]. Propose un déroulé complet avec objectifs opérationnels, phases pédagogiques, durée, consignes formateur, activité d’apprentissage, critères de réussite, évaluation et matériel nécessaire. Format attendu : tableau clair et exploitable."
    },
    {
      id: "p002",
      role: "Formateur",
      objective: "Évaluer",
      level: "Intermédiaire",
      title: "Créer une grille d’évaluation",
      description: "Construire une évaluation avec critères observables.",
      text: "Crée une grille d’évaluation pour [activité ou compétence]. Public : [public]. Niveau attendu : [niveau]. Donne 5 critères observables, 3 niveaux de maîtrise, indicateurs de réussite, erreurs fréquentes et conseils de remédiation."
    },
    {
      id: "p003",
      role: "Formateur",
      objective: "Animer",
      level: "Avancé",
      title: "Transformer un contenu en atelier",
      description: "Créer une activité active à partir d’un contenu brut.",
      text: "Transforme le contenu suivant en atelier interactif : [contenu]. Propose durée, consignes, rôles des participants, étapes, critères de réussite, matériel, erreurs fréquentes et débrief formateur."
    },
    {
      id: "p004",
      role: "Dirigeant",
      objective: "Organiser",
      level: "Avancé",
      title: "Créer une procédure interne",
      description: "Formaliser un processus professionnel clair.",
      text: "Agis comme un consultant organisation. Crée une procédure interne pour [processus]. Contexte : [contexte]. Contraintes : [contraintes]. Format : objectif, périmètre, personnes concernées, responsabilités, étapes, points de contrôle, erreurs à éviter, indicateurs de suivi."
    },
    {
      id: "p005",
      role: "Dirigeant",
      objective: "Décider",
      level: "Avancé",
      title: "Analyser une décision business",
      description: "Aider à choisir avec risques, options et critères.",
      text: "Analyse cette décision : [situation]. Donne avantages, risques, coûts cachés, alternatives, questions à poser, critères de décision, informations à vérifier et recommandation finale argumentée. Signale clairement ce qui est incertain."
    },
    {
      id: "p006",
      role: "Dirigeant",
      objective: "Communiquer",
      level: "Intermédiaire",
      title: "Répondre à un client difficile",
      description: "Réponse humaine, ferme et orientée solution.",
      text: "Aide-moi à répondre à ce client : [message client]. Objectif : apaiser, expliquer clairement, proposer une solution réaliste et préserver l’image de l’entreprise. Ton : professionnel, humain, direct. Évite les formules froides ou agressives."
    },
    {
      id: "p007",
      role: "Commercial",
      objective: "Vendre",
      level: "Intermédiaire",
      title: "Créer un argumentaire commercial",
      description: "Préparer une offre claire, crédible et persuasive.",
      text: "Crée un argumentaire commercial pour vendre [offre] à [cible]. Structure : problème client, bénéfices, preuves, objections probables, réponses aux objections, phrase d’accroche, conclusion et appel à l’action."
    },
    {
      id: "p008",
      role: "Communication",
      objective: "Publier",
      level: "Débutant",
      title: "Post LinkedIn professionnel",
      description: "Créer un post crédible, humain et engageant.",
      text: "Rédige un post LinkedIn sur [sujet] pour [cible]. Objectif : crédibilité et engagement. Ton : professionnel, direct, humain. Structure : accroche forte, contexte, valeur concrète, exemple, conclusion, question finale."
    },
    {
      id: "p009",
      role: "Administratif",
      objective: "Gagner du temps",
      level: "Débutant",
      title: "Compte rendu structuré",
      description: "Transformer des notes brutes en compte rendu utile.",
      text: "À partir de ces notes : [notes], rédige un compte rendu structuré avec contexte, décisions prises, actions à réaliser, responsable, échéance, points de vigilance et prochain rendez-vous."
    },
    {
      id: "p010",
      role: "Tous profils",
      objective: "Sécuriser",
      level: "Intermédiaire",
      title: "Vérifier une réponse IA",
      description: "Repérer les risques et améliorer la fiabilité.",
      text: "Analyse la réponse suivante : [réponse IA]. Identifie les affirmations à vérifier, les zones floues, les risques d’erreur, les données manquantes et propose une version plus fiable avec précautions explicites."
    },
    {
      id: "p011",
      role: "Tous profils",
      objective: "Produire",
      level: "Avancé",
      title: "Transformer une idée brute en livrable",
      description: "Passer d’une idée floue à un document utilisable.",
      text: "Transforme cette idée brute en document professionnel : [idée]. Commence par poser les questions essentielles si des informations manquent, puis propose une structure, une version rédigée, une checklist de validation et une version courte exploitable."
    },
    {
      id: "p012",
      role: "Formateur",
      objective: "Synthétiser",
      level: "Intermédiaire",
      title: "Créer une fiche mémo participant",
      description: "Fiche claire d’une page pour consolider les acquis.",
      text: "Crée une fiche mémo d’une page sur [thème], destinée à [public]. Elle doit contenir les points essentiels, une méthode simple, un exemple concret, les erreurs à éviter et une checklist finale."
    },
    {
      id: "p013",
      role: "Dirigeant",
      objective: "Piloter",
      level: "Avancé",
      title: "Plan d’action 30 jours",
      description: "Construire une feuille de route opérationnelle.",
      text: "Crée un plan d’action sur 30 jours pour atteindre l’objectif suivant : [objectif]. Donne étapes par semaine, priorités, actions concrètes, indicateurs, risques et décisions à prendre."
    },
    {
      id: "p014",
      role: "Tous profils",
      objective: "Améliorer",
      level: "Intermédiaire",
      title: "Améliorer un document professionnel",
      description: "Rendre un document plus clair, pro et impactant.",
      text: "Améliore ce document : [texte]. Objectif : le rendre plus clair, plus professionnel, plus structuré et plus convaincant. Donne d’abord les points faibles, puis une version améliorée, puis une checklist de validation."
    },
    {
      id: "p015",
      role: "Sécurité",
      objective: "Anonymiser",
      level: "Intermédiaire",
      title: "Anonymiser avant IA",
      description: "Retirer les informations sensibles avant usage IA.",
      text: "Aide-moi à anonymiser ce contenu avant de l’utiliser avec une IA : [contenu]. Supprime ou remplace les noms, coordonnées, données personnelles, informations confidentielles et détails identifiants. Explique ensuite ce qui a été anonymisé."
    },
    {
      id: "p016",
      role: "Formateur",
      objective: "Corriger",
      level: "Avancé",
      title: "Améliorer un cas concret",
      description: "Rendre un cas pratique plus pédagogique.",
      text: "Analyse ce cas concret : [cas]. Améliore le scénario, les consignes, les critères de réussite, les critères d’évaluation, le niveau de difficulté et le débrief formateur."
    },
    {
      id: "p017",
      role: "Dirigeant",
      objective: "Process",
      level: "Avancé",
      title: "Créer une checklist opérationnelle",
      description: "Transformer une procédure en checklist actionnable.",
      text: "Transforme cette procédure : [procédure] en checklist opérationnelle simple. Ajoute les points de contrôle, les erreurs fréquentes, les responsabilités et la fréquence de vérification."
    },
    {
      id: "p018",
      role: "Communication",
      objective: "Calendrier",
      level: "Intermédiaire",
      title: "Calendrier éditorial 30 jours",
      description: "Créer un mois de contenus cohérents.",
      text: "Crée un calendrier éditorial de 30 jours pour [activité]. Objectif : [objectif]. Cible : [cible]. Donne pour chaque publication : sujet, angle, format, accroche, CTA et idée visuelle."
    }
  ],

  diagnostic: [
    { id: "usage", label: "Fréquence d’utilisation de l’IA", low: "Jamais", high: "Quotidienne" },
    { id: "prompt", label: "Qualité des prompts", low: "Improvisée", high: "Structurée" },
    { id: "security", label: "Protection des données", low: "Risque élevé", high: "Maîtrisée" },
    { id: "verify", label: "Vérification des réponses", low: "Rare", high: "Systématique" },
    { id: "produce", label: "Production de livrables", low: "Difficile", high: "Autonome" },
    { id: "workflow", label: "Intégration dans le travail", low: "Aucune", high: "Routine installée" }
  ],

  quiz: [
    { question: "Quel est l’objectif d’un prompt professionnel ?", options: ["Faire une demande vague", "Cadrer objectif, contexte, contraintes et format", "Obtenir le texte le plus long possible", "Éviter la relecture"], answer: 1 },
    { question: "Quelle donnée ne doit pas être transmise telle quelle dans une IA publique ?", options: ["Une idée générale", "Une consigne pédagogique", "Une donnée personnelle ou confidentielle", "Une demande de reformulation"], answer: 2 },
    { question: "Dans la méthode N.C.R AI, que signifie Raffiner ?", options: ["Copier sans relire", "Vérifier, corriger et transformer en livrable", "Changer d’outil", "Supprimer le contexte"], answer: 1 },
    { question: "Face à une réponse IA incertaine, il faut :", options: ["La publier directement", "La vérifier et signaler les limites", "La rendre plus longue", "La traduire sans analyse"], answer: 1 },
    { question: "La meilleure posture professionnelle avec l’IA est :", options: ["Déléguer sans contrôle", "Collaborer, vérifier et décider humainement", "Remplacer toutes les procédures", "Mettre toutes les données pour gagner du temps"], answer: 1 },
    { question: "Une charte d’usage IA sert surtout à :", options: ["Interdire tous les outils", "Encadrer les usages, données, responsabilités et vérifications", "Faire joli dans un dossier", "Remplacer le RGPD"], answer: 1 },
    { question: "Pourquoi demander un format de sortie précis ?", options: ["Pour faire plus long", "Pour obtenir un résultat directement exploitable", "Pour éviter de donner du contexte", "Pour empêcher toute reformulation"], answer: 1 },
    { question: "Quelle est une bonne pratique de sécurité ?", options: ["Copier toutes les données client", "Anonymiser les situations sensibles", "Partager les mots de passe", "Ne jamais relire"], answer: 1 }
  ],

  documents: [
    { id: "d01", title: "Cahier participant", type: "PDF", category: "Formation", description: "Support d’exercices, notes et cas pratiques.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d02", title: "Fiche mémo N.C.R AI", type: "PDF", category: "Méthode", description: "La méthode N.C.R AI en une page.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d03", title: "Charte d’usage IA", type: "DOCX", category: "Sécurité", description: "Modèle de charte interne pour entreprise.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d04", title: "Plan d’intégration 90 jours", type: "PDF", category: "Transformation", description: "Feuille de route post-formation.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d05", title: "Bibliothèque de prompts", type: "DOCX", category: "Prompts", description: "Prompts classés par métier et objectif.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d06", title: "Grille diagnostic IA", type: "XLSX", category: "Évaluation", description: "Score initial, priorités et recommandations.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d07", title: "Kit sécurité IA", type: "PDF", category: "Sécurité", description: "Données sensibles, vérification et bonnes pratiques.", file: "docs/README_DOCUMENTS.txt" },
    { id: "d08", title: "Certificat interne", type: "PDF", category: "Certification", description: "Certificat après validation du QCM et cas pratique.", file: "docs/README_DOCUMENTS.txt" }
  ],

  plan90: [
    { period: "Jours 1 à 7", title: "Installer les bases", tasks: ["Utiliser la méthode N.C.R AI sur 3 tâches simples", "Créer 5 prompts utiles", "Définir les données interdites"] },
    { period: "Jours 8 à 21", title: "Créer les premiers livrables", tasks: ["Produire un mail type", "Créer une procédure", "Créer une fiche mémo ou un plan d’action"] },
    { period: "Jours 22 à 45", title: "Structurer son système IA", tasks: ["Classer les prompts par objectif", "Standardiser les modèles récurrents", "Mettre en place une checklist de vérification"] },
    { period: "Jours 46 à 70", title: "Mesurer les gains", tasks: ["Comparer temps avant / après", "Identifier les tâches les plus rentables", "Corriger les prompts faibles"] },
    { period: "Jours 71 à 90", title: "Professionnaliser l’usage", tasks: ["Créer une charte IA interne", "Former ou sensibiliser l’équipe", "Préparer le bilan et les prochaines améliorations"] }
  ]
};
