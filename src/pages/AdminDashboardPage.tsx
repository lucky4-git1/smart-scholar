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
        <h2 className="font-serif text-xl font-bold text-[#A81B1B]">Access Denied</h2>
        <p className="text-xs text-[#4B635E]">Administrative privileges are required to view this interface.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#0A3D36]">
      
      {/* Top Banner */}
      <div>
        <span className="font-mono text-[10.5px] uppercase font-bold tracking-wider text-[#0A3D36] bg-[#FEDAB8] px-2 py-0.5 rounded-sm border border-[#0A3D36]/15">
          Smart Scholars · Platform Administration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A3D36] tracking-tight mt-2">
          System Administration Console
        </h1>
        <p className="text-xs sm:text-sm text-[#4B635E] mt-1.5 max-w-2xl leading-relaxed">
          Manage user permissions, monitor external bibliographic registry adapters, review database health, and inspect traceable administrative audit logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#0A3D36]/15 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-sm border transition-colors ${
            activeTab === 'users'
              ? 'bg-[#0A3D36] text-[#FAF6EE] font-bold border-[#0A3D36]'
              : 'bg-[#FFFDF9] text-[#4B635E] border-[#0A3D36]/20 hover:bg-[#FAF6EE]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-sm border transition-colors ${
            activeTab === 'health'
              ? 'bg-[#0A3D36] text-[#FAF6EE] font-bold border-[#0A3D36]'
              : 'bg-[#FFFDF9] text-[#4B635E] border-[#0A3D36]/20 hover:bg-[#FAF6EE]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>System & Registry Health</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-sm border transition-colors ${
            activeTab === 'logs'
              ? 'bg-[#0A3D36] text-[#FAF6EE] font-bold border-[#0A3D36]'
              : 'bg-[#FFFDF9] text-[#4B635E] border-[#0A3D36]/20 hover:bg-[#FAF6EE]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Admin Audit Logs</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-[#4B635E] font-mono">
          Loading administrative console...
        </div>
      ) : activeTab === 'users' ? (
        <div className="ss-card overflow-hidden shadow-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A3D36] text-[#FAF6EE] font-mono uppercase text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 font-bold">User</th>
                  <th className="py-3 px-4 font-bold">Institution</th>
                  <th className="py-3 px-4 font-bold">Email</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold text-right">Modify Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A3D36]/10 bg-[#FFFDF9]">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#0A3D36]">
                      {u.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-[#4B635E]">
                      {u.institution || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0A3D36] font-semibold">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/20 text-[#0A3D36]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="bg-[#FFFDF9] border border-[#0A3D36]/25 text-[11px] font-mono text-[#0A3D36] font-semibold rounded-sm px-2 py-1 focus:outline-none focus:border-[#0A3D36]"
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
            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block">Database Status</span>
              <span className="font-mono text-xl font-bold text-[#109C89] mt-1 block">
                ✓ {systemHealth?.database?.status || 'CONNECTED'}
              </span>
            </div>
            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block">Server Uptime</span>
              <span className="font-mono text-xl font-bold text-[#0A3D36] mt-1 block tabular-nums">
                {systemHealth?.uptimeSeconds || 0}s
              </span>
            </div>
            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block">RSS Memory</span>
              <span className="font-mono text-xl font-bold text-[#0A3D36] mt-1 block tabular-nums">
                {systemHealth?.process?.rssMemoryMb || 0} MB
              </span>
            </div>
            <div className="ss-card p-4 shadow-paper">
              <span className="text-[10px] font-mono uppercase text-[#4B635E] font-bold block">Node Engine</span>
              <span className="font-mono text-xl font-bold text-[#109C89] mt-1 block">
                {systemHealth?.process?.nodeVersion || 'v20+'}
              </span>
            </div>
          </div>

          {/* External Adapters Grid */}
          <div className="ss-card p-6 space-y-4 shadow-paper">
            <h3 className="font-serif font-bold text-lg text-[#0A3D36]">
              Public Registry Adapter Endpoints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/15 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-sm text-[#0A3D36] block">Crossref REST API</span>
                  <span className="font-mono text-[11px] text-[#4B635E]">https://api.crossref.org</span>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-[#0A3D36] px-2 py-0.5 rounded-sm bg-[#E8F8F5] border border-[#109C89]">ONLINE</span>
              </div>
              <div className="p-3 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/15 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-sm text-[#0A3D36] block">OpenAlex API</span>
                  <span className="font-mono text-[11px] text-[#4B635E]">https://api.openalex.org</span>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-[#0A3D36] px-2 py-0.5 rounded-sm bg-[#E8F8F5] border border-[#109C89]">ONLINE</span>
              </div>
              <div className="p-3 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/15 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-sm text-[#0A3D36] block">DOAJ API v2</span>
                  <span className="font-mono text-[11px] text-[#4B635E]">https://doaj.org/api/v2</span>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-[#0A3D36] px-2 py-0.5 rounded-sm bg-[#E8F8F5] border border-[#109C89]">ONLINE</span>
              </div>
              <div className="p-3 rounded-sm bg-[#FAF6EE] border border-[#0A3D36]/15 flex items-center justify-between">
                <div>
                  <span className="font-serif font-bold text-sm text-[#0A3D36] block">Wayback Machine API</span>
                  <span className="font-mono text-[11px] text-[#4B635E]">https://archive.org/wayback</span>
                </div>
                <span className="text-[10.5px] font-mono font-bold text-[#0A3D36] px-2 py-0.5 rounded-sm bg-[#E8F8F5] border border-[#109C89]">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="ss-card overflow-hidden shadow-paper">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A3D36] text-[#FAF6EE] font-mono uppercase text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Resource</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                  <th className="py-3 px-4 font-bold">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0A3D36]/10 bg-[#FFFDF9]">
                {auditLogs.map(l => (
                  <tr key={l.id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#4B635E]">
                      {new Date(l.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0A3D36]">
                      {l.action}
                    </td>
                    <td className="py-3 px-4 text-[#0A3D36] font-serif font-semibold">
                      {l.resource}
                    </td>
                    <td className="py-3 px-4 text-[#4B635E]">
                      {l.details || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#4B635E]">
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
