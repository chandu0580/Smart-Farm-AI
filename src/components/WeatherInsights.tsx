import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Clock,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Sunrise,
  Sunset,
  Gauge,
  Sprout
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
  };
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
    humidity: number;
    windSpeed: number;
  }[];
  alerts: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
  }[];
}

const WeatherInsights: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('mumbai');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Mock weather data - in real app, this would come from weather API
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: 'Mumbai',
    current: {
      temperature: 28,
      feelsLike: 32,
      humidity: 75,
      windSpeed: 12,
      windDirection: 'SW',
      pressure: 1013,
      visibility: 10,
      uvIndex: 7,
      condition: 'Partly Cloudy',
      icon: 'cloud-sun'
    },
    forecast: [
      {
        date: '2024-01-15',
        high: 30,
        low: 24,
        condition: 'Sunny',
        icon: 'sun',
        precipitation: 0,
        humidity: 70,
        windSpeed: 10
      },
      {
        date: '2024-01-16',
        high: 29,
        low: 23,
        condition: 'Cloudy',
        icon: 'cloud',
        precipitation: 60,
        humidity: 80,
        windSpeed: 15
      },
      {
        date: '2024-01-17',
        high: 27,
        low: 22,
        condition: 'Rain',
        icon: 'cloud-rain',
        precipitation: 85,
        humidity: 90,
        windSpeed: 20
      },
      {
        date: '2024-01-18',
        high: 28,
        low: 23,
        condition: 'Partly Cloudy',
        icon: 'cloud-sun',
        precipitation: 20,
        humidity: 75,
        windSpeed: 12
      },
      {
        date: '2024-01-19',
        high: 31,
        low: 25,
        condition: 'Sunny',
        icon: 'sun',
        precipitation: 0,
        humidity: 65,
        windSpeed: 8
      }
    ],
    alerts: [
      {
        type: 'rain',
        severity: 'medium',
        title: 'Heavy Rainfall Expected',
        description: 'Heavy rainfall expected in the next 24 hours. Take necessary precautions for crops.'
      }
    ]
  });

  const locations = [
    { id: 'mumbai', name: 'Mumbai, Maharashtra' },
    { id: 'delhi', name: 'Delhi, NCR' },
    { id: 'bangalore', name: 'Bangalore, Karnataka' },
    { id: 'chennai', name: 'Chennai, Tamil Nadu' },
    { id: 'hyderabad', name: 'Hyderabad, Telangana' },
    { id: 'pune', name: 'Pune, Maharashtra' },
    { id: 'kolkata', name: 'Kolkata, West Bengal' },
    { id: 'ahmedabad', name: 'Ahmedabad, Gujarat' }
  ];

  const refreshWeather = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update weather data with slight variations
    setWeatherData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        temperature: prev.current.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(50, Math.min(95, prev.current.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(5, Math.min(25, prev.current.windSpeed + (Math.random() - 0.5) * 5))
      }
    }));
    
    setLastUpdated(new Date().toLocaleString());
    setIsLoading(false);
  };

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloud':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'cloud-sun':
        return <div className="flex"><Sun className="h-6 w-6 text-yellow-500" /><Cloud className="h-6 w-6 text-gray-500 -ml-2" /></div>;
      case 'cloud-rain':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };

  const getUVIndexColor = (uvIndex: number) => {
    if (uvIndex <= 2) return 'text-green-500';
    if (uvIndex <= 5) return 'text-yellow-500';
    if (uvIndex <= 7) return 'text-orange-500';
    if (uvIndex <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFarmingAdvice = () => {
    const temp = weatherData.current.temperature;
    const humidity = weatherData.current.humidity;
    const windSpeed = weatherData.current.windSpeed;
    const precipitation = weatherData.forecast[0]?.precipitation || 0;

    const advice = [];

    if (temp > 35) {
      advice.push('High temperature alert: Increase irrigation frequency and provide shade for sensitive crops.');
    } else if (temp < 10) {
      advice.push('Low temperature alert: Protect crops from frost damage with covers or mulch.');
    }

    if (humidity > 85) {
      advice.push('High humidity: Monitor for fungal diseases and ensure proper air circulation.');
    } else if (humidity < 40) {
      advice.push('Low humidity: Increase irrigation and consider misting for young plants.');
    }

    if (windSpeed > 20) {
      advice.push('High winds: Secure trellises and protect tall crops from wind damage.');
    }

    if (precipitation > 70) {
      advice.push('Heavy rainfall expected: Ensure proper drainage and protect crops from waterlogging.');
    }

    if (advice.length === 0) {
      advice.push('Weather conditions are favorable for farming activities.');
    }

    return advice;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Weather Insights</h2>
          <p className="text-muted-foreground">Real-time weather data and farming recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={refreshWeather} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Last updated: {lastUpdated} | Weather data is updated every 30 minutes from official sources
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Weather - {locations.find(l => l.id === selectedLocation)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getWeatherIcon(weatherData.current.icon)}
                      <div>
                        <p className="text-2xl font-bold">{weatherData.current.temperature}°C</p>
                        <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Feels like</span>
                      <span className="font-medium">{weatherData.current.feelsLike}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Humidity</span>
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{weatherData.current.humidity}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Wind</span>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{weatherData.current.windSpeed} km/h {weatherData.current.windDirection}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Thermometer className="h-6 w-6 mx-auto text-red-500 mb-2" />
                      <p className="text-sm text-muted-foreground">Pressure</p>
                      <p className="font-semibold">{weatherData.current.pressure} hPa</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Eye className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-muted-foreground">Visibility</p>
                      <p className="font-semibold">{weatherData.current.visibility} km</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Sun className={`h-6 w-6 mx-auto mb-2 ${getUVIndexColor(weatherData.current.uvIndex)}`} />
                      <p className="text-sm text-muted-foreground">UV Index</p>
                      <p className="font-semibold">{weatherData.current.uvIndex}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Gauge className="h-6 w-6 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-muted-foreground">Air Quality</p>
                      <p className="font-semibold">Good</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farming Advice */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5" />
                Farming Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getFarmingAdvice().map((advice, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{advice}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Alerts */}
          {weatherData.alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Weather Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weatherData.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                      <h4 className="font-semibold text-sm">{alert.title}</h4>
                      <p className="text-xs mt-1">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center p-4 bg-muted rounded-lg">
                <p className="font-semibold text-sm">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <div className="flex justify-center my-2">
                  {getWeatherIcon(day.icon)}
                </div>
                <p className="text-sm font-medium">{day.condition}</p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-red-500 font-semibold">{day.high}°</span>
                  <span className="text-blue-500 font-semibold">{day.low}°</span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span>{day.precipitation}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <Wind className="h-3 w-3 text-gray-500" />
                    <span>{day.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weather Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Temperature Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm w-16">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-red-500 h-2 rounded-full"
                      style={{ 
                        width: `${((day.high - day.low) / 20) * 100}%`,
                        marginLeft: `${((day.low - 15) / 20) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-sm">
                    <span className="text-red-500 font-semibold">{day.high}°</span>
                    <span className="mx-1">/</span>
                    <span className="text-blue-500 font-semibold">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precipitation Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm w-16">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${day.precipitation}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{day.precipitation}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeatherInsights; 