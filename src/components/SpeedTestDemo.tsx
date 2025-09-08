import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Wifi, 
  Shield, 
  Clock, 
  TrendingUp,
  CheckCircle,
  X
} from "lucide-react";

interface SpeedTestResult {
  download: number;
  upload: number;
  ping: number;
  provider: string;
}

const SpeedTestDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<"without" | "with" | null>(null);
  const [results, setResults] = useState<{
    without?: SpeedTestResult;
    with?: SpeedTestResult;
  }>({});

  // Simulated speed test results
  const simulatedResults = {
    without: {
      download: 45.3,
      upload: 12.8,
      ping: 89,
      provider: "Regular ISP"
    },
    with: {
      download: 127.6,
      upload: 43.2,
      ping: 23,
      provider: "Hardline Connect"
    }
  };

  const runSpeedTest = async (type: "without" | "with") => {
    setIsRunning(true);
    setCurrentTest(type);
    setProgress(0);

    // Simulate progress
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(progressInterval);
          setResults(prev => ({
            ...prev,
            [type]: simulatedResults[type]
          }));
          setIsRunning(false);
          setCurrentTest(null);
          return 100;
        }
        return next;
      });
    }, interval);
  };

  const runBothTests = async () => {
    await runSpeedTest("without");
    setTimeout(() => runSpeedTest("with"), 1000);
  };

  const resetTests = () => {
    setResults({});
    setProgress(0);
  };

  const getImprovementPercent = (metric: keyof Omit<SpeedTestResult, 'provider'>) => {
    const { without: w, with: withHardline } = results;
    if (!w || !withHardline) return 0;
    
    if (metric === 'ping') {
      // Lower ping is better
      return Math.round(((w[metric] - withHardline[metric]) / w[metric]) * 100);
    }
    return Math.round(((withHardline[metric] - w[metric]) / w[metric]) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Zap className="h-6 w-6" />
            Speed Test Demo
          </CardTitle>
          <p className="text-muted-foreground">
            See the difference Hardline Connect makes to your internet speed
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => runSpeedTest("without")}
              variant="outline"
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Test Without Hardline
            </Button>
            <Button 
              onClick={() => runSpeedTest("with")}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Test With Hardline
            </Button>
            <Button 
              onClick={runBothTests}
              variant="secondary"
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Run Comparison
            </Button>
          </div>

          {/* Progress Bar */}
          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Testing {currentTest === "with" ? "with" : "without"} Hardline Connect...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Without Hardline */}
            <Card className={`${results.without ? 'border-red-200 bg-red-50/50' : 'border-dashed opacity-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wifi className="h-5 w-5 text-red-500" />
                  Regular Connection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.without ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {results.without.download}
                        </div>
                        <div className="text-xs text-muted-foreground">Mbps Down</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {results.without.upload}
                        </div>
                        <div className="text-xs text-muted-foreground">Mbps Up</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {results.without.ping}ms
                        </div>
                        <div className="text-xs text-muted-foreground">Ping</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-full justify-center">
                      {results.without.provider}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Run test to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* With Hardline */}
            <Card className={`${results.with ? 'border-green-200 bg-green-50/50' : 'border-dashed opacity-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-green-500" />
                  With Hardline Connect
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.with ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {results.with.download}
                        </div>
                        <div className="text-xs text-muted-foreground">Mbps Down</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {results.with.upload}
                        </div>
                        <div className="text-xs text-muted-foreground">Mbps Up</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {results.with.ping}ms
                        </div>
                        <div className="text-xs text-muted-foreground">Ping</div>
                      </div>
                    </div>
                    <Badge className="w-full justify-center bg-green-600">
                      {results.with.provider}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Run test to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Improvement Summary */}
          {results.without && results.with && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-green-700">
                    Significant Performance Improvement!
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      +{getImprovementPercent('download')}%
                    </div>
                    <div className="text-sm text-muted-foreground">Faster Downloads</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      +{getImprovementPercent('upload')}%
                    </div>
                    <div className="text-sm text-muted-foreground">Faster Uploads</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      -{getImprovementPercent('ping')}%
                    </div>
                    <div className="text-sm text-muted-foreground">Lower Latency</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center gap-4">
                  <Button onClick={resetTests} variant="outline" size="sm">
                    Reset Test
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/services">Get These Speeds</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            * Results are simulated for demonstration purposes. Actual speeds may vary based on your connection and location.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeedTestDemo;