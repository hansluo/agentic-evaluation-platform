import React, { useState } from 'react';
import { Shield, Search, Filter, AlertCircle, Eye, FileText, CheckCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { mockAuditLogs, mockFinalJudgmentCards } from '../data/mockData';

const opTypeConfig: Record<string, { label: string; color: string }> = {
  create: { label: '创建', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  read: { label: '读取', color: 'text-slate-600 bg-slate-50 border-slate-200' },
  update: { label: '修改', color: 'text-orange-700 bg-orange-50 border-orange-200' },
  delete: { label: '删除', color: 'text-red-700 bg-red-50 border-red-200' },
  confirm: { label: '确认', color: 'text-green-700 bg-green-50 border-green-200' },
  submit: { label: '提交', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  revert: { label: '撤销', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  export: { label: '导出', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  access_sensitive: { label: '高敏访问', color: 'text-red-700 bg-red-50 border-red-red-200' },
};

export const AuditPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterOp, setFilterOp] = useState<string>('all');
  const [showFJC, setShowFJC] = useState(false);

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchSearch = log.operator_name.includes(search) || log.target_object.includes(search);
    const matchOp = filterOp === 'all' || log.operation_type === filterOp;
    return matchSearch && matchOp;
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-slate-600" />
              审计中心
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">完整操作日志、版本历史对比、申诉材料导出</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFJC(!showFJC)}
              className={clsx('btn-secondary text-xs', showFJC && 'bg-secondary-fixed border-secondary-fixed')}
            >
              <FileText className="w-3.5 h-3.5" />
              {showFJC ? '查看操作日志' : '查看正式确认卡'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '审计记录总数', count: mockAuditLogs.length, icon: FileText, color: 'text-slate-700', bg: 'bg-slate-50' },
            { label: '高敏数据访问', count: mockAuditLogs.filter(l => l.sensitive_data_accessed).length, icon: Eye, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Agent 操作', count: mockAuditLogs.filter(l => l.operator_type === 'agent').length, icon: RefreshCw, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: '正式确认卡', count: mockFinalJudgmentCards.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card px-4 py-3 flex items-center gap-3">
                <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', s.bg)}>
                  <Icon className={clsx('w-4 h-4', s.color)} />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-800">{s.count}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content */}
        {showFJC ? (
          /* 正式确认卡列表 */
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-slate-700">正式确认卡（FinalJudgmentCard）</span>
              <span className="badge badge-confirmed">{mockFinalJudgmentCards.length}</span>
              <span className="text-xs text-slate-400 ml-auto">不可删除，只能新增版本</span>
            </div>
            <div className="divide-y divide-slate-50">
              {mockFinalJudgmentCards.map(card => (
                <div key={card.card_id} className="px-4 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-slate-800">员工 {card.employee_id}</span>
                      <span className="badge badge-confirmed">v{card.version}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{card.confirmer_name} 确认</span>
                      <span className="text-xs text-slate-400">· {new Date(card.confirmed_at).toLocaleString('zh-CN')}</span>
                    </div>
                    <span className="text-xs text-slate-400">{card.result_usage}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400">绩效</span>
                      <div className="font-medium text-slate-700 mt-0.5">{card.final_rating}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">梯队</span>
                      <div className="font-medium text-slate-700 mt-0.5">第 {card.talent_tier} 档</div>
                    </div>
                    <div>
                      <span className="text-slate-400">九宫格</span>
                      <div className="font-medium text-slate-700 mt-0.5">({card.nine_box?.x}, {card.nine_box?.y})</div>
                    </div>
                    <div>
                      <span className="text-slate-400">排序</span>
                      <div className="font-medium text-slate-700 mt-0.5">第 {card.rank_position}</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-slate-400 w-16 flex-shrink-0">关键依据</span>
                      <p className="text-xs text-slate-600">{card.key_basis}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-slate-400 w-16 flex-shrink-0">AI 建议</span>
                      <p className="text-xs text-slate-600">{card.ai_suggestion}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs font-semibold text-slate-400 w-16 flex-shrink-0">人工修改</span>
                      <p className="text-xs text-slate-600">{card.human_modification}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={clsx('badge', card.dispute_status === 'none' ? 'badge-confirmed' : 'badge-pending')}>
                      {card.dispute_status === 'none' ? '无异议' : '有异议'}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">审计 ID: {card.audit_entry_id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-red-500 font-medium">不可变 (immutable)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* 审计日志列表 */
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">操作日志</span>
                <span className="badge badge-pending">{filteredLogs.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input pl-9 w-40 text-xs"
                    placeholder="搜索操作人/对象..."
                  />
                </div>
                <select
                  value={filterOp}
                  onChange={e => setFilterOp(e.target.value)}
                  className="input w-32 text-xs"
                >
                  <option value="all">全部操作</option>
                  <option value="update">修改</option>
                  <option value="confirm">确认</option>
                  <option value="access_sensitive">高敏访问</option>
                  <option value="create">创建</option>
                  <option value="submit">提交</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {filteredLogs.map(log => {
                const cfg = opTypeConfig[log.operation_type] || { label: log.operation_type, color: 'text-slate-600 bg-slate-50 border-slate-200' };
                return (
                  <div key={log.audit_id} className="px-4 py-3 flex items-start gap-3">
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      log.operator_type === 'agent' ? 'bg-ai-50' : log.sensitive_data_accessed ? 'bg-red-50' : 'bg-slate-50'
                    )}>
                      {log.operator_type === 'agent' ? (
                        <RefreshCw className="w-3.5 h-3.5 text-ai-500" />
                      ) : log.sensitive_data_accessed ? (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-800">{log.operator_name}</span>
                        <span className="text-xs text-slate-400">({log.operator_type})</span>
                        <span className={clsx('badge border text-xs', cfg.color)}>{cfg.label}</span>
                        <span className="text-xs text-slate-400">→ {log.target_object}</span>
                        {log.sensitive_data_accessed && (
                          <span className="badge badge-risk text-xs">高敏</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {log.target_type}
                        {log.before_value && log.after_value && (
                          <span className="ml-2">{log.before_value} → <span className="font-medium text-slate-700">{log.after_value}</span></span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {new Date(log.timestamp).toLocaleString('zh-CN')} · 来源: {log.source}
                      </div>
                    </div>
                    {log.sensitive_data_accessed && log.sensitive_data_types && (
                      <div className="flex flex-wrap gap-1 flex-shrink-0 max-w-48">
                        {log.sensitive_data_types.map(t => (
                          <span key={t} className="text-xs px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-100">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-400">审计日志不可篡改 (immutable) · 所有写操作自动记录</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
