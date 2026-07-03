window.NCR_LOCAL = {
  prefix: "ncr_v3_",

  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
    return value;
  },

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },

  all() {
    const output = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => {
        try { output[k.replace(this.prefix, "")] = JSON.parse(localStorage.getItem(k)); }
        catch { output[k.replace(this.prefix, "")] = localStorage.getItem(k); }
      });
    return output;
  },

  reset() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.prefix))
      .forEach(k => localStorage.removeItem(k));
  }
};
