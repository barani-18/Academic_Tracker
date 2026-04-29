import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'BIO', 'MATH', 'ARTS', 'LAW'];
const months = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];

const RiskHeatmap = ({ horizon = 'semester', intensity = 'drift' }) => {
  const displayedMonths = horizon === 'last4' ? months.slice(-4) : months;

  // Generate random risk data based on displayed months
  const data = Array.from({ length: departments.length * displayedMonths.length }, (_, i) => {
    const isHighIntensity = (intensity === 'ai' && Math.random() > 0.8) || (intensity === 'drift' && Math.random() > 0.7);
    return {
      id: i,
      risk: isHighIntensity ? 'high' : Math.random() > 0.5 ? 'medium' : 'safe',
      dept: departments[Math.floor(i / displayedMonths.length)],
      week: displayedMonths[i % displayedMonths.length],
      student: `Student ${Math.floor(Math.random() * 1000)}`,
      drift: intensity === 'syntax' ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 100)
    };
  });

  const getColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-status-high';
      case 'medium': return 'bg-status-medium';
      default: return 'bg-status-safe';
    }
  };

  return (
    <div className="glass-card p-8 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold">Linguistic Drift Heatmap</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <div className="w-3 h-3 rounded-full bg-status-safe"></div> Safe
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <div className="w-3 h-3 rounded-full bg-status-medium"></div> Medium
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <div className="w-3 h-3 rounded-full bg-status-high"></div> High Risk
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Y-Axis Labels (Depts) */}
        <div className="absolute -left-12 top-10 bottom-0 flex flex-col justify-between py-2">
          {departments.map(dept => (
            <span key={dept} className="text-[10px] font-bold text-text-muted">{dept}</span>
          ))}
        </div>

        {/* X-Axis Labels (Weeks) */}
        <div className="flex justify-between pl-4 mb-4">
          {displayedMonths.map(month => (
            <span key={month} className="text-[10px] font-bold text-text-muted w-8 text-center">{month}</span>
          ))}
        </div>

        {/* Grid of Pills */}
        <div className={`grid gap-3 pl-4 ${horizon === 'last4' ? 'grid-cols-4' : 'grid-cols-12'}`}>
          {data.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.005 }}
              className="relative group"
            >
              <div 
                className={`h-8 w-8 rounded-lg ${getColor(item.risk)} opacity-30 group-hover:opacity-100 transition-all cursor-pointer shadow-sm`}
              ></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block z-50">
                <div className="bg-[#1A1A1A] text-white p-3 rounded-xl shadow-xl text-xs border border-white/10">
                  <p className="font-bold mb-1">{item.student}</p>
                  <p className="text-white/60 mb-2">Dept: {item.dept} | {item.week}</p>
                  <div className="flex items-center justify-between">
                    <span>Style Drift</span>
                    <span className="font-mono text-primary">{item.drift}%</span>
                  </div>
                  {/* Mini Sparkline Simulation */}
                  <div className="flex items-end gap-0.5 h-6 mt-2">
                    {[4,7,3,8,5,9,6].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/40 rounded-t-[1px]" style={{height: `${h*10}%`}}></div>
                    ))}
                  </div>
                </div>
                <div className="w-2 h-2 bg-[#1A1A1A] rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
