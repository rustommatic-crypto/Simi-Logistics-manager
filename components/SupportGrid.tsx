
import React from 'react';
import { 
  Wrench, 
  ShieldAlert, 
  Fuel, 
  ArrowLeft, 
  Home, 
  MapPin, 
  Zap, 
  Activity, 
  Navigation,
  Phone,
  Bed,
  Droplet
} from 'lucide-react';

interface SupportGridProps {
  onNavigate: (tab: string) => void;
}

const SupportGrid: React.FC<SupportGridProps> = ({ onNavigate }) => {
  return (
    <div className="p-4 md:p-10 space-y-8 pb-40 animate-in fade-in duration-500 max-w-5xl mx-auto text-left">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1" />
        </button>
        <div>
           <h1 className="text-3xl font-black italic uppercase display-font tracking-tighter text-white leading-none">Support Grid</h1>
           <p className="text-white/20 font-black text-[10px] uppercase tracking-widest mt-1">Maintenance, Security & Energy Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TECH SUPPORT (Mech Radar Detail) */}
        <div className="bg-[#0A0A0A] border-2 border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-500 border border-purple-500/20">
                    <Wrench size={24} />
                 </div>
                 <h2 className="text-xl font-black italic uppercase text-white">Tech Support</h2>
              </div>
              <span className="text-[8px] font-black bg-purple-600 text-white px-3 py-1 rounded-full uppercase italic">3 NEARBY</span>
           </div>
           
           <div className="space-y-3">
              {[
                { name: 'Oga Emma Repairs', specialty: 'Truck/Van Specialist', dist: '1.2km', phone: '0803 123 4567' },
                { name: 'Vulcanizer Zone A', specialty: 'Heavy Duty Tires', dist: '2.5km', phone: '0802 888 9999' }
              ].map((m, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:border-purple-500/30 transition-all">
                   <div className="text-left">
                      <p className="text-sm font-black text-white italic uppercase">{m.name}</p>
                      <p className="text-[10px] text-white/30 font-bold uppercase">{m.specialty} • {m.dist}</p>
                   </div>
                   <button className="p-3 bg-purple-600 text-white rounded-xl shadow-lg"><Phone size={16} /></button>
                </div>
              ))}
           </div>
        </div>

        {/* SECURITY ALERTS */}
        <div className="bg-[#0A0A0A] border-2 border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#E60000]/10 rounded-xl flex items-center justify-center text-[#E60000] border border-[#E60000]/20">
                    <ShieldAlert size={24} />
                 </div>
                 <h2 className="text-xl font-black italic uppercase text-white">Security alerts</h2>
              </div>
              <Activity size={20} className="text-[#E60000] animate-pulse" />
           </div>
           
           <div className="p-5 bg-[#E60000]/5 border border-[#E60000]/20 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-[#E60000]">
                 <Zap size={14} className="animate-bounce" />
                 <p className="text-xs font-black uppercase italic">High Alert: Ore-Benin Road</p>
              </div>
              <p className="text-[10px] font-bold text-white/40 italic leading-relaxed">
                "Simi Intelligence: Verified reports of road blocks near Ore junction. Grid pilots advised to chill at safe park or use diversion nodes."
              </p>
           </div>
        </div>

        {/* ENERGY & REST (Full width on small, grid on large) */}
        <div className="md:col-span-2 bg-[#0A0A0A] border-2 border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-400/20">
                 <Fuel size={24} />
              </div>
              <h2 className="text-xl font-black italic uppercase text-white">Energy & Rest Node</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-6">
                 <Droplet className="text-blue-400" size={32} />
                 <div className="text-left">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Cheapest Diesel Nearby</p>
                    <p className="text-2xl font-black text-white tech-mono">₦1,320<span className="text-xs text-white/40 ml-1">/L</span></p>
                    <p className="text-[10px] text-emerald-500 font-bold italic uppercase mt-1">Total Station - 3.1km</p>
                 </div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-6">
                 <Bed className="text-amber-500" size={32} />
                 <div className="text-left">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Verified Safe Lodging</p>
                    <p className="text-xl font-black text-white italic uppercase leading-none mt-1">Pilot Haven Hotel</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Fenced • 24/7 Power • Security</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SupportGrid;
