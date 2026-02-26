import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export interface AccountLookupResult {
  email: string;
  company_name: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json().catch(() => ({}));
    const q = typeof body.q === "string" ? body.q.trim() : "";

    if (q.length < 2) {
      return new Response(
        JSON.stringify({
          results: [],
          error: "Enter at least 2 characters to search.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pattern = `%${q}%`;

    const [byEmail, byCompany] = await Promise.all([
      supabase.from("user_profiles").select("email, company_name").ilike("email", pattern).limit(25),
      supabase.from("user_profiles").select("email, company_name").ilike("company_name", pattern).limit(25),
    ]);

    const error = byEmail.error || byCompany.error;
    const combined = [...(byEmail.data || []), ...(byCompany.data || [])];

    if (error) {
      console.error("account-lookup error:", error);
      return new Response(
        JSON.stringify({ results: [], error: "Search failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const seen = new Set<string>();
    const results: AccountLookupResult[] = [];
    for (const r of combined) {
      if (!r?.email) continue;
      const key = `${r.email.toLowerCase()}|${(r.company_name || "").toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ email: r.email, company_name: r.company_name || "" });
    }
    results.splice(25);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("account-lookup:", err);
    return new Response(
      JSON.stringify({ results: [], error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
