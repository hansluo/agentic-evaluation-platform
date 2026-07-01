import { User, EvalEvent, EvidenceItem, EvaluationCandidate, AgentOpLog, RankingPool, PromotionEvent, PerformanceRating } from '../types';

export const mockCurrentUser: User = {
  id: 'u001',
  name: '李明',
  engName: 'liming',
  chnName: '李明',
  deptName: '产品技术部',
  position: '技术总监',
  level: 'T11',
  role: 'manager',
};

export const mockTeamMembers: EvaluationCandidate[] = [
  {
    employeeId: 'e001', employeeName: '张三', level: 'T10', deptName: '产品技术部',
    performanceRating: 'outstanding',
    previousRating: 'good_plus', talentTier: '2', nineBoxX: 3, nineBoxY: 3,
    rankPosition: 2, status: 'agent_updated', lastChangedBy: 'agent',
    lastChangedAt: '2026-06-25T10:30:00Z', evidenceScore: 62,
    riskItems: [
      { id: 'r1', level: 'high', title: 'Outstanding 比例超出建议区间', description: '当前部门 Outstanding 比例将从 18% 提升到 21%，超过建议区间 20%', suggestedActions: ['查看相邻人员对比', '调整其他人员结果', '请求间接上级确认'], resolved: false },
      { id: 'r2', level: 'medium', title: '证据完整度偏低', description: '张三本期证据完整度为 62%，缺少项目负责人确认', suggestedActions: ['请求项目负责人补充确认', '补充业务指标证据'], resolved: false },
    ]
  },
  {
    employeeId: 'e002', employeeName: '李四', level: 'T9', deptName: '产品技术部',
    performanceRating: 'good_plus',
    previousRating: 'good', talentTier: '3', nineBoxX: 2, nineBoxY: 3,
    rankPosition: 5, status: 'manager_reviewed', lastChangedBy: 'human',
    lastChangedAt: '2026-06-24T14:20:00Z', evidenceScore: 88, riskItems: []
  },
  {
    employeeId: 'e003', employeeName: '王五', level: 'T8', deptName: '产品技术部',
    performanceRating: 'good',
    previousRating: 'good', talentTier: '4', nineBoxX: 2, nineBoxY: 2,
    rankPosition: 8, status: 'needs_evidence', lastChangedBy: 'system',
    lastChangedAt: '2026-06-23T09:00:00Z', evidenceScore: 45,
    riskItems: [
      { id: 'r3', level: 'medium', title: '项目贡献未纳入评价', description: 'B 项目的关键贡献尚未纳入本期评价证据', suggestedActions: ['绑定 B 项目证据', '补充项目负责人反馈'], resolved: false }
    ]
  },
  {
    employeeId: 'e004', employeeName: '赵六', level: 'T8', deptName: '产品技术部',
    performanceRating: 'good_minus',
    previousRating: 'good', talentTier: '5', nineBoxX: 2, nineBoxY: 1,
    rankPosition: 15, status: 'needs_alignment', lastChangedBy: 'agent',
    lastChangedAt: '2026-06-24T16:45:00Z', evidenceScore: 71,
    riskItems: [
      { id: 'r4', level: 'medium', title: '自评与他评差异较大', description: '员工自评为 Good+，上级评价为 Good-，差异超过 2 个档位', suggestedActions: ['发起对齐讨论', '查看自评详情'], resolved: false }
    ]
  },
  {
    employeeId: 'e005', employeeName: '陈七', level: 'T9', deptName: '产品技术部',
    performanceRating: 'underperform',
    previousRating: 'good_minus', talentTier: '7', nineBoxX: 1, nineBoxY: 1,
    rankPosition: 28, status: 'manager_reviewed', lastChangedBy: 'human',
    lastChangedAt: '2026-06-22T11:30:00Z', evidenceScore: 55,
    riskItems: [
      { id: 'r5', level: 'high', title: '低评价缺少负向证据', description: 'Underperform 评价但负向证据不足，建议补充绩效问题记录', suggestedActions: ['补充负向证据', '查看历史趋势'], resolved: false }
    ]
  },
  {
    employeeId: 'e006', employeeName: '孙八', level: 'T8', deptName: '产品技术部',
    performanceRating: 'good',
    previousRating: 'good', talentTier: '4', nineBoxX: 2, nineBoxY: 2,
    rankPosition: 10, status: 'manager_confirmed', lastChangedBy: 'human',
    lastChangedAt: '2026-06-21T13:00:00Z', evidenceScore: 92, riskItems: []
  },
];

export const mockEvents: EvalEvent[] = [
  { id: 'ev1', type: 'project_complete', title: 'AI 推荐系统 V2.0 上线', description: '主导 AI 推荐引擎重构，CTR 提升 23%，DAU 增长 8%', date: '2026-06-10', relatedProject: 'AI推荐系统', evidenceCount: 7, isIncludedInCycle: true, aiImportance: 'high', status: 'included' },
  { id: 'ev2', type: 'milestone', title: '用户增长 OKR 达成 120%', description: 'Q2 用户增长 OKR 最终完成 120%，核心贡献者之一', date: '2026-06-05', relatedGoal: 'Q2用户增长', evidenceCount: 4, isIncludedInCycle: true, aiImportance: 'high', status: 'included' },
  { id: 'ev3', type: 'okr_change', title: 'OKR 调整：新增商业化指标', description: '因业务战略调整，OKR 新增 GMV 目标，承接新职责', date: '2026-04-15', evidenceCount: 2, isIncludedInCycle: false, aiImportance: 'medium', status: 'summarized' },
  { id: 'ev4', type: 'peer_feedback', title: '跨团队协作反馈收集完成', description: '共收到 5 份协作反馈，整体评价积极', date: '2026-05-28', evidenceCount: 5, isIncludedInCycle: false, aiImportance: 'medium', status: 'needs_confirm' },
  { id: 'ev5', type: 'self_input', title: '员工自评内容已提交', description: '已提交本期关键成果、项目贡献和成长反思', date: '2026-06-18', evidenceCount: 3, isIncludedInCycle: true, aiImportance: 'medium', status: 'included' },
  { id: 'ev6', type: 'management_event', title: '技术方案评审通过', description: '主持完成 3 次重要技术方案评审，均高质量通过', date: '2026-05-15', evidenceCount: 3, isIncludedInCycle: false, aiImportance: 'low', status: 'pending' },
];

export const mockEvidenceItems: EvidenceItem[] = [
  { id: 'ei1', title: 'AI 推荐系统 V2.0 项目结项报告', type: 'project_doc', sourceSystem: '项目管理系统', strength: 'strong', summary: '详述 CTR 提升 23%、DAU 增长 8% 的技术实现路径，代码质量评分 A+', createdAt: '2026-06-10', permissionTag: 'public' },
  { id: 'ei2', title: 'Q2 业务指标达成报告', type: 'business_metric', sourceSystem: '数据平台', strength: 'strong', summary: '用户增长 OKR 完成 120%，环比提升核心数据清晰', createdAt: '2026-06-05', permissionTag: 'public' },
  { id: 'ei3', title: '项目负责人王总评价', type: 'feedback', sourceSystem: '评估系统', strength: 'medium', summary: '对技术判断力和 ownership 给出正向评价，指出跨团队协作可以更主动', createdAt: '2026-06-12', permissionTag: 'restricted' },
  { id: 'ei4', title: '技术方案设计文档 x3', type: 'design', sourceSystem: '文档系统', strength: 'medium', summary: '3 份高质量方案文档，逻辑清晰，已被引用至团队知识库', createdAt: '2026-05-20', permissionTag: 'public' },
  { id: 'ei5', title: '核心模块代码提交记录', type: 'code', sourceSystem: '代码仓库', strength: 'strong', summary: '本期主导 12 个核心模块，code review 通过率 96%', createdAt: '2026-06-08', permissionTag: 'public' },
  { id: 'ei6', title: '同级协作反馈（5份）', type: 'feedback', sourceSystem: '评估系统', strength: 'weak', summary: '5 份协作反馈整体积极，但部分反馈缺乏具体事件描述', createdAt: '2026-05-28', permissionTag: 'restricted' },
];

export const mockAgentLogs: AgentOpLog[] = [
  {
    id: 'al1', timestamp: '2026-06-25T10:30:00Z',
    instruction: '把张三改成 Outstanding', operationType: '修改绩效候选结果',
    targetName: '张三', beforeValue: 'Good+', afterValue: 'Outstanding',
    opLevel: 'L2', confirmationRequired: true, confirmed: false, reverted: false,
    riskItems: [
      { id: 'r1', level: 'high', title: 'Outstanding 比例超出建议区间', description: '当前部门比例将从 18% 提升到 21%', suggestedActions: ['查看相邻人员', '调整其他人员'], resolved: false },
      { id: 'r2', level: 'medium', title: '证据完整度偏低', description: '62% 完整度，缺少项目负责人确认', suggestedActions: ['请求补充确认'], resolved: false },
    ]
  },
  {
    id: 'al2', timestamp: '2026-06-24T15:20:00Z',
    instruction: '把王五的项目 B 贡献纳入本期评价', operationType: '绑定事件证据',
    targetName: '王五', beforeValue: '未绑定', afterValue: 'B项目里程碑贡献',
    opLevel: 'L1', confirmationRequired: false, confirmed: true, reverted: false,
    riskItems: []
  },
  {
    id: 'al3', timestamp: '2026-06-23T11:00:00Z',
    instruction: '生成张三的本期综合摘要', operationType: '生成评估摘要',
    targetName: '张三', beforeValue: '空', afterValue: 'AI 生成摘要已完成',
    opLevel: 'L1', confirmationRequired: false, confirmed: true, reverted: false,
    riskItems: []
  },
];

export const mockRankingPools: RankingPool[] = [
  {
    id: 'rp1', name: '产品技术部 H1 综合排序', scope: '产品技术部 · 32人',
    memberCount: 32, status: 'in_progress', createdAt: '2026-06-20',
    dimensions: [
      { name: '项目贡献', weight: 35 }, { name: '业务结果', weight: 30 },
      { name: '证据强度', weight: 20 }, { name: '协作反馈', weight: 15 },
    ]
  },
  {
    id: 'rp2', name: 'T8-T10 晋级候选排序', scope: 'T8-T10 · 12人',
    memberCount: 12, status: 'draft', createdAt: '2026-06-22',
    dimensions: [
      { name: '专业能力', weight: 40 }, { name: '项目贡献', weight: 35 },
      { name: '公共贡献', weight: 25 },
    ]
  },
];

export const mockPromotions: PromotionEvent[] = [
  {
    id: 'pr1', employeeId: 'e002', employeeName: '李四',
    currentLevel: 'T9', targetLevel: 'T10', triggerType: 'manager_nominate',
    materialCompleteness: 75, status: 'in_review',
    gaps: ['专业公共贡献不足（已完成2类，需3类）', '缺少跨团队影响力案例'],
    createdAt: '2026-06-18'
  },
  {
    id: 'pr2', employeeId: 'e004', employeeName: '赵六',
    currentLevel: 'T8', targetLevel: 'T9', triggerType: 'self_apply',
    materialCompleteness: 40, status: 'draft',
    gaps: ['历史绩效记录不完整', '停留时间不足（还需4个月）', '缺少项目 owner 案例', '专业公共贡献为0'],
    createdAt: '2026-06-22'
  },
];

export const ratingLabels: Record<string, { label: string; color: string }> = {
  outstanding_plus: { label: 'Outstanding+', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  outstanding: { label: 'Outstanding', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  good_plus: { label: 'Good+', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  good: { label: 'Good', color: 'text-green-700 bg-green-50 border-green-200' },
  good_minus: { label: 'Good-', color: 'text-teal-700 bg-teal-50 border-teal-200' },
  underperform: { label: 'Underperform', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  underperform_minus: { label: 'Underperform-', color: 'text-red-700 bg-red-50 border-red-200' },
};

export const statusLabels: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-slate-500 bg-slate-100 border-slate-200' },
  agent_updated: { label: 'Agent Updated', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  risk_checked: { label: 'Risk Checked', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  needs_evidence: { label: 'Needs Evidence', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  needs_alignment: { label: 'Needs Alignment', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  manager_reviewed: { label: 'Manager Reviewed', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  manager_confirmed: { label: 'Manager Confirmed', color: 'text-green-700 bg-green-50 border-green-200' },
  governance_blocked: { label: 'Governance Blocked', color: 'text-red-700 bg-red-50 border-red-200' },
  submitted: { label: 'Submitted', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  calibrated: { label: 'Calibrated', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  final_confirmed: { label: 'Final Confirmed', color: 'text-green-800 bg-green-100 border-green-300' },
  applied: { label: 'Applied', color: 'text-slate-800 bg-slate-200 border-slate-300' },
  revised: { label: 'Revised', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  archived: { label: 'Archived', color: 'text-slate-500 bg-slate-100 border-slate-200' },
};

// ============================================================
// 派生统计层 —— 单一数据源：mockTeamMembers / mockAgentLogs
// 所有看板数字由此计算，避免硬编码导致的口径不一致
// ============================================================

// 排序池规模（产品技术部 H1 综合排序，见 mockRankingPools rp1）
export const RANKING_POOL_SIZE = 32;

// 证据强度 / 评价高低分界
const EVIDENCE_HIGH = 70;
const RATING_HIGH = 70;

// 评级 -> 量化分（用于贡献-评价一致性矩阵纵轴）
const ratingScoreMap: Record<PerformanceRating, number> = {
  outstanding_plus: 100, outstanding: 90, good_plus: 75,
  good: 60, good_minus: 45, underperform: 30, underperform_minus: 15,
};

export const getRatingScore = (r?: PerformanceRating): number =>
  r ? ratingScoreMap[r] : 0;

// 团队整体统计
export const teamStats = {
  total: mockTeamMembers.length,
  rated: mockTeamMembers.filter(m => !!m.performanceRating).length,
  avgEvidence: Math.round(
    mockTeamMembers.reduce((s, m) => s + m.evidenceScore, 0) / mockTeamMembers.length
  ),
  confirmed: mockTeamMembers.filter(m => m.status === 'manager_confirmed').length,
  needsAlignment: mockTeamMembers.filter(m => m.status === 'needs_alignment').length,
  needsEvidence: mockTeamMembers.filter(m => m.status === 'needs_evidence').length,
  lowEvidence: mockTeamMembers.filter(m => m.evidenceScore < 60).length,
  agentPendingOps: mockAgentLogs.filter(l => !l.confirmed && !l.reverted).length,
};

// 评级分布（按档位从高到低）
const ratingOrder: PerformanceRating[] = [
  'outstanding_plus', 'outstanding', 'good_plus', 'good', 'good_minus', 'underperform', 'underperform_minus',
];

export const ratingDistribution = ratingOrder.map(r => ({
  rating: r,
  label: ratingLabels[r].label,
  count: mockTeamMembers.filter(m => m.performanceRating === r).length,
}));

// Outstanding 类占比（团队口径）
export const outstandingShare = (() => {
  const count = mockTeamMembers.filter(
    m => m.performanceRating === 'outstanding' || m.performanceRating === 'outstanding_plus'
  ).length;
  return { count, pct: Math.round((count / mockTeamMembers.length) * 100) };
})();

// 结果确认管道（覆盖全部成员的真实状态分组，合计 = total）
export type PipelineStage = { key: string; label: string; count: number; color: string };
const countByStatus = (...statuses: string[]) =>
  mockTeamMembers.filter(m => statuses.includes(m.status)).length;

export const pipelineStages: PipelineStage[] = [
  { key: 'pending', label: '待完善', color: 'text-slate-500 bg-slate-100 border-slate-200',
    count: countByStatus('draft', 'needs_evidence') },
  { key: 'agent_updated', label: 'Agent Updated', color: 'text-orange-700 bg-orange-50 border-orange-200',
    count: countByStatus('agent_updated') },
  { key: 'needs_alignment', label: '待对齐', color: 'text-purple-700 bg-purple-50 border-purple-200',
    count: countByStatus('needs_alignment') },
  { key: 'manager_reviewed', label: 'Reviewed', color: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    count: countByStatus('manager_reviewed') },
  { key: 'manager_confirmed', label: 'Confirmed', color: 'text-green-700 bg-green-50 border-green-200',
    count: countByStatus('manager_confirmed') },
  { key: 'final_confirmed', label: 'Final', color: 'text-green-800 bg-green-100 border-green-300',
    count: countByStatus('final_confirmed') },
];

// 贡献-评价一致性散点（横轴=证据强度，纵轴=评价量化分）
export const contributionMatrix = mockTeamMembers.map(m => ({
  name: m.employeeName,
  x: m.evidenceScore,
  y: getRatingScore(m.performanceRating),
  // 低证据高评价 = 需复核（高亮）
  highlight: m.evidenceScore < EVIDENCE_HIGH && getRatingScore(m.performanceRating) >= RATING_HIGH,
}));

const inQuadrant = (hiEvi: boolean, hiRating: boolean) =>
  contributionMatrix.filter(
    p => (p.x >= EVIDENCE_HIGH) === hiEvi && (p.y >= RATING_HIGH) === hiRating
  ).length;

// 四象限计数（合计 = total）
export const matrixQuadrants = {
  consistent: inQuadrant(true, true),     // 高证据高评价：一致
  undervalued: inQuadrant(true, false),   // 高证据低评价：可能低估
  needsReview: inQuadrant(false, true),   // 低证据高评价：需复核
  needsConfirm: inQuadrant(false, false), // 低证据低评价：需确认
};
