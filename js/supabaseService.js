window.NCR_SUPABASE = {
  client: null,

  isEnabled() {
    return window.NCR_CONFIG.APP_MODE === "SUPABASE";
  },

  init() {
    if (!this.isEnabled()) return false;
    if (!window.supabase) {
      console.error("Supabase CDN non chargé.");
      return false;
    }
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.NCR_CONFIG;
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("SUPABASE_URL ou SUPABASE_ANON_KEY manquant dans config.js");
      return false;
    }
    this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
  },

  async getSession() {
    if (!this.client) return null;
    const { data } = await this.client.auth.getSession();
    return data?.session || null;
  },

  async login(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    if (!this.client) return;
    await this.client.auth.signOut();
  },

  async getProfile(userId) {
    const { data, error } = await this.client.from("profiles").select("*").eq("id", userId).single();
    if (error) throw error;
    return data;
  },

  async upsertProgress(userId, moduleId, completed) {
    const payload = {
      user_id: userId,
      module_id: moduleId,
      completed,
      completed_at: completed ? new Date().toISOString() : null
    };
    const { error } = await this.client.from("module_progress").upsert(payload, { onConflict: "user_id,module_id" });
    if (error) throw error;
  },

  async getProgress(userId) {
    const { data, error } = await this.client.from("module_progress").select("*").eq("user_id", userId);
    if (error) throw error;
    return data || [];
  },

  async saveDiagnostic(userId, score, answers, recommendation) {
    const { error } = await this.client.from("diagnostic_results").insert({ user_id: userId, score, answers, recommendation });
    if (error) throw error;
  },

  async saveQuiz(userId, score, answers, caseStudy) {
    const { error } = await this.client.from("quiz_results").insert({
      user_id: userId,
      score,
      passed: score >= window.NCR_CONFIG.CERTIFICATION_PASS_SCORE,
      answers,
      case_study: caseStudy || ""
    });
    if (error) throw error;
  },

  async listLearners() {
    const { data, error } = await this.client.from("profiles").select("*").in("role", ["stagiaire"]);
    if (error) throw error;
    return data || [];
  }
};
