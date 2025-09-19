import React, { useState, useEffect } from 'react';
import { Key, Lock, User, Save, Eye, EyeOff, Shield, Zap } from 'lucide-react';
import api from '../api/axiosConfig';

const SettingsPage = () => {
  const [apiKeys, setApiKeys] = useState({ openai: '', pexels: '' });
  const [password, setPassword] = useState({ oldPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/user/settings');
        setApiKeys({
          openai: data.apiKeys.openai || '',
          pexels: data.apiKeys.pexels || '',
        });
      } catch (error) {
        console.error("Could not fetch user settings", error);
        setMessage({ text: 'Could not load your settings.', type: 'error' });
      }
    };
    fetchSettings();
  }, []);

  const handleKeyChange = (e) => setApiKeys({ ...apiKeys, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPassword({ ...password, [e.target.name]: e.target.value });

  const handleKeySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await api.post('/user/settings/keys', apiKeys);
      setMessage({ text: data.message, type: 'success' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to update keys.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword.length < 6) {
      setMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { data } = await api.post('/user/settings/password', password);
      setMessage({ text: data.message, type: 'success' });
      setPassword({ oldPassword: '', newPassword: '' });
    } catch (error) {
      setMessage({ text: error.response?.data?.message || 'Failed to change password.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-lg rounded-full border border-gray-200/50 text-purple-600 text-sm font-medium mb-6">
            <User className="w-4 h-4 mr-2" />
            Account Management
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Account 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Settings</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your API keys and account security settings
          </p>
        </div>

        <div className="space-y-8">
          {/* API Keys Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-2xl mr-4">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">API Keys</h2>
                  <p className="text-purple-100">Use your own API keys for unlimited usage</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleKeySubmit} className="p-8">
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Why provide your own keys?</h4>
                    <p className="text-blue-700 text-sm">
                      Providing your own API keys ensures unlimited usage and faster processing. 
                      Leave blank to use our shared keys with rate limits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mr-3">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    name="openai"
                    value={apiKeys.openai}
                    onChange={handleKeyChange}
                    placeholder="sk-..."
                    className="w-full p-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-purple-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">Used for AI validation and content generation</p>
                </div>

                <div className="group">
                  <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Pexels API Key
                  </label>
                  <input
                    type="password"
                    name="pexels"
                    value={apiKeys.pexels}
                    onChange={handleKeyChange}
                    placeholder="Your Pexels Key"
                    className="w-full p-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-purple-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">Used for stock images in your websites</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" />
                    Save API Keys
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-2xl mr-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Change Password</h2>
                  <p className="text-red-100">Update your account password</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.old ? "text" : "password"}
                      name="oldPassword"
                      value={password.oldPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-4 pr-12 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-red-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={password.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full p-4 pr-12 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-red-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Minimum 6 characters</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-3" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mt-8 p-6 rounded-2xl text-center font-medium ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;