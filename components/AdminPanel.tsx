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
  Wrench,
  Navigation
} from 'lucide-react';
import { UserRole, VerificationStatus, VehicleType, FleetVehicle } from '../types';

interface AdminPanelProps {
  onNavigate: (tab: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'verify' | 'grid' | 'fleet'>('verify');
  const [searchQuery, setSearchQuery] = useState('');

  const systemStats = [
    { label: 'Total Grid Nodes', value: '4,821', trend: '+12%', icon: Cpu, color: 'text-blue-500' },
    { label: 'Active Waybills', value: '156', trend: '+5%', icon: Navigation, color: 'text-emerald-500' },
    { label: 'Verification Queue', value: '42', trend: '-2', icon: ShieldCheck, color: 'text-amber-500' },
    { label: 'Total Vault (₦)', value: '12.4M', trend: '+8%', icon: Wallet, color: 'text-[#E60000]' },
  ];

  const verificationQueue = [
    { id: 'AL-NG-991', name: 'Bakare Tunde', sector: 'Lagos', role: 'Pilot', status: 'NIN Verified' },
    { id: 'AL-NG-882', name: 'Chima Logistics', sector: 'Rivers', role: 'Fleet Boss', status: 'Pending Docs' },
    { id: 'AL-GH-001', name: 'Kofi Mensah', sector: 'Accra', role: 'Global Agent', status: 'Biometric Check' },
  ];

  const fleetOverview: FleetVehicle[] = [
    { id: 'v1', type: VehicleType.TRUCK, plateNumber: 'LAG-901-XP', pilotName: 'Danjuma S.', pilotId: 'P-11', status: 'active', installmentDebt: 2500000, totalRevenue: 850000, expiryDates: { insurance: '2025-01-01', roadWorthiness: '2025-01-01', hackneyPermit: '2025-01-01' } },
    { id: 'v2', type: VehicleType.VAN, plateNumber: 'ABJ-442-LQ', pilotName: 'Ibrahim K.', pilotId: 'P-14', status: 'maintenance', installmentDebt: 450000, totalRevenue: 120000, expiryDates: { insurance: '2025-01-01', roadWorthiness: '2025-01-01', hackneyPermit: '2025-01-01' } },
  ];

  return (
    <div className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto pb-40 text-left animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
           <button onClick={() => onNavigate('dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all shadow-xl">
              <ArrowLeft size={24} />
           </button>
           <div className="space-y-1">
              <h1 className="text-4xl font-black italic uppercase display-font tracking-tighter text-white leading-none">Authority Node</h1>
              <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] italic mt-2">AreaLine Master Control Terminal</p>
           </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
           <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase italic">Grid Sync Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         {systemStats.map((stat, idx) => (
           <div key={idx} className="bg-[#0A0A0A] border-4 border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <stat.icon size={100} />
              </div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-4">{stat.label}</p>
              <div className="flex items-baseline gap-4">
                 <h2 className="text-4xl font-black text-white italic tech-mono">{stat.value}</h2>
                 <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
              </div>
           </div>
         ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
         {[
           { id: 'verify', icon: ShieldCheck, label: 'Audit Queue' },
           { id: 'fleet', icon: Truck, label: 'Fleet Grid' },
           { id: 'users', icon: Users, label: 'User Directory' },
           { id: 'grid', icon: Activity, label: 'System Logs' }
         ].map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveSubTab(tab.id as any)}
             className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest transition-all flex items-center gap-3 whitespace-nowrap shadow-xl ${activeSubTab === tab.id ? 'bg-blue-600 text-white scale-105' : 'bg-white/5 text-white/30 hover:text-white'}`}
           >
              <tab.icon size={16} /> {tab.label}
           </button>
         ))}
      </div>

      <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
         {activeSubTab === 'verify' && (
           <div className="p-0">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Onboarding Audits</h3>
                 <div className="relative w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500" placeholder="Search Node ID..." />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-white/[0.03] text-[9px] font-black uppercase text-white/30 tracking-widest border-b border-white/5">
                       <tr>
                          <th className="px-10 py-6">Identity Node</th>
                          <th className="px-10 py-6">Sector</th>
                          <th className="px-10 py-6">Persona</th>
                          <th className="px-10 py-6">Audit Status</th>
                          <th className="px-10 py-6">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {verificationQueue.map((item) => (
                         <tr key={item.id} className="hover:bg-white/[0.01] transition-all group">
                            <td className="px-10 py-8 font-black text-white italic">{item.name} <span className="block text-[8px] text-white/20 not-italic uppercase">{item.id}</span></td>
                            <td className="px-10 py-8 text-white/40 text-xs font-bold uppercase italic">{item.sector}</td>
                            <td className="px-10 py-8">
                               <span className="px-3 py-1 bg-white/5 rounded-lg text-[8px] font-black uppercase text-white/40">{item.role}</span>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-2 text-amber-500">
                                  <Activity size={12} className="animate-pulse" />
                                  <span className="text-[10px] font-black uppercase italic">{item.status}</span>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"><Check size={18} /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
         )}

         {activeSubTab === 'fleet' && (
           <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {fleetOverview.map((v) => (
                   <div key={v.id} className="p-10 bg-black border-4 border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden group hover:border-blue-600/20 transition-all">
                      <div className="flex justify-between items-start relative z-10">
                         <div className="space-y-1">
                            <h4 className="text-3xl font-black text-white italic tech-mono uppercase">{v.plateNumber}</h4>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Pilot: {v.pilotName}</p>
                         </div>
                         <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase italic ${v.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {v.status}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 relative z-10">
                         <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-white/20 uppercase mb-2">HP Debt</p>
                            <p className="text-xl font-black text-red-500 tech-mono italic">₦{(v.installmentDebt / 1000).toFixed(0)}k</p>
                         </div>
                         <div className="p-6 bg-white/[0.03] rounded-2xl border border-white/5">
                            <p className="text-[8px] font-black text-white/20 uppercase mb-2">Net Yield</p>
                            <p className="text-xl font-black text-emerald-500 tech-mono italic">₦{(v.totalRevenue / 1000).toFixed(0)}k</p>
                         </div>
                      </div>
                      <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white/30 hover:text-white transition-all">MANAGE UNIT</button>
                   </div>
                 ))}
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminPanel;
