import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  Wallet, 
  Activity, 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  Eye, 
  BarChart3, 
  Lock, 
  Cpu, 
  Globe,
  ArrowLeft,
  RefreshCcw,
  Zap,
  MoreVertical,
  ShieldAlert,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { UserRole, VerificationStatus, VehicleType } from '../types';

interface AdminPanelProps {
  onNavigate: (tab: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'verify' | 'grid' | 'finance'>('verify');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for the admin view
  const verificationQueue = [
    { id: 'V-9901', name: 'Musa Abubakar', role: UserRole.OPERATOR, vehicle: VehicleType.TRUCK, time: '10m ago', status: 'Pending NIN' },
    { id: 'V-8822', name: 'Sarah Chima', role: UserRole.AGENT, vehicle: 'None', time: '25m ago', status: 'Biometric Ready' },
    { id: 'V-7711', name: 'Logos Logistics Ltd', role: UserRole.EMPLOYER, vehicle: 'Fleet', time: '1h ago', status: 'Awaiting Documents' },
  ];

  const systemStats = [
    { label: 'Active Pilots', value: '1,242', trend: '+12%', icon: Truck, color: 'text-blue-500' },
    { label: 'Global Agents', value: '84', trend: '+3%', icon: Globe, color: 'text-emerald-500' },
    { label: 'Neural Missions', value: '452', trend: '+22%', icon: Zap, color: 'text-amber-500' },
    { label: 'Total Vault', value: '₦4.2M', trend: '+8%', icon: Wallet, color: 'text-[#E60000]' },
  ];

  return (
    <div className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto pb-40 text-left animate-in fade-in duration-700">
      
      {/* AUTHORITY HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => onNavigate('dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
              <ArrowLeft size={24} />
           </button>
           <div className="space-y-1">
              <h1 className="text-4xl font-black italic uppercase display-font tracking-tighter text-white">Authority Node</h1>
              <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">System Backend | Back Office Terminal</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
           <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-500 uppercase">Neural Bridge: Syncing</span>
           </div>
           <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
              <ShieldCheck size={12} className="text-blue-500" />
              <span className="text-[9px] font-black text-blue-500 uppercase">Auth: Level 4</span>
           </div>
        </div>
      </div>

      {/* QUICK STATS HUD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
         {systemStats.map((stat, idx) => (
           <div key={idx} className="bg-[#0A0A0A] border border-white/5 p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <stat.icon size={80} />
              </div>
              <div className="relative z-10 space-y-2">
                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{stat.label}</p>
                 <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-5xl font-black italic tech-mono text-white">{stat.value}</span>
                    <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{stat.trend}</span>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* CONTROL TABS */}
      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
         {[
           { id: 'verify', icon: ShieldCheck, label: 'Audit Queue' },
           { id: 'users', icon: Users, label: 'User Nodes' },
           { id: 'grid', icon: Activity, label: 'Live Grid' },
           { id: 'finance', icon: Wallet, label: 'Neural Vault' }
         ].map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveSubTab(tab.id as any)}
             className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest transition-all ${activeSubTab === tab.id ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-white/5 text-white/30 border border-white/5 hover:text-white'}`}
           >
              <tab.icon size={16} /> {tab.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* MAIN CONTENT AREA */}
         <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
               <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                    {activeSubTab === 'verify' ? 'Verification Audits' : activeSubTab === 'users' ? 'Global Node Directory' : 'System Logs'}
                  </h2>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search Node ID..."
                      className="w-full bg-black/60 border border-white/10 rounded-2xl pl-16 pr-8 py-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02] text-[9px] font-black uppercase text-white/20 tracking-widest">
                           <th className="px-10 py-6">Identity Node</th>
                           <th className="px-10 py-6">Persona</th>
                           <th className="px-10 py-6">Machine/Asset</th>
                           <th className="px-10 py-6">Status</th>
                           <th className="px-10 py-6">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {verificationQueue.map((item) => (
                          <tr key={item.id} className="group hover:bg-white/[0.01] transition-all">
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/20 font-black italic">
                                      {item.name.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-white italic uppercase leading-none">{item.name}</p>
                                      <p className="text-[9px] text-white/20 font-bold uppercase mt-1">ID: {item.id}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-8">
                                <span className={`text-[9px] font-black uppercase italic px-3 py-1 rounded-lg border ${item.role === UserRole.AGENT ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                                   {item.role}
                                </span>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-xs font-black text-white/40 italic uppercase">{item.vehicle}</p>
                             </td>
                             <td className="px-10 py-8">
                                <p className="text-[10px] font-black text-amber-500 uppercase italic flex items-center gap-2">
                                   <Activity size={12} className="animate-pulse" /> {item.status}
                                </p>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex gap-2">
                                   <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/20 hover:text-white hover:bg-blue-600 transition-all"><Eye size={16} /></button>
                                   <button className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"><Check size={16} /></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* SIDEBAR INTELLIGENCE */}
         <div className="lg:col-span-4 space-y-8">
            {/* SYSTEM HEALTH */}
            <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl text-left">
               <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Grid Status</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Gemini 3 Flash', status: 'Online', color: 'text-emerald-500' },
                    { label: 'WhatsApp Bridge', status: 'Active', color: 'text-emerald-500' },
                    { label: 'Payment Node', status: 'Stable', color: 'text-emerald-500' },
                    { label: 'Map Telemetry', status: 'Latency: 12ms', color: 'text-amber-500' }
                  ].map((sys, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5">
                       <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">{sys.label}</span>
                       <span className={`text-[9px] font-black uppercase ${sys.color}`}>{sys.status}</span>
                    </div>
                  ))}
               </div>
            </div>

            {/* ALERTS PANEL */}
            <div className="bg-[#E60000]/5 border-4 border-[#E60000]/10 rounded-[3rem] p-10 space-y-8 shadow-2xl text-left">
               <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-[#E60000] uppercase tracking-[0.5em] italic">Intercepts</h3>
                  <ShieldAlert size={20} className="text-[#E60000] animate-pulse" />
               </div>
               <div className="space-y-4">
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black text-white uppercase italic tracking-tighter mb-1">NIN Node Conflict</p>
                     <p className="text-[10px] text-white/30 italic">ID: AL-9921 matches duplicate profile for Pilot Tunde.</p>
                  </div>
                  <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                     <p className="text-[10px] font-black text-white uppercase italic tracking-tighter mb-1">High Yield Outlier</p>
                     <p className="text-[10px] text-white/30 italic">Agent AL-203 processed a ₦450k waybill in 2 mins.</p>
                  </div>
               </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-4">
               <button className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col items-center gap-4 group hover:border-blue-500/20 transition-all">
                  <MessageSquare size={32} className="text-blue-500" />
                  <span className="text-[9px] font-black text-white/40 uppercase italic">Broadcast</span>
               </button>
               <button className="p-8 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col items-center gap-4 group hover:border-amber-500/20 transition-all">
                  <Wrench size={32} className="text-amber-500" />
                  <span className="text-[9px] font-black text-white/40 uppercase italic">Maintenance</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;