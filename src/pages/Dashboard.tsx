import { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Navigation } from "@/components/layout/Navigation";
import { 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  RefreshCw,
  TrendingUp,
  FileText,
  Users,
  ArrowLeft
} from "lucide-react";

export default function Dashboard() {
  const { scanId } = useParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (!scanId) {
    return <Navigate to="/scan" replace />;
  }

  // Fetch scan data
  const { data: scan, isLoading: scanLoading, refetch: refetchScan } = useQuery({
    queryKey: ['scan', scanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', scanId)
        .single();
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 3000
  });

  // Fetch pages with suggestions
  const { data: pages } = useQuery({
    queryKey: ['pages', scanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select(`
          *,
          page_suggestions (*)
        `)
        .eq('scan_id', scanId);
      
      if (error) throw error;
      return data;
    },
    enabled: scan?.status === 'completed'
  });

  // Fetch market insights
  const { data: marketInsights } = useQuery({
    queryKey: ['market_insights', scanId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_insights')
        .select('*')
        .eq('scan_id', scanId);
      
      if (error) throw error;
      return data;
    },
    enabled: scan?.status === 'completed'
  });

  const runAnalysis = async () => {
    try {
      await supabase.functions.invoke('analyze-content', {
        body: { scanId }
      });
      
      await supabase.functions.invoke('market-research', {
        body: { scanId }
      });

      toast({
        title: "Analysis Started",
        description: "Content analysis and market research are running in the background"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start analysis",
        variant: "destructive"
      });
    }
  };

  if (scanLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading scan data...</p>
        </div>
      </div>
    );
  }

  if (!scan) {
    return <Navigate to="/scan" replace />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'failed': return 'destructive';
      case 'pending': 
      case 'crawling': 
      case 'analyzing': return 'secondary';
      default: return 'secondary';
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'crawling': return 40;
      case 'analyzing': return 80;
      case 'completed': return 100;
      case 'failed': return 0;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Website Audit</h1>
                <p className="text-muted-foreground text-sm sm:text-base truncate">{scan.url}</p>
              </div>
            </div>
            <Badge variant={getStatusColor(scan.status)} className="text-sm flex-shrink-0 self-start sm:self-center">
              {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
            </Badge>
          </div>
          
          {scan.status !== 'completed' && scan.status !== 'failed' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm text-muted-foreground">{getProgress(scan.status)}%</span>
              </div>
              <Progress value={getProgress(scan.status)} className="w-full" />
            </div>
          )}

          {scan.status === 'completed' && (!pages?.some(p => p.page_suggestions?.length > 0) || !marketInsights?.length) && (
            <div className="mt-4 p-4 bg-card rounded-lg border border-primary/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-medium">Ready for Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Run AI analysis for content suggestions and market research
                  </p>
                </div>
                <Button onClick={runAnalysis} size="sm" className="self-start sm:self-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Start Analysis
                </Button>
              </div>
            </div>
          )}
        </div>

        {scan.status === 'failed' && (
          <Card className="mb-8 border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Scan Failed</span>
              </div>
              <p className="mt-2 text-sm">{scan.error || 'Unknown error occurred'}</p>
            </CardContent>
          </Card>
        )}

        {scan.status === 'completed' && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 grid-rows-2' : 'grid-cols-4'}`}>
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                {isMobile ? 'Overview' : 'Overview'}
              </TabsTrigger>
              <TabsTrigger value="content" className="text-xs sm:text-sm">
                {isMobile ? 'Content' : 'Content Analysis'}
              </TabsTrigger>
              <TabsTrigger value="market" className="text-xs sm:text-sm">
                {isMobile ? 'Market' : 'Market Research'}
              </TabsTrigger>
              <TabsTrigger value="pages" className="text-xs sm:text-sm">
                {isMobile ? 'Pages' : 'Page Details'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pages Crawled</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pages?.length || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pages Analyzed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {pages?.filter(p => p.page_suggestions?.length > 0).length || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Market Insights</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{marketInsights?.length || 0}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {pages?.filter(p => p.page_suggestions?.length > 0).map((page) => (
                <Card key={page.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-base sm:text-lg line-clamp-2 min-w-0">
                        {page.title || page.url}
                      </CardTitle>
                      <Button variant="outline" size="sm" asChild className="self-start sm:self-center flex-shrink-0">
                        <a href={page.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {page.page_suggestions?.map((suggestion: any) => (
                      <div key={suggestion.id} className="space-y-3">
                        {suggestion.suggestions.overall_score && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Overall Score:</span>
                            <Badge variant="secondary">{suggestion.suggestions.overall_score}/100</Badge>
                          </div>
                        )}
                        
                        {Object.entries(suggestion.suggestions).map(([category, items]: [string, any]) => {
                          if (category === 'overall_score' || !Array.isArray(items)) return null;
                          
                          return (
                            <div key={category}>
                              <h4 className="font-medium text-sm text-primary mb-2 capitalize">
                                {category.replace('_', ' ')}
                              </h4>
                              <ul className="space-y-1">
                                {items.map((item: string, index: number) => (
                           <li key={index} className="text-sm text-muted-foreground flex items-start">
                                     <span className="text-primary mr-2 flex-shrink-0">•</span>
                                     <span className="break-words">{item}</span>
                                   </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {!pages?.some(p => p.page_suggestions?.length > 0) && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No content analysis available yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              {marketInsights?.map((insight) => (
                <Card key={insight.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Market Research Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 overflow-hidden">
                    {Object.entries(insight.insights).map(([category, data]: [string, any]) => (
                      <div key={category} className="overflow-hidden">
                        <h4 className="font-medium text-sm text-primary mb-2 capitalize break-words">
                          {category.replace('_', ' ')}
                        </h4>
                        {Array.isArray(data) ? (
                          <ul className="space-y-1">
                            {data.map((item: any, index: number) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start">
                                <span className="text-primary mr-2 flex-shrink-0">•</span>
                                <span className="break-words overflow-hidden">
                                  {typeof item === 'string' ? item : JSON.stringify(item)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground break-words overflow-hidden">{String(data)}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {!marketInsights?.length && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No market insights available yet</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <div className="grid gap-4">
                {pages?.map((page) => (
                  <Card key={page.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <CardTitle className="text-sm sm:text-base line-clamp-2 min-w-0">
                          {page.title || 'Untitled'}
                        </CardTitle>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge variant={page.status_code === 200 ? 'default' : 'destructive'}>
                            {page.status_code}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <a href={page.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-all">{page.url}</p>
                      {page.content && (
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">
                          {page.content.substring(0, 200)}...
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!pages?.length && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No pages found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}