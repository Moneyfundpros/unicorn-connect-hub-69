import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/layout/Navigation";
import { useNavigate } from "react-router-dom";
import { 
  Globe, 
  Search, 
  Filter,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Activity,
  Calendar,
  Trash2,
  Eye
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user's scans with pagination
  const { data: scansData, isLoading } = useQuery({
    queryKey: ['all-scans', searchTerm, statusFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('scans')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.ilike('url', `%${searchTerm}%`);
      }
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        scans: data || [],
        count: count || 0
      };
    }
  });

  const totalPages = Math.ceil((scansData?.count || 0) / ITEMS_PER_PAGE);

  const deleteScan = async (scanId: string) => {
    try {
      const { error } = await supabase
        .from('scans')
        .delete()
        .eq('id', scanId);
      
      if (error) throw error;
      
      // Refetch data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting scan:', error);
    }
  };

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
            <p>Loading scan history...</p>
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
          <h1 className="text-3xl font-bold mb-2">Scan History</h1>
          <p className="text-muted-foreground">
            View and manage all your website audits
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="crawling">Crawling</SelectItem>
                  <SelectItem value="analyzing">Analyzing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {scansData?.count || 0} Scan{(scansData?.count || 0) !== 1 ? 's' : ''}
              </CardTitle>
              <Button onClick={() => navigate('/scan')} size="sm">
                New Scan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!scansData?.scans.length ? (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-xl font-medium mb-2">No scans found</p>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? "Try adjusting your filters" 
                    : "Start your first website audit"
                  }
                </p>
                <Button onClick={() => navigate('/scan')}>
                  Start New Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {scansData.scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      {getStatusIcon(scan.status)}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium truncate">{scan.url}</p>
                          <Badge variant={getStatusColor(scan.status)} className="text-xs">
                            {scan.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</span>
                          </div>
                          <span>•</span>
                          <span>Scan ID: {scan.id.slice(0, 8)}...</span>
                        </div>
                        {scan.error && (
                          <p className="text-sm text-destructive mt-1 truncate">
                            Error: {scan.error}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {scan.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dashboard/${scan.id}`)}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteScan(scan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}