import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Briefcase, MessageSquare, Wallet, Users, BarChart3, 
  Gavel, ShieldCheck, AlertOctagon, Settings, Bell, Sun, Moon, 
  LogOut, Menu, X, Search, ChevronRight, Compass, ShieldAlert,
  Sliders, PlusCircle, ArrowUpRight
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export const Navigation: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    role, setRole, activeTab, setActiveTab, isDarkMode, setIsDarkMode,
    notifications, markNotificationsRead, setAuthStep, logoutUser, user: dbUser
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (role === 'client') {
      const path = location.pathname;
      if (path === '/client/dashboard') setActiveTab('dashboard');
      else if (path.startsWith('/client/projects')) setActiveTab('projects');
      else if (path.startsWith('/client/bids')) setActiveTab('bids');
      else if (path.startsWith('/client/messages')) setActiveTab('messages');
      else if (path.startsWith('/client/wallet') || path.startsWith('/client/payments')) setActiveTab('wallet');
      else if (path.startsWith('/client/talent-pool')) setActiveTab('profile');
      else if (path.startsWith('/client/analytics')) setActiveTab('analytics');
    }
  }, [location.pathname, role]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Configure items based on the active role
  const getSidebarItems = (): SidebarItem[] => {
    switch (role) {
      case 'client':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'projects', label: 'My Projects', icon: Briefcase },
          { id: 'bids', label: 'Bid Management', icon: Gavel },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'wallet', label: 'Wallet', icon: Wallet },
          { id: 'profile', label: 'Talent Pool', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'freelancer':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'marketplace', label: 'Browse Projects', icon: Compass },
          { id: 'bids', label: 'Active Bids', icon: Gavel },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'wallet', label: 'Wallet', icon: Wallet },
          { id: 'profile', label: 'My Profile', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
          { id: 'oversight', label: 'System Oversight', icon: Compass },
          { id: 'verification', label: 'Verification', icon: ShieldCheck },
          { id: 'flagged', label: 'Project Approvals', icon: ShieldAlert },
          { id: 'disputes', label: 'Disputes', icon: AlertOctagon },
          { id: 'wallet', label: 'Escrow Control', icon: Wallet },
          { id: 'settings', label: 'Global Settings', icon: Sliders },
        ];
      default:
        return [];
    }
  };

  const getUserDetails = () => {
    if (dbUser) {
      return {
        name: dbUser.name,
        title: dbUser.title || (dbUser.role === 'CLIENT' ? 'Enterprise Client' : dbUser.role === 'ADMIN' ? 'System Administrator' : 'Freelancer Expert'),
        avatar: dbUser.avatar || (dbUser.role === 'CLIENT' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150')
      };
    }
    switch (role) {
      case 'client':
        return {
          name: 'Sarah Chen',
          title: 'Enterprise Client',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        };
      case 'freelancer':
        return {
          name: 'Alex Rivera',
          title: 'Senior Full-Stack Architect',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        };
      case 'admin':
        return {
          name: 'Marcus Thorne',
          title: 'System Administrator',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
        };
      default:
        return { name: 'Guest', title: 'Viewer', avatar: '' };
    }
  };

  const sidebarItems = getSidebarItems();
  const user = getUserDetails();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logoutUser();
  };

  // If public role, we render the public layout instead
  if (role === 'public') {
    return <div className="min-h-screen bg-slate-50 dark:bg-black">{children}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black font-sans">
      {/* SIDEBAR */}
      <aside 
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0f172a] text-slate-400 transition-all duration-300 md:static border-r border-slate-800
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#2563EB] font-bold text-white shadow-md">
              IX
            </div>
            {isSidebarOpen && (
              <span className="text-md font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Innovexa Catalyst
              </span>
            )}
          </div>
          <button 
            id="toggle-sidebar-mobile"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-1 hover:bg-slate-800 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Banner inside Sidebar Footer/Header */}
        {isSidebarOpen && (
          <div className="p-4 mx-3 my-4 bg-slate-800/40 rounded-2xl border border-slate-850/80">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-11 w-11 rounded-xl object-cover ring-2 ring-[#FF7A00]"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold truncate text-white">{user.name}</h4>
                <p className="text-[10px] text-orange-500 font-semibold uppercase">{user.title === 'Senior Full-Stack Architect' ? 'Top Rated' : user.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Nav Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`sidebar-item-${item.id}`}
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (role === 'client') {
                    if (item.id === 'dashboard') navigate('/client/dashboard');
                    else if (item.id === 'projects') navigate('/client/projects');
                    else if (item.id === 'bids') navigate('/client/bids');
                    else if (item.id === 'messages') navigate('/client/messages');
                    else if (item.id === 'wallet') navigate('/client/wallet');
                    else if (item.id === 'profile') navigate('/client/talent-pool');
                    else if (item.id === 'analytics') navigate('/client/analytics');
                  }
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group duration-200
                  ${isActive 
                    ? 'bg-slate-800 text-white shadow-sm border-l-2 border-[#FF7A00]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="flex w-full items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span>Exit Dashboard</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* NAVBAR */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 z-20">
          <div className="flex items-center gap-4">
            <button
              id="sidebar-toggle-desktop"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="hover:text-[#FF7A00] cursor-pointer capitalize">{role} Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-slate-200 font-semibold capitalize">
                {activeTab === 'dashboard' ? 'Overview' : activeTab}
              </span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex relative max-w-md w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              id="global-search-input"
              type="text" 
              placeholder="Search projects, talent..." 
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none text-slate-900 dark:text-slate-100 transition-all"
            />
          </div>

          {/* Nav Right Utilities */}
          <div className="flex items-center gap-4">
            {/* Quick action button for Client/Freelancer */}
            {role === 'client' && (
              <button
                id="post-project-quick-btn"
                onClick={() => setActiveTab('projects')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-90 text-white text-xs font-semibold shadow-md transition-opacity"
              >
                <PlusCircle className="w-4 h-4" />
                Post Project
              </button>
            )}
            {role === 'freelancer' && (
              <button
                id="browse-projects-quick-btn"
                onClick={() => setActiveTab('marketplace')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#2563EB] hover:opacity-90 text-white text-xs font-semibold shadow-md transition-opacity"
              >
                Browse Projects
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              id="dark-mode-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5 text-orange-400" /> : <Moon className="w-4.5 h-4.5 text-blue-600" />}
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="notif-popover-btn"
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setIsProfileOpen(false);
                  markNotificationsRead();
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {isNotifOpen && (
                <div 
                  id="notifications-popover"
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-semibold text-slate-950 dark:text-white text-sm">Notifications</span>
                    <button 
                      onClick={() => setIsNotifOpen(false)}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-850 flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-slate-200' : 'bg-orange-500'}`} />
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">{notif.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notif.description}</p>
                            <span className="text-[10px] text-slate-400 mt-1.5 block">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="profile-dropdown-btn"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotifOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-8.5 w-8.5 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-850"
                />
              </button>

              {isProfileOpen && (
                <div 
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.title}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-left"
                    >
                      Exit Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE / CONTENT STAGE */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};
