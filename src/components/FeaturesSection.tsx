import React from 'react';
import { Search, Link, Target, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Site Scanning',
      description: 'Comprehensive analysis of your entire website structure, performance, and user experience in minutes.',
      delay: 0
    },
    {
      icon: Link,
      title: 'Broken Link Detection',
      description: 'Instantly identify and report all broken internal and external links that hurt your SEO and user experience.',
      delay: 0.1
    },
    {
      icon: Target,
      title: 'Content Gap Analysis',
      description: 'Discover missing content opportunities and gaps in your content strategy compared to competitors.',
      delay: 0.2
    },
    {
      icon: TrendingUp,
      title: 'Market Research',
      description: 'Deep dive into your market landscape and uncover untapped opportunities for growth.',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'Security Audit',
      description: 'Comprehensive security scanning to identify vulnerabilities and protect your digital assets.',
      delay: 0.4
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Get actionable insights to improve site speed, Core Web Vitals, and overall performance.',
      delay: 0.5
    },
  ];

  return (
    <section className="relative py-20 px-6 bg-background border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-2xl text-left sm:text-center mb-16"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-manrope text-foreground mb-6 tracking-tight">
              Everything you need to <span className="text-community-blue">optimize</span> your website
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our AI copilot provides comprehensive website analysis and actionable insights to improve your online presence.
            </p>
          </div>
          <div
            className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            style={{
              background: 'linear-gradient(152.92deg, hsl(var(--primary) / 0.2) 4.54%, hsl(var(--primary) / 0.26) 34.2%, hsl(var(--primary) / 0.1) 77.55%)',
            }}
          />
        </motion.div>
        <hr className="bg-border mx-auto mb-12 h-px w-1/2" />
        <div className="relative">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: feature.delay,
                  ease: [0.4, 0, 0.2, 1]
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="transform-gpu space-y-3 rounded-xl border border-border bg-card p-6 shadow-card backdrop-blur-sm"
                style={{
                  boxShadow: '0 -20px 80px -20px hsl(var(--primary) / 0.1) inset'
                }}
              >
                <div 
                  className="w-fit transform-gpu rounded-full border border-border p-4 text-primary bg-primary/5"
                  style={{
                    boxShadow: '0 -20px 80px -20px hsl(var(--primary) / 0.15) inset'
                  }}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-manrope text-xl font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;