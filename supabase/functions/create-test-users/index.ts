import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user: caller } } = await createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
      auth: { autoRefreshToken: false, persistSession: false },
    }).auth.getUser();

    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .single();

    if (roleData?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const testUsers = [
      { email: "admin@cff.com", password: "Admin123", role: "admin", full_name: "Test Admin" },
      { email: "member@cff.com", password: "Member123", role: "member", full_name: "Test Member" },
      { email: "viewer@cff.com", password: "Viewer123", role: "viewer", full_name: "Test Viewer" },
    ];

    const results = [];

    for (const tu of testUsers) {
      // Check if user already exists
      const { data: existingList } = await supabase.auth.admin.listUsers();
      const existing = existingList?.users?.find(
        (u) => u.email?.toLowerCase() === tu.email.toLowerCase()
      );

      let userId: string;

      if (existing) {
        userId = existing.id;
        results.push({ email: tu.email, status: "already exists", id: userId });
      } else {
        const { data, error } = await supabase.auth.admin.createUser({
          email: tu.email,
          password: tu.password,
          email_confirm: true,
          user_metadata: { full_name: tu.full_name, first_name: tu.full_name.split(" ")[0], last_name: tu.full_name.split(" ")[1] || "" },
        });

        if (error) {
          results.push({ email: tu.email, status: "error", error: error.message });
          continue;
        }
        userId = data.user.id;
        results.push({ email: tu.email, status: "created", id: userId });
      }

      // Ensure role is set correctly
      await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: tu.role }, { onConflict: "user_id" });

      // Ensure profile exists with is_test flag and company_name that won't show in directory
      await supabase
        .from("user_profiles")
        .upsert({
          id: userId,
          email: tu.email,
          full_name: tu.full_name,
          company_name: "CFF Test Account",
          user_role: tu.role,
          is_active: true,
        }, { onConflict: "id" });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
