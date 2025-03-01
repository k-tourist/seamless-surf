
import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      className="relative min-h-screen flex items-center pt-24 opacity-0 transition-opacity duration-1000"
      ref={heroRef}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>
      
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-6 opacity-0 animate-fade-in">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Introducing Seamless UI
            </div>
            
            <h1 className="opacity-0 animate-fade-in animate-delay-1">
              Design that speaks through 
              <span className="text-primary"> simplicity</span>
            </h1>
            
            <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-md opacity-0 animate-fade-in animate-delay-2">
              Create stunning interfaces with our intuitive design system that puts user experience first.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 opacity-0 animate-fade-in animate-delay-3">
              <a href="#features" className="button-primary">
                Explore Features
                <ChevronRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#contact" className="button-secondary">
                Contact Us
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl opacity-0 animate-fade-in animate-delay-4">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Person using a MacBook Pro" 
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-primary rounded-full opacity-0 animate-fade-in animate-delay-5 animate-float"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary rounded-full opacity-0 animate-fade-in animate-delay-6 animate-float"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
