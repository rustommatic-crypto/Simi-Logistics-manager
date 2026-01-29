
import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  ArrowLeft, 
  AlertTriangle,
  Navigation,
  Activity,
  Timer,
  Check
} from 'lucide-react';
import { OrderCluster, RouteMode } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';

interface OngoingWorkProps {
  mission: OrderCluster;
  onComplete: () => void;
  onCancel: () => void;
  onNavigate: (tab: string) => void;
  routeMode: RouteMode;
}

const OngoingWork: React.FC<OngoingWorkProps> = ({ mission, onComplete, onCancel, onNavigate, routeMode }) => {
  const [completedOrders, setCompletedOrders] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLate, setIsLate] = useState(false);
  const [simiWarned, setSimiWarned] = useState(false);
  const simiService = useRef(new SimiAIService());

  // Simulate progress and time monitoring
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const next = Math.min(prev + 0.5, 100);
        if (next > 75 && !isLate) setIsLate(true);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLate]);

  // Simi Voice Reminder if Pilot is late
  useEffect(() => {
    if (isLate && !simiWarned) {
      setSimiWarned(true);
      triggerTimeWarning();
    }
  }, [isLate, simiWarned]);

  const triggerTimeWarning = async () => {
    const text = "Driver, you dey behind time o! No dulling for road. People dey wait for waybill. Oya, move sharp-sharp!";
    try {
      const audio = await simiService.current.announceJob(text);
      if (audio) {
        const ctx = getOutputContext();
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {}
  };

  const toggleOrderCompletion = (id: string) => {
    if (completedOrders.includes(id)) {
      setCompletedOrders(prev => prev.filter(oid => oid !== id));
    } else {
      setCompletedOrders(prev => [...prev, id]);
    }
  };

  const allDone = completedOrders.length === mission.orders.length;

  const getTheme = () => {
    switch (routeMode) {
      case RouteMode.TRIP: return { accent: 'text-blue-500', bg: 'bg-blue-600', border: 'border-blue-500/20' };
      case RouteMode.SPECIAL: return { accent: 'text-amber-500', bg: 'bg-amber-500', border: 'border-amber-500/20' };
      default: return { accent: 'text-[#E60000]', bg: 'bg-[#E60000]', border: 'border-[#E60000]/20' };
    }
  };

  const theme = getTheme();

  return (
    <div className="p-4 md:p-10 space-y-10 max-w-5xl mx-auto pb-60 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
           <button onClick={() => onNavigate('dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-xl text-white/40"><ArrowLeft size={20} /></button>
           <div>
              <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase display-font tracking-tighter leading-none">Active Work</h1>
              <p className="text-white/30 font-bold italic text-[10px] mt-1 uppercase tracking-widest leading-none">Simi's Live Mission Tracker</p>
           </div>
        </div>
        <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 border shadow-lg transition-all ${isLate ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-white/40'}`}>
           {isLate ? <AlertTriangle size={18} /> : <Timer size={18} />}
           <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{isLate ? 'BEHIND TIME' : 'ON SCHEDULE'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* LEFT COLUMN: MISSION HUD */}
         <div className="lg:col-span-7 space-y-8">
            <div className={`bg-[#0A0A0A] border-4 ${theme.border} rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden`}>
               <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <p className={`text-[10px] font-black uppercase tracking-widest italic ${theme.accent}`}>Target Corridor</p>
                     <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{mission.id.split('-')[1] || 'Mainland-Island'}</h2>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">TOTAL YIELD</p>
                     <p className="text-3xl font-black tech-mono text-emerald-500 italic">₦{mission.totalPrice.toLocaleString()}</p>
                  </div>
               </div>

               {/* PROGRESS BAR */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-white/30">Mission Progress</span>
                     <span className={isLate ? 'text-red-500' : theme.accent}>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                     <div 
                       className={`h-full transition-all duration-1000 ${isLate ? 'bg-red-500 shadow-[0_0_20px_#ef4444]' : `${theme.bg} shadow-[0_0_20px_rgba(0,0,0,0.5)]`}`} 
                       style={{ width: `${progress}%` }} 
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <p className="text-[9px] font-black text-white/20 uppercase mb-2">Estimated Arrival</p>
                     <p className="text-xl font-black text-white italic uppercase">{mission.estimatedTime} MINS</p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <p className="text-[9px] font-black text-white/20 uppercase mb-2">Drops Remaining</p>
                     <p className="text-xl font-black text-white italic uppercase">{mission.orders.length - completedOrders.length}</p>
                  </div>
               </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button 
                 onClick={onCancel}
                 className="py-6 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center gap-3"
               >
                  <XCircle size={18} /> ABORT MISSION
               </button>
               <button 
                 onClick={onComplete}
                 disabled={!allDone}
                 className={`py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${allDone ? 'bg-emerald-600 text-white shadow-2xl hover:scale-105 active:scale-95' : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'}`}
               >
                  <CheckCircle2 size={18} /> FINALIZE BUNDLE
               </button>
            </div>
         </div>

         {/* RIGHT COLUMN: ORDER LIST */}
         <div className="lg:col-span-5 space-y-4">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic mb-2">Drop Sequence</h3>
            <div className="space-y-3">
               {mission.orders.map((order, idx) => {
                 const isDone = completedOrders.includes(order.id);
                 return (
                   <div 
                     key={order.id} 
                     className={`p-6 bg-[#0A0A0A] border-2 rounded-[2rem] transition-all flex items-center justify-between gap-6 group ${isDone ? 'border-emerald-500/30 opacity-60' : 'border-white/5 hover:border-white/10'}`}
                   >
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/30'}`}>
                            {isDone ? <Check size={24} /> : <span className="text-xl font-black tech-mono italic">{idx + 1}</span>}
                         </div>
                         <div className="text-left">
                            <h4 className={`text-lg font-black italic uppercase leading-none ${isDone ? 'text-white/40 line-through' : 'text-white'}`}>{order.dest}</h4>
                            <p className="text-[10px] font-black text-white/20 uppercase mt-2 tracking-widest flex items-center gap-2">
                               <MapPin size={10} className={theme.accent} /> {order.pickup}
                            </p>
                         </div>
                      </div>
                      <button 
                        onClick={() => toggleOrderCompletion(order.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border ${isDone ? 'bg-white/5 border-white/10 text-white/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/10'}`}
                      >
                         <CheckCircle2 size={24} />
                      </button>
                   </div>
                 );
               })}
            </div>

            <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] mt-6">
               <div className="flex items-center gap-4 text-white/30 mb-4">
                  <Activity size={20} className={theme.accent} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural Tip</span>
               </div>
               <p className="text-sm font-bold text-white/50 italic leading-relaxed">
                  "Driver, if you reach the drop point and person no pick call, just alert Simi for help. No dulling!"
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OngoingWork;
