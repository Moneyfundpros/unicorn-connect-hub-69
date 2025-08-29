import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/layout/Navigation";
import { Loader2, Search } from "lucide-react";

export default function Scan() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast({
        title: "Error", 
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    // User is already authenticated through ProtectedRoute

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('start-scan', {
        body: { 
          url: url.startsWith('http') ? url : `https://${url}` 
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Scan Started",
          description: "Your website audit is now in progress",
        });
        navigate(`/dashboard/${data.scanId}`);
      } else {
        throw new Error(data.error || 'Failed to start scan');
      }

    } catch (error) {
      console.error('Error starting scan:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start website scan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto">

          {/* Main Card */}
          <Card className="border border-border shadow-lg">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="space-y-3">
                  <label htmlFor="url" className="text-base font-medium text-foreground block">
                    Website URL
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    <Input
                      id="url"
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-base sm:text-lg"
                      placeholder="example.com or https://example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                      Starting Analysis...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Start Website Audit
                    </>
                  )}
                </Button>
              </form>

              {/* Features Grid */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Content Analysis</h3>
                      <p className="text-sm text-muted-foreground">AI-powered content quality assessment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Link Detection</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive broken link scanning</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:col-span-2 lg:col-span-1">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Market Research</h3>
                      <p className="text-sm text-muted-foreground">Competitive analysis and insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Info */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg py-3 px-4 sm:px-6 inline-block">
              ⏱️ Analysis typically takes 2-5 minutes depending on website size
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}