import React from 'react';
import { Palette, Download, ExternalLink } from 'lucide-react';

const ColorSwatch = ({ color, name }) => (
  <div className="text-center group">
    <div 
      className="w-20 h-20 rounded-full border-4 border-white shadow-lg mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
      style={{ backgroundColor: color }}
    />
    <p className="font-bold text-gray-900 text-sm">{name}</p>
    <p className="text-gray-600 text-xs font-mono">{color}</p>
  </div>
);

const BrandKitDisplay = ({ brandKit }) => {
  if (!brandKit) return null;

  const { palette, fonts, logoSvg } = brandKit;
  const fontLink = `https://fonts.googleapis.com/css2?family=${fonts.heading.replace(' ', '+')}:wght@700&family=${fonts.body.replace(' ', '+')}:wght@400&display=swap`;
  const fullBusinessCardUrl = `${import.meta.env.VITE_API_BASE_URL}${brandKit.businessCardUrl}`;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <link href={fontLink} rel="stylesheet" />
      
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Brand Kit</h2>
          <p className="text-gray-600">Professional identity ready to use</p>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 mb-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Logo</h3>
        <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
          <div
            className="w-32 h-32 mx-auto flex items-center justify-center"
            style={{ color: palette.primary }}
            dangerouslySetInnerHTML={{ __html: logoSvg }}
          />
        </div>
      </div>

      {/* Colors Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Color Palette</h3>
        <div className="flex justify-center space-x-8 flex-wrap gap-4">
          <ColorSwatch color={palette.primary} name="Primary" />
          <ColorSwatch color={palette.secondary} name="Secondary" />
          <ColorSwatch color={palette.accent} name="Accent" />
          <ColorSwatch color={palette.neutral_light} name="Light" />
          <ColorSwatch color={palette.neutral_dark} name="Dark" />
        </div>
      </div>

      {/* Fonts Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Typography</h3>
        <div className="text-center">
          <div className="mb-6">
            <h4 
              className="text-4xl font-bold mb-2"
              style={{ 
                fontFamily: `'${fonts.heading}', sans-serif`, 
                color: palette.primary 
              }}
            >
              {fonts.heading}
            </h4>
            <p className="text-gray-600">Heading Font</p>
          </div>
          <div>
            <p 
              className="text-lg leading-relaxed"
              style={{ 
                fontFamily: `'${fonts.body}', sans-serif`, 
                color: palette.neutral_dark 
              }}
            >
              {fonts.body} - Perfect for body text and paragraphs. 
              Highly readable and beautifully complements your heading font.
            </p>
            <p className="text-gray-600 mt-2">Body Font</p>
          </div>
        </div>
      </div>

      {/* Download Section */}
      {brandKit.businessCardUrl && (
        <div className="text-center">
          <a 
            href={fullBusinessCardUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg"
          >
            <Download className="w-5 h-5 mr-3" />
            Download Business Card (PDF)
          </a>
        </div>
      )}
    </div>
  );
};

export default BrandKitDisplay;