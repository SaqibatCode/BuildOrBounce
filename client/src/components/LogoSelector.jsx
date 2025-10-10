import React from 'react';
import { Palette, Sparkles, Loader2 } from 'lucide-react';

const LogoSelector = ({ logoOptions, onSelect, isLoading }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Palette className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Official Logo</h2>
        <p className="text-gray-600 text-lg">
          Our AI has generated these logo options. Your choice will define the rest of your brand identity.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* --- CHANGE #1: Renamed 'svgString' to 'imageUrl' for clarity --- */}
        {logoOptions.map((imageUrl, index) => (
          <div
            key={index}
            className="group relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:border-purple-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center overflow-hidden p-4"
            // --- CHANGE #2: Pass the 'imageUrl' to the onSelect function when clicked ---
            onClick={() => !isLoading && onSelect(imageUrl)}
            title={`Select Logo #${index + 1}`}
          >
            {/* --- CHANGE #3: Replaced the div with a proper <img> tag --- */}
            <img 
              src={imageUrl}
              alt={`Logo Option ${index + 1}`}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            {/* Selection Number */}
            <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-purple-50 rounded-full border border-purple-200">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin mr-3" />
            <span className="text-purple-700 font-medium">Finalizing your brand kit...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoSelector;