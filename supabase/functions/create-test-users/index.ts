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

    const body = await req.json().catch(() => ({}));

    // Auth: either admin user via Authorization header, or internal provision_key
    const authHeader = req.headers.get("Authorization");
    let authorized = false;

    if (body.provision_key === "cff-provision-2026") {
      authorized = true;
    } else if (authHeader) {
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data: { user: caller } } = await anonClient.auth.getUser();
      if (caller) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", caller.id)
          .single();
        if (roleData?.role === "admin") authorized = true;
      }
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const defaultUsers = [
      { email: "admin@cff.com", password: "Admin123", role: "admin", full_name: "Test Admin" },
      { email: "member@cff.com", password: "Member123", role: "member", full_name: "Test Member" },
      { email: "viewer@cff.com", password: "Viewer123", role: "viewer", full_name: "Test Viewer" },
    ];

    // Allow custom users from body
    const testUsers = body.users && Array.isArray(body.users) ? body.users : defaultUsers;

    const results = [];

    for (const tu of testUsers) {
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

      // Set role
      await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: tu.role }, { onConflict: "user_id" });

      // Set profile
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
