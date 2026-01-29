import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  ArrowLeft, 
  Share2, 
  Globe, 
  Package, 
  Zap,
  Truck,
  CheckCircle2,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { UserProfile, RegistrationCategory } from '../types';

interface UserProfileViewProps {
  profile: UserProfile;
  onBack?: () => void;
  isOwnProfile?: boolean;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ profile, onBack, isOwnProfile }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Simi: Pilot, your browser no support GPS node tracking!");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error("GPS Intercept Error:", error);
        setIsLocating(false);
        alert("Simi: I no fit lock your location node. Check your permissions!");
      }
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AreaLine Pilot Profile',
        text: `Check out Pilot ${profile.name} on AreaLine.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert("Profile link copied to grid!");
    }
  };

  return (
    <div className="p-4 md:p-10 space-y-10 pb-40 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Header Navigation & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all shadow-xl"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="text-left">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter display-font italic">
              {isOwnProfile ? 'Pilot Console' : 'Operator Record'}
            </h1>
            <p className="text-[#E60000] font-black text-[10px] uppercase tracking-[0.4em] italic mt-1">
              Verified AreaLine Operator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all flex items-center gap-2 group shadow-lg"
            title="Share Profile"
          >
            <Share2 size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          
          <button 
            onClick={handleGetLocation}
            disabled={isLocating}
            className={`p-4 bg-white/5 border border-white/10 rounded-2xl transition-all flex items-center gap-3 shadow-lg group ${location ? 'border-emerald-500/30' : ''}`}
            title="Locate GPS Node"
          >
            <MapPin size={24} className={location ? "text-emerald-500" : "text-white/40 group-hover:text-white"} />
            {isLocating && <Loader2 size={16} className="animate-spin text-[#E60000]" />}
            {location && (
              <div className="text-left">
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">Grid Lock</p>
                <p className="text-[10px] font-black text-white italic tech-mono">{location}</p>
              </div>
            )}
            {!location && !isLocating && <span className="hidden md:inline text-[9px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-white/40">Sync GPS</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card & Bio */}
        <div className="space-y-8">
          <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-[#E60000]/20 to-transparent opacity-30" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative mb-8">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-40 h-40 rounded-[3rem] border-8 border-[#0A0A0A] shadow-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
                <div className="absolute -bottom-3 -right-3 bg-[#E60000] p-4 rounded-[1.5rem] text-white shadow-2xl border-4 border-[#0A0A0A]">
                  <ShieldCheck size={28} />
                </div>
              </div>

              <h2 className="text-3xl font-black text-white mb-3 italic uppercase display-font tracking-tight">{profile.name}</h2>
              <div className="flex items-center gap-2 text-amber-500 mb-6 bg-white/5 px-6 py-2 rounded-full">
                <Star size={20} fill="currentColor" />
                <span className="text-xl font-black text-white tech-mono">{profile.rating}</span>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Rating</span>
              </div>

              <p className="text-lg text-white/40 font-bold leading-relaxed mb-10 italic px-6">
                "{profile.bio}"
              </p>

              {/* REGISTRATION BADGE */}
              <div className="w-full p-8 bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center gap-4">
                 <div className="flex gap-2">
                    {profile.registrationLevels.map((lvl, idx) => (
                      <div key={idx} className="w-12 h-12 bg-[#E60000] rounded-xl flex items-center justify-center text-white shadow-2xl">
                        {lvl === RegistrationCategory.INTERNATIONAL ? <Globe size={24} /> : 
                         lvl === RegistrationCategory.INTERSTATE ? <Truck size={24} /> : 
                         <Package size={24} />}
                      </div>
                    ))}
                 </div>
                 <div className="text-center">
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em] mb-1">Authorized Tiers</p>
                    <p className="text-xl font-black text-white italic uppercase tracking-tighter">{profile.registrationLevels.join(' | ')}</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Records Transparency Sync */}
          <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3.5rem] p-10 shadow-2xl space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <Activity size={28} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Neural Link Status</h3>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Live Sync Active</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-left">
              {[
                { label: 'Manifest History', status: 'LOCKED' },
                { label: 'AreaGPT Visibility', status: 'OPEN' },
                { label: 'Yield Analytics', status: 'OWNER ONLY' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-4 border-b border-white/5">
                  <span className="text-white/40 font-black uppercase text-[10px] tracking-widest italic">{item.label}</span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter italic px-3 py-1 rounded-lg ${item.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/20'}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats & Activity */}
        <div className="lg:col-span-2 space-y-10">
          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-[#E60000]/30 transition-all text-left">
              <div className="p-4 bg-[#E60000]/10 text-[#E60000] rounded-2xl w-fit mb-6">
                <Truck size={32} />
              </div>
              <div>
                <p className="text-5xl font-black text-white mb-2 tech-mono italic">{profile.stats.totalTrips}</p>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">Total Missions</p>
              </div>
            </div>
            <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-emerald-500/30 transition-all text-left">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mb-6">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-5xl font-black text-white mb-2 tech-mono italic">{profile.stats.completionRate}%</p>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">Grid Reliability</p>
              </div>
            </div>
            <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[3rem] p-10 flex flex-col justify-between group hover:border-blue-500/30 transition-all text-left">
              <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mb-6">
                <TrendingUp size={32} />
              </div>
              <div>
                <p className="text-5xl font-black text-white mb-2 tech-mono italic">{profile.stats.reputation}</p>
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest italic">Grid Reputation</p>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-[#0A0A0A] border-4 border-white/5 rounded-[4rem] p-12 shadow-2xl space-y-10 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Recent Grid Activity</h3>
              <button className="text-[10px] font-black text-[#E60000] uppercase tracking-widest italic border-b border-[#E60000]/20">VIEW ALL</button>
            </div>
            
            <div className="space-y-6">
              {profile.recentActivity && profile.recentActivity.length > 0 ? (
                profile.recentActivity.map((act) => (
                  <div key={act.id} className="flex gap-6 items-start p-6 bg-white/[0.03] border border-white/5 rounded-3xl group hover:border-[#E60000]/20 transition-all">
                    <div className="w-12 h-12 bg-[#E60000]/10 text-[#E60000] rounded-xl flex items-center justify-center shrink-0">
                      <Zap size={20} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-lg font-black text-white italic leading-none">{act.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{act.timestamp}</span>
                        <span className="text-[10px] font-black text-[#E60000] uppercase tracking-widest italic flex items-center gap-1">
                          <MapPin size={10} /> {act.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-white/10 font-black uppercase italic tracking-widest">
                   No recent grid activity detected.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;