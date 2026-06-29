import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Message } from '../../types';
import { Send, Paperclip, FileText, Code, Smile, User, CheckCheck } from 'lucide-react';
import { getSocket } from '../../lib/socket';

export const ChatBox: React.FC = () => {
  const { messages, setMessages, addMessage, role, showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText && !codeSnippet) return;

    addMessage(inputText, codeSnippet || undefined);
    setInputText('');
    setCodeSnippet('');
    setShowCodeInput(false);

    // If socket is connected, do NOT trigger simulated response since it's a live chat
    const socket = getSocket();
    if (socket && socket.connected) {
      console.log('[Socket] Message emitted in real-time, skipping simulated response.');
      return;
    }

    // Trigger simulated response from the other party in local offline fallback demo mode
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const isClient = role === 'client';
      const senderName = isClient ? 'Alex Rivera' : 'Sarah Jenkins';
      const senderAvatar = isClient 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
        : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150';
      const senderRole = isClient ? 'freelancer' : 'client';
      
      const responses = [
        "That implementation looks robust. I’ve reviewed the grid-layout specifications.",
        "Perfect, let’s hold the final deployment until we run the pen-testing scripts.",
        "I will prepare the API core schemas and attach them to our contract portal tonight.",
        "Yes, the revised latency benchmarks are completely within our SLA target parameters."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const simulatedMsg: Message = {
        id: `msg-sim-${Date.now()}`,
        senderId: isClient ? 'freelancer-alex' : 'client-sarah',
        senderName,
        senderAvatar,
        senderRole,
        text: randomResponse,
        timestamp: 'Today ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      };

      // Safe state update
      setMessages(prev => [...prev, simulatedMsg]);
    }, 2000);
  };

  const getRecipientName = () => {
    return role === 'client' ? 'Alex Rivera (Specialist)' : 'Sarah Jenkins (Employer)';
  };

  const getRecipientAvatar = () => {
    return role === 'client' 
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
      : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150';
  };

  return (
    <div className="h-[calc(100vh-10rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-md flex overflow-hidden font-sans text-left">
      {/* Contact sidebar */}
      <aside className="w-64 border-r border-slate-100 dark:border-slate-800 hidden md:flex flex-col">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Active Threads</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/10 rounded-xl cursor-pointer">
            <img src={getRecipientAvatar()} alt="avatar" className="h-10 w-10 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{getRecipientName()}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate font-semibold">Active workspace</p>
            </div>
            <div className="h-2 w-2 rounded-full bg-blue-500 self-center shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main message stream panel */}
      <section className="flex-1 flex flex-col justify-between h-full bg-slate-50/20 dark:bg-slate-950/10 relative">
        {/* Recipient info Header */}
        <div className="h-16 shrink-0 border-b border-slate-100 dark:border-slate-800 px-6 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <img src={getRecipientAvatar()} alt="avatar" className="h-9.5 w-9.5 rounded-xl object-cover" />
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{getRecipientName()}</h3>
              <p className="text-[10px] text-emerald-500 font-bold inline-flex items-center gap-1 mt-0.5">
                <span className="h-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active now
              </p>
            </div>
          </div>
        </div>

        {/* Message bubble track */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => {
            const isMe = (role === 'client' && msg.senderRole === 'client') || 
                         (role === 'freelancer' && msg.senderRole === 'freelancer');
            
            return (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                <img src={msg.senderAvatar} alt={msg.senderName} className="h-8.5 w-8.5 rounded-lg object-cover shrink-0 ring-2 ring-slate-100 dark:ring-slate-800" />
                
                <div className="space-y-1.5">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm shadow-xs border leading-relaxed
                    ${isMe 
                      ? 'bg-blue-600 border-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-850 dark:text-slate-100 rounded-tl-none'
                    }
                  `}>
                    {/* Plain Text */}
                    <p className="whitespace-pre-line font-medium">{msg.text}</p>

                    {/* PDF Document mockup Card */}
                    {msg.attachmentName && (
                      <div className={`mt-3 p-3 rounded-xl flex items-center gap-3 border text-left
                        ${isMe 
                          ? 'bg-blue-700/50 border-blue-500 text-white' 
                          : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }
                      `}>
                        <FileText className="w-8 h-8 text-rose-500 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold truncate">{msg.attachmentName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">1.2 MB &bull; PDF</p>
                        </div>
                      </div>
                    )}

                    {/* Code Snippet */}
                    {msg.codeSnippet && (
                      <div className="mt-3 text-left">
                        <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-900">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Bubble timestamp & status indicator */}
                  <span className="text-[10px] text-slate-400 font-bold block">
                    {msg.timestamp}
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline ml-1" />}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mr-auto text-left">
              <img src={getRecipientAvatar()} alt="avatar" className="h-8.5 w-8.5 rounded-lg object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-1 rounded-tl-none">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-450 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar Section */}
        <div className="p-4 shrink-0 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={handleSendMessage} className="space-y-3">
            {showCodeInput && (
              <textarea
                rows={3}
                placeholder="Paste code snippet here..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none text-emerald-500"
              />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className={`p-2.5 rounded-xl border transition-colors
                  ${showCodeInput 
                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/10 text-blue-600' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-slate-500 hover:text-slate-800'
                  }`}
              >
                <Code className="w-4.5 h-4.5" />
              </button>

              <button
                type="button"
                onClick={() => showToast('Attachment mock uploaded successfully.', 'info')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Paperclip className="w-4.5 h-4.5" />
              </button>

              <input
                id="chat-message-input"
                type="text"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100 font-medium"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-md shadow-blue-500/15"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
