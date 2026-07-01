import React, { useState } from 'react';
import { Users, ChevronRight, Search, Filter, Bot, AlertCircle, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { mockTeamMembers, ratingLabels, statusLabels } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const PeopleListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filtered = mockTeamMembers.filter(m => m.employeeName.includes(search));

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">People Evaluation</h1>
            <p className="text-sm text-slate-400 mt-0.5">管理你的团队成员评估状态</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 w-48 text-xs"
                placeholder="搜索员工..."
              />
            </div>
            <button className="btn-secondary text-xs"><Filter className="w-3.5 h-3.5" />筛选</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '全部', count: mockTeamMembers.length, color: 'text-slate-700' },
            { label: 'Agent Updated', count: mockTeamMembers.filter(m => m.status === 'agent_updated').length, color: 'text-orange-600' },
            { label: '证据不足', count: mockTeamMembers.filter(m => m.status === 'needs_evidence').length, color: 'text-yellow-600' },
            { label: '已确认', count: mockTeamMembers.filter(m => m.status === 'manager_confirmed').length, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="card px-4 py-3 text-center">
              <div className={clsx('text-2xl font-bold', s.color)}>{s.count}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">团队成员评估状态</span>
          </div>
          <div className="divide-y divide-slate-50">
            {filtered.map(member => {
              const ratingInfo = ratingLabels[member.performanceRating || 'good'];
              const statusInfo = statusLabels[member.status] || statusLabels.draft;
              return (
                <div
                  key={member.employeeId}
                  className="px-4 py-3.5 flex items-center gap-4 hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/people/${member.employeeId}`)}
                >
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-indigo-700">{member.employeeName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{member.employeeName}</span>
                      {member.lastChangedBy === 'agent' && (
                        <Bot className="w-3 h-3 text-ai-500" title="Agent 已修改" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">排序 #{member.rankPosition} · 证据 {member.evidenceScore}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={clsx('badge border text-xs', ratingInfo?.color)}>{ratingInfo?.label || '-'}</span>
                    <span className={clsx('badge border text-xs', statusInfo.color)}>{statusInfo.label}</span>
                    {member.riskItems.filter(r => !r.resolved).length > 0 && (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
