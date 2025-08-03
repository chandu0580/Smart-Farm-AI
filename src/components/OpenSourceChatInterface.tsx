import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Sprout, 
  User, 
  Mic, 
  MicOff, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  Wifi, 
  WifiOff,
  Database,
  Zap,
  Code,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language: string;
  confidence?: number;
  source?: 'huggingface' | 'knowledge_base' | 'error_fallback';
  queryType?: string;
  modelUsed?: string;
}

interface Language {
  code: string;
  name: string;
  native: string;
  flag: string;
}

interface ChatStats {
  totalQueries: number;
  avgResponseTime: number;
  successRate: number;
  openSourceQueries: number;
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' }
];

const quickPrompts = {
  crop: {
    en: "🌾 Provide comprehensive crop advisory for all vegetables including tomato, potato, onion, cabbage, carrot, cucumber, brinjal, okra, spinach, and seasonal recommendations for each region",
    hi: "🌾 टमाटर, आलू, प्याज, गोभी, गाजर, खीरा, बैंगन, भिंडी, पालक सहित सभी सब्जियों के लिए व्यापक फसल सलाह और प्रत्येक क्षेत्र के लिए मौसमी सिफारिशें प्रदान करें",
    kn: "🌾 ಟೊಮೇಟೊ, ಆಲೂಗಡ್ಡೆ, ಈರುಳ್ಳಿ, ಎಲೆಕೋಸು, ಕ್ಯಾರೆಟ್, ಸೌತೆಕಾಯಿ, ಬದನೇಕಾಯಿ, ಬೆಂಡೆಕಾಯಿ, ಪಾಲಕ್ ಸೇರಿದಂತೆ ಎಲ್ಲಾ ತರಕಾರಿಗಳಿಗೆ ಸಮಗ್ರ ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಪ್ರತಿ ಪ್ರದೇಶಕ್ಕೆ ಋತುಮಾನದ ಶಿಫಾರಸುಗಳನ್ನು ಒದಗಿಸಿ",
    te: "🌾 టొమాటో, బంగాళాదుంప, ఉల్లిపాయ, కాబేజీ, క్యారెట్, దోసకాయ, వంకాయ, బెండకాయ, పాలకూర తదితర అన్ని కూరగాయలకు సమగ్ర పంట సలహా మరియు ప్రతి ప్రాంతానికి కాలానుగుణ సిఫార్సులు అందించండి",
    ta: "🌾 தக்காளி, உருளைக்கிழங்கு, வெங்காயம், முட்டைகோஸ், கேரட், வெள்ளரிக்காய், கத்திரிக்காய், வெண்டைக்காய், கீரை உள்ளிட்ட அனைத்து காய்கறிகளுக்கும் விரிவான பயிர் ஆலோசனை மற்றும் ஒவ்வொரு பகுதிக்கும் பருவகால பரிந்துரைகளை வழங்கவும்"
  },
  weather: {
    en: "🌤️ Provide comprehensive weather insights including monsoon patterns, drought preparation, flood management, temperature effects on all vegetable crops, and seasonal farming strategies for different climate zones",
    hi: "🌤️ मानसून पैटर्न, सूखे की तैयारी, बाढ़ प्रबंधन, सभी सब्जी फसलों पर तापमान के प्रभाव, और विभिन्न जलवायु क्षेत्रों के लिए मौसमी खेती रणनीतियों सहित व्यापक मौसम अंतर्दृष्टि प्रदान करें",
    kn: "🌤️ ಮಾನ್ಸೂನ್ ಮಾದರಿಗಳು, ಬರ ತಯಾರಿ, ಪ್ರವಾಹ ನಿರ್ವಹಣೆ, ಎಲ್ಲಾ ತರಕಾರಿ ಬೆಳೆಗಳ ಮೇಲೆ ತಾಪಮಾನದ ಪ್ರಭಾವಗಳು ಮತ್ತು ವಿವಿಧ ಹವಾಮಾನ ವಲಯಗಳಿಗೆ ಋತುಮಾನದ ಕೃಷಿ ತಂತ್ರಗಳು ಸೇರಿದಂತೆ ಸಮಗ್ರ ಹವಾಮಾನ ಒಳನೋಟಗಳನ್ನು ಒದಗಿಸಿ",
    te: "🌤️ వాన కాలం నమూనాలు, కరువు సిద్ధత, వరద నిర్వహణ, అన్ని కూరగాయల పంటలపై ఉష్ణోగ్రత ప్రభావాలు మరియు వివిధ వాతావరణ ప్రాంతాలకు కాలానుగుణ వ్యవసాయ వ్యూహాలతో సహా సమగ్ర వాతావరణ అంతర్దృష్టులను అందించండి",
    ta: "🌤️ பருவமழை முறைகள், வறட்சி தயாரிப்பு, வெள்ள மேலாண்மை, அனைத்து காய்கறி பயிர்களில் வெப்பநிலை விளைவுகள் மற்றும் பல்வேறு காலநிலை மண்டலங்களுக்கான பருவகால விவசாய உத்திகள் உள்ளிட்ட விரிவான வானிலை நுண்ணறிவுகளை வழங்கவும்"
  },
  price: {
    en: "💰 Show real-time vegetable market prices across different mandis and regions including tomato, potato, onion, cabbage, carrot, cucumber, brinjal, okra, spinach prices with trends and best selling locations",
    hi: "💰 विभिन्न मंडियों और क्षेत्रों में टमाटर, आलू, प्याज, गोभी, गाजर, खीरा, बैंगन, भिंडी, पालक की कीमतों के साथ रुझान और सर्वोत्तम बिक्री स्थानों सहित वास्तविक समय सब्जी बाजार मूल्य दिखाएं",
    kn: "💰 ಟೊಮೇಟೊ, ಆಲೂಗಡ್ಡೆ, ಈರುಳ್ಳಿ, ಎಲೆಕೋಸು, ಕ್ಯಾರೆಟ್, ಸೌತೆಕಾಯಿ, ಬದನೇಕಾಯಿ, ಬೆಂಡೆಕಾಯಿ, ಪಾಲಕ್ ಬೆಲೆಗಳೊಂದಿಗೆ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಅತ್ಯುತ್ತಮ ಮಾರಾಟ ಸ್ಥಳಗಳು ಸೇರಿದಂತೆ ವಿವಿಧ ಮಂಡಿಗಳು ಮತ್ತು ಪ್ರದೇಶಗಳಲ್ಲಿ ನೈಜ-ಸಮಯದ ತರಕಾರಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ತೋರಿಸಿ",
    te: "💰 టొమాటో, బంగాళాదుంప, ఉల్లిపాయ, కాబేజీ, క్యారెట్, దోసకాయ, వంకాయ, బెండకాయ, పాలకూర ధరలతో పాటు ట్రెండ్లు మరియు మెరుగైన అమ్మకపు ప్రాంతాలతో సహా వివిధ మార్కెట్లు మరియు ప్రాంతాలలో నిజ-సమయ కూరగాయల మార్కెట్ ధరలను చూపించండి",
    ta: "💰 தக்காளி, உருளைக்கிழங்கு, வெங்காயம், முட்டைகோஸ், கேரட், வெள்ளரிக்காய், கத்திரிக்காய், வெண்டைக்காய், கீரை விலைகள் மற்றும் போக்குகள் மற்றும் சிறந்த விற்பனை இடங்களுடன் வெவ்வேறு மண்டிகள் மற்றும் பகுதிகளில் நிகழ்நேர காய்கறி சந்தை விலைகளை காட்டவும்"
  },
  fertilizer: {
    en: "🧪 Provide detailed fertilizer recommendations for all vegetable crops including organic and chemical options, NPK ratios, application timing, and soil testing guidance for maximum yield",
    hi: "🧪 जैविक और रासायनिक विकल्पों, NPK अनुपात, आवेदन समय, और अधिकतम उपज के लिए मिट्टी परीक्षण मार्गदर्शन सहित सभी सब्जी फसलों के लिए विस्तृत उर्वरक सिफारिशें प्रदान करें",
    kn: "🧪 ಸಾವಯವ ಮತ್ತು ರಾಸಾಯನಿಕ ಆಯ್ಕೆಗಳು, NPK ಅನುಪಾತಗಳು, ಅನ್ವಯಿಕೆ ಸಮಯ, ಮತ್ತು ಗರಿಷ್ಠ ಇಳುವರಿಗಾಗಿ ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶನ ಸೇರಿದಂತೆ ಎಲ್ಲಾ ತರಕಾರಿ ಬೆಳೆಗಳಿಗೆ ವಿವರವಾದ ಗೊಬ್ಬರ ಶಿಫಾರಸುಗಳನ್ನು ಒದಗಿಸಿ",
    te: "🧪 సేంద్రీయ మరియు రసాయన ఎంపికలు, NPK నిష్పత్తులు, అప్లికేషన్ టైమింగ్ మరియు గరిష్ట దిగుబడికి మట్టి పరీక్ష మార్గదర్శకత్వంతో సహా అన్ని కూరగాయల పంటలకు వివరణాత్మక ఎరువుల సిఫార్సులను అందించండి",
    ta: "🧪 இயற்கை மற்றும் இரசாயன விருப்பங்கள், NPK விகிதங்கள், பயன்பாட்டு நேரம் மற்றும் அதிகபட்ச மகசூலுக்கான மண் சோதனை வழிகாட்டுதல் உள்ளிட்ட அனைத்து காய்கறி பயிர்களுக்கும் விரிவான உர பரிந்துரைகளை வழங்கவும்"
  }
};

export const OpenSourceChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [chatStats, setChatStats] = useState<ChatStats>({ 
    totalQueries: 0, 
    avgResponseTime: 0, 
    successRate: 100,
    openSourceQueries: 0
  });
  const [typingProgress, setTypingProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const simulateTypingProgress = () => {
    setTypingProgress(0);
    const interval = setInterval(() => {
      setTypingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 12;
      });
    }, 300);
    return () => clearInterval(interval);
  };

  const getOpenSourceFarmingAdvice = async (message: string, language: string): Promise<{ 
    response: string; 
    source: 'huggingface' | 'knowledge_base' | 'error_fallback'; 
    queryType: string;
    modelUsed?: string;
  }> => {
    const startTime = Date.now();
    
    try {
      setConnectionStatus('connecting');
      
      console.log('🌾 Calling open-source farming chat...');
      
      // Call our HuggingFace-powered edge function
      const { data, error } = await supabase.functions.invoke('farming-chat-oss', {
        body: { message, language }
      });

      if (error) {
        throw error;
      }

      setConnectionStatus('online');
      const responseTime = Date.now() - startTime;
      updateChatStats(responseTime, true);
      
      return {
        response: data.response,
        source: data.source || 'huggingface',
        queryType: data.queryType || 'general',
        modelUsed: data.model_used
      };
    } catch (error) {
      console.error('❌ Open-source chat failed:', error);
      setConnectionStatus('offline');
      
      const responseTime = Date.now() - startTime;
      updateChatStats(responseTime, false);
      
      // Enhanced fallback response
      const fallbackResponse = `🤖 **Open-Source Demo Mode**

I'm currently running without the HuggingFace connection. Here's what I would normally provide:

🌾 **AI-Powered Features** (when connected):
• **Language Detection**: Automatic detection of Hindi, Kannada, English, Telugu, Tamil
• **Smart Translation**: Bi-directional translation for multilingual support  
• **Context-Aware Responses**: Using agricultural knowledge base + AI generation
• **Query Classification**: Automatic categorization (crop, weather, price, fertilizer)

🔧 **Models Used**:
• **google/flan-t5-large** for instruction following
• **sentence-transformers** for embeddings (in full backend)
• **FAISS** for similarity search (in Python backend)

💡 **To unlock full features**: Set up HuggingFace API key and deploy the complete open-source stack!

---
*This is a demo response. In production, you'd get personalized farming advice generated by open-source AI models.*`;

      return {
        response: fallbackResponse,
        source: 'error_fallback',
        queryType: 'demo'
      };
    }
  };

  const updateChatStats = (responseTime: number, success: boolean) => {
    setChatStats(prev => ({
      totalQueries: prev.totalQueries + 1,
      avgResponseTime: (prev.avgResponseTime * prev.totalQueries + responseTime) / (prev.totalQueries + 1),
      successRate: success 
        ? ((prev.successRate * prev.totalQueries) + 100) / (prev.totalQueries + 1)
        : ((prev.successRate * prev.totalQueries) + 0) / (prev.totalQueries + 1),
      openSourceQueries: success ? prev.openSourceQueries + 1 : prev.openSourceQueries
    }));
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    const cleanupTyping = simulateTypingProgress();

    try {
      const { response, source, queryType, modelUsed } = await getOpenSourceFarmingAdvice(currentMessage, selectedLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        language: selectedLanguage,
        confidence: source === 'error_fallback' ? 0.60 : source === 'knowledge_base' ? 0.75 : 0.92,
        source,
        queryType,
        modelUsed
      };

      setMessages(prev => [...prev, aiMessage]);
      
      const sourceLabels = {
        'huggingface': '🤗 HuggingFace AI',
        'knowledge_base': '📚 Knowledge Base',
        'error_fallback': '🔧 Demo Mode'
      };
      
      toast({
        title: "✅ Open-Source Response",
        description: `Generated via ${sourceLabels[source]} ${modelUsed ? `(${modelUsed})` : ''}`,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to get response from open-source AI.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      cleanupTyping();
      setTypingProgress(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "🎤 Voice Stopped" : "🎤 Voice Started",
      description: isListening ? "Click to start listening again" : "Speak your farming question now",
    });
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'online': return <Zap className="h-4 w-4 text-farm-green" />;
      case 'connecting': return <Brain className="h-4 w-4 text-farm-gold animate-pulse" />;
      case 'offline': return <Code className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSourceBadge = (source?: string, modelUsed?: string) => {
    const badges = {
      'huggingface': { icon: <Zap className="h-3 w-3" />, label: 'HuggingFace', color: 'bg-farm-green text-white' },
      'knowledge_base': { icon: <Database className="h-3 w-3" />, label: 'Knowledge Base', color: 'bg-farm-gold text-white' },
      'error_fallback': { icon: <Code className="h-3 w-3" />, label: 'Demo', color: 'bg-muted text-muted-foreground' }
    };
    
    const badge = badges[source as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <div className="flex items-center gap-1">
        <Badge variant="secondary" className={`text-xs flex items-center gap-1 ${badge.color}`}>
          {badge.icon}
          {badge.label}
        </Badge>
        {modelUsed && (
          <Badge variant="outline" className="text-xs">
            {modelUsed.split('/')[1] || modelUsed}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      {/* Enhanced Header with Open-Source Branding */}
      <div className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-farm-green to-farm-gold shadow-lg">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              Smart Farming AI 
              <Badge variant="secondary" className="bg-farm-green text-white text-xs">
                🔓 Open Source
              </Badge>
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by HuggingFace + Open Models</span>
              {getStatusIcon()}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Enhanced Chat Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <span>Total: {chatStats.totalQueries}</span>
            <span>Open-Source: {chatStats.openSourceQueries}</span>
            <span>Avg: {Math.round(chatStats.avgResponseTime)}ms</span>
          </div>
          
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.native}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Open-Source Status Alert */}
      {connectionStatus === 'offline' && (
        <Alert className="m-4 border-farm-gold/50 bg-farm-gold/10">
          <Code className="h-4 w-4" />
          <AlertDescription>
            🔓 <strong>Open-Source Demo Mode</strong>: Connect HuggingFace API for full AI capabilities. 
            Using local knowledge base for responses.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-farm-green/10 to-farm-gold/10 mb-6">
                <div className="relative">
                  <Sprout className="h-12 w-12 text-farm-green" />
                  <Badge className="absolute -top-2 -right-2 bg-farm-green text-white text-xs px-1 py-0">
                    OSS
                  </Badge>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {selectedLanguage === 'hi' ? '🔓 ओपन सोर्स स्मार्ट कृषि AI' : 
                 selectedLanguage === 'kn' ? '🔓 ಓಪನ್ ಸೋರ್ಸ್ ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮಿಂಗ್ AI' : 
                 selectedLanguage === 'te' ? '🔓 ఓపెన్ సోర్స్ స్మార్ట్ ఫార్మింగ్ AI' :
                 selectedLanguage === 'ta' ? '🔓 ஓபன் சோர்ஸ் ஸ்மார்ட் ஃபார்மிங் AI' :
                 '🔓 Open-Source Smart Farming AI'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-4">
                {selectedLanguage === 'hi' ? 'HuggingFace मॉडल के साथ संचालित • भाषा की पहचान • खुला स्रोत' : 
                 selectedLanguage === 'kn' ? 'HuggingFace ಮಾಡೆಲ್‌ಗಳೊಂದಿಗೆ ಚಾಲಿತ • ಭಾಷಾ ಪತ್ತೆ • ಮುಕ್ತ ಮೂಲ' : 
                 selectedLanguage === 'te' ? 'HuggingFace మోడల్స్‌తో శక్తివంతం • భాష గుర్తింపు • ఓపెన్ సోర్స్' :
                 selectedLanguage === 'ta' ? 'HuggingFace மாடல்களால் இயக்கப்படுகிறது • மொழி கண்டறிதல் • திறந்த மூலம்' :
                 'Powered by HuggingFace Models • Language Detection • Fully Open-Source'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline">🤗 HuggingFace</Badge>
                <Badge variant="outline">🧠 Flan-T5</Badge>
                <Badge variant="outline">🔍 FAISS Ready</Badge>
                <Badge variant="outline">🌐 Multilingual</Badge>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-10 w-10 bg-gradient-to-r from-farm-green to-farm-gold">
                  <AvatarFallback className="text-white">
                    <Sprout className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-last' : ''}`}>
                <Card className={`p-4 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto shadow-lg' 
                    : 'bg-card border shadow-sm'
                }`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</div>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSourceBadge(message.source, message.modelUsed)}
                        {message.queryType && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {message.queryType}
                          </Badge>
                        )}
                        {message.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(message.confidence * 100)}%
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </Card>
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 bg-gradient-to-r from-farm-green to-farm-gold">
                <AvatarFallback className="text-white">
                  <Sprout className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-card border max-w-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-farm-green rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-farm-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-farm-green rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {selectedLanguage === 'hi' ? '🤗 HuggingFace AI सोच रहा है...' : 
                       selectedLanguage === 'kn' ? '🤗 HuggingFace AI ಯೋಚಿಸುತ್ತಿದೆ...' : 
                       selectedLanguage === 'te' ? '🤗 HuggingFace AI ఆలోచిస్తోంది...' :
                       selectedLanguage === 'ta' ? '🤗 HuggingFace AI சிந்திக்கிறது...' :
                       '🤗 HuggingFace AI is thinking...'}
                    </span>
                  </div>
                  {typingProgress > 0 && (
                    <div className="space-y-1">
                      <Progress value={typingProgress} className="h-1" />
                      <div className="text-xs text-muted-foreground">
                        Processing with open-source models...
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Enhanced Input Area with Advanced Features */}
      <div className="border-t p-4 bg-card">
        {/* Voice Input Status */}
        {isListening && (
          <div className="mb-3 p-2 bg-accent rounded-lg flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-accent-foreground">
              {selectedLanguage === 'hi' ? '🎤 सुन रहा है... बोलिए' : 
               selectedLanguage === 'kn' ? '🎤 ಕೇಳುತ್ತಿದೆ... ಮಾತನಾಡಿ' : 
               selectedLanguage === 'te' ? '🎤 వింటోంది... మాట్లాడండి' :
               selectedLanguage === 'ta' ? '🎤 கேட்கிறது... பேசுங்கள்' :
               '🎤 Listening... Speak now'}
            </span>
          </div>
        )}

        <div className="flex gap-3 mb-3">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoiceInput}
            className={`${isListening ? 'bg-destructive text-destructive-foreground animate-pulse' : ''}`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedLanguage === 'hi' ? 'ओपन सोर्स AI से पूछें... (जैसे "टमाटर की खेती कैसे करें?")' : 
                selectedLanguage === 'kn' ? 'ಓಪನ್ ಸೋರ್ಸ್ AI ಯಿಂದ ಕೇಳಿ... (ಉದಾ "ಟೊಮೇಟೊ ಬೆಳೆ ಹೇಗೆ ಮಾಡುವುದು?")' : 
                selectedLanguage === 'te' ? 'ఓపెన్ సోర్స్ AI ని అడగండి... (ఉదా "టొమాటో సాగు ఎలా చేయాలి?")' :
                selectedLanguage === 'ta' ? 'ஓபன் சோர்ஸ் AI யிடம் கேளுங்கள்... (உதா "தக்காளி சாகுபடி எவ்வாறு செய்வது?")' :
                'Ask open-source AI... (e.g., "How to grow tomatoes?")'
              }
              className="pr-4 text-base"
              disabled={isLoading}
            />
            {/* Character count indicator */}
            {currentMessage.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                {currentMessage.length}/500
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentMessage.trim() || isLoading || currentMessage.length > 500}
            className="bg-gradient-to-r from-farm-green to-farm-gold hover:from-farm-green/90 hover:to-farm-gold/90 px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            {selectedLanguage === 'hi' ? 'भेजें' : 
             selectedLanguage === 'kn' ? 'ಕಳುಹಿಸಿ' : 
             selectedLanguage === 'te' ? 'పంపండి' :
             selectedLanguage === 'ta' ? 'அனுப்பு' : 'Send'}
          </Button>
        </div>
        
        {/* Enhanced Smart Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {Object.entries(quickPrompts).map(([type, translations]) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage(translations[selectedLanguage as keyof typeof translations])}
              className="text-xs hover:bg-accent transition-colors p-2 h-auto text-left justify-start"
              disabled={isLoading}
              title={`Click to ask about ${type}`}
            >
              <div className="truncate w-full">
                {translations[selectedLanguage as keyof typeof translations]}
              </div>
            </Button>
          ))}
        </div>

        {/* Quick Action Examples */}
        <div className="mb-3">
          <details className="group">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <span>
                {selectedLanguage === 'hi' ? '💡 उदाहरण प्रश्न देखें' : 
                 selectedLanguage === 'kn' ? '💡 ಉದಾಹರಣೆ ಪ್ರಶ್ನೆಗಳನ್ನು ನೋಡಿ' : 
                 selectedLanguage === 'te' ? '💡 ఉదాహరణ ప్రశ్నలను చూడండి' :
                 selectedLanguage === 'ta' ? '💡 உதாரண கேள்விகளைப் பார்க்கவும்' :
                 '💡 View example questions'}
              </span>
              <span className="transform transition-transform group-open:rotate-90">▶</span>
            </summary>
            <div className="mt-2 space-y-1">
              {[
                selectedLanguage === 'hi' ? "मेरे टमाटर के पत्ते पीले हो रहे हैं, क्या करूं?" : 
                selectedLanguage === 'kn' ? "ನನ್ನ ಟೊಮೇಟೊ ಎಲೆಗಳು ಹಳದಿಯಾಗುತ್ತಿವೆ, ಏನು ಮಾಡಬೇಕು?" :
                selectedLanguage === 'te' ? "నా టొమాటో ఆకులు పసుపు అవుతున్నాయి, ఏమి చేయాలి?" :
                selectedLanguage === 'ta' ? "எனது தக்காளி இலைகள் மஞ்சளாகி வருகின்றன, என்ன செய்வது?" :
                "My tomato leaves are turning yellow, what to do?",
                
                selectedLanguage === 'hi' ? "दिल्ली में प्याज का भाव क्या चल रहा है?" : 
                selectedLanguage === 'kn' ? "ದೆಹಲಿಯಲ್ಲಿ ಈರುಳ್ಳಿ ಬೆಲೆ ಏನು?" :
                selectedLanguage === 'te' ? "ఢిల్లీలో ఉల్లిపాయ ధర ఎంత?" :
                selectedLanguage === 'ta' ? "டெல்லியில் வெங்காய விலை என்ன?" :
                "What is the onion price in Delhi?",
                
                selectedLanguage === 'hi' ? "मानसून से पहले कौन सी सब्जी लगाऊं?" : 
                selectedLanguage === 'kn' ? "ಮಾನ್ಸೂನ್ ಮೊದಲು ಯಾವ ತರಕಾರಿ ನಾಟಬೇಕು?" :
                selectedLanguage === 'te' ? "వర్షాకాలం ముందు ఏ కూరగాయలు నాటాలి?" :
                selectedLanguage === 'ta' ? "பருவமழைக்கு முன் எந்த காய்கறி நடவேண்டும்?" :
                "Which vegetables to plant before monsoon?"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMessage(example)}
                  className="block w-full text-left text-xs text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-1 rounded transition-colors"
                  disabled={isLoading}
                >
                  • {example}
                </button>
              ))}
            </div>
          </details>
        </div>

        {/* Enhanced Open-Source Attribution */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" />
            <span>Powered by</span>
            <Badge variant="outline" className="text-xs">HuggingFace</Badge>
            <span>•</span>
            <Badge variant="outline" className="text-xs">Open Models</Badge>
            <span>•</span>
            <Badge variant="outline" className="text-xs">No Vendor Lock-in</Badge>
          </div>
          
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-1 text-xs">
            {getStatusIcon()}
            <span className={`capitalize ${
              connectionStatus === 'online' ? 'text-farm-green' :
              connectionStatus === 'connecting' ? 'text-farm-gold' :
              'text-muted-foreground'
            }`}>
              {connectionStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};