
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
  ShieldCheck,
  Target
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
  
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRoleSyncing, setIsRoleSyncing] = useState(false);

  const [registrationLevels, setRegistrationLevels] = useState<RegistrationCategory[]>([
    RegistrationCategory.LOCAL,
    RegistrationCategory.INTERSTATE
  ]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.APPROVED);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(VehicleType.TRUCK);

  const [routeMode, setRouteMode] = useState<RouteMode>(RouteMode.ROAMING);
  const [destination, setDestination] = useState('');
  const [activeClusterMission, setActiveClusterMission] = useState<OrderCluster | null>(null);
  const [activeTrips, setActiveTrips] = useState<any[]>([]); // Tracks trips posted via Waybill
  
  const [neuralPing, setNeuralPing] = useState<IncomingJob | null>(null);

  const simiRef = useRef(new SimiAIService());

  // Background Scout for AreaGPT Neural Pings
  useEffect(() => {
    if (!isAudioInitialized) return;

    const scoutInterval = setInterval(async () => {
      // Small chance to find a high-yield lead while roaming
      if (routeMode === RouteMode.ROAMING && Math.random() > 0.7 && !neuralPing) {
        try {
          const leads = await simiRef.current.scoutAreaGPTLeads();
          if (leads.length > 0) {
            const bestLead = leads[0];
            const incoming: IncomingJob = {
              id: bestLead.id,
              vehicleType: selectedVehicle,
              origin: bestLead.pickup,
              destination: bestLead.destination,
              price: bestLead.price,
              serviceType: ServiceType.LOGISTICS,
              category: RegistrationCategory.LOCAL
            };
            setNeuralPing(incoming);
          }
        } catch (e) {}
      }
    }, 45000);

    return () => clearInterval(scoutInterval);
  }, [isAudioInitialized, routeMode, selectedVehicle, neuralPing]);

  const handleInitAudio = async () => {
    setIsSyncing(true);
    try {
      await ambientEngine.init();
      const ctx = getOutputContext();
      if (ctx.state === 'suspended') await ctx.resume();
      
      const audio = await simiRef.current.announceJob("Grid link set. Welcome back, Pilot Bakare. AreaGPT is now online and scouting for missions.");
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

  const handleLaunchTrip = (manifest: any) => {
    // Add the new manifest to the activeTrips array for broadcasting
    const newTrip = {
      ...manifest,
      id: `TRIP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      pilotName: 'Pilot Bakare',
      timestamp: new Date().toLocaleTimeString(),
      vehicleType: selectedVehicle
    };
    setActiveTrips(prev => [newTrip, ...prev]);
    setActiveTab('dashboard'); // Redirect to Gist to see the announcement
  };

  const handleAcceptPing = (job: IncomingJob) => {
    // Fix: Added vehicleRequired to meet the OrderCluster interface
    const cluster: OrderCluster = {
      id: `MISSION-${job.id}`,
      name: `AI SNIPE: ${job.origin} to ${job.destination}`,
      source: 'AreaGPT',
      count: 1,
      totalPrice: job.price,
      efficiency: 100,
      vehicleRequired: job.vehicleType,
      orders: [{ id: job.id, pickup: job.origin, dest: job.destination, price: job.price }]
    };
    handleEngageMission(cluster);
    setNeuralPing(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} activeMission={activeClusterMission} vStatus={verificationStatus} activeTrips={activeTrips} />;
      case 'workspace': return <Workspace activeVehicle={selectedVehicle} setVehicle={setSelectedVehicle} onNavigate={setActiveTab} userRole={userRole} routeMode={routeMode} setRouteMode={setRouteMode} destination={destination} setDestination={setDestination} regLevels={registrationLevels} setRegLevels={setRegistrationLevels} vStatus={verificationStatus} setVStatus={setVerificationStatus} />;
      case 'orders': return <OrderClusters onNavigate={setActiveTab} onEngageCluster={handleEngageMission} vehicle={selectedVehicle} walletLocked={false} />;
      case 'active-work': return activeClusterMission ? <OngoingWork mission={activeClusterMission} onComplete={() => { setActiveClusterMission(null); setActiveTab('dashboard'); }} onCancel={() => { setActiveClusterMission(null); setActiveTab('dashboard'); }} onNavigate={setActiveTab} routeMode={routeMode} /> : <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} vStatus={verificationStatus} />;
      case 'trips': return <TripPlanner onNavigate={setActiveTab} onLaunch={handleLaunchTrip} activeTiers={registrationLevels} currentVehicle={selectedVehicle} />;
      case 'fleet': return <MerchantPanel userRole={userRole} onNavigate={setActiveTab} />;
      case 'earnings': return <WalletPanel balance={500} onNavigate={setActiveTab} />;
      case 'community': return <Community onNavigate={setActiveTab} activeTrips={activeTrips} />;
      case 'registration-center': return <RegistrationCenter onNavigate={setActiveTab} onSuccess={(role, tiers) => { setUserRole(role); setRegistrationLevels(tiers); setVerificationStatus(VerificationStatus.APPROVED); setActiveTab('dashboard'); }} />;
      default: return <Dashboard userRole={userRole} onNavigate={setActiveTab} currentMode={routeMode} vStatus={verificationStatus} />;
    }
  };

  if (!isAudioInitialized) {
    return (
      <div className="fixed inset-0 bg-[#020202] flex flex-col items-center justify-center p-10 text-center z-[500]">
        <div className="relative">
          <div className="absolute inset-0 bg-[#E60000]/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-32 h-32 md:w-40 md:h-40 bg-[#0A0A0A] border-4 border-[#E60000]/30 rounded-[3rem] flex items-center justify-center text-[#E60000] mb-8 relative z-10 shadow-2xl">
            <Zap size={64} className="animate-pulse" />
          </div>
        </div>
        <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter mb-4">AreaLine Neural</h1>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mb-8 italic">Establish Link to AreaGPT & Grid</p>
        <button 
          onClick={handleInitAudio} 
          disabled={isSyncing}
          className="w-full max-w-xs py-6 bg-[#E60000] text-white rounded-2xl font-black text-lg uppercase italic tracking-tighter shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isSyncing ? 'SYNCING GRID...' : 'SYNC LINK'}
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
             <button onClick={() => handleRoleSwitch(UserRole.OPERATOR)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase transition-all ${userRole === UserRole.OPERATOR ? 'bg-[#E60000] text-white shadow-lg' : 'text-white/20'}`}>
                <User size={12} /> <span className="hidden xs:inline">Pilot</span>
             </button>
             <button onClick={() => handleRoleSwitch(UserRole.AGENT)} className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase transition-all ${userRole === UserRole.AGENT ? 'bg-emerald-600 text-white shadow-lg' : 'text-white/20'}`}>
                <Globe size={12} /> <span className="hidden xs:inline">Agent</span>
             </button>
          </div>

          <div onClick={() => setActiveTab('earnings')} className="bg-white/5 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-all">
             <div className="w-5 h-5 bg-[#E60000] rounded-full flex items-center justify-center text-[10px] font-black italic shadow-lg">₦</div>
             <span className="tech-mono font-black text-xs md:text-sm">500</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>

        {/* Neural Intercept Toast (Ping) */}
        {neuralPing && (
           <div className="fixed bottom-28 left-4 md:left-80 right-4 md:right-auto z-50 animate-in slide-in-from-left-10 duration-500">
              <div className="bg-[#0A0A0A] border-2 border-amber-500/40 rounded-[2rem] p-6 md:w-96 shadow-[0_0_50px_rgba(245,158,11,0.2)] relative overflow-hidden flex items-center gap-6">
                 <div className="absolute inset-0 bg-amber-500/5 animate-pulse" />
                 <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-xl shrink-0">
                    <Target size={28} />
                 </div>
                 <div className="flex-1 text-left">
                    <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">AreaGPT Snipe</p>
                    <h4 className="text-sm font-black text-white italic uppercase tracking-tight leading-none">₦{neuralPing.price.toLocaleString()}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase mt-1 truncate">{neuralPing.destination}</p>
                 </div>
                 <div className="flex flex-col gap-2">
                    <button onClick={() => setNeuralPing(null)} className="p-2 hover:bg-white/10 rounded-lg text-white/20"><RefreshCcw size={14} /></button>
                    <button onClick={() => handleAcceptPing(neuralPing)} className="p-3 bg-amber-500 text-black rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"><Zap size={20} /></button>
                 </div>
              </div>
           </div>
        )}

        <AIAssistant />
      </main>
    </div>
  );
};

export default App;
