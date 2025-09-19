import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IdeaSubmissionPage from './pages/IdeaSubmissionPage';
import ProjectPage from './pages/ProjectPage';
import SettingsPage from './pages/SettingsPage';

// Layout component to conditionally render navbar and apply styles
const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render Navbar for all pages except auth pages */}
      {!isAuthPage && <Navbar />}
      
      {/* Main content with conditional styling */}
      <main className={`${
        isAuthPage || isLandingPage 
          ? '' 
          : 'pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
      }`}>
        {children}
      </main>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // Redirect to login if no token
    window.location.href = '/login';
    return null;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-project" 
            element={
              <ProtectedRoute>
                <IdeaSubmissionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId" 
            element={
              <ProtectedRoute>
                <ProjectPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Page */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                  <div className="text-6xl font-black text-gray-300 mb-4">404</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a 
                    href="/"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;