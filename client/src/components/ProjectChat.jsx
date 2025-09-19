import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api/axiosConfig';

const ProjectChat = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!projectId) return;
      setIsLoading(true);
      try {
        const { data } = await api.get(`/chat/${projectId}/history`);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [projectId]);

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const { data: assistantMessage } = await api.post(`/chat/${projectId}/message`, { message: newMessage });
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: "Sorry, I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Failed to send message", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="p-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl mr-4">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your AI Business Coach</h2>
          <p className="text-gray-600">Ask anything about your project, from marketing strategies to technical advice</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 h-96 overflow-y-auto mb-6 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Start a conversation with your AI coach!</p>
            <p className="text-gray-400 text-sm mt-2">Ask about marketing, strategy, technical questions, or anything else.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`p-2 rounded-full ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                : 'bg-gradient-to-r from-green-500 to-teal-500'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white border border-gray-200 text-gray-900'
            }`}>
              <ReactMarkdown className="prose prose-sm max-w-none">
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                <span className="text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask your coach a question..."
          disabled={isLoading}
          className="flex-1 p-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-300"
        />
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className="px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ProjectChat;