
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './components/Dashboard';
import OrderClusters from './components/OrderClusters';
import TripPlanner from './components/TripPlanner';
import MerchantPanel from './components/MerchantPanel';
import WalletPanel from './components/WalletPanel';
import AIAssistant from './components/AIAssistant';
import Community from './Community';
import UserProfileView from './components/UserProfileView';
import Workspace from './components/Workspace';
import RegistrationCenter from './components/RegistrationCenter';
import JobAlert from './components/JobAlert';
import SupportGrid from './components/SupportGrid';
import OngoingWork from './components/OngoingWork';
import { 
  Menu, 
  User, 
  RefreshCcw, 
  Zap, 
  Globe, 
  Home, 
  PackageSearch, 
  MapPin, 
  Wallet, 
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import { 
  VehicleType, 
  IncomingJob, 
  UserRole, 
  ServiceType, 
  RegistrationCategory, 
  VerificationStatus, 
  RouteMode, 
  OrderCluster 
} from './types';
import { ambientEngine } from './services/ambientEngine';
import { SimiAIService, decode, decodeAudioData, getOutputContext } from './services/geminiService';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.OPERATOR);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewedProfileId, setViewedProfileId] = useState<string | null>(null);
  
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRoleSyncing, setIsRoleSyncing] = useState(false);

  // User is already registered and approved
  const [registrationLevels, setRegistrationLevels] = useState<RegistrationCategory[]>([
    RegistrationCategory.LOCAL,
    RegistrationCategory.INTERSTATE
  ]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.APPROVED);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.TRUCK);

  const [routeMode, setRouteMode] = useState<RouteMode>(RouteMode.ROAMING);
  const [destination, setDestination] = useState('');
  const [activeClusterMission, setActiveClusterMission] = useState<OrderCluster | null>(null);

  const simiRef = useRef(new SimiAIService());

  const handleInitAudio = async () => {
    setIsSyncing(true);
    try {
      await ambientEngine.init();
      const ctx = getOutputContext();
      if (ctx.state === 'suspended') await ctx.resume();
      
      const audio = await simiRef.current.announceJob("Grid link set. Welcome back, Pilot Bakare. I dey stand by for you.");
      if (audio) {
        const buffer = await decodeAudioData(decode(audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }

      setIsAudioInitialized(true);
      setIsSyncing(false);
    } catch (e) {
      console.error("Neural Sync Error", e);
      setIsAudioInitialized(true);
      setIsSyncing(false);
    }
  };

  const handleRoleSwitch = async (role: UserRole) => {
    setIsRoleSyncing(true);
    setUserRole(role);
    setActiveTab('dashboard');
    setTimeout(() => setIsRoleSyncing(false), 1000);
  };

  const handleEngageMission = useCallback((cluster: OrderCluster) => {
    setActiveClusterMission(cluster);
    setRouteMode(RouteMode.SPECIAL);
    setActiveTab('active-work');
  }, []);

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <UserProfileView 
        profile={{
          id: 'AL-PILOT-994', name: 'Tunde Bakare', avatar: 'https://picsum.photos/seed/driver7/200/200', role: userRole,
          rating: 4.9, joinedDate: 'Feb 2024', bio: 'Elite Operator at Lagos-South Node.', services: [ServiceType.LOGISTICS],
          stats: { totalTrips: 1242, completionRate: 98.5, reputation: 920 }, recentActivity: [],
          registrationLevels: registrationLevels, verificationStatus: verificationStatus, activeVehicle: selectedVehicle
        }} 
        isOwnProfile={true} 
        onBack={() => setActiveTab('dashboard')} 
      />;
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} activeMission={activeClusterMission} vStatus={verificationStatus} />;
      case 'workspace': return <Workspace activeVehicle={selectedVehicle} setVehicle={setSelectedVehicle} onNavigate={setActiveTab} userRole={userRole} routeMode={routeMode} setRouteMode={setRouteMode} destination={destination} setDestination={setDestination} regLevels={registrationLevels} setRegLevels={setRegistrationLevels} vStatus={verificationStatus} setVStatus={setVerificationStatus} />;
      case 'orders': return <OrderClusters onNavigate={setActiveTab} onEngageCluster={handleEngageMission} vehicle={selectedVehicle} walletLocked={false} />;
      case 'active-work': return activeClusterMission ? <OngoingWork mission={activeClusterMission} onComplete={() => { setActiveClusterMission(null); setActiveTab('dashboard'); }} onCancel={() => { setActiveClusterMission(null); setActiveTab('dashboard'); }} onNavigate={setActiveTab} routeMode={routeMode} /> : <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} vStatus={verificationStatus} />;
      case 'trips': return <TripPlanner onNavigate={setActiveTab} onLaunch={() => setActiveTab('dashboard')} activeTiers={registrationLevels} />;
      case 'fleet': return <MerchantPanel userRole={userRole} onNavigate={setActiveTab} />;
      case 'earnings': return <WalletPanel balance={500} onNavigate={setActiveTab} />;
      case 'community': return <Community onNavigate={setActiveTab} />;
      case 'registration-center': return <RegistrationCenter onNavigate={setActiveTab} onSuccess={(role, tiers) => { setUserRole(role); setRegistrationLevels(tiers); setVerificationStatus(VerificationStatus.APPROVED); setActiveTab('dashboard'); }} />;
      default: return <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} vStatus={verificationStatus} />;
    }
  };

  if (!isAudioInitialized) {
    return (
      <div className="fixed inset-0 bg-[#020202] flex flex-col items-center justify-center p-10 text-center z-[500]">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#E60000]/10 border-4 border-[#E60000]/30 rounded-[3rem] flex items-center justify-center text-[#E60000] mb-8 animate-pulse shadow-2xl">
          <Zap size={64} />
        </div>
        <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-4">AreaLine Neural</h1>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-8 italic">Establish Link to Current Grid</p>
        <button 
          onClick={handleInitAudio} 
          disabled={isSyncing}
          className="w-full max-w-xs py-6 bg-[#E60000] text-white rounded-2xl font-black text-lg uppercase italic tracking-tighter shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isSyncing ? 'SYNCING...' : 'SYNC LINK'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col md:flex-row overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        vStatus={verificationStatus}
      />

      <main className="flex-1 md:ml-72 flex flex-col h-screen relative">
        <header className="p-4 md:px-12 md:py-4 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white">
            <Menu size={20} />
          </button>
          
          <div className="flex bg-white/[0.03] border border-white/10 p-1 rounded-full shadow-inner">
             <button onClick={() => handleRoleSwitch(UserRole.OPERATOR)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase transition-all ${userRole === UserRole.OPERATOR ? 'bg-[#E60000] text-white' : 'text-white/20'}`}>
                <User size={12} /> <span className="hidden xs:inline">Pilot</span>
             </button>
             <button onClick={() => handleRoleSwitch(UserRole.AGENT)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase transition-all ${userRole === UserRole.AGENT ? 'bg-emerald-600 text-white' : 'text-white/20'}`}>
                <Globe size={12} /> <span className="hidden xs:inline">Agent</span>
             </button>
          </div>

          <div onClick={() => setActiveTab('earnings')} className="bg-white/5 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 cursor-pointer">
             <div className="w-5 h-5 bg-[#E60000] rounded-full flex items-center justify-center text-[10px] font-black italic shadow-lg">₦</div>
             <span className="tech-mono font-black text-xs md:text-sm">500</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>

        {/* MOBILE NAV */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40 flex justify-around items-center px-4">
          {[
            { id: 'dashboard', icon: Home, label: 'Gist' },
            { id: 'orders', icon: PackageSearch, label: 'Board' },
            { id: 'workspace', icon: MapPin, label: 'Waka' },
            { id: 'registration-center', icon: ShieldCheck, label: 'Papers' }
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-[#E60000]' : 'text-white/20'}`}>
              <item.icon size={22} />
              <span className="text-[8px] font-black uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        <AIAssistant />
      </main>
    </div>
  );
};

export default App;
