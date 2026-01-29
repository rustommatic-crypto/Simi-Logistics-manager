import React, { useState, useRef } from 'react';
import { 
  Package, 
  Zap, 
  Truck, 
  Bike,
  Car,
  BusFront,
  Plane,
  RefreshCcw,
  Cpu,
  MapPin,
  MessageCircle,
  ArrowLeft,
  ShieldAlert,
  ArrowRight,
  Navigation,
  Link2
} from 'lucide-react';
import { VehicleType } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';

export const getVehicleIcon = (type: VehicleType, size: number = 24) => {
  switch (type) {
    case VehicleType.BIKE: return <Bike size={size} />;
    case VehicleType.SALON: return <Car size={size} />;
    case VehicleType.BUS: return <BusFront size={size} />;
    case VehicleType.TRUCK: return <Truck size={size} />;
    case VehicleType.AEROPLANE: return <Plane size={size} />;
    default: return <Package size={size} />;
  }
};

interface OrderClustersProps {
  onNavigate: (tab: string) => void;
  onEngageCluster: (cluster: any) => void;
  vehicle: VehicleType;
  walletLocked: boolean;
  isApproved?: boolean;
  driverDestination?: string;
}

const OrderClusters: React.FC<OrderClustersProps> = ({ 
  onNavigate, 
  onEngageCluster, 
  vehicle, 
  walletLocked 
}) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [negotiationCluster, setNegotiationCluster] = useState<any | null>(null);
  const [bidValue, setBidValue] = useState<number>(0);
  const [simiMessage, setSimiMessage] = useState("");
  const simiService = useRef(new SimiAIService());

  const mockClusters = [
    { 
      id: 'C-WA-01', 
      name: 'WhatsApp Intercept: VI Node', 
      source: 'WhatsApp',
      count: 3, 
      totalPrice: 15500, 
      efficiency: 98,
      orders: [
        { id: 'wa1', pickup: 'Lekki Toll', dest: 'Victoria Island', price: 5500 },
        { id: 'wa2', pickup: 'Oniru Market', dest: 'Eko Hotel', price: 5000 },
        { id: 'wa3', pickup: 'Civic Center', dest: 'Adetokunbo Ademola', price: 5000 }
      ]
    },
    { 
      id: 'C-ML-01', 
      name: 'Mainland North Loop', 
      source: 'Grid',
      count: 5, 
      totalPrice: 12500, 
      efficiency: 96,
      orders: [
        { id: '1', pickup: 'Ikeja City Mall', dest: 'Maryland', price: 2500 },
        { id: '2', pickup: 'Ogba Bus Stop', dest: 'Ikeja Underbridge', price: 2000 },
        { id: '3', pickup: 'Allen Avenue', dest: 'Agidingbi', price: 2500 },
        { id: '4', pickup: 'Opebi', dest: 'Toyin Street', price: 2500 },
        { id: '5', pickup: 'Maryland Tunnel', dest: 'Ojota', price: 3000 }
      ]
    }
  ];

  const handleSyncGrid = async () => {
    if (walletLocked) return;
    setIsSyncing(true);
    try {
      const audio = await simiService.current.announceJob("Neural handshake initiated. Scanning WhatsApp and AreaGPT nodes.");
      if (audio) {
        const ctx = getOutputContext();
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {}
    setTimeout(() => {
      setIsSyncing(false);
      setHasSearched(true);
    }, 2800);
  };

  return (
    <div className="p-4 md:p-10 space-y-10 pb-40 text-left animate-in fade-in duration-1000 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/40 shadow-xl"><ArrowLeft size={24} /></button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic uppercase display-font tracking-tighter text-white">Job Board</h1>
            <p className="text-[#E60000]/60 font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">Neural Intercept Active</p>
          </div>
        </div>
        {hasSearched && (
           <button onClick={() => setHasSearched(false)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white/30 italic tracking-widest">REFRESH NODE</button>
        )}
      </div>

      {!hasSearched && !isSyncing && (
        <div className="flex flex-col items-center justify-center py-24 space-y-14 animate-in zoom-in duration-700">
           <div className="relative group cursor-pointer" onClick={handleSyncGrid}>
              <div className="absolute inset-[-60px] rounded-full border border-[#E60000]/5 animate-ping duration-[5s]" />
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] flex flex-col items-center justify-center gap-6 bg-[#0A0A0A] border-[14px] border-white/[0.02] shadow-[0_0_120px_rgba(230,0,0,0.15)]">
                 <div className="p-10 bg-[#E60000] rounded-[2.5rem] text-white shadow-[0_0_60px_#E60000]"><Cpu size={80} /></div>
                 <p className="text-[18px] font-black text-white uppercase tracking-[0.6em] italic">SYNC GRID</p>
              </div>
           </div>
        </div>
      )}

      {isSyncing && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 space-y-12">
           <RefreshCcw size={80} className="text-[#E60000] animate-spin" />
           <div className="bg-[#0A0A0A] border border-white/10 p-12 rounded-[3.5rem] space-y-5 h-64 overflow-hidden relative shadow-2xl w-full max-w-xl">
              <p className="text-[11px] text-white/30 italic">{" >> HANDSHAKE: WhatsApp Bridge v2.1"}</p>
              <p className="text-[11px] text-[#25D366] italic">{" >> INTERCEPTING 3 NEW MESSAGES FROM 'LAGOS TRUCKERS' GROUP"}</p>
              <p className="text-[11px] text-white/30 italic">{" >> Simi AI: Extracting coordinates..."}</p>
              <p className="text-[11px] text-[#E60000] italic">{" >> CLUSTER BUNDLES READY."}</p>
           </div>
        </div>
      )}

      {hasSearched && !isSyncing && (
        <div className="space-y-14 animate-in slide-in-from-bottom-10 duration-1000">
          <div className="grid grid-cols-1 gap-12">
            {mockClusters.map((cluster) => (
              <div key={cluster.id} className={`bg-[#0A0A0A] border-4 rounded-[4rem] p-12 md:p-16 space-y-12 shadow-2xl relative overflow-hidden group transition-all ${cluster.source === 'WhatsApp' ? 'border-[#25D366]/20' : 'border-white/5'}`}>
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    <div className="flex items-center gap-10">
                       <div className={`w-28 h-28 rounded-[3rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${cluster.source === 'WhatsApp' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-[#E60000]/10 text-[#E60000]'}`}>
                          {cluster.source === 'WhatsApp' ? <Link2 size={56} /> : getVehicleIcon(vehicle, 56)}
                       </div>
                       <div className="text-left space-y-4">
                          <div className="flex items-center gap-4">
                            <span className={`px-5 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest italic leading-none ${cluster.source === 'WhatsApp' ? 'bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366]' : 'bg-[#E60000]/10 border-[#E60000]/20 text-[#E60000]'}`}>
                               {cluster.source === 'WhatsApp' ? 'WHATSAPP INTERCEPT' : 'NEURAL BUNDLE'}
                            </span>
                          </div>
                          <h3 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none display-font">{cluster.name}</h3>
                       </div>
                    </div>
                    
                    <div className="text-right bg-white/[0.03] p-12 rounded-[3.5rem] border border-white/5 w-full md:w-auto">
                       <p className="text-[11px] font-black text-white/20 uppercase mb-4 tracking-widest">Total Yield</p>
                       <p className="text-6xl md:text-7xl font-black tech-mono text-emerald-500 italic leading-none">₦{cluster.totalPrice.toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-col md:flex-row gap-8 pt-12 border-t border-white/5">
                    <button 
                      onClick={() => onEngageCluster(cluster)} 
                      disabled={walletLocked} 
                      className={`flex-1 py-12 rounded-[3.5rem] font-black text-3xl uppercase italic tracking-tighter shadow-2xl transition-all ${walletLocked ? 'bg-white/5 text-white/5 cursor-not-allowed' : 'bg-[#E60000] text-white hover:scale-[1.03] active:scale-95 shadow-[0_30px_70px_rgba(230,0,0,0.3)]'}`}
                    >
                       ENGAGE MISSION
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderClusters;