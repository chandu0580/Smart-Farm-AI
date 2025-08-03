import React, { useState } from 'react';
import { FarmingHero } from '@/components/FarmingHero';
import { OpenSourceChatInterface } from '@/components/OpenSourceChatInterface';
import { TechnicalArchitecture } from '@/components/TechnicalArchitecture';
import MarketPrices from '@/components/MarketPrices';
import CropAdvisory from '@/components/CropAdvisory';
import WeatherInsights from '@/components/WeatherInsights';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Code, Info, TrendingUp, Sprout, Cloud } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <FarmingHero onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-4xl grid-cols-6 bg-card">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat Assistant
              </TabsTrigger>
              <TabsTrigger value="prices" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Prices
              </TabsTrigger>
              <TabsTrigger value="advisory" className="flex items-center gap-2">
                <Sprout className="h-4 w-4" />
                Crop Advisory
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                Weather Insights
              </TabsTrigger>
              <TabsTrigger value="tech" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Architecture
              </TabsTrigger>
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                About
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="mt-6">
            <Card className="w-full max-w-6xl mx-auto h-[700px] overflow-hidden">
              <OpenSourceChatInterface />
            </Card>
          </TabsContent>

          <TabsContent value="prices" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <MarketPrices />
            </div>
          </TabsContent>

          <TabsContent value="advisory" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <CropAdvisory />
            </div>
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <WeatherInsights />
            </div>
          </TabsContent>

          <TabsContent value="tech" className="mt-6">
            <div className="max-w-6xl mx-auto">
              <TechnicalArchitecture />
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-center">🔓 Open-Source Smart Farming AI</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    This Open-Source Smart Farming AI demonstrates the power of accessible AI technology 
                    for agriculture, using HuggingFace's free models and open-source tools to provide 
                    farmers with instant, multilingual farming guidance without vendor lock-in.
                  </p>
                  <p>
                    <strong className="text-foreground">🔓 Open-Source Features:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Powered by HuggingFace's free Flan-T5 and DialoGPT models</li>
                    <li>Automatic language detection for Hindi, Kannada, English, Telugu, Tamil</li>
                    <li>Agricultural knowledge base with intelligent query classification</li>
                    <li>Query-type aware responses (crop, weather, price, fertilizer)</li>
                    <li>Graceful fallbacks and demo mode capabilities</li>
                    <li>Fully transparent and modifiable codebase</li>
                  </ul>
                  <p>
                    <strong className="text-foreground">🛠️ Tech Stack (All Open-Source):</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Frontend:</strong> React.js + TypeScript + Tailwind CSS</li>
                    <li><strong>Backend:</strong> Supabase Edge Functions (Deno)</li>
                    <li><strong>AI Models:</strong> HuggingFace Flan-T5-Large, DialoGPT</li>
                    <li><strong>Embeddings:</strong> Ready for Sentence-transformers integration</li>
                    <li><strong>Vector Search:</strong> FAISS-ready architecture</li>
                    <li><strong>Language Detection:</strong> Unicode script analysis</li>
                    <li><strong>Deployment:</strong> Fully managed via Supabase</li>
                  </ul>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
