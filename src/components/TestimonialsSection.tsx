import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "This audit tool saved us months of manual work. Found critical issues we missed and provided clear action steps. Our site performance improved by 40% after implementing their recommendations."
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "GrowthLab",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "The market research insights were game-changing. We discovered new content opportunities that led to a 60% increase in organic traffic within 3 months."
    },
    {
      name: "Emily Rodriguez",
      role: "Digital Marketing Manager",
      company: "InnovateCorp",
      image: "/api/placeholder/64/64",
      rating: 5,
      text: "Best investment we made this year. The broken link detection alone saved us from losing potential customers. The content gap analysis opened our eyes to new opportunities."
    }
  ];

  return (
    <section className="py-20 px-6 bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-manrope text-foreground mb-6">
            What our <span className="text-community-blue">clients say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of businesses that have transformed their online presence with our AI-powered audits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-8 animate-fade-in hover:border-community-blue/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <Quote className="w-8 h-8 text-community-blue mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-community-blue text-community-blue" />
                  ))}
                </div>
                <p className="text-card-foreground leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-community-blue/10 rounded-full flex items-center justify-center">
                  <span className="text-community-blue font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;