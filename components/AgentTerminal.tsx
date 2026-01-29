
import React, { useState } from 'react';
import { 
  Globe, 
  Plane, 
  Anchor, 
  Truck, 
  Zap, 
  ArrowLeft, 
  Home, 
  RefreshCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Ticket,
  Link as LinkIcon,
  Search,
  MessageCircle,
  Clock,
  Briefcase,
  Users
} from 'lucide-react';
import { GlobalLead, ServiceType, AgentCategory } from '../types';

const mockLeads: GlobalLead[] = [
  { id: 'GL-9921', source: 'AreaGPT', type: ServiceType.COURIER, subType: 'Air Cargo', origin: 'Ikeja, Lagos', destination: 'London, UK', payload: '45kg Electronics', budget: '₦250k - ₦300k', timestamp: '2 mins ago', apiLinked: true },
  { id: 'GL-8812', source: 'AreaGPT', type: ServiceType.TRAVEL, subType: 'Business Class', origin: 'Abuja, NG', destination: 'Dubai, UAE', payload: '1 Passenger', timestamp: '15 mins ago', apiLinked: true },
  { id: 'GL-7733', source: 'AreaGPT', type: ServiceType.COURIER, subType: 'Sea Freight', origin: 'Apapa Port', destination: 'Cotonou, BJ', payload: '20ft Container (Spares)', timestamp: '30 mins ago' },
  { id: 'GL-6644', source: 'AreaGPT', type: ServiceType.TRAVEL, subType: 'Luxury Bus', origin: 'Lagos, NG', destination: 'Accra, GH', payload: '4 Passengers', timestamp: '1h ago' },
];

interface AgentTerminalProps {
  agentCat?: AgentCategory;
  onNavigate: (tab: string) => void;
}

const AgentTerminal: React.FC<AgentTerminalProps> = ({ agentCat, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'unquoted' | 'api'>('all');
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = (id: string) => {
    setClaimingId(id);
    setTimeout(() => {
      setClaimingId(null);
      alert("Mission Locked! Simi: 'Global Lead linked to your dashboard. Oya, process am sharp-sharp!'");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-[1400px] mx-auto pb-40 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
           <button onClick={() => onNavigate('dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all group">
              <ArrowLeft size={24} className="group-hover:-translate-x-1" />
           </button>
           <div>
              <h1 className="text-5xl font-black italic uppercase display-font tracking-tighter text-white">Agent Grid</h1>
              <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] italic mt-2">AreaGPT Global Mission Terminal</p>
           </div>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
              <LinkIcon size={18} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-emerald-500">API HUB: CONNECTED</span>
           </div>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={120} /></div>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">New Global Leads</p>
            <p className="text-5xl font-black text-white italic tech-mono">14</p>
            <div className="mt-6 flex items-center gap-2 text-emerald-500 text-[10px] font-black">
               <RefreshCcw size={14} className="animate-spin" /> LIVE REFRESH
            </div>
         </div>
         <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">My Active Missions</p>
            <p className="text-5xl font-black text-white italic tech-mono">08</p>
         </div>
         <div className="bg-emerald-500/10 border-4 border-emerald-500/20 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Yield Potential (24h)</p>
            <p className="text-5xl font-black text-white italic tech-mono">₦1.4M</p>
         </div>
      </div>

      {/* Main Grid Feed */}
      <div className="space-y-8">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 shadow-inner">
               <button onClick={() => setFilter('all')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-white/20'}`}>All Leads</button>
               <button onClick={() => setFilter('unquoted')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${filter === 'unquoted' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Needs Quote</button>
               <button onClick={() => setFilter('api')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${filter === 'api' ? 'bg-emerald-500 text-black shadow-lg' : 'text-white/20'}`}>API Ready</button>
            </div>
            <div className="relative w-full md:w-96">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
               <input placeholder="Search Global Manifest..." className="w-full bg-black/40 border-2 border-white/5 rounded-2xl pl-16 pr-8 py-4 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all" />
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mockLeads.map((lead) => (
              <div key={lead.id} className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] p-10 flex flex-col gap-10 hover:border-emerald-500/30 transition-all group shadow-2xl relative overflow-hidden">
                 {claimingId === lead.id && (
                   <div className="absolute inset-0 z-20 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
                      <RefreshCcw size={64} className="animate-spin text-white mb-6" />
                      <h3 className="text-3xl font-black text-white uppercase italic">SYNCING NODE...</h3>
                   </div>
                 )}
                 
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                       <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white shadow-xl">
                          {lead.type === ServiceType.TRAVEL ? <Plane size={40} /> : <Briefcase size={40} />}
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                             <span className="px-3 py-1 bg-[#E60000] text-white text-[8px] font-black uppercase rounded-lg italic">AREAGPT LEAD</span>
                             <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{lead.id}</span>
                          </div>
                          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{lead.subType}</h3>
                          <p className="text-white/40 text-sm font-bold mt-2 italic">{lead.payload}</p>
                       </div>
                    </div>
                    {lead.apiLinked && (
                       <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 shadow-lg">
                          <Zap size={14} className="text-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">API LINKED</span>
                       </div>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-6 p-8 bg-white/5 rounded-[3rem] border border-white/10">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-white/20 uppercase italic">From</p>
                       <p className="text-xl font-black text-white italic uppercase truncate">{lead.origin}</p>
                    </div>
                    <div className="space-y-1 text-right">
                       <p className="text-[9px] font-black text-white/20 uppercase italic">To</p>
                       <p className="text-xl font-black text-white italic uppercase truncate">{lead.destination}</p>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Clock className="text-white/20" size={20} />
                       <span className="text-[10px] font-bold text-white/20 uppercase italic tracking-widest">{lead.timestamp}</span>
                    </div>
                    <div className="flex gap-4">
                       <button className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10">
                          <MessageCircle size={24} />
                       </button>
                       <button onClick={() => handleClaim(lead.id)} className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase italic tracking-tighter hover:scale-105 transition-all shadow-xl">
                          {lead.apiLinked ? 'INSTANT BOOKING' : 'QUOTATION MISSION'}
                       </button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AgentTerminal;
