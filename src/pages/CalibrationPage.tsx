import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { AlertTriangle, AlertCircle, CheckCircle, TrendingDown, Users, GitCompare } from 'lucide-react';
import { clsx } from 'clsx';
import { mockTeamMembers, ratingDistribution, outstandingShare, contributionMatrix, matrixQuadrants, ratingLabels, getRatingScore } from '../data/mockData';

const quadrantConfig = [
  { key: 'consistent', label: '高贡献高评价', bg: 'bg-green-50', border: 'border-green-200', text: '一致', icon: CheckCircle, iconColor: 'text-green-500' },
  { key: 'undervalued', label: '高贡献低评价', bg: 'bg-blue-50', border: 'border-blue-200', text: '可能低估', icon: TrendingDown, iconColor: 'text-blue-500' },
  { key: 'needsReview', label: '低证据高评价', bg: 'bg-red-50', border: 'border-red-200', text: '需复核', icon: AlertTriangle, iconColor: 'text-red-500' },
  { key: 'needsConfirm', label: '低证据低评价', bg: 'bg-yellow-50', border: 'border-yellow-200', text: '需确认', icon: AlertCircle, iconColor: 'text-yellow-600' },
];

const scatterData = contributionMatrix.map(p => ({
  name: p.name,
  x: p.x,
  y: p.y,
  z: 100,
  highlight: p.highlight,
}));

const disagreementData = mockTeamMembers.map(m => ({
  name: m.employeeName,
  selfScore: m.performanceRating === 'outstanding' ? 90 : m.performanceRating === 'good_plus' ? 75 : m.performanceRating === 'good' ? 60 : m.performanceRating === 'good_minus' ? 45 : 30,
  managerScore: getRatingScore(m.performanceRating),
}));

export const CalibrationPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Calibration Workspace</h1>
          <p className="text-sm text-slate-400 mt-0.5">团队校准工作台 — 提升评价质量，不只是分名额</p>
        </div>

        {/* 1. Distribution View */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">评价分布</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ratingDistribution.filter(d => d.count > 0)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {ratingDistribution.map((entry, i) => (
                  <Cell key={i} fill={({ outstanding_plus: '#7c3aed', outstanding: '#4f46e5', good_plus: '#2563eb', good: '#16a34a', good_minus: '#0d9488', underperform: '#ea580c', underperform_minus: '#ef4444' } as any)[entry.rating] || '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className={clsx('mt-3 flex items-center gap-2 p-2 rounded-lg border', outstandingShare.pct > 20 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200')}>
            <AlertCircle className={clsx('w-3.5 h-3.5', outstandingShare.pct > 20 ? 'text-amber-600' : 'text-green-600')} />
            <p className={clsx('text-xs', outstandingShare.pct > 20 ? 'text-amber-700' : 'text-green-700')}>
              Outstanding 类 {outstandingShare.count} 人（{outstandingShare.pct}%）{outstandingShare.pct > 20 ? '，超出建议比例 20%' : '，在区间内'}
            </p>
          </div>
        </div>

        {/* 2. Contribution × Rating Matrix */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">贡献-评价一致性矩阵</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">横轴：证据强度 · 纵轴：评价量化分 · 点击查看详情</p>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" dataKey="x" name="证据强度" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis type="number" dataKey="y" name="评价分" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <ZAxis type="number" dataKey="z" range={[200, 200]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
                formatter={(val: any, name: any) => [val, name === 'x' ? '证据强度' : name === 'y' ? '评价分' : name]}
                labelFormatter={() => ''}
              />
              <Scatter data={scatterData}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={entry.highlight ? '#ef4444' : '#6366f1'} fillOpacity={entry.highlight ? 0.8 : 0.5} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {quadrantConfig.map(q => {
              const Icon = q.icon;
              const count = (matrixQuadrants as any)[q.key];
              return (
                <div key={q.key} className={clsx('flex items-center gap-2 p-2 rounded-lg border', q.bg, q.border)}>
                  <Icon className={clsx('w-3.5 h-3.5 flex-shrink-0', q.iconColor)} />
                  <div>
                    <div className="text-xs font-medium text-slate-700">{q.label}</div>
                    <div className="text-xs text-slate-500">{q.text} · {count}人</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Disagreement Heatmap */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">自评 vs 上级评价差异</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">红色标记 = 差异超过 2 个档位</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={disagreementData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="selfScore" name="自评" fill="#c084fc" radius={[3, 3, 0, 0]} />
              <Bar dataKey="managerScore" name="上级" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. Manager Bias Lens */}
        <div className="card p-4">
          <div className="text-sm font-semibold text-slate-700 mb-1">管理者口径偏移信号</div>
          <p className="text-xs text-slate-400 mb-4">非偏见判断，仅为评价口径偏移参考信号</p>
          <div className="space-y-3">
            {[
              { manager: '李明', distribution: '偏高', deviation: '+8%', flag: 'warning' },
              { manager: '张主管', distribution: '正常', deviation: '+2%', flag: 'ok' },
              { manager: '王主任', distribution: '偏低', deviation: '-6%', flag: 'warning' },
            ].map(m => (
              <div key={m.manager} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-700">{m.manager[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{m.manager}</div>
                  <div className="text-xs text-slate-500">{m.distribution} · 相对团队均值 {m.deviation}</div>
                </div>
                <span className={clsx('badge border text-xs', m.flag === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200')}>
                  {m.flag === 'ok' ? '正常' : '偏移信号'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Calibration Actions */}
        <div className="card p-4">
          <div className="text-sm font-semibold text-slate-700 mb-3">校准动作</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '查看个人证据', icon: CheckCircle, color: 'text-primary-600' },
              { label: '调整候选结果', icon: AlertCircle, color: 'text-orange-600' },
              { label: '标记校准原因', icon: AlertTriangle, color: 'text-yellow-600' },
              { label: '发起讨论', icon: Users, color: 'text-purple-600' },
              { label: '请求补充证据', icon: AlertCircle, color: 'text-blue-600' },
              { label: '批量确认', icon: CheckCircle, color: 'text-green-600' },
            ].map(action => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 transition-colors text-left">
                  <Icon className={clsx('w-3.5 h-3.5', action.color)} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
