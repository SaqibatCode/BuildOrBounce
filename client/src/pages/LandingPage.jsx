import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Target, Palette, Globe, MessageSquare, Star, ArrowDown, Play, CheckCircle, Sparkles, Rocket, Users, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
          }}
        />
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl animate-pulse"
          style={{
            right: mousePosition.x / 15,
            bottom: mousePosition.y / 15,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center z-10">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
              AI-Powered Startup Validation
              <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-8 leading-tight">
            From Idea to
            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Live MVP
            </span>
            <span className="block text-4xl md:text-6xl mt-4">in Minutes</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your AI co-founder that validates ideas, generates brands, and builds websites instantly. 
            <span className="text-cyan-300 font-semibold"> No coding required.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              to="/register" 
              className="group px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-full text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 flex items-center"
            >
              Start Building for Free
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold rounded-full text-lg hover:bg-white/20 transition-all duration-300 flex items-center">
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/60">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-1" />
              <span className="text-sm">1000+ Ideas Validated</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-1" />
              <span className="text-sm">500+ MVPs Launched</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-white/50" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              Your AI-Powered
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Workflow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From validation to deployment, we handle everything so you can focus on what matters most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Instant Validation",
                description: "Our AI analyzes market potential, competition, and feasibility in seconds",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: Palette,
                title: "Brand Generation", 
                description: "Get professional logos, color palettes, and complete brand kits",
                color: "from-purple-500 to-indigo-500"
              },
              {
                icon: Globe,
                title: "Website Creation",
                description: "Generate responsive, modern websites ready for deployment",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: MessageSquare,
                title: "AI Business Coach",
                description: "24/7 strategic guidance from your personal AI advisor",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Go from idea to deployed MVP in under 30 minutes",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Rocket,
                title: "Ready to Launch",
                description: "Get hosting guides and deployment instructions",
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-16">
            Trusted by <span className="text-cyan-400">Innovators</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Ideas Validated", icon: Target },
              { number: "500+", label: "MVPs Launched", icon: Rocket },
              { number: "98%", label: "Success Rate", icon: TrendingUp },
              { number: "2M+", label: "Users Reached", icon: Users }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <stat.icon className="w-12 h-12 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-black text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              How It <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-600">Three simple steps to your next big thing</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform -translate-y-1/2" />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  step: "01",
                  title: "Submit Your Idea",
                  description: "Tell us about your startup idea and target market. Our AI will instantly analyze its potential.",
                  icon: "💡"
                },
                {
                  step: "02", 
                  title: "Get Your Brand",
                  description: "Receive a complete brand kit with logo, colors, fonts, and business cards ready for use.",
                  icon: "🎨"
                },
                {
                  step: "03",
                  title: "Launch Your MVP",
                  description: "Download your fully functional website and deploy it with our step-by-step hosting guide.",
                  icon: "🚀"
                }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <span className="text-3xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-black text-gray-900">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-6">
              What <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Builders</span> Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Build or Bounce saved me months of work. From idea to deployed website in 20 minutes!",
                author: "Sarah Chen",
                role: "Founder, TechFlow",
                avatar: "👩‍💼"
              },
              {
                quote: "The AI validation was spot-on. It identified market gaps I hadn't even considered.",
                author: "Marcus Rodriguez", 
                role: "Serial Entrepreneur",
                avatar: "👨‍💻"
              },
              {
                quote: "The brand kit quality is incredible. Saved thousands on design work.",
                author: "Emily Thompson",
                role: "Startup Founder",
                avatar: "👩‍🎨"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-6xl mb-4">{testimonial.avatar}</div>
                <blockquote className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-purple-600 font-medium">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
            Ready to Build Your
            <span className="block bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Next Big Thing?
            </span>
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who've turned their ideas into reality with Build or Bounce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/register" 
              className="group px-12 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-full text-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 flex items-center"
            >
              Start Building Now
              <Rocket className="ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="px-12 py-5 bg-white/10 backdrop-blur-lg border-2 border-white/20 text-white font-semibold rounded-full text-xl hover:bg-white/20 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-12 text-white/60 text-sm">
            No credit card required • Free forever plan • Launch in minutes
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;