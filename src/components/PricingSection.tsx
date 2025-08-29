import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 5 website audits per month",
        "Basic SEO recommendations",
        "Broken link detection",
        "Email support",
        "Basic reporting"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Ideal for growing businesses and agencies",
      features: [
        "Up to 25 website audits per month",
        "Advanced AI-powered insights",
        "Competitor analysis",
        "Priority support",
        "Custom reporting",
        "API access",
        "White-label reports"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited website audits",
        "Custom AI training",
        "Dedicated account manager",
        "24/7 phone support",
        "Advanced integrations",
        "Custom features",
        "SLA guarantee"
      ],
      highlighted: false
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-manrope text-foreground mb-6 tracking-tight">
            Choose Your <span className="text-community-blue">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Start with our free audit, then choose the plan that scales with your business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${plan.highlighted ? 'border-community-blue scale-105' : 'border-border'} transition-all hover:scale-105`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-community-blue text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-manrope text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-community-blue flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-community-blue hover:bg-community-blue/90' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <Button variant="ghost" className="text-community-blue hover:text-community-blue/90">
            Compare all features →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;