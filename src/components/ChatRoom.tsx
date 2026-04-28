import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send, User, ChevronLeft, MessageSquare } from "lucide-react";
import { cn } from "../lib/utils";

const socket = io();

export default function ChatRoom({ user }: any) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [activeChannel, setActiveChannel] = useState("Support Admin");

  useEffect(() => {
    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Load messages from localStorage when contact changes
  useEffect(() => {
    const saved = localStorage.getItem(`chat_${activeChannel}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([]);
    }
  }, [activeChannel]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${activeChannel}`, JSON.stringify(messages));
    }
  }, [messages, activeChannel]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [staff] = useState<any[]>(() => JSON.parse(localStorage.getItem("m_staff") || "[]"));

  const CONTACTS = [
    { name: "Support Admin", role: "Directeur" },
    ...staff.map(s => ({ name: s.name, role: s.role + (s.subject ? " " + s.subject : "") }))
  ];

  useEffect(() => {
    socket.emit("join-room", activeChannel);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => {
        // Prevent duplicate messages if already added optimistically
        if (prev.some(m => m.text === msg.text && m.timestamp === msg.timestamp)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      socket.off("receive-message");
    };
  }, [activeChannel]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      room: activeChannel,
      text: input,
      senderName: user?.name || "Élève Anonymous",
      timestamp: new Date().toISOString(),
    };

    // Optimistic update
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("send-message", newMessage);
    
    // Simulate auto-reply for demo if testing
    if (input.toLowerCase().includes("bonjour") || input.toLowerCase().includes("test")) {
      setTimeout(() => {
        const reply = {
          room: activeChannel,
          text: `Bonjour ${user?.name || "Élève"} ! Comment puis-je vous aider aujourd'hui ?`,
          senderName: activeChannel,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, reply]);
      }, 1500);
    }

    setInput("");
  };

  return (
    <div className="flex bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-2xl max-w-6xl w-full h-[600px]">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-xl font-black uppercase tracking-tight text-primary">Messages</h2>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-2">
          {CONTACTS.map((contact) => (
            <button
              key={contact.name}
              onClick={() => setActiveChannel(contact.name)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-3xl transition-all group",
                activeChannel === contact.name 
                  ? "bg-white shadow-md shadow-slate-200/50 scale-102" 
                  : "hover:bg-white/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white transition-all",
                activeChannel === contact.name ? "bg-primary" : "bg-slate-300"
              )}>
                {contact.name[0]}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800">{contact.name}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-primary transition-colors italic">
                  {contact.role}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center font-black">
              {activeChannel[0]}
            </div>
            <div>
              <div className="font-bold text-lg">{activeChannel}</div>
              <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <span className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                {isConnected ? "En ligne" : "Déconnecté"}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-grow p-8 overflow-y-auto space-y-6 scrollbar-hide"
        >
          {messages.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 italic text-sm">Démarrer la discussion avec {activeChannel}...</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.senderName === user?.name;
            return (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col max-w-[70%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className="text-[9px] uppercase font-bold text-slate-400 mb-1 px-1">
                  {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className={cn(
                  "p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm",
                  isMe 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-slate-50 text-slate-800 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="p-6 bg-slate-50/50 border-t border-slate-50 flex gap-4 items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ici..."
            className="flex-grow p-4 bg-white rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
          />
          <button 
            type="submit"
            className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}
