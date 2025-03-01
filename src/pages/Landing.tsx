
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/dfb369e1-9663-40cb-aff5-a1cbc09fdb7e.png" 
              alt="Headline Studio" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-semibold dark:text-white">Headline Studio</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="hidden sm:flex"
              onClick={() => navigate("/auth")}
            >
              Sign In
            </Button>
            <Button 
              className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
                Generate Better Headlines for Your Content
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Headline Studio helps content creators craft engaging, high-converting headlines that drive traffic and engagement.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 generate-btn text-white"
                  onClick={() => navigate("/auth")}
                >
                  Start Creating Headlines
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">AI-Powered</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">SEO Optimized</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">High Conversion</span>
                </div>
              </div>
            </div>
            <div className="lg:block hidden">
              <img 
                src="/lovable-uploads/970889c0-d032-4978-8ea2-dd0d62dbf139.png" 
                alt="Headline Studio dashboard" 
                className="w-full h-auto rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Everything you need to create engaging headlines</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Zap className="h-6 w-6 text-[#0EA5E9]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI-Powered Generation</h3>
              <p className="text-gray-600 dark:text-gray-300">Generate dozens of headline variations for your content with state-of-the-art AI technology.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <Shield className="h-6 w-6 text-[#0EA5E9]" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">A/B Testing</h3>
              <p className="text-gray-600 dark:text-gray-300">Compare different headline variations to find the ones that perform best with your audience.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                <svg className="h-6 w-6 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">SEO Optimization</h3>
              <p className="text-gray-600 dark:text-gray-300">Create headlines that are optimized for search engines and improve your content's visibility.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0EA5E9] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to create engaging headlines?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Join thousands of content creators who use Headline Studio to improve their content performance.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-[#0EA5E9] hover:bg-gray-100"
            onClick={() => navigate("/auth")}
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <img 
                src="/lovable-uploads/dfb369e1-9663-40cb-aff5-a1cbc09fdb7e.png" 
                alt="Headline Studio" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold dark:text-white">Headline Studio</span>
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} Headline Studio. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
