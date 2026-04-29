import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Search, Shield, GraduationCap } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [viewRole, setViewRole] = useState('faculty');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', loginId: '', dept: '', role: 'Faculty' });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:5000/api/admin/users?role=${viewRole}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [viewRole]);

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newUser.name || !newUser.loginId) return;
    setUsers(prev => [...prev, { ...newUser, id: Date.now(), status: 'Active' }]);
    setNewUser({ name: '', loginId: '', dept: '', role: 'Faculty' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Directory</h2>
          <p className="text-text-secondary mt-1">Manage institutional access for faculty and students.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-white/40 p-1 rounded-xl border border-white/50 shadow-inner">
            <button 
              onClick={() => setViewRole('faculty')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewRole === 'faculty' ? 'bg-primary text-black shadow-neon-glow' : 'text-text-muted hover:text-text-primary'}`}
            >
              Faculty
            </button>
            <button 
              onClick={() => setViewRole('student')}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${viewRole === 'student' ? 'bg-primary text-black shadow-neon-glow' : 'text-text-muted hover:text-text-primary'}`}
            >
              Students
            </button>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-3d px-6 py-3 flex items-center gap-2">
            <UserPlus size={18} />
            Add Account
          </button>
        </div>
      </header>

      {/* Add User Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 border-l-4 border-primary"
        >
          <h3 className="text-lg font-bold mb-6">New Faculty Account</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Full Name</label>
              <input
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Dr. John Doe"
                className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Login ID</label>
              <input
                value={newUser.loginId}
                onChange={e => setNewUser({ ...newUser, loginId: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                placeholder="FA1099"
                className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Department</label>
              <input
                value={newUser.dept}
                onChange={e => setNewUser({ ...newUser, dept: e.target.value })}
                placeholder="Computer Science"
                className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2 block">Role</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full bg-white/50 border border-white/50 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>Faculty</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={handleAdd} className="btn-3d px-8 py-3">Create Account</button>
            <button onClick={() => setShowAddForm(false)} className="px-8 py-3 rounded-xl border border-white/50 hover:bg-white/50 transition-all font-semibold text-text-secondary">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Search + Table */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">All Faculty ({filtered.length})</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="bg-white/50 border border-white/50 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 w-64"
            />
          </div>
        </div>

        <div className="space-y-3">
          {/* Header Row */}
          <div className="grid grid-cols-7 text-[10px] font-bold uppercase tracking-wider text-text-muted px-4">
            <span className="col-span-2">User Details</span>
            <span>Department</span>
            {viewRole === 'student' ? (
              <>
                <span>Submissions</span>
                <span>Avg Risk</span>
              </>
            ) : (
              <span>Courses</span>
            )}
            <span>Status</span>
            <span>Action</span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center animate-pulse text-text-muted font-medium">Querying live database...</div>
          ) : filtered.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="grid grid-cols-7 items-center p-4 bg-white/40 border border-white/50 rounded-xl hover:bg-white/60 transition-colors"
            >
              <div className="col-span-2 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${viewRole === 'student' ? 'bg-primary text-black' : 'bg-primary/20 text-primary'}`}>
                  {user.full_name.charAt(0)}
                </div>
                <div className="min-w-0">
                   <p className="font-bold text-sm truncate">{user.full_name}</p>
                   <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                </div>
              </div>
              <span className="text-sm text-text-secondary truncate">{user.department || 'General'}</span>
              
              {viewRole === 'student' ? (
                <>
                  <span className="text-sm font-bold text-text-primary">{user.total_submissions || 0}</span>
                  <span className={`text-sm font-bold ${user.avg_risk > 70 ? 'text-status-high' : user.avg_risk > 40 ? 'text-status-medium' : 'text-status-safe'}`}>
                    {user.avg_risk}%
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-text-primary">{user.course_count || 0}</span>
              )}

              <span className={`inline-flex items-center gap-1.5 text-xs font-bold`}>
                 <div className={`w-1.5 h-1.5 rounded-full ${idx % 3 === 0 ? 'bg-status-safe' : 'bg-text-muted'}`} />
                 {idx % 3 === 0 ? 'Active' : 'Offline'}
              </span>
              <button
                onClick={() => handleDelete(user.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-status-high/60 hover:text-status-high hover:bg-status-high/10 px-3 py-1.5 rounded-lg transition-all w-fit"
              >
                <Trash2 size={13} />
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
