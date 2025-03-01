
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("List Users function started");

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Processing request");
    
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { 
            Authorization: req.headers.get('Authorization')!,
          },
        },
      }
    )

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error('Not authenticated')
    }

    console.log("Checking admin role for user:", user.id);

    // Create admin client for privileged operations
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Direct database query to check admin status using service role
    const { data: isAdmin, error: adminError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle()

    if (adminError || !isAdmin) {
      console.error("Admin check error:", adminError);
      throw new Error('Not authorized - Admin access required')
    }

    console.log("User is admin, fetching all users");

    // Get all users using admin API
    const { data: { users: authUsers }, error: authError } = await adminClient.auth.admin.listUsers()
    if (authError) {
      console.error("Error fetching auth users:", authError);
      throw authError
    }

    // Fetch profiles for enabled status
    const { data: profiles, error: profilesError } = await adminClient
      .from('profiles')
      .select('id, is_enabled')
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError
    }

    // Fetch user roles
    const { data: userRoles, error: rolesError } = await adminClient
      .from('user_roles')
      .select('user_id, role')
    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
      throw rolesError
    }

    // Combine the data
    const users = authUsers.map((authUser) => {
      const profile = profiles?.find((p) => p.id === authUser.id)
      const role = userRoles?.find((r) => r.user_id === authUser.id)
      return {
        id: authUser.id,
        email: authUser.email || '',
        is_enabled: profile?.is_enabled ?? true,
        is_admin: role?.role === 'admin',
      }
    })

    console.log("Successfully processed users data");

    return new Response(
      JSON.stringify({ users }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
