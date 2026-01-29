import React, { useState, useRef } from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Weight, 
  ChevronRight, 
  Check, 
  ArrowLeft, 
  Users, 
  Plus, 
  Minus, 
  Globe, 
  Link as LinkIcon, 
  Share2,
  Home,
  Database,
  Zap,
  Flag,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { TripType, RegistrationCategory, VehicleType } from '../types';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from '../services/geminiService';

interface TripPlannerProps {
  onNavigate: (tab: string) => void;
  onLaunch: (manifest: any) => void;
  activeTiers: RegistrationCategory[];
  currentVehicle?: VehicleType;
}

const TripPlanner: React.FC<TripPlannerProps> = ({ onNavigate, onLaunch, activeTiers, currentVehicle }) => {
  const [step, setStep] = useState(1);
  const [tripType, setTripType] = useState<TripType>(TripType.PASSENGER);
  const [isInternational, setIsInternational] = useState(false);
  
  const [totalSeats, setTotalSeats] = useState(14);
  const [availableSeats, setAvailableSeats] = useState(14);
  
  const [totalTonnage, setTotalTonnage] = useState(20);
  const [remainingTonnage, setRemainingTonnage] = useState(10);
  
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [currency, setCurrency] = useState('NGN');

  const simiRef = useRef(new SimiAIService());

  const handleSelectType = (type: TripType) => {
    setTripType(type);
    setStep(2);
  };

  const handleToggleRoute = async (intl: boolean) => {
    setIsInternational(intl);
    const text = intl ? "Across border activated. Link your passport and permits, Driver." : "Local park nodes active.";
    try {
      const audio = await simiRef.current.announceJob(text);
      if (audio) {
        const ctx = getOutputContext();
        if (ctx.state === 'suspended') await ctx.resume();
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch(e) {}
  };

  const handleFinish = async () => {
    const tripData = {
      tripType,
      origin,
      destination,
      date,
      time,
      isInternational,
      currency,
      remaining: tripType === TripType.PASSENGER ? availableSeats : remainingTonnage,
      total: tripType === TripType.PASSENGER ? totalSeats : totalTonnage,
      vehicleType: currentVehicle
    };
    
    // Announce the launch locally
    try {
      const audio = await simiRef.current.announceJob(`Oya, Pilot! Manifest locked for ${origin} to ${destination}. Simi is now broadcasting your available ${tripData.remaining} space to the grid. Safe trip o!`);
      if (audio) {
        const ctx = getOutputContext();
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) {}

    onLaunch(tripData);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 pb-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div className="flex items-center gap-6">
             <button 
               onClick={() => step > 1 ? setStep(step - 1) : onNavigate('dashboard')}
               className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
             >
                <ArrowLeft size={24} />
             </button>
             <div className="text-left">
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter display-font">Trips & Waybill</h1>
                <p className="text-white/40 font-bold italic text-lg leading-tight">
                  {isInternational ? 'Cross-Border Office' : 'Long Road Trip Planner'}
                </p>
             </div>
           </div>
           
           <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
              <button 
                onClick={() => handleToggleRoute(false)}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all ${!isInternational ? 'bg-[#E60000] text-white shadow-lg' : 'text-white/20'}`}
              >
                Local/State
              </button>
              <button 
                onClick={() => handleToggleRoute(true)}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all ${isInternational ? 'bg-amber-500 text-black shadow-lg' : 'text-white/30 bg-white/5 hover:bg-white/10'}`}
              >
                Across Border
              </button>
           </div>
        </div>

        <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
          <div className="flex border-b border-white/5 bg-white/[0.02]">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`flex-1 p-6 text-center text-[10px] font-black uppercase italic tracking-widest transition-all ${step === s ? (isInternational ? 'text-amber-500 bg-amber-500/5' : 'text-[#E60000] bg-[#E60000]/5') : 'text-white/20'}`}
              >
                {s === 1 && 'Hustle Type'}
                {s === 2 && 'Trip Points'}
                {s === 3 && 'Load Size'}
                {s === 4 && 'Launch Waybill'}
              </div>
            ))}
          </div>

          <div className="p-10 md:p-16 space-y-12">
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-left">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Wetin we dey move?</h2>
                  <p className="text-white/40 font-bold italic mt-2">Simi: "Boss, select wetin you wan carry make we prepare waybill."</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button 
                    onClick={() => handleSelectType(TripType.PASSENGER)}
                    className={`group p-12 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 transition-all hover:scale-105 active:scale-95 ${tripType === TripType.PASSENGER ? (isInternational ? 'bg-amber-500/5 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'bg-[#E60000]/5 border-[#E60000] shadow-[0_0_50px_rgba(230,0,0,0.2)]') : 'bg-[#020202] border-white/5 opacity-60'}`}
                  >
                    <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all ${tripType === TripType.PASSENGER ? (isInternational ? 'bg-amber-500 text-black' : 'bg-[#E60000] text-white') : 'bg-white/5 text-white/20'}`}>
                      <Users size={64} />
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-black italic uppercase text-white">Passengers</span>
                      <p className="text-sm font-bold text-white/40 mt-3 uppercase italic">Bus Loading</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => handleSelectType(TripType.CARGO)}
                    className={`group p-12 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 transition-all hover:scale-105 active:scale-95 ${tripType === TripType.CARGO ? (isInternational ? 'bg-amber-500/5 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'bg-[#E60000]/5 border-[#E60000] shadow-[0_0_50px_rgba(230,0,0,0.2)]') : 'bg-[#020202] border-white/5 opacity-60'}`}
                  >
                    <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center transition-all ${tripType === TripType.CARGO ? (isInternational ? 'bg-amber-500 text-black' : 'bg-[#E60000] text-white') : 'bg-white/5 text-white/20'}`}>
                      <Truck size={64} />
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-black italic uppercase text-white">Cargo</span>
                      <p className="text-sm font-bold text-white/40 mt-3 uppercase italic">Heavy Load</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Trip Settings</h2>
                  {isInternational && (
                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2">
                       <Flag size={14} className="text-amber-500" />
                       <span className="text-[10px] font-black text-amber-500 uppercase italic">Across Border Ready</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Departure Park</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-6 text-[#E60000]" size={24} />
                      <input 
                        type="text" 
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="e.g. Jibowu Park" 
                        className="w-full bg-[#020202] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-6 text-xl font-black italic text-white focus:border-[#E60000] outline-none transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Target Park</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-6 text-emerald-500" size={24} />
                      <input 
                        type="text" 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder={isInternational ? "e.g. Accra Central" : "e.g. Abuja Gwagwalada"} 
                        className="w-full bg-[#020202] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-6 text-xl font-black italic text-white focus:border-emerald-500 outline-none transition-all shadow-inner" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Trip Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-6 text-white/20" size={24} />
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#020202] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-6 text-xl font-black italic text-white focus:border-[#E60000] outline-none transition-all" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Park Exit Time</label>
                    <div className="relative">
                      <Clock className="absolute left-6 top-6 text-white/20" size={24} />
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-[#020202] border-2 border-white/5 rounded-3xl pl-16 pr-8 py-6 text-xl font-black italic text-white focus:border-[#E60000] outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Load Space</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 text-center space-y-8">
                    <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Motor Total</p>
                    <div className="flex items-center justify-center gap-10">
                      <button onClick={() => setTotalSeats(Math.max(1, totalSeats - 1))} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all shadow-lg"><Minus /></button>
                      <span className="text-7xl font-black italic tech-mono text-white">{tripType === TripType.PASSENGER ? totalSeats : totalTonnage}</span>
                      <button onClick={() => setTotalSeats(totalSeats + 1)} className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all shadow-lg"><Plus /></button>
                    </div>
                  </div>
                  <div className={`p-10 border-4 rounded-[3.5rem] text-center space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.2)] relative ${isInternational ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#E60000]/10 border-[#E60000]/30'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isInternational ? 'text-amber-500' : 'text-[#E60000]'}`}>Available Space Now</p>
                    <div className="flex items-center justify-center gap-10">
                      <button onClick={() => setAvailableSeats(Math.max(0, availableSeats - 1))} className={`w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-110 transition-all ${isInternational ? 'bg-amber-500/20 text-amber-500' : 'bg-[#E60000]/20 text-[#E60000]'}`}><Minus /></button>
                      <span className="text-8xl font-black italic tech-mono text-white animate-pulse">{tripType === TripType.PASSENGER ? availableSeats : remainingTonnage}</span>
                      <button onClick={() => setAvailableSeats(availableSeats + 1)} className={`w-16 h-16 rounded-2xl flex items-center justify-center hover:scale-110 transition-all ${isInternational ? 'bg-amber-500/20 text-amber-500' : 'bg-[#E60000]/20 text-[#E60000]'}`}><Plus /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                <div className={`bg-[#020202] rounded-[4rem] border-4 p-12 space-y-10 relative overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.1)] ${isInternational ? 'border-amber-500/30' : 'border-[#E60000]/20'}`}>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-2">
                      <p className={`text-[11px] font-black uppercase tracking-[0.5em] italic ${isInternational ? 'text-amber-500' : 'text-[#E60000]'}`}>
                        {isInternational ? 'ACROSS BORDER WAYBILL' : 'INTERSTATE WAYBILL'}
                      </p>
                      <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
                        {origin || 'START'} <span className="text-white/20">to</span> {destination || 'END'}
                      </h3>
                    </div>
                    <div className="px-8 py-4 bg-white/5 rounded-3xl border border-white/10 text-white font-black text-[11px] uppercase tracking-widest italic flex items-center gap-3">
                      ID: AL-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 relative z-10 pt-6">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Exit Date</p>
                       <p className="text-2xl font-black text-white italic uppercase">{date || 'TBD'}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Settlement</p>
                       <p className={`text-2xl font-black italic uppercase ${isInternational ? 'text-amber-500' : 'text-white'}`}>{currency}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Space Left</p>
                       <p className={`text-3xl font-black italic uppercase ${isInternational ? 'text-amber-500' : 'text-[#E60000]'}`}>
                         {tripType === TripType.PASSENGER ? `${availableSeats} SEATS` : `${remainingTonnage} TONS`}
                       </p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Status</p>
                       <p className="text-2xl font-black text-emerald-500 italic uppercase">READY</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-12 flex justify-between items-center">
              {step > 1 ? (
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="px-12 py-6 text-white/40 font-black uppercase italic tracking-widest hover:text-white transition-all group flex items-center gap-4"
                >
                  <ArrowLeft size={28} className="group-hover:-translate-x-3 transition-transform" /> PREVIOUS
                </button>
              ) : (
                <div />
              )}
              <button 
                onClick={() => step < 4 ? setStep(step + 1) : handleFinish()}
                className={`px-20 py-10 rounded-[3rem] font-black text-3xl uppercase italic tracking-tighter shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-6 group ${isInternational ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-[#E60000] text-white shadow-[#E60000]/40'}`}
              >
                {step === 4 ? 'SYNC WAYBILL' : 'NEXT STEP'}
                <ChevronRight size={48} className="group-hover:translate-x-3 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;