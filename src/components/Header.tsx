
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 glass-effect border-b' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="text-xl font-medium">
            Seamless<span className="text-primary">UI</span>
          </a>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="nav-link">Features</a>
          <a href="#testimonials" className="nav-link">Testimonials</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <a href="#contact" className="button-primary">
            Get Started
          </a>
        </div>

        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col h-full p-6 bg-background shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="text-xl font-medium">
              Seamless<span className="text-primary">UI</span>
            </a>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-6">
            <a href="#features" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#testimonials" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Testimonials
            </a>
            <a href="#contact" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Contact
            </a>
            <a href="#pricing" className="text-lg" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
          </nav>
          <div className="mt-auto pt-6">
            <a 
              href="#contact" 
              className="button-primary w-full justify-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
