import React from 'react';
import { clsx } from 'clsx';
import {
  AlertTriangle, AlertCircle, Info, CheckCircle, X,
  ArrowRight, RotateCcw, FileText, Shield
} from 'lucide-react';
import { RiskItem, RiskLevel } from '../types';

// ============ RiskCard ============
interface RiskCardProps {
  operationDesc: string;
  risks: RiskItem[];
  onAction?: (action: string) => void;
  onRevert?: () => void;
  onDismiss?: () => void;
}

const riskConfig: Record<RiskLevel, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  high: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  low: { icon: Info, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
};

export const RiskCard: React.FC<RiskCardProps> = ({ operationDesc, risks, onAction, onRevert, onDismiss }) => {
  const highRisks = risks.filter(r => r.level === 'high');
  const medRisks = risks.filter(r => r.level === 'medium');
  const lowRisks = risks.filter(r => r.level === 'low');

  const allActions = [...new Set(risks.flatMap(r => r.suggestedActions))];

  return (
    <div className="border border-orange-200 bg-orange-50/50 rounded-xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">操作完成 · 发现 {risks.length} 个风险</span>
        </div>
        <button onClick={onDismiss} className="text-orange-400 hover:text-orange-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Operation desc */}
      <div className="px-4 py-3 border-b border-orange-100">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-700">{operationDesc}</div>
        </div>
      </div>

      {/* Risks */}
      <div className="px-4 py-3 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">快速校验发现</div>
        {[...highRisks, ...medRisks, ...lowRisks].map((risk, idx) => {
          const cfg = riskConfig[risk.level];
          const Icon = cfg.icon;
          return (
            <div key={risk.id} className={clsx('flex items-start gap-2.5 p-2.5 rounded-lg border', cfg.bg, cfg.border)}>
              <Icon className={clsx('w-3.5 h-3.5 mt-0.5 flex-shrink-0', cfg.color)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-700">{idx + 1}. {risk.title}</span>
                  <span className={clsx('text-xs px-1.5 py-0.5 rounded-full font-medium',
                    risk.level === 'high' ? 'bg-red-100 text-red-700' :
                    risk.level === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  )}>
                    {risk.level === 'high' ? '高' : risk.level === 'medium' ? '中' : '低'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{risk.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {allActions.length > 0 && (
        <div className="px-4 pb-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">可选动作</div>
          <div className="flex flex-wrap gap-2">
            {allActions.map(action => (
              <button
                key={action}
                onClick={() => onAction?.(action)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <ArrowRight className="w-3 h-3" />
                {action}
              </button>
            ))}
            {onRevert && (
              <button
                onClick={onRevert}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                撤销修改
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============ AIInsightCard ============
interface AIInsightCardProps {
  title: string;
  conclusion: string;
  basis: string;
  uncertainty?: string;
  suggestedAction?: string;
  confidence?: number; // 0-100
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title, conclusion, basis, uncertainty, suggestedAction, confidence = 75, className
}) => {
  return (
    <div className={clsx('border border-ai-200 bg-ai-50/40 rounded-xl p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gradient-to-br from-ai-400 to-ai-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="text-sm font-medium text-ai-700">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">置信度</span>
          <div className="flex items-center gap-1">
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-ai-500 rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs font-medium text-ai-600">{confidence}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <span className="text-xs font-semibold text-slate-400 w-12 flex-shrink-0 pt-0.5">结论</span>
          <p className="text-sm text-slate-800">{conclusion}</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-semibold text-slate-400 w-12 flex-shrink-0 pt-0.5">依据</span>
          <p className="text-xs text-slate-600">{basis}</p>
        </div>
        {uncertainty && (
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-yellow-500 w-12 flex-shrink-0 pt-0.5">不确定</span>
            <p className="text-xs text-slate-500">{uncertainty}</p>
          </div>
        )}
        {suggestedAction && (
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-ai-500 w-12 flex-shrink-0 pt-0.5">建议</span>
            <p className="text-xs text-ai-700">{suggestedAction}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ AlignmentCard ============
interface AlignmentCardProps {
  title: string;
  type: string;
  selfView: string;
  managerView: string;
  projectView?: string;
  aiSummary: string;
  onInitiateAlignment?: () => void;
}

export const AlignmentCard: React.FC<AlignmentCardProps> = ({
  title, type, selfView, managerView, projectView, aiSummary, onInitiateAlignment
}) => {
  return (
    <div className="border border-purple-200 bg-purple-50/30 rounded-xl p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span className="text-sm font-medium text-purple-800">分歧 · {title}</span>
          <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full border border-purple-200">{type}</span>
        </div>
        <span className="text-xs text-slate-400">Needs Alignment</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-lg p-2.5 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">员工自评</div>
          <div className="text-sm text-slate-700">{selfView}</div>
        </div>
        <div className="bg-white rounded-lg p-2.5 border border-slate-100">
          <div className="text-xs text-slate-400 mb-1">上级评价</div>
          <div className="text-sm text-slate-700">{managerView}</div>
        </div>
        {projectView && (
          <div className="col-span-2 bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="text-xs text-slate-400 mb-1">项目负责人</div>
            <div className="text-sm text-slate-700">{projectView}</div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-ai-100">
        <div className="w-4 h-4 bg-ai-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold" style={{ fontSize: '8px' }}>AI</span>
        </div>
        <p className="text-xs text-slate-600">{aiSummary}</p>
      </div>

      <button
        onClick={onInitiateAlignment}
        className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
      >
        发起对齐讨论
      </button>
    </div>
  );
};

// ============ FinalJudgmentCard ============
interface FinalJudgmentCardProps {
  onConfirm: (data: { rating: string; basis: string }) => void;
  onCancel: () => void;
  currentRating: string;
  employeeName: string;
}

export const FinalJudgmentCard: React.FC<FinalJudgmentCardProps> = ({
  onConfirm, onCancel, currentRating, employeeName
}) => {
  const [basis, setBasis] = React.useState('');

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 animate-fade-in">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-800">正式确认评价结果</div>
              <div className="text-xs text-slate-400">确认后将进入正式记录，留存审计留痕</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">被评估人</span>
              <span className="font-medium text-slate-800">{employeeName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">绩效候选结果</span>
              <span className="font-semibold text-indigo-700">{currentRating}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">确认时间</span>
              <span className="text-slate-700">{new Date().toLocaleString('zh-CN')}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">关键评价依据 <span className="text-red-500">*</span></label>
            <textarea
              value={basis}
              onChange={e => setBasis(e.target.value)}
              className="input resize-none h-24"
              placeholder="请简述本次评价的核心依据（将进入审计记录）..."
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700">本次确认将进入正式评价记录，修改需要走正式变更流程并留存审计。</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1">取消</button>
          <button
            onClick={() => basis.trim() && onConfirm({ rating: currentRating, basis })}
            disabled={!basis.trim()}
            className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            确认正式结果
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ EvidenceCard ============
interface EvidenceCardProps {
  title: string;
  type: string;
  sourceSystem: string;
  strength: 'strong' | 'medium' | 'weak' | 'unverified';
  summary: string;
  createdAt: string;
  className?: string;
}

const strengthConfig = {
  strong: { label: 'Strong', color: 'evidence-strong' },
  medium: { label: 'Medium', color: 'evidence-medium' },
  weak: { label: 'Weak', color: 'evidence-weak' },
  unverified: { label: 'Unverified', color: 'evidence-unverified' },
};

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  title, type, sourceSystem, strength, summary, createdAt, className
}) => {
  const cfg = strengthConfig[strength];
  return (
    <div className={clsx('bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-all', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-800 truncate">{title}</span>
        </div>
        <span className={clsx('badge border flex-shrink-0', cfg.color)}>{cfg.label}</span>
      </div>
      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{summary}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{sourceSystem}</span>
        <span>{createdAt}</span>
      </div>
    </div>
  );
};
