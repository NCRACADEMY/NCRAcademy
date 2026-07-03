// Supabase Edge Function create-learner. À déployer avec Supabase CLI. Ne jamais mettre SERVICE_ROLE dans GitHub Pages.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req)=>new Response(JSON.stringify({ok:false,note:"Fonction modèle à compléter selon ton projet Supabase"}),{headers:{"Content-Type":"application/json"}}));