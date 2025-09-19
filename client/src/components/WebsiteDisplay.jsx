import React from 'react';
import { Globe, Download, ExternalLink, FileCode, Palette, CheckCircle2 } from 'lucide-react';

const DownloadButton = ({ href, children, icon: Icon, color }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className={`group inline-flex items-center px-6 py-4 bg-gradient-to-r ${color} text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg m-2`}
  >
    <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
    {children}
  </a>
);

const WebsiteDisplay = ({ website }) => {
  if (!website) return null;
  
  const fullZipUrl = `${import.meta.env.VITE_API_BASE_URL}${website.zipUrl}`;
  const fullLogoUrl = `${import.meta.env.VITE_API_BASE_URL}${website.logoUrl}`;
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-xl border border-green-200 mb-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Your Website is Ready! 🎉
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your complete website source code and logo have been generated. 
          Everything you need to launch your startup is ready for download.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Complete Website</h3>
              <p className="text-gray-600">Fully responsive & modern</p>
            </div>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Responsive design for all devices
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              SEO optimized structure
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Fast loading performance
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl mr-4">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Brand Assets</h3>
              <p className="text-gray-600">Professional logo & styling</p>
            </div>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Vector SVG logo file
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Consistent brand colors
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Typography system
            </li>
          </ul>
        </div>
      </div>

      {/* Download Buttons */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Download Your Assets</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <DownloadButton 
            href={fullZipUrl} 
            icon={Download} 
            color="from-blue-600 to-purple-600"
          >
            Download Website (.zip)
          </DownloadButton>
          <DownloadButton 
            href={fullLogoUrl} 
            icon={Palette} 
            color="from-pink-600 to-red-600"
          >
            Download Logo (.svg)
          </DownloadButton>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center justify-center mb-2">
            <FileCode className="w-5 h-5 text-blue-600 mr-2" />
            <span className="font-semibold text-blue-900">What's included?</span>
          </div>
          <p className="text-blue-800 text-sm">
            Complete HTML/CSS/JS website, optimized images, favicon, and all source files ready for hosting
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDisplay;