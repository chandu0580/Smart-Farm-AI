import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Send, Sprout, User, Mic, MicOff, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  language: string;
  confidence?: number;
}

interface Language {
  code: string;
  name: string;
  native: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
];

const mockResponses = {
  en: {
    crop: "Based on current soil conditions and weather patterns, I recommend planting **Rabi crops** like wheat, barley, or mustard for this season. These crops are well-suited for winter cultivation and have good market demand. Consider soil testing for optimal fertilizer application.",
    price: "Current mandi prices for tomatoes: **₹25-30 per kg** in Delhi, **₹20-25 per kg** in Bangalore. Prices are expected to rise due to seasonal demand. Consider selling within 2-3 days for best rates.",
    weather: "Weather forecast shows moderate rainfall expected in the next 3 days. Perfect for transplanting. Ensure proper drainage and avoid overwatering. Temperature will remain between 18-25°C - ideal for most crops.",
    fertilizer: "For your crop type, use NPK 19:19:19 at 50kg per hectare during vegetative growth. Add organic manure 2 weeks before planting. Soil pH should be 6.0-7.0 for optimal nutrient uptake."
  },
  hi: {
    crop: "वर्तमान मिट्टी की स्थिति और मौसम के आधार पर, मैं इस सीजन के लिए **रबी फसलों** जैसे गेहूं, जौ, या सरसों की बुवाई की सिफारिश करता हूं। ये फसलें सर्दियों की खेती के लिए उपयुक्त हैं और बाजार में अच्छी मांग है।",
    price: "टमाटर की वर्तमान मंडी दरें: दिल्ली में **₹25-30 प्रति किलो**, बैंगलोर में **₹20-25 प्रति किलो**। मौसमी मांग के कारण दरों में वृद्धि की उम्मीद है।",
    weather: "मौसम पूर्वानुमान अगले 3 दिनों में मध्यम बारिश दिखा रहा है। रोपाई के लिए एकदम सही। उचित जल निकासी सुनिश्चित करें और अधिक पानी न दें।",
    fertilizer: "आपकी फसल के लिए, वानस्पतिक विकास के दौरान 50 किलो प्रति हेक्टेयर की दर से NPK 19:19:19 का उपयोग करें। रोपण से 2 सप्ताह पहले जैविक खाद डालें।"
  },
  kn: {
    crop: "ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ಪರಿಸ್ಥಿತಿ ಮತ್ತು ಹವಾಮಾನ ಮಾದರಿಗಳ ಆಧಾರದ ಮೇಲೆ, ಈ ಋತುವಿಗೆ ಗೋಧಿ, ಬಾರ್ಲಿ ಅಥವಾ ಸಾಸಿವೆಯಂತಹ **ರಬಿ ಬೆಳೆಗಳನ್ನು** ನೆಡಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ।",
    price: "ಟೊಮೇಟೊಗಳ ಪ್ರಸ್ತುತ ಮಂಡಿ ದರಗಳು: ದೆಹಲಿಯಲ್ಲಿ **₹25-30 ಪ್ರತಿ ಕಿಲೋ**, ಬೆಂಗಳೂರಿನಲ್ಲಿ **₹20-25 ಪ್ರತಿ ಕಿಲೋ**। ಋತುವಿನ ಬೇಡಿಕೆಯಿಂದಾಗಿ ದರಗಳು ಏರಲು ಸಾಧ್ಯತೆ ಇದೆ।",
    weather: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆಯು ಮುಂದಿನ 3 ದಿನಗಳಲ್ಲಿ ಮಧ್ಯಮ ಮಳೆಯನ್ನು ತೋರಿಸುತ್ತದೆ। ಕಸಿ ಮಾಡಲು ಪರಿಪೂರ್ಣ। ಸರಿಯಾದ ಒಳಚರಂಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ।",
    fertilizer: "ನಿಮ್ಮ ಬೆಳೆಯ ಪ್ರಕಾರಕ್ಕೆ, ಸಸ್ಯಕ ಬೆಳವಣಿಗೆಯ ಸಮಯದಲ್ಲಿ ಪ್ರತಿ ಹೆಕ್ಟೇರಿಗೆ 50 ಕೆಜಿ NPK 19:19:19 ಬಳಸಿ।"
  }
};

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const detectQueryType = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('crop') || lowerQuery.includes('plant') || lowerQuery.includes('फसल') || lowerQuery.includes('ಬೆಳೆ')) {
      return 'crop';
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('mandi') || lowerQuery.includes('दाम') || lowerQuery.includes('ಬೆಲೆ')) {
      return 'price';
    }
    if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('मौसम') || lowerQuery.includes('ಹವಾಮಾನ')) {
      return 'weather';
    }
    if (lowerQuery.includes('fertilizer') || lowerQuery.includes('खाद') || lowerQuery.includes('ಗೊಬ್ಬರ')) {
      return 'fertilizer';
    }
    return 'crop'; // default
  };

  const getFarmingAdvice = async (message: string, language: string): Promise<string> => {
    try {
      // Try Supabase edge function first (current implementation)
      const { data, error } = await supabase.functions.invoke('farming-chat', {
        body: { message, language }
      });

      if (error) {
        console.error('Error calling farming-chat function:', error);
        throw error;
      }

      return data.response;
    } catch (supabaseError) {
      console.warn('Supabase edge function failed, trying Flask backend...', supabaseError);
      
      try {
        // TODO: Replace with your Flask backend URL when ready
        // const flaskResponse = await fetch('http://localhost:5000/ask', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ query: message, language })
        // });
        // 
        // if (flaskResponse.ok) {
        //   const data = await flaskResponse.json();
        //   return data.response;
        // }
        
        throw new Error('Flask backend not available');
      } catch (flaskError) {
        console.error('Both backends failed:', { supabaseError, flaskError });
        
        // Fallback to mock response with better error handling
        const queryType = detectQueryType(message);
        const response = mockResponses[language as keyof typeof mockResponses]?.[queryType as keyof typeof mockResponses.en] 
          || mockResponses.en[queryType as keyof typeof mockResponses.en];
        
        return `[Demo Mode] ${response}\n\n*Note: Connect your Flask backend for full RAG capabilities with IBM Granite.*`;
      }
    }
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

    try {
      const response = await getFarmingAdvice(currentMessage, selectedLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        language: selectedLanguage,
        confidence: 0.95
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Response Generated",
        description: "AI agent provided farming advice based on your query.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from AI agent.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    // Voice input implementation would go here
    toast({
      title: isListening ? "Voice input stopped" : "Voice input started",
      description: isListening ? "Click again to start listening" : "Speak your farming question",
    });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-farm-green to-farm-gold">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Smart Farming AI</h2>
            <p className="text-sm text-muted-foreground">Powered by IBM Granite & RAG</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.native}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex p-4 rounded-full bg-accent mb-4">
                <Sprout className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {selectedLanguage === 'hi' ? 'स्मार्ट कृषि सहायक में आपका स्वागत है' : 
                 selectedLanguage === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಫಾರ್ಮಿಂಗ್ ಸಹಾಯಕಕ್ಕೆ ಸ್ವಾಗತ' : 
                 'Welcome to Smart Farming Assistant'}
              </h3>
              <p className="text-muted-foreground">
                {selectedLanguage === 'hi' ? 'फसल की सलाह, मंडी की कीमतें, और मौसम की जानकारी के लिए पूछें' : 
                 selectedLanguage === 'kn' ? 'ಬೆಳೆ ಸಲಹೆ, ಮಂಡಿ ಬೆಲೆಗಳು ಮತ್ತು ಹವಾಮಾನ ಮಾಹಿತಿಗಾಗಿ ಕೇಳಿ' : 
                 'Ask about crop advice, mandi prices, and weather information'}
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 bg-gradient-to-r from-farm-green to-farm-gold">
                  <AvatarFallback className="text-white">
                    <Sprout className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-last' : ''}`}>
                <Card className={`p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-card border'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  {message.confidence && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                      <Badge variant="secondary" className="text-xs">
                        Confidence: {Math.round(message.confidence * 100)}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </Card>
              </div>
              
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 bg-gradient-to-r from-farm-green to-farm-gold">
                <AvatarFallback className="text-white">
                  <Sprout className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-card border">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-farm-green rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-farm-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-farm-green rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {selectedLanguage === 'hi' ? 'AI सोच रहा है...' : 
                     selectedLanguage === 'kn' ? 'AI ಯೋಚಿಸುತ್ತಿದೆ...' : 
                     'AI is thinking...'}
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4 bg-card">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleVoiceInput}
            className={`${isListening ? 'bg-destructive text-destructive-foreground' : ''}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedLanguage === 'hi' ? 'अपना कृषि प्रश्न यहाँ लिखें...' : 
                selectedLanguage === 'kn' ? 'ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...' : 
                'Type your farming question here...'
              }
              className="pr-12"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!currentMessage.trim() || isLoading}
            className="bg-gradient-to-r from-farm-green to-farm-gold hover:from-farm-green/90 hover:to-farm-gold/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { en: "What crop is best for this season?", hi: "इस मौसम के लिए कौन सी फसल सबसे अच्छी है?", kn: "ಈ ಋತುವಿಗೆ ಯಾವ ಬೆಳೆ ಉತ್ತಮ?" },
            { en: "Check tomato mandi prices", hi: "टमाटर की मंडी दरें देखें", kn: "ಟೊಮೇಟೊ ಮಂಡಿ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" },
            { en: "Weather forecast for farming", hi: "खेती के लिए मौसम पूर्वानुमान", kn: "ಕೃಷಿಗಾಗಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ" }
          ].map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setCurrentMessage(suggestion[selectedLanguage as keyof typeof suggestion])}
              className="text-xs"
            >
              {suggestion[selectedLanguage as keyof typeof suggestion]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};