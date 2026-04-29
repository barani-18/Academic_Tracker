import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BrainCircuit, Activity, ChevronRight, Lock, User, Key, Zap, Fingerprint, Database } from 'lucide-react';

const Landing = ({ onLogin }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginId, password })
      });
      const data = await response.json();
      
      setIsLoading(false);
      
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user.role);
      } else {
        setError(data.msg || 'Invalid email or password');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Unable to connect to server');
    }
  };

  const scrollToLogin = () => {
    document.getElementById('login-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col relative z-10">
      
      {/* NAVBAR */}
      <nav className="w-full px-8 py-6 flex justify-between items-center bg-white/40 backdrop-blur-md sticky top-0 z-50 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-neon-glow">
            <BrainCircuit className="text-black" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight leading-none text-black">LABIA</h1>
            <p className="text-[10px] text-primary uppercase tracking-[0.2em] mt-1 font-bold">Analytics System</p>
          </div>
        </div>
        <button onClick={scrollToLogin} className="btn-3d px-6 py-2 text-sm">
          Portal Login
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Glow Effects (Subtle for light theme) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} className="animate-pulse" />
            Next-Gen <span className="text-black ml-1">Academic Integrity</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-black mb-6 tracking-tight leading-[1.1]">
            Detect The <span className="text-primary">Unseen</span> <br/>
            <span className="text-primary glow-text">With AI Forensics.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            LABIA uses advanced <span className="text-primary font-bold underline decoration-primary/30 underline-offset-4">Natural Language Processing</span> (spaCy & NLTK) to analyze lexical diversity, track <span className="text-primary font-bold underline decoration-primary/30 underline-offset-4">longitudinal writing drift</span>, and prevent academic misconduct before it happens.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={scrollToLogin} className="group relative px-8 py-4 bg-primary text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(124,252,0,0.3)]">
              <span className="relative z-10 flex items-center gap-2">
                Access Secure Portal <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION (Moderate Dark Contrast) */}
      <section className="w-full py-24 px-8 bg-black/5 border-y border-black/5 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-4 tracking-tight">Powered by Neural Analytics</h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium">Built from the ground up to protect institutional reputation through deterministic tracking and real-time behavioral insights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Fingerprint,
                title: "Stylistic Fingerprinting",
                desc: "We establish a unique baseline for every student using POS diversity and syntax variation over time."
              },
              {
                icon: Database,
                title: "Live MySQL Cloud",
                desc: "All queries run against a highly-available Aiven MySQL cluster for instant cross-departmental analytics."
              },
              {
                icon: Activity,
                title: "Longitudinal Drift",
                desc: "Our radar charts instantly highlight drastic anomalies when a student's submission radically deviates from their history."
              }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 group hover:-translate-y-2 transition-transform duration-300 rounded-2xl bg-white shadow-xl border border-black/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feat.icon size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feat.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LOGIN SECTION (Moderate Dark) */}
      <section id="login-section" className="w-full py-32 px-4 flex items-center justify-center relative bg-black/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-14 w-full max-w-[480px] relative z-10 border border-white/40 rounded-3xl bg-white/80 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.1)]"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl shadow-neon-glow flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Lock className="text-black" size={32} />
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-center text-black mb-2 tracking-tight">System Login</h2>
          <p className="text-center text-gray-600 mb-8 text-sm px-4">
            Authorized access only. Your session is monitored and encrypted via secure SSL tunnel to our <span className="text-primary font-bold">MySQL Cloud Nodes</span>.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">System Identifier (Email)</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70" />
                <input
                  type="email"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-xl py-3 pl-12 pr-4 text-black focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Access Key</label>
              <div className="relative">
                <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/70" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-xl py-3 pl-12 pr-4 text-black focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-status-high/10 border border-status-high/20 text-status-high text-sm font-bold text-center">
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-3d py-4 text-sm mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Initiate Secure Session <ChevronRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-black/5 flex justify-center items-center gap-6 opacity-60">
            <div className="flex items-center gap-2 grayscale brightness-0">
               <Shield size={14} className="text-black" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-black">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 grayscale brightness-0">
               <Lock size={14} className="text-black" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-black">RBAC Protected</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 text-center text-gray-400 text-xs border-t border-black/5 bg-white">
        <p>&copy; 2026 Longitudinal Academic Behavior & Integrity Analytics (LABIA). All rights reserved.</p>
        <p className="mt-1">Powered by React, Node, Flask, and Aiven MySQL.</p>
      </footer>

    </div>
  );
};

export default Landing;