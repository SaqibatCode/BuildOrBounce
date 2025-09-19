import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Target, Users, DollarSign, Zap, Rocket, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const IdeaSubmissionPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    problem: '',
    target_user: '',
    channels: '',
    monetization: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.pitch) {
      setError('Idea Title and Pitch are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/projects', formData);
      navigate(`/project/${response.data._id}`);
    } catch (err) {
      setError('Failed to submit idea. Please try again.');
      console.error('Error submitting idea:', err);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      name: 'title',
      label: 'Idea Title',
      type: 'input',
      placeholder: 'What\'s your startup called?',
      icon: Lightbulb,
      required: true,
      description: 'Give your idea a memorable name'
    },
    {
      name: 'pitch',
      label: 'Your Pitch',
      type: 'textarea',
      placeholder: 'Describe your startup in a compelling way...',
      icon: Rocket,
      required: true,
      description: 'Your elevator pitch - make it compelling!'
    },
    {
      name: 'problem',
      label: 'Problem You\'re Solving',
      type: 'textarea',
      placeholder: 'What pain point does your startup address?',
      icon: Target,
      description: 'The more specific, the better'
    },
    {
      name: 'target_user',
      label: 'Target Users',
      type: 'input',
      placeholder: 'Who are your ideal customers?',
      icon: Users,
      description: 'Define your ideal customer profile'
    },
    {
      name: 'channels',
      label: 'Marketing Channels',
      type: 'input',
      placeholder: 'Social Media, SEO, Content Marketing...',
      icon: Zap,
      description: 'How will you reach your users?'
    },
    {
      name: 'monetization',
      label: 'Revenue Model',
      type: 'input',
      placeholder: 'Subscription, freemium, marketplace...',
      icon: DollarSign,
      description: 'How will you make money?'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-gray-200/50 text-purple-600 text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4 mr-2" />
            New Project Submission
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Submit Your 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Startup Idea</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Let's see if it's a "Build" or a "Bounce". Our AI will analyze your idea's potential and guide you through the validation process.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            <div className="space-y-8">
              {formFields.map((field, index) => (
                <div key={field.name} className="group">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      <field.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <label className="text-xl font-bold text-gray-900 block">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <p className="text-gray-600 text-sm">{field.description}</p>
                    </div>
                  </div>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows="4"
                      className="w-full p-6 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none bg-gray-50 focus:bg-white group-hover:border-purple-300"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full p-6 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-purple-300"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 font-medium text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-12 text-center">
              <button
                type="submit"
                disabled={loading}
                className="group px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold text-xl rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Submitting for Validation...
                  </>
                ) : (
                  <>
                    <Rocket className="w-6 h-6 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    Submit for Validation
                  </>
                )}
              </button>
              <p className="text-gray-500 mt-4 text-sm">
                Our AI will analyze your idea in seconds
              </p>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/50 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI Validation</h3>
            <p className="text-gray-600 text-sm">Get instant feedback on market potential and feasibility</p>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Brand Generation</h3>
            <p className="text-gray-600 text-sm">Receive professional logos and complete brand kits</p>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Website Creation</h3>
            <p className="text-gray-600 text-sm">Get a fully functional website ready for deployment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaSubmissionPage;