
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import OrderClusters, { getVehicleIcon } from './components/OrderClusters';
import TripPlanner from './components/TripPlanner';
import MerchantPanel from './components/MerchantPanel';
import WalletPanel from './components/WalletPanel';
import AIAssistant from './components/AIAssistant';
import Community from './components/Community';
import UserProfileView from './components/UserProfileView';
import Workspace from './components/Workspace';
import RegistrationCenter from './components/RegistrationCenter';
import JobAlert from './components/JobAlert';
import SupportGrid from './components/SupportGrid';
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
  UserCircle 
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
  const [incomingJob, setIncomingJob] = useState<IncomingJob | null>(null);
  
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRoleSyncing, setIsRoleSyncing] = useState(false);

  const [registrationLevels, setRegistrationLevels] = useState<RegistrationCategory[]>([
    RegistrationCategory.LOCAL,
    RegistrationCategory.INTERSTATE,
    RegistrationCategory.INTERNATIONAL
  ]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.APPROVED);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.TRUCK);

  const [activeManifest, setActiveManifest] = useState<any | null>(null);
  const [routeMode, setRouteMode] = useState<RouteMode>(RouteMode.ROAMING);
  const [destination, setDestination] = useState('');
  const [activeClusterMission, setActiveClusterMission] = useState<OrderCluster | null>(null);

  const simiRef = useRef(new SimiAIService());

  const handleInitAudio = async () => {
    setIsSyncing(true);
    try {
      await ambientEngine.init();
      if (ambientEngine.ctx?.state === 'suspended') {
        await ambientEngine.ctx.resume();
      }
      setTimeout(() => {
        setIsAudioInitialized(true);
        setIsSyncing(false);
        triggerGlobalSimiNotice("Neural Handshake Complete. Welcome Pilot!");
      }, 2000);
    } catch (e) {
      console.error("Audio Init Error", e);
      setIsAudioInitialized(true);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAudioInitialized) {
      ambientEngine.updateMood(activeTab);
    }
  }, [activeTab, isAudioInitialized]);

  const triggerGlobalSimiNotice = async (text: string) => {
    const ctx = getOutputContext();
    if (ctx.state === 'suspended') {
      await ctx.resume().catch(console.error);
    }

    const audio = await simiRef.current.announceJob(text);
    if (audio) {
      if (ctx.state === 'suspended') await ctx.resume();
      const buffer = await decodeAudioData(decode(audio), ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    }
  };

  const simulateIncomingOrder = () => {
    setIncomingJob({
      id: 'JOB-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      vehicleType: selectedVehicle,
      origin: 'Ikeja Node Alpha',
      destination: destination || 'Victoria Island Terminal',
      price: routeMode === RouteMode.SPECIAL ? 45000 : 15500,
      category: RegistrationCategory.LOCAL,
      serviceType: ServiceType.HAILING,
      duration: '45 mins'
    });
  };

  const handleRoleSwitch = async (role: UserRole) => {
    if (isRoleSyncing) return;
    
    const ctx = getOutputContext();
    if (ctx.state === 'suspended') await ctx.resume().catch(console.error);

    setIsRoleSyncing(true);
    setUserRole(role);
    setActiveTab('dashboard');
    let text = role === UserRole.OPERATOR ? "Neural Link switched to Pilot mode." : "Authority Node synced.";
    await triggerGlobalSimiNotice(text);
    setTimeout(() => setIsRoleSyncing(false), 1200);
  };

  const handleRegistrationSuccess = (role: UserRole, tiers: RegistrationCategory[]) => {
    setUserRole(role);
    setRegistrationLevels(tiers);
    setVerificationStatus(VerificationStatus.PENDING);
    setActiveTab('dashboard');
    triggerGlobalSimiNotice("Verification nodes locked!");
  };

  const handleLaunchManifest = (data: any) => {
    setActiveManifest(data);
    setRouteMode(RouteMode.TRIP);
    setActiveTab('dashboard');
    triggerGlobalSimiNotice(`Manifest launched for ${data.destination}.`);
  };

  const handleEngageMission = useCallback((cluster: OrderCluster) => {
    setActiveClusterMission(cluster);
    setRouteMode(RouteMode.SPECIAL);
    setActiveTab('dashboard');
    triggerGlobalSimiNotice("Mission Engage!");
  }, []);

  const getModeColor = () => {
    switch (routeMode) {
      case RouteMode.TRIP: return 'bg-blue-600 shadow-[0_0_10px_#3b82f6]';
      case RouteMode.SPECIAL: return 'bg-amber-500 shadow-[0_0_10px_#f59e0b]';
      case RouteMode.GLOBAL: return 'bg-emerald-600 shadow-[0_0_10px_#10b981]';
      default: return 'bg-[#E60000] shadow-[0_0_10px_#E60000]';
    }
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <UserProfileView profile={{
        id: 'AL-PILOT-994', name: 'Tunde Bakare', avatar: 'https://picsum.photos/seed/driver7/200/200', role: userRole,
        rating: 4.9, joinedDate: 'Feb 2024', bio: 'Elite Operator at Lagos-South Node.', services: [ServiceType.LOGISTICS],
        stats: { totalTrips: 1242, completionRate: 98.5, reputation: 920 }, recentActivity: [],
        registrationLevels: registrationLevels, verificationStatus: verificationStatus, activeVehicle: selectedVehicle
      }} isOwnProfile={!viewedProfileId} onBack={() => { setViewedProfileId(null); setActiveTab('dashboard'); }} />;
    }
    switch (activeTab) {
      case 'dashboard': return <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} targetDestination={destination} activeManifest={activeManifest} onUpdateManifest={setActiveManifest} regLevels={registrationLevels} activeMission={activeClusterMission} onUpdateMission={setActiveClusterMission} />;
      case 'workspace': return <Workspace regLevels={registrationLevels} setRegLevels={setRegistrationLevels} vStatus={verificationStatus} setVStatus={setVerificationStatus} activeVehicle={selectedVehicle} setVehicle={setSelectedVehicle} onNavigate={setActiveTab} userRole={userRole} routeMode={routeMode} setRouteMode={setRouteMode} destination={destination} setDestination={setDestination} />;
      case 'registration-center': return <RegistrationCenter onNavigate={setActiveTab} onSuccess={handleRegistrationSuccess} />;
      case 'orders': return <OrderClusters isApproved={verificationStatus === VerificationStatus.APPROVED} onNavigate={setActiveTab} onEngageCluster={handleEngageMission} driverDestination={destination} />;
      case 'trips': return <TripPlanner onNavigate={setActiveTab} onLaunch={handleLaunchManifest} activeTiers={registrationLevels} />;
      case 'fleet': return <MerchantPanel userRole={userRole} onNavigate={setActiveTab} />;
      case 'earnings': return <WalletPanel onNavigate={setActiveTab} />;
      case 'community': return <Community onViewProfile={(id) => { setViewedProfileId(id); setActiveTab('profile'); }} onNavigate={setActiveTab} />;
      case 'support-grid': return <SupportGrid onNavigate={setActiveTab} />;
      default: return <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} regLevels={registrationLevels} />;
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: "Gist" },
    { id: 'orders', icon: PackageSearch, label: "Board" },
    { id: 'workspace', icon: MapPin, label: "Waka" },
    { id: 'earnings', icon: Wallet, label: "Money" },
    { id: 'profile', icon: UserCircle, label: "Pilot" },
  ];

  return (
    <div className="min-h-screen text-white bg-[#020202] selection:bg-[#E60000] flex flex-col">
      {incomingJob && <JobAlert job={incomingJob} onClose={() => setIncomingJob(null)} />}

      {!isAudioInitialized && (
        <div className="fixed inset-0 z-[500] bg-[#020202] flex items-center justify-center p-6 animate-in fade-in duration-500">
           <div className="max-w-md w-full space-y-10 text-center">
              <div className="relative inline-block cursor-pointer group" onClick={handleInitAudio}>
                <div className={`w-32 h-32 md:w-40 md:h-40 bg-[#E60000]/10 border-4 border-[#E60000]/30 rounded-[3rem] flex items-center justify-center text-[#E60000] shadow-2xl transition-all duration-700 ${isSyncing ? 'rotate-12' : ''}`}>
                   {isSyncing ? <RefreshCcw size={64} className="animate-spin" /> : <Zap size={64} className="animate-pulse" />}
                </div>
              </div>
              <div className="space-y-4">
                 <h1 className="text-4xl font-black italic display-font uppercase tracking-tighter text-white leading-none">AreaLine Neural</h1>
                 <p className="text-white/40 font-bold italic uppercase tracking-widest text-[10px]">Handshake Node Required</p>
              </div>
              <button onClick={handleInitAudio} disabled={isSyncing} className="w-full py-6 bg-[#E60000] text-white rounded-2xl font-black text-lg uppercase italic tracking-tighter shadow-2xl transition-all">
                {isSyncing ? 'SYNCING...' : 'SYNC LINK'}
              </button>
           </div>
        </div>
      )}

      {isRoleSyncing && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-3xl flex items-center justify-center">
           <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <div className={`w-32 h-32 md:w-48 md:h-48 mx-auto rounded-[2.5rem] border-4 flex items-center justify-center shadow-2xl transition-all duration-700 ${userRole === UserRole.OPERATOR ? 'bg-[#E60000]/10 border-[#E60000] text-[#E60000]' : 'bg-blue-600/10 border-blue-600 text-blue-600'}`}>
                 <RefreshCcw size={48} className="animate-spin" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase display-font tracking-tighter">{userRole} NODE</h2>
           </div>
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} setUserRole={handleRoleSwitch} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} onTestOrder={simulateIncomingOrder} />
      
      <main className="md:ml-72 flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* SLIM HUD HEADER */}
        <header className="sticky top-0 bg-[#020202]/40 backdrop-blur-3xl z-40 border-b border-white/5 px-4 md:px-12 py-2 md:py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 md:gap-6">
            <button className="md:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={16} />
            </button>
            <div className="flex bg-white/[0.03] border border-white/10 p-1 rounded-full shadow-inner">
               <button onClick={() => handleRoleSwitch(UserRole.OPERATOR)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[7px] font-black uppercase transition-all duration-300 ${userRole === UserRole.OPERATOR ? getModeColor() : 'text-white/20 hover:text-white/40'}`}>
                  <User size={12} /> <span className="hidden xs:inline">Pilot</span>
               </button>
               <button onClick={() => handleRoleSwitch(UserRole.AGENT)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[7px] font-black uppercase transition-all duration-300 ${userRole === UserRole.AGENT ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/20 hover:text-white/40'}`}>
                  <Globe size={12} /> <span className="hidden xs:inline">Agent</span>
               </button>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full">
               {getVehicleIcon(selectedVehicle, 14)}
               <p className="text-[7px] font-black uppercase hidden sm:block italic text-white/40">{selectedVehicle}</p>
            </div>
            <div onClick={() => setActiveTab('earnings')} className="flex items-center gap-2 px-2 py-1 bg-white/[0.03] border border-white/10 rounded-full cursor-pointer hover:bg-white/[0.06] transition-all">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg italic ${userRole === UserRole.OPERATOR ? getModeColor() : 'bg-emerald-600'}`}>₦</div>
              <p className="text-[8px] font-black text-white/60 tracking-widest hidden sm:block">SYNCED</p>
            </div>
          </div>
        </header>

        <div className="relative z-10 flex-1 w-full overflow-y-auto pb-24 scrollbar-hide">
          {renderContent()}
        </div>

        {/* BOTTOM NAVIGATION TABS */}
        <nav className="fixed bottom-0 left-0 md:left-72 right-0 h-20 bg-[#0A0A0A]/90 backdrop-blur-3xl border-t border-white/10 z-[45] flex items-center justify-around px-4 md:px-12">
           {navItems.map((item) => (
             <button 
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === item.id ? (routeMode === RouteMode.TRIP ? 'text-blue-500 scale-110' : routeMode === RouteMode.SPECIAL ? 'text-amber-500 scale-110' : 'text-[#E60000] scale-110') : 'text-white/20 hover:text-white/40'}`}
             >
               <item.icon size={activeTab === item.id ? 24 : 18} />
               <span className={`text-[8px] font-black uppercase tracking-widest italic ${activeTab === item.id ? 'opacity-100' : 'opacity-40'}`}>
                 {item.label}
               </span>
             </button>
           ))}
        </nav>

        <AIAssistant />
      </main>
    </div>
  );
};

export default App;
