
import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  UserCheck,
  Truck,
  Globe,
  Package,
  Command,
  Crown,
  Video,
  Loader2,
  Fingerprint,
  RefreshCcw,
  Scan,
  Check,
  Plane,
  Ticket,
  BadgeCheck,
  FileText,
  MapPin,
  ChevronRight,
  Flag,
  Navigation,
  Globe2,
  Heart,
  Fuel
} from 'lucide-react';
import { SimiAIService, NeuralBridge } from '../services/geminiService';
import { UserRole, RegistrationCategory, AgentCategory, RegistrationPayload } from '../types';

const NIGERIAN_STATES = [
  "Lagos", "Abuja (FCT)", "Rivers", "Kano", "Oyo", "Enugu", "Anambra", "Delta", 
  "Kaduna", "Ogun", "Edo", "Abia", "Adamawa", "Akwa Ibom", "Bauchi", "Bayelsa", 
  "Benue", "Borno", "Cross River", "Ebonyi", "Ekiti", "Gombe", "Imo", "Jigawa", 
  "Katsina", "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Ondo", "Osun", 
  "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

const AFRICAN_REGIONS = [
  { id: 'NG', name: 'Nigeria', active: true, states: NIGERIAN_STATES },
  { id: 'GH', name: 'Ghana', active: false, states: ["Accra", "Kumasi", "Tamale"] },
  { id: 'KE', name: 'Kenya', active: false, states: ["Nairobi", "Mombasa", "Kisumu"] },
  { id: 'ZA', name: 'South Africa', active: false, states: ["Johannesburg", "Cape Town", "Durban"] }
];

interface RegistrationCenterProps {
  onNavigate: (tab: string) => void;
  onSuccess: (role: UserRole, tiers: RegistrationCategory[], agentCat?: AgentCategory) => void;
}

const RegistrationCenter: React.FC<RegistrationCenterProps> = ({ onNavigate, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedAgentCat, setSelectedAgentCat] = useState<AgentCategory | null>(null);
  const [subBossType, setSubBossType] = useState<'employer' | 'hp_owner' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [selectedState, setSelectedState] = useState('');
  const [selectedTiers, setSelectedTiers] = useState<RegistrationCategory[]>([]);
  const [nin, setNin] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [videoStep, setVideoStep] = useState<'facial' | 'area' | 'none'>('none');
  const [capturedFacial, setCapturedFacial] = useState<boolean>(false);
  const [capturedArea, setCapturedArea] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const roles = [
    { id: UserRole.OPERATOR, label: 'Pilot (Driver)', desc: 'Individual driver or operator.', icon: UserCheck, color: 'text-[#E60000]', bg: 'bg-[#E60000]/10' },
    { id: UserRole.EMPLOYER, label: 'Fleet Boss', desc: 'Managing machines or HP assets.', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: UserRole.AGENT, label: 'Global Agent', desc: 'Courier & Travel bookings.', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
  ];

  const tiers = [
    { id: RegistrationCategory.LOCAL, label: 'Area Runs', desc: 'Local city operations.', icon: Package },
    { id: RegistrationCategory.INTERSTATE, label: 'Long Road', desc: 'State-to-State haulage.', icon: Truck },
    { id: RegistrationCategory.INTERNATIONAL, label: 'Cross Border', desc: 'ECOWAS routes.', icon: Globe }
  ];

  const handleRoleSelection = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setStep(1.2);
  };

  const handleTierClick = (tierId: RegistrationCategory) => {
    if (selectedTiers.includes(tierId)) {
      setSelectedTiers(prev => prev.filter(t => t !== tierId));
    } else {
      setSelectedTiers(prev => [...prev, tierId]);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Simi: Pilot, I need camera access to verify your identity node!");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      if (videoStep === 'facial') setCapturedFacial(true);
      if (videoStep === 'area') setCapturedArea(true);
      setVideoStep('none');
      stopCamera();
    }, 3000);
  };

  const handleFinalSubmit = async () => {
    setIsSyncing(true);
    
    const payload: RegistrationPayload = {
      role: selectedRole!,
      country: selectedCountry,
      state: selectedState,
      tiers: selectedTiers,
      nin: nin,
      biometrics: {
        facialCaptured: capturedFacial,
        siteCaptured: capturedArea
      },
      agentCategory: selectedAgentCat || undefined,
      bossType: subBossType || undefined
    };

    try {
      await NeuralBridge.syncRegistration(payload);
      const simi = new SimiAIService();
      await simi.announceJob(`Oya Pilot! Registration set. I don activate your Fuel Credit and Life Insurance Hub. No dulling!`);
      
      setTimeout(() => {
        onSuccess(selectedRole!, selectedTiers, selectedAgentCat || undefined);
      }, 2000);
    } catch (e) {
      alert("Neural Bridge Error: Could not link to backend.");
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-[1400px] mx-auto pb-40 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              if (step > 1) setStep(Math.floor(step - 1));
              else onNavigate('dashboard');
            }} 
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
          >
            <ArrowLeft size={32} />
          </button>
          <div>
            <h1 className="text-5xl font-black italic uppercase display-font tracking-tighter text-white leading-none">Neural Onboarding</h1>
            <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] italic mt-2">Activate Insurance & Fuel Credit</p>
          </div>
        </div>
        <div className="flex gap-2">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={`h-2 w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#E60000]' : 'bg-white/10'}`} />
           ))}
        </div>
      </div>

      <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
        
        {isSyncing && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-10 text-center space-y-8">
             <RefreshCcw size={80} className="animate-spin text-[#E60000]" />
             <h2 className="text-4xl font-black italic uppercase text-white">Linking Perks Node...</h2>
             <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Activating Insurance Shield & Fuel Credit</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="text-left">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Identity Sync</h2>
               <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Driver, who you be on the grid?"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {roles.map(role => (
                 <button 
                   key={role.id}
                   onClick={() => handleRoleSelection(role.id)}
                   className={`p-10 rounded-[3rem] border-4 flex flex-col items-start text-left gap-6 transition-all hover:scale-[1.02] ${selectedRole === role.id ? 'bg-white/5 border-[#E60000]' : 'bg-black border-white/5 hover:border-white/20'}`}
                 >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${role.bg} ${role.color}`}><role.icon size={32} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{role.label}</h3>
                       <p className="text-sm font-bold text-white/30 mt-3 leading-tight italic">{role.desc}</p>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 1.2 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
             <div className="text-left">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sector Link</h2>
                <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Driver, select your operating sector. We are linking nodes globally."</p>
             </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                {NIGERIAN_STATES.map(state => (
                  <button key={state} onClick={() => { setSelectedState(state); setStep(2); }} className={`p-5 rounded-2xl border-2 text-[10px] font-black uppercase italic transition-all ${selectedState === state ? 'bg-[#E60000] text-white border-transparent shadow-lg' : 'bg-black border-white/5 text-white/20 hover:border-white/10'}`}>
                     {state}
                  </button>
                ))}
             </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 text-left">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Corridor Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {tiers.map(tier => (
                 <button key={tier.id} onClick={() => handleTierClick(tier.id)} className={`p-8 rounded-[3rem] border-4 text-left transition-all ${selectedTiers.includes(tier.id) ? 'bg-[#E60000]/5 border-[#E60000]' : 'bg-black border-white/5'}`}>
                    <tier.icon size={32} className="text-[#E60000] mb-4" />
                    <h3 className="text-xl font-black text-white italic uppercase">{tier.label}</h3>
                    <p className="text-xs text-white/40 mt-2 italic">{tier.desc}</p>
                 </button>
               ))}
            </div>
            <button disabled={selectedTiers.length === 0} onClick={() => setStep(3)} className="w-full py-8 bg-[#E60000] text-white rounded-[2rem] text-xl font-black uppercase italic tracking-tighter shadow-2xl disabled:opacity-20">NEXT: AUTHORITY DOCS</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 text-left">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Identity Node</h2>
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10 space-y-4">
               <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Enter NIN Number</label>
               <input 
                 type="text" 
                 value={nin} 
                 onChange={(e) => setNin(e.target.value)} 
                 placeholder="00000000000" 
                 className="w-full bg-black border-2 border-white/10 rounded-2xl px-8 py-6 text-2xl font-black italic text-white focus:border-[#E60000] outline-none" 
               />
            </div>
            <button disabled={nin.length < 11} onClick={() => setStep(4)} className="w-full py-8 bg-[#E60000] text-white rounded-[2rem] text-xl font-black uppercase italic tracking-tighter shadow-2xl disabled:opacity-20">PROCEED TO BIOMETRICS</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 text-left">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Biometric Upgrade</h2>
            <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 mb-10">
               <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl"><Heart size={32} /></div>
               <div className="text-left flex-1">
                  <p className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">Benefit Unlocked: Life Insurance Shield</p>
                  <p className="text-sm font-bold text-white/40 italic">Finalizing scan activates your ₦1.5M Social Shield cover.</p>
               </div>
               <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center"><Fuel size={32} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <button onClick={() => { setVideoStep('facial'); startCamera(); }} className={`p-10 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 ${capturedFacial ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5'}`}>
                  <Scan size={48} className={capturedFacial ? 'text-emerald-500' : 'text-white/20'} />
                  <span className="text-xl font-black text-white uppercase italic">Facial Sync</span>
               </button>
               <button onClick={() => { setVideoStep('area'); startCamera(); }} className={`p-10 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 ${capturedArea ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5'}`}>
                  <Video size={48} className={capturedArea ? 'text-emerald-500' : 'text-white/20'} />
                  <span className="text-xl font-black text-white uppercase italic">Machine Video</span>
               </button>
            </div>

            {videoStep !== 'none' && (
              <div className="fixed inset-0 z-[110] bg-black/98 flex flex-col items-center justify-center p-10">
                 <div className="relative w-full max-w-xl aspect-square rounded-[5rem] overflow-hidden border-8 border-white/10 bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-80" />
                    {isRecording && <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#E60000] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase flex items-center gap-3 animate-bounce shadow-2xl">RECORDING...</div>}
                 </div>
                 <div className="mt-12 flex gap-6">
                    <button onClick={() => { stopCamera(); setVideoStep('none'); }} className="px-12 py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest">CANCEL</button>
                    <button onClick={handleRecord} className="px-24 py-5 bg-[#E60000] text-white rounded-2xl font-black uppercase shadow-2xl">SYNC BIOMETRIC</button>
                 </div>
              </div>
            )}

            <button 
              disabled={!capturedFacial || !capturedArea}
              onClick={handleFinalSubmit}
              className="w-full py-12 bg-[#E60000] text-white rounded-[3.5rem] text-3xl font-black uppercase italic shadow-2xl disabled:opacity-30"
            >
              FINALIZE ONBOARDING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationCenter;
