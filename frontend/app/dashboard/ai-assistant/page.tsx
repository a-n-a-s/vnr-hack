'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !user) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call backend API to get AI response
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id, // Use the authenticated user's ID
          message: input,
        }),
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        // Clean up the response content by handling escaped newlines and formatting
        let cleanedContent = data.reply;
        // Replace escaped newlines with actual newlines
        cleanedContent = cleanedContent.replace(/\\n/g, '\n');
        // Remove excessive repeated content
        cleanedContent = cleanedContent.replace(/\n\s*\n\s*\n/g, '\n\n'); // Replace triple newlines with double
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: cleanedContent,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const errorData = await response.json();
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Error: ${errorData.detail || 'Failed to get response from AI'}`,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Error: Failed to connect to AI assistant. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800">AI Assistant</h1>
            <p className="text-gray-600 mt-2">Powered by Gemini AI</p>
          </div>
          
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <div className="mr-3 mt-0.5">
                    {message.sender === 'ai' ? (
                      <Bot className="text-blue-500 w-5 h-5" />
                    ) : (
                      <User className="text-white w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="mr-3 mt-0.5">
                    <Bot className="text-blue-500 w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading || !user}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-3 flex items-center justify-center disabled:opacity-50"
            disabled={isLoading || !input.trim() || !user}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        {!user && (
          <p className="text-center text-xs text-red-500 mt-2">
            Please log in to use the AI assistant.
          </p>
        )}
      </div>
    </div>
  );
}