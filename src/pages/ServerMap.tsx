import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  MapPin, 
  Zap, 
  Shield, 
  Users,
  Activity,
  Server,
  CheckCircle
} from "lucide-react";

interface ServerLocation {
  id: string;
  country: string;
  city: string;
  region: string;
  latency: string;
  load: number;
  status: "online" | "maintenance" | "offline";
  users: number;
  features: string[];
}

const ServerMap = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");

  const serverLocations: ServerLocation[] = [
    {
      id: "us-east-1",
      country: "United States",
      city: "New York",
      region: "North America",
      latency: "12ms",
      load: 45,
      status: "online",
      users: 8420,
      features: ["P2P", "Streaming", "Gaming"]
    },
    {
      id: "us-west-1", 
      country: "United States",
      city: "Los Angeles",
      region: "North America",
      latency: "8ms",
      load: 62,
      status: "online",
      users: 12350,
      features: ["P2P", "Streaming", "Gaming"]
    },
    {
      id: "uk-1",
      country: "United Kingdom",
      city: "London",
      region: "Europe",
      latency: "15ms",
      load: 38,
      status: "online",
      users: 6890,
      features: ["P2P", "Streaming", "GDPR"]
    },
    {
      id: "de-1",
      country: "Germany",
      city: "Frankfurt",
      region: "Europe", 
      latency: "18ms",
      load: 52,
      status: "online",
      users: 9240,
      features: ["P2P", "Streaming", "GDPR"]
    },
    {
      id: "jp-1",
      country: "Japan",
      city: "Tokyo",
      region: "Asia Pacific",
      latency: "22ms",
      load: 41,
      status: "online",
      users: 5670,
      features: ["P2P", "Streaming", "Gaming"]
    },
    {
      id: "au-1",
      country: "Australia",
      city: "Sydney", 
      region: "Asia Pacific",
      latency: "28ms",
      load: 34,
      status: "online",
      users: 3420,
      features: ["P2P", "Streaming"]
    },
    {
      id: "sg-1",
      country: "Singapore",
      city: "Singapore",
      region: "Asia Pacific",
      latency: "25ms",
      load: 48,
      status: "online",
      users: 4560,
      features: ["P2P", "Streaming", "Gaming"]
    },
    {
      id: "ca-1",
      country: "Canada",
      city: "Toronto",
      region: "North America",
      latency: "14ms",
      load: 29,
      status: "online", 
      users: 2890,
      features: ["P2P", "Streaming"]
    }
  ];

  const regions = ["all", "North America", "Europe", "Asia Pacific"];

  const filteredServers = selectedRegion === "all" 
    ? serverLocations 
    : serverLocations.filter(server => server.region === selectedRegion);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";  
      case "offline": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 40) return "bg-green-500";
    if (load < 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Globe className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-6">
              Global Server Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect to our high-speed servers strategically placed around the world 
              for optimal performance and reliability.
            </p>
            
            {/* Region Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  onClick={() => setSelectedRegion(region)}
                  className="capitalize"
                >
                  {region === "all" ? "All Regions" : region}
                </Button>
              ))}
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Server className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">{serverLocations.length}</div>
                <div className="text-sm text-muted-foreground">Server Locations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">
                  {(serverLocations.reduce((sum, server) => sum + server.users, 0) / 1000).toFixed(0)}K+
                </div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">&lt;20ms</div>
                <div className="text-sm text-muted-foreground">Avg Latency</div>
              </CardContent>
            </Card>
          </div>

          {/* Server Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredServers.map((server) => (
              <Card key={server.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {server.city}
                    </CardTitle>
                    <Badge className={getStatusColor(server.status)}>
                      {server.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{server.country}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Latency</div>
                      <div className="font-semibold text-green-600">{server.latency}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Users</div>
                      <div className="font-semibold">{server.users.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Server Load */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Server Load</span>
                      <span className="font-semibold">{server.load}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getLoadColor(server.load)}`}
                        style={{ width: `${server.load}%` }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Features</div>
                    <div className="flex flex-wrap gap-1">
                      {server.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={server.status !== "online"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Connect to {server.city}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Benefits */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Why Choose Our Network?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Maximum Security</h3>
                  <p className="text-sm text-muted-foreground">
                    All servers feature military-grade encryption and zero-log policies
                  </p>
                </div>
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized for speed with dedicated bandwidth and low latency
                  </p>
                </div>
                <div className="text-center">
                  <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Global Coverage</h3>
                  <p className="text-sm text-muted-foreground">
                    Strategically located servers for worldwide accessibility
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Connect Securely?</h3>
            <p className="text-muted-foreground mb-6">
              Experience blazing-fast speeds and rock-solid security on our global network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/services">Start Free Trial</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/contact">Contact Sales</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServerMap;