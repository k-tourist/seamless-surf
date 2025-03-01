
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
      isAnthropicModel: settings.model.includes('claude'),
      style: settings.style,
      masterPromptAvailable: !!settings.masterPrompt,
      stylePromptAvailable: !!settings.stylePrompt
    });

    if (!text) {
      throw new Error('No text provided');
    }

    if (!settings?.masterPrompt?.system || !settings?.masterPrompt?.user) {
      throw new Error('Missing required prompts');
    }

    const messages = [
      { 
        role: "system", 
        content: settings.masterPrompt.system 
      },
      { 
        role: "user", 
        content: settings.masterPrompt.user 
      }
    ];

    let response;
    if (settings.model.includes('claude')) {
      // Call Anthropic API
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            {
              role: 'user',
              content: messages[0].content + '\n\n' + messages[1].content
            }
          ],
          max_tokens: 1000,
        }),
      });
    } else {
      // Call OpenAI API
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.model,
          messages: messages,
          temperature: 0.7,
          n: 1,
        }),
      });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API error:', response.status, errorBody);
      throw new Error(`API error: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    const content = settings.model.includes('claude') 
      ? data.content[0].text
      : data.choices[0].message.content;

    console.log('API response:', {
      status: response.status,
      model: settings.model,
      contentPreview: content?.substring(0, 100)
    });

    const headlines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('-') && !line.startsWith('*'));

    console.log('Processed headlines:', headlines);

    return new Response(
      JSON.stringify({ headlines: headlines.slice(0, 7) }), // Limit to 7 headlines
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function execution error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
