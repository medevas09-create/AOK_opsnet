import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Headphones, Phone, CheckCheck } from 'lucide-react';
import type { Job } from './job-list';

interface Message {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ChatSupportProps {
  job: Job;
  onClose: () => void;
}

export function ChatSupport({ job, onClose }: ChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'support',
      message: `Halo! Saya dari CS Support. Ada yang bisa saya bantu terkait instalasi untuk ${job.customerName}?`,
      timestamp: new Date(Date.now() - 60000),
      read: true,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      message: inputMessage,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulasi CS support mengetik dan membalas
    setIsTyping(true);
    setTimeout(() => {
      const supportResponse = getAutoResponse(inputMessage);
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        message: supportResponse,
        timestamp: new Date(),
        read: true,
      };
      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAutoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('alamat') || lowerMessage.includes('lokasi')) {
      return `Alamat pelanggan yang terdaftar: ${job.address}. Sudah benar ya?`;
    }
    
    if (lowerMessage.includes('nomor') || lowerMessage.includes('telepon') || lowerMessage.includes('kontak')) {
      return `Nomor telepon pelanggan: ${job.phone}. Silakan hubungi 30 menit sebelum tiba.`;
    }
    
    if (lowerMessage.includes('paket') || lowerMessage.includes('langganan')) {
      return `Pelanggan berlangganan ${job.packageType}. Pastikan perangkat yang dibawa sesuai spesifikasi ya!`;
    }
    
    if (lowerMessage.includes('jadwal') || lowerMessage.includes('waktu')) {
      return `Jadwal instalasi: ${job.scheduledTime}. Jangan lupa konfirmasi ke pelanggan sebelum berangkat.`;
    }

    if (lowerMessage.includes('benar') || lowerMessage.includes('oke') || lowerMessage.includes('ok') || lowerMessage.includes('siap')) {
      return 'Baik, semoga instalasi lancar! Jika ada kendala, langsung hubungi CS ya. Semangat! 💪';
    }

    if (lowerMessage.includes('kendala') || lowerMessage.includes('masalah')) {
      return 'Untuk kendala teknis, silakan hubungi hotline: 0800-123-4567. Saya akan catat keluhan Anda juga.';
    }

    return 'Saya akan bantu cek informasinya. Silakan tanyakan tentang alamat, nomor telepon, paket, atau jadwal pelanggan.';
  };

  const quickMessages = [
    'Konfirmasi alamat pelanggan',
    'Konfirmasi nomor telepon',
    'Detail paket langganan',
    'Konfirmasi jadwal instalasi',
  ];

  const handleQuickMessage = (message: string) => {
    setInputMessage(message);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">CS Support</h3>
              <p className="text-sm text-blue-100">Online - Siap membantu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`tel:${job.phone}`)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              title="Hubungi Pelanggan"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job Info Banner */}
        <div className="bg-blue-50 border-b border-blue-100 p-3">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Job:</span> {job.customerName} - {job.packageType}
          </p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Headphones className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                <div>
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 px-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                    {msg.sender === 'user' && (
                      <CheckCheck className={`w-3 h-3 ${msg.read ? 'text-blue-500' : 'text-gray-400'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[75%]">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-gray-700" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Messages */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleQuickMessage(msg)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap hover:bg-blue-100 transition-colors"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Komponen floating button untuk membuka chat
interface ChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function ChatButton({ onClick, hasUnread }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
    >
      <MessageCircle className="w-7 h-7" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
          !
        </span>
      )}
    </button>
  );
}
