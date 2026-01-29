import React, { useState, useRef, useEffect } from 'react';
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
  Link2,
  Target,
  Sparkles,
  Filter,
  Globe
} from 'lucide-react';
import { VehicleType } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';

export const getVehicleIcon = (type: string | VehicleType, size: number = 24) => {
  const t = typeof type === 'string' ? type.toLowerCase() : type;
  switch (t) {
    case 'bike':
    case VehicleType.BIKE: return <Bike size={size} />;
    case 'car':
    case 'salon':
    case VehicleType.SALON: return <Car size={size} />;
    case 'van':
    case 'bus':
    case VehicleType.BUS: return <BusFront size={size} />;
    case 'truck':
    case VehicleType.TRUCK: return <Truck size={size} />;
    case 'aeroplane':
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
  const [showGlobal, setShowGlobal] = useState(false); // Default to filtered view
  const [clusters, setClusters] = useState<any[]>([]);
  const simiService = useRef(new SimiAIService());

  const initialClusters = [
    { 
      id: 'C-WA-01', 
      name: 'WhatsApp Intercept: VI Node', 
      source: 'WhatsApp',
      vehicleRequired: VehicleType.BIKE,
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
      vehicleRequired: VehicleType.VAN,
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
    },
    { 
      id: 'C-LT-01', 
      name: 'Ikeja Heavy Haul', 
      source: 'Grid',
      vehicleRequired: VehicleType.TRUCK,
      count: 1, 
      totalPrice: 85000, 
      efficiency: 100,
      orders: [
        { id: 't1', pickup: 'Ikeja Industrial Estate', dest: 'Apapa Wharf', price: 85000 }
      ]
    }
  ];

  useEffect(() => {
    setClusters(initialClusters);
  }, []);

  const handleSyncGrid = async () => {
    if (walletLocked) return;
    setIsSyncing(true);
    try {
      const audio = await simiService.current.announceJob("Neural handshake initiated. AreaGPT is scanning for high-yield missions...");
      if (audio) {
        const ctx = getOutputContext();
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }

      const aiLeads = await simiService.current.scoutAreaGPTLeads();
      const aiClusters = aiLeads.map((lead: any) => ({
        id: `GPT-${lead.id}`,
        name: lead.title,
        source: 'AreaGPT',
        vehicleRequired: lead.type as VehicleType,
        count: 1,
        totalPrice: lead.price,
        efficiency: 100,
        orders: [{ id: lead.id, pickup: lead.pickup, dest: lead.destination, price: lead.price }]
      }));

      setClusters([...aiClusters, ...initialClusters]);
    } catch (e) {
      console.error("Sync error", e);
    }
    
    setTimeout(() => {
      setIsSyncing(false);
      setHasSearched(true);
    }, 3200);
  };

  // Logic to filter clusters based on the toggle and user's vehicle
  const displayedClusters = showGlobal 
    ? clusters 
    : clusters.filter(c => c.vehicleRequired.toLowerCase() === vehicle.toLowerCase());

  return (
    <div className="p-4 md:p-10 space-y-10 pb-40 text-left animate-in fade-in duration-1000 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-white/40 shadow-xl hover:text-white transition-all"><ArrowLeft size={24} /></button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black italic uppercase display-font tracking-tighter text-white">Job Board</h1>
            <p className="text-[#E60000]/60 font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">Neural Intercept Active</p>
          </div>
        </div>
        
        {hasSearched && (
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setShowGlobal(false)}
                  className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all ${!showGlobal ? 'bg-[#E60000] text-white shadow-lg' : 'text-white/20'}`}
                >
                  My {vehicle}
                </button>
                <button 
                  onClick={() => setShowGlobal(true)}
                  className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all ${showGlobal ? 'bg-amber-500 text-black shadow-lg' : 'text-white/20'}`}
                >
                  Global Grid
                </button>
             </div>
             <button onClick={() => setHasSearched(false)} className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white"><RefreshCcw size={20} /></button>
          </div>
        )}
      </div>

      {!hasSearched && !isSyncing && (
        <div className="flex flex-col items-center justify-center py-24 space-y-14 animate-in zoom-in duration-700">
           <div className="relative group cursor-pointer" onClick={handleSyncGrid}>
              <div className="absolute inset-[-60px] rounded-full border border-amber-500/20 animate-ping duration-[4s]" />
              <div className="absolute inset-[-30px] rounded-full border border-[#E60000]/10 animate-ping duration-[6s]" />
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] flex flex-col items-center justify-center gap-6 bg-[#0A0A0A] border-[14px] border-white/[0.02] shadow-[0_0_120px_rgba(230,0,0,0.15)] group-hover:border-amber-500/10 transition-all">
                 <div className="p-10 bg-[#E60000] rounded-[2.5rem] text-white shadow-[0_0_60px_#E60000] group-hover:bg-amber-500 group-hover:shadow-amber-500 transition-all">
                    <Cpu size={80} />
                 </div>
                 <p className="text-[18px] font-black text-white uppercase tracking-[0.6em] italic">SYNC GRID</p>
              </div>
           </div>
           <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.5em] italic">Scanning for {vehicle} Loads...</p>
        </div>
      )}

      {isSyncing && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-12 space-y-12">
           <div className="relative">
             <RefreshCcw size={100} className="text-amber-500 animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={40} className="text-white animate-pulse" />
             </div>
           </div>
           <div className="bg-[#0A0A0A] border-4 border-amber-500/20 p-12 rounded-[3.5rem] space-y-5 h-72 overflow-hidden relative shadow-[0_0_100px_rgba(245,158,11,0.2)] w-full max-w-2xl text-left">
              <div className="absolute inset-0 pointer-events-none border-t border-amber-500/10 animate-scanline" />
              <p className="text-[11px] text-white/30 italic tech-mono">{" >> INITIALIZING AREAGPT BRIDGE v3.0"}</p>
              <p className="text-[11px] text-amber-500 italic tech-mono">{" >> SCANNING NEURAL GRID..."}</p>
              <p className="text-[11px] text-[#25D366] italic tech-mono">{" >> WHATSAPP INTERCEPT ACTIVE"}</p>
              <p className="text-[11px] text-white italic tech-mono">{` >> FILTERING FOR ${vehicle.toUpperCase()} MISSIONS...`}</p>
              <p className="text-[11px] text-amber-500 font-black tech-mono">{" >> HANDSHAKE COMPLETE."}</p>
           </div>
        </div>
      )}

      {hasSearched && !isSyncing && (
        <div className="space-y-14 animate-in slide-in-from-bottom-10 duration-1000">
          {displayedClusters.length === 0 ? (
            <div className="py-32 text-center space-y-6 bg-white/[0.02] rounded-[4rem] border border-white/5 border-dashed">
               <ShieldAlert size={80} className="text-white/10 mx-auto" />
               <div>
                  <h3 className="text-2xl font-black text-white/40 uppercase italic">No {vehicle} Jobs Found</h3>
                  <p className="text-white/20 text-xs font-bold mt-2 italic">Try toggling "Global Grid" to see other opportunities.</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12">
              {displayedClusters.map((cluster) => {
                const isAreaGPT = cluster.source === 'AreaGPT';
                const isWA = cluster.source === 'WhatsApp';
                const isCompatible = cluster.vehicleRequired.toLowerCase() === vehicle.toLowerCase();
                
                return (
                  <div key={cluster.id} className={`bg-[#0A0A0A] border-4 rounded-[4rem] p-10 md:p-14 space-y-10 shadow-2xl relative overflow-hidden group transition-all ${!isCompatible ? 'opacity-40 grayscale' : ''} ${isAreaGPT ? 'border-amber-500/40 shadow-amber-500/10' : isWA ? 'border-[#25D366]/20 shadow-[#25D366]/5' : 'border-white/5'}`}>
                     
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                        <div className="flex items-center gap-8 text-left">
                           <div className={`w-24 h-24 rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl group-hover:scale-110 transition-transform ${isAreaGPT ? 'bg-amber-500/10 text-amber-500' : isWA ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-[#E60000]/10 text-[#E60000]'}`}>
                              {getVehicleIcon(cluster.vehicleRequired, 44)}
                              <span className="text-[7px] font-black uppercase mt-1">{cluster.vehicleRequired}</span>
                           </div>
                           <div className="text-left space-y-3">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-4 py-1.5 border rounded-xl text-[9px] font-black uppercase tracking-widest italic leading-none ${isAreaGPT ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : isWA ? 'bg-[#25D366]/10 border-[#25D366]/20 text-[#25D366]' : 'bg-[#E60000]/10 border-[#E60000]/20 text-[#E60000]'}`}>
                                   {isAreaGPT ? 'AREAGPT SNIPE' : isWA ? 'WHATSAPP INTERCEPT' : 'GRID BUNDLE'}
                                </span>
                                {!isCompatible && (
                                   <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white/30 uppercase italic">
                                      REQUIRES {cluster.vehicleRequired.toUpperCase()}
                                   </span>
                                )}
                              </div>
                              <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none display-font">{cluster.name}</h3>
                           </div>
                        </div>
                        
                        <div className={`text-right bg-white/[0.03] p-10 rounded-[3rem] border w-full md:w-auto ${isAreaGPT ? 'border-amber-500/20' : 'border-white/5'}`}>
                           <p className="text-[10px] font-black text-white/20 uppercase mb-3 tracking-widest">Yield Potential</p>
                           <p className={`text-5xl md:text-6xl font-black tech-mono italic leading-none ${isAreaGPT ? 'text-amber-500' : 'text-emerald-500'}`}>₦{cluster.totalPrice.toLocaleString()}</p>
                        </div>
                     </div>
                     
                     <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-white/5 relative z-10">
                        <button 
                          onClick={() => onEngageCluster(cluster)} 
                          disabled={walletLocked || (!isCompatible && !showGlobal)} 
                          className={`flex-1 py-10 rounded-[3rem] font-black text-2xl uppercase italic tracking-tighter shadow-2xl transition-all ${walletLocked || (!isCompatible) ? 'bg-white/5 text-white/10 cursor-not-allowed' : isAreaGPT ? 'bg-amber-500 text-black hover:scale-[1.03] active:scale-95 shadow-amber-500/20' : 'bg-[#E60000] text-white hover:scale-[1.03] active:scale-95 shadow-[0_30px_70px_rgba(230,0,0,0.3)]'}`}
                        >
                           {isAreaGPT ? 'SNIPE MISSION' : 'ENGAGE MISSION'}
                        </button>
                     </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderClusters;