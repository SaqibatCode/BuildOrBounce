import React from 'react';
import { Palette, Loader2, Eye } from 'lucide-react';

const VisualConceptSelector = ({ concepts, onSelect, isLoading }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Palette className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Visual Direction</h2>
        <p className="text-gray-600 text-lg">
          Our AI has generated these visual concepts for your brand. Select the one that best captures your vision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {concepts.map((base64Image, index) => (
          <div
            key={index}
            className="group relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 hover:border-pink-500 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl overflow-hidden"
            onClick={() => !isLoading && onSelect(index)}
            title={`Select Concept #${index + 1}`}
          >
            <img 
              src={`data:image/png;base64,${base64Image}`} 
              alt={`Visual Concept ${index + 1}`}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
            />
            
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Eye className="w-8 h-8 text-pink-600" />
              </div>
            </div>

            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
              {index + 1}
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-semibold text-gray-900">Concept {index + 1}</p>
                <p className="text-xs text-gray-600">Click to select this style</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-pink-50 rounded-full border border-pink-200">
            <Loader2 className="w-5 h-5 text-pink-600 animate-spin mr-3" />
            <span className="text-pink-700 font-medium">Finalizing your brand kit...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualConceptSelector;