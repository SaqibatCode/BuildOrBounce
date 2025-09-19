import React from 'react';
import { Rocket, Globe, Upload, Shield, CheckCircle2, ExternalLink } from 'lucide-react';

const HostingGuide = ({ domainName }) => {
  const steps = [
    {
      icon: Globe,
      title: "Purchase Your Domain",
      description: `Go to Hostinger and purchase the domain "${domainName}".`,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Upload,
      title: "Navigate to File Manager",
      description: "In your Hostinger dashboard (hPanel), find your hosting plan and open the \"File Manager\".",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Upload,
      title: "Upload Your Website",
      description: "Open the `public_html` directory. Delete the default `index.php` file if it exists. Click the \"Upload\" icon and select the `.zip` file you downloaded.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: CheckCircle2,
      title: "Extract the Files",
      description: "Right-click on the uploaded `.zip` file and select \"Extract\". Choose `public_html` as the destination.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Enable SSL",
      description: "Go back to your hPanel dashboard. Find \"SSL\" and make sure it is active for your domain to enable `https://`.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Rocket,
      title: "Test Your Site",
      description: `Open a new browser tab and navigate to \`https://${domainName}\`. Your new website should be live!`,
      color: "from-red-500 to-pink-500"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-8 shadow-xl border border-orange-200 mb-8">
      <div className="flex items-center mb-8">
        <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mr-4">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Launch Guide: Deploy on Hostinger</h2>
          <p className="text-gray-600">Follow these steps to get your website live on <span className="font-semibold text-orange-600">{domainName}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className={`p-3 bg-gradient-to-r ${step.color} rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a 
          href="https://hostinger.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg"
        >
          <ExternalLink className="w-5 h-5 mr-3" />
          Go to Hostinger
        </a>
      </div>
    </div>
  );
};

export default HostingGuide;