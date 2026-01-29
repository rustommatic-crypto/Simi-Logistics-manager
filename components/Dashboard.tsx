import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity,
  PackageSearch,
  Wallet,
  Users,
  ShieldCheck,
  Link2,
  Truck,
  ChevronRight,
  Play,
  Monitor,
  Wifi,
  Signal,
  Sparkles,
  Zap,
  Target,
  RefreshCcw,
  Volume2,
  Bike,
  Car,
  BusFront,
  Plane
} from 'lucide-react';
import { UserRole, RouteMode, VerificationStatus, OrderCluster, VehicleType } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';
import { ambientEngine } from '../services/ambientEngine';

// Vehicle icon helper restored for dashboard
const getDashVehicleIcon = (type: string, size: number = 24) => {
  switch (type.toLowerCase()) {
    case 'bike': return <Bike size={size} />;
    case 'car': return <Car size={size} />;
    case 'van':
    case 'bus': return <BusFront size={size} />;
    case 'truck': return <Truck size={size} />;
    case 'plane': return <Plane size={size} />;
    default: return <Signal size={size} />;
  }
};

const gridFeed = [
  { 
    id: 'orient-1', 
    type: 'briefing', 
    vehicleRequired: 'Signal',
    title: "Simi's Mission Briefing", 
    subtitle: "LIVE ORIENTATION NODE",
    content: "Oya, Pilot! Listen well well. I be Simi, your Area Manager. Whether you move Bike, Van, or Big Truck—I dey here to scan the grid for jobs wey go favor your pocket. No dulling!",
    image: 'https://images.unsplash.com/photo-1545147422-51b27b456e09?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'news-1', 
    type: 'trip', 
    vehicleRequired: 'Truck',
    title: 'Road to Kano is Open', 
    subtitle: "LOGISTICS NODE ALPHA",
    content: 'Better job dey wait for long road. Pilots, oya move sharp-sharp! Money plenty for that axis.', 
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 'news-2', 
    type: 'traffic', 
    vehicleRequired: 'Car',
    title: 'Third Mainland Alert', 
    subtitle: "TRAFFIC INTERCEPT",
    content: 'Inward Island is tight o! Lagore reporting heavy hold-up. Use Carter Bridge or just chill small.', 
    image: 'https://images.unsplash.com/photo-1512428559083-a4979b2b51ef?auto=format&fit=crop&q=80&w=1200' 
  }
];

interface DashboardProps {
  userRole: UserRole;
  onNavigate: (tab: string) => void;
  currentMode: RouteMode;
  vStatus?: VerificationStatus;
  activeMission?: OrderCluster | null;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate, currentMode, vStatus, activeMission
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSignalIndex, setCurrentSignalIndex] = useState(0);

  const simi = useMemo(() => new SimiAIService(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPlaying) {
        setCurrentSignalIndex(prev => (prev + 1) % gridFeed.length);
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const playCurrentSignal = async () => {
    if (isPlaying) return;
    const ctx = getOutputContext();
    if (ctx.state === 'suspended') await ctx.resume().catch(console.error);
    
    setIsPlaying(true);
    const signal = gridFeed[currentSignalIndex];
    const text = `Pilot, Signal Intercept: ${signal.title}. ${signal.content}`;

    try {
      ambientEngine.pauseForVoice();
      const audio = await simi.announceJob(text);
      if (audio) {
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => { 
          setIsPlaying(false); 
          ambientEngine.resumeAfterVoice(); 
        };
        source.start();
      } else {
        setIsPlaying(false);
        ambientEngine.resumeAfterVoice();
      }
    } catch (e) { 
      setIsPlaying(false); 
      ambientEngine.resumeAfterVoice(); 
    }
  };

  const currentSignal = gridFeed[currentSignalIndex];

  return (
    <div className="flex flex-col p-4 md:p-10 gap-8 max-w-[1400px] mx-auto pb-40 text-left animate-in fade-in duration-700">
      
      {/* HERO: SIGNAL INTERCEPT (SIMI'S GIST) - RESPONSIVE FIX */}
      <div className="relative w-full min-h-[420px] md:min-h-0 md:aspect-[21/9] bg-black rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/5 group flex flex-col justify-end">
        <img 
          src={currentSignal.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-[3s]" 
          alt="Signal Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 pointer-events-none border-t border-white/10 animate-scanline" />
        
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-wrap items-center gap-3">
           <div className="px-4 py-1.5 bg-[#E60000] text-white text-[9px] font-black uppercase rounded-xl shadow-lg flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> SIGNAL INTERCEPT
           </div>
           <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white/40 text-[9px] font-black uppercase rounded-xl">
             {currentSignal.subtitle}
           </div>
        </div>

        <div className="relative z-10 p-6 md:p-10 space-y-6">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 text-left max-w-3xl">
                <button 
                  onClick={playCurrentSignal}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all shadow-2xl shrink-0 ${isPlaying ? 'bg-[#E60000] text-white animate-pulse' : 'bg-white text-black hover:scale-105 active:scale-95'}`}
                >
                   {isPlaying ? <Volume2 size={32} /> : <Play fill="black" size={24} className="ml-0.5" />}
                </button>
                <div className="space-y-1">
                   <p className="text-[9px] font-black text-[#E60000] uppercase tracking-[0.4em] italic">SIMI'S GIST</p>
                   <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9] display-font">{currentSignal.title}</h2>
                   <p className="text-white/60 font-bold italic mt-3 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none">{currentSignal.content}</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('community')}
                className="w-full md:w-auto px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/10 text-white rounded-[1.2rem] font-black text-[9px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                 <Users size={14} /> EXPLORE GRID FEED
              </button>
           </div>
        </div>
      </div>

      {/* QUICK STATS HUB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <div onClick={() => onNavigate('orders')} className="bg-[#0A0A0A] border-4 border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 text-left cursor-pointer hover:border-[#E60000]/20 transition-all group">
            <div className="flex justify-between items-start mb-4 md:mb-6">
               <div className="p-2.5 md:p-3 bg-[#E60000]/10 text-[#E60000] rounded-xl group-hover:scale-110 transition-transform"><PackageSearch size={20} /></div>
               <span className="text-[8px] font-black text-emerald-500 uppercase italic">Live Jobs</span>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Market</p>
            <p className="text-xl md:text-2xl font-black text-white italic tech-mono mt-1 leading-none">JOB BOARD</p>
         </div>
         <div onClick={() => onNavigate('earnings')} className="bg-[#0A0A0A] border-4 border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 text-left cursor-pointer hover:border-emerald-500/20 transition-all group">
            <div className="flex justify-between items-start mb-4 md:mb-6">
               <div className="p-2.5 md:p-3 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:scale-110 transition-transform"><Wallet size={20} /></div>
               <span className="text-[8px] font-black text-emerald-500 uppercase italic">₦500</span>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Wallet</p>
            <p className="text-xl md:text-2xl font-black text-white italic tech-mono mt-1 leading-none">MY MONEY</p>
         </div>
         <div onClick={() => onNavigate('community')} className="bg-[#0A0A0A] border-4 border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 text-left cursor-pointer hover:border-blue-500/20 transition-all group">
            <div className="flex justify-between items-start mb-4 md:mb-6">
               <div className="p-2.5 md:p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform"><Users size={20} /></div>
               <span className="text-[8px] font-black text-blue-500 uppercase italic">2.4k Online</span>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Network</p>
            <p className="text-xl md:text-2xl font-black text-white italic tech-mono mt-1 leading-none">THE GRID</p>
         </div>
         <div onClick={() => onNavigate('registration-center')} className="bg-[#0A0A0A] border-4 border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 text-left cursor-pointer hover:border-[#E60000]/20 transition-all group">
            <div className="flex justify-between items-start mb-4 md:mb-6">
               <div className="p-2.5 md:p-3 bg-white/5 text-white/30 rounded-xl group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
               <span className="text-[8px] font-black text-white/20 uppercase italic">Level 4</span>
            </div>
            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Papers</p>
            <p className="text-xl md:text-2xl font-black text-white italic tech-mono mt-1 leading-none">VERIFIED</p>
         </div>
      </div>

      {/* SIGNALS LISTING */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2 md:px-4">
           <h3 className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Recent Signals on Grid</h3>
           <button className="text-[9px] font-black text-[#E60000] uppercase italic tracking-widest flex items-center gap-2">LIVE SYNC <RefreshCcw size={10} className="animate-spin" /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
           {gridFeed.map((item, idx) => (
             <div 
               key={item.id} 
               onClick={() => setCurrentSignalIndex(idx)}
               className={`p-6 md:p-8 bg-[#0A0A0A] border-4 rounded-[2.5rem] md:rounded-[3rem] transition-all cursor-pointer flex items-center gap-6 md:gap-8 group ${currentSignalIndex === idx ? 'border-[#E60000]/40 bg-[#E60000]/5' : 'border-white/5 hover:border-white/10'}`}
             >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-white/5 flex items-center justify-center transition-all shrink-0">
                   <div className={`text-white/20 group-hover:text-white transition-colors`}>
                      {getDashVehicleIcon(item.vehicleRequired, 32)}
                   </div>
                </div>
                <div className="text-left flex-1 min-w-0">
                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 truncate">{item.subtitle}</p>
                   <h4 className="text-lg md:text-xl font-black text-white italic uppercase tracking-tighter leading-none truncate">{item.title}</h4>
                </div>
                <ChevronRight size={20} className={currentSignalIndex === idx ? 'text-[#E60000]' : 'text-white/10'} />
             </div>
           ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;