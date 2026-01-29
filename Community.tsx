
import React, { useState, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Video, 
  Image as ImageIcon,
  MoreHorizontal,
  PlusCircle,
  Play,
  Zap,
  Radio,
  X,
  Users,
  HandCoins,
  Camera,
  ArrowLeft,
  Home,
  RefreshCcw,
  Activity,
  ChevronRight
} from 'lucide-react';
import { CommunityPost, ChatMessage } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';

interface CommunityProps {
  onViewProfile?: (id: string) => void;
  onNavigate?: (tab: string) => void;
}

const mockPosts: CommunityPost[] = [
  { id: '1', user: 'Baba Tunde', userId: 'u1', content: 'Safe journey everyone! My truck is moving for Abuja now with some extra space.', time: '2 mins ago', likes: 12, comments: 2, mediaUrl: 'https://images.unsplash.com/photo-1586191582151-f746313d3013?auto=format&fit=crop&q=80&w=800', mediaType: 'image' },
  { id: '2', user: 'Lekki Rider', userId: 'u2', content: 'Avoid Lekki gate, police are checking bikes heavy. Follow the back road.', time: '5 mins ago', likes: 45, comments: 8 },
  { id: '3', user: 'Dispatch King', userId: 'u3', content: 'I have 5 small parcels for Surulere. Who is around?', time: '15 mins ago', likes: 8, comments: 0, isJobOrder: true, price: 2500 },
];

const mockPrivateChats: ChatMessage[] = [
  { id: 'm1', senderId: 'u5', senderName: 'Musa Driver', text: 'Bro, you still have space for that Kano trip?', time: '10:00 AM', isMe: false },
  { id: 'm2', senderId: 'me', senderName: 'Me', text: 'Yes, I have small space left. You have goods?', time: '10:05 AM', isMe: true },
];

const Community: React.FC<CommunityProps> = ({ onViewProfile, onNavigate }) => {
  const [view, setView] = useState<'public' | 'private'>('public');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [isSyncingBroadcast, setIsSyncingBroadcast] = useState(false);
  const [postType, setPostType] = useState<'text' | 'job'>('text');
  const [input, setInput] = useState('');
  const [activePrivateChat, setActivePrivateChat] = useState<string | null>(null);
  const simiService = useRef(new SimiAIService());

  const handlePost = () => {
    setShowPostModal(false);
    setInput('');
  };

  const handleWatchBroadcast = async () => {
    setIsSyncingBroadcast(true);
    try {
      const text = "Neural Intercept locked. Connecting to Road Node Alpha. Maryland bridge set, but Ojota hold-up don start.";
      const audio = await simiService.current.announceJob(text);
      if (audio) {
        const ctx = getOutputContext();
        if (ctx.state === 'suspended') await ctx.resume();
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {}

    setTimeout(() => {
      setIsSyncingBroadcast(false);
      setShowBroadcast(true);
    }, 2000);
  };

  const closeBroadcast = () => {
    setShowBroadcast(false);
    setIsSyncingBroadcast(false);
  };

  const renderPublicFeed = () => (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <div key={post.id} className={`neural-card p-6 md:p-8 space-y-6 overflow-hidden transition-all hover:border-white/10 ${post.isJobOrder ? 'border-[#E60000]/40 bg-[#E60000]/5' : 'bg-white/[0.02]'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewProfile?.(post.userId)}>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-white border border-white/5 uppercase italic">
                {post.user.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-white text-lg italic uppercase leading-none tracking-tight">{post.user}</h4>
                <p className="text-[10px] text-white/30 font-bold uppercase mt-1 tracking-widest">{post.time}</p>
              </div>
            </div>
            <button className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
          </div>
          
          <p className="text-xl font-medium text-white italic leading-relaxed text-left">{post.content}</p>

          {post.mediaUrl && (
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 group">
              <img src={post.mediaUrl} className="w-full object-cover max-h-[400px] grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Post media" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-full text-white/60">
                <ImageIcon size={18} />
              </div>
            </div>
          )}

          {post.isJobOrder && (
            <div className="bg-black/40 backdrop-blur-md p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#E60000]/20">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-[#E60000] text-white rounded-xl shadow-lg">
                    <HandCoins size={20} />
                 </div>
                 <div className="text-left">
                    <p className="text-[9px] font-black uppercase text-[#E60000] tracking-widest">Opportunity</p>
                    <p className="text-xl font-black italic tech-mono text-white">₦{post.price?.toLocaleString()}</p>
                 </div>
              </div>
              <button className="w-full sm:w-auto px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                CLAIM JOB
              </button>
            </div>
          )}

          <div className="flex items-center gap-6 pt-4 border-t border-white/5">
             <button className="flex items-center gap-2 text-white/30 font-black text-[10px] uppercase hover:text-white transition-all">
               <Zap size={16} className="text-[#E60000]" /> {post.likes}
             </button>
             <button className="flex items-center gap-2 text-white/30 font-black text-[10px] uppercase hover:text-white transition-all">
               <MessageCircle size={16} /> {post.comments}
             </button>
             <button 
               onClick={() => setView('private')}
               className="flex items-center gap-2 text-[#E60000] font-black text-[10px] uppercase px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-[#E60000]/10 transition-all ml-auto"
             >
               <Send size={16} /> Private Chat
             </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPrivateChats = () => {
    if (activePrivateChat) {
      return (
        <div className="neural-card flex flex-col h-[550px] overflow-hidden bg-black/20 border-white/5">
          <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button onClick={() => setActivePrivateChat(null)} className="p-2 hover:bg-white/10 rounded-lg text-white/40"><X size={20} /></button>
               <div className="w-10 h-10 bg-[#E60000] rounded-xl flex items-center justify-center text-white font-black italic">M</div>
               <div className="text-left">
                 <p className="font-black italic uppercase text-white tracking-tight">{activePrivateChat}</p>
                 <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Synced</p>
               </div>
            </div>
            <button className="p-3 bg-white/5 rounded-xl text-white/20"><MoreHorizontal size={18} /></button>
          </div>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
            {mockPrivateChats.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl text-left ${
                  msg.isMe ? 'bg-[#E60000] text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                }`}>
                  <p className="font-medium italic text-sm leading-relaxed">{msg.text}</p>
                  <p className={`text-[8px] mt-2 font-black uppercase opacity-40`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white/[0.03] border-t border-white/5 flex gap-3">
            <input 
              placeholder="Start typing..."
              className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-[#E60000] font-bold text-sm text-white"
            />
            <button className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {['Musa Driver', 'Sarah Keke', 'John Truck'].map((name, i) => (
          <div 
            key={i} 
            onClick={() => setActivePrivateChat(name)}
            className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center justify-between hover:bg-white/[0.05] hover:border-[#E60000]/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/5 rounded-[1.2rem] flex items-center justify-center text-white/20 font-black italic text-xl group-hover:bg-[#E60000] group-hover:text-white transition-all">
                {name.charAt(0)}
              </div>
              <div className="text-left">
                <h4 className="text-lg font-black italic text-white uppercase leading-none tracking-tight">{name}</h4>
                <p className="text-xs text-white/30 font-medium italic mt-2">Simi detected a message from this node.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Live</p>
              <div className="inline-block p-1 bg-[#E60000] text-white rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-5xl mx-auto pb-40 animate-in fade-in duration-500 text-left">
      {/* NAVIGATION HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate?.('dashboard')} 
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-black italic uppercase display-font tracking-tighter text-white">Community</h1>
            <p className="text-[8px] font-black text-[#E60000] uppercase tracking-widest leading-none mt-1">Global Interaction Node</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-[#E60000] text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] italic tracking-widest"
        >
          <PlusCircle size={18} /> NEW POST
        </button>
      </div>

      {/* TV HEADER SCREEN */}
      <div className="relative w-full aspect-video md:aspect-[21/9] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 group">
        <img 
          src="https://images.unsplash.com/photo-1449130015084-2d48a345ae62?auto=format&fit=crop&q=80&w=1200" 
          className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-[3s]" 
          alt="Shared View"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        
        {/* LIVE BADGE */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           <div className="px-4 py-1.5 bg-[#E60000] text-white text-[9px] font-black uppercase rounded-lg shadow-lg flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> BROADCAST NODE
           </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5 text-left">
                <div className="w-16 h-16 bg-white/[0.05] border border-white/10 backdrop-blur-xl rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl transition-all group-hover:bg-[#E60000]">
                   <Play fill="white" size={24} className="ml-1" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-[#E60000] uppercase tracking-widest mb-1">Trending Gist</p>
                   <h2 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none display-font">"Road is clear toward Maryland"</h2>
                </div>
              </div>
              <button onClick={handleWatchBroadcast} className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase rounded-xl shadow-xl hover:scale-105 transition-all tracking-widest">
                 WATCH LIVE
              </button>
           </div>
        </div>
      </div>

      {/* TABS & FEED */}
      <div className="space-y-8">
        <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 shadow-inner w-full sm:w-fit">
          <button 
            onClick={() => setView('public')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${view === 'public' ? 'bg-white/10 text-white shadow-xl' : 'text-white/20'}`}
          >
            <Users size={16} /> Public Feed
          </button>
          <button 
            onClick={() => setView('private')}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${view === 'private' ? 'bg-white/10 text-white shadow-xl' : 'text-white/20'}`}
          >
            <MessageCircle size={16} /> Private
          </button>
        </div>
        {view === 'public' ? renderPublicFeed() : renderPrivateChats()}
      </div>

      {/* NEURAL BROADCAST MODAL */}
      {showBroadcast && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 animate-in zoom-in duration-500">
           <div className="w-full max-w-5xl aspect-video bg-[#0A0A0A] border-4 border-white/10 rounded-[3rem] relative overflow-hidden shadow-[0_0_100px_rgba(230,0,0,0.3)]">
              <img 
                src="https://images.unsplash.com/photo-1545147422-51b27b456e09?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover grayscale opacity-40 animate-pulse duration-[4s]" 
                alt="Live Feed"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
              <div className="absolute inset-0 pointer-events-none border-t border-[#E60000]/20 animate-scan-slow" />
              
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                 <div className="space-y-1">
                    <div className="px-4 py-1.5 bg-[#E60000] text-white text-[8px] font-black uppercase rounded-lg shadow-lg flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE TELEMETRY
                    </div>
                    <p className="text-xl font-black text-white italic uppercase tech-mono tracking-tight">NODE_LGS_MAR_01</p>
                 </div>
                 <button 
                   onClick={closeBroadcast}
                   className="w-14 h-14 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all shadow-2xl hover:bg-[#E60000]"
                 >
                    <X size={24} />
                 </button>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                 <div className="bg-white/[0.05] backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-14 h-14 bg-[#E60000]/20 border border-[#E60000]/40 rounded-xl flex items-center justify-center text-[#E60000] shadow-2xl animate-pulse">
                       <Activity size={24} />
                    </div>
                    <div className="text-left flex-1">
                       <p className="text-[8px] font-black text-[#E60000] uppercase tracking-[0.4em] mb-1">Simi Intelligence</p>
                       <p className="text-lg font-bold text-white italic leading-snug">"Maryland set, no dulling. But Ojota inward hold-up don start o. Avoid am if you fit."</p>
                    </div>
                 </div>
              </div>
           </div>
           <button 
             onClick={closeBroadcast}
             className="mt-8 px-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-black uppercase tracking-widest italic hover:text-white hover:bg-white/10 transition-all"
           >
             CLOSE LINK
           </button>
        </div>
      )}

      {/* SYNCING LOADER */}
      {isSyncingBroadcast && (
        <div className="fixed inset-0 z-[201] bg-black/98 flex flex-col items-center justify-center space-y-8 animate-in fade-in">
           <RefreshCcw size={64} className="text-[#E60000] animate-spin" />
           <div className="text-center">
              <h2 className="text-3xl font-black italic uppercase display-font tracking-tighter text-white">Connecting...</h2>
              <p className="text-white/20 font-black text-[10px] uppercase tracking-widest mt-2">Handshake Node Locked</p>
           </div>
        </div>
      )}

      {/* POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
           <div className="bg-[#0A0A0A] w-full max-w-xl rounded-[3rem] p-10 space-y-8 animate-in zoom-in duration-300 shadow-2xl border border-white/10">
              <div className="flex justify-between items-center">
                 <h2 className="text-3xl font-black italic uppercase display-font tracking-tighter text-white">New Post</h2>
                 <button onClick={() => setShowPostModal(false)} className="p-3 bg-white/5 text-white/20 hover:text-white rounded-2xl"><X size={24} /></button>
              </div>

              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setPostType('text')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${postType === 'text' ? 'bg-white/10 text-white shadow-lg' : 'text-white/20'}`}
                >
                  Gist / News
                </button>
                <button 
                  onClick={() => setPostType('job')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${postType === 'job' ? 'bg-[#E60000] text-white shadow-lg' : 'text-white/20'}`}
                >
                  Waybill Offer
                </button>
              </div>

              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={postType === 'text' ? "Wetin dey occur for your side?" : "Describe the job for the boys..."}
                className="w-full bg-black/40 border-2 border-white/5 rounded-3xl p-6 text-xl font-bold italic h-40 focus:border-[#E60000] outline-none transition-all placeholder:text-white/10 text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 p-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase transition-all border border-transparent hover:border-white/10 text-white/40 italic">
                  <Camera size={20} className="text-[#E60000]" /> ADD PHOTO
                </button>
                <button className="flex items-center justify-center gap-3 p-5 bg-white/5 rounded-2xl font-black text-[10px] uppercase transition-all border border-transparent hover:border-white/10 text-white/40 italic">
                  <Video size={20} className="text-blue-500" /> RECORD LIVE
                </button>
              </div>

              <button 
                onClick={handlePost}
                className="w-full py-6 bg-[#E60000] text-white rounded-[2rem] text-xl flex items-center justify-center gap-4 shadow-2xl uppercase font-black italic tracking-tighter hover:scale-105 active:scale-95 transition-all"
              >
                POST MISSION <Send size={24} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Community;
