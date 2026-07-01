import React from 'react';
import {
  AlertTriangle, AlertCircle, TrendingUp,
  Users, CheckCircle, Clock, Bot, Calendar,
  ArrowRight, ChevronRight, Activity, Zap, Eye
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockAgentLogs, teamStats, pipelineStages } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

// Priority Queue Item
const priorityItems = [
  {
    id: 'p1', priority: 'critical', icon: AlertTriangle, color: 'text-red-500',
    bg: 'bg-red-50', border: 'border-red-200',
    title: '张三绩效候选已被 Agent 改为 Outstanding',
    desc: 'Outstanding 比例将从 18% 升至 21%，超出建议区间。证据完整度 62%，待确认。',
    action: '查看并确认', person: '张三', link: '/people/e001'
  },
  {
    id: 'p2', priority: 'high', icon: AlertCircle, color: 'text-orange-500',
    bg: 'bg-orange-50', border: 'border-orange-200',
    title: '陈七 Underperform 评价缺少负向证据',
    desc: '低评价结果需要有充分的负向事实依据，当前证据不足以支撑。',
    action: '补充证据', person: '陈七', link: '/people/e005'
  },
  {
    id: 'p3', priority: 'high', icon: AlertCircle, color: 'text-orange-500',
    bg: 'bg-orange-50', border: 'border-orange-200',
    title: '赵六自评与上级评价差异 2 个档位',
    desc: '赵六自评 Good+，管理者评价 Good-。差异超过阈值，建议发起对齐讨论。',
    action: '发起对齐', person: '赵六', link: '/people/e004'
  },
  {
    id: 'p4', priority: 'medium', icon: Clock, color: 'text-yellow-500',
    bg: 'bg-yellow-50', border: 'border-yellow-200',
    title: '王五项目 B 贡献尚未纳入本期评价',
    desc: '王五在 B 项目中有关键贡献，但该项目尚未绑定到本期评价证据包。',
    action: '纳入评价', person: '王五', link: '/people/e003'
  },
  {
    id: 'p5', priority: 'medium', icon: TrendingUp, color: 'text-blue-500',
    bg: 'bg-blue-50', border: 'border-blue-200',
    title: '李四晋级材料完整度仅 75%',
    desc: '专业公共贡献不足，缺少跨团队影响力案例，需在截止日前补充。',
    action: '查看晋级', person: '李四', link: '/promotion'
  },
];

// Status pipeline stages（从 mockData 的派生统计 pipelineStages 取数）

const teamHealthMetrics = [
  { label: '评价覆盖率', value: Math.round((teamStats.rated / teamStats.total) * 100), unit: '%', color: 'bg-green-500' },
  { label: '证据完整度', value: teamStats.avgEvidence, unit: '%', color: 'bg-blue-500' },
  { label: '已确认结果', value: teamStats.confirmed, total: teamStats.total, unit: '人', color: 'bg-indigo-500' },
  { label: '待处理分歧', value: teamStats.needsAlignment, total: teamStats.total, unit: '项', color: 'bg-orange-500' },
];

const aiWatchList = [
  { name: '张三', signal: '高贡献可能被低估', type: 'undervalued', evidence: '3个高价值项目证据充分，排名第2但历史评价偏保守' },
  { name: '王五', signal: '证据不足影响置信', type: 'low_evidence', evidence: '评估证据完整度45%，建议补充B项目贡献' },
];

const upcomingDeadlines = [
  { event: '2026 H1 绩效正式确认截止', date: '2026-07-10', daysLeft: 11, urgent: true },
  { event: '晋级材料提交截止', date: '2026-07-05', daysLeft: 6, urgent: true },
  { event: '全面反馈问卷收集', date: '2026-07-15', daysLeft: 16, urgent: false },
];

export const RadarPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Evaluation Radar</h1>
            <p className="text-sm text-slate-500 mt-0.5">需要你判断的不是所有事项，而是影响评价质量和结果的关键事项</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="w-4 h-4" />
            <span>2026 H1 · 周期进行中</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </div>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '待处理优先项', value: priorityItems.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
            { label: '证据不足人员', value: teamStats.lowEvidence, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Agent 待确认操作', value: teamStats.agentPendingOps, icon: Bot, color: 'text-ai-500', bg: 'bg-ai-50' },
            { label: '已完成确认', value: teamStats.confirmed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card p-4 flex items-center gap-3">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                  <Icon className={clsx('w-5 h-5', stat.color)} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Priority Queue - Left 2/3 */}
          <div className="col-span-2 space-y-4">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-slate-700">优先判断队列</span>
                  <span className="badge badge-pending">{priorityItems.length}</span>
                </div>
                <span className="text-xs text-slate-400">按风险优先级排序</span>
              </div>
              <div className="divide-y divide-slate-50">
                {priorityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className={clsx('px-4 py-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer')}
                      onClick={() => navigate(item.link)}>
                      <div className="flex items-start gap-3">
                        <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', item.bg)}>
                          <Icon className={clsx('w-3.5 h-3.5', item.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-slate-800">{item.title}</span>
                            <span className="text-xs text-slate-400 flex-shrink-0">{item.person}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button className={clsx(
                            'text-xs px-2.5 py-1 rounded-lg font-medium transition-colors',
                            item.priority === 'critical' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                            item.priority === 'high' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                            'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          )}>
                            {item.action}
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result Pipeline */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">结果确认管道</span>
                <span className="text-xs text-slate-400 ml-1">{teamStats.total}人 · 本周期</span>
              </div>
              <div className="flex items-stretch gap-1">
                {pipelineStages.map((stage, idx) => {
                  return (
                    <React.Fragment key={stage.key}>
                      <div className="flex-1 text-center">
                        <div className={clsx(
                          'text-lg font-bold mb-1',
                          stage.count > 0 ? 'text-slate-800' : 'text-slate-300'
                        )}>{stage.count}</div>
                        <div className={clsx('text-xs px-2 py-1 rounded-lg border font-medium', stage.color)}>
                          {stage.label}
                        </div>
                      </div>
                      {idx < pipelineStages.length - 1 && (
                        <div className="flex items-center px-1">
                          <ArrowRight className="w-3 h-3 text-slate-300" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Agent Operation Log */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-ai-500" />
                  <span className="text-sm font-semibold text-slate-700">Agent 最近操作</span>
                </div>
                <button className="text-xs text-primary-600 hover:text-primary-700">查看全部</button>
              </div>
              <div className="divide-y divide-slate-50">
                {mockAgentLogs.map(log => (
                  <div key={log.id} className="px-4 py-3 flex items-center gap-3">
                    <div className={clsx(
                      'w-1.5 h-1.5 rounded-full flex-shrink-0',
                      log.confirmed ? 'bg-green-400' : log.reverted ? 'bg-slate-300' : 'bg-orange-400'
                    )}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-800">「{log.instruction}」</span>
                        <span className={clsx(
                          'badge border text-xs',
                          log.opLevel === 'L1' ? 'bg-green-50 text-green-700 border-green-200' :
                          log.opLevel === 'L2' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        )}>{log.opLevel}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {log.targetName} · {log.beforeValue} → {log.afterValue} · {new Date(log.timestamp).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                    {!log.confirmed && !log.reverted && (
                      <span className="badge badge-pending text-xs flex-shrink-0">待确认</span>
                    )}
                    {log.confirmed && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Team Health */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">团队评价健康度</span>
              </div>
              <div className="space-y-3">
                {teamHealthMetrics.map(metric => {
                  const pct = metric.unit === '%' ? metric.value : Math.round((metric.value / metric.total) * 100);
                  return (
                    <div key={metric.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">{metric.label}</span>
                        <span className="font-medium text-slate-800">
                          {metric.unit === '%' ? `${metric.value}%` : `${metric.value}/${metric.total}`}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={clsx('h-full rounded-full transition-all', metric.color)}
                          style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Watchlist */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 bg-ai-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold" style={{ fontSize: '8px' }}>AI</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">AI 观察清单</span>
              </div>
              <div className="space-y-3">
                {aiWatchList.map(item => (
                  <div key={item.name} className="bg-ai-50/60 border border-ai-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      <span className={clsx(
                        'text-xs px-1.5 py-0.5 rounded font-medium',
                        item.type === 'undervalued' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {item.type === 'undervalued' ? '可能被低估' : '证据不足'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.evidence}</p>
                    <button className="mt-2 flex items-center gap-1 text-xs text-ai-600 hover:text-ai-700 font-medium">
                      <Eye className="w-3 h-3" />查看档案
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">关键节点提醒</span>
              </div>
              <div className="space-y-2">
                {upcomingDeadlines.map(item => (
                  <div key={item.event} className={clsx(
                    'flex items-start gap-3 p-2.5 rounded-lg border',
                    item.urgent ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'
                  )}>
                    <div className={clsx(
                      'text-xs font-bold px-1.5 py-1 rounded text-center flex-shrink-0',
                      item.urgent ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    )}>
                      {item.daysLeft}天
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-700">{item.event}</div>
                      <div className="text-xs text-slate-400">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
