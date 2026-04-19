import { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
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
    <div className="glass-panel h-[400px] flex flex-col mt-8 relative overflow-hidden">
      <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-4 text-white flex items-center shadow-md z-10">
        <Bot className="w-5 h-5 mr-2" />
        <h3 className="font-medium text-sm">Gemini AI Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-none' 
                : 'bg-white text-surface-800 rounded-bl-none border border-surface-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-surface-100 text-surface-500 rounded-2xl rounded-bl-none px-4 py-2 text-sm flex items-center shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-surface-100 z-10">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-surface-50 border border-surface-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            placeholder="Ask about a vendor..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-1 top-1 bottom-1 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
