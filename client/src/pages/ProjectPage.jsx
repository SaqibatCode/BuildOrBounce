import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, Rocket, Target, Palette, Globe, MessageSquare, CheckCircle2, AlertTriangle, ArrowRight, Download, ExternalLink, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

// Import your components
import ValidationReportDisplay from '../components/ValidationReportDisplay';
import CrossQuestioner from '../components/CrossQuestioner';
import DomainSelector from '../components/DomainSelector';
import LogoSelector from '../components/LogoSelector';
import BrandKitDisplay from '../components/BrandKitDisplay';
import WebsiteDisplay from '../components/WebsiteDisplay';
import HostingGuide from '../components/HostingGuide';
import ProjectChat from '../components/ProjectChat';

const guidedQuestions = [
  "What is the ultimate mission of your project? What is the core 'why' behind it?",
  "What does a successful future look like in 5 years? Paint a picture of your vision.",
  "Describe your Ideal Customer Profile (ICP) in detail. Who are they, what are their pain points, and what do they value?",
  "What is your unique positioning in the market? How are you different from competitors?",
  "What is the single most important message you want your brand to convey?"
];

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [domainSuggestions, setDomainSuggestions] = useState([]);
  const [logoOptions, setLogoOptions] = useState([]);
  const [domainSearchCompleted, setDomainSearchCompleted] = useState(false);

  const fetchProjectData = async () => {
    if (!project) setLoading(true);
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data);
    } catch (err) {
      setError('Could not fetch project data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleAction = async (apiCall) => {
    setActionInProgress(true);
    setError('');
    try {
      await apiCall();
      await fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'An action failed.');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleGenerateDomains = async () => {
    setActionInProgress(true);
    setError('');
    setDomainSearchCompleted(false);
    setDomainSuggestions([]);
    try {
      const response = await api.get(`/projects/${projectId}/domains`);
      setDomainSuggestions(response.data);
    } catch (err) {
      setError('Could not generate domain names.');
    } finally {
      setActionInProgress(false);
      setDomainSearchCompleted(true);
    }
  };

  const handleGenerateLogos = async () => {
    setActionInProgress(true);
    setError('');
    try {
      const response = await api.get(`/projects/${projectId}/logo-options`);
      setLogoOptions(response.data);
    } catch (err) {
      setError('Could not generate logo options.');
    } finally {
      setActionInProgress(false);
    }
  };

  const renderWorkflowStep = () => {
    if (!project) return null;

    const { status, validation_report_id, cross_qa_ids, selected_domain_name, verdict_overridden } = project;

    // --- Consolidated Logic Block for Post-Q&A Steps ---
    const isQaComplete = cross_qa_ids && cross_qa_ids.length >= guidedQuestions.length;
    const canProceed = validation_report_id && (validation_report_id.verdict === 'Build' || verdict_overridden);

    if (status === 'validated' && canProceed && isQaComplete) {
      if (domainSearchCompleted && domainSuggestions.length > 0) {
        return (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Domain</h2>
              <p className="text-gray-600">Pick the perfect name for your startup</p>
            </div>
            <DomainSelector
              suggestions={domainSuggestions}
              onSelect={(domainName) => {
                setDomainSuggestions([]);
                setDomainSearchCompleted(false);
                handleAction(() => api.post(`/projects/${projectId}/domains`, { domainName }));
              }}
            />
          </div>
        );
      }
      
      if (domainSearchCompleted && domainSuggestions.length === 0) {
        return (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-yellow-200 mb-8">
              <div className="text-center">
                 <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">No Available Domains Found</h2>
                <p className="text-gray-600 mb-8">All generated names seem to be taken. Our AI will get more creative on the next attempt.</p>
                <button 
                  onClick={handleGenerateDomains}
                  disabled={actionInProgress}
                  className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto disabled:opacity-50"
                >
                  {actionInProgress ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Getting Creative...</> : <><Sparkles className="w-5 h-5 mr-2" />Try Again</>}
                </button>
              </div>
            </div>
        );
      }

      return (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-3xl p-8 shadow-xl border border-green-200 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mission & Vision Defined!</h2>
            <p className="text-gray-600 mb-8">Excellent work! Now let's find the perfect name for your project</p>
            <button 
              onClick={handleGenerateDomains}
              disabled={actionInProgress}
              className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto disabled:opacity-50"
            >
              {actionInProgress ? ( <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Brainstorming...</> ) : ( <><Sparkles className="w-5 h-5 mr-2" />Generate Name Ideas</> )}
            </button>
          </div>
        </div>
      );
    }
    
    // Render the logo selector if logo options are available
    if (logoOptions.length > 0) {
      return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="text-center">
            {/* ... other JSX ... */}
          </div>
          <LogoSelector
            logoOptions={logoOptions}
            isLoading={actionInProgress}
            // =============================================================
            // === THIS IS THE ONLY PART THAT NEEDS TO BE CHANGED ===
            // =============================================================
            onSelect={(chosenLogoUrl) => { // 1. Renamed parameter for clarity
              setLogoOptions([]); // Clear the options to hide the selector
              // 2. Send the correct field name `{ chosenLogoUrl }` to the backend
              handleAction(() => api.post(`/projects/${projectId}/brand-kit`, { chosenLogoUrl }));
            }}
            // =============================================================
          />
        </div>
      );
    }

    switch (status) {
      case 'website_generated':
        return null;
      case 'brand_kit_generated':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl border border-blue-200 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Brand Kit Complete!</h2>
              <p className="text-gray-600 mb-8">Time to build your professional website</p>
              <button onClick={() => handleAction(() => api.post(`/projects/${projectId}/website`))} disabled={actionInProgress} className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto disabled:opacity-50">
                {actionInProgress ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Building Website...</> : <><Globe className="w-5 h-5 mr-2" />Generate Website</>}
              </button>
            </div>
          </div>
        );
      case 'domain_selected':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl border border-purple-200 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Domain Selected: {selected_domain_name}</h2>
              <p className="text-gray-600 mb-8">Now let's create your brand identity with professional logos</p>
              <button onClick={handleGenerateLogos} disabled={actionInProgress} className="flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto disabled:opacity-50">
                {actionInProgress ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating Logos...</> : <><Sparkles className="w-5 h-5 mr-2" />Generate Logo Options</>}
              </button>
            </div>
          </div>
        );
      case 'validated':
        if (validation_report_id.verdict === 'Bounce' && !verdict_overridden) {
          return (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-xl border border-red-200 mb-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Verdict: Bounce</h2>
                <p className="text-gray-600 mb-8">Our AI identified significant challenges, but you have the final say</p>
                <button onClick={() => handleAction(() => api.patch(`/projects/${projectId}/override-verdict`))} disabled={actionInProgress} className="flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto disabled:opacity-50">
                  {actionInProgress ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Please wait...</> : <><ArrowRight className="w-5 h-5 mr-2" />Proceed Anyway</>}
                </button>
              </div>
            </div>
          );
        }
        return (<CrossQuestioner projectId={projectId} questions={guidedQuestions} startIndex={cross_qa_ids ? cross_qa_ids.length : 0} onComplete={fetchProjectData} />);
      case 'idea':
      default:
        return (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-xl border border-blue-200 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready for Validation!</h2>
              <p className="text-gray-600 mb-8">Let our AI analyze your idea's market potential and feasibility</p>
              <button onClick={() => handleAction(() => api.post(`/projects/${projectId}/validate`))} disabled={actionInProgress} className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:scale-105 transition-transform mx-auto disabled:opacity-50">
                {actionInProgress ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Validating...</> : <><Target className="w-5 h-5 mr-2" />Validate My Idea</>}
              </button>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-700">Loading Project...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* ... */}
        </div>
        {project?.validation_report_id && <ValidationReportDisplay report={project.validation_report_id} />}
        {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8"><p className="text-red-600 text-center font-medium">Error: {error}</p></div>}
        {project?.brand_kit_id && <BrandKitDisplay brandKit={project.brand_kit_id} />}
        {renderWorkflowStep()}
        {project?.status === 'website_generated' && project.website_id && (
          <div className="space-y-8">
            <WebsiteDisplay website={project.website_id} />
            <HostingGuide domainName={project.selected_domain_name} />
          </div>
        )}
        {project && project.status !== 'idea' && <ProjectChat projectId={projectId} />}
      </div>
    </div>
  );
};

export default ProjectPage;