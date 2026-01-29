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
  Signal
} from 'lucide-react';
import { UserRole, RouteMode, VerificationStatus, OrderCluster } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';
import { ambientEngine } from '../services/ambientEngine';

const gridFeed = [
  { 
    id: 'orient-1', 
    type: 'briefing', 
    title: "Simi's Mission Briefing", 
    subtitle: "LIVE ORIENTATION NODE",
    content: "Oya, Pilot! Listen well well. I be Simi, your Area Manager. Whether you move Bike, Van, or Big Truck—I dey here to scan the grid for jobs wey go favor your pocket. No dulling!",
    image: 'https://images.unsplash.com/photo-1545147422-51b27b456e09?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'news-1', 
    type: 'trip', 
    title: 'Road to Kano is Open', 
    subtitle: "LOGISTICS NODE ALPHA",
    content: 'Better job dey wait for long road. Pilots, oya move sharp-sharp! Money plenty for that axis.', 
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 'news-2', 
    type: 'traffic', 
    title: 'Third Mainland Alert', 
    subtitle: "TRAFFIC INTERCEPT",
    content: 'Inward Island is tight o! Lagore reporting heavy hold-up. Use Carter Bridge or just chill small.', 
    image: 'https://images.unsplash.com/photo-1512428559083-a4979b2b51ef?auto=format&fit=crop&q=80&w=1200' 
  },
  {
    id: 'orient-2',
    type: 'briefing',
    title: 'Global Agent Access',
    subtitle: "AUTHORITY NODE v2",
    content: "Global Agents, listen up! I go link you to international leads wey get weight—Courier or Travel, the Grid is yours.",
    image: 'https://images.unsplash.com/photo-1449130015084-2d48a345ae62?auto=format&fit=crop&q=80&w=1200'
  }
];

interface DashboardProps {
  userRole: UserRole;
  onNavigate: (tab: string) => void;
  currentMode: RouteMode;
  vStatus?: VerificationStatus;
  activeMission?: OrderCluster | null;
  targetDestination?: string;
  activeManifest?: any;
  onUpdateManifest?: (manifest: any) => void;
  regLevels?: any[];
  onUpdateMission?: (mission: any) => void;
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

  const navTabs = [
    { id: 'orders', icon: PackageSearch, label: 'Job Board' },
    { id: 'earnings', icon: Wallet, label: 'My Money' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'registration-center', icon: ShieldCheck, label: 'Admin Papers' }
  ];

  return (
    <div className="flex flex-col p-4 md:p-10 gap-6 max-w-[1400px] mx-auto pb-40 text-left animate-in fade-in duration-700">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
         {navTabs.map((tab) => (
           <button 
             key={tab.id} 
             onClick={() => onNavigate(tab.id)}
             className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full whitespace-nowrap hover:bg-white/[0.08] transition-all"
           >
             <tab.icon size={12} className="text-[#E60000]" />
             <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{tab.label}</span>
           </button>
         ))}
      </div>

      <div className="relative w-full aspect-video md:aspect-[21/9] bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl group ring-1 ring-white/10">
          <img 
            key={currentSignal.id}
            src={currentSignal.image} 
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-20 transition-all duration-[2s] group-hover:opacity-40" 
            alt="Signal" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
             <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
             <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-scanline" />
          </div>

          <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
             <div className="px-4 py-1.5 bg-[#E60000] text-white text-[9px] font-black uppercase rounded-lg shadow-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]" />
                GRID SIGNAL {currentSignalIndex + 1}/{gridFeed.length}
             </div>
             <div className="px-4 py-1.5 bg-black/60 border border-white/10 backdrop-blur-md text-white/60 text-[9px] font-black uppercase rounded-lg flex items-center gap-2">
                <Wifi size={10} className="text-emerald-500" /> SYNCED
             </div>
          </div>

          <div className="absolute top-8 right-8 flex items-center gap-4 z-20 opacity-40">
             <Signal size={16} />
             <Activity size={16} className="text-[#E60000]" />
          </div>

          <div className="relative p-8 md:p-16 flex flex-col justify-end h-full z-10 space-y-6">
             <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
                   <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em] italic">{currentSignal.subtitle}</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none display-font animate-in slide-in-from-left-4">
                  {currentSignal.title}
                </h2>
                <p className="text-base md:text-xl font-bold text-white/50 italic leading-snug line-clamp-2 md:line-clamp-none">
                  "{currentSignal.content}"
                </p>
             </div>

             <div className="flex flex-wrap items-center gap-6 pt-6">
                <button 
                  onClick={playCurrentSignal}
                  disabled={isPlaying}
                  className={`group flex items-center gap-6 px-10 py-6 rounded-[2.5rem] font-black text-xl uppercase italic tracking-tighter transition-all ${isPlaying ? 'bg-white/5 text-white/20 border border-white/10' : 'bg-[#E60000] text-white shadow-[0_20px_50px_rgba(230,0,0,0.3)] hover:scale-105 active:scale-95'}`}
                >
                   {isPlaying ? <Activity size={32} className="animate-pulse" /> : <Play fill="white" size={32} className="group-hover:rotate-12 transition-transform" />}
                   {isPlaying ? 'SIGNAL SYNCING...' : 'SYNC SIGNAL'}
                </button>
                
                <div className="hidden md:flex items-center gap-4 px-6 py-4 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
                   {gridFeed.map((_, idx) => (
                     <div 
                       key={idx} 
                       className={`h-1.5 rounded-full transition-all duration-700 ${currentSignalIndex === idx ? 'w-8 bg-[#E60000]' : 'w-2 bg-white/10'}`} 
                     />
                   ))}
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] pointer-events-none">
             <Monitor size={300} className="text-white" />
          </div>
      </div>

      <div className="w-full bg-[#0A0A0A] border-4 border-white/5 rounded-[2rem] p-4 md:p-6 overflow-hidden relative">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 shrink-0">
               <div className="w-2 h-2 bg-[#E60000] rounded-full animate-ping" />
               <span className="text-[10px] font-black text-[#E60000] uppercase tracking-widest italic">NEURAL TICKER:</span>
            </div>
            <div className="flex-1 overflow-hidden">
               <div className="flex items-center gap-12 animate-ticker whitespace-nowrap">
                  {gridFeed.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                       <span className="text-white/20">●</span>
                       <span className="text-xs font-black text-white/60 uppercase italic tracking-widest">{item.title}</span>
                    </div>
                  ))}
                  {gridFeed.map((item) => (
                    <div key={item.id + '_dup'} className="flex items-center gap-4">
                       <span className="text-white/20">●</span>
                       <span className="text-xs font-black text-white/60 uppercase italic tracking-widest">{item.title}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('workspace')}
            className="group relative h-40 md:h-56 bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-8 flex flex-col justify-between overflow-hidden hover:border-[#25D366]/30 transition-all text-left shadow-2xl"
          >
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Link2 size={120} />
             </div>
             <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[#25D366]/10 rounded-lg">
                      <Link2 size={16} className="text-[#25D366]" />
                   </div>
                   <span className="text-[9px] font-black text-[#25D366] uppercase tracking-[0.2em] italic">Neural Bridge</span>
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">WhatsApp Link</h3>
                <p className="text-xs font-bold text-white/30 uppercase mt-1 italic tracking-widest">Waka Node Sync</p>
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase italic tracking-widest group-hover:text-white transition-all relative z-10">
                OPEN TERMINAL <ChevronRight size={12} />
             </div>
          </button>

          <button 
            onClick={() => onNavigate('trips')}
            className="group relative h-40 md:h-56 bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-8 flex flex-col justify-between overflow-hidden hover:border-blue-500/30 transition-all text-left shadow-2xl"
          >
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Truck size={120} />
             </div>
             <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Truck size={16} className="text-blue-500" />
                   </div>
                   <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] italic">Waybill Broadcast</span>
                </div>
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Area FM</h3>
                <p className="text-xs font-bold text-white/30 uppercase mt-1 italic tracking-widest">Trips & Manifest</p>
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-white/20 uppercase italic tracking-widest group-hover:text-white transition-all relative z-10">
                LAUNCH MANIFEST <ChevronRight size={12} />
             </div>
          </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Dashboard;