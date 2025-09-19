import React, { useState } from 'react';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const CrossQuestioner = ({ projectId, questions, startIndex = 0, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNextQuestion = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim()) {
      setError('Please provide an answer.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post(`/projects/${projectId}/cross-qa`, {
        question: questions[currentIndex],
        answer: currentAnswer,
      });

      if (currentIndex === questions.length - 1) {
        onComplete();
      } else {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer('');
      }
    } catch (err) {
      setError('Failed to save your answer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="flex items-center mb-8">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Define Your Mission & Vision</h2>
          <p className="text-gray-600">Build a strong foundation for your brand</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-purple-600">Progress</span>
          <span className="text-sm font-medium text-gray-500">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleNextQuestion} className="space-y-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
          <label className="block text-xl font-bold text-gray-900 mb-4">
            Question {currentIndex + 1}
          </label>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {questions[currentIndex]}
          </p>
          
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Share your thoughts here..."
            className="w-full p-6 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white"
            rows="6"
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5 mr-3" />
              {currentIndex === questions.length - 1 ? 'Complete' : 'Next Question'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CrossQuestioner;