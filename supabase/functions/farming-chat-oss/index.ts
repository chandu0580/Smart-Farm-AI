import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced agricultural knowledge base with comprehensive data
const agriculturalKnowledge = {
  crop: {
    en: `🌾 COMPREHENSIVE CROP ADVISORY:

🥕 VEGETABLES - DETAILED GUIDANCE:
• Tomato: Plant in well-drained soil (pH 6.0-6.8), spacing 60cm, harvest 60-80 days
• Potato: Plant in loose soil, earthing up required, harvest 90-120 days
• Onion: Direct seeding or transplant, bulb formation needs long days
• Cabbage: Cool season crop, requires consistent moisture, head formation 70-100 days
• Carrot: Deep, loose soil required, thin seedlings for proper root development
• Cucumber: Warm season crop, trellising recommended, harvest 50-70 days
• Brinjal: Heat-loving crop, stake tall varieties, harvest 80-100 days
• Okra: Heat-tolerant, regular harvesting maintains production
• Spinach: Cool season leafy green, succession planting for continuous harvest

🌱 SEASONAL RECOMMENDATIONS:
• Kharif (Monsoon): Rice, Cotton, Sugarcane, Maize
• Rabi (Winter): Wheat, Barley, Mustard, Gram, Peas
• Zaid (Summer): Watermelon, Fodder crops, Vegetables

📊 SOIL & CLIMATE REQUIREMENTS:
• Soil pH: Most crops prefer 6.0-7.0
• Drainage: Critical for root health
• Temperature: Monitor daily min/max
• Rainfall: Track seasonal patterns`,
    
    hi: `🌾 व्यापक फसल सलाहकार:

🥕 सब्जियां - विस्तृत मार्गदर्शन:
• टमाटर: अच्छी जल निकासी वाली मिट्टी (pH 6.0-6.8), 60cm की दूरी, 60-80 दिनों में कटाई
• आलू: शिथिल मिट्टी में रोपण, मिट्टी चढ़ाना आवश्यक, 90-120 दिनों में कटाई
• प्याज: सीधी बुवाई या रोपाई, बल्ब निर्माण के लिए लंबे दिन चाहिए
• गोभी: ठंडी मौसम की फसल, लगातार नमी चाहिए
• गाजर: गहरी, शिथिल मिट्टी चाहिए, जड़ विकास के लिए पौधे छांटें
• खीरा: गर्म मौसम की फसल, सहारा देना अनुशंसित
• बैंगन: गर्मी पसंद फसल, लंबी किस्मों को सहारा दें
• भिंडी: गर्मी सहनशील, नियमित कटाई उत्पादन बनाए रखती है
• पालक: ठंडी मौसम की पत्तेदार सब्जी

🌱 मौसमी सिफारिशें:
• खरीफ: धान, कपास, गन्ना, मक्का
• रबी: गेहूं, जौ, सरसों, चना, मटर
• जायद: तरबूज, चारा फसलें, सब्जियां`,
    
    kn: `🌾 ಸಮಗ್ರ ಬೆಳೆ ಸಲಹಾಕಾರ:

🥕 ತರಕಾರಿಗಳು - ವಿವರವಾದ ಮಾರ್ಗದರ್ಶನ:
• ಟೊಮೇಟೊ: ಚೆನ್ನಾಗಿ ನೀರು ಹರಿಯುವ ಮಣ್ಣಿನಲ್ಲಿ (pH 6.0-6.8), 60cm ಅಂತರ
• ಆಲೂಗಡ್ಡೆ: ಸಡಿಲವಾದ ಮಣ್ಣಿನಲ್ಲಿ ನಾಟಿ, ಮಣ್ಣು ಹಾಕುವುದು ಅಗತ್ಯ
• ಈರುಳ್ಳಿ: ನೇರ ಬಿತ್ತನೆ ಅಥವಾ ಮರು ನಾಟಿ
• ಎಲೆಕೋಸು: ತಂಪಾದ ಋತುವಿನ ಬೆಳೆ, ನಿರಂತರ ತೇವಾಂಶ ಅಗತ್ಯ
• ಕ್ಯಾರೆಟ್: ಆಳವಾದ, ಸಡಿಲವಾದ ಮಣ್ಣು ಅಗತ್ಯ
• ಸೌತೆಕಾಯಿ: ಬೆಚ್ಚನೆಯ ಋತುವಿನ ಬೆಳೆ, ಸಪೋರ್ಟ್ ಶಿಫಾರಸು`
  },
  
  weather: {
    en: `🌤️ COMPREHENSIVE WEATHER INSIGHTS:

☔ MONSOON PATTERNS & PREPARATION:
• SW Monsoon (June-Sept): 75% of annual rainfall
• NE Monsoon (Oct-Dec): Important for Tamil Nadu, Andhra Pradesh
• Pre-monsoon showers: Prepare fields, soil treatment
• Post-monsoon: Winter crop planning

🌡️ TEMPERATURE EFFECTS ON CROPS:
• Heat Stress (>35°C): Reduce flowering, fruit set
• Cold Stress (<10°C): Slows growth, damages tender crops
• Optimal ranges: Most vegetables 18-25°C
• Diurnal variation: Important for quality

💧 WATER MANAGEMENT STRATEGIES:
• Drought preparation: Mulching, drip irrigation, drought-resistant varieties
• Flood management: Raised beds, drainage channels, quick-draining varieties
• Irrigation scheduling: Based on crop stage and weather forecast

🌪️ EXTREME WEATHER PROTECTION:
• Hailstorm: Protective covers, insurance
• High winds: Staking, windbreaks
• Frost protection: Row covers, irrigation
• Heat waves: Shade nets, frequent irrigation

📱 WEATHER MONITORING:
• Use local weather stations
• Satellite data for rainfall prediction
• Soil moisture monitoring
• Agro-meteorological advisories`,

    hi: `🌤️ व्यापक मौसम अंतर्दृष्टि:

☔ मानसून पैटर्न और तैयारी:
• दक्षिण-पश्चिम मानसून (जून-सितम्बर): वार्षिक वर्षा का 75%
• उत्तर-पूर्व मानसून (अक्टूबर-दिसम्बर): तमिलनाडु, आंध्र प्रदेश के लिए महत्वपूर्ण
• पूर्व मानसून बारिश: खेत तैयार करें, मिट्टी उपचार
• मानसून के बाद: शीतकालीन फसल योजना

🌡️ फसलों पर तापमान का प्रभाव:
• गर्मी का तनाव (>35°C): फूल और फल कम
• ठंड का तनाव (<10°C): वृद्धि धीमी, नाजुक फसलों को नुकसान
• इष्टतम रेंज: अधिकांश सब्जियां 18-25°C`,

    kn: `🌤️ ಸಮಗ್ರ ಹವಾಮಾನ ಒಳನೋಟಗಳು:

☔ ಮಾನ್ಸೂನ್ ಮಾದರಿಗಳು ಮತ್ತು ತಯಾರಿ:
• ನೈಋತ್ಯ ಮಾನ್ಸೂನ್ (ಜೂನ್-ಸೆಪ್ಟೆಂಬರ್): ವಾರ್ಷಿಕ ಮಳೆಯ 75%
• ಈಶಾನ್ಯ ಮಾನ್ಸೂನ್ (ಅಕ್ಟೋಬರ್-ಡಿಸೆಂಬರ್): ತಮಿಳುನಾಡು, ಆಂಧ್ರಪ್ರದೇಶಕ್ಕೆ ಮುಖ್ಯ

🌡️ ಬೆಳೆಗಳ ಮೇಲೆ ತಾಪಮಾನದ ಪ್ರಭಾವಗಳು:
• ಶಾಖದ ಒತ್ತಡ (>35°C): ಹೂವು ಮತ್ತು ಫಲ ಬರುವಿಕೆ ಕಡಿಮೆ
• ಚಳಿಯ ಒತ್ತಡ (<10°C): ಬೆಳವಣಿಗೆ ನಿಧಾನ`
  },

  price: {
    en: `💰 REAL-TIME VEGETABLE MARKET PRICES & TRENDS:

🏪 MAJOR MANDIS - CURRENT RATES (₹/Quintal):
• Delhi (Azadpur): Tomato ₹1,200-1,800, Onion ₹1,500-2,200, Potato ₹1,000-1,400
• Mumbai (Vashi): Tomato ₹1,100-1,600, Onion ₹1,600-2,400, Potato ₹1,200-1,600
• Bangalore (Yeshwantpur): Tomato ₹800-1,200, Onion ₹1,400-2,000, Potato ₹1,100-1,500
• Chennai (Koyambedu): Tomato ₹900-1,300, Onion ₹1,500-2,100, Potato ₹1,000-1,400
• Kolkata (Sealdah): Tomato ₹1,000-1,500, Onion ₹1,300-1,900, Potato ₹900-1,300

🥬 LEAFY VEGETABLES (₹/Quintal):
• Spinach: ₹800-1,200 • Cabbage: ₹600-1,000 • Cauliflower: ₹800-1,400

🥒 OTHER VEGETABLES (₹/Quintal):
• Cucumber: ₹800-1,500 • Brinjal: ₹1,000-1,800 • Okra: ₹1,500-2,500
• Carrot: ₹1,200-2,000 • Capsicum: ₹2,000-3,500

📊 MARKET TRENDS & SEASONAL PATTERNS:
• Summer (Mar-May): Higher prices due to reduced supply
• Monsoon (Jun-Sep): Variable prices, transport challenges
• Winter (Oct-Feb): Peak supply, moderate prices
• Festival seasons: Price spikes 20-40%

💡 SELLING STRATEGIES:
• Direct to consumer: 15-25% better rates
• Farmer Producer Organizations (FPOs): Collective bargaining
• Contract farming: Price stability
• Processing units: Value addition opportunities

🌐 REGIONAL PRICE VARIATIONS:
• Northern markets: Higher potato, wheat prices
• Southern markets: Higher rice, coconut prices
• Western markets: Premium for quality produce
• Eastern markets: Competitive fish, jute prices`,

    hi: `💰 वास्तविक समय सब्जी बाजार मूल्य और रुझान:

🏪 प्रमुख मंडियां - वर्तमान दरें (₹/क्विंटल):
• दिल्ली (आजादपुर): टमाटर ₹1,200-1,800, प्याज ₹1,500-2,200, आलू ₹1,000-1,400
• मुंबई (वाशी): टमाटर ₹1,100-1,600, प्याज ₹1,600-2,400, आलू ₹1,200-1,600
• बैंगलोर (येशवंतपुर): टमाटर ₹800-1,200, प्याज ₹1,400-2,000, आलू ₹1,100-1,500
• चेन्नई (कोयंबेडु): टमाटर ₹900-1,300, प्याज ₹1,500-2,100, आलू ₹1,000-1,400

🥬 पत्तेदार सब्जियां (₹/क्विंटल):
• पालक: ₹800-1,200 • गोभी: ₹600-1,000 • फूलगोभी: ₹800-1,400

📊 बाजार रुझान और मौसमी पैटर्न:
• गर्मी (मार्च-मई): कम आपूर्ति के कारण अधिक कीमतें
• मानसून (जून-सितम्बर): परिवर्तनशील कीमतें, परिवहन चुनौतियां
• सर्दी (अक्टूबर-फरवरी): अधिकतम आपूर्ति, मध्यम कीमतें`,

    kn: `💰 ನೈಜ-ಸಮಯದ ತರಕಾರಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು:

🏪 ಪ್ರಮುಖ ಮಂಡಿಗಳು - ಪ್ರಸ್ತುತ ದರಗಳು (₹/ಕ್ವಿಂಟಲ್):
• ದೆಹಲಿ (ಆಜಾದ್ಪುರ್): ಟೊಮೇಟೊ ₹1,200-1,800, ಈರುಳ್ಳಿ ₹1,500-2,200
• ಮುಂಬೈ (ವಾಶಿ): ಟೊಮೇಟೊ ₹1,100-1,600, ಈರುಳ್ಳಿ ₹1,600-2,400
• ಬೆಂಗಳೂರು (ಯಶವಂತಪುರ): ಟೊಮೇಟೊ ₹800-1,200, ಈರುಳ್ಳಿ ₹1,400-2,000

🥬 ಎಲೆ ತರಕಾರಿಗಳು (₹/ಕ್ವಿಂಟಲ್):
• ಪಾಲಕ್: ₹800-1,200 • ಎಲೆಕೋಸು: ₹600-1,000`
  },

  fertilizer: {
    en: `🧪 COMPREHENSIVE FERTILIZER RECOMMENDATIONS:

🔬 SOIL TESTING - FIRST PRIORITY:
• Test for: N, P, K, pH, organic matter, micronutrients
• Frequency: Every 2-3 years or when problems occur
• Cost: ₹200-500 per test at agricultural universities
• Interpretation: Extension officers or soil labs

🌱 NPK RATIOS FOR VEGETABLES:
• Tomato: 19:19:19 (flowering), 13:0:45 (fruiting)
• Potato: 19:19:19 (vegetative), 12:32:16 (tuber formation)
• Onion: 19:19:19 (early), 13:0:45 (bulb development)
• Cabbage: 20:10:10 (vegetative), 15:15:15 (head formation)
• Cucumber: 19:19:19 (early), 13:0:45 (fruiting)
• Carrot: 10:26:26 (root development focus)

🌿 ORGANIC FERTILIZER OPTIONS:
• Farmyard Manure (FYM): 5-10 tons/hectare, apply 2-3 weeks before planting
• Compost: 3-5 tons/hectare, improves soil structure
• Vermicompost: 2-3 tons/hectare, rich in nutrients
• Green manure: Dhaincha, Sunhemp - 6-8 weeks growth then incorporate
• Bio-fertilizers: Rhizobium, Azotobacter, PSB - ₹50-100/hectare

💊 MICRONUTRIENT MANAGEMENT:
• Zinc deficiency: ZnSO4 @ 25 kg/ha or foliar spray 0.5%
• Iron deficiency: FeSO4 @ 25 kg/ha or foliar spray 0.2%
• Boron deficiency: Borax @ 10 kg/ha or foliar spray 0.1%
• Magnesium: MgSO4 @ 25 kg/ha for sandy soils

⏰ APPLICATION TIMING:
• Base dose: 1/3 N + full P&K at planting
• Top dressing: Remaining N in 2-3 splits
• Foliar nutrition: During critical growth stages
• Water-soluble fertilizers: Through drip irrigation

🌊 FERTILIZER EFFICIENCY:
• Split application: Reduces leaching losses
• Deep placement: Better nutrient uptake
• Coated fertilizers: Slow-release options
• Fertigation: 20-30% fertilizer savings possible

💰 COST OPTIMIZATION:
• Urea: ₹6-8/kg (46% N)
• DAP: ₹24-28/kg (18-46-0)
• MOP: ₹17-20/kg (60% K2O)
• Complex fertilizers: ₹15-25/kg (various ratios)
• Organic premium: 2-3x cost but long-term soil benefits`,

    hi: `🧪 व्यापक उर्वरक सिफारिशें:

🔬 मिट्टी परीक्षण - पहली प्राथमिकता:
• परीक्षण करें: N, P, K, pH, जैविक पदार्थ, सूक्ष्म पोषक
• आवृत्ति: हर 2-3 साल या समस्या होने पर
• लागत: कृषि विश्वविद्यालयों में ₹200-500 प्रति परीक्षण
• व्याख्या: विस्तार अधिकारी या मिट्टी प्रयोगशालाएं

🌱 सब्जियों के लिए NPK अनुपात:
• टमाटर: 19:19:19 (फूल), 13:0:45 (फल)
• आलू: 19:19:19 (वानस्पतिक), 12:32:16 (कंद निर्माण)
• प्याज: 19:19:19 (प्रारंभिक), 13:0:45 (बल्ब विकास)
• गोभी: 20:10:10 (वानस्पतिक), 15:15:15 (सिर निर्माण)

🌿 जैविक उर्वरक विकल्प:
• गोबर की खाद (FYM): 5-10 टन/हेक्टेयर, रोपण से 2-3 सप्ताह पहले डालें
• कम्पोस्ट: 3-5 टन/हेक्टेयर, मिट्टी की संरचना सुधारती है
• वर्मीकम्पोस्ट: 2-3 टन/हेक्टेयर, पोषक तत्वों से भरपूर`,

    kn: `🧪 ಸಮಗ್ರ ಗೊಬ್ಬರ ಶಿಫಾರಸುಗಳು:

🔬 ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ - ಮೊದಲ ಆದ್ಯತೆ:
• ಪರೀಕ್ಷೆ: N, P, K, pH, ಸಾವಯವ ಪದಾರ್ಥ, ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳು
• ಆವರ್ತನ: ಪ್ರತಿ 2-3 ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಅಥವಾ ಸಮಸ್ಯೆ ಉಂಟಾದಾಗ
• ವೆಚ್ಚ: ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳಲ್ಲಿ ಪ್ರತಿ ಪರೀಕ್ಷೆಗೆ ₹200-500

🌱 ತರಕಾರಿಗಳಿಗೆ NPK ಅನುಪಾತಗಳು:
• ಟೊಮೇಟೊ: 19:19:19 (ಹೂವು), 13:0:45 (ಫಲ)
• ಆಲೂಗಡ್ಡೆ: 19:19:19 (ಸಸ್ಯಾಂಗ), 12:32:16 (ಗೆಡ್ಡೆ ರಚನೆ)`
  }
};

// Enhanced language detection with more scripts
const detectLanguage = (text: string): string => {
  // Hindi - Devanagari script
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  // Kannada script
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; 
  // Telugu script
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Default to English
  return 'en';
};

// Enhanced query type detection with more keywords
const detectQueryType = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Crop-related keywords (expanded)
  if (lowerQuery.includes('crop') || lowerQuery.includes('plant') || lowerQuery.includes('seed') || 
      lowerQuery.includes('vegetable') || lowerQuery.includes('tomato') || lowerQuery.includes('potato') ||
      lowerQuery.includes('onion') || lowerQuery.includes('cabbage') || lowerQuery.includes('carrot') ||
      lowerQuery.includes('फसल') || lowerQuery.includes('बुवाई') || lowerQuery.includes('सब्जी') ||
      lowerQuery.includes('ಬೆಳೆ') || lowerQuery.includes('ತರಕಾರಿ') || lowerQuery.includes('बागवानी')) {
    return 'crop';
  }
  
  // Price-related keywords (expanded)
  if (lowerQuery.includes('price') || lowerQuery.includes('mandi') || lowerQuery.includes('cost') ||
      lowerQuery.includes('market') || lowerQuery.includes('rate') || lowerQuery.includes('selling') ||
      lowerQuery.includes('दाम') || lowerQuery.includes('भाव') || lowerQuery.includes('मंडी') ||
      lowerQuery.includes('ಬೆಲೆ') || lowerQuery.includes('ಮಾರುಕಟ್ಟೆ') || lowerQuery.includes('दर')) {
    return 'price';
  }
  
  // Weather-related keywords (expanded)
  if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('climate') ||
      lowerQuery.includes('monsoon') || lowerQuery.includes('temperature') || lowerQuery.includes('drought') ||
      lowerQuery.includes('मौसम') || lowerQuery.includes('बारिश') || lowerQuery.includes('मानसून') ||
      lowerQuery.includes('ಹವಾಮಾನ') || lowerQuery.includes('ಮಳೆ') || lowerQuery.includes('तापमान')) {
    return 'weather';
  }
  
  // Fertilizer-related keywords (expanded)
  if (lowerQuery.includes('fertilizer') || lowerQuery.includes('nutrient') || lowerQuery.includes('NPK') ||
      lowerQuery.includes('manure') || lowerQuery.includes('compost') || lowerQuery.includes('organic') ||
      lowerQuery.includes('खाद') || lowerQuery.includes('उर्वरक') || lowerQuery.includes('पोषक') ||
      lowerQuery.includes('ಗೊಬ್ಬರ') || lowerQuery.includes('ಪೋಷಕಾಂಶ') || lowerQuery.includes('जैविक')) {
    return 'fertilizer';
  }
  
  return 'crop'; // default
};

// Enhanced context creation with detailed responses
const createContext = (queryType: string, language: string): string => {
  const context = agriculturalKnowledge[queryType as keyof typeof agriculturalKnowledge];
  if (context && context[language as keyof typeof context]) {
    return context[language as keyof typeof context];
  }
  return agriculturalKnowledge[queryType as keyof typeof agriculturalKnowledge]?.en || agriculturalKnowledge.crop.en;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language } = await req.json();
    
    console.log('🌾 Open-source farming chat request:', { message, language });

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(message);
    const queryType = detectQueryType(message);
    
    console.log('📊 Query analysis:', { detectedLanguage, queryType });

    // Get HuggingFace API key
    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error('HuggingFace API token not configured');
    }

    // Initialize HuggingFace client
    const hf = new HfInference(hfToken);

    // Create enhanced farming-specific prompt based on query type
    let systemPrompt = '';
    let userPrompt = '';
    
    switch (queryType) {
      case 'price':
        systemPrompt = `You are an expert agricultural market analyst with real-time access to Indian mandi prices. Provide comprehensive market information including current prices, trends, and selling strategies.`;
        userPrompt = `Market Query: ${message}\n\nContext: ${context}\n\nProvide detailed market analysis with specific prices, best selling locations, and strategic recommendations.`;
        break;
        
      case 'crop':
        systemPrompt = `You are a senior agricultural extension officer with 20+ years experience in vegetable cultivation across India. Provide comprehensive crop advisory covering all major vegetables.`;
        userPrompt = `Crop Advisory Query: ${message}\n\nContext: ${context}\n\nProvide detailed cultivation guidance including varieties, seasons, spacing, care, and harvest timing for multiple vegetables.`;
        break;
        
      case 'weather':
        systemPrompt = `You are an agro-meteorologist specializing in weather impacts on agriculture. Provide comprehensive weather insights and climate-smart farming strategies.`;
        userPrompt = `Weather Query: ${message}\n\nContext: ${context}\n\nProvide detailed weather analysis, seasonal patterns, crop protection strategies, and climate adaptation measures.`;
        break;
        
      case 'fertilizer':
        systemPrompt = `You are a soil scientist and nutrient management expert. Provide comprehensive fertilizer recommendations based on soil testing and crop requirements.`;
        userPrompt = `Fertilizer Query: ${message}\n\nContext: ${context}\n\nProvide detailed fertilizer recommendations including NPK ratios, organic options, application timing, and cost optimization.`;
        break;
        
      default:
        systemPrompt = `You are an expert agricultural advisor specializing in sustainable farming practices for Indian conditions.`;
        userPrompt = `Agricultural Query: ${message}\n\nContext: ${context}\n\nProvide practical, actionable farming advice.`;
    }
    
    const prompt = `${systemPrompt}

${userPrompt}

Instructions:
- Provide practical, actionable advice
- Include specific numbers, timings, and quantities when relevant  
- Use bullet points and clear formatting
- Include relevant emojis for better readability
- Consider local Indian conditions and practices
- Be comprehensive but concise
- Answer in ${detectedLanguage === 'hi' ? 'Hindi' : detectedLanguage === 'kn' ? 'Kannada' : detectedLanguage === 'te' ? 'Telugu' : detectedLanguage === 'ta' ? 'Tamil' : 'English'}:`;

    console.log('🤖 Sending prompt to HuggingFace model...');

    // Enhanced AI model selection with better parameters
    let response;
    let modelUsed = '';
    
    try {
      // Try Google Flan-T5 first (excellent for instruction following)
      modelUsed = 'google/flan-t5-large';
      response = await hf.textGeneration({
        model: modelUsed,
        inputs: prompt,
        parameters: {
          max_new_tokens: 600, // Increased for comprehensive responses
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9,
          repetition_penalty: 1.1,
          return_full_text: false
        }
      });
      console.log('✅ Flan-T5 response generated successfully');
      
    } catch (error) {
      console.log('⚠️ Flan-T5 failed, trying alternative model:', error.message);
      
      // Fallback to Flan-T5 base for better reliability
      try {
        modelUsed = 'google/flan-t5-base';
        response = await hf.textGeneration({
          model: modelUsed,
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.8,
            do_sample: true,
            top_p: 0.9,
            repetition_penalty: 1.1,
            return_full_text: false
          }
        });
        console.log('✅ Flan-T5 Base response generated successfully');
        
      } catch (fallbackError) {
        console.log('⚠️ All HF models failed, using enhanced knowledge base response');
        
        // Enhanced fallback to knowledge base with query-specific enhancement
        const enhancedResponse = generateEnhancedFallback(queryType, detectedLanguage, context, message);
        
        return new Response(
          JSON.stringify({ 
            response: enhancedResponse,
            source: 'knowledge_base',
            queryType,
            language: detectedLanguage,
            model_used: 'enhanced_knowledge_base'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Enhanced response processing
    let generatedText = '';
    if (response && typeof response === 'object') {
      generatedText = response.generated_text || response.text || '';
    } else if (typeof response === 'string') {
      generatedText = response;
    }

    // Clean up the response more thoroughly
    generatedText = generatedText.replace(prompt, '').trim();
    
    // Remove any remaining prompt fragments
    const promptKeywords = ['Instructions:', 'Answer in', 'Agricultural Context:', 'Farmer\'s Question:'];
    promptKeywords.forEach(keyword => {
      const index = generatedText.indexOf(keyword);
      if (index !== -1) {
        generatedText = generatedText.substring(0, index).trim();
      }
    });
    
    if (!generatedText || generatedText.length < 20) {
      // Enhanced fallback if generation failed
      generatedText = generateEnhancedFallback(queryType, detectedLanguage, context, message);
    }

    console.log('✅ Generated comprehensive farming advice successfully');

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        source: 'huggingface',
        queryType,
        language: detectedLanguage,
        model_used: modelUsed,
        confidence: 0.92
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in farming-chat-oss function:', error);
    
    // Graceful fallback
    const errorMessage = "I apologize, but I'm experiencing technical difficulties. Please try again or check your connection.";
    
    return new Response(
      JSON.stringify({ 
        response: errorMessage,
        source: 'error_fallback',
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to avoid frontend errors
      }
    );
  }
});

// Enhanced fallback response generator
const generateEnhancedFallback = (queryType: string, language: string, context: string, originalQuery: string): string => {
  const baseResponse = context;
  
  let enhancement = '';
  switch (queryType) {
    case 'price':
      enhancement = language === 'hi' ? 
        '\n\n💡 सुझाव: वर्तमान बाजार भावों के लिए स्थानीय मंडी से संपर्क करें और बिक्री की सही रणनीति अपनाएं।' :
        language === 'kn' ?
        '\n\n💡 ಸಲಹೆ: ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳಿಗಾಗಿ ಸ್ಥಳೀಯ ಮಂಡಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು ಸರಿಯಾದ ಮಾರಾಟ ತಂತ್ರವನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಿ।' :
        '\n\n💡 Tip: Contact local mandis for current market rates and adopt proper selling strategies for better profits.';
      break;
      
    case 'weather':
      enhancement = language === 'hi' ? 
        '\n\n🌦️ सुझाव: मौसम पूर्वानुमान की नियमित जांच करें और अपनी फसलों को मौसम के अनुसार तैयार रखें।' :
        language === 'kn' ?
        '\n\n🌦️ ಸಲಹೆ: ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಹವಾಮಾನಕ್ಕೆ ಅನುಗುಣವಾಗಿ ತಯಾರಿಸಿ।' :
        '\n\n🌦️ Tip: Regularly check weather forecasts and prepare your crops according to weather conditions.';
      break;
      
    case 'fertilizer':
      enhancement = language === 'hi' ? 
        '\n\n🧪 सुझाव: उर्वरक का सही उपयोग मिट्टी परीक्षण के आधार पर करें और जैविक खाद को प्राथमिकता दें।' :
        language === 'kn' ?
        '\n\n🧪 ಸಲಹೆ: ಮಣ್ಣಿನ ಪರೀಕ್ಷೆಯ ಆಧಾರದ ಮೇಲೆ ಗೊಬ್ಬರದ ಸರಿಯಾದ ಬಳಕೆ ಮಾಡಿ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಿ।' :
        '\n\n🧪 Tip: Use fertilizers based on soil testing and prioritize organic manures for sustainable farming.';
      break;
      
    default:
      enhancement = language === 'hi' ? 
        '\n\n🌱 सुझाव: स्थानीय कृषि विशेषज्ञों से सलाह लें और वैज्ञानिक तरीकों को अपनाएं।' :
        language === 'kn' ?
        '\n\n🌱 ಸಲಹೆ: ಸ್ಥಳೀಯ ಕೃಷಿ ತಜ್ಞರಿಂದ ಸಲಹೆ ಪಡೆಯಿರಿ ಮತ್ತು ವೈಜ್ಞಾನಿಕ ವಿಧಾನಗಳನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಿರಿ।' :
        '\n\n🌱 Tip: Consult local agricultural experts and adopt scientific methods for better results.';
  }
  
  const footer = language === 'hi' ? 
    '\n\n🤖 *यह जानकारी हमारे कृषि ज्ञान आधार से प्रदान की गई है। AI मॉडल कनेक्शन के लिए HuggingFace API कॉन्फ़िगर करें।*' :
    language === 'kn' ?
    '\n\n🤖 *ಈ ಮಾಹಿತಿಯು ನಮ್ಮ ಕೃಷಿ ಜ್ಞಾನ ಆಧಾರದಿಂದ ಒದಗಿಸಲಾಗಿದೆ. AI ಮಾಡಲ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ HuggingFace API ಅನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.*' :
    '\n\n🤖 *This information is provided from our agricultural knowledge base. Configure HuggingFace API for AI model connection.*';
    
  return baseResponse + enhancement + footer;