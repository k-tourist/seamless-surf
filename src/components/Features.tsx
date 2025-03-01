
import React, { useEffect, useRef } from 'react';
import { Smartphone, Monitor, Moon, Zap, Shield, LayoutGrid } from 'lucide-react';

const FeatureCard = ({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) => {
  return (
    <div className={`card p-6 opacity-0 animate-fade-in animate-delay-${delay}`}>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.card');
            elements.forEach((el) => {
              el.classList.add('opacity-100');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section id="features" className="py-20 md:py-32 bg-secondary/50" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary-foreground mb-4">
            Features
          </div>
          <h2 className="mb-4">Designed for everyone</h2>
          <p className="text-muted-foreground text-lg">
            Our platform offers intuitive features that help you create stunning interfaces with ease.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Smartphone className="h-6 w-6 text-primary" />}
            title="Responsive Design"
            description="Create interfaces that work seamlessly across all devices and screen sizes."
            delay={1}
          />
          <FeatureCard
            icon={<Monitor className="h-6 w-6 text-primary" />}
            title="Beautiful Components"
            description="Pre-built components that are easy to customize and integrate into your projects."
            delay={2}
          />
          <FeatureCard
            icon={<Moon className="h-6 w-6 text-primary" />}
            title="Dark Mode Support"
            description="Built-in support for light and dark modes to enhance user experience."
            delay={3}
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Performance First"
            description="Optimized for speed and performance with minimal bundle size."
            delay={4}
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Accessibility"
            description="ARIA-compliant components that ensure your application is accessible to all."
            delay={5}
          />
          <FeatureCard
            icon={<LayoutGrid className="h-6 w-6 text-primary" />}
            title="Flexible Layouts"
            description="Create complex layouts with ease using our intuitive grid system."
            delay={6}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
