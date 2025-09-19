import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-16 px-4 mb-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl mr-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div className="p-4 bg-white/20 backdrop-blur-lg rounded-2xl">
            <Zap className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
          Build or Bounce
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-medium">
          Your AI-Powered Co-Founder
        </p>
        <div className="mt-8 inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-white text-sm font-medium">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
          Transforming Ideas into Reality
        </div>
      </div>
    </header>
  );
};

export default Header;