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
  Cloud
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language: string;
  confidence?: number;
  source?: 'supabase' | 'flask' | 'demo';
  queryType?: string;
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
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' }
];

const mockResponses = {
  en: {
    crop: "🌾 **Seasonal Crop Recommendation**\n\nBased on current soil conditions and weather patterns, I recommend:\n\n• **Rabi crops**: Wheat, barley, mustard\n• **Winter vegetables**: Tomato, onion, carrot\n• **Cash crops**: Sugarcane, cotton (if irrigated)\n\n💡 **Pro tip**: Consider soil testing for optimal fertilizer application and check local mandi prices before planting.",
    price: "💰 **Current Mandi Prices**\n\n**Tomatoes**: ₹25-30/kg (Delhi), ₹20-25/kg (Bangalore)\n**Onions**: ₹35-40/kg (Mumbai), ₹30-35/kg (Pune)\n**Wheat**: ₹2,100-2,200/quintal\n\n📈 Prices expected to rise 5-10% due to seasonal demand. Best time to sell: Next 2-3 days.",
    weather: "🌤️ **Weather Forecast & Farming Advisory**\n\n**Next 3 days**: Moderate rainfall (15-25mm)\n**Temperature**: 18-25°C\n**Humidity**: 65-75%\n\n✅ **Perfect for**: Transplanting, irrigation\n⚠️ **Avoid**: Harvesting, spraying pesticides\n\n🌧️ Ensure proper drainage to prevent waterlogging.",
    fertilizer: "🧪 **Fertilizer Recommendation**\n\n**NPK Ratio**: 19:19:19 (50kg/hectare)\n**Organic**: Well-decomposed FYM (5-10 tons/hectare)\n**Micronutrients**: Zinc sulfate (25kg/hectare)\n\n📊 **Application timing**:\n• Basal dose: At sowing\n• Top dress: 30-45 days after sowing\n\n💧 Apply after irrigation for better absorption."
  },
  hi: {
    crop: "🌾 **मौसमी फसल सिफारिश**\n\nवर्तमान मिट्टी और मौसम के आधार पर:\n\n• **रबी फसलें**: गेहूं, जौ, सरसों\n• **सर्दियों की सब्जियां**: टमाटर, प्याज, गाजर\n• **नकदी फसलें**: गन्ना, कपास (सिंचित क्षेत्र में)\n\n💡 बुवाई से पहले मिट्टी परीक्षण और मंडी भाव जांचें।",
    price: "💰 **वर्तमान मंडी भाव**\n\n**टमाटर**: ₹25-30/किलो (दिल्ली), ₹20-25/किलो (बेंगलुरु)\n**प्याज**: ₹35-40/किलो (मुंबई)\n**गेहूं**: ₹2,100-2,200/क्विंटल\n\n📈 मौसमी मांग के कारण 5-10% वृद्धि की संभावना।",
    weather: "🌤️ **मौसम पूर्वानुमान**\n\n**अगले 3 दिन**: मध्यम बारिश (15-25मिमी)\n**तापमान**: 18-25°C\n\n✅ **उपयुक्त**: रोपाई, सिंचाई\n⚠️ **बचें**: कटाई, छिड़काव से\n\n🌧️ जल निकासी का ध्यान रखें।",
    fertilizer: "🧪 **उर्वरक सिफारिश**\n\n**NPK अनुपात**: 19:19:19 (50किग्रा/हेक्टेयर)\n**जैविक**: सड़ी गोबर खाद (5-10 टन/हेक्टेयर)\n\n📊 **प्रयोग समय**:\n• आधार मात्रा: बुवाई के समय\n• टॉप ड्रेसिंग: 30-45 दिन बाद"
  },
  kn: {
    crop: "🌾 **ಋತುಮಾನದ ಬೆಳೆ ಶಿಫಾರಸು**\n\nಪ್ರಸ್ತುತ ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ ಆಧಾರದ ಮೇಲೆ:\n\n• **ರಬಿ ಬೆಳೆಗಳು**: ಗೋಧಿ, ಬಾರ್ಲಿ, ಸಾಸಿವೆ\n• **ಚಳಿಗಾಲದ ತರಕಾರಿಗಳು**: ಟೊಮೇಟೊ, ಈರುಳ್ಳಿ\n\n💡 ಬಿತ್ತನೆ ಮೊದಲು ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾಡಿಸಿ।",
    price: "💰 **ಪ್ರಸ್ತುತ ಮಂಡಿ ಬೆಲೆಗಳು**\n\n**ಟೊಮೇಟೊ**: ₹25-30/ಕೆಜಿ (ದೆಹಲಿ)\n**ಈರುಳ್ಳಿ**: ₹35-40/ಕೆಜಿ (ಮುಂಬೈ)\n\n📈 ಋತುಮಾನದ ಬೇಡಿಕೆಯಿಂದಾಗಿ ಬೆಲೆ ಏರಿಕೆ ನಿರೀಕ್ಷೆ।",
    weather: "🌤️ **ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ**\n\n**ಮುಂದಿನ 3 ದಿನಗಳು**: ಮಧ್ಯಮ ಮಳೆ\n**ತಾಪಮಾನ**: 18-25°C\n\n✅ **ಸೂಕ್ತ**: ಕಸಿ ಮಾಡಲು\n⚠️ **ತಪ್ಪಿಸಿ**: ಕೊಯ್ಲು, ಸಿಂಪಣೆ",
    fertilizer: "🧪 **ಗೊಬ್ಬರ ಶಿಫಾರಸು**\n\n**NPK ಅನುಪಾತ**: 19:19:19\n**ಸಾವಯವ**: ಕೊಳೆತ ಗೋಮೂತ್ರ (5-10 ಟನ್/ಹೆಕ್ಟೇರ್)\n\n📊 **ಅನ್ವಯಿಸುವ ಸಮಯ**: ಬಿತ್ತನೆ ಸಮಯದಲ್ಲಿ"
  }
};

const queryTypeKeywords = {
  crop: ['crop', 'plant', 'seed', 'farming', 'फसल', 'बुवाई', 'ಬೆಳೆ', 'ಬಿತ್ತನೆ'],
  price: ['price', 'mandi', 'rate', 'cost', 'दाम', 'भाव', 'ಬೆಲೆ', 'ದರ'],
  weather: ['weather', 'rain', 'climate', 'forecast', 'मौसम', 'बारिश', 'ಹವಾಮಾನ', 'ಮಳೆ'],
  fertilizer: ['fertilizer', 'nutrient', 'NPK', 'manure', 'खाद', 'उर्वरक', 'ಗೊಬ್ಬರ', 'ಪೋಷಕಾಂಶ']
};

export const SmartChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [chatStats, setChatStats] = useState<ChatStats>({ totalQueries: 0, avgResponseTime: 0, successRate: 100 });
  const [typingProgress, setTypingProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const detectQueryType = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    for (const [type, keywords] of Object.entries(queryTypeKeywords)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))) {
        return type;
      }
    }
    return 'crop'; // default
  };

  const simulateTypingProgress = () => {
    setTypingProgress(0);
    const interval = setInterval(() => {
      setTypingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  };

  const getFarmingAdvice = async (message: string, language: string): Promise<{ response: string; source: 'supabase' | 'flask' | 'demo'; queryType: string }> => {
    const startTime = Date.now();
    const queryType = detectQueryType(message);
    
    try {
      setConnectionStatus('connecting');
      
      // Try Supabase edge function first
      const { data, error } = await supabase.functions.invoke('farming-chat', {
        body: { message, language, queryType }
      });

      if (error) throw error;

      setConnectionStatus('online');
      const responseTime = Date.now() - startTime;
      updateChatStats(responseTime, true);
      
      return { 
        response: data.response, 
        source: 'supabase',
        queryType 
      };
    } catch (supabaseError) {
      console.warn('Supabase failed, attempting Flask backend...', supabaseError);
      
      try {
        // TODO: Replace with your actual Flask backend URL
        const flaskUrl = process.env.NODE_ENV === 'production' 
          ? 'https://your-flask-backend.herokuapp.com/ask'
          : 'http://localhost:5000/ask';
          
        const flaskResponse = await fetch(flaskUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            query: message, 
            language,
            queryType 
          })
        });

        if (flaskResponse.ok) {
          const data = await flaskResponse.json();
          setConnectionStatus('online');
          const responseTime = Date.now() - startTime;
          updateChatStats(responseTime, true);
          
          return { 
            response: data.response, 
            source: 'flask',
            queryType 
          };
        }
        
        throw new Error('Flask backend unavailable');
      } catch (flaskError) {
        console.error('Both backends failed:', { supabaseError, flaskError });
        setConnectionStatus('offline');
        
        // Fallback to enhanced demo responses
        const response = mockResponses[language as keyof typeof mockResponses]?.[queryType as keyof typeof mockResponses.en] 
          || mockResponses.en[queryType as keyof typeof mockResponses.en];
        
        const responseTime = Date.now() - startTime;
        updateChatStats(responseTime, false);
        
        return { 
          response: `${response}\n\n---\n🔧 **Demo Mode**: Connect your Flask backend with IBM Granite + FAISS for full RAG capabilities.\n\n📊 **Expected Features**: Real-time weather data, live mandi prices, personalized crop recommendations based on your location and soil data.`, 
          source: 'demo',
          queryType 
        };
      }
    }
  };

  const updateChatStats = (responseTime: number, success: boolean) => {
    setChatStats(prev => ({
      totalQueries: prev.totalQueries + 1,
      avgResponseTime: (prev.avgResponseTime * prev.totalQueries + responseTime) / (prev.totalQueries + 1),
      successRate: success 
        ? ((prev.successRate * prev.totalQueries) + 100) / (prev.totalQueries + 1)
        : ((prev.successRate * prev.totalQueries) + 0) / (prev.totalQueries + 1)
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
      const { response, source, queryType } = await getFarmingAdvice(currentMessage, selectedLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        language: selectedLanguage,
        confidence: source === 'demo' ? 0.75 : 0.95,
        source,
        queryType
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "✅ Response Generated",
        description: `AI provided ${queryType} advice via ${source === 'demo' ? 'Demo Mode' : source === 'flask' ? 'Flask + IBM Granite' : 'Supabase Edge Function'}`,
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to get response from AI agent.",
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
      case 'online': return <Wifi className="h-4 w-4 text-farm-green" />;
      case 'connecting': return <Database className="h-4 w-4 text-farm-gold animate-pulse" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-destructive" />;
    }
  };

  const getSourceBadge = (source?: string) => {
    const badges = {
      'supabase': { icon: <Cloud className="h-3 w-3" />, label: 'Supabase', color: 'bg-farm-green' },
      'flask': { icon: <Database className="h-3 w-3" />, label: 'Flask+IBM', color: 'bg-farm-gold' },
      'demo': { icon: <AlertCircle className="h-3 w-3" />, label: 'Demo', color: 'bg-muted' }
    };
    
    const badge = badges[source as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <Badge variant="secondary" className={`text-xs flex items-center gap-1 ${badge.color} text-white`}>
        {badge.icon}
        {badge.label}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-farm-green to-farm-gold shadow-lg">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Smart Farming AI Agent</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by IBM Granite + RAG</span>
              {getStatusIcon()}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Chat Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <span>Queries: {chatStats.totalQueries}</span>
            <span>Avg: {Math.round(chatStats.avgResponseTime)}ms</span>
            <span>Success: {Math.round(chatStats.successRate)}%</span>
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

      {/* Connection Status Alert */}
      {connectionStatus === 'offline' && (
        <Alert className="m-4 border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Running in demo mode. Connect your Flask backend with IBM Granite for full RAG capabilities.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex p-6 rounded-full bg-gradient-to-r from-farm-green/10 to-farm-gold/10 mb-6">
                <Sprout className="h-12 w-12 text-farm-green" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {selectedLanguage === 'hi' ? 'स्मार्ट कृषि AI एजेंट में आपका स्वागत है' : 
                 selectedLanguage === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮಿಂಗ್ AI ಏಜೆಂಟ್‌ಗೆ ಸ್ವಾಗತ' : 
                 'Welcome to Smart Farming AI Agent'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {selectedLanguage === 'hi' ? 'फसल की सलाह, मंडी की कीमतें, मौसम की जानकारी और उर्वरक सुझाव पाएं' : 
                 selectedLanguage === 'kn' ? 'ಬೆಳೆ ಸಲಹೆ, ಮಂಡಿ ಬೆಲೆಗಳು, ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು ಗೊಬ್ಬರ ಸಲಹೆಗಳನ್ನು ಪಡೆಯಿರಿ' : 
                 'Get crop advice, mandi prices, weather information, and fertilizer recommendations powered by AI'}
              </p>
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
              
              <div className={`max-w-[75%] ${message.sender === 'user' ? 'order-last' : ''}`}>
                <Card className={`p-4 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto shadow-lg' 
                    : 'bg-card border shadow-sm'
                }`}>
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</div>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        {getSourceBadge(message.source)}
                        {message.queryType && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {message.queryType}
                          </Badge>
                        )}
                        {message.confidence && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(message.confidence * 100)}% confidence
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
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
                      {selectedLanguage === 'hi' ? 'AI विश्लेषण कर रहा है...' : 
                       selectedLanguage === 'kn' ? 'AI ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...' : 
                       'AI is analyzing your query...'}
                    </span>
                  </div>
                  {typingProgress > 0 && (
                    <Progress value={typingProgress} className="h-1" />
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Enhanced Input Area */}
      <div className="border-t p-4 bg-card">
        <div className="flex gap-3 mb-3">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoiceInput}
            className={`${isListening ? 'bg-destructive text-destructive-foreground animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedLanguage === 'hi' ? 'अपना कृषि प्रश्न यहाँ लिखें... (उदा: "गेहूं की बुवाई कब करें?")' : 
                selectedLanguage === 'kn' ? 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ... (ಉದಾ: "ಗೋಧಿ ಯಾವಾಗ ಬಿತ್ತಬೇಕು?")' : 
                'Type your farming question here... (e.g., "When to plant wheat?")'
              }
              className="pr-4 text-base"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentMessage.trim() || isLoading}
            className="bg-gradient-to-r from-farm-green to-farm-gold hover:from-farm-green/90 hover:to-farm-gold/90 px-6"
          >
            <Send className="h-4 w-4 mr-2" />
            {selectedLanguage === 'hi' ? 'भेजें' : selectedLanguage === 'kn' ? 'ಕಳುಹಿಸಿ' : 'Send'}
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {[
            { 
              en: "🌾 Best crop for this season?", 
              hi: "🌾 इस मौसम के लिए सबसे अच्छी फसल?", 
              kn: "🌾 ಈ ಋತುವಿಗೆ ಉತ್ತಮ ಬೆಳೆ ಯಾವುದು?",
              type: 'crop'
            },
            { 
              en: "💰 Current tomato prices", 
              hi: "💰 टमाटर की वर्तमान कीमतें", 
              kn: "💰 ಟೊಮೇಟೊದ ಪ್ರಸ್ತುತ ಬೆಲೆಗಳು",
              type: 'price'
            },
            { 
              en: "🌤️ Weather forecast", 
              hi: "🌤️ मौसम पूर्वानुमान", 
              kn: "🌤️ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
              type: 'weather'
            },
            { 
              en: "🧪 Fertilizer recommendations", 
              hi: "🧪 उर्वरक सुझाव", 
              kn: "🧪 ಗೊಬ್ಬರ ಶಿಫಾರಸುಗಳು",
              type: 'fertilizer'
            }
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage(suggestion[selectedLanguage as keyof typeof suggestion] as string)}
              className="text-xs hover:bg-accent transition-colors"
              disabled={isLoading}
            >
              {suggestion[selectedLanguage as keyof typeof suggestion]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};