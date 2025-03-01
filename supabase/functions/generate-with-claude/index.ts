
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, settings, apiKey } = await req.json();
    
    console.log('Edge function received:', {
      textLength: text?.length || 0,
      textPreview: text?.substring(0, 100) + '...',
      model: settings.model,
      style: settings.style,
      masterPromptAvailable: !!settings.masterPrompt,
      stylePromptAvailable: !!settings.stylePrompt,
      masterPromptSystemLength: settings.masterPrompt?.system?.length || 0,
      masterPromptUserLength: settings.masterPrompt?.user?.length || 0,
      stylePromptLength: settings.stylePrompt?.length || 0
    });

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!settings || !settings.model || !settings.masterPrompt || !settings.stylePrompt) {
      return new Response(JSON.stringify({ error: 'Missing settings or prompts' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `
      ${settings.masterPrompt.system}
      
      Article: ${text}
      
      ${settings.stylePrompt}
      
      Headlines:
    `;

    console.log('Full prompt length:', prompt.length);
    console.log('Prompt preview:', prompt.substring(0, 500) + '...');

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      console.error('Anthropic API error:', anthropicResponse.status, anthropicResponse.statusText);
      const errorBody = await anthropicResponse.text();
      console.error('Anthropic API error body:', errorBody);
      return new Response(JSON.stringify({ error: 'Anthropic API error', details: errorBody }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const anthropicData = await anthropicResponse.json();
    const headlines = anthropicData.content?.[0]?.text.split('\n').filter(headline => headline.trim() !== '');

    console.log('Generated headlines:', headlines);

    return new Response(
      JSON.stringify({ headlines }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function execution error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

