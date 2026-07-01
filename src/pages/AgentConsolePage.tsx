import React, { useState } from 'react';
import {
  Send, RotateCcw, CheckCircle, AlertTriangle, Bot, Clock,
  Zap, ChevronRight, Shield, Ban, Eye, Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { RiskCard } from '../components/Cards';
import { mockAgentLogs } from '../data/mockData';

const quickActions = [
  { label: '生成本期摘要', icon: Sparkles, level: 'L1' },
  { label: '检查证据缺口', icon: Eye, level: 'L1' },
  { label: '识别分歧点', icon: AlertTriangle, level: 'L1' },
  { label: '按综合贡献排序', icon: Zap, level: 'L2' },
  { label: '把张三改成 Outstanding', icon: ChevronRight, level: 'L2' },
  { label: '提交正式绩效', icon: Shield, level: 'L3' },
];

const exampleResponses: Record<string, { preview: string; level: string; risks?: boolean }> = {
  '把张三改成 Outstanding': {
    preview: '将张三的绩效候选结果从 Good+ 修改为 Outstanding',
    level: 'L2',
    risks: true,
  },
  '生成本期摘要': {
    preview: '为当前评估对象生成本期工作摘要（只读操作）',
    level: 'L1',
  },
  '检查证据缺口': {
    preview: '分析当前证据完整度，识别证据薄弱项',
    level: 'L1',
  },
  '按综合贡献排序': {
    preview: '根据项目贡献、业务结果、证据强度对当前排序池进行排序',
    level: 'L2',
    risks: true,
  },
  '提交正式绩效': {
    preview: '将候选绩效结果提交为正式结果（需二次确认）',
    level: 'L3',
  },
};

const levelConfig = {
  L1: { color: 'text-green-700 bg-green-50 border-green-200', label: 'L1 低风险' },
  L2: { color: 'text-yellow-700 bg-yellow-50 border-yellow-200', label: 'L2 中风险' },
  L3: { color: 'text-orange-700 bg-orange-50 border-orange-200', label: 'L3 高风险 · 需确认' },
  L4: { color: 'text-red-700 bg-red-50 border-red-200', label: 'L4 违规 · 阻断' },
};

export const AgentConsolePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<{ text: string; level: string } | null>(null);
  const [executed, setExecuted] = useState<string | null>(null);
  const [showRisk, setShowRisk] = useState(false);
  const [showL3Confirm, setShowL3Confirm] = useState(false);

  const handleInput = (val: string) => {
    setInput(val);
    const resp = exampleResponses[val];
    if (resp) {
      setPreview({ text: resp.preview, level: resp.level });
    } else {
      setPreview(null);
    }
  };

  const handleExecute = () => {
    const resp = exampleResponses[input];
    if (!resp) {
      setExecuted('已执行：' + input);
      setShowRisk(false);
      return;
    }
    if (resp.level === 'L3') {
      setShowL3Confirm(true);
      return;
    }
    setExecuted(input);
    setPreview(null);
    setShowRisk(!!resp.risks);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main Console */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Agent Console</h1>
            <p className="text-xs text-slate-400 mt-0.5">通过自然语言直接操作评价候选结果，Agent 会即时校验风险并提醒确认</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">Evidence Agent · Evaluation Operator Agent 就绪</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Quick Actions */}
          <div>
            <div className="section-title mb-3">快捷操作</div>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map(action => {
                const Icon = action.icon;
                const cfg = levelConfig[action.level as keyof typeof levelConfig];
                return (
                  <button
                    key={action.label}
                    onClick={() => handleInput(action.label)}
                    className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="flex-1 text-xs">{action.label}</span>
                    <span className={clsx('badge border text-xs flex-shrink-0', cfg.color)}>{action.level}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Card */}
          {preview && (
            <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">操作预览</span>
                <span className={clsx('badge border ml-auto', levelConfig[preview.level as keyof typeof levelConfig]?.color)}>
                  {levelConfig[preview.level as keyof typeof levelConfig]?.label}
                </span>
              </div>
              <p className="text-sm text-slate-700 mb-3">{preview.text}</p>
              <div className="flex gap-2">
                <button onClick={handleExecute} className="btn-primary text-xs">
                  <Zap className="w-3 h-3" />确认执行
                </button>
                <button onClick={() => setPreview(null)} className="btn-secondary text-xs">取消</button>
              </div>
            </div>
          )}

          {/* Executed + Risk */}
          {executed && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800">已执行：「{executed}」</span>
              </div>

              {showRisk && (
                <RiskCard
                  operationDesc={`已根据指令执行：「${executed}」`}
                  risks={[
                    { id: 'r1', level: 'high', title: 'Outstanding 比例超出建议区间', description: '当前部门比例将从 18% 提升到 21%，超过建议区间 20%', suggestedActions: ['查看相邻人员对比', '调整其他人员结果'], resolved: false },
                    { id: 'r2', level: 'medium', title: '证据完整度偏低', description: '张三本期证据完整度 62%，缺少项目负责人确认', suggestedActions: ['请求项目负责人补充确认'], resolved: false },
                  ]}
                  onDismiss={() => { setShowRisk(false); setExecuted(null); }}
                  onAction={(a) => console.log(a)}
                  onRevert={() => { setExecuted(null); setShowRisk(false); }}
                />
              )}
            </div>
          )}

          {/* L3 Block */}
          {showL3Confirm && (
            <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-800">L3 高风险操作 · 需要二次确认</span>
              </div>
              <p className="text-sm text-slate-700 mb-3">「{input}」为正式结果提交操作，将影响正式记录和下游应用，无法自动撤销。请确认您已完成所有校验。</p>
              <div className="flex gap-2">
                <button onClick={() => { setShowL3Confirm(false); setExecuted(input); setInput(''); }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                  我已确认，执行
                </button>
                <button onClick={() => setShowL3Confirm(false)} className="btn-secondary text-sm">取消</button>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ai-400" />
              <input
                value={input}
                onChange={e => handleInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && input.trim() && handleExecute()}
                className="input pl-10 pr-4"
                placeholder="输入自然语言指令，例如：把张三改成 Outstanding..."
              />
            </div>
            <button
              onClick={handleExecute}
              disabled={!input.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />执行
            </button>
          </div>
          <div className="flex gap-3 mt-2">
            <span className="text-xs text-slate-400">Agent 操作分级：</span>
            {Object.entries(levelConfig).map(([k, v]) => (
              <span key={k} className={clsx('badge border text-xs', v.color)}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Operation Log */}
      <div className="w-72 flex-shrink-0 border-l border-slate-200 overflow-y-auto bg-slate-50/30">
        <div className="p-4">
          <div className="section-title mb-3">操作日志</div>
          <div className="space-y-3">
            {mockAgentLogs.map(log => {
              const cfg = levelConfig[log.opLevel];
              return (
                <div key={log.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-slate-800">「{log.instruction}」</span>
                    <span className={clsx('badge border text-xs flex-shrink-0', cfg.color)}>{log.opLevel}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {log.targetName} · {log.beforeValue} → <span className="text-slate-700 font-medium">{log.afterValue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center gap-1">
                      {log.confirmed ? (
                        <span className="text-xs text-green-600 flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" />已确认
                        </span>
                      ) : log.reverted ? (
                        <span className="text-xs text-slate-500 flex items-center gap-0.5">
                          <RotateCcw className="w-3 h-3" />已撤销
                        </span>
                      ) : (
                        <span className="text-xs text-orange-600 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />待确认
                        </span>
                      )}
                    </div>
                  </div>
                  {!log.confirmed && !log.reverted && (
                    <div className="flex gap-2 pt-1 border-t border-slate-100">
                      <button className="flex-1 py-1 text-xs bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100 transition-colors">确认</button>
                      <button className="flex-1 py-1 text-xs bg-white text-red-600 rounded border border-red-200 hover:bg-red-50 transition-colors">撤销</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
