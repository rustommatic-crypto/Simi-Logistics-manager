
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
  Lock
} from 'lucide-react';

interface WalletPanelProps {
  balance: number;
  onNavigate: (tab: string) => void;
}

const WalletPanel: React.FC<WalletPanelProps> = ({ balance, onNavigate }) => {
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
        <div className="flex gap-2">
           <button 
             onClick={() => onNavigate('dashboard')}
             className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/30 hover:text-white transition-all italic tracking-widest"
           >
             HOME
           </button>
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
                 {balance.toLocaleString()}
               </h2>
               <div className="flex flex-wrap gap-4 pt-4">
                  <button className="flex-1 md:flex-none px-10 py-5 bg-[#E60000] text-white rounded-2xl font-black text-[10px] uppercase italic tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">RECHARGE NODE</button>
                  <button className="flex-1 md:flex-none px-10 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black text-[10px] uppercase italic tracking-widest hover:bg-white/10 transition-all">CASH OUT</button>
               </div>
            </div>
          </div>

          {/* LEDGER */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-6">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic leading-none">Activity Ledger</p>
                <button className="text-[9px] font-black text-[#E60000] uppercase italic tracking-widest border-b border-[#E60000]/20">ALL HISTORY</button>
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
                {balance < 500 && (
                   <div className="p-8 flex items-center justify-between bg-red-500/5 group hover:bg-red-500/10 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-lg">
                            <ArrowDownRight size={20} />
                         </div>
                         <div className="text-left">
                            <p className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">Commission Node</p>
                            <p className="text-[10px] font-black text-white/20 uppercase italic mt-1 tracking-widest">Neural Fee Deducted</p>
                         </div>
                      </div>
                      <p className="text-xl font-black tech-mono text-red-500 italic">-₦{(500 - balance).toLocaleString()}</p>
                   </div>
                )}
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
           
           <div className="p-10 bg-[#0A0A0A] border border-white/5 rounded-[3rem] space-y-6 shadow-xl text-left">
              <div className="flex items-center gap-4 text-white/30">
                 <Clock size={22} />
                 <h3 className="font-black text-[10px] uppercase italic tracking-widest">Audit Sync</h3>
              </div>
              <p className="text-[9px] font-black text-white/20 uppercase leading-relaxed italic tracking-widest">
                 Transactions are refreshed every 60 seconds for live yield reporting.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPanel;
