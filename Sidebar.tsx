
import React from 'react';
import { 
  Home, 
  Wallet, 
  Users, 
  MapPin,
  X,
  PackageSearch,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { UserRole, VerificationStatus } from './types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  vStatus?: VerificationStatus;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen,
  onClose,
  vStatus
}) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: "Simi's Gist" },
    { id: 'orders', icon: PackageSearch, label: 'Job Board' },
    { id: 'workspace', icon: MapPin, label: "My Movement" },
    { id: 'trips', icon: Truck, label: 'Trips & Waybill' },
    { id: 'earnings', icon: Wallet, label: 'My Money' },
    { id: 'community', icon: Users, label: "Community" },
    { id: 'registration-center', icon: ShieldCheck, label: 'Admin Papers' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[45] md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-72 bg-[#020202] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-8 flex flex-col h-full text-left">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 bg-[#E60000] rounded-2xl flex items-center justify-center font-black text-white text-3xl italic shadow-[0_0_20px_rgba(230,0,0,0.5)] shrink-0">A</div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">AreaLine</h1>
              <span className="text-[10px] font-bold text-[#E60000] uppercase mt-1 tracking-[0.4em]">Area Manager</span>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto scrollbar-hide pr-2">
            {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
                >
                  <item.icon size={22} className={activeTab === item.id ? 'text-[#E60000]' : ''} />
                  <span className={`text-[11px] font-black uppercase tracking-[0.15em]`}>{item.label}</span>
                </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
