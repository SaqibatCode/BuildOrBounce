import React from 'react';
import { Globe, Check, X, Sparkles } from 'lucide-react';

const TldBadge = ({ tld, available }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
    available 
      ? 'bg-green-100 text-green-800 border border-green-200' 
      : 'bg-red-100 text-red-800 border border-red-200'
  }`}>
    {available ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
    .{tld}
  </span>
);

const DomainSelector = ({ suggestions, onSelect, loadingSelection }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Project Name & Domain</h2>
        <p className="text-gray-600 text-lg">Here are AI-generated names. Green badges show available domains!</p>
      </div>
      
      <div className="space-y-4">
        {suggestions.map(({ name, availability }) => (
          <div 
            key={name} 
            className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">{name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TldBadge tld="com" available={availability.com} />
                  <TldBadge tld="co" available={availability.co} />
                  <TldBadge tld="io" available={availability.io} />
                </div>
              </div>
              
              <button
                onClick={() => onSelect(name + (availability.com ? '.com' : availability.co ? '.co' : '.io'))}
                disabled={!availability.com && !availability.co && !availability.io || loadingSelection}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-lg"
              >
                {loadingSelection ? 'Selecting...' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainSelector;