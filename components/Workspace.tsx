import React, { useState, useRef, useEffect } from 'react';
import { 
  Home,
  MapPin,
  Sparkles,
  Activity,
  ShieldCheck,
  RefreshCcw,
  Truck,
  Car,
  BusFront,
  Bike,
  Zap,
  Target,
  Navigation,
  ArrowRight,
  Globe,
  Terminal,
  ArrowLeft,
  Link2,
  MessageSquare,
  Cpu,
  Radar,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { VehicleType, UserRole, RouteMode, RegistrationCategory, VerificationStatus } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';
import { getVehicleIcon } from './OrderClusters';

interface WorkspaceProps {
  regLevels: RegistrationCategory[];
  setRegLevels: (levels: RegistrationCategory[]) => void;
  vStatus: VerificationStatus;
  setVStatus: (status: VerificationStatus) => void;
  activeVehicle: VehicleType;
  setVehicle: (v: VehicleType) => void;
  onNavigate: (tab: string) => void;
  userRole: UserRole;
  routeMode: RouteMode;
  setRouteMode: (mode: RouteMode) => void;
  destination: string;
  setDestination: (dest: string) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ 
  activeVehicle, setVehicle, onNavigate, 
  routeMode, setRouteMode, destination, setDestination
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBridgeTerminal, setShowBridgeTerminal] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const simiService = useRef(new SimiAIService());

  // Initialize Geolocation
  const syncLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLocating(false);
      },
      (err) => {
        console.error("GPS Link Failure", err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    syncLocation();
  }, []);

  const handleModeChange = async (mode: RouteMode) => {
    setRouteMode(mode);
    const text = `Movement: ${mode} protocol locked.`;
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

  const handleWASync = async () => {
    setIsSyncing(true);
    try {
      await simiService.current.announceJob("Neural Bridge initiating. Connecting to your WhatsApp node.");
    } catch(e) {}
    
    setTimeout(() => {
      setIsSyncing(false);
      setShowBridgeTerminal(true);
    }, 2000);
  };

  // Construct Map URL based on mode and destination
  const getMapUrl = () => {
    if (routeMode === RouteMode.TRIP && destination.trim()) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=k&z=13&ie=UTF8&iwloc=&output=embed`;
    }
    if (currentCoords) {
      return `https://maps.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}&t=k&z=16&ie=UTF8&iwloc=&output=embed`;
    }
    return `https://maps.google.com/maps?q=Lagos,Nigeria&t=k&z=10&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="p-4 md:p-10 space-y-10 max-w-6xl mx-auto pb-40 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="p-4 bg-white/5 border border-white/10 rounded-[1.2rem] text-white/40 hover:text-white transition-all shadow-xl"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white italic uppercase display-font tracking-tighter leading-none">My Movement</h1>
            <p className="text-white/30 font-bold italic text-[9px] mt-1 uppercase tracking-[0.3em] leading-none">Vehicle & Node Control</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={syncLocation}
            disabled={isLocating}
            className="p-4 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all flex items-center gap-2"
          >
            <RefreshCcw size={16} className={isLocating ? "animate-spin text-[#E60000]" : ""} />
            <span className="text-[10px] font-black uppercase italic tracking-widest hidden sm:inline">RELINK GPS</span>
          </button>
          <button 
            onClick={handleWASync}
            className="w-full md:w-auto px-6 py-3 bg-[#25D366]/80 text-white rounded-xl font-black text-[10px] uppercase tracking-widest italic flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95 border border-white/10"
          >
            {isSyncing ? <RefreshCcw size={14} className="animate-spin" /> : <Terminal size={14} />} 
            WHATSAPP SYNC
          </button>
        </div>
      </div>

      {/* NEURAL RADAR MAP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bg-[#0A0A0A] border-4 border-emerald-500/20 rounded-[3rem] overflow-hidden shadow-2xl relative">
            {/* Map UI Overlay */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-3">
              <div className="px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest italic">
                  {routeMode === RouteMode.TRIP ? 'MISSION TARGET LOCKED' : 'NEURAL GPS ACTIVE'}
                </span>
              </div>
              {currentCoords && (
                <div className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">Telemetry</p>
                  <p className="text-[10px] font-black text-emerald-500 tech-mono">{currentCoords.lat.toFixed(4)}°N, {currentCoords.lng.toFixed(4)}°E</p>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 right-6 z-10">
               <div className="w-12 h-12 bg-[#E60000] rounded-xl flex items-center justify-center text-white shadow-2xl animate-pulse">
                  <Radar size={24} />
               </div>
            </div>

            {/* Scanning Scanline Animation */}
            <div className="absolute inset-0 pointer-events-none border-t border-emerald-500/10 animate-scan-slow z-10" />

            {/* The Map Embed */}
            <div className="w-full aspect-[21/9] bg-[#020202]">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src={getMapUrl()}
                className="grayscale opacity-60 contrast-125"
              />
            </div>
          </div>
        </div>
      </div>

      {showBridgeTerminal && (
        <div className="bg-[#0A0A0A] border-4 border-[#25D366]/20 rounded-[3rem] p-8 md:p-10 space-y-8 shadow-[0_0_60px_rgba(37,211,102,0.1)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Link2 size={120} className="text-[#25D366]" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg">
                 <MessageSquare size={28} />
              </div>
              <div className="text-left">
                 <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Bridge Terminal</h2>
                 <p className="text-[#25D366] font-black text-[9px] uppercase tracking-widest">Simi is listening to your groups</p>
              </div>
           </div>
           
           <div className="bg-black/60 rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-white/20 tracking-widest">
                 <span>NEURAL STATUS</span>
                 <span className="text-[#25D366] animate-pulse">ACTIVE LINK</span>
              </div>
              <p className="text-sm font-medium text-white/60 italic leading-relaxed">
                 "Pilot, Simi is now intercepting waybill texts from your WhatsApp. Any job wey land, I go process am and put am for your Job Board instantly."
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button onClick={() => setShowBridgeTerminal(false)} className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white">DISCONNECT BRIDGE</button>
              <button onClick={() => onNavigate('orders')} className="py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl hover:brightness-110 transition-all">VIEW INTERCEPTED JOBS</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-8 md:p-12 space-y-12 shadow-2xl relative overflow-hidden">
           
           {/* MACHINE SELECTOR */}
           <div className="space-y-6">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">Active Machine</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { type: VehicleType.BIKE, label: 'Bike' },
                   { type: VehicleType.SALON, label: 'Car' },
                   { type: VehicleType.BUS, label: 'Bus' },
                   { type: VehicleType.TRUCK, label: 'Truck' }
                 ].map((opt) => (
                   <button 
                     key={opt.type} 
                     onClick={() => setVehicle(opt.type)} 
                     className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-3 transition-all ${activeVehicle === opt.type ? 'bg-[#E60000]/10 border-[#E60000] text-white shadow-xl scale-105' : 'bg-black border-white/5 text-white/10 hover:border-white/10 hover:text-white/20'}`}
                   >
                      {getVehicleIcon(opt.type, 28)}
                      <span className="text-[10px] font-black uppercase italic tracking-tight">{opt.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* MOVEMENT MODE */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { mode: RouteMode.ROAMING, icon: Activity, label: 'Roaming', activeColor: 'border-[#E60000]', bg: 'bg-[#E60000]/5', iconColor: 'text-[#E60000]' },
                { mode: RouteMode.TRIP, icon: Navigation, label: 'On Trip', activeColor: 'border-blue-500', bg: 'bg-blue-500/5', iconColor: 'text-blue-500' },
                { mode: RouteMode.SPECIAL, icon: Sparkles, label: 'Money', activeColor: 'border-amber-500', bg: 'bg-amber-500/5', iconColor: 'text-amber-500' }
              ].map((m) => {
                const isActive = routeMode === m.mode;
                return (
                  <button 
                    key={m.mode} 
                    onClick={() => handleModeChange(m.mode)} 
                    className={`p-8 rounded-[2.5rem] border-2 flex flex-col items-center gap-6 transition-all relative overflow-hidden ${isActive ? `${m.bg} ${m.activeColor} text-white shadow-2xl scale-105` : 'bg-black border-white/5 text-white/10 hover:border-white/10 hover:text-white/20'}`}
                  >
                     <m.icon size={44} className={isActive ? m.iconColor : 'opacity-40'} />
                     <div className="text-center">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{m.label}</h3>
                        <p className="text-[8px] font-black uppercase text-white/20 mt-2 tracking-widest italic">{isActive ? 'ENABLED' : 'SYNC'}</p>
                     </div>
                  </button>
                );
              })}
           </div>

           <div className="pt-8 border-t border-white/5">
              {routeMode === RouteMode.TRIP ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                   <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={24} />
                      <input 
                        type="text" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Trip Destination (e.g. Abuja)"
                        className="w-full bg-black/60 border-2 border-white/5 rounded-2xl pl-16 pr-8 py-6 text-xl font-black italic text-white focus:border-blue-500 outline-none transition-all shadow-inner"
                      />
                   </div>
                   <button onClick={() => onNavigate('dashboard')} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl uppercase italic tracking-tighter shadow-xl hover:brightness-110 transition-all">LOCK MISSION</button>
                </div>
              ) : routeMode === RouteMode.SPECIAL ? (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                   <div className="relative">
                      <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={24} />
                      <input 
                        type="number" 
                        placeholder="Daily Target Yield (₦)"
                        className="w-full bg-black/60 border-2 border-white/5 rounded-2xl pl-16 pr-8 py-6 text-xl font-black italic text-white focus:border-amber-500 outline-none transition-all tech-mono shadow-inner"
                      />
                   </div>
                   <button onClick={() => onNavigate('dashboard')} className="w-full py-6 bg-amber-500 text-black rounded-2xl font-black text-xl uppercase italic tracking-tighter shadow-xl hover:brightness-110 transition-all">START HUNT</button>
                </div>
              ) : (
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center gap-8 group">
                   <Activity className="text-[#E60000] animate-pulse group-hover:scale-110 transition-transform" size={40} />
                   <div className="text-left">
                      <p className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Neural Scouting</p>
                      <p className="text-sm font-medium text-white/30 italic">Driver, just move. Simi is scanning for jobs in your current radius.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
        
        <div className="lg:col-span-4 space-y-8">
           <div className="p-10 rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 shadow-2xl text-left">
              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest italic mb-8">Node Telemetry</p>
              <div className="space-y-6">
                 <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-[10px] font-black text-white/20 uppercase italic">Grid Link</span>
                    <span className="flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase italic tracking-widest"><Activity size={12} /> SECURE</span>
                 </div>
                 <div className="flex justify-between items-center py-4">
                    <span className="text-[10px] font-black text-white/20 uppercase italic">Gps Node</span>
                    <span className="text-[9px] font-black text-white/60 uppercase italic">{currentCoords ? 'Active' : 'Searching...'}</span>
                 </div>
              </div>
           </div>

           <div className="p-10 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 space-y-6 shadow-xl text-left">
              <div className="flex items-center gap-4 text-emerald-500">
                 <ShieldCheck size={28} />
                 <span className="text-[10px] font-black uppercase tracking-widest italic">Safety Layer 1.0</span>
              </div>
              <p className="text-sm font-bold text-white/60 italic leading-relaxed">
                "Driver, Simi is watching the checkpoint nodes. Movement is safe."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;