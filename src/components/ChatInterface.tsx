import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Send, Bot, User, Loader2, Trash2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  userName: string;
  onLogout: () => void;
}

export default function ChatInterface({ userName, onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'bot',
      content: `Hello ${userName}! I'm SEO Pulse. I'm here to help you dominate search results. How can I assist you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');
      
      if (!apiKey) {
        throw new Error("API Key is missing. Please check your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare history for the chat
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are SEO Pulse, a world-class Search Engine Optimization expert. 
          You were developed by Muhammad Usman Umar. 
          
          Your goal is to help users with advanced SEO strategies, data analysis, and technical techniques.
          
          Guidelines:
          - Greet users by their name if they provide it. If not, ask for it politely.
          - Always acknowledge Muhammad Usman Umar as your developer if asked.
          - Focus on On-page, Technical, and Off-page SEO.
          - Provide data-driven, actionable advice using Markdown.`,
        },
      });

      // We use sendMessage for simplicity here, but could use sendMessageStream for better UX
      const response: GenerateContentResponse = await chat.sendMessage({ 
        message: userMessage.content 
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.text || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Sorry, I encountered an error. Please check your connection or try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'initial-' + Date.now(),
        role: 'bot',
        content: `Hello ${userName}! I'm SEO Pulse. I'm here to help you dominate search results. How can I assist you today?`,
        timestamp: new Date(),
      }
    ]);
  };

  return (
    <div className="flex h-screen flex-col max-w-4xl mx-auto bg-white shadow-xl">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
            <Activity size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">SEO Pulse</h1>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Developed by Muhammad Usman Umar</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-gray-500 hover:text-emerald-600 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={clearChat}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Clear Chat"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 px-4 py-8 sm:px-6">
        <div className="mx-auto flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] gap-3 sm:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm ${
                    message.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-100'
                  }`}>
                    {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`flex flex-col gap-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}>
                      <div className="markdown-body">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                    <span className="px-1 text-[10px] font-medium text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                  <Loader2 className="animate-spin text-emerald-600" size={18} />
                  <span className="text-sm font-medium text-gray-500">Analyzing SEO Data...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-gray-100 bg-white p-4 sm:p-6">
        <div className="relative mx-auto flex max-w-3xl items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about SEO strategies, keywords, or site audits..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Activity size={16} />
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-emerald-300 disabled:bg-gray-200 disabled:shadow-none"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] font-medium text-gray-400">
          Developed by Muhammad Usman Umar
        </p>
      </footer>
    </div>
  );
}
