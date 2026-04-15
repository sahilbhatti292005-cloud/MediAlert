
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  LogOut, 
  Pill,
  Bell
} from 'lucide-react';
import { StorageService } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Add Medicine', icon: PlusCircle, path: '/add' },
    { label: 'History', icon: History, path: '/history' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Pill size={24} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediAlert</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                isActive ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-20 md:pb-0">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 md:hidden">
            <Pill className="text-blue-600" size={24} />
            <h1 className="text-lg font-bold text-slate-800">MediAlert</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-800">
              {navItems.find(i => i.path === location.pathname)?.label || 'MediAlert'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
