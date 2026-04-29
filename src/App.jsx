import React, { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Sidebar from './components/Sidebar';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  const [view, setView] = useState(() => localStorage.getItem('app_view') || 'landing'); 
  const [activePage, setActivePage] = useState(() => localStorage.getItem('app_activePage') || 'dashboard');

  useEffect(() => {
    localStorage.setItem('app_view', view);
    localStorage.setItem('app_activePage', activePage);
  }, [view, activePage]);

  const handleSetView = (role) => {
    setView(role);
    // Reset to default page for each role
    if (role === 'admin') setActivePage('dashboard');
    if (role === 'faculty') setActivePage('upload');
    if (role === 'student') setActivePage('submit');
    if (role === 'landing') setActivePage('dashboard');
  };

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <Landing onLogin={(role) => handleSetView(role)} />;
      case 'admin':
        return <AdminDashboard activePage={activePage} setActivePage={setActivePage} />;
      case 'faculty':
        return <FacultyDashboard activePage={activePage} setActivePage={setActivePage} />;
      case 'student':
        return <StudentDashboard activePage={activePage} />;
      default:
        return <Landing onLogin={(role) => handleSetView(role)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main relative overflow-hidden font-sans selection:bg-primary selection:text-black">
      {/* Background Grid Overlay */}
      <div className="bg-grid-overlay"></div>

      {/* Main Layout Container */}
      <div className="relative z-10 flex min-h-screen">
        {view !== 'landing' && (
          <Sidebar
            currentView={view}
            setView={handleSetView}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        )}
        
        <main className={`flex-1 overflow-auto ${view === 'landing' ? '' : 'p-8'}`}>
          {renderView()}
        </main>
      </div>

      {/* Global AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

export default App;
