import { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import api from '../api/client';

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the VendorFlow AI Assistant. I can check onboarding statuses, send reminders, or schedule approval meetings. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/agent/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error connecting to my brain." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-panel h-[500px] flex flex-col bg-dark-900 border border-dark-700/50 relative overflow-hidden">
      <div className="bg-dark-950 p-6 flex items-center border-b border-dark-800 relative z-10">
        <div className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mr-4 shadow-inner">
          <Bot className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <h3 className="font-display font-bold text-white tracking-wide">Gemini Agent</h3>
          <p className="text-xs text-primary-400 font-medium">Online & Ready</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-900/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 text-[14px] font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-br-sm shadow-primary-900/20' 
                : 'bg-dark-800 text-dark-200 rounded-bl-sm border border-dark-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-800 border border-dark-700 text-dark-400 rounded-[1.5rem] rounded-bl-sm px-6 py-4 text-[14px] font-medium flex items-center shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-3 text-primary-500" />
              Processing...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-dark-950 border-t border-dark-800 relative z-10">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-dark-800 border border-dark-700 rounded-full pl-6 pr-14 py-4 text-[14px] font-medium text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 placeholder:text-dark-500"
            placeholder="Command the agent..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-500 disabled:opacity-50 transition-colors shadow-md shadow-primary-900/40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
