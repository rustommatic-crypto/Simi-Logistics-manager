
import React, { useState } from 'react';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Briefcase,
  FileText,
  BadgeCheck,
  UserCheck,
  Truck,
  Command
} from 'lucide-react';
import { SimiAIService } from '../services/geminiService';
import { UserRole } from '../types';

interface BossRegistrationProps {
  onNavigate: (tab: string) => void;
  onSuccess: () => void;
}

const BossRegistration: React.FC<BossRegistrationProps> = ({ onNavigate, onSuccess }) => {
  const [subRole, setSubRole] = useState<'employer' | 'hp_owner' | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  
  const handleDocClick = (doc: string) => {
    if (!uploadedDocs.includes(doc)) {
      setUploadedDocs([...uploadedDocs, doc]);
    }
  };

  const handleSubmit = async () => {
    const simi = new SimiAIService();
    try {
      const roleText = subRole === 'employer' ? "Employer/Boss" : "Hire Purchase Owner";
      await simi.broadcastNews(`Boss, I don collect your papers for ${roleText} registration. Your application for Authority Node is now pending review. Simi go monitor am for you!`);
    } catch (e) {}
    onSuccess();
  };

  const requirementsMap = {
    employer: [
      { id: 'cac', label: 'CAC Business Registration', icon: Building2 },
      { id: 'tax', label: 'Company Tax Clearance', icon: FileText },
      { id: 'office', label: 'Office Address Verification', icon: CheckCircle2 }
    ],
    hp_owner: [
      { id: 'id', label: 'Valid Government ID', icon: UserCheck },
      { id: 'hp_cert', label: 'HP Asset Certificate', icon: BadgeCheck },
      { id: 'bank', label: '6-Month Bank Statement', icon: FileText }
    ]
  };

  if (!subRole) {
    return (
      <div className="p-4 md:p-10 space-y-12 max-w-5xl mx-auto pb-40 animate-in fade-in duration-500">
        <div className="text-left space-y-4">
           <h1 className="text-6xl font-black italic uppercase display-font tracking-tighter text-white">Upgrade to Oga</h1>
           <p className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] italic">Select your Authority Node Path</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <button 
             onClick={() => setSubRole('employer')}
             className="group relative bg-[#0A0A0A] border-4 border-white/5 p-12 rounded-[4rem] text-left transition-all hover:border-blue-600/50 hover:scale-[1.02] shadow-2xl"
           >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Building2 size={180} />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                    <Building2 size={40} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">Employer / Fleet Boss</h3>
                    <p className="text-lg text-white/40 font-bold italic leading-tight">
                       Register a company, manage multiple pilots, and track fleet yields in real-time.
                    </p>
                 </div>
                 <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-widest italic pt-4">
                    SELECT THIS PATH <Zap size={14} />
                 </div>
              </div>
           </button>

           <button 
             onClick={() => setSubRole('hp_owner')}
             className="group relative bg-[#0A0A0A] border-4 border-white/5 p-12 rounded-[4rem] text-left transition-all hover:border-blue-600/50 hover:scale-[1.02] shadow-2xl"
           >
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Truck size={180} />
              </div>
              <div className="relative z-10 space-y-8">
                 <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                    <BadgeCheck size={40} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">HP Asset Owner</h3>
                    <p className="text-lg text-white/40 font-bold italic leading-tight">
                       Manage Hire Purchase contracts, track asset payments, and monitor vehicle health.
                    </p>
                 </div>
                 <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-widest italic pt-4">
                    SELECT THIS PATH <Zap size={14} />
                 </div>
              </div>
           </button>
        </div>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-white/20 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest italic mx-auto"
        >
           <ArrowLeft size={16} /> Never mind, I'm just a Pilot for now
        </button>
      </div>
    );
  }

  const currentRequirements = requirementsMap[subRole];

  return (
    <div className="p-4 md:p-10 space-y-12 max-w-4xl mx-auto pb-40 animate-in slide-in-from-right-10 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-6 text-left">
           <button onClick={() => setSubRole(null)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all"><ArrowLeft size={32} /></button>
           <div>
              <h1 className="text-5xl font-black italic uppercase display-font tracking-tighter text-white">Authority Node</h1>
              <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] italic mt-2">
                {subRole === 'employer' ? 'Company/Fleet Registration' : 'HP Asset Owner Verification'}
              </p>
           </div>
        </div>
        <div className="px-6 py-3 bg-blue-600/10 border border-blue-600/30 rounded-2xl flex items-center gap-3">
           <ShieldCheck size={20} className="text-blue-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Node Encryption Active</span>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border-4 border-blue-600/20 rounded-[4rem] p-10 md:p-16 space-y-12 shadow-[0_0_80px_rgba(59,130,246,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
           <Command size={300} className="text-blue-600" />
        </div>

        <div className="relative z-10 flex items-center gap-10 bg-blue-600/10 p-10 rounded-[3rem] border border-blue-600/20">
           <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shrink-0">
              <Zap size={40} className="animate-pulse" />
           </div>
           <div className="text-left">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Simi: "Boss Node Setup"</h3>
              <p className="text-lg font-bold text-white/40 italic leading-tight">
                {subRole === 'employer' 
                  ? "We need your business papers to link your fleet console to the Grid. This allows you to legally manage multiple drivers."
                  : "We need to verify your asset ownership. This ensures you can track payments and remotely manage vehicle nodes."
                }
              </p>
           </div>
        </div>

        <div className="space-y-8 relative z-10 text-left">
          <h3 className="text-xs font-black uppercase text-white/20 tracking-[0.5em] mb-4">REQUIRED NODES</h3>
          <div className="grid grid-cols-1 gap-4">
            {currentRequirements.map(req => (
              <button 
                key={req.id}
                onClick={() => handleDocClick(req.label)}
                className={`w-full p-10 rounded-[2.5rem] border-2 flex items-center justify-between transition-all group ${uploadedDocs.includes(req.label) ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : 'bg-white/5 border-white/5 text-white/40 hover:border-blue-600/40'}`}
              >
                <div className="flex items-center gap-6">
                   <div className={`p-4 rounded-xl transition-colors ${uploadedDocs.includes(req.label) ? 'bg-emerald-500/20' : 'bg-white/5 group-hover:bg-blue-600/20'}`}>
                      <req.icon size={32} />
                   </div>
                   <span className="text-xl font-black uppercase italic tracking-widest">{req.label}</span>
                </div>
                {uploadedDocs.includes(req.label) ? <CheckCircle2 size={32} className="animate-in zoom-in" /> : <Zap size={32} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 relative z-10">
           <button 
             disabled={uploadedDocs.length < currentRequirements.length}
             onClick={handleSubmit}
             className={`w-full py-12 rounded-[3.5rem] text-3xl font-black uppercase italic shadow-2xl transition-all duration-500 flex items-center justify-center gap-6 ${uploadedDocs.length >= currentRequirements.length ? 'bg-blue-600 text-white hover:scale-105 active:scale-95 shadow-[0_20px_80px_rgba(59,130,246,0.4)]' : 'bg-white/5 text-white/10 grayscale cursor-not-allowed'}`}
           >
             VERIFY AUTHORITY <Zap size={40} />
           </button>
           <p className="mt-8 text-center text-white/20 font-black text-[10px] uppercase tracking-widest italic">
              Verification takes 24 hours. Neural link go notify you.
           </p>
        </div>
      </div>
    </div>
  );
};

export default BossRegistration;
