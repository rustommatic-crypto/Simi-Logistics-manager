
import React, { useEffect, useRef, useState } from 'react';
import { Truck, Bike, Bus, Car, Volume2, X, Target, Plane, BusFront, Activity, AlertCircle, Sparkles, Clock, Calendar } from 'lucide-react';
import { VehicleType, IncomingJob, ServiceType } from '../types';
import { SimiAIService, decode, decodeAudioData } from '../services/geminiService';
import { getVehicleIcon } from './OrderClusters';

interface JobAlertProps {
  job: IncomingJob;
  onClose: () => void;
}

const JobAlert: React.FC<JobAlertProps> = ({ job, onClose }) => {
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const loopTimeoutRef = useRef<number | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const startAlarm = () => {
    const ctx = getAudioContext();
    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.9;
    mainGain.connect(ctx.destination);
    stopAlarm();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(440, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 3;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.6;
    lfo.connect(lfoGain);
    lfoGain.connect(mainGain.gain);
    lfo.start();

    osc1.connect(mainGain);
    osc2.connect(mainGain);
    osc1.start();
    osc2.start();
    
    oscillatorsRef.current = [osc1, osc2, lfo];
  };

  const stopAlarm = () => {
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    oscillatorsRef.current = [];
  };

  const performAnnounce = async () => {
    stopAlarm();
    setIsAnnouncing(true);

    const simi = new SimiAIService();
    let text = `High-yield mission detected for ${job.vehicleType} Operator. `;
    
    if (job.serviceType === ServiceType.HAILING) {
      text += `Ride hailing request at ${job.origin}. Payout is ${job.price} Naira. No dulling, move now!`;
    } else if (job.serviceType === ServiceType.CHARTER) {
      text += `New Charter request from ${job.origin} for ${job.duration || 'a full trip'}. Yield is ${job.price} Naira. Confirm sharp-sharp!`;
    } else {
      text += `Logistics mission found. Origin: ${job.origin}. Yield: ${job.price} Naira.`;
    }

    try {
      const audioBase64 = await simi.announceJob(text);
      if (audioBase64) {
        const ctx = getAudioContext();
        const data = decode(audioBase64);
        const buffer = await decodeAudioData(data, ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setIsAnnouncing(false);
          setAnnouncementCount(prev => prev + 1);
          loopTimeoutRef.current = window.setTimeout(startAlarmCycle, 3000);
        };
        source.start();
      } else {
        setIsAnnouncing(false);
        startAlarmCycle();
      }
    } catch (err) {
      console.error("Simi failed to speak:", err);
      setIsAnnouncing(false);
      startAlarmCycle();
    }
  };

  const startAlarmCycle = () => {
    startAlarm();
    loopTimeoutRef.current = window.setTimeout(performAnnounce, 5000);
  };

  const handleEngage = () => {
    stopAlarm();
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    onClose();
  };

  const handleDecline = () => {
    stopAlarm();
    if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    onClose();
  };

  useEffect(() => {
    startAlarmCycle();
    return () => {
      stopAlarm();
      if (loopTimeoutRef.current) clearTimeout(loopTimeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500 backdrop-blur-3xl">
      <div className="absolute inset-0 bg-[#000000]/98" />
      
      <div className="relative w-full max-w-4xl bg-[#0a0a0a] rounded-[5rem] p-16 md:p-24 text-center border-4 border-[#E60000]/30 shadow-[0_0_100px_rgba(230,0,0,0.5)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-white/5">
           <div className={`h-full bg-[#E60000] transition-all duration-[5000ms] linear ${!isAnnouncing ? 'w-full' : 'w-0 transition-none'}`} />
        </div>

        <div className={`flex justify-center mb-12 text-[#E60000] transition-all duration-300 ${isAnnouncing ? 'scale-110 opacity-100' : 'scale-100 opacity-40 animate-pulse'}`}>
           {getVehicleIcon(job.vehicleType, 160)}
        </div>

        <div className="space-y-4 mb-16">
          <div className="flex items-center justify-center gap-3">
             <AlertCircle size={24} className="text-[#E60000]" />
             <p className="font-black text-[#E60000] text-sm tracking-[0.5em] uppercase italic">
                {job.serviceType || 'Neural Alert'}
             </p>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter display-font">
            AREAGPT <span className="text-[#E60000]">LINK</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 text-left">
            <p className="text-[10px] font-black uppercase text-white/20 mb-2 tracking-widest">Pickup Location</p>
            <p className="text-3xl font-black text-white italic truncate">{job.origin}</p>
          </div>
          <div className="p-10 bg-[#E60000]/5 rounded-[3rem] border border-[#E60000]/20 text-right">
            <p className="text-[10px] font-black uppercase text-[#E60000] mb-2 tracking-widest">Yield Potential</p>
            <p className="text-4xl font-black text-white tech-mono italic leading-none">₦{job.price.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-8">
           <button 
             onClick={handleEngage}
             className="w-full py-12 bg-[#E60000] text-white rounded-[4rem] font-black text-4xl uppercase italic tracking-tighter shadow-2xl hover:scale-[1.03] transition-all duration-500 display-font group flex items-center justify-center gap-6"
           >
              <Target size={48} className="group-hover:rotate-90 transition-transform" /> ENGAGE PILOT
           </button>
           <button onClick={handleDecline} className="w-full py-4 text-white/10 hover:text-white/40 font-black text-[10px] uppercase tracking-[0.5em] transition-all italic">
             Return to Grid
           </button>
        </div>
      </div>
    </div>
  );
};

export default JobAlert;
