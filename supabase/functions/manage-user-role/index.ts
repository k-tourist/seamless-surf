
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Manage User Role function started");

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("Parsing request body");
    const { userId, action, role } = await req.json()
    console.log("Request parameters:", { userId, action, role });
    
    if (!userId || !action || !role) {
      console.error("Missing parameters:", { userId, action, role });
      throw new Error('Missing required parameters')
    }

    console.log("Creating Supabase client");
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    console.log("Getting authenticated user");
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Not authenticated')
    }

    console.log('Authenticated user:', user.id);

    console.log("Creating admin client");
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('Checking admin status for:', user.id);
    const { data: adminCheck, error: adminCheckError } = await adminClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (adminCheckError) {
      console.error('Admin check error:', adminCheckError);
      throw new Error('Error checking admin status')
    }

    if (!adminCheck) {
      console.error('Not authorized - user is not admin:', user.id);
      throw new Error('Not authorized - Admin access required')
    }

    console.log('Admin check passed, proceeding with role management');

    let result;
    if (action === 'add') {
      console.log('Setting role:', { userId, role });
      const { data, error: upsertError } = await adminClient
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id' })
        .select()
        .single()

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw upsertError
      }
      result = data
      console.log('Role set successfully:', result);
    } else if (action === 'remove') {
      console.log('Removing admin role:', { userId });
      // Instead of deleting, we set the role back to 'user'
      const { data, error: updateError } = await adminClient
        .from('user_roles')
        .upsert({ user_id: userId, role: 'user' }, { onConflict: 'user_id' })
        .select()
        .single()

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError
      }
      result = data
      console.log('Role updated to user successfully:', result);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
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
