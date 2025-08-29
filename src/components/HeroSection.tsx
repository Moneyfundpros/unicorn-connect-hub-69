
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const HeroSection = () => {

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/lovable-uploads/f2bd40e2-5811-42ee-b513-1893b5489b47.png)'
        }}
      />

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Background decoration dots - changed to blue */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300/50 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-blue-300/45 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-start mt-36 px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-manrope leading-tight mb-6">
            AI-Powered Website<br />
            <span className="text-community-blue">Audit Copilot</span><br />
            for Modern<br />
            <span className="text-community-blue">Businesses</span>
          </h1>
          
          <p className="text-lg text-white/80 font-manrope max-w-2xl mx-auto mb-8 leading-relaxed">
            Instantly scan your site, detect broken links, identify content gaps,<br />
            and discover market opportunities with AI precision.
          </p>
          
          <div className="flex justify-center">
            <HoverBorderGradient
              containerClassName="font-manrope text-base group"
              className="inline-flex items-center gap-2 px-8 py-3"
            >
              Start Free Audit
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </HoverBorderGradient>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
