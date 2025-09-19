import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Rocket, Target, Palette, Globe, Clock, TrendingUp, Users, DollarSign, ArrowUpRight, Filter, Search, MoreVertical, Play, CheckCircle2 } from 'lucide-react';
import api from '../api/axiosConfig';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      idea: { label: 'Idea', color: 'bg-gray-500', icon: '💡' },
      validated: { label: 'Validated', color: 'bg-blue-500', icon: '✅' },
      domain_selected: { label: 'Domain Selected', color: 'bg-purple-500', icon: '🌐' },
      brand_kit_generated: { label: 'Brand Ready', color: 'bg-pink-500', icon: '🎨' },
      website_generated: { label: 'Website Ready', color: 'bg-green-500', icon: '🚀' }
    };
    return statusMap[status] || statusMap.idea;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length, 
      icon: Rocket, 
      color: 'from-blue-500 to-blue-600', 
      change: '+2 this week' 
    },
    { 
      label: 'Validated Ideas', 
      value: projects.filter(p => p.status !== 'idea').length, 
      icon: Target, 
      color: 'from-green-500 to-green-600', 
      change: '+1 this week' 
    },
    { 
      label: 'Live Websites', 
      value: projects.filter(p => p.status === 'website_generated').length, 
      icon: Globe, 
      color: 'from-purple-500 to-purple-600', 
      change: 'Ready to launch' 
    },
    { 
      label: 'Success Rate', 
      value: '85%', 
      icon: TrendingUp, 
      color: 'from-pink-500 to-pink-600', 
      change: 'Above average' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Welcome back, Builder! 👋
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl">
                Turn your ideas into reality. Track your projects and see your startup dreams come to life.
              </p>
            </div>
            <Link 
              to="/new-project"
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 w-fit"
            >
              <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              Start New Project
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="group bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-green-600 font-medium">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-lg flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Projects</option>
                <option value="idea">Ideas</option>
                <option value="validated">Validated</option>
                <option value="brand_kit_generated">Brand Ready</option>
                <option value="website_generated">Website Ready</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-xl font-semibold text-gray-700">Loading projects...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const statusInfo = getStatusInfo(project.status);
              return (
                <div 
                  key={project._id}
                  className="group bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden relative"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-white text-sm font-bold ${statusInfo.color}`}>
                        <span className="mr-2">{statusInfo.icon}</span>
                        {statusInfo.label}
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Project Title */}
                    <Link to={`/project/${project._id}`}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                        {project.title}
                      </h3>
                    </Link>

                    {/* Project Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="font-semibold text-gray-700 capitalize">{project.status.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Created</span>
                        <span className="font-semibold text-gray-700">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        Active
                      </div>
                      <div className="flex items-center space-x-2">
                        {project.status === 'website_generated' && (
                          <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                        <Link 
                          to={`/project/${project._id}`}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors group-hover:scale-110 transition-transform duration-300"
                        >
                          <Play className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Rocket className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'Start your first project and turn your ideas into reality'}
            </p>
            <Link 
              to="/new-project"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;