
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp,
  FileWarning,
  AlertCircle,
  Zap,
  Globe,
  Truck,
  Package,
  ArrowLeft,
  Home,
  UserPlus,
  RefreshCcw,
  Wrench,
  PowerOff,
  Activity
} from 'lucide-react';
import { FleetVehicle, VehicleType, UserRole, RegistrationCategory } from '../types';
import { getVehicleIcon } from './OrderClusters';

const mockFleet: (FleetVehicle & { pilotLevel?: RegistrationCategory })[] = [
  { 
    id: 'v1', 
    type: VehicleType.TRUCK, 
    plateNumber: 'LAG-492-BC', 
    pilotName: 'Tunde B.',
    status: 'active',
    installmentDebt: 4500000,
    pilotLevel: RegistrationCategory.INTERSTATE,
    expiryDates: { insurance: '2024-12-10', roadWorthiness: '2024-11-05', hackneyPermit: '2025-01-20' }
  },
  { 
    id: 'v2', 
    type: VehicleType.VAN, 
    plateNumber: 'ABJ-118-XY', 
    pilotName: 'Musa A.',
    status: 'maintenance',
    installmentDebt: 120000,
    pilotLevel: RegistrationCategory.LOCAL,
    expiryDates: { insurance: '2024-05-10', roadWorthiness: '2024-06-12', hackneyPermit: '2024-10-15' }
  },
  { 
    id: 'v3', 
    type: VehicleType.TRUCK, 
    plateNumber: 'KAN-772-ZZ', 
    pilotName: 'Alhaji S.',
    status: 'offline',
    installmentDebt: 0,
    pilotLevel: RegistrationCategory.INTERNATIONAL,
    expiryDates: { insurance: '2025-01-01', roadWorthiness: '2025-03-12', hackneyPermit: '2025-06-15' }
  },
];

interface MerchantPanelProps {
  userRole: UserRole;
  onNavigate?: (tab: string) => void;
}

const MerchantPanel: React.FC<MerchantPanelProps> = ({ userRole, onNavigate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'audit' | 'compliance'>('compliance');

  const renderStatusIndicator = (status: FleetVehicle['status']) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">ON ROAD</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
            <Wrench size={12} className="text-amber-500" />
            <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">REPAIR</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <PowerOff size={12} className="text-white/20" />
            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">OFFLINE</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 md:p-14 space-y-14 pb-40 animate-in fade-in duration-700 max-w-7xl mx-auto text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate?.('dashboard')} 
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all flex items-center gap-3 group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
          </button>
        </div>
        
        <button 
          onClick={() => onNavigate?.('workspace')}
          className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase italic tracking-widest flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
        >
           <UserPlus size={18} /> ADD MOTOR / DRIVER
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-[#020202]">
              <ShieldCheck size={40} />
           </div>
           <div>
              <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter display-font leading-none">Oga's Motors</h1>
              <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] italic mt-2">Fleet Boss Control Panel</p>
           </div>
        </div>
        <div className="flex gap-4 bg-white/5 p-2 rounded-[2rem] border border-white/10 shadow-inner">
           <button onClick={() => setActiveSubTab('compliance')} className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase italic transition-all ${activeSubTab === 'compliance' ? 'bg-blue-600 text-white shadow-xl' : 'text-white/30 hover:text-white'}`}>Motors</button>
           <button onClick={() => setActiveSubTab('audit')} className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase italic transition-all ${activeSubTab === 'audit' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>Audit Papers</button>
           <button onClick={() => setActiveSubTab('inventory')} className={`px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase italic transition-all ${activeSubTab === 'inventory' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>Stock</button>
        </div>
      </div>

      {activeSubTab === 'compliance' && (
        <div className="space-y-12">
           <div className="bg-emerald-500/10 border-4 border-emerald-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                 <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
                    <RefreshCcw size={32} />
                 </div>
                 <div className="text-left">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Fleet Sync</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">3 Drivers Active on Grid</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {mockFleet.map((vehicle) => (
                <div key={vehicle.id} className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl transition-all hover:border-blue-500/30 text-left">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                      {getVehicleIcon(vehicle.type, 120)}
                   </div>
                   <div className="relative z-10 space-y-10">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600/10 border border-blue-600/30 rounded-[1.5rem] flex items-center justify-center text-blue-500 font-black text-xs italic shadow-xl">
                               {vehicle.plateNumber.split('-')[0]}
                            </div>
                            <div>
                               <p className="text-2xl font-black text-white italic display-font uppercase tracking-tighter leading-none">{vehicle.plateNumber}</p>
                               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{vehicle.pilotName}</p>
                            </div>
                         </div>
                         {renderStatusIndicator(vehicle.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/10">
                         <div>
                            <p className="text-[9px] font-black uppercase text-white/20 mb-2 tracking-widest">Route Level</p>
                            <div className="flex items-center gap-2">
                               <p className="text-xs font-black text-white uppercase italic">{vehicle.pilotLevel}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black uppercase text-white/20 mb-2 tracking-widest">HP Status</p>
                            <p className="text-xs font-black text-white uppercase italic">{vehicle.installmentDebt === 0 ? 'PAID' : 'DEBT'}</p>
                         </div>
                      </div>

                      <div className="flex gap-4">
                         <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Audit</button>
                         <button className="flex-1 py-4 bg-blue-600/10 text-blue-600 border border-blue-600/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all italic">Stop Engine</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MerchantPanel;
