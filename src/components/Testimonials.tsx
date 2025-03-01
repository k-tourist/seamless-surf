
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

type Testimonial = {
  id: number;
  content: string;
  author: string;
  role: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "This design system has completely transformed our workflow. The components are intuitive and the documentation is exceptional.",
    author: "Alex Morgan",
    role: "Product Designer",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    content: "I've tried many UI libraries, but Seamless UI stands out. It's clean, modern, and incredibly easy to use.",
    author: "Sam Chen",
    role: "Frontend Developer",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    content: "The attention to detail in this design system is impressive. Every component feels thoughtfully designed.",
    author: "Taylor Wilson",
    role: "UX Researcher",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="card p-6 md:p-8 h-full flex flex-col">
      <Quote className="h-8 w-8 text-primary/40 mb-4" />
      <p className="text-lg mb-6 flex-grow">{testimonial.content}</p>
      <div className="flex items-center">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.author} 
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-medium">{testimonial.author}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
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
    <section id="testimonials" className="py-20 opacity-0 transition-opacity duration-1000" ref={sectionRef}>
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary-foreground mb-4">
            Testimonials
          </div>
          <h2 className="mb-4">What people are saying</h2>
          <p className="text-muted-foreground text-lg">
            Hear from the designers and developers who have used our design system.
          </p>
        </div>
        
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
        
        <div className="md:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="min-w-full px-4">
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-4">
              <button 
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
