// ============================================================
// Agentic Evaluation Platform — 类型定义
// 基于 AEP 设计统一文档 v2
// 如果代码与文档冲突，以文档 §1.3 设计原则为准
// ============================================================

// ---------- 基础枚举 ----------

// 系统角色（6 类，AEP v2 §3.1）
export type UserRole = 'employee' | 'manager' | 'non_l_evaluator' | 'indirect_manager' | 'hr' | 'admin';

// 用户权限等级（独立于 Agent 操作级别，AEP v2 §3.4）
export type UserPermissionLevel = 'viewer' | 'editor' | 'confirmer' | 'admin';

// 评价结果状态（14 态状态机，AEP v2 §4.1）
export type EvaluationStatus =
  | 'draft'
  | 'agent_updated'
  | 'risk_checked'
  | 'needs_evidence'
  | 'needs_alignment'
  | 'manager_reviewed'
  | 'manager_confirmed'
  | 'governance_blocked'
  | 'submitted'
  | 'calibrated'
  | 'final_confirmed'
  | 'applied'
  | 'revised'
  | 'archived';

// 绩效档位（大三档 + 7 子档位，AEP v2 §2）
export type PerformanceRating =
  | 'outstanding_plus'
  | 'outstanding'
  | 'good_plus'
  | 'good'
  | 'good_minus'
  | 'underperform'
  | 'underperform_minus';

// 大三档归属
export type RatingTier = 'outstanding' | 'good' | 'underperform';

// 证据强度
export type EvidenceStrength = 'strong' | 'medium' | 'weak' | 'unverified';

// 风险级别
export type RiskLevel = 'high' | 'medium' | 'low';

// Agent 操作级别（AEP v2 §6.2）
export type AgentOpLevel = 'L1' | 'L2' | 'L3' | 'L4';

// 梯队档位（5/7/10 档）
export type TalentTier = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

// 晋级发起类型
export type PromotionTriggerType = 'self_apply' | 'manager_nominate' | 'professional_recommend';

// 治理强度（三档，AEP v2 §7.1）
export type GovernanceLevel = 'low' | 'medium' | 'high';

// 场景类型（AEP v2 §5.2）
export type ScenarioType =
  | 'offcycle_review'
  | 'offcycle_promotion'
  | 'cycle_performance'
  | 'ranking'
  | 'talent_tier'
  | 'nine_box'
  | 'talent_review'
  | 'project_event_review';

// 结果用途
export type ResultUsage = 'reference' | 'formal' | 'compensation' | 'promotion' | 'ranking';

// 评价类型
export type EvaluationType = 'performance' | 'talent_tier' | 'nine_box' | 'promotion' | 'ranking';

// 事件类型
export type EventType =
  | 'project_start'
  | 'milestone'
  | 'project_complete'
  | 'okr_change'
  | 'task_complete'
  | 'self_input'
  | 'peer_feedback'
  | 'manager_review'
  | 'promotion_event'
  | 'ranking_event'
  | 'management_event'
  | 'offcycle_review';

// 证据类型（7 大类 + other，AEP v2 §5.5）
export type EvidenceType =
  | 'goal'            // 目标证据：OKR、目标变更、关键里程碑
  | 'project'         // 项目证据：项目角色、里程碑、结项复盘
  | 'delivery'        // 交付证据：文档、代码、设计稿、PRD、上线记录
  | 'business_result' // 业务结果：用户、收入、效率、质量、稳定性指标
  | 'feedback'        // 协作反馈：项目负责人、同级、下级、跨团队反馈
  | 'management'      // 管理事件：组织调整、关键问题处理、事故复盘
  | 'history'         // 历史趋势：过往绩效、梯队、职级、反馈变化
  | 'self_input'      // 自评内容
  | 'other';

// 风险类型（10 类，AEP v2 §5.10）
export type RiskType =
  | 'high_rating_low_evidence'
  | 'low_rating_no_negative_evidence'
  | 'rating_ranking_mismatch'
  | 'promotion_material_gap'
  | 'history_trend_anomaly'
  | 'self_eval_diff_large'
  | 'non_l_affects_formal'
  | 'agent_op_unconfirmed'
  | 'result_modification_impact'
  | 'result_modification_compensation';

// 评价输入关系类型（AEP v2 §5.11）
export type RelationType =
  | 'l_manager'
  | 'non_l_evaluator'
  | 'project_owner'
  | 'professional_reviewer'
  | 'dotted_line'
  | 'collaborator'
  | 'hr_partner';

// 正式责任类型
export type AccountabilityType = 'L' | 'authorized_chain' | 'hr';

// 变更来源类型
export type ChangedByType = 'human' | 'agent_on_behalf_of_human' | 'system_rule' | 'import';

// 审计操作类型
export type AuditOperationType =
  | 'create' | 'read' | 'update' | 'delete' | 'confirm'
  | 'submit' | 'revert' | 'export' | 'access_sensitive';

// 审计来源
export type AuditSource = 'web' | 'api' | 'agent' | 'system';

// ---------- 核心实体 ----------

// 用户信息（AEP v2 §3.1）
export interface User {
  id: string;
  name: string;
  engName: string;
  chnName: string;
  deptName: string;
  position: string;
  level: string;
  role: UserRole;
  permissionLevel: UserPermissionLevel;
  avatar?: string;
}

// 评估场景（AEP v2 §5.2 — 治理引擎）
export interface EvaluationScenario {
  scenario_id: string;
  scenario_type: ScenarioType;
  governance_level: GovernanceLevel;
  result_usage: ResultUsage;

  allowed_evaluator_roles: UserRole[];
  required_confirmers: { role: UserRole; level: 'L' | 'indirect' | 'hr' }[];
  rule_set_id: string;
  audit_level: 'basic' | 'full' | 'enhanced';

  enable_agent_ops: boolean;
  enable_risk_check: boolean;
  enable_quota: boolean;
  enable_l_chain: boolean;
  enable_appeal: boolean;

  status: 'draft' | 'active' | 'completed' | 'archived';
}

// 评价对象（AEP v2 §5.3 — 第一性抽象）
export interface EvaluationObject {
  evaluation_object_id: string;
  employee_id: string;
  scenario_id: string;
  time_window: { start: string; end: string };

  related_events: string[];
  related_goals: string[];
  related_tasks: string[];
  related_projects: string[];

  evaluation_types: EvaluationType[];

  evidence_item_ids: string[];
  risk_item_ids: string[];
  alignment_status: 'aligned' | 'misaligned' | 'pending';

  governance_level: GovernanceLevel;
  final_judgment_card_id?: string;
  version: number;

  status: EvaluationStatus;
}

// 自评内容（AEP v2 §5.4 — 不包含 self_rating 字段，产品级硬约束）
export interface SelfInput {
  self_input_id: string;
  employee_id: string;
  time_window: { start: string; end: string };

  related_goal_ids: string[];
  related_project_ids: string[];

  content: {
    key_achievements?: string;
    goal_completion?: string;
    project_contributions?: string;
    task_completion?: string;
    growth_reflection?: string;
    challenges?: string;
    attention_needed?: string;
    attached_evidence?: string[];
  };

  submitted_at: string;
  visibility_scope: 'manager' | 'manager_and_hr' | 'all_evaluators';
  status: 'draft' | 'submitted' | 'locked';

  // 硬约束：此接口不允许出现 self_rating / self_rating_level / performance_rating 字段
}

// 证据项（AEP v2 §5.5 — 底座实体）
export interface EvidenceItem {
  evidence_id: string;
  source_system: string;
  source_type: EvidenceType;

  title: string;
  summary: string;
  raw_link?: string;

  created_by: string;
  created_at: string;

  related_employee_ids: string[];
  related_event_ids: string[];
  related_goal_ids: string[];

  evidence_strength: EvidenceStrength;
  visibility_scope: 'manager' | 'manager_and_hr' | 'all_evaluators' | 'public';
  permission_tag: 'public' | 'restricted' | 'confidential';

  ai_extracted_claims: string[];
  ai_importance: 'high' | 'medium' | 'low';

  enter_formal_result: boolean;
  employee_visible: boolean;
  linked_evaluation_objects: string[];

  status: 'active' | 'archived' | 'disputed';
}

// 候选结果（AEP v2 §5.6 — Agent 可直接修改）
export interface EvaluationResultCandidate {
  candidate_id: string;
  evaluation_object_id: string;
  employee_id: string;

  evaluation_type: EvaluationType;

  current_value: string;
  previous_value?: string;

  changed_by: string;
  changed_by_type: ChangedByType;
  changed_at: string;
  change_reason?: string;
  source_instruction?: string;

  risk_status: 'unchecked' | 'passed' | 'has_risks' | 'blocked';
  risk_item_ids: string[];

  confirmation_status: 'pending' | 'confirmed' | 'rejected';

  final_result_id?: string;
}

// 正式结果（AEP v2 §5.7 — Agent 不可直接写入）
export interface EvaluationResultFinal {
  final_result_id: string;
  evaluation_object_id: string;
  employee_id: string;

  evaluation_type: EvaluationType;
  result_value: string;

  confirmer_id: string;
  confirmer_name: string;
  confirmed_at: string;

  final_judgment_card_id: string;

  version: number;
  previous_version_id?: string;
  change_reason?: string;

  status: 'final_confirmed' | 'applied' | 'revised' | 'archived';
}

// 正式确认卡（AEP v2 §5.8 — 责任锚点，不可删除）
export interface FinalJudgmentCard {
  card_id: string;
  employee_id: string;
  evaluation_object_id: string;

  final_rating: PerformanceRating;
  talent_tier?: TalentTier;
  nine_box?: { x: number; y: number };
  rank_position?: number;

  confirmer_id: string;
  confirmer_name: string;
  confirmed_at: string;

  evidence_links: string[];
  key_basis: string;

  ai_suggestion: string;
  human_modification: string;
  ai_human_diff: string;

  calibrated: boolean;
  calibration_record?: string;

  result_usage: ResultUsage;

  dispute_status: 'none' | 'pending' | 'resolved';

  audit_entry_id: string;

  immutable: true;
  version: number;
  previous_version_id?: string;
}

// Agent 操作日志（AEP v2 §5.9）
export interface AgentOperationLog {
  operation_id: string;
  user_id: string;
  agent_id: string;
  instruction: string;

  operation_type: string;
  target_object: string;
  target_name: string;

  before_value: string;
  after_value: string;

  op_level: AgentOpLevel;
  risk_check_result_ids: string[];

  confirmation_required: boolean;
  confirmed_by?: string;
  confirmed_at?: string;

  status: 'executed' | 'pending_confirmation' | 'confirmed' | 'reverted' | 'blocked';
  audit_level: 'basic' | 'full' | 'enhanced';
}

// 风险校验结果（AEP v2 §5.10）
export interface RiskCheckResult {
  risk_check_id: string;
  target_object: string;
  risk_type: RiskType;
  risk_level: RiskLevel;
  description: string;
  suggested_actions: string[];
  blocking: boolean;
  created_at: string;
  resolved_by?: string;
  resolved_at?: string;
  status: 'active' | 'resolved' | 'dismissed';
}

// 评价输入关系（AEP v2 §5.11）
export interface EvaluationRelation {
  relation_id: string;
  evaluation_object_id: string;
  evaluator_id: string;
  evaluator_role: UserRole;
  relation_type: RelationType;
  weight?: number;
  input_content?: string;
  submitted_at?: string;
  status: 'pending' | 'submitted' | 'withdrawn';
}

// 正式责任关系（AEP v2 §5.11）
export interface FinalAccountabilityRelation {
  relation_id: string;
  evaluation_object_id: string;
  accountable_id: string;
  accountable_type: AccountabilityType;
  confirmation_level: number;
  confirmed: boolean;
  confirmed_at?: string;
}

// 审计日志（AEP v2 §5.12 — 不可篡改）
export interface AuditLog {
  audit_id: string;
  timestamp: string;

  operator_id: string;
  operator_name: string;
  operator_type: 'human' | 'agent' | 'system';

  operation_type: AuditOperationType;
  target_object: string;
  target_type: string;

  before_value?: string;
  after_value?: string;

  source: AuditSource;
  ip_address?: string;
  user_agent?: string;

  sensitive_data_accessed: boolean;
  sensitive_data_types?: string[];

  immutable: true;
}

// 评估周期（AEP v2 §5.13）
export interface Cycle {
  cycle_id: string;
  cycle_type: 'H1' | 'H2' | 'offcycle';
  governance_level: GovernanceLevel;

  start_date: string;
  end_date: string;
  slice_date: string;

  scenario_ids: string[];

  status: 'draft' | 'active' | 'review' | 'confirmed' | 'applied' | 'archived';
}

// 规则集（AEP v2 §5.14 — 三层分层）
export interface RuleSet {
  rule_set_id: string;
  name: string;

  group_baseline_rules: Rule[];
  scenario_rules: {
    low: Rule[];
    medium: Rule[];
    high: Rule[];
  };
  business_extension_rules: Rule[];

  status: 'draft' | 'active' | 'archived';
}

export interface Rule {
  rule_id: string;
  name: string;
  category: 'strong_validation' | 'business_rule' | 'risk_check';
  description: string;
  rule_type: 'blocking' | 'warning' | 'info';
  condition: string;
  action: string;
}

// ---------- 兼容实体（用于前端展示，保持向后兼容） ----------

// 评估事件（前端展示用）
export interface EvalEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  date: string;
  relatedProject?: string;
  relatedGoal?: string;
  participants?: string[];
  evidenceCount: number;
  isIncludedInCycle: boolean;
  aiImportance: 'high' | 'medium' | 'low';
  status: 'pending' | 'summarized' | 'needs_confirm' | 'included' | 'archived';
}

// 风险项（前端展示用，兼容旧接口）
export interface RiskItem {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  suggestedActions: string[];
  resolved: boolean;
}

// 评价候选结果（前端展示用，兼容旧接口）
export interface EvaluationCandidate {
  employeeId: string;
  employeeName: string;
  level: string;
  deptName: string;
  performanceRating?: PerformanceRating;
  previousRating?: PerformanceRating;
  talentTier?: TalentTier;
  nineBoxX?: number;
  nineBoxY?: number;
  rankPosition?: number;
  status: EvaluationStatus;
  lastChangedBy: 'human' | 'agent' | 'system';
  lastChangedAt: string;
  evidenceScore: number;
  riskItems: RiskItem[];
}

// Agent 操作日志（前端展示用，兼容旧接口）
export interface AgentOpLog {
  id: string;
  timestamp: string;
  instruction: string;
  operationType: string;
  targetName: string;
  beforeValue: string;
  afterValue: string;
  opLevel: AgentOpLevel;
  riskItems: RiskItem[];
  confirmationRequired: boolean;
  confirmed: boolean;
  reverted: boolean;
}

// 排序池
export interface RankingPool {
  id: string;
  name: string;
  scope: string;
  memberCount: number;
  dimensions: { name: string; weight: number }[];
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
}

// 晋级事件
export interface PromotionEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  currentLevel: string;
  targetLevel: string;
  triggerType: PromotionTriggerType;
  materialCompleteness: number;
  status: 'draft' | 'in_review' | 'approved' | 'rejected';
  gaps: string[];
  createdAt: string;
}

// 协作反馈证据池
export interface CollaborationFeedback {
  id: string;
  employeeId: string;
  feedbackProviderId: string;
  feedbackProviderName: string;
  feedbackProviderRole: UserRole;
  relationType: RelationType;
  content: string;
  submittedAt: string;
  evidenceItemId?: string;
  status: 'pending' | 'submitted' | 'withdrawn';
}
