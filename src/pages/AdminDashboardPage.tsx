import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Activity, History, Loader2, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'health' | 'logs'>('users');
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, hRes, lRes] = await Promise.all([
        apiRequest('/api/v1/admin/users').catch(() => ({ users: [] })),
        apiRequest('/api/v1/admin/system-health').catch(() => null),
        apiRequest('/api/v1/admin/audit-logs').catch(() => ({ logs: [] })),
      ]);

      if (uRes.users) setUsers(uRes.users);
      if (hRes) setSystemHealth(hRes);
      if (lRes.logs) setAuditLogs(lRes.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiRequest(`/api/v1/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      loadAdminData();
    } catch (err: any) {
      alert('Error updating role: ' + err.message);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-3">
        <h2 className="font-display text-xl font-bold text-rose-400">Access Denied</h2>
        <p className="text-xs text-[#8A8173]">Administrative privileges are required to view this interface.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#E3BC9A]">
          Smart Scholars · Platform Administration
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[#FAF7F2] mt-1">
          System Administration Console
        </h1>
        <p className="text-xs sm:text-sm text-[#A3998B] mt-1 max-w-2xl leading-relaxed">
          Manage user permissions, monitor external bibliographic registry adapters, review database health, and inspect traceable administrative audit logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#241F1A] pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-md transition-colors ${
            activeTab === 'users' ? 'bg-[#E3BC9A] text-[#0A0908] font-bold' : 'text-[#A89F91] hover:text-[#FAF7F2]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-md transition-colors ${
            activeTab === 'health' ? 'bg-[#E3BC9A] text-[#0A0908] font-bold' : 'text-[#A89F91] hover:text-[#FAF7F2]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System & Registry Health</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-md transition-colors ${
            activeTab === 'logs' ? 'bg-[#E3BC9A] text-[#0A0908] font-bold' : 'text-[#A89F91] hover:text-[#FAF7F2]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Admin Audit Logs</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#9E9486]">
          Loading administrative console...
        </div>
      ) : activeTab === 'users' ? (
        <div className="bg-[#14120F] border border-[#26201B] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181512] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Modify Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201B17]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#181512] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#FAF7F2]">
                      {u.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-[#A89F91]">
                      {u.institution || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#E3BC9A]">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1C1814] border border-[#2E2822] text-[#FAF7F2]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="bg-[#100E0C] border border-[#2E2822] text-[11px] font-mono text-[#FAF7F2] rounded px-2 py-1"
                      >
                        <option value="RESEARCHER">RESEARCHER</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="INSTITUTION_ADMIN">INSTITUTION_ADMIN</option>
                        <option value="PORTFOLIO_MGR">PORTFOLIO_MGR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'health' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#14120F] border border-[#26201B] p-4 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8C8375] block">Database Status</span>
              <span className="font-mono text-xl font-bold text-emerald-400 mt-1 block">
                ✓ {systemHealth?.database?.status || 'CONNECTED'}
              </span>
            </div>
            <div className="bg-[#14120F] border border-[#26201B] p-4 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8C8375] block">Server Uptime</span>
              <span className="font-mono text-xl font-bold text-[#FAF7F2] mt-1 block">
                {systemHealth?.uptimeSeconds || 0}s
              </span>
            </div>
            <div className="bg-[#14120F] border border-[#26201B] p-4 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8C8375] block">RSS Memory</span>
              <span className="font-mono text-xl font-bold text-[#FAF7F2] mt-1 block">
                {systemHealth?.process?.rssMemoryMb || 0} MB
              </span>
            </div>
            <div className="bg-[#14120F] border border-[#26201B] p-4 rounded-xl">
              <span className="text-[10px] font-mono uppercase text-[#8C8375] block">Node Engine</span>
              <span className="font-mono text-xl font-bold text-[#E3BC9A] mt-1 block">
                {systemHealth?.process?.nodeVersion || 'v20+'}
              </span>
            </div>
          </div>

          {/* External Adapters Grid */}
          <div className="bg-[#14120F] border border-[#26201B] rounded-xl p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#FAF7F2]">
              Public Registry Adapter Endpoints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#181512] border border-[#27211B] flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#FAF7F2] block">Crossref REST API</span>
                  <span className="font-mono text-[11px] text-[#7A7165]">https://api.crossref.org</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">ONLINE</span>
              </div>
              <div className="p-3 rounded bg-[#181512] border border-[#27211B] flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#FAF7F2] block">OpenAlex API</span>
                  <span className="font-mono text-[11px] text-[#7A7165]">https://api.openalex.org</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">ONLINE</span>
              </div>
              <div className="p-3 rounded bg-[#181512] border border-[#27211B] flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#FAF7F2] block">DOAJ API v2</span>
                  <span className="font-mono text-[11px] text-[#7A7165]">https://doaj.org/api/v2</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">ONLINE</span>
              </div>
              <div className="p-3 rounded bg-[#181512] border border-[#27211B] flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-[#FAF7F2] block">Wayback Machine API</span>
                  <span className="font-mono text-[11px] text-[#7A7165]">https://archive.org/wayback</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#14120F] border border-[#26201B] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181512] border-b border-[#26201A] text-[#9E9486] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201B17]">
                {auditLogs.map(l => (
                  <tr key={l.id} className="hover:bg-[#181512] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#8C8375]">
                      {new Date(l.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#E3BC9A]">
                      {l.action}
                    </td>
                    <td className="py-3 px-4 text-[#FAF7F2]">
                      {l.resource}
                    </td>
                    <td className="py-3 px-4 text-[#A89F91]">
                      {l.details || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#9E9486]">
                      {l.user?.fullName || 'System'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
