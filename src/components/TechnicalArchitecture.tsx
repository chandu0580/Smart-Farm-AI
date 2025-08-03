import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Database, 
  Brain, 
  Globe, 
  Server, 
  Cloud, 
  Zap, 
  Shield, 
  GitBranch,
  ExternalLink,
  Code2,
  Layers
} from 'lucide-react';

export const TechnicalArchitecture: React.FC = () => {
  const components = [
    {
      title: "RAG Backend",
      tech: "Python (FastAPI/Flask)",
      icon: <Server className="h-6 w-6" />,
      features: [
        "Agricultural data ingestion from PDFs & web sources",
        "Sentence-transformers embeddings (all-MiniLM-L6-v2)",
        "FAISS vector database for similarity search",
        "Real-time mandi price integration"
      ],
      status: "Backend Ready",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "IBM Granite LLM",
      tech: "Watsonx API Integration",
      icon: <Brain className="h-6 w-6" />,
      features: [
        "Context-aware farming advice generation",
        "Multi-turn conversation handling",
        "Rate limiting and error handling",
        "Confidence scoring for responses"
      ],
      status: "AI Integration",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Translation Layer",
      tech: "IBM Language Translator",
      icon: <Globe className="h-6 w-6" />,
      features: [
        "Auto-detect user query language",
        "Translate to English for RAG processing",
        "Translate AI response back to user language",
        "Support for Hindi, Kannada, English"
      ],
      status: "Multilingual",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Frontend UI",
      tech: "React.js (Current)",
      icon: <Code2 className="h-6 w-6" />,
      features: [
        "Responsive chat interface",
        "Voice-to-text integration",
        "Language switcher",
        "Real-time message updates"
      ],
      status: "✅ Implemented",
      color: "from-farm-green to-farm-gold"
    }
  ];

  const dataflow = [
    { step: "1", title: "User Query", desc: "Farmer asks in local language", icon: <Globe className="h-4 w-4" /> },
    { step: "2", title: "Translation", desc: "Query translated to English", icon: <Layers className="h-4 w-4" /> },
    { step: "3", title: "RAG Search", desc: "FAISS finds relevant documents", icon: <Database className="h-4 w-4" /> },
    { step: "4", title: "LLM Processing", desc: "IBM Granite generates response", icon: <Brain className="h-4 w-4" /> },
    { step: "5", title: "Response", desc: "Translated back to user language", icon: <Zap className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-8">
      {/* Architecture Overview */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Technical Architecture</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A complete AI-powered farming advice system using IBM Granite, RAG technology, 
          and multilingual support for real-world agricultural scenarios.
        </p>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {components.map((component, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${component.color} text-white`}>
                    {component.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{component.title}</h3>
                    <p className="text-sm text-muted-foreground">{component.tech}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  {component.status}
                </Badge>
              </div>

              <ul className="space-y-2">
                {component.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-farm-green mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* Data Flow */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-center">RAG Data Flow Pipeline</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {dataflow.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center text-center max-w-32">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-farm-green to-farm-gold text-white flex items-center justify-center font-bold mb-2">
                  {item.step}
                </div>
                <div className="p-2 rounded-lg bg-accent text-accent-foreground mb-2">
                  {item.icon}
                </div>
                <h4 className="font-medium text-sm text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              {index < dataflow.length - 1 && (
                <div className="flex items-center">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-farm-green to-farm-gold"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Deployment & Integration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="h-6 w-6 text-farm-green" />
            <h3 className="text-xl font-semibold">Deployment Ready</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-farm-green" />
              <span className="text-sm">Docker containerization for backend</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-farm-green" />
              <span className="text-sm">IBM Cloud Lite deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-farm-green" />
              <span className="text-sm">CI/CD pipeline integration</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-6 w-6 text-farm-gold" />
            <h3 className="text-xl font-semibold">Data Sources</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p>• agmarknet.gov.in (Market prices)</p>
            <p>• agricoop.nic.in (Crop guidelines)</p>
            <p>• Weather API integration</p>
            <p>• Agricultural research papers</p>
            <p>• Farmer query logs (MongoDB)</p>
          </div>
        </Card>
      </div>

      {/* Backend Setup Instructions */}
      <Card className="p-6 bg-gradient-to-r from-accent/50 to-muted/50">
        <h3 className="text-xl font-semibold mb-4">Backend Implementation Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-farm-green">Python Backend Setup:</h4>
            <code className="block bg-card p-3 rounded text-sm text-muted-foreground">
              pip install fastapi sentence-transformers<br/>
              pip install faiss-cpu ibm-watson<br/>
              pip install python-multipart uvicorn
            </code>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-farm-green">IBM Watsonx Integration:</h4>
            <code className="block bg-card p-3 rounded text-sm text-muted-foreground">
              from ibm_watson import LanguageTranslatorV3<br/>
              from ibm_watson import NaturalLanguageUnderstandingV1<br/>
              # Configure API keys and endpoints
            </code>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            IBM Cloud Setup Guide
          </Button>
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            RAG Implementation
          </Button>
          <Button variant="outline" size="sm">
            <GitBranch className="h-4 w-4 mr-2" />
            Deployment Scripts
          </Button>
        </div>
      </Card>
    </div>
  );
};