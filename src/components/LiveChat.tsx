import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Phone, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatService } from '@/services/chatService';
import { toast } from 'sonner';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('chat_session_id');
    const savedName = localStorage.getItem('chat_user_name');
    const savedPhone = localStorage.getItem('chat_user_phone');
    if (savedSession && savedName && savedPhone) {
      setSessionId(savedSession);
      setFormData({ name: savedName, phone: savedPhone });
      setIsRegistered(true);
    } else {
      // Create a unique session ID
      const newId = 'chat_' + Math.random().toString(36).substr(2, 9);
      setSessionId(newId);
      localStorage.setItem('chat_session_id', newId);
    }
  }, []);

  // Connect to socket and load history
  useEffect(() => {
    if (isRegistered && sessionId) {
      const socket = chatService.connect();
      chatService.joinChat(sessionId);

      chatService.getMessages(sessionId).then(setMessages);

      socket.on('new_message', (msg: any) => {
        setMessages((prev) => [...prev, msg]);
        if (msg.sender === 'admin') {
           playNotificationSound();
        }
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [isRegistered, sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const playNotificationSound = () => {
    if (!audioRef.current) {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
    }
    audioRef.current.play().catch(() => {});
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      localStorage.setItem('chat_user_name', formData.name);
      localStorage.setItem('chat_user_phone', formData.phone);
      setIsRegistered(true);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim() || !sessionId) return;

    chatService.sendMessage({
      sessionId,
      sender: 'customer',
      message: messageInput,
      name: formData.name,
      phone: formData.phone
    });

    setMessageInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[calc(100vw-32px)] sm:w-[350px] mb-4 bg-background rounded-2xl shadow-2xl border flex flex-col overflow-hidden h-[500px] max-h-[calc(100vh-120px)]"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center shrink-0">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                     <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">Live Support</h3>
                    <p className="text-[10px] opacity-70 font-medium">We usually reply instantly</p>
                  </div>
               </div>
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-white/20 text-white rounded-full transition-colors"
                onClick={() => setIsOpen(false)}
               >
                 <X className="h-5 w-5" />
               </Button>
            </div>

            <div className="flex-grow flex flex-col min-h-0">
              {!isRegistered ? (
                <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="bg-secondary p-4 rounded-full">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold">Welcome to Chat!</h4>
                    <p className="text-xs text-muted-foreground mt-1">Tell us a bit about yourself to start chatting.</p>
                  </div>
                  <form onSubmit={handleRegister} className="w-full space-y-3">
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Your Name</label>
                      <Input 
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                        required
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] font-black uppercase text-muted-foreground px-1">Phone Number</label>
                      <Input 
                        placeholder="e.g. 01700000000"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                        required
                        className="rounded-xl h-11"
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 rounded-xl font-bold mt-2 shadow-lg shadow-primary/20">
                      Start Conversation
                    </Button>
                  </form>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-grow p-4">
                    <div className="space-y-4" ref={scrollRef}>
                      {messages.length === 0 && (
                         <div className="text-center py-10 opacity-50 space-y-2">
                           <Smile className="h-10 w-10 mx-auto" />
                           <p className="text-xs font-bold uppercase tracking-widest">Say hi to start!</p>
                         </div>
                      )}
                      {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                            msg.sender === 'customer' 
                              ? 'bg-primary text-primary-foreground rounded-tr-none' 
                              : 'bg-secondary text-foreground rounded-tl-none border'
                          }`}>
                            {msg.message}
                            <div className={`text-[9px] mt-1 opacity-50 font-bold uppercase text-right leading-none`}>
                               {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t bg-secondary/10 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input 
                        placeholder="Type a message..."
                        className="rounded-xl border-none bg-background shadow-inner h-11"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                      <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-90">
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-7 w-7" />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </motion.button>
    </div>
  );
};

export default LiveChat;
