import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell, 
  Settings, 
  LogOut, 
  Zap,
  GraduationCap,
  ShieldAlert,
  BrainCircuit,
  Upload,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ currentView, setView, activePage, setActivePage }) => {
  const adminLinks = [
    { id: 'dashboard', label: 'Global Analytics', icon: LayoutDashboard },
    { id: 'heatmap', label: 'Risk Heatmap', icon: Zap },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const facultyLinks = [
    { id: 'upload', label: 'Analysis Lab', icon: Zap },
    { id: 'students', label: 'Student List', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'nlp', label: 'NLP Engine', icon: BrainCircuit },
  ];

  const studentLinks = [
    { id: 'submit', label: 'Submit Assignment', icon: Upload },
    { id: 'history', label: 'Course History', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  let links = facultyLinks;
  if (currentView === 'admin') links = adminLinks;
  if (currentView === 'student') links = studentLinks;

  return (
    <aside className="w-72 bg-[#F1F9F4]/60 backdrop-blur-xl border-r border-white/50 flex flex-col h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-neon-glow">
            <GraduationCap className="text-black" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none">LABIA</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] mt-1">Analytics System</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = activePage === link.id;
            return (
              <motion.button
                key={link.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActivePage(link.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                  ${isActive
                    ? 'bg-primary/10 text-text-primary border border-primary/20 shadow-neon-glow/30'
                    : 'text-text-secondary hover:bg-white/60 hover:text-text-primary border border-transparent'}`}
              >
                <link.icon
                  size={20}
                  className={isActive ? 'text-primary' : 'text-text-muted group-hover:text-primary transition-colors'}
                />
                <span className="font-medium">{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_6px_#7CFC00]" />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/30 space-y-4">
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">System Alerts</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            3 new writing drift patterns detected in Dept CSE.
          </p>
        </div>
        
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setView('landing');
          }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-text-secondary hover:text-status-high hover:bg-status-high/5 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
