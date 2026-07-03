import React from 'react';
import { RefreshCw, CheckCircle, Clock, AlertTriangle, FileText, Shield } from 'lucide-react';
import { clsx } from 'clsx';
import { mockTeamMembers, teamStats, pipelineStages, mockCycles } from '../data/mockData';

export const CyclePage: React.FC = () => {
  const cycle = mockCycles[0];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Cycle Confirmation</h1>
            <p className="text-sm text-slate-400 mt-0.5">严肃周期确认工作台 — H1/H2 周期汇总确认</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="badge badge-confirmed">{cycle.cycle_type} 周期</span>
            <span className="text-slate-400">{cycle.status}</span>
          </div>
        </div>

        {/* Cycle Info */}
        <div className="card p-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-400">周期类型</div>
              <div className="font-medium text-slate-700 mt-0.5">{cycle.cycle_type}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">治理强度</div>
              <div className="font-medium text-red-600 mt-0.5">{cycle.governance_level} (严肃)</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">切片日期</div>
              <div className="font-medium text-slate-700 mt-0.5">{cycle.slice_date}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">时间范围</div>
              <div className="font-medium text-slate-700 mt-0.5">{cycle.start_date} ~ {cycle.end_date}</div>
            </div>
          </div>
        </div>

        {/* Governance Status */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-red-500" />
            <span className="text-sm font-semibold text-slate-700">治理能力加载状态</span>
            <span className="badge badge-risk ml-1">严肃周期 · 强治理</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'L 链确认', enabled: true },
              { label: '名额比例', enabled: true },
              { label: '档位规则', enabled: true },
              { label: '梯队高敏权限', enabled: true },
              { label: '职级规则', enabled: true },
              { label: '九宫格规则', enabled: true },
              { label: '审批流', enabled: true },
              { label: '校验分析', enabled: true },
              { label: '申诉机制', enabled: true },
              { label: '审计留痕', enabled: true },
              { label: '正式结果发布', enabled: true },
              { label: 'Agent 操作', enabled: true },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5 p-2 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">结果确认管道</span>
            <span className="text-xs text-slate-400 ml-1">{teamStats.total}人 · 本周期</span>
          </div>
          <div className="flex items-stretch gap-1">
            {pipelineStages.map((stage, idx) => (
              <React.Fragment key={stage.key}>
                <div className="flex-1 text-center">
                  <div className={clsx('text-lg font-bold mb-1', stage.count > 0 ? 'text-slate-800' : 'text-slate-300')}>{stage.count}</div>
                  <div className={clsx('text-xs px-2 py-1 rounded-lg border font-medium', stage.color)}>{stage.label}</div>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <div className="flex items-center px-1">
                    <span className="text-slate-300 text-xs">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Member List */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-700">成员确认状态</span>
          </div>
          <div className="divide-y divide-slate-50">
            {mockTeamMembers.map(member => (
              <div key={member.employeeId} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-700">{member.employeeName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800">{member.employeeName}</div>
                  <div className="text-xs text-slate-400">{member.level} · 证据 {member.evidenceScore}%</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {member.riskItems.filter(r => !r.resolved).length > 0 && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                  {member.status === 'manager_confirmed' ? (
                    <span className="badge badge-confirmed text-xs"><CheckCircle className="w-3 h-3" />已确认</span>
                  ) : member.status === 'agent_updated' ? (
                    <span className="badge badge-pending text-xs"><Clock className="w-3 h-3" />待确认</span>
                  ) : (
                    <span className="badge badge-draft text-xs">{member.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
