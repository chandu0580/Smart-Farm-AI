import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();

    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Smart farming prompt tailored to the language
    const systemPrompt = getSystemPrompt(language);
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    console.log('Calling Gemini API for farming advice...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    console.log('Successfully generated farming advice');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        language: language 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in farming-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate farming advice'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getSystemPrompt(language: string): string {
  const prompts = {
    english: `You are an expert smart farming AI assistant. Provide practical, actionable advice on:
- Crop management and optimization
- Soil health and fertilization
- Pest and disease control
- Weather-based farming decisions
- Sustainable farming practices
- Modern farming technologies and IoT solutions
- Market prices and crop selection

Keep responses concise, practical, and farmer-friendly. Include specific recommendations when possible.`,

    spanish: `Eres un asistente de IA experto en agricultura inteligente. Proporciona consejos prácticos y accionables sobre:
- Gestión y optimización de cultivos
- Salud del suelo y fertilización
- Control de plagas y enfermedades
- Decisiones agrícolas basadas en el clima
- Prácticas agrícolas sostenibles
- Tecnologías agrícolas modernas y soluciones IoT
- Precios de mercado y selección de cultivos

Mantén las respuestas concisas, prácticas y amigables para los agricultores. Incluye recomendaciones específicas cuando sea posible.`,

    french: `Vous êtes un assistant IA expert en agriculture intelligente. Fournissez des conseils pratiques et réalisables sur :
- Gestion et optimisation des cultures
- Santé des sols et fertilisation
- Contrôle des ravageurs et des maladies
- Décisions agricoles basées sur la météo
- Pratiques agricoles durables
- Technologies agricoles modernes et solutions IoT
- Prix du marché et sélection des cultures

Gardez les réponses concises, pratiques et conviviales pour les agriculteurs. Incluez des recommandations spécifiques lorsque possible.`,

    hindi: `आप स्मार्ट फार्मिंग के विशेषज्ञ AI असिस्टेंट हैं। निम्नलिखित पर व्यावहारिक, कार्यान्वित करने योग्य सलाह दें:
- फसल प्रबंधन और अनुकूलन
- मिट्टी की स्वास्थ्य और उर्वरकीकरण
- कीट और रोग नियंत्रण
- मौसम आधारित कृषि निर्णय
- टिकाऊ कृषि प्रथाएं
- आधुनिक कृषि प्रौद्योगिकी और IoT समाधान
- बाजार मूल्य और फसल चयन

उत्तर संक्षिप्त, व्यावहारिक और किसान-अनुकूल रखें। जब संभव हो तो विशिष्ट सिफारिशें शामिल करें।`
  };

  return prompts[language as keyof typeof prompts] || prompts.english;
}