import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { 
  Globe, 
  FileText, 
  TrendingUp, 
  Clock,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MainDashboard() {
  const navigate = useNavigate();

  // Fetch user's scans
  const { data: scans = [], isLoading } = useQuery({
    queryKey: ['user-scans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch overall statistics
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: allScans, error: scansError } = await supabase
        .from('scans')
        .select('id, status');
      
      if (scansError) throw scansError;

      const { data: allPages, error: pagesError } = await supabase
        .from('pages')
        .select('id, scan_id');
      
      if (pagesError) throw pagesError;

      const { data: suggestions, error: suggestionsError } = await supabase
        .from('page_suggestions')
        .select('id');
      
      if (suggestionsError) throw suggestionsError;

      const totalScans = allScans.length;
      const completedScans = allScans.filter(s => s.status === 'completed').length;
      const totalPages = allPages.length;
      const analyzedPages = suggestions.length;

      return {
        totalScans,
        completedScans,
        totalPages,
        analyzedPages,
        successRate: totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 0
      };
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your website audits.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/scan')} size="lg" className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Start New Scan
            </Button>
            <Button 
              onClick={() => navigate('/history')} 
              variant="outline" 
              size="lg"
              className="flex items-center"
            >
              <Clock className="mr-2 h-5 w-5" />
              View All History
            </Button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalScans || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.completedScans || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.successRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Successful scans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pages Analyzed</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalPages || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.analyzedPages || 0} with insights
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.analyzedPages || 0}</div>
              <p className="text-xs text-muted-foreground">
                Generated reports
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Scans</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {scans.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No scans yet</p>
                <Button onClick={() => navigate('/scan')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Your First Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      {getStatusIcon(scan.status)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{scan.url}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge variant={getStatusColor(scan.status)}>
                        {scan.status}
                      </Badge>
                      {scan.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/${scan.id}`)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium">🚀 Optimize Your Scans</p>
                <p className="text-muted-foreground">
                  Run regular scans to track improvements and catch issues early.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">📊 Use Market Insights</p>
                <p className="text-muted-foreground">
                  Leverage AI-powered market research to stay ahead of competitors.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">🔍 Deep Analysis</p>
                <p className="text-muted-foreground">
                  Review detailed page suggestions to improve content quality.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">📈 Track Progress</p>
                <p className="text-muted-foreground">
                  Compare scan results over time to measure improvements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}