import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How long does a website audit take?",
      answer: "Our AI-powered audit typically completes within 2-5 minutes for most websites. The free audit analyzes up to 10 pages instantly, while the Pro audit can scan unlimited pages and usually finishes within 10-15 minutes depending on your site size."
    },
    {
      question: "What exactly gets analyzed in the audit?",
      answer: "We perform a comprehensive analysis including: broken link detection, page speed optimization, SEO audit, content gap analysis, security vulnerabilities, mobile responsiveness, Core Web Vitals, competitor benchmarking, and market opportunity research."
    },
    {
      question: "Do I need technical knowledge to understand the results?",
      answer: "Not at all! Our reports are designed for business owners, marketers, and non-technical users. We provide clear explanations, prioritized action items, and step-by-step recommendations that anyone can understand and implement."
    },
    {
      question: "Is the free audit really free with no strings attached?",
      answer: "Yes, absolutely! Our free audit provides genuine value with no credit card required. You'll get a real analysis of your first 10 pages including broken links, basic SEO insights, and performance metrics. No trial periods or hidden fees."
    },
    {
      question: "How is this different from other audit tools?",
      answer: "Our AI copilot goes beyond technical scanning. We combine website analysis with market research, competitor insights, and business opportunity identification. Plus, our reports focus on actionable recommendations rather than just technical data dumps."
    },
    {
      question: "Can you audit e-commerce websites?",
      answer: "Absolutely! We have specialized algorithms for e-commerce sites including product page optimization, checkout flow analysis, conversion optimization opportunities, and e-commerce specific SEO recommendations."
    },
    {
      question: "What happens after I get my audit report?",
      answer: "You'll receive a detailed PDF report with prioritized action items. Pro audit customers also get follow-up email support and can schedule a consultation call to discuss implementation strategies. We're here to help you succeed, not just audit."
    },
    {
      question: "How often should I audit my website?",
      answer: "We recommend monthly audits for actively growing businesses, quarterly for established sites, and immediately after any major website changes. Regular audits help you stay ahead of issues and continuously optimize your online presence."
    }
  ];

  return (
    <section className="py-20 px-6 bg-secondary border-t border-border">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-manrope text-foreground mb-6">
            Frequently asked <span className="text-community-blue">questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know about our AI-powered website auditing service.
          </p>
        </div>

        <div className="animate-fade-in">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 hover:border-community-blue/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-manrope font-semibold text-card-foreground hover:text-community-blue transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;