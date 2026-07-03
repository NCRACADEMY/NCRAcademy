// Supabase Edge Function create-learner - V6
// Déploiement optionnel pour créer de vrais comptes stagiaires depuis l'espace formateur.
// Ne jamais mettre la clé service_role dans GitHub ou dans le navigateur.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(supabaseUrl, serviceRole);
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const userClient = createClient(supabaseUrl, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: caller } = await userClient.auth.getUser();
  if (!caller?.user) return new Response("Unauthorized", { status: 401 });
  const { data: profile } = await admin.from("profiles").select("role").eq("id", caller.user.id).single();
  if (!["formateur","admin"].includes(profile?.role)) return new Response("Forbidden", { status: 403 });
  const body = await req.json();
  const { email, password, full_name, job, company, cohort_id, academy_access } = body;
  const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (createError) return new Response(JSON.stringify({ error: createError.message }), { status: 400 });
  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id, full_name, role:"stagiaire", job, company, cohort_id,
    academy_access: academy_access || ["business","ai","sst"]
  });
  if (profileError) return new Response(JSON.stringify({ error: profileError.message }), { status: 400 });
  return new Response(JSON.stringify({ ok:true, user_id:created.user.id }), { headers: { "Content-Type":"application/json" } });
});
