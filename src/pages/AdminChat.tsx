import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Send, 
  User, 
  MessageCircle, 
  Clock, 
  Phone,
  CheckCircle2,
  MoreVertical,
  Bell,
  Volume2,
  VolumeX,
  Plus,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { chatService } from '@/services/chatService';
import { orderService } from '@/services/orderService';
import { IncompleteOrder } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminChat = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [incompleteOrders, setIncompleteOrders] = useState<IncompleteOrder[]>([]);

  useEffect(() => {
    const socket = chatService.connect();
    chatService.joinChat('admins', true);

    fetchSessions();
    fetchIncompleteOrders();

    socket.on('chat_notification', (data: any) => {
      toast.info(`New message from ${data.name || 'Customer'}`, {
        description: data.message.slice(0, 50) + (data.message.length > 50 ? '...' : ''),
        action: {
          label: 'View',
          onClick: () => setActiveSessionId(data.sessionId)
        }
      });
      if (soundEnabled) playNotificationSound();
      fetchSessions();
    });

    socket.on('new_message', (msg: any) => {
      setChatMessages((prev) => {
         if (activeSessionId === msg.sessionId) {
            return [...prev, msg];
         }
         return prev;
      });
      fetchSessions();
    });

    return () => {
      socket.off('chat_notification');
      socket.off('new_message');
    };
  }, [activeSessionId, soundEnabled]);

  const fetchSessions = async () => {
    const data = await chatService.getSessions();
    setSessions(data);
  };

  const fetchIncompleteOrders = async () => {
    const data = await orderService.getAllIncompleteOrders();
    setIncompleteOrders(data);
  };

  const fetchMessages = async (id: string) => {
    const data = await chatService.getMessages(id);
    setChatMessages(data);
  };

  useEffect(() => {
    if (activeSessionId) {
      chatService.joinChat(activeSessionId, true);
      fetchMessages(activeSessionId);
      chatService.resetUnread(activeSessionId).then(fetchSessions);
    }
  }, [activeSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const playNotificationSound = () => {
    if (!audioRef.current) {
       audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    }
    audioRef.current.play().catch(() => {});
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeSessionId) return;

    chatService.sendMessage({
      sessionId: activeSessionId,
      sender: 'admin',
      message: messageInput
    });

    setMessageInput('');
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => 
      (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
      (s.phone || '').includes(search)
    );
  }, [sessions, search]);

  const activeSession = useMemo(() => {
    return sessions.find(s => s.id === activeSessionId);
  }, [sessions, activeSessionId]);

  const activeCustomerIncompleteOrders = useMemo(() => {
    if (!activeSession?.phone) return [];
    return incompleteOrders.filter(o => 
      o.customerPhone === activeSession.phone || 
      (o.customerPhone && activeSession.phone && o.customerPhone.replace(/[^0-9]/g, '') === activeSession.phone.replace(/[^0-9]/g, ''))
    );
  }, [activeSession, incompleteOrders]);

  return (
    <div className="flex h-[calc(100vh-160px)] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      {/* Sidebar - Sessions List */}
      <div className="w-[350px] border-r flex flex-col bg-slate-50/50 shrink-0">
        <div className="p-6 space-y-4 border-b bg-white">
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-slate-900 group flex items-center gap-2">
                Live Chat
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             </h2>
             <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 transition-colors ${soundEnabled ? 'text-primary' : 'text-slate-400'}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
             >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
             </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search conversations..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-slate-100 border-none text-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-3 space-y-1">
            {filteredSessions.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                 <MessageCircle className="h-10 w-10 text-slate-200 mx-auto" />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active chats</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full p-4 rounded-2xl flex gap-4 transition-all duration-200 group relative ${
                    activeSessionId === session.id 
                    ? 'bg-white shadow-md shadow-blue-900/5 ring-1 ring-slate-100' 
                    : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    activeSessionId === session.id ? 'bg-[#00458e] text-white' : 'bg-white border text-slate-400 border-slate-200'
                  }`}>
                    <User className="h-6 w-6" />
                  </div>
                  <div className="flex-grow min-w-0 text-left">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className="font-bold text-slate-900 truncate pr-2">{session.name || 'Anonymous'}</h4>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-slate-400 font-bold tabular-nums">
                          {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {session.unreadCount > 0 && activeSessionId !== session.id && (
                          <span className="h-4 min-w-4 px-1 flex items-center justify-center bg-[#00458e] text-white text-[9px] font-black rounded-full">
                            {session.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 truncate leading-tight mb-1">{session.lastMessage}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-[#00458e] uppercase tracking-tighter">{session.phone || 'No phone'}</span>
                    </div>
                  </div>
                  {activeSessionId === session.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00458e] rounded-r-full" />
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-slate-50/30 overflow-hidden">
        {!activeSessionId ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-20 space-y-6 text-slate-900">
             <div className="h-24 w-24 bg-white rounded-3xl shadow-xl shadow-blue-900/5 flex items-center justify-center text-[#00458e] animate-bounce-slow">
                <MessageCircle className="h-12 w-12" />
             </div>
             <div>
                <h3 className="text-2xl font-black tracking-tight">Select a conversation</h3>
                <p className="text-slate-500 text-sm font-medium mt-1">Pick a customer from the left to start chatting in real time.</p>
             </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 border-b bg-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-[#00458e]">
                     <User className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{activeSession?.name || 'Anonymous User'}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                       <span className="flex items-center gap-1 text-[11px] font-bold text-[#00458e]">
                          <Phone className="h-3 w-3" /> {activeSession?.phone || 'No Phone provided'}
                       </span>
                       <span className="h-1 w-1 rounded-full bg-slate-300" />
                       <span className="text-[11px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Online
                       </span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400"><MoreVertical className="h-5 w-5" /></Button>
               </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-grow p-8">
               <div className="space-y-6" ref={scrollRef}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex flex-col max-w-[70%]">
                        <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                          msg.sender === 'admin' 
                          ? 'bg-[#00458e] text-white rounded-tr-none' 
                          : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                          {msg.message}
                        </div>
                        <span className={`text-[9px] font-bold uppercase text-slate-400 mt-2 px-1 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                          {msg.sender === 'admin' ? 'You' : activeSession?.name || 'Customer'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
               </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-6 bg-white border-t shrink-0">
               <form onSubmit={handleSendMessage} className="flex gap-4">
                  <div className="flex-grow relative">
                    <Input 
                      placeholder={`Reply to ${activeSession?.name || 'Customer'}...`}
                      className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner pl-6 pr-12 text-sm font-medium"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-[#00458e] shadow-xl shadow-blue-900/20 active:scale-95 transition-all shrink-0">
                    <Send className="h-6 w-6" />
                  </Button>
               </form>
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar - Customer Details & Incomplete Orders */}
      {activeSessionId && (
        <div className="w-[300px] border-l flex flex-col bg-white shrink-0 overflow-hidden">
          <div className="p-6 border-b">
             <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">Customer Info</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <User className="h-4 w-4" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Full Name</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{activeSession?.name || 'Anonymous'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-blue-500">
                      <Phone className="h-4 w-4" />
                   </div>
                   <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone Number</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{activeSession?.phone || 'N/A'}</p>
                   </div>
                </div>
             </div>
          </div>

          <ScrollArea className="flex-grow">
             <div className="p-6 space-y-6">
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Incomplete Orders</h3>
                      <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-100 text-[9px] px-1.5 h-4 font-black">
                         {activeCustomerIncompleteOrders.length} DRAFTS
                      </Badge>
                   </div>
                   
                   {activeCustomerIncompleteOrders.length === 0 ? (
                      <div className="p-10 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                         <ShoppingBag className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">No incomplete orders found</p>
                      </div>
                   ) : (
                      <div className="space-y-3">
                         {activeCustomerIncompleteOrders.map((order) => (
                            <button 
                              key={order.id}
                              onClick={() => navigate(`/admin/incomplete-orders?id=${order.id}`)}
                              className="w-full p-4 bg-slate-50/50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 text-left group"
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <span className="text-[10px] font-black text-slate-900">#{order.id.slice(-6)}</span>
                                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                                    order.status === 'recovered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                     {order.status}
                                  </span>
                               </div>
                               <div className="space-y-1 mb-3">
                                  {order.items.slice(0, 2).map((item, idx) => (
                                     <p key={idx} className="text-xs text-slate-500 truncate">• {item.name}</p>
                                  ))}
                                  {order.items.length > 2 && (
                                     <p className="text-[10px] text-slate-400 font-bold pl-2">+ {order.items.length - 2} more items</p>
                                  )}
                               </div>
                               <div className="flex justify-between items-center pt-3 border-t border-slate-200/50">
                                  <span className="text-sm font-black text-slate-900 tracking-tight">৳ {order.total.toLocaleString()}</span>
                                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                               </div>
                            </button>
                         ))}
                      </div>
                   )}
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                   <div className="flex items-center gap-2 text-blue-600">
                      <AlertCircle className="h-4 w-4" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Admin Tip</h4>
                   </div>
                   <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                      Mention the items in their cart to encourage them to complete the purchase. You can offer a small discount if they're hesitant.
                   </p>
                </div>
             </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default AdminChat;
