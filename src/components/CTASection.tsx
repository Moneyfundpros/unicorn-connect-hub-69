import React from 'react';
import { ArrowRight, CheckCircle, Sparkles, Zap } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Button } from '@/components/ui/button';

const CTASection = () => {
  const benefits = [
    "Get results in under 5 minutes",
    "No credit card required for free audit",
    "Actionable insights, not just data",
    "Used by 10,000+ businesses worldwide"
  ];

  return (
    <section className="py-32 px-6 bg-background border-t border-border relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-3 h-3 bg-community-blue/30 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-community-blue/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-4 h-4 bg-community-blue/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-community-blue/30 rounded-full animate-pulse delay-500"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-community-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-community-blue/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-community-blue/10 border border-community-blue/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-community-blue" />
            <span className="text-community-blue font-medium">Join 10,000+ Growing Businesses</span>
          </div>

          {/* Main heading */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-manrope text-foreground leading-tight mb-8">
            Ready to <span className="relative">
              <span className="text-community-blue">transform</span>
              <div className="absolute -inset-2 bg-community-blue/20 blur-xl rounded-lg -z-10"></div>
            </span><br />
            your website?
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover hidden opportunities, fix critical issues, and unlock your website's full potential with our AI-powered audit system.
          </p>

          {/* Benefits grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 bg-card/50 border border-border rounded-xl p-4 animate-fade-in hover:bg-card transition-colors"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-8 h-8 bg-community-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-community-blue" />
                </div>
                <span className="text-foreground font-medium text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-8">
            <HoverBorderGradient
              containerClassName="font-manrope text-xl group"
              className="inline-flex items-center gap-4 px-12 py-6"
            >
              <Zap className="w-6 h-6" />
              Start Your Free Audit Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-12 py-6 border-community-blue/30 text-community-blue hover:bg-community-blue/10 hover:border-community-blue"
            >
              Watch Demo (2 min)
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Free audit includes: Site scanning • Broken link detection • SEO analysis</span>
            </div>
          </div>

          {/* Results preview */}
          <div className="mt-16 bg-card/30 border border-border rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-manrope text-foreground mb-6">What you'll get in your audit:</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-community-blue/20 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-community-blue" />
                </div>
                <h4 className="font-semibold text-foreground">Technical Health</h4>
                <p className="text-sm text-muted-foreground">Broken links, page speed, mobile responsiveness</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-community-blue/20 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-community-blue" />
                </div>
                <h4 className="font-semibold text-foreground">Content Opportunities</h4>
                <p className="text-sm text-muted-foreground">Gap analysis, keyword research, competitor insights</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-community-blue/20 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-community-blue" />
                </div>
                <h4 className="font-semibold text-foreground">Action Plan</h4>
                <p className="text-sm text-muted-foreground">Prioritized recommendations, step-by-step guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;