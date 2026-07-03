
const DATA=window.NCR_DATA, CONFIG=window.NCR_CONFIG, LOCAL=window.NCR_LOCAL, SUPA=window.NCR_SUPABASE;
const app=document.getElementById("app"), modalRoot=document.getElementById("modalRoot"), toastEl=document.getElementById("toast");
let state={
  user:LOCAL.get("session",null),
  view:LOCAL.get("view","portal"),
  academy:LOCAL.get("academy",CONFIG.DEFAULT_ACADEMY),
  done:LOCAL.get("done",{}),
  fav:LOCAL.get("fav",[]),
  quiz:LOCAL.get("quiz",{}),
  learners:LOCAL.get("learners",DATA.learners),
  cohorts:LOCAL.get("cohorts",DATA.cohorts),
  supabaseReady:false
};
init();
async function init(){
  state.supabaseReady=SUPA.init();
  if(CONFIG.APP_MODE==="SUPABASE"&&state.supabaseReady&&!state.user){
    try{const s=await SUPA.getSession(); if(s?.user){const p=await SUPA.profile(s.user.id); state.user=normalizeProfile(p,s.user.email); LOCAL.set("session",state.user)}}catch(e){console.warn(e)}
  }
  render();
}
function render(){ if(!state.user) return login(); shell(); route(); }
function login(){
 app.innerHTML=`<section class="login-page">
 <div class="orb o1"></div><div class="orb o2"></div>
 <article class="login-card glass">
 <div class="brand"><img src="assets/logo-ncr.png" class="logo big" onerror="this.style.display='none'"><div><p class="eyebrow">N.C.R Solutions</p><h1>Academy Platform V6</h1></div></div>
 <p class="lead">Un portail unique pour tes formations classiques, ton IA Academy et ton univers SST.</p>
 <span class="mode">${CONFIG.APP_MODE}</span>
 <form id="loginForm" class="form">
 <label>${CONFIG.APP_MODE==="SUPABASE"?"Email":"Identifiant"}<input id="loginId" required placeholder="${CONFIG.APP_MODE==="SUPABASE"?"email@exemple.fr":"admin"}"></label>
 <label>Mot de passe<input id="password" required type="password" placeholder="••••••••"></label>
 <button class="btn primary">Se connecter</button><p id="err" class="error"></p></form>
 <div class="demo"><b>Démo locale</b><span>admin/admin123 - business/business123 - ia/ia123 - sst/sst123</span></div>
 </article>
 <aside class="login-hero"><span class="pill">Business + IA + SST</span><h2>Une plateforme de formation complète, premium et évolutive.</h2>
 <p>Parcours, modules, documents, cas concrets, QCM, certificats, prompts, simulateur d'alerte et espace formateur.</p>
 <div class="metrics"><div><b>${DATA.academies.length}</b><span>académies</span></div><div><b>${DATA.courses.length}</b><span>parcours</span></div><div><b>${DATA.modules.length}</b><span>modules</span></div><div><b>${DATA.documents.length}</b><span>documents</span></div></div></aside>
 </section>`;
 document.getElementById("loginForm").addEventListener("submit",onLogin);
}
async function onLogin(e){
 e.preventDefault(); const id=v("loginId").trim(), pass=v("password"), err=document.getElementById("err");
 if(CONFIG.APP_MODE==="SUPABASE"&&state.supabaseReady){
   try{const r=await SUPA.login(id,pass); const p=await SUPA.profile(r.user.id); state.user=normalizeProfile(p,r.user.email); LOCAL.set("session",state.user); toast("Connexion Supabase réussie"); return render()}catch(ex){err.textContent=ex.message||"Connexion impossible"; return}
 }
 const u=DATA.demoUsers.find(x=>x.username===id&&x.password===pass);
 if(!u){err.textContent="Identifiants incorrects";return}
 state.user=u; LOCAL.set("session",u); toast("Connexion réussie"); render();
}
function shell(){
 app.innerHTML=`<section class="shell">
 <aside class="sidebar" id="side"><div class="side-brand"><img src="assets/logo-ncr.png" class="logo" onerror="this.style.display='none'"><div><span>N.C.R</span><strong>Academy Platform</strong></div></div>
 <div class="academy-switch">${DATA.academies.filter(a=>canAccess(a.id)).map(a=>`<button class="academy-pill ${state.academy===a.id?'active':''}" data-academy="${a.id}">${a.label}</button>`).join("")}</div>
 <nav>${nav("portal","Portail")}${nav("dashboard","Dashboard")}${nav("courses","Formations")}${nav("modules","Modules")}${nav("documents","Documents")}${nav("cases","Cas pratiques")}${state.academy==="ai"?nav("prompts","Prompt Lab"):""}${state.academy==="sst"?nav("simulator","Simulateur alerte"):""}${nav("quiz","QCM & certificat")}${isStaff()?nav("admin","Espace formateur"):""}${nav("settings","Paramètres")}</nav>
 <div class="side-bottom"><button id="logout" class="btn ghost danger">Déconnexion</button></div></aside>
 <main><header class="topbar glass"><button id="menu" class="icon">☰</button><div><p class="eyebrow">${academy().name}</p><h2>${state.user.full_name}</h2></div><div class="avatar">${initials(state.user.full_name)}</div></header><section id="view" class="view"></section></main></section>`;
 document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>setView(b.dataset.view));
 document.querySelectorAll("[data-academy]").forEach(b=>b.onclick=()=>{state.academy=b.dataset.academy;LOCAL.set("academy",state.academy);setView("dashboard")});
 document.getElementById("logout").onclick=async()=>{if(state.supabaseReady)await SUPA.logout();LOCAL.remove("session");state.user=null;render()};
 document.getElementById("menu").onclick=()=>document.getElementById("side").classList.toggle("open");
}
function nav(id,label){return `<button data-view="${id}" class="nav ${state.view===id?'active':''}">${label}</button>`}
function setView(x){state.view=x;LOCAL.set("view",x);render()}
function route(){const el=document.getElementById("view");({portal,dashboard,courses,modules,documents,cases,prompts,simulator,quiz,admin,settings}[state.view]||portal)(el)}
function portal(el){
 el.innerHTML=`<div class="section-head"><span class="pill">Portail multi-académies</span><h1>N.C.R Academy Platform</h1><p>Choisis l'espace de travail : formations classiques, IA Academy ou SST Academy.</p></div><div class="academy-grid">${DATA.academies.filter(a=>canAccess(a.id)).map(a=>`<article class="academy-card"><span>${a.label}</span><h2>${a.name}</h2><p>${a.tagline}</p><button class="btn primary" onclick="state.academy='${a.id}';LOCAL.set('academy','${a.id}');setView('dashboard')">Entrer</button></article>`).join("")}</div>`;
}
function dashboard(el){
 const mods=modsA(), docs=docsA(), cs=casesA(), done=doneA().length, pct=Math.round(done/Math.max(1,mods.length)*100), q=(state.quiz[state.academy]?.score)||0;
 el.innerHTML=`<section class="hero"><div><span class="pill">${academy().label}</span><h1>${academy().name}</h1><p>${academy().tagline}</p><div class="actions"><button class="btn primary" onclick="setView('modules')">Continuer</button><button class="btn secondary" onclick="setView('documents')">Documents</button></div></div><div class="orb-score"><b>${pct}</b><span>%</span></div></section>
 <div class="grid four">${stat("Modules",mods.length,"contenus disponibles")}${stat("Progression",pct+"%","modules terminés")}${stat("Documents",docs.length,"ressources PDF")}${stat("QCM",q+"%","meilleur score")}</div>
 <div class="grid two"><article class="panel"><h3>Actions prioritaires</h3><ul class="tasks"><li>Ouvrir les modules de l'académie.</li><li>Télécharger les documents utiles.</li><li>Réaliser un cas pratique.</li><li>Passer le QCM final.</li></ul></article><article class="panel"><h3>Cas pratiques</h3>${cs.slice(0,3).map(c=>`<div class="mini"><b>${c.title}</b><span>${c.type}</span></div>`).join("")}</article></div>`;
}
function courses(el){el.innerHTML=head("Formations","Parcours disponibles dans cet espace.")+`<div class="cards">${coursesA().map(c=>`<article class="card"><span class="tag">${c.level}</span><h3>${c.title}</h3><p>${c.description}</p><div class="meta"><span>${c.duration}</span><span>${modsA().filter(m=>m.course===c.id).length} modules</span></div><button class="btn secondary full" onclick="openCourse('${c.id}')">Détail</button></article>`).join("")}</div>`}
function modules(el){el.innerHTML=head("Modules","Objectifs, activités, critères de réussite et validation.")+`<div class="cards">${modsA().map(m=>{const d=doneA().includes(m.id);return `<article class="card"><div class="num">${m.sort}</div><h3>${m.title}</h3><p>${m.description}</p><div class="meta"><span>${m.track}</span><span>${m.duration}</span><span>${m.level}</span></div><details><summary>Activité et critères</summary><p><b>Atelier :</b> ${m.activity}</p><ul>${m.criteria.map(x=>`<li>${x}</li>`).join("")}</ul></details><button class="btn ${d?'success':'secondary'} full" onclick="toggleDone('${m.id}')">${d?'Terminé':'Marquer terminé'}</button></article>`}).join("")}</div>`}
function documents(el){el.innerHTML=head("Documents","Ressources PDF prêtes à l'emploi.")+`<div class="cards docs">${docsA().map(d=>`<article class="card doc"><span class="tag">${d.category}</span><h3>${d.title}</h3><p>${d.description}</p><a class="btn secondary full" href="${d.file}" target="_blank">Ouvrir le PDF</a></article>`).join("")}</div>`}
function cases(el){el.innerHTML=head("Cas pratiques","Scénarios, consignes et critères d'évaluation.")+`<div class="cards">${casesA().map(c=>`<article class="card"><span class="tag">${c.type}</span><h3>${c.title}</h3><p>${c.scenario}</p><h4>Consignes</h4><p>${c.instructions}</p><h4>Critères</h4><ul>${c.criteria.map(x=>`<li>${x}</li>`).join("")}</ul></article>`).join("")}</div>`}
function prompts(el){
 el.innerHTML=head("Prompt Lab","Bibliothèque de prompts professionnels conservée et enrichie.")+`<div class="filters"><input id="ps" placeholder="Rechercher un prompt..."><select id="pr"><option>Tous</option>${[...new Set(DATA.prompts.map(p=>p.role))].map(x=>`<option>${x}</option>`).join("")}</select></div><div id="promptGrid" class="prompt-grid"></div>`;
 const draw=()=>{const q=v("ps").toLowerCase(), r=v("pr"); const list=DATA.prompts.filter(p=>(p.academy==="ai"||p.academy==="business")&&(r==="Tous"||p.role===r)&&(`${p.title} ${p.text}`.toLowerCase().includes(q))).slice(0,150); document.getElementById("promptGrid").innerHTML=list.map(p=>`<article class="prompt-card"><span class="tag">${p.role}</span><h3>${p.title}</h3><p>${p.description}</p><pre>${esc(p.text)}</pre><button class="btn secondary full" onclick="copy('${p.id}')">Copier</button></article>`).join("")}; document.getElementById("ps").oninput=draw; document.getElementById("pr").oninput=draw; draw();
}
function simulator(el){
 const scenarios=casesA(); const c=scenarios[Math.floor(Math.random()*scenarios.length)]||DATA.cases.find(x=>x.academy==="sst");
 el.innerHTML=head("Simulateur d'alerte","S'entraîner à transmettre Où, Quoi, Bilan, Gestes.")+`<article class="panel simulator"><h3>${c.title}</h3><p>${c.scenario}</p><div class="grid two"><label>Où ?<textarea id="ou"></textarea></label><label>Quoi ?<textarea id="quoi"></textarea></label><label>Bilan ?<textarea id="bilan"></textarea></label><label>Gestes réalisés ?<textarea id="gestes"></textarea></label></div><button class="btn primary" onclick="checkAlert()">Vérifier</button><div id="alertResult"></div></article>`;
}
function quiz(el){
 const qs=DATA.quiz[state.academy]||[], prev=state.quiz[state.academy]?.score||0;
 el.innerHTML=head("QCM & certificat","Validation interne par académie.")+`<div class="grid two"><form id="qcm" class="panel">${qs.map((q,i)=>`<div class="q"><h4>${i+1}. ${q[0]}</h4>${q[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}" required> ${o}</label>`).join("")}</div>`).join("")}<button class="btn primary full">Valider</button></form><article class="panel cert"><h3>Certificat interne</h3><p>Meilleur score : <b>${prev}%</b></p><p>ID : ${certId()}</p><div class="certbox"><img src="assets/logo-ncr.png" onerror="this.style.display='none'"><h2>${academy().name}</h2><p>${state.user.full_name}</p><p>${prev>=CONFIG.CERTIFICATION_PASS_SCORE?'Validé':'À valider'}</p></div><button class="btn secondary full" onclick="window.print()">Imprimer</button></article></div>`;
 document.getElementById("qcm").onsubmit=async e=>{e.preventDefault();let good=0, ans=[];const f=new FormData(e.target);qs.forEach((q,i)=>{const a=Number(f.get("q"+i));ans.push(a); if(a===q[2])good++});const score=Math.round(good/qs.length*100);state.quiz[state.academy]={score,answers:ans,certificate_id:certId()};LOCAL.set("quiz",state.quiz); if(state.supabaseReady&&state.user.id){try{await SUPA.saveQuiz(state.user.id,state.academy,score,ans,certId())}catch(e){console.warn(e)}} toast("Score : "+score+"%"); render();}
}
function admin(el){
 if(!isStaff()) return dashboard(el);
 el.innerHTML=head("Espace formateur","Suivi multi-académies, apprenants, promotions et accès.")+`<div class="grid four">${stat("Apprenants",state.learners.length,"suivis")}${stat("Promotions",state.cohorts.length,"actives")}${stat("Académies",DATA.academies.length,"interfaces")}${stat("Documents",DATA.documents.length,"PDF")}</div><div class="grid two"><form id="learnerForm" class="panel"><h3>Créer un apprenant local</h3><label>Nom<input name="full_name" required></label><label>Email<input name="email" required></label><label>Académie<select name="academy"><option value="business">Business</option><option value="ai">IA</option><option value="sst">SST</option></select></label><button class="btn primary full">Ajouter</button><p>Pour créer un vrai compte Supabase automatiquement, utilise l'Edge Function incluse.</p></form><article class="panel"><h3>Tableau de suivi</h3><div class="tablewrap"><table><tr><th>Nom</th><th>Email</th><th>Accès</th><th>Progression</th><th>Score</th></tr>${state.learners.map(l=>`<tr><td>${l.full_name}</td><td>${l.email}</td><td>${l.access.join(", ")}</td><td>${l.progress}%</td><td>${l.score}</td></tr>`).join("")}</table></div></article></div>`;
 document.getElementById("learnerForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);state.learners.push({id:"l"+Date.now(),full_name:f.get("full_name"),email:f.get("email"),role:"stagiaire",access:[f.get("academy")],cohort:"",progress:0,score:0});LOCAL.set("learners",state.learners);toast("Apprenant ajouté");render();}
}
function settings(el){el.innerHTML=head("Paramètres","Configuration plateforme.")+`<div class="grid two"><article class="panel"><h3>Identité</h3><p>${CONFIG.BRAND_NAME}</p><p>${CONFIG.CONTACT_EMAIL}</p><p>SIRET : ${CONFIG.SIRET}</p></article><article class="panel"><h3>Technique</h3><p>Mode : <b>${CONFIG.APP_MODE}</b></p><p>Supabase : <b>${state.supabaseReady?'initialisé':'non initialisé'}</b></p><button class="btn ghost danger" onclick="LOCAL.reset();location.reload()">Réinitialiser local</button></article></div>`}
function head(t,s){return `<div class="section-head"><span class="pill">${academy().label}</span><h1>${t}</h1><p>${s}</p></div>`}
function stat(a,b,c){return `<article class="stat-card"><span>${a}</span><strong>${b}</strong><p>${c}</p></article>`}
function academy(){return DATA.academies.find(a=>a.id===state.academy)||DATA.academies[0]}
function canAccess(a){return isStaff()||!state.user.access||state.user.access.includes(a)}
function isStaff(){return ["admin","formateur"].includes(state.user?.role)}
function coursesA(){return DATA.courses.filter(x=>x.academy===state.academy)}
function modsA(){return DATA.modules.filter(x=>x.academy===state.academy)}
function docsA(){return DATA.documents.filter(x=>x.academy===state.academy)}
function casesA(){return DATA.cases.filter(x=>x.academy===state.academy)}
function doneA(){return state.done[state.academy]||[]}
function toggleDone(id){const arr=doneA(); state.done[state.academy]=arr.includes(id)?arr.filter(x=>x!==id):[...arr,id]; LOCAL.set("done",state.done); if(state.supabaseReady&&state.user.id)SUPA.saveProgress(state.user.id,id,state.done[state.academy].includes(id)).catch(console.warn); toast("Progression mise à jour"); render();}
function openCourse(id){const c=DATA.courses.find(x=>x.id===id), ms=DATA.modules.filter(m=>m.course===id); modal(`<h2>${c.title}</h2><p>${c.description}</p><p><b>Durée :</b> ${c.duration} - <b>Niveau :</b> ${c.level}</p><h3>Modules</h3><ul>${ms.map(m=>`<li>${m.title}</li>`).join("")}</ul>`)}
function checkAlert(){let ok=["ou","quoi","bilan","gestes"].filter(id=>v(id).trim().length>8).length;document.getElementById("alertResult").innerHTML=`<div class="result ${ok===4?'good':'warn'}"><b>${ok}/4 éléments renseignés.</b><p>${ok===4?'Alerte structurée : Où, Quoi, Bilan, Gestes.':'Complète les zones trop courtes pour une alerte exploitable.'}</p></div>`}
function copy(id){const p=DATA.prompts.find(x=>x.id===id);navigator.clipboard?.writeText(p.text);toast("Prompt copié")}
function normalizeProfile(p,email){let access=p.academy_access||p.access||["business","ai","sst"]; if(typeof access==="string"){try{access=JSON.parse(access)}catch{access=access.split(",").map(x=>x.trim())}} return {id:p.id,email,full_name:p.full_name,role:p.role,company:p.company,access}}
function certId(){return "NCR-V6-"+state.academy.toUpperCase()+"-"+String(Math.abs(hash((state.user.full_name||"")+state.academy))).slice(0,6)}
function hash(s){return String(s).split("").reduce((a,c)=>((a<<5)-a)+c.charCodeAt(0),0)}
function initials(n){return String(n).split(" ").filter(Boolean).map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function v(id){return document.getElementById(id)?.value||""}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function modal(html){modalRoot.innerHTML=`<div class="modal-bg" onclick="if(event.target.className==='modal-bg')modalRoot.innerHTML=''"><div class="modal glass">${html}<button class="btn primary full" onclick="modalRoot.innerHTML=''">Fermer</button></div></div>`}
function toast(t){toastEl.textContent=t;toastEl.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>toastEl.classList.remove("show"),2200)}
