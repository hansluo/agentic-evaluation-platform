import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Filter, Clock, Briefcase, Target, MessageSquare,
  User, TrendingUp, FileText, CheckCircle, AlertCircle,
  Bot, Shield, Plus, RotateCcw, ChevronDown, ChevronRight,
  Star, Zap, AlertTriangle, ExternalLink
} from 'lucide-react';
import { clsx } from 'clsx';
import {
  mockTeamMembers, mockEvents, mockEvidenceItems,
  ratingLabels, statusLabels
} from '../data/mockData';
import { RiskCard, AIInsightCard, AlignmentCard, FinalJudgmentCard, EvidenceCard } from '../components/Cards';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar as RadarPlot, ResponsiveContainer } from 'recharts';

const eventTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  project_start: { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', label: '项目' },
  project_complete: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: '项目完成' },
  milestone: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '里程碑' },
  okr_change: { icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', label: 'OKR 变更' },
  task_complete: { icon: CheckCircle, color: 'text-teal-600', bg: 'bg-teal-50', label: '任务完成' },
  self_input: { icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50', label: '自评输入' },
  peer_feedback: { icon: MessageSquare, color: 'text-pink-600', bg: 'bg-pink-50', label: '协作反馈' },
  manager_review: { icon: Shield, color: 'text-slate-600', bg: 'bg-slate-100', label: '上级评价' },
  promotion_event: { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', label: '晋级事件' },
  management_event: { icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50', label: '管理事件' },
  offcycle_review: { icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50', label: 'Offcycle' },
};

const evidenceRadarData = [
  { subject: '目标证据', score: 85, fullMark: 100 },
  { subject: '项目证据', score: 90, fullMark: 100 },
  { subject: '业务结果', score: 75, fullMark: 100 },
  { subject: '协作反馈', score: 50, fullMark: 100 },
  { subject: '上级评价', score: 80, fullMark: 100 },
  { subject: '历史趋势', score: 70, fullMark: 100 },
  { subject: '复盘材料', score: 40, fullMark: 100 },
];

const ratings = ['outstanding_plus', 'outstanding', 'good_plus', 'good', 'good_minus', 'underperform', 'underperform_minus'];

export const PeoplePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const employee = mockTeamMembers.find(m => m.employeeId === (id || 'e001')) || mockTeamMembers[0];
  const [selectedRating, setSelectedRating] = useState(employee.performanceRating || 'good');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRiskCard, setShowRiskCard] = useState(employee.status === 'agent_updated');
  const [expandedEvent, setExpandedEvent] = useState<string | null>('ev1');
  const [activeTab, setActiveTab] = useState<'summary' | 'evidence' | 'alignment'>('summary');

  const statusInfo = statusLabels[employee.status] || statusLabels.draft;
  const ratingInfo = ratingLabels[selectedRating];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/people')} className="btn-ghost text-xs">
            <ChevronLeft className="w-3.5 h-3.5" />返回
          </button>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-700">{employee.employeeName[0]}</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800">{employee.employeeName}</div>
              <div className="text-xs text-slate-400">T10 · 产品技术部</div>
            </div>
          </div>
          <span className={clsx('badge border ml-2', statusInfo.color)}>{statusInfo.label}</span>
          {employee.lastChangedBy === 'agent' && (
            <span className="badge badge-ai">
              <Bot className="w-3 h-3" />Agent Updated
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs">
            <Plus className="w-3 h-3" />请求补充证据
          </button>
          <button className="btn-secondary text-xs">
            <MessageSquare className="w-3 h-3" />发起对齐
          </button>
          <button onClick={() => setShowConfirmModal(true)} className="btn-primary text-xs">
            <Shield className="w-3 h-3" />提交确认
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Event Timeline */}
        <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50/50 overflow-y-auto scrollbar-none">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="section-title">事件时间线</span>
              <button className="btn-ghost text-xs py-1 px-2">
                <Filter className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-2">
              {mockEvents.map(event => {
                const cfg = eventTypeConfig[event.type] || eventTypeConfig.management_event;
                const Icon = cfg.icon;
                const isExpanded = expandedEvent === event.id;

                return (
                  <div
                    key={event.id}
                    className={clsx(
                      'bg-white rounded-lg border cursor-pointer transition-all duration-200',
                      isExpanded ? 'border-secondary-fixed shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    )}
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  >
                    <div className="flex items-start gap-2 p-2.5">
                      <div className={clsx('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', cfg.bg)}>
                        <Icon className={clsx('w-3 h-3', cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium text-slate-800 truncate">{event.title}</span>
                          {event.isIncludedInCycle && (
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" title="已纳入周期"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-slate-400">{event.date}</span>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs text-slate-400">{event.evidenceCount} 证据</span>
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-2.5 pb-2.5 border-t border-slate-100 pt-2">
                        <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                        {event.aiImportance === 'high' && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <Zap className="w-3 h-3 text-ai-500" />
                            <span className="text-xs text-ai-600">AI 标记：高重要度</span>
                          </div>
                        )}
                        {!event.isIncludedInCycle && (
                          <button className="mt-2 w-full py-1 text-xs text-space-gray border border-secondary-fixed rounded-md hover:bg-secondary-fixed transition-colors">
                            纳入周期评价
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center: AI Brief */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Risk Card (if agent updated) */}
            {showRiskCard && employee.riskItems.length > 0 && (
              <RiskCard
                operationDesc={`已将 ${employee.employeeName} 绩效候选结果从 Good+ 调整为 Outstanding。`}
                risks={employee.riskItems}
                onDismiss={() => setShowRiskCard(false)}
                onAction={(action) => console.log('Action:', action)}
                onRevert={() => { setSelectedRating('good_plus'); setShowRiskCard(false); }}
              />
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { key: 'summary', label: 'AI 评估简报' },
                { key: 'evidence', label: '证据库' },
                { key: 'alignment', label: '分歧与对齐' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={clsx(
                    'flex-1 py-1.5 text-xs font-medium rounded-md transition-all',
                    activeTab === tab.key
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >{tab.label}</button>
              ))}
            </div>

            {/* Tab: AI Summary */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                {/* Overview */}
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-ai-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">本期概览</span>
                    <span className="badge badge-ai ml-auto">AI 生成 · 待确认</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    本期 {employee.employeeName} 主导完成 AI 推荐系统 V2.0 重构，核心业务指标 CTR 提升 23%，用户增长 OKR 达成 120%。
                    在多个高影响项目中承担核心技术决策角色，体现出较强的专业判断力和 ownership。
                    协作反馈整体积极，但跨团队主动性有提升空间。
                  </p>
                </div>

                {/* Key Contributions */}
                <div className="card p-4">
                  <div className="text-sm font-semibold text-slate-700 mb-3">核心贡献</div>
                  <div className="space-y-3">
                    {[
                      { title: 'AI 推荐系统 V2.0 主导', evidence: 'Strong', impact: 'CTR +23%，DAU +8%', evidenceRef: '项目结项报告' },
                      { title: 'Q2 用户增长 OKR 达成 120%', evidence: 'Strong', impact: '核心贡献者，指标超预期完成', evidenceRef: 'Q2 业务指标报告' },
                      { title: '3 份高质量技术方案设计', evidence: 'Medium', impact: '被引用至团队知识库', evidenceRef: '文档系统记录' },
                    ].map((c, idx) => (
                      <div key={idx} className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
                        <div className="w-5 h-5 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-green-600">{idx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-800">{c.title}</span>
                            <span className={clsx('badge border text-xs', c.evidence === 'Strong' ? 'evidence-strong' : 'evidence-medium')}>
                              {c.evidence}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{c.impact}</div>
                          <button className="flex items-center gap-1 mt-1 text-xs text-space-gray hover:text-space-gray">
                            <ExternalLink className="w-3 h-3" />{c.evidenceRef}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capability Signals */}
                <div className="card p-4">
                  <div className="text-sm font-semibold text-slate-700 mb-3">能力信号</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '业务/用户结果', level: 'high', signal: '指标提升清晰，影响范围明确' },
                      { label: '专业深度', level: 'high', signal: '方案质量高，技术判断成熟' },
                      { label: 'Ownership', level: 'high', signal: '主动承担核心问题，有结果意识' },
                      { label: '跨团队协作', level: 'medium', signal: '反馈整体积极，主动性有提升空间' },
                      { label: 'AI 杠杆', level: 'medium', signal: '已使用 AI 工具改进开发流程' },
                      { label: '组织贡献', level: 'low', signal: '沉淀较少，知识传播有限' },
                    ].map(s => (
                      <div key={s.label} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                        <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                          s.level === 'high' ? 'bg-green-500' :
                          s.level === 'medium' ? 'bg-yellow-500' : 'bg-slate-400'
                        )}></div>
                        <div>
                          <div className="text-xs font-medium text-slate-700">{s.label}</div>
                          <div className="text-xs text-slate-500">{s.signal}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Radar */}
                <div className="card p-4">
                  <div className="text-sm font-semibold text-slate-700 mb-1">证据完整度</div>
                  <div className="text-xs text-slate-400 mb-3">总体: <span className="text-orange-600 font-medium">62%</span> · 缺少协作反馈和复盘材料</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={evidenceRadarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                      <RadarPlot name="证据强度" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="flex items-start gap-2 mt-2 p-2.5 bg-yellow-50 rounded-lg border border-yellow-200">
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-700">协作反馈和复盘材料不足，影响评价置信度。建议补充 2 份协作反馈。</p>
                  </div>
                </div>

                {/* AI Suggested Judgment */}
                <AIInsightCard
                  title="AI 候选判断"
                  conclusion="本期表现更接近 Outstanding 区间，证据充分度支持该判断"
                  basis="3个强证据项目 + 业务指标超预期 + 积极协作反馈，综合评估高于 Good+ 标准"
                  uncertainty="协作反馈证据较弱，跨团队主动性有待验证"
                  suggestedAction="请管理者确认是否采纳，并关注 Outstanding 比例合规性"
                  confidence={72}
                />
              </div>
            )}

            {/* Tab: Evidence */}
            {activeTab === 'evidence' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">共 {mockEvidenceItems.length} 条证据</span>
                  <button className="btn-secondary text-xs"><Plus className="w-3 h-3" />添加证据</button>
                </div>
                {mockEvidenceItems.map(ev => (
                  <EvidenceCard key={ev.id} title={ev.title} type={ev.type} sourceSystem={ev.sourceSystem}
                    strength={ev.strength} summary={ev.summary} createdAt={ev.createdAt} />
                ))}
              </div>
            )}

            {/* Tab: Alignment */}
            {activeTab === 'alignment' && (
              <div className="space-y-4">
                {employee.status === 'needs_alignment' || employee.employeeId === 'e004' ? (
                  <AlignmentCard
                    title="绩效结果判断"
                    type="等级判断分歧"
                    selfView="认为本期贡献达到 Good+ 标准，AI 相关工作影响较大"
                    managerView="整体表现 Good-，核心项目推进慢，协作主动性不足"
                    projectView="在 B 项目中表现积极，但未独立承担核心决策"
                    aiSummary="自评与上级评价差距超 2 个档位，建议重点聚焦：B 项目中的具体角色和贡献归因，以及 AI 相关工作的可量化业务影响。"
                    onInitiateAlignment={() => console.log('initiate alignment')}
                  />
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <CheckCircle className="w-10 h-10 mx-auto mb-3 text-green-300" />
                    <p className="text-sm">暂无需要处理的分歧</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Judgment Panel */}
        <div className="w-72 flex-shrink-0 border-l border-slate-200 overflow-y-auto scrollbar-none">
          <div className="p-4 space-y-4">
            {/* Rating Selector */}
            <div>
              <div className="section-title mb-2">绩效候选结果</div>
              <div className="space-y-1.5">
                {ratings.map(r => {
                  const info = ratingLabels[r];
                  const isSelected = selectedRating === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedRating(r)}
                      className={clsx(
                        'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all',
                        isSelected
                          ? `${info.color} border-current shadow-sm`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      )}
                    >
                      <div className={clsx(
                        'w-2 h-2 rounded-full flex-shrink-0',
                        isSelected ? 'bg-current' : 'bg-slate-300'
                      )}></div>
                      {info?.label || r}
                      {r === employee.performanceRating && r !== selectedRating && (
                        <span className="ml-auto text-xs text-slate-400">Agent</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-3">
              {/* Other Results */}
              <div>
                <div className="section-title mb-2">其他候选结果</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-slate-500">梯队</span>
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">第 {employee.talentTier} 档</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-slate-500">九宫格</span>
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      ({employee.nineBoxX}, {employee.nineBoxY})
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-xs text-slate-500">排序位置</span>
                    <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      第 {employee.rankPosition} / 32
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="section-title mb-2">快捷操作</div>
                <div className="space-y-1.5">
                  {[
                    { icon: TrendingUp, label: '加入晋级候选', color: 'text-green-600' },
                    { icon: Bot, label: '请 Agent 生成评语', color: 'text-ai-600' },
                    { icon: AlertCircle, label: '标记需要对齐', color: 'text-orange-600' },
                    { icon: RotateCcw, label: '撤销 Agent 操作', color: 'text-red-500' },
                  ].map(action => {
                    const Icon = action.icon;
                    return (
                      <button key={action.label} className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs text-slate-600 transition-colors text-left">
                        <Icon className={clsx('w-3.5 h-3.5', action.color)} />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => setShowConfirmModal(true)}
                className="w-full py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4" />
                提交正式确认
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Final Judgment Modal */}
      {showConfirmModal && (
        <FinalJudgmentCard
          employeeName={employee.employeeName}
          currentRating={ratingLabels[selectedRating]?.label || selectedRating}
          onConfirm={(data) => {
            console.log('Confirmed:', data);
            setShowConfirmModal(false);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};
