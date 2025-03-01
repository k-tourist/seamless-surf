import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { key } = await req.json()
    
    if (key === 'ai_earnware_settings') {
      const { data, error } = await supabaseClient
        .from('api_connections')
        .select('api_key, settings')
        .eq('provider', 'ai_earnware')
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          settings: {
            key: data?.api_key,
            url: data?.settings?.url
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the API key from system_settings
    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (error) {
      console.error('Error fetching API key:', error)
      throw error
    }

    if (!data) {
      console.error('API key not found:', key)
      throw new Error('API key not found')
    }

    return new Response(
      JSON.stringify({ key: data.value.key }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-api-key function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
