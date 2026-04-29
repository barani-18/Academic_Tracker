import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Bell, Shield, Sliders, Save, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings = () => {
  const [riskThreshold, setRiskThreshold] = useState(65);
  const [driftThreshold, setDriftThreshold] = useState(30);
  const [aiThreshold, setAiThreshold] = useState(40);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoFlag, setAutoFlag] = useState(true);
  const [liveMonitoring, setLiveMonitoring] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 800);
  };

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} className="transition-all">
      {value
        ? <ToggleRight size={32} className="text-primary" />
        : <ToggleLeft size={32} className="text-text-muted" />}
    </button>
  );

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-text-secondary mt-1">Configure risk thresholds, alerts, and monitoring behaviour.</p>
      </header>

      {/* Risk Thresholds */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <Sliders className="text-primary" size={22} />
          <h3 className="text-xl font-bold">Risk Detection Thresholds</h3>
        </div>

        <div className="space-y-8">
          {[
            { label: 'Integrity Risk Score Threshold', value: riskThreshold, set: setRiskThreshold, color: '#EF4444', desc: 'Flag submissions below this integrity score.' },
            { label: 'Writing Drift % Threshold', value: driftThreshold, set: setDriftThreshold, color: '#FACC15', desc: 'Trigger alert when drift exceeds this percentage.' },
            { label: 'AI Probability Threshold', value: aiThreshold, set: setAiThreshold, color: '#7CFC00', desc: 'Flag submissions above this AI-generated probability.' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-bold">{item.label}</label>
                  <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                </div>
                <span className="text-2xl font-bold tabular-nums" style={{ color: item.color }}>{item.value}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={item.value}
                onChange={e => item.set(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${item.color} 0%, ${item.color} ${item.value}%, #e5e7eb ${item.value}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification & Feature Toggles */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="text-primary" size={22} />
          <h3 className="text-xl font-bold">Notifications & Features</h3>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Email Alerts', desc: 'Send email notifications for high-risk submissions.', value: emailAlerts, set: setEmailAlerts },
            { label: 'Auto-Flag Submissions', desc: 'Automatically flag entries that exceed thresholds.', value: autoFlag, set: setAutoFlag },
            { label: 'Live Session Monitoring', desc: 'Track active faculty login sessions in real time.', value: liveMonitoring, set: setLiveMonitoring },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/40 border border-white/50 rounded-xl">
              <div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
              </div>
              <Toggle value={item.value} onChange={item.set} />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="btn-3d px-10 py-4 flex items-center gap-3"
        >
          <Save size={18} />
          {saved ? 'Saved ✓' : 'Save Settings'}
        </motion.button>
        {saved && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-status-safe font-bold"
          >
            Settings saved successfully!
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Settings;
