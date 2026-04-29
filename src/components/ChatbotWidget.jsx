import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am the LABIA System Assistant. I'm connected to the live MySQL database. Ask me about students, faculty, courses, or submissions!", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const queryText = input;
    setInput('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I am unable to connect to the database right now.", sender: 'bot' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 glass-card border border-primary/30 shadow-2xl overflow-hidden flex flex-col mb-4"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-primary/20 p-4 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_#7CFC00]">
                  <Bot size={18} className="text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm">System Assistant</h3>
                  <p className="text-[10px] text-primary font-bold tracking-wider">ONLINE</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-white/10' : 'bg-primary/20 text-primary'}`}>
                    {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-none border border-white/10' 
                      : 'bg-primary/5 text-text-primary border border-primary/20 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-white/5 border border-white/20 rounded-full pl-4 pr-12 py-2 text-sm outline-none focus:border-primary/50 transition-colors text-white placeholder:text-text-muted"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black hover:bg-primary/80 transition-colors"
                >
                  <Send size={14} className="ml-[-2px]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black shadow-[0_0_20px_#7CFC00] hover:shadow-[0_0_30px_#7CFC00] transition-shadow relative z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;
