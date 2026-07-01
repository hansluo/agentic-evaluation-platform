// 用户角色
export type UserRole = 'employee' | 'manager' | 'hr' | 'admin' | 'indirect_manager';

// 评价结果状态
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

// 绩效档位
export type PerformanceRating = 'outstanding' | 'outstanding_plus' | 'good_plus' | 'good' | 'good_minus' | 'underperform' | 'underperform_minus';

// 证据强度
export type EvidenceStrength = 'strong' | 'medium' | 'weak' | 'unverified';

// 风险级别
export type RiskLevel = 'high' | 'medium' | 'low';

// Agent 操作级别
export type AgentOpLevel = 'L1' | 'L2' | 'L3' | 'L4';

// 梯队档位
export type TalentTier = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

// 晋级发起类型
export type PromotionTriggerType = 'self_apply' | 'manager_nominate' | 'professional_recommend';

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

// 用户信息
export interface User {
  id: string;
  name: string;
  engName: string;
  chnName: string;
  deptName: string;
  position: string;
  level: string;
  role: UserRole;
  avatar?: string;
}

// 评估事件
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

// 证据项
export interface EvidenceItem {
  id: string;
  title: string;
  type: 'project_doc' | 'code' | 'design' | 'meeting_notes' | 'business_metric' | 'feedback' | 'okr' | 'other';
  sourceSystem: string;
  strength: EvidenceStrength;
  summary: string;
  createdAt: string;
  relatedEmployee?: string;
  permissionTag?: 'public' | 'restricted' | 'confidential';
}

// 风险项
export interface RiskItem {
  id: string;
  level: RiskLevel;
  title: string;
  description: string;
  suggestedActions: string[];
  resolved: boolean;
}

// 评价候选结果
export interface EvaluationCandidate {
  employeeId: string;
  employeeName: string;
  level: string;
  deptName: string;
  performanceRating?: PerformanceRating;
  previousRating?: PerformanceRating;
  talentTier?: TalentTier;
  nineBoxX?: number; // 1-3
  nineBoxY?: number; // 1-3
  rankPosition?: number;
  status: EvaluationStatus;
  lastChangedBy: 'human' | 'agent' | 'system';
  lastChangedAt: string;
  evidenceScore: number; // 0-100
  riskItems: RiskItem[];
}

// Agent 操作日志
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
  materialCompleteness: number; // 0-100
  status: 'draft' | 'in_review' | 'approved' | 'rejected';
  gaps: string[];
  createdAt: string;
}
