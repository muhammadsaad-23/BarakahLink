
import React, { useState } from 'react';
import { SMSMessage, FoodDrop } from '../types';

interface SMSViewProps {
  drops: FoodDrop[];
}

export const SMSView: React.FC<SMSViewProps> = ({ drops }) => {
  const [messages, setMessages] = useState<SMSMessage[]>([
    {
      id: '1',
      from: 'System',
      content: 'Welcome to Barakat Meal. Sharing blessings in KW. Text "FOOD" for local drops.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: SMSMessage = {
      id: Date.now().toString(),
      from: 'You',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      let reply = '';
      const cmd = input.toUpperCase().trim();

      if (cmd.includes('FOOD')) {
        const top3 = drops.slice(0, 3);
        reply = `Top 3 drops in KW:\n` + top3.map((d, i) => `${i+1}. ${d.title} @ ${d.donorName}. Until ${new Date(d.availableUntil).getHours()}:00`).join('\n') + '\n\nReply with a number to reserve.';
      } else if (['1', '2', '3'].includes(cmd)) {
        reply = `Success! Blessing reserved. Code: BRKT-${Math.floor(Math.random()*9000)+1000}. See you there!`;
      } else {
        reply = 'Unknown command. Text "FOOD" to browse available meals.';
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        from: 'System',
        content: reply,
        timestamp: new Date()
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="max-w-[340px] mx-auto bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-slate-800 overflow-hidden h-[680px] flex flex-col relative">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10"></div>
      
      {/* Content Container */}
      <div className="flex-1 overflow-y-auto pt-8 pb-4 space-y-4 px-2 no-scrollbar bg-slate-50 rounded-[2rem] h-full flex flex-col">
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600 font-black text-xl">B</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barakat Assistant</p>
        </div>

        <div className="flex-1 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
                msg.from === 'You' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[9px] mt-1 font-bold uppercase tracking-wider ${msg.from === 'You' ? 'text-emerald-200' : 'text-slate-300'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-slate-50 pt-4 pb-2">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Text Message"
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none placeholder:text-slate-300 font-medium text-slate-900"
            />
            <button 
              onClick={handleSend}
              className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-slate-800 rounded-full opacity-20"></div>
    </div>
  );
};
