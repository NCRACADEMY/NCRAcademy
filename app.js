const CONFIG = window.NCR_CONFIG;
const DATA = window.NCR_DATA;
const LOCAL = window.NCR_LOCAL;
const SUPA = window.NCR_SUPABASE;

const app = document.getElementById("app");
const toastEl = document.getElementById("toast");

let state = {
  user: LOCAL.get("session", null),
  view: "dashboard",
  completed: LOCAL.get("completed", []),
  favorites: LOCAL.get("favorites", []),
  diagnostic: LOCAL.get("diagnostic", {}),
  quiz: LOCAL.get("quiz", { score: 0, answers: [] }),
  caseStudy: LOCAL.get("caseStudy", ""),
  messages: LOCAL.get("messages", []),
  learners: LOCAL.get("learners", [
    { id: "l1", full_name: "Stagiaire Démo", job: "Formateur", cohort: "Promotion IA", progress: 62, score: 71, status: "Actif" },
    { id: "l2", full_name: "Dirigeant Démo", job: "Dirigeant", cohort: "Promotion IA", progress: 42, score: 54, status: "À accompagner" }
  ]),
  dark: LOCAL.get("theme", CONFIG.DEFAULT_THEME) === "dark",
  supabaseReady: false
};

document.body.classList.toggle("dark", state.dark);
init();

async function init() {
  state.supabaseReady = SUPA.init();

  if (CONFIG.APP_MODE === "SUPABASE" && state.supabaseReady) {
    try {
      const session = await SUPA.getSession();
      if (session?.user && !state.user) {
        const profile = await SUPA.getProfile(session.user.id);
        state.user = {
          id: profile.id,
          email: session.user.email,
          full_name: profile.full_name,
          role: profile.role,
          job: profile.job,
          company: profile.company,
          cohort: profile.cohort
        };
      }
    } catch (err) {
      console.warn(err);
      toast("Supabase configuré, mais session non chargée");
    }
  }

  render();
}

function render() {
  if (!state.user) return renderLogin();
  renderShell();
  renderView();
}

function renderLogin() {
  app.innerHTML = `
    <section class="login-page">
      <div class="ambient one"></div>
      <div class="ambient two"></div>

      <article class="login-card glass">
        <div class="brand-row">
          <img src="assets/logo-ncr.png" alt="Logo N.C.R" class="logo big" />
          <div>
            <p class="eyebrow">N.C.R AI Academy V3</p>
            <h1>Espace connecté</h1>
          </div>
        </div>

        <p class="lead">
          Portail membre premium avec progression, diagnostic, Prompt Lab, certification, documents et préparation Supabase.
        </p>

        <span class="mode-pill ${CONFIG.APP_MODE === "SUPABASE" ? "connected" : ""}">
          Mode actuel : ${CONFIG.APP_MODE}
        </span>

        <form id="loginForm" class="form-grid mt">
          <label>${CONFIG.APP_MODE === "SUPABASE" ? "Email" : "Identifiant"}
            <input id="loginId" placeholder="${CONFIG.APP_MODE === "SUPABASE" ? "email@exemple.fr" : "stagiaire"}" autocomplete="username" required />
          </label>
          <label>Mot de passe
            <input id="password" type="password" placeholder="••••••••" autocomplete="current-password" required />
          </label>
          <button class="btn primary" type="submit">Se connecter</button>
          <p id="loginError" class="error"></p>
        </form>

        ${CONFIG.APP_MODE !== "SUPABASE" ? `
          <div class="demo-grid">
            <div><b>Stagiaire</b><span>stagiaire / stagiaire123</span></div>
            <div><b>Formateur</b><span>admin / admin123</span></div>
          </div>
        ` : `
          <p class="lead">Utilise les comptes créés dans Supabase Auth.</p>
        `}
      </article>

      <aside class="login-hero">
        <span class="pill">Connected Ready • Supabase • Academy</span>
        <h2>Une vraie base pour ton espace membre professionnel.</h2>
        <p>
          Cette V3 reste compatible GitHub Pages, mais elle est structurée pour passer à de vrais comptes, une base de données, des certificats sauvegardés et un suivi formateur réel.
        </p>
        <div class="hero-metrics">
          <div><strong>8</strong><span>modules</span></div>
          <div><strong>18</strong><span>prompts</span></div>
          <div><strong>SQL</strong><span>Supabase prêt</span></div>
        </div>
      </aside>
    </section>
  `;

  document.getElementById("loginForm").addEventListener("submit", onLogin);
}

async function onLogin(e) {
  e.preventDefault();
  const loginId = document.getElementById("loginId").value.trim();
  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");

  if (CONFIG.APP_MODE === "SUPABASE" && state.supabaseReady) {
    try {
      const result = await SUPA.login(loginId, password);
      const profile = await SUPA.getProfile(result.user.id);
      state.user = {
        id: profile.id,
        email: result.user.email,
        full_name: profile.full_name,
        role: profile.role,
        job: profile.job,
        company: profile.company,
        cohort: profile.cohort
      };
      LOCAL.set("session", state.user);
      toast("Connexion Supabase réussie");
      return render();
    } catch (err) {
      error.textContent = err.message || "Connexion impossible.";
      return;
    }
  }

  const user = DATA.demoUsers.find(u => u.username === loginId && u.password === password);
  if (!user) {
    error.textContent = "Identifiants incorrects.";
    return;
  }
  state.user = user;
  LOCAL.set("session", user);
  toast("Connexion réussie");
  render();
}

function renderShell() {
  app.innerHTML = `
    <section class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="side-brand">
          <img src="assets/logo-ncr.png" class="logo" alt="N.C.R" />
          <div><span>N.C.R</span><strong>AI Academy V3</strong></div>
        </div>

        <nav class="nav">
          ${navButton("dashboard", "Tableau de bord")}
          ${navButton("learning", "Parcours")}
          ${navButton("promptlab", "Prompt Lab")}
          ${navButton("diagnostic", "Diagnostic IA")}
          ${navButton("documents", "Documents")}
          ${navButton("certification", "Certification")}
          ${navButton("plan90", "Plan 90 jours")}
          ${navButton("messaging", "Messagerie")}
          ${isTrainer() ? navButton("trainer", "Espace formateur") : ""}
          ${navButton("settings", "Paramètres")}
        </nav>

        <div class="side-footer">
          <button class="btn ghost" id="themeBtn">${state.dark ? "Mode clair" : "Mode sombre"}</button>
          <button class="btn ghost danger" id="logoutBtn">Déconnexion</button>
        </div>
      </aside>

      <main class="main">
        <header class="topbar glass">
          <button class="icon-btn" id="menuBtn">☰</button>
          <div>
            <p class="eyebrow">${isTrainer() ? "Espace formateur" : "Espace stagiaire"} • ${CONFIG.APP_MODE}</p>
            <h2>${state.user.full_name}</h2>
          </div>
          <div class="top-actions">
            <div class="search"><span>⌘</span><input id="globalSearch" placeholder="Rechercher..." /></div>
            <div class="avatar">${initials(state.user.full_name)}</div>
          </div>
        </header>
        <section id="view" class="view"></section>
      </main>
    </section>
  `;

  document.querySelectorAll("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      document.querySelector("#sidebar").classList.remove("open");
      renderShell();
      renderView();
    });
  });

  document.getElementById("themeBtn").addEventListener("click", () => {
    state.dark = !state.dark;
    document.body.classList.toggle("dark", state.dark);
    LOCAL.set("theme", state.dark ? "dark" : "light");
    renderShell();
    renderView();
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    if (CONFIG.APP_MODE === "SUPABASE" && state.supabaseReady) await SUPA.logout();
    LOCAL.remove("session");
    state.user = null;
    render();
  });

  document.getElementById("menuBtn").addEventListener("click", () => {
    document.querySelector("#sidebar").classList.toggle("open");
  });

  document.getElementById("globalSearch").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    if (!q) return;
    const promptHit = DATA.prompts.some(p => `${p.title} ${p.text}`.toLowerCase().includes(q));
    const moduleHit = DATA.modules.some(m => `${m.title} ${m.description}`.toLowerCase().includes(q));
    if (promptHit) state.view = "promptlab";
    if (!promptHit && moduleHit) state.view = "learning";
    renderShell();
    renderView();
  });
}

function navButton(view, label) {
  return `<button data-view="${view}" class="nav-link ${state.view === view ? "active" : ""}">${label}</button>`;
}

function renderView() {
  const target = document.getElementById("view");
  const views = {
    dashboard: renderDashboard,
    learning: renderLearning,
    promptlab: renderPromptLab,
    diagnostic: renderDiagnostic,
    documents: renderDocuments,
    certification: renderCertification,
    plan90: renderPlan90,
    messaging: renderMessaging,
    trainer: renderTrainer,
    settings: renderSettings
  };
  target.innerHTML = "";
  views[state.view]?.(target);
}

function renderDashboard(el) {
  const moduleProgress = Math.round((state.completed.length / DATA.modules.length) * 100);
  const diag = diagnosticScore();

  el.innerHTML = `
    <section class="hero-card">
      <div>
        <span class="pill">N.C.R AI Academy V3 Connected</span>
        <h1>Ton espace IA devient une vraie plateforme.</h1>
        <p>Formation, progression, diagnostic, Prompt Lab, certification, messagerie, documents et préparation Supabase.</p>
        <div class="button-row">
          <button class="btn primary" data-go="diagnostic">Diagnostic IA</button>
          <button class="btn secondary" data-go="promptlab">Prompt Lab</button>
        </div>
      </div>
      <div class="score-orb"><strong>${diag.total}</strong><span>Score IA</span></div>
    </section>

    <section class="grid four">
      ${statCard("Progression", `${moduleProgress}%`, "Modules validés", moduleProgress)}
      ${statCard("Prompts favoris", state.favorites.length, "Modèles prêts", null)}
      ${statCard("QCM", `${state.quiz.score}%`, "Validation à ${CONFIG.CERTIFICATION_PASS_SCORE}%", state.quiz.score)}
      ${statCard("Mode", CONFIG.APP_MODE, CONFIG.APP_MODE === "SUPABASE" ? "Connecté" : "Démo locale", null)}
    </section>

    <section class="grid two">
      <article class="panel">
        <div class="panel-head"><h3>Actions prioritaires</h3><button class="mini" data-go="plan90">Voir le plan</button></div>
        <ul class="task-list">
          <li>Terminer le diagnostic IA et sauvegarder le score.</li>
          <li>Valider les modules Essentiel, Prompt Lab et Sécurité.</li>
          <li>Créer 10 prompts personnalisés pour ton activité.</li>
          <li>Rédiger un cas pratique final et passer le QCM.</li>
        </ul>
      </article>
      <article class="panel">
        <div class="panel-head"><h3>Modules recommandés</h3><button class="mini" data-go="learning">Tout voir</button></div>
        <div class="mini-list">
          ${DATA.modules.slice(0, 4).map(m => `<div><b>${m.title}</b><span>${m.track} • ${m.duration}</span></div>`).join("")}
        </div>
      </article>
    </section>
  `;
  bindGo();
}

function statCard(title, value, text, percent) {
  return `
    <article class="stat-card">
      <span>${title}</span>
      <strong>${value}</strong>
      <p>${text}</p>
      ${percent !== null ? `<div class="progress"><i style="width:${percent}%"></i></div>` : ""}
    </article>
  `;
}

function renderLearning(el) {
  const tracks = ["Tous", ...new Set(DATA.modules.map(m => m.track))];

  el.innerHTML = `
    ${heading("Parcours de formation", "Un parcours clair pour apprendre, pratiquer, sécuriser et transformer son activité avec l’IA.", "Formation")}
    <div class="filters glass">
      ${select("trackFilter", tracks)}
      <input id="moduleSearch" placeholder="Rechercher un module..." />
    </div>
    <div id="moduleGrid" class="card-grid"></div>
  `;

  document.getElementById("trackFilter").addEventListener("input", drawModules);
  document.getElementById("moduleSearch").addEventListener("input", drawModules);

  function drawModules() {
    const track = document.getElementById("trackFilter").value;
    const q = document.getElementById("moduleSearch").value.toLowerCase();
    const modules = DATA.modules.filter(m =>
      (track === "Tous" || m.track === track) &&
      (`${m.title} ${m.description} ${m.track}`.toLowerCase().includes(q))
    );

    document.getElementById("moduleGrid").innerHTML = modules.map(m => {
      const done = state.completed.includes(m.id);
      return `
        <article class="course-card">
          <div class="course-top">
            <span class="module-number">${String(m.sort).padStart(2, "0")}</span>
            <span class="tag">${m.badge}</span>
          </div>
          <h3>${m.title}</h3>
          <p>${m.description}</p>
          <div class="module-meta">
            <span>${m.track}</span><span>${m.duration}</span><span>${m.difficulty}</span>
          </div>
          <div class="outcome"><b>Objectif :</b> ${m.outcome}</div>
          <details>
            <summary>Voir les étapes et ressources</summary>
            <ul>${m.lessons.map(l => `<li>${l}</li>`).join("")}</ul>
            <p><b>Ressources :</b> ${m.resources.join(", ")}</p>
          </details>
          <button class="btn ${done ? "success" : "secondary"} full module-toggle" data-id="${m.id}">
            ${done ? "Module terminé" : "Marquer comme terminé"}
          </button>
        </article>
      `;
    }).join("");

    document.querySelectorAll(".module-toggle").forEach(btn => btn.addEventListener("click", async () => {
      await toggleModule(btn.dataset.id);
      drawModules();
    }));
  }

  drawModules();
}

async function toggleModule(moduleId) {
  const completed = !state.completed.includes(moduleId);

  if (completed) state.completed.push(moduleId);
  else state.completed = state.completed.filter(id => id !== moduleId);

  LOCAL.set("completed", state.completed);

  if (CONFIG.APP_MODE === "SUPABASE" && state.supabaseReady && state.user.id) {
    try { await SUPA.upsertProgress(state.user.id, moduleId, completed); }
    catch (err) { console.warn(err); toast("Progression locale OK, synchro Supabase impossible"); return; }
  }

  toast("Progression mise à jour");
}

function renderPromptLab(el) {
  const roles = ["Tous", ...new Set(DATA.prompts.map(p => p.role))];
  const objectives = ["Tous", ...new Set(DATA.prompts.map(p => p.objective))];
  const levels = ["Tous", ...new Set(DATA.prompts.map(p => p.level))];

  el.innerHTML = `
    ${heading("Prompt Lab", "Bibliothèque intelligente, favoris et générateur de prompts selon la méthode N.C.R AI.", "Prompts")}

    <section class="grid two">
      <article class="panel builder">
        <h3>Générateur N.C.R AI</h3>
        <p>Construis un prompt structuré avec rôle, contexte, mission, contraintes et format attendu.</p>
        <label>Rôle de l’IA<input id="bRole" placeholder="Ex : ingénieur pédagogique, consultant organisation..." /></label>
        <label>Contexte<input id="bContext" placeholder="Ex : formation pour dirigeants, TPE, salariés..." /></label>
        <label>Mission<input id="bMission" placeholder="Ex : créer une procédure, un déroulé, un post..." /></label>
        <label>Contraintes<input id="bConstraints" placeholder="Ex : ton direct, format tableau, durée 7h..." /></label>
        <label>Format attendu<input id="bFormat" placeholder="Ex : tableau, liste d’actions, fiche mémo..." /></label>
        <button class="btn primary full" id="buildPromptBtn">Générer le prompt</button>
        <textarea id="generatedPrompt" rows="8" placeholder="Ton prompt généré apparaîtra ici..."></textarea>
        <button class="btn secondary full" id="copyGeneratedBtn">Copier le prompt généré</button>
      </article>

      <article class="panel">
        <h3>Check-list prompt pro</h3>
        <ul class="task-list">
          <li>Le rôle de l’IA est clair.</li>
          <li>Le contexte est précis.</li>
          <li>La mission est actionnable.</li>
          <li>Les contraintes sont visibles.</li>
          <li>Le format attendu est imposé.</li>
          <li>Une étape de vérification est demandée.</li>
        </ul>
      </article>
    </section>

    <div class="filters glass">
      ${select("roleFilter", roles)}
      ${select("objectiveFilter", objectives)}
      ${select("levelFilter", levels)}
      <input id="promptSearch" placeholder="Rechercher dans les prompts..." />
    </div>

    <div id="promptGrid" class="prompt-grid"></div>
  `;

  document.getElementById("buildPromptBtn").addEventListener("click", () => {
    const v = id => document.getElementById(id).value.trim() || "[à compléter]";
    const prompt = `Agis comme ${v("bRole")}.

Contexte :
${v("bContext")}

Mission :
${v("bMission")}

Contraintes :
${v("bConstraints")}

Format attendu :
${v("bFormat")}

Méthode attendue :
1. Pose-moi les questions indispensables si des informations manquent.
2. Propose une première version structurée.
3. Ajoute une checklist de vérification.
4. Signale clairement les points à vérifier ou les limites éventuelles.`;
    document.getElementById("generatedPrompt").value = prompt;
    toast("Prompt généré");
  });

  document.getElementById("copyGeneratedBtn").addEventListener("click", () => copyText(document.getElementById("generatedPrompt").value));

  ["roleFilter","objectiveFilter","levelFilter","promptSearch"].forEach(id => document.getElementById(id).addEventListener("input", drawPrompts));

  function drawPrompts() {
    const role = document.getElementById("roleFilter").value;
    const obj = document.getElementById("objectiveFilter").value;
    const level = document.getElementById("levelFilter").value;
    const q = document.getElementById("promptSearch").value.toLowerCase();

    const prompts = DATA.prompts.filter(p =>
      (role === "Tous" || p.role === role) &&
      (obj === "Tous" || p.objective === obj) &&
      (level === "Tous" || p.level === level) &&
      (`${p.title} ${p.description} ${p.text}`.toLowerCase().includes(q))
    );

    document.getElementById("promptGrid").innerHTML = prompts.map(p => {
      const fav = state.favorites.includes(p.id);
      return `
        <article class="prompt-card">
          <div class="prompt-tags"><span>${p.role}</span><span>${p.objective}</span><span>${p.level}</span></div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <pre>${escapeHtml(p.text)}</pre>
          <div class="button-row">
            <button class="mini copy-prompt" data-id="${p.id}">Copier</button>
            <button class="mini fav-prompt ${fav ? "active" : ""}" data-id="${p.id}">${fav ? "Favori" : "Ajouter"}</button>
          </div>
        </article>
      `;
    }).join("");

    document.querySelectorAll(".copy-prompt").forEach(btn => btn.addEventListener("click", () => {
      const p = DATA.prompts.find(x => x.id === btn.dataset.id);
      copyText(p.text);
    }));

    document.querySelectorAll(".fav-prompt").forEach(btn => btn.addEventListener("click", () => {
      toggleFavorite(btn.dataset.id);
      drawPrompts();
    }));
  }

  drawPrompts();
}

function toggleFavorite(id) {
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter(x => x !== id)
    : [...state.favorites, id];

  LOCAL.set("favorites", state.favorites);
  toast("Favoris mis à jour");
}

function renderDiagnostic(el) {
  el.innerHTML = `
    ${heading("Diagnostic IA", "Mesure le niveau de départ, identifie les priorités et génère une recommandation concrète.", "Score N.C.R IA")}
    <section class="grid two">
      <form id="diagForm" class="panel diag-form">
        ${DATA.diagnostic.map(q => {
          const val = state.diagnostic[q.id] || 3;
          return `
            <div class="range-card">
              <label>${q.label}</label>
              <div class="range-line">
                <input type="range" min="1" max="5" value="${val}" name="${q.id}" />
                <strong>${val}/5</strong>
              </div>
              <div class="range-labels"><span>${q.low}</span><span>${q.high}</span></div>
            </div>
          `;
        }).join("")}
        <button class="btn primary full" type="submit">Calculer et sauvegarder mon score</button>
      </form>

      <aside class="panel result-panel">
        <h3>Résultat personnalisé</h3>
        <div class="score-orb small"><strong id="diagScore">${diagnosticScore().total}</strong><span>/100</span></div>
        <h2 id="diagLevel">${diagnosticLevel(diagnosticScore().total).level}</h2>
        <p id="diagAdvice">${diagnosticLevel(diagnosticScore().total).advice}</p>
        <div id="diagBars" class="bars"></div>
      </aside>
    </section>
  `;

  document.querySelectorAll("#diagForm input[type=range]").forEach(input => {
    input.addEventListener("input", () => {
      input.parentElement.querySelector("strong").textContent = `${input.value}/5`;
    });
  });

  document.getElementById("diagForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    DATA.diagnostic.forEach(q => state.diagnostic[q.id] = Number(form.get(q.id)));
    LOCAL.set("diagnostic", state.diagnostic);

    const score = diagnosticScore().total;
    const recommendation = diagnosticLevel(score).advice;

    if (CONFIG.APP_MODE === "SUPABASE" && state.supabaseReady && state.user.id) {
      try { await SUPA.saveDiagnostic(state.user.id, score, state.diagnostic, recommendation); }
      catch (err) { console.warn(err); toast("Diagnostic local OK, synchro Supabase impossible"); return renderView(); }
    }

    toast("Diagnostic sauvegardé");
    renderView();
  });

  drawDiagnosticBars();
}

function drawDiagnosticBars() {
  const bars = document.getElementById("diagBars");
  bars.innerHTML = DATA.diagnostic.map(q => {
    const val = (state.diagnostic[q.id] || 0) * 20;
    return `<div class="bar-row"><span>${q.label}<b>${val}%</b></span><div class="progress"><i style="width:${val}%"></i></div></div>`;
  }).join("");
}

function renderDocuments(el) {
  const cats = ["Tous", ...new Set(DATA.documents.map(d => d.category))];
  el.innerHTML = `
    ${heading("Documents", "Centralise les ressources, supports, modèles et livrables de la formation.", "Ressources")}
    <div class="filters glass">
      ${select("docCat", cats)}
      <input id="docSearch" placeholder="Rechercher un document..." />
    </div>
    <div id="docsGrid" class="card-grid docs"></div>
  `;

  document.getElementById("docCat").addEventListener("input", drawDocs);
  document.getElementById("docSearch").addEventListener("input", drawDocs);

  function drawDocs() {
    const cat = document.getElementById("docCat").value;
    const q = document.getElementById("docSearch").value.toLowerCase();
    const docs = DATA.documents.filter(d =>
      (cat === "Tous" || d.category === cat) &&
      (`${d.title} ${d.description} ${d.category}`.toLowerCase().includes(q))
    );

    document.getElementById("docsGrid").innerHTML = docs.map(d => `
      <article class="doc-card">
        <span class="doc-type">${d.type}</span>
        <h3>${d.title}</h3>
        <p>${d.description}</p>
        <span class="tag">${d.category}</span>
        <a class="btn secondary full" href="${d.file}" target="_blank">Ouvrir</a>
      </article>
    `).join("");
  }

  drawDocs();
}

function renderCertification(el) {
  el.innerHTML = `
    ${heading("Certification", "Valide les acquis avec un QCM et un cas pratique métier. Certification interne N.C.R AI Academy.", "Validation")}
    <section class="grid two">
      <form id="quizForm" class="panel quiz">
        <h3>QCM final</h3>
        ${DATA.quiz.map((q, i) => `
          <div class="quiz-block">
            <h4>${i + 1}. ${q.question}</h4>
            ${q.options.map((o, j) => `
              <label><input type="radio" name="q${i}" value="${j}" required /> ${o}</label>
            `).join("")}
          </div>
        `).join("")}
        <button class="btn primary full" type="submit">Valider le QCM</button>
      </form>

      <aside class="panel">
        <h3>Cas pratique final</h3>
        <p>Décris le livrable produit avec l’IA : objectif, prompt utilisé, vérifications, résultat obtenu et amélioration possible.</p>
        <textarea id="caseStudy" rows="9" placeholder="Ex : j’ai créé une procédure interne / une séquence pédagogique / un plan d’action...">${escapeHtml(state.caseStudy)}</textarea>
        <button class="btn secondary full" id="saveCaseBtn">Enregistrer le cas pratique</button>

        <div class="certificate">
          <img src="assets/logo-ncr.png" alt="" />
          <span>Certificat interne</span>
          <h2>N.C.R AI Academy</h2>
          <p>Attribué à <b>${state.user.full_name}</b></p>
          <p>${state.quiz.score >= CONFIG.CERTIFICATION_PASS_SCORE ? `QCM validé avec ${state.quiz.score}%` : `QCM actuel : ${state.quiz.score}% — validation à ${CONFIG.CERTIFICATION_PASS_SCORE}%`}</p>
        </div>
        <button class="btn primary full" id="printBtn">Imprimer / exporter PDF</button>
      </aside>
    </section>
  `;

  document.getElementById("quizForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = new FormData(e.target);
    let good = 0;
    const answers = DATA.quiz.map((q, i) => {
      const a = Number(form.get(`q${i}`));
      if (a === q.answer) good++;
      return a;
    });

    state.quiz = { score: Math.round((good / DATA.quiz.length) * 100), answers };
    LOCAL.set("quiz", state.quiz);

    if (CONFIG.APP_MODE === "SUPABASE" && state.supabaseReady && state.user.id) {
      try { await SUPA.saveQuiz(state.user.id, state.quiz.score, answers, state.caseStudy); }
      catch (err) { console.warn(err); toast("QCM local OK, synchro Supabase impossible"); return renderView(); }
    }

    toast(`Score QCM : ${state.quiz.score}%`);
    renderView();
  });

  document.getElementById("saveCaseBtn").addEventListener("click", () => {
    state.caseStudy = document.getElementById("caseStudy").value;
    LOCAL.set("caseStudy", state.caseStudy);
    toast("Cas pratique enregistré");
  });

  document.getElementById("printBtn").addEventListener("click", () => window.print());
}

function renderPlan90(el) {
  el.innerHTML = `
    ${heading("Plan d’intégration 90 jours", "Un suivi structuré pour transformer la formation en habitudes professionnelles mesurables.", "Transformation")}
    <div class="timeline">
      ${DATA.plan90.map(p => `
        <article class="timeline-item">
          <div class="timeline-date">${p.period}</div>
          <div class="timeline-card">
            <h3>${p.title}</h3>
            <ul>${p.tasks.map(t => `<li>${t}</li>`).join("")}</ul>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderMessaging(el) {
  el.innerHTML = `
    ${heading("Messagerie", "Un espace simple pour échanger des questions entre stagiaire et formateur.", "Suivi")}
    <section class="grid two">
      <form id="messageForm" class="panel">
        <h3>Nouveau message</h3>
        <label>Sujet<input name="subject" placeholder="Ex : question sur un prompt" required /></label>
        <label>Message<textarea name="body" rows="8" placeholder="Écris ton message..." required></textarea></label>
        <button class="btn primary full" type="submit">Envoyer</button>
      </form>
      <article class="panel">
        <h3>Messages</h3>
        <div id="messagesList" class="mini-list"></div>
      </article>
    </section>
  `;

  document.getElementById("messageForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(e.target);
    const message = {
      id: String(Date.now()),
      from: state.user.full_name,
      subject: form.get("subject"),
      body: form.get("body"),
      date: new Date().toLocaleString("fr-FR")
    };
    state.messages.unshift(message);
    LOCAL.set("messages", state.messages);
    e.target.reset();
    toast("Message enregistré");
    drawMessages();
  });

  drawMessages();

  function drawMessages() {
    const list = document.getElementById("messagesList");
    list.innerHTML = state.messages.length
      ? state.messages.map(m => `<div><b>${escapeHtml(m.subject)}</b><span>${escapeHtml(m.from)} • ${m.date}</span><p>${escapeHtml(m.body)}</p></div>`).join("")
      : `<p>Aucun message pour le moment.</p>`;
  }
}

function renderTrainer(el) {
  el.innerHTML = `
    ${heading("Espace formateur", "Pilote les apprenants, prépare les accès, suit les scores et exporte les données.", "Administration")}
    <section class="grid two">
      <form id="learnerForm" class="panel">
        <h3>Créer un apprenant</h3>
        <label>Nom complet<input name="full_name" required placeholder="Nom du stagiaire" /></label>
        <label>Profil<input name="job" required placeholder="Formateur, dirigeant..." /></label>
        <label>Promotion<input name="cohort" required placeholder="Ex : IA Academy - Juillet" /></label>
        <button class="btn primary full" type="submit">Ajouter en local</button>
        <p>En mode Supabase, la création réelle du compte se fait depuis Supabase Auth ou via une fonction sécurisée.</p>
      </form>

      <article class="panel">
        <h3>Statistiques</h3>
        <div class="admin-stats">
          <div><strong>${state.learners.length}</strong><span>apprenants</span></div>
          <div><strong>${Math.round(avg(state.learners.map(l => l.progress))) || 0}%</strong><span>progression moyenne</span></div>
          <div><strong>${Math.round(avg(state.learners.map(l => l.score))) || 0}</strong><span>score moyen</span></div>
        </div>
        <div class="button-row mt">
          <button class="btn secondary" id="exportBtn">Exporter données</button>
          <button class="btn ghost danger" id="resetBtn">Réinitialiser local</button>
        </div>
      </article>
    </section>

    <section class="panel table-panel">
      <h3>Suivi des apprenants</h3>
      <table>
        <thead><tr><th>Nom</th><th>Profil</th><th>Promotion</th><th>Progression</th><th>Score</th><th>Statut</th></tr></thead>
        <tbody>
          ${state.learners.map(l => `<tr><td>${l.full_name}</td><td>${l.job}</td><td>${l.cohort}</td><td>${l.progress}%</td><td>${l.score}/100</td><td>${l.status}</td></tr>`).join("")}
        </tbody>
      </table>
    </section>
  `;

  document.getElementById("learnerForm").addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(e.target);
    state.learners.push({
      id: String(Date.now()),
      full_name: form.get("full_name"),
      job: form.get("job"),
      cohort: form.get("cohort"),
      progress: 0,
      score: 0,
      status: "Nouveau"
    });
    LOCAL.set("learners", state.learners);
    toast("Apprenant ajouté localement");
    renderView();
  });

  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (confirm("Réinitialiser les données locales ?")) {
      LOCAL.reset();
      location.reload();
    }
  });
}

function renderSettings(el) {
  el.innerHTML = `
    ${heading("Paramètres", "Informations de l’académie, mode de fonctionnement et préparation de la version connectée.", "Configuration")}
    <section class="grid two">
      <article class="panel">
        <h3>Informations N.C.R</h3>
        <div class="info-list">
          <p><b>Académie :</b> ${CONFIG.ACADEMY_NAME}</p>
          <p><b>Produit :</b> ${CONFIG.PRODUCT_NAME}</p>
          <p><b>Structure :</b> ${CONFIG.BRAND_NAME}</p>
          <p><b>Email :</b> ${CONFIG.CONTACT_EMAIL}</p>
          <p><b>SIRET :</b> ${CONFIG.SIRET}</p>
          <p><b>Adresse :</b> ${CONFIG.ADDRESS}</p>
        </div>
      </article>
      <article class="panel">
        <h3>Mode technique</h3>
        <p>Mode actuel : <b>${CONFIG.APP_MODE}</b></p>
        <p>Supabase initialisé : <b>${state.supabaseReady ? "Oui" : "Non"}</b></p>
        <p>Cette V3 est prête pour une connexion Supabase avec Auth, profils, progression, diagnostic et QCM.</p>
        <button class="btn secondary full" id="downloadExportBtn">Télécharger mes données locales</button>
      </article>
    </section>
  `;
  document.getElementById("downloadExportBtn").addEventListener("click", exportData);
}

function isTrainer() {
  return ["formateur", "admin"].includes(state.user?.role);
}

function heading(title, subtitle, pill) {
  return `<header class="section-head"><span class="pill">${pill}</span><h1>${title}</h1><p>${subtitle}</p></header>`;
}

function select(id, values) {
  return `<select id="${id}">${values.map(v => `<option value="${v}">${v}</option>`).join("")}</select>`;
}

function bindGo() {
  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.view = btn.dataset.go;
      renderShell();
      renderView();
    });
  });
}

function diagnosticScore() {
  const vals = DATA.diagnostic.map(q => Number(state.diagnostic[q.id] || 0));
  return { total: Math.round(vals.reduce((a,b) => a + b, 0) / (DATA.diagnostic.length * 5) * 100) };
}

function diagnosticLevel(score) {
  if (score === 0) return { level: "Non évalué", advice: "Complète le diagnostic pour obtenir une recommandation." };
  if (score < 40) return { level: "Niveau découverte", advice: "Priorité : bases, sécurité et premiers prompts structurés." };
  if (score < 70) return { level: "Niveau opérationnel", advice: "Priorité : standardiser les prompts et vérifier les livrables." };
  return { level: "Niveau avancé", advice: "Priorité : intégrer l’IA aux procédures, mesurer les gains et transmettre la méthode." };
}

function copyText(text) {
  if (!text) return toast("Rien à copier");
  navigator.clipboard?.writeText(text);
  toast("Copié");
}

function exportData() {
  const data = LOCAL.all();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ncr-ai-academy-v3-export.json";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("Export généré");
}

function initials(name) {
  return name.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[m]));
}

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((a,b) => a + b, 0) / values.length;
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}
