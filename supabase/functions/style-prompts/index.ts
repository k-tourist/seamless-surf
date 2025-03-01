
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface StylePrompt {
  id: string;
  name: string;
  prompt: string;
  user_id: string | null;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'public' } }
    );

    // Get user information from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Check if user is admin
    const { data: isAdmin } = await supabaseClient
      .rpc('check_if_user_is_admin', { user_id: user.id });

    console.log('User admin status:', { userId: user.id, isAdmin });

    // Fetch style prompts based on permissions:
    // - All users see global prompts
    // - Users see their own custom prompts
    // - Admins see global prompts and their own custom prompts (not other users' prompts)
    const { data: stylePrompts, error: promptsError } = await supabaseClient
      .from('style_prompts')
      .select()
      .or(`is_global.eq.true,and(user_id.eq.${user.id})`)
      .order('name');

    if (promptsError) {
      throw promptsError;
    }

    console.log('Fetched prompts:', stylePrompts);

    return new Response(JSON.stringify({ prompts: stylePrompts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
