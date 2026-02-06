
import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  HandCoins,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Home,
  Clock,
  Lock,
  Fuel,
  TrendingDown
} from 'lucide-react';

interface WalletPanelProps {
  balance: number;
  onNavigate: (tab: string) => void;
  fuelCredit?: { limit: number; used: number };
}

const WalletPanel: React.FC<WalletPanelProps> = ({ 
  balance, 
  onNavigate, 
  fuelCredit = { limit: 0, used: 0 } 
}) => {
  const fuelAvailable = (fuelCredit.limit ?? 0) - (fuelCredit.used ?? 0);
  const fuelPercentage = fuelCredit.limit > 0 ? (fuelCredit.used / fuelCredit.limit) * 100 : 0;

  return (
    <div className="p-4 md:p-10 space-y-10 pb-40 text-left animate-in fade-in duration-700 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="p-4 bg-white/5 border border-white/10 rounded-[1.2rem] text-white/40 hover:text-white transition-all shadow-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase display-font">My Money</h1>
            <p className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.4em] italic mt-1 leading-none">Neural Vault Sync</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* MAIN CARD */}
          <div className={`p-10 md:p-14 bg-[#0A0A0A] border-4 rounded-[3.5rem] relative overflow-hidden shadow-2xl transition-all ${balance < 0 ? 'border-red-500/20 shadow-red-500/5' : 'border-emerald-500/20 shadow-emerald-500/5'}`}>
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
               <Wallet size={200} />
            </div>
            <div className="relative z-10">
               <div className="flex items-center justify-between mb-10">
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] italic">Neural Balance</p>
                  {balance < 0 && <span className="px-4 py-1.5 bg-red-600 text-white text-[8px] font-black uppercase rounded-lg shadow-lg flex items-center gap-2 animate-pulse"><Lock size={10} /> RECHARGE REQUIRED</span>}
               </div>
               <h2 className="text-6xl md:text-8xl font-black mb-14 tracking-tighter italic tech-mono flex items-center gap-6 text-white">
                 <span className="text-2xl md:text-4xl opacity-20">₦</span>
                 {(balance ?? 0).toLocaleString()}
               </h2>
               <div className="flex flex-wrap gap-4 pt-4">
                  <button className="flex-1 md:flex-none px-10 py-5 bg-[#E60000] text-white rounded-2xl font-black text-[10px] uppercase italic tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">RECHARGE NODE</button>
                  <button className="flex-1 md:flex-none px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] uppercase italic tracking-widest hover:bg-white/10 transition-all">CASH OUT</button>
               </div>
            </div>
          </div>

          {/* FUEL CREDIT NODE */}
          <div className="p-10 bg-[#0A0A0A] border-4 border-amber-500/20 rounded-[3.5rem] relative overflow-hidden shadow-2xl group">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
                <Fuel size={160} className="text-amber-500" />
             </div>
             <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.5em] italic">Fuel Credit Node</p>
                      <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mt-1">Energy Credit</h3>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Available Credit</p>
                      <p className="text-3xl font-black tech-mono text-amber-500 italic">₦{(fuelAvailable ?? 0).toLocaleString()}</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                      <span className="text-white/20">Utilization (₦{(fuelCredit.used ?? 0).toLocaleString()})</span>
                      <span className="text-white/20">Limit: ₦{(fuelCredit.limit ?? 0).toLocaleString()}</span>
                   </div>
                   <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-1000" style={{ width: `${fuelPercentage}%` }} />
                   </div>
                </div>

                <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase italic tracking-widest shadow-xl transition-all ${fuelAvailable > 0 ? 'bg-amber-500 text-black hover:scale-[1.02]' : 'bg-white/5 text-white/10 grayscale cursor-not-allowed'}`}>
                   {fuelAvailable > 0 ? 'REFUEL AT VERIFIED STATION' : 'CREDIT LOCKED: COMPLETE AUDIT'}
                </button>
             </div>
          </div>

          {/* LEDGER */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Activity Ledger</p>
             </div>
             <div className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg">
                         <Zap size={20} />
                      </div>
                      <div className="text-left">
                         <p className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">Starting Bonus</p>
                         <p className="text-[10px] font-black text-white/20 uppercase italic mt-1 tracking-widest">Simi Welcome Node</p>
                      </div>
                   </div>
                   <p className="text-xl font-black tech-mono text-emerald-500 italic">+₦500</p>
                </div>
             </div>
          </div>
        </div>

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-8">
           <div className="p-10 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3rem] space-y-6 shadow-xl text-left">
              <div className="flex items-center gap-4 text-emerald-500">
                 <ShieldCheck size={22} />
                 <h3 className="font-black text-[10px] uppercase italic tracking-widest">Vault Shield</h3>
              </div>
              <p className="text-sm font-bold text-white/60 italic leading-relaxed">
                "Driver, Simi is monitoring every Kobo. Your earnings are encrypted on the Grid 24/7."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPanel;
