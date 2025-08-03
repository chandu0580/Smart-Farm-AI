import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sprout, TrendingUp, Cloud, DollarSign, Globe, Cpu } from 'lucide-react';
import farmingHero from '@/assets/farming-hero.jpg';

interface FarmingHeroProps {
  onTabChange?: (tab: string) => void;
}

export const FarmingHero: React.FC<FarmingHeroProps> = ({ onTabChange }) => {
  const features = [
    {
      icon: <Sprout className="h-5 w-5" />,
      title: "Crop Advisory",
      description: "Smart recommendations",
      color: "from-farm-green to-farm-gold",
      tab: "advisory"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Market Prices",
      description: "Real-time mandi rates",
      color: "from-farm-gold to-farm-earth",
      tab: "prices"
    },
    {
      icon: <Cloud className="h-5 w-5" />,
      title: "Weather Insights",
      description: "Accurate forecasts",
      color: "from-farm-sky to-farm-green",
      tab: "weather"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Multilingual",
      description: "Hindi, Kannada, English",
      color: "from-farm-earth to-farm-sky",
      tab: "chat"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${farmingHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <div className="space-y-2">
                <Badge className="bg-farm-green/20 text-farm-gold border-farm-gold/30 backdrop-blur-sm">
                  <Cpu className="h-3 w-3 mr-1" />
                  Powered by IBM Granite AI
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Smart Farming
                  <span className="block bg-gradient-to-r from-farm-gold to-farm-yellow bg-clip-text text-transparent">
                    AI Assistant
                  </span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                Get instant, intelligent farming advice in your local language. 
                Powered by advanced RAG technology and IBM's most powerful AI models.
              </p>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  🌾 Crop Recommendations
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  💰 Live Market Prices
                </Badge>
                <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  🌤️ Weather Forecasts
                </Badge>
              </div>
            </div>

            {/* Right Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="p-6 backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                  onClick={() => onTabChange?.(feature.tab)}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-3`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="relative z-10 px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <DollarSign className="h-6 w-6" />, number: "500+", label: "Agricultural Data Sources" },
              { icon: <Globe className="h-6 w-6" />, number: "3", label: "Languages Supported" },
              { icon: <Cpu className="h-6 w-6" />, number: "99%", label: "AI Accuracy Rate" }
            ].map((stat, index) => (
              <Card key={index} className="p-6 text-center backdrop-blur-md bg-white/95 hover:bg-white transition-all duration-300">
                <div className="inline-flex p-3 rounded-full bg-gradient-to-r from-farm-green to-farm-gold text-white mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-farm-green mb-1">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};