
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(authHeader.split(' ')[1])
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabaseAdmin.rpc('is_admin', { user_id: user.id })
    if (adminError || !isAdmin) {
      throw new Error('Unauthorized - Admin access required')
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        const { data: prompts, error } = await supabaseAdmin
          .from('master_prompts')
          .select('*')
          .order('created_at', { ascending: true })

        if (error) throw error

        return new Response(JSON.stringify({ prompts }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'PUT': {
        const { id, system_prompt, user_prompt, name, example_headlines, is_active } = await req.json()
        
        const { data: prompt, error } = await supabaseAdmin
          .from('master_prompts')
          .update({
            system_prompt,
            user_prompt,
            name,
            example_headlines,
            is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ prompt }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.message.includes('Unauthorized') ? 403 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
