import React, { useState, useRef, useEffect } from 'react';
import './index.css';

function App() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const models = [
    { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', desc: 'Fast & General', color: 'from-green-500 to-emerald-600' },
    { id: 'claude', name: 'Claude', icon: '🧠', desc: 'Deep Analysis', color: 'from-blue-500 to-cyan-600' },
    { id: 'gemini', name: 'Gemini', icon: '✨', desc: 'Multimodal', color: 'from-purple-500 to-pink-600' },
    { id: 'deepseek', name: 'DeepSeek', icon: '🔍', desc: 'Code Expert', color: 'from-orange-500 to-red-600' },
    { id: 'grok', name: 'Grok', icon: '⚡', desc: 'Real-time', color: 'from-gray-600 to-gray-800' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: 'user', text: query, timestamp: new Date() };
    setMessages([...messages, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, model: selectedModel })
      });
      const data = await response.json();
      
      const aiMessage = {
        role: 'assistant',
        text: data.response,
        model: data.model,
        cost: data.cost,
        time: data.responseTime,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        text: '❌ Error: Could not connect to backend. Make sure backend is running on port 5000.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const currentModel = models.find(m => m.id === selectedModel);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* SIDEBAR */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-lg font-bold">
              ⚡
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">SynergAI</h1>
              <p className="text-xs text-slate-400">v1.0</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Intelligent AI Orchestration</p>
        </div>

        {/* Models List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-4">AI Models</p>
          
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                selectedModel === model.id
                  ? `bg-gradient-to-r ${model.color} shadow-lg shadow-cyan-500/20`
                  : 'bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{model.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{model.name}</p>
                  <p className="text-xs text-slate-400">{model.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">© 2025 SynergAI</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-300"
            >
              ☰
            </button>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentModel?.icon}</span>
              <div>
                <h2 className="text-lg font-bold text-white">{currentModel?.name}</h2>
                <p className="text-sm text-slate-400">{currentModel?.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="text-8xl mb-6 animate-float">{currentModel?.icon}</div>
                <h3 className="text-3xl font-bold mb-3 gradient-text">Welcome to SynergAI</h3>
                <p className="text-slate-400 mb-6">Select an AI model and ask any question. We'll automatically optimize for speed and cost.</p>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-left">
                  <p className="text-sm text-slate-300">💡 <strong>Pro Tip:</strong> Ask about code, research, images, news, or anything else. We'll route your query to the best AI model.</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}
              >
                <div
                  className={`max-w-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-700 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800/70 border border-slate-700/50'
                  } rounded-2xl ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'} p-4`}
                >
                  <p className="text-white leading-relaxed">{msg.text}</p>
                  {msg.role === 'assistant' && (
                    <div className="flex gap-4 mt-3 text-xs text-slate-400 pt-3 border-t border-slate-700">
                      <span>🤖 {msg.model?.toUpperCase()}</span>
                      <span>⏱️ {msg.time?.toFixed(2)}s</span>
                      <span>💰 ${msg.cost?.toFixed(2)}</span>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <p className="text-xs text-cyan-100 mt-2">{msg.timestamp?.toLocaleTimeString()}</p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl rounded-tl-none p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="bg-gradient-to-t from-slate-900 to-slate-800/50 border-t border-slate-700/50 p-6">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything... Write code, research, create content..."
                disabled={loading}
                className="flex-1 bg-slate-800/70 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700/50 placeholder-slate-500 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 disabled:shadow-none"
              >
                {loading ? '⏳' : '✉️ Send'}
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center">Powered by multiple AI models • Data stays on your device</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;