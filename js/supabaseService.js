window.NCR_SUPABASE={
 client:null,
 init(){if(window.NCR_CONFIG.APP_MODE!=="SUPABASE"||!window.supabase||!NCR_CONFIG.SUPABASE_URL||!NCR_CONFIG.SUPABASE_ANON_KEY)return false;this.client=window.supabase.createClient(NCR_CONFIG.SUPABASE_URL,NCR_CONFIG.SUPABASE_ANON_KEY);return true},
 async getSession(){if(!this.client)return null;const{data}=await this.client.auth.getSession();return data?.session||null},
 async login(email,password){const{data,error}=await this.client.auth.signInWithPassword({email,password});if(error)throw error;return data},
 async logout(){if(this.client)await this.client.auth.signOut()},
 async profile(id){const{data,error}=await this.client.from("profiles").select("*").eq("id",id).single();if(error)throw error;return data},
 async saveProgress(user_id,module_id,completed){if(!this.client)return;const{error}=await this.client.from("module_progress").upsert({user_id,module_id,completed,completed_at:completed?new Date().toISOString():null},{onConflict:"user_id,module_id"});if(error)throw error},
 async saveQuiz(user_id,academy,score,answers,certificate_id){if(!this.client)return;const{error}=await this.client.from("quiz_results").insert({user_id,academy,score,passed:score>=NCR_CONFIG.CERTIFICATION_PASS_SCORE,answers,certificate_id});if(error)throw error},
 async saveDiagnostic(user_id,academy,score,answers,recommendation){if(!this.client)return;const{error}=await this.client.from("diagnostic_results").insert({user_id,academy,score,answers,recommendation});if(error)throw error}
};