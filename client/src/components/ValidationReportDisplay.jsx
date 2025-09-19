import React from 'react';
import { CheckCircle2, AlertTriangle, Target, TrendingUp, Shield, AlertCircle } from 'lucide-react';

const ValidationReportDisplay = ({ report }) => {
  if (!report) return null;

  const isPositive = report.verdict === 'Build';

  return (
    <div className="space-y-6 mb-8">
      {/* Verdict Banner */}
      <div className={`rounded-3xl p-8 text-center ${
        isPositive 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
          : 'bg-gradient-to-r from-red-500 to-orange-500'
      }`}>
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-white/20 backdrop-blur-lg rounded-full">
            {isPositive ? (
              <CheckCircle2 className="w-12 h-12 text-white" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-white" />
            )}
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-2">
          {report.verdict.toUpperCase()}!
        </h2>
        <p className="text-white/90 text-lg">
          {isPositive ? 'Great potential detected!' : 'Significant challenges identified'}
        </p>
      </div>

      {/* Score Overview */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Validation Score</h3>
            <p className="text-gray-600">Overall assessment of your idea</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                <div className="bg-white rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-black text-gray-900">{report.score}</span>
                </div>
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-900">Overall Score</p>
            <p className="text-gray-600">Out of 100</p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Executive Summary</h4>
              <p className="text-gray-700 leading-relaxed">{report.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Detailed Breakdown</h3>
            <p className="text-gray-600">Key factors in our analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Market Potential
            </h4>
            <p className="text-blue-800 leading-relaxed">{report.breakdown?.market_potential}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h4 className="font-bold text-purple-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Uniqueness
            </h4>
            <p className="text-purple-800 leading-relaxed">{report.breakdown?.uniqueness}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-200">
            <h4 className="font-bold text-pink-900 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Feasibility
            </h4>
            <p className="text-pink-800 leading-relaxed">{report.breakdown?.feasibility}</p>
          </div>
        </div>
      </div>

      {/* Risks & Mitigations */}
      {report.risks && report.risks.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mr-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Risks & Mitigations</h3>
              <p className="text-gray-600">Potential challenges and how to address them</p>
            </div>
          </div>

          <div className="space-y-4">
            {report.risks.map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-start">
                  <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-4 mt-1">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-orange-900 mb-2">{item.risk}</h4>
                    <p className="text-orange-800 leading-relaxed">{item.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationReportDisplay;