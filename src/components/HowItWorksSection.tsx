import React, { useState, useEffect } from 'react';
import { Globe, Brain, FileText, Rocket } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Globe className="text-community-blue h-6 w-6" />,
      title: "Enter Your URL",
      description: "Simply paste your website URL and let our AI start the comprehensive analysis process."
    },
    {
      icon: <Brain className="text-community-blue h-6 w-6" />,
      title: "AI Analysis", 
      description: "Our advanced AI scans every page, analyzes content, checks technical aspects, and researches your market."
    },
    {
      icon: <FileText className="text-community-blue h-6 w-6" />,
      title: "Detailed Report",
      description: "Receive a comprehensive audit report with actionable insights, prioritized recommendations, and competitive analysis."
    },
    {
      icon: <Rocket className="text-community-blue h-6 w-6" />,
      title: "Implement & Grow",
      description: "Follow our step-by-step action plan to optimize your website and accelerate your business growth."
    }
  ];

  return (
    <section className="py-20 px-6 bg-background border-t border-border">
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative mx-auto mb-12 max-w-2xl text-center">
          <div className="relative z-10 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-manrope text-foreground mb-6 tracking-tight">
              How it <span className="text-community-blue">works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Get comprehensive website insights in just 4 simple steps. No technical expertise required.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px] opacity-30"
            style={{
              background: 'var(--community-gradient)',
            }}
          />
        </div>
        <hr className="bg-border mx-auto mb-10 h-px w-1/2" />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-community-blue/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-community-blue/20 transition-colors">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-community-blue text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-manrope text-foreground font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;