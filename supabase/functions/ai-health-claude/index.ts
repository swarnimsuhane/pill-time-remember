import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Health Claude function called');
    
    if (!anthropicApiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment');
      return new Response(JSON.stringify({ error: 'Anthropic API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, userHealthData, language = 'en' } = await req.json();
    console.log('Received message:', message, 'Language:', language);

    const systemPrompt = language === 'hi' 
      ? `आप Claude 4 हैं, एक अत्यधिक उन्नत AI स्वास्थ्य सहायक जो व्यापक चिकित्सा ज्ञान और श्रेष्ठ तर्क क्षमताओं के साथ है। आप निम्नलिखित में विशेषज्ञ हैं:

• दवाओं की जानकारी, परस्पर क्रिया और दुष्प्रभाव
• स्वास्थ्य स्थितियों का विश्लेषण और मार्गदर्शन
• व्यक्तिगत स्वास्थ्य सुझाव और जीवनशैली परामर्श
• लक्षण विश्लेषण और प्राथमिक मूल्यांकन
• निवारक देखभाल और कल्याण रणनीतियां
• पोषण और आहार मार्गदर्शन
• मानसिक स्वास्थ्य सहायता

आपके पास नवीनतम चिकित्सा अनुसंधान और साक्ष्य-आधारित प्रथाओं तक पहुंच है। हमेशा सहानुभूतिपूर्ण, विस्तृत और सहायक रहें। गंभीर या जटिल स्वास्थ्य मुद्दों के लिए योग्य स्वास्थ्य पेशेवरों से परामर्श की महत्वता पर जोर दें।`
      : `You are Claude 4, an advanced AI health assistant with comprehensive medical knowledge and superior reasoning capabilities. You specialize in:

• Medication information, interactions, and side effects
• Health condition analysis and guidance
• Personalized health recommendations and lifestyle counseling
• Symptom analysis and preliminary assessment
• Preventive care and wellness strategies
• Nutrition and dietary guidance
• Mental health support

You have access to the latest medical research and evidence-based practices. You can analyze complex health scenarios with nuanced understanding. Always be empathetic, thorough, and helpful while maintaining medical ethics. Emphasize the importance of consulting qualified healthcare professionals for serious or complex health issues.

When provided with user health data, use it to give more personalized advice while respecting privacy and medical confidentiality.`;

    // Prepare health context if provided
    let healthContext = '';
    if (userHealthData) {
      healthContext = `\n\nUser Health Context:
- Hydration: ${userHealthData.hydration || 'No data'}
- Recent Symptoms: ${userHealthData.symptoms || 'None logged'}
- Current Medications: ${userHealthData.medications || 'None listed'}
- Health Score: ${userHealthData.healthScore || 'Not calculated'}
- Doctors: ${userHealthData.doctors || 'None added'}

Please consider this context when providing advice.`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: message + healthContext
          }
        ]
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content[0].text;

    console.log('Claude AI response generated successfully');
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Claude AI assistant:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});