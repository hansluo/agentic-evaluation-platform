import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';
import { AlertTriangle, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

const distributionData = [
  { name: 'Outstanding+', value: 1, color: '#7c3aed' },
  { name: 'Outstanding', value: 2, color: '#4f46e5' },
  { name: 'Good+', value: 1, color: '#2563eb' },
  { name: 'Good', value: 2, color: '#16a34a' },
  { name: 'Good-', value: 0, color: '#0d9488' },
  { name: 'Underperform', value: 1, color: '#ea580c' },
];

const matrixData = [
  { x: 85, y: 90, name: '张三', highlight: true },
  { x: 75, y: 70, name: '李四' },
  { x: 30, y: 60, name: '王五', highlight: true },
  { x: 60, y: 40, name: '赵六' },
  { x: 40, y: 20, name: '陈七' },
  { x: 80, y: 80, name: '孙八' },
];

const managerBiasData = [
  { manager: '李明', distribution: '偏高', deviation: '+8%', flag: 'warning' },
  { manager: '张主管', distribution: '正常', deviation: '+2%', flag: 'ok' },
  { manager: '王主任', distribution: '偏低', deviation: '-6%', flag: 'warning' },
];

const validationIssues = [
  { type: '高评价低证据', count: 1, person: '张三', detail: 'Outstanding 但证据完整度 62%', level: 'high' },
  { type: '低评价无负向证据', count: 1, person: '陈七', detail: 'Underperform 但负向证据不足', level: 'high' },
  { type: 'Agent 操作待确认', count: 1, person: '张三', detail: 'Agent 修改后未经管理者确认', level: 'medium' },
  { type: '自评与他评差异', count: 1, person: '赵六', detail: '差异超过 2 个档位', level: 'medium' },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Validation & Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">评估质量校验分析，识别异常和风险</p>
        </div>

        {/* Validation Issues */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-slate-700">校验问题汇总</span>
            <span className="badge badge-risk ml-1">{validationIssues.length}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {validationIssues.map((issue, idx) => (
              <div key={idx} className="px-4 py-3 flex items-center gap-4">
                <div className={clsx(
                  'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                  issue.level === 'high' ? 'bg-red-50' : 'bg-orange-50'
                )}>
                  <AlertCircle className={clsx('w-3.5 h-3.5', issue.level === 'high' ? 'text-red-500' : 'text-orange-500')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{issue.type}</span>
                    <span className="text-xs text-slate-400">· {issue.person}</span>
                  </div>
                  <p className="text-xs text-slate-500">{issue.detail}</p>
                </div>
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">处理</button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Distribution Chart */}
          <div className="card p-4">
            <div className="text-sm font-semibold text-slate-700 mb-4">绩效结果分布</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distributionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {distributionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">Outstanding 类档位共 3 人（50%），超出建议比例 20%</p>
            </div>
          </div>

          {/* Contribution-Rating Matrix */}
          <div className="card p-4">
            <div className="text-sm font-semibold text-slate-700 mb-1">贡献-评价一致性矩阵</div>
            <div className="text-xs text-slate-400 mb-3">横轴：贡献证据强度 · 纵轴：评价结果</div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: '高贡献高评价', bg: 'bg-green-50', border: 'border-green-200', text: '一致', icon: CheckCircle, iconColor: 'text-green-500', count: 3 },
                { label: '高贡献低评价', bg: 'bg-blue-50', border: 'border-blue-200', text: '可能低估', icon: TrendingDown, iconColor: 'text-blue-500', count: 0 },
                { label: '低证据高评价', bg: 'bg-red-50', border: 'border-red-200', text: '需复核', icon: AlertTriangle, iconColor: 'text-red-500', count: 1 },
                { label: '低证据低评价', bg: 'bg-yellow-50', border: 'border-yellow-200', text: '需确认', icon: AlertCircle, iconColor: 'text-yellow-600', count: 1 },
              ].map(q => {
                const Icon = q.icon;
                return (
                  <div key={q.label} className={clsx('flex items-center gap-2 p-2.5 rounded-lg border', q.bg, q.border)}>
                    <Icon className={clsx('w-4 h-4 flex-shrink-0', q.iconColor)} />
                    <div>
                      <div className="text-xs font-medium text-slate-700">{q.label}</div>
                      <div className="text-xs text-slate-500">{q.text} · {q.count}人</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Manager Bias */}
        <div className="card p-4">
          <div className="text-sm font-semibold text-slate-700 mb-1">管理者评价口径偏移信号</div>
          <div className="text-xs text-slate-400 mb-4">非偏见判断，仅为评价口径偏移参考信号，供校准使用</div>
          <div className="space-y-3">
            {managerBiasData.map(m => (
              <div key={m.manager} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-700">{m.manager[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{m.manager}</div>
                  <div className="text-xs text-slate-500">{m.distribution} · 相对团队均值 {m.deviation}</div>
                </div>
                <span className={clsx(
                  'badge border text-xs',
                  m.flag === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                )}>
                  {m.flag === 'ok' ? '正常' : '偏移信号'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
