
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Assistant function called');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, language = 'en' } = await req.json();
    console.log('Received message:', message, 'Language:', language);

    const systemPrompt = language === 'hi' 
      ? "आप एक अत्यधिक बुद्धिमान स्वास्थ्य AI असिस्टेंट हैं जो दवाओं, स्वास्थ्य, कल्याण और चिकित्सा सलाह के बारे में व्यापक जानकारी प्रदान करते हैं। आप उपयोगकर्ता के स्वास्थ्य डेटा का विश्लेषण कर सकते हैं और व्यक्तिगत सुझाव दे सकते हैं। हमेशा सलाह दें कि गंभीर या जटिल स्वास्थ्य समस्याओं के लिए योग्य चिकित्सक से परामर्श करना आवश्यक है। दवाओं की जानकारी, खुराक, साइड इफेक्ट्स, और स्वास्थ्य टिप्स देते समय सटीक और वैज्ञानिक जानकारी प्रदान करें।"
      : "You are an advanced health AI assistant with comprehensive knowledge about medicines, health conditions, wellness, and medical advice. You can analyze user health data and provide personalized recommendations. You have access to the latest medical research and drug information. Always emphasize the importance of consulting qualified healthcare professionals for serious or complex health issues. When providing information about medications, dosages, side effects, and health tips, ensure accuracy and cite evidence-based practices. Be empathetic, thorough, and helpful while maintaining medical ethics.";

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 800,
        temperature: 0.3,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('AI response generated successfully');
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI assistant:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
