import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, DollarSign, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VegetablePrice {
  id: string;
  name: string;
  price: number;
  previousPrice: number;
  unit: string;
  location: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

const MarketPrices: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedVegetable, setSelectedVegetable] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Mock data - in real app, this would come from API
  const [prices, setPrices] = useState<VegetablePrice[]>([
    {
      id: '1',
      name: 'Tomato',
      price: 45.50,
      previousPrice: 42.00,
      unit: 'kg',
      location: 'Mumbai APMC',
      lastUpdated: '2024-01-15 10:30',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Onion',
      price: 28.75,
      previousPrice: 30.00,
      unit: 'kg',
      location: 'Delhi Azadpur',
      lastUpdated: '2024-01-15 10:25',
      trend: 'down'
    },
    {
      id: '3',
      name: 'Potato',
      price: 22.00,
      previousPrice: 22.00,
      unit: 'kg',
      location: 'Bangalore KR Market',
      lastUpdated: '2024-01-15 10:20',
      trend: 'stable'
    },
    {
      id: '4',
      name: 'Carrot',
      price: 35.00,
      previousPrice: 32.50,
      unit: 'kg',
      location: 'Chennai Koyambedu',
      lastUpdated: '2024-01-15 10:15',
      trend: 'up'
    },
    {
      id: '5',
      name: 'Cabbage',
      price: 18.50,
      previousPrice: 20.00,
      unit: 'kg',
      location: 'Hyderabad Bowenpally',
      lastUpdated: '2024-01-15 10:10',
      trend: 'down'
    },
    {
      id: '6',
      name: 'Cauliflower',
      price: 25.00,
      previousPrice: 25.00,
      unit: 'kg',
      location: 'Pune Market Yard',
      lastUpdated: '2024-01-15 10:05',
      trend: 'stable'
    }
  ]);

  const locations = ['all', 'Mumbai APMC', 'Delhi Azadpur', 'Bangalore KR Market', 'Chennai Koyambedu', 'Hyderabad Bowenpally', 'Pune Market Yard'];
  const vegetables = ['all', 'Tomato', 'Onion', 'Potato', 'Carrot', 'Cabbage', 'Cauliflower'];

  const filteredPrices = prices.filter(price => {
    const locationMatch = selectedLocation === 'all' || price.location === selectedLocation;
    const vegetableMatch = selectedVegetable === 'all' || price.name === selectedVegetable;
    return locationMatch && vegetableMatch;
  });

  const refreshPrices = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update prices with new data
    setPrices(prev => prev.map(price => ({
      ...price,
      price: price.price + (Math.random() - 0.5) * 5,
      previousPrice: price.price,
      lastUpdated: new Date().toLocaleString(),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    })));
    
    setLastUpdated(new Date().toLocaleString());
    setIsLoading(false);
  };

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 text-gray-500">—</div>;
    }
  };

  const getPriceChange = (current: number, previous: number) => {
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { change, percentage };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Market Prices</h2>
          <p className="text-muted-foreground">Real-time vegetable prices across major markets</p>
        </div>
        <Button 
          onClick={refreshPrices} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Updating...' : 'Refresh Prices'}
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Last updated: {lastUpdated} | Prices are updated every 30 minutes from official APMC sources
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Location</label>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location === 'all' ? 'All Locations' : location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Filter by Vegetable</label>
          <Select value={selectedVegetable} onValueChange={setSelectedVegetable}>
            <SelectTrigger>
              <SelectValue placeholder="Select vegetable" />
            </SelectTrigger>
            <SelectContent>
              {vegetables.map(vegetable => (
                <SelectItem key={vegetable} value={vegetable}>
                  {vegetable === 'all' ? 'All Vegetables' : vegetable}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Market Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vegetable</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price (₹/kg)</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.map((price) => {
                const { change, percentage } = getPriceChange(price.price, price.previousPrice);
                return (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">{price.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {price.location}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{price.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {change !== 0 && (
                          <Badge variant={change > 0 ? 'default' : 'secondary'} className="text-xs">
                            {change > 0 ? '+' : ''}{change.toFixed(2)} ({percentage.toFixed(1)}%)
                          </Badge>
                        )}
                        {change === 0 && <span className="text-muted-foreground">No change</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(price.trend)}
                        <span className="text-xs capitalize">{price.trend}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(price.lastUpdated).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Highest Price</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{Math.max(...prices.map(p => p.price)).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {prices.find(p => p.price === Math.max(...prices.map(p => p.price)))?.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">Lowest Price</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">
              ₹{Math.min(...prices.map(p => p.price)).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">
              {prices.find(p => p.price === Math.min(...prices.map(p => p.price)))?.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Average Price</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{(prices.reduce((sum, p) => sum + p.price, 0) / prices.length).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Across all vegetables</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices; 