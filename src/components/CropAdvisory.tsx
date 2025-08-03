import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Sprout, 
  Calendar, 
  Droplets, 
  Sun, 
  Thermometer, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Info,
  Leaf,
  Scissors
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'pulses';
  seasons: string[];
  growingTime: string;
  waterRequirement: 'low' | 'medium' | 'high';
  sunlightRequirement: 'partial' | 'full';
  soilType: string[];
  temperature: {
    min: number;
    max: number;
    optimal: number;
  };
  spacing: string;
  harvestTime: string;
  tips: string[];
  diseases: string[];
  fertilizers: string[];
  yield: string;
}

const CropAdvisory: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('tomato');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const crops: CropInfo[] = [
    {
      id: 'tomato',
      name: 'Tomato',
      scientificName: 'Solanum lycopersicum',
      category: 'vegetables',
      seasons: ['Spring', 'Summer', 'Monsoon'],
      growingTime: '70-85 days',
      waterRequirement: 'medium',
      sunlightRequirement: 'full',
      soilType: ['Well-drained loamy soil', 'pH 6.0-7.0'],
      temperature: { min: 15, max: 35, optimal: 25 },
      spacing: '60-90 cm between plants',
      harvestTime: 'When fruits turn red and firm',
      tips: [
        'Start seeds indoors 6-8 weeks before last frost',
        'Provide support with cages or stakes',
        'Remove suckers for better fruit production',
        'Water at the base to avoid leaf diseases',
        'Mulch to retain soil moisture'
      ],
      diseases: ['Early blight', 'Late blight', 'Bacterial wilt', 'Tomato mosaic virus'],
      fertilizers: ['NPK 10-10-10', 'Organic compost', 'Fish emulsion'],
      yield: '15-25 kg per plant'
    },
    {
      id: 'onion',
      name: 'Onion',
      scientificName: 'Allium cepa',
      category: 'vegetables',
      seasons: ['Winter', 'Spring'],
      growingTime: '90-120 days',
      waterRequirement: 'medium',
      sunlightRequirement: 'full',
      soilType: ['Sandy loam', 'pH 6.0-7.5'],
      temperature: { min: 10, max: 30, optimal: 20 },
      spacing: '10-15 cm between plants',
      harvestTime: 'When tops fall over and dry',
      tips: [
        'Plant in well-drained soil',
        'Keep soil consistently moist',
        'Stop watering 2-3 weeks before harvest',
        'Plant in rows for better air circulation',
        'Use onion sets for faster growth'
      ],
      diseases: ['Downy mildew', 'Purple blotch', 'Neck rot', 'Black mold'],
      fertilizers: ['NPK 12-24-12', 'Bone meal', 'Compost'],
      yield: '8-12 kg per square meter'
    },
    {
      id: 'potato',
      name: 'Potato',
      scientificName: 'Solanum tuberosum',
      category: 'vegetables',
      seasons: ['Winter', 'Spring'],
      growingTime: '80-120 days',
      waterRequirement: 'high',
      sunlightRequirement: 'full',
      soilType: ['Loose, well-drained soil', 'pH 5.5-6.5'],
      temperature: { min: 8, max: 25, optimal: 18 },
      spacing: '30-40 cm between plants',
      harvestTime: 'When leaves turn yellow and die back',
      tips: [
        'Plant certified seed potatoes',
        'Hill soil around plants as they grow',
        'Keep soil consistently moist',
        'Avoid overhead watering',
        'Harvest on a dry day'
      ],
      diseases: ['Late blight', 'Early blight', 'Blackleg', 'Common scab'],
      fertilizers: ['NPK 15-15-15', 'Potassium sulfate', 'Organic matter'],
      yield: '15-25 kg per square meter'
    },
    {
      id: 'carrot',
      name: 'Carrot',
      scientificName: 'Daucus carota',
      category: 'vegetables',
      seasons: ['Spring', 'Fall', 'Winter'],
      growingTime: '60-80 days',
      waterRequirement: 'medium',
      sunlightRequirement: 'full',
      soilType: ['Loose, sandy soil', 'pH 6.0-7.0'],
      temperature: { min: 10, max: 25, optimal: 18 },
      spacing: '5-8 cm between plants',
      harvestTime: 'When roots are 2-3 cm in diameter',
      tips: [
        'Sow seeds directly in garden',
        'Thin seedlings to prevent crowding',
        'Keep soil loose for straight roots',
        'Water deeply but infrequently',
        'Harvest before soil freezes'
      ],
      diseases: ['Carrot rust fly', 'Alternaria leaf blight', 'Bacterial soft rot'],
      fertilizers: ['NPK 5-10-10', 'Phosphorus-rich fertilizer', 'Compost'],
      yield: '8-12 kg per square meter'
    },
    {
      id: 'cabbage',
      name: 'Cabbage',
      scientificName: 'Brassica oleracea',
      category: 'vegetables',
      seasons: ['Winter', 'Spring'],
      growingTime: '60-100 days',
      waterRequirement: 'high',
      sunlightRequirement: 'full',
      soilType: ['Rich, well-drained soil', 'pH 6.0-7.5'],
      temperature: { min: 5, max: 25, optimal: 15 },
      spacing: '45-60 cm between plants',
      harvestTime: 'When heads are firm and compact',
      tips: [
        'Start seeds indoors 6-8 weeks before transplanting',
        'Transplant when seedlings have 4-6 leaves',
        'Keep soil consistently moist',
        'Protect from extreme heat',
        'Harvest before heads split'
      ],
      diseases: ['Black rot', 'Clubroot', 'Downy mildew', 'Cabbage loopers'],
      fertilizers: ['NPK 10-10-10', 'Nitrogen-rich fertilizer', 'Compost'],
      yield: '3-5 kg per head'
    },
    {
      id: 'cauliflower',
      name: 'Cauliflower',
      scientificName: 'Brassica oleracea var. botrytis',
      category: 'vegetables',
      seasons: ['Winter', 'Spring'],
      growingTime: '55-100 days',
      waterRequirement: 'high',
      sunlightRequirement: 'full',
      soilType: ['Rich, well-drained soil', 'pH 6.0-7.0'],
      temperature: { min: 10, max: 25, optimal: 18 },
      spacing: '45-60 cm between plants',
      harvestTime: 'When curds are white and compact',
      tips: [
        'Start seeds indoors 6-8 weeks before transplanting',
        'Transplant when seedlings have 4-6 leaves',
        'Blanch heads by tying leaves over curd',
        'Keep soil consistently moist',
        'Harvest before curds become loose'
      ],
      diseases: ['Black rot', 'Downy mildew', 'Clubroot', 'Cabbage worms'],
      fertilizers: ['NPK 10-10-10', 'Boron supplement', 'Compost'],
      yield: '1-2 kg per head'
    }
  ];

  const seasons = ['all', 'Spring', 'Summer', 'Monsoon', 'Fall', 'Winter'];
  const currentSeason = 'Winter'; // This would be dynamic based on current date

  const filteredCrops = crops.filter(crop => {
    const seasonMatch = selectedSeason === 'all' || crop.seasons.includes(selectedSeason);
    return seasonMatch;
  });

  const selectedCropData = crops.find(crop => crop.id === selectedCrop);

  const getWaterIcon = (requirement: string) => {
    switch (requirement) {
      case 'low':
        return <Droplets className="h-4 w-4 text-blue-300" />;
      case 'medium':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'high':
        return <Droplets className="h-4 w-4 text-blue-700" />;
      default:
        return <Droplets className="h-4 w-4" />;
    }
  };

  const getSunlightIcon = (requirement: string) => {
    switch (requirement) {
      case 'partial':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'full':
        return <Sun className="h-4 w-4 text-orange-500" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Crop Advisory</h2>
          <p className="text-muted-foreground">Comprehensive growing guide for all vegetables</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Current Season: {currentSeason}
        </Badge>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Get personalized crop recommendations based on your location, season, and soil type. 
          All advice is tailored for Indian farming conditions.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Crop Selection */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Select Crop
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Season</label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map(season => (
                      <SelectItem key={season} value={season}>
                        {season === 'all' ? 'All Seasons' : season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Choose Vegetable</label>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vegetable" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCrops.map(crop => (
                      <SelectItem key={crop.id} value={crop.id}>
                        {crop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          {selectedCropData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Growing Time</span>
                  <Badge variant="outline">{selectedCropData.growingTime}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Water Need</span>
                  <div className="flex items-center gap-1">
                    {getWaterIcon(selectedCropData.waterRequirement)}
                    <span className="text-sm capitalize">{selectedCropData.waterRequirement}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sunlight</span>
                  <div className="flex items-center gap-1">
                    {getSunlightIcon(selectedCropData.sunlightRequirement)}
                    <span className="text-sm capitalize">{selectedCropData.sunlightRequirement}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Temperature</span>
                  <span className="text-sm">{selectedCropData.temperature.optimal}°C optimal</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Detailed Information */}
        <div className="lg:col-span-2">
          {selectedCropData ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="growing">Growing Guide</TabsTrigger>
                <TabsTrigger value="care">Care & Maintenance</TabsTrigger>
                <TabsTrigger value="harvest">Harvest</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                                      <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    {selectedCropData.name} Overview
                  </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Scientific Name:</strong> {selectedCropData.scientificName}</div>
                          <div><strong>Category:</strong> {selectedCropData.category}</div>
                          <div><strong>Growing Time:</strong> {selectedCropData.growingTime}</div>
                          <div><strong>Yield:</strong> {selectedCropData.yield}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Growing Requirements</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Soil Type:</strong> {selectedCropData.soilType.join(', ')}</div>
                          <div><strong>Spacing:</strong> {selectedCropData.spacing}</div>
                          <div><strong>Temperature Range:</strong> {selectedCropData.temperature.min}°C - {selectedCropData.temperature.max}°C</div>
                          <div><strong>Optimal Temperature:</strong> {selectedCropData.temperature.optimal}°C</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="growing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5" />
                      Growing Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="tips">
                        <AccordionTrigger>Growing Tips</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {selectedCropData.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="fertilizers">
                        <AccordionTrigger>Fertilizers</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {selectedCropData.fertilizers.map((fertilizer, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{fertilizer}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="care" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Care & Maintenance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Common Diseases</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {selectedCropData.diseases.map((disease, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {disease}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Prevention Tips</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Maintain proper spacing for air circulation</li>
                          <li>• Water at the base to avoid leaf diseases</li>
                          <li>• Rotate crops annually</li>
                          <li>• Use disease-resistant varieties</li>
                          <li>• Keep garden clean and weed-free</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="harvest" className="space-y-4">
                <Card>
                  <CardHeader>
                                       <CardTitle className="flex items-center gap-2">
                     <Scissors className="h-5 w-5" />
                     Harvest Information
                   </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">When to Harvest</h4>
                        <p className="text-sm text-muted-foreground">{selectedCropData.harvestTime}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Harvesting Tips</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Harvest in the morning when plants are cool</li>
                          <li>• Use clean, sharp tools</li>
                          <li>• Handle produce gently to avoid bruising</li>
                          <li>• Store properly to maintain freshness</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Sprout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a crop to view detailed information</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropAdvisory; 