
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
  Globe2
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

  const agentTypes = [
    { id: AgentCategory.COURIER, label: 'Courier Agent', desc: 'Air Cargo, Sea Freight, DHL.', icon: Package },
    { id: AgentCategory.TRAVEL, label: 'Travel Agent', desc: 'Flights, Bus & Hotel bookings.', icon: Ticket }
  ];

  const bossTypes = [
    { id: 'employer', label: 'Employer / Fleet Boss', desc: 'Managing multiple pilots and fleet yields.', icon: Building2 },
    { id: 'hp_owner', label: 'HP Asset Owner', desc: 'Managing asset payments and contracts.', icon: BadgeCheck }
  ];

  const tiers = [
    { id: RegistrationCategory.LOCAL, label: 'Area Runs', desc: 'Local city operations.', icon: Package },
    { id: RegistrationCategory.INTERSTATE, label: 'Long Road', desc: 'State-to-State haulage.', icon: Truck },
    { id: RegistrationCategory.INTERNATIONAL, label: 'Cross Border', desc: 'ECOWAS routes.', icon: Globe },
    { id: RegistrationCategory.GLOBAL, label: 'Global Grid', desc: 'AreaGPT Worldwide Leads.', icon: Plane }
  ];

  const handleRoleSelection = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setStep(1.2);
  };

  const handleTierClick = (tierId: RegistrationCategory) => {
    if (selectedRole === UserRole.OPERATOR) {
      setSelectedTiers([tierId]);
      setStep(3);
    } else {
      setSelectedTiers(prev => 
        prev.includes(tierId) 
          ? prev.filter(t => t !== tierId) 
          : [...prev, tierId]
      );
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
      // Syncing with Backend Node
      await NeuralBridge.syncRegistration(payload);
      
      const simi = new SimiAIService();
      await simi.broadcastNews(`System Alert: New ${selectedRole} onboarding from ${selectedState}, ${selectedCountry}. Verification nodes locked.`);
      
      setTimeout(() => {
        onSuccess(selectedRole!, selectedTiers, selectedAgentCat || undefined);
      }, 2000);
    } catch (e) {
      alert("Neural Bridge Error: Could not link to backend.");
      setIsSyncing(false);
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-[1400px] mx-auto pb-40 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              if (step === 1.1 || step === 1.5 || step === 1.2) setStep(1);
              else if (step > 1) setStep(Math.floor(step));
              else onNavigate('dashboard');
            }} 
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"
          >
            <ArrowLeft size={32} />
          </button>
          <div>
            <h1 className="text-5xl font-black italic uppercase display-font tracking-tighter text-white leading-none">Neural Onboarding</h1>
            <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] italic mt-2">Authority Node Verification</p>
          </div>
        </div>
        <div className="flex gap-2">
           {[1, 2, 3, 4, 5].map(s => (
             <div key={s} className={`h-2 w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#E60000]' : 'bg-white/10'}`} />
           ))}
        </div>
      </div>

      <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
        
        {isSyncing && (
          <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-10 text-center space-y-8">
             <RefreshCcw size={80} className="animate-spin text-[#E60000]" />
             <h2 className="text-4xl font-black italic uppercase text-white">Linking Grid Persona...</h2>
             <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Transmitting Sector Nodes to Backend Hub</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="text-left">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Choose your Persona</h2>
               <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Which power node you wan operate on the grid?"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {roles.map(role => (
                 <button 
                   key={role.id}
                   onClick={() => handleRoleSelection(role.id)}
                   className={`p-10 rounded-[3rem] border-4 flex flex-col items-start text-left gap-6 transition-all hover:scale-[1.02] ${selectedRole === role.id ? 'bg-white/5 border-[#E60000]' : 'bg-black border-white/5 hover:border-white/20'}`}
                 >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${role.bg} ${role.color}`}>
                       <role.icon size={32} />
                    </div>
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
          <div className="space-y-12 animate-in slide-in-from-right-10 duration-500">
             <div className="text-left">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sector Link</h2>
                <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Driver, select your operating sector. We are linking all of Nigeria and Africa soon."</p>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-4">
                   <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-4">Select Country</h3>
                   <div className="space-y-3">
                      {AFRICAN_REGIONS.map(country => (
                        <button 
                          key={country.id}
                          disabled={!country.active}
                          onClick={() => setSelectedCountry(country.id)}
                          className={`w-full p-6 rounded-[1.5rem] border-2 flex items-center justify-between transition-all ${selectedCountry === country.id ? 'bg-[#E60000]/5 border-[#E60000] text-white shadow-xl' : country.active ? 'bg-black border-white/5 text-white/40 hover:border-white/10' : 'bg-black border-white/5 opacity-20 cursor-not-allowed'}`}
                        >
                           <div className="flex items-center gap-4">
                              <Globe2 size={24} />
                              <span className="text-lg font-black italic uppercase">{country.name}</span>
                           </div>
                           {!country.active && <span className="text-[8px] font-black uppercase opacity-60">Locked</span>}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                   <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest italic mb-4">Select Node (State)</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto scrollbar-hide p-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                      {AFRICAN_REGIONS.find(c => c.id === selectedCountry)?.states.map(state => (
                        <button 
                          key={state}
                          onClick={() => setSelectedState(state)}
                          className={`p-5 rounded-2xl border-2 text-[10px] font-black uppercase italic transition-all ${selectedState === state ? 'bg-[#E60000] text-white border-transparent shadow-lg scale-105' : 'bg-black border-white/5 text-white/20 hover:border-white/10'}`}
                        >
                           {state}
                        </button>
                      ))}
                   </div>
                   
                   <div className="pt-8">
                      <button 
                        disabled={!selectedState}
                        onClick={() => {
                           if (selectedRole === UserRole.AGENT) setStep(1.5);
                           else if (selectedRole === UserRole.EMPLOYER) setStep(1.1);
                           else setStep(2);
                        }}
                        className={`w-full py-8 rounded-[2.5rem] font-black text-2xl uppercase italic flex items-center justify-center gap-4 transition-all shadow-2xl ${selectedState ? 'bg-[#E60000] text-white hover:scale-105 active:scale-95' : 'bg-white/5 text-white/10 cursor-not-allowed'}`}
                      >
                         LINK SECTOR <Navigation size={28} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {step === 1.1 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="text-left">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-blue-500">Boss Authority Path</h2>
               <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Boss, wetin be your movement for {selectedState}?"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {bossTypes.map(boss => (
                 <button 
                   key={boss.id}
                   onClick={() => { setSubBossType(boss.id as any); setStep(2); }}
                   className={`p-12 rounded-[3.5rem] border-4 flex flex-col items-start text-left gap-8 transition-all hover:scale-[1.02] ${subBossType === boss.id ? 'bg-blue-600/5 border-blue-600' : 'bg-black border-white/5 hover:border-white/20'}`}
                 >
                    <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center bg-blue-600 text-white shadow-2xl">
                       <boss.icon size={40} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{boss.label}</h3>
                       <p className="text-lg font-bold text-white/30 mt-4 leading-tight italic">{boss.desc}</p>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 1.5 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="text-left">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter text-emerald-500">Global Agent Type</h2>
               <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Agent, which international leads you wan handle in {selectedState}?"</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {agentTypes.map(agent => (
                 <button 
                   key={agent.id}
                   onClick={() => { setSelectedAgentCat(agent.id); setStep(2); }}
                   className={`p-10 rounded-[3rem] border-4 flex flex-col items-start text-left gap-6 transition-all hover:scale-[1.02] ${selectedAgentCat === agent.id ? 'bg-white/5 border-emerald-500' : 'bg-black border-white/5 hover:border-white/20'}`}
                 >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                       <agent.icon size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{agent.label}</h3>
                       <p className="text-sm font-bold text-white/30 mt-3 leading-tight italic">{agent.desc}</p>
                    </div>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right-10 duration-500">
            <div className="text-left">
               <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Reach & Radius</h2>
               <p className="text-lg text-white/40 font-bold italic mt-2">Simi: "Select your operating tiers. AreaGPT leads depend on this."</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {tiers.map(tier => {
                 const isSelected = selectedTiers.includes(tier.id);
                 return (
                   <button 
                     key={tier.id}
                     onClick={() => handleTierClick(tier.id)}
                     className={`p-10 rounded-[3rem] border-4 flex flex-col items-start text-left gap-6 transition-all hover:scale-[1.02] relative ${isSelected ? 'bg-[#E60000]/5 border-[#E60000]' : 'bg-black border-white/5 hover:border-white/20'}`}
                   >
                      {isSelected && <Check className="absolute top-6 right-6 text-[#E60000]" />}
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 text-white">
                         <tier.icon size={32} />
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{tier.label}</h3>
                         <p className="text-sm font-bold text-white/30 mt-2 leading-tight italic">{tier.desc}</p>
                      </div>
                   </button>
                 );
               })}
            </div>
            {selectedRole !== UserRole.OPERATOR && (
               <div className="pt-8">
                  <button onClick={() => setStep(3)} className="w-full py-10 bg-[#E60000] text-white rounded-[3rem] font-black text-2xl uppercase italic shadow-2xl">NEXT: IDENTITY SYNC</button>
               </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 text-left">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">National Identity Node</h2>
            <div className="relative">
               <Fingerprint className="absolute left-8 top-1/2 -translate-y-1/2 text-[#E60000]" size={32} />
               <input 
                 type="text" 
                 maxLength={11}
                 value={nin}
                 onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                 placeholder="Enter 11-digit NIN"
                 className="w-full bg-[#020202] border-4 border-white/5 rounded-[2.5rem] pl-20 pr-10 py-10 text-3xl font-black text-white focus:border-[#E60000] outline-none tech-mono"
               />
            </div>
            <button onClick={() => setStep(4)} disabled={nin.length < 11} className="w-full py-10 bg-[#E60000] text-white rounded-[3rem] font-black text-2xl uppercase italic disabled:opacity-30">SYNC NIN NODE</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10 text-left">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Biometric Audit</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <button onClick={() => { setVideoStep('facial'); startCamera(); }} className={`p-10 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 ${capturedFacial ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5'}`}>
                  <Scan size={48} className={capturedFacial ? 'text-emerald-500' : 'text-white/20'} />
                  <span className="text-xl font-black text-white uppercase italic">Facial Scan</span>
               </button>
               <button onClick={() => { setVideoStep('area'); startCamera(); }} className={`p-10 rounded-[3.5rem] border-4 flex flex-col items-center gap-6 ${capturedArea ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/5'}`}>
                  <Video size={48} className={capturedArea ? 'text-emerald-500' : 'text-white/20'} />
                  <span className="text-xl font-black text-white uppercase italic">Operation Site</span>
               </button>
            </div>

            {videoStep !== 'none' && (
              <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-10">
                 <div className="relative w-full max-w-xl aspect-square rounded-[5rem] overflow-hidden border-8 border-white/10 bg-black">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale opacity-80" />
                    {isRecording && <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#E60000] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase flex items-center gap-3 animate-bounce shadow-2xl">RECORDING...</div>}
                 </div>
                 <div className="mt-12 flex gap-6">
                    <button onClick={() => { stopCamera(); setVideoStep('none'); }} className="px-12 py-5 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest">ABORT</button>
                    <button onClick={handleRecord} className="px-24 py-5 bg-[#E60000] text-white rounded-2xl font-black uppercase shadow-2xl">LOG NODE</button>
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
