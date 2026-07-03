import React, { useState } from 'react';
import { TrendingUp, FileText, AlertCircle, CheckCircle, Plus, Bot, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { mockPromotions, mockTeamMembers } from '../data/mockData';

export const PromotionPage: React.FC = () => {
  const [selectedPromo, setSelectedPromo] = useState(mockPromotions[0]);

  const employee = mockTeamMembers.find(m => m.employeeId === selectedPromo.employeeId);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Promotion Workspace</h1>
            <p className="text-sm text-slate-400 mt-0.5">支持周期内和 offcycle 职级晋级</p>
          </div>
          <button className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" />发起晋级</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: '全部', count: mockPromotions.length, color: 'text-slate-700' },
            { label: '待评审', count: mockPromotions.filter(p => p.status === 'in_review').length, color: 'text-orange-600' },
            { label: '草稿', count: mockPromotions.filter(p => p.status === 'draft').length, color: 'text-yellow-600' },
            { label: '材料不足', count: mockPromotions.filter(p => p.materialCompleteness < 60).length, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="card px-4 py-3 text-center">
              <div className={clsx('text-2xl font-bold', s.color)}>{s.count}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Left: Promotion List */}
          <div className="col-span-1 space-y-2">
            {mockPromotions.map(promo => {
              const emp = mockTeamMembers.find(m => m.employeeId === promo.employeeId);
              return (
                <div
                  key={promo.id}
                  onClick={() => setSelectedPromo(promo)}
                  className={clsx(
                    'card p-3 cursor-pointer transition-all',
                    selectedPromo.id === promo.id ? 'border-primary-200 ring-1 ring-primary-100' : 'hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-indigo-700">{promo.employeeName[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800">{promo.employeeName}</div>
                      <div className="text-xs text-slate-400">{promo.currentLevel} → {promo.targetLevel}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={clsx('h-full rounded-full', promo.materialCompleteness >= 80 ? 'bg-green-500' : promo.materialCompleteness >= 60 ? 'bg-yellow-500' : 'bg-red-500')} style={{ width: `${promo.materialCompleteness}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{promo.materialCompleteness}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detail */}
          <div className="col-span-2 space-y-4">
            {/* Employee Info */}
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-indigo-700">{selectedPromo.employeeName[0]}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{selectedPromo.employeeName}</div>
                  <div className="text-xs text-slate-400">{employee?.level || selectedPromo.currentLevel} · {employee?.deptName || '产品技术部'}</div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-slate-400">{selectedPromo.currentLevel}</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-bold text-green-700">{selectedPromo.targetLevel}</span>
                </div>
              </div>
            </div>

            {/* Material Completeness */}
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">材料完整度</span>
                <span className={clsx('ml-auto text-lg font-bold', selectedPromo.materialCompleteness >= 80 ? 'text-green-600' : selectedPromo.materialCompleteness >= 60 ? 'text-yellow-600' : 'text-red-600')}>
                  {selectedPromo.materialCompleteness}%
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: '历史绩效记录', done: true },
                  { label: '项目 owner 案例', done: selectedPromo.materialCompleteness > 50 },
                  { label: '专业公共贡献', done: selectedPromo.materialCompleteness > 70 },
                  { label: '跨团队影响力案例', done: selectedPromo.materialCompleteness > 80 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.done ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                    <span className={clsx('text-xs', item.done ? 'text-slate-600' : 'text-red-600')}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gaps */}
            <div className="card p-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">材料缺口</div>
              <div className="space-y-1.5">
                {selectedPromo.gaps.map((gap, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg border border-red-100">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-red-700">{gap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-ai-200 hover:bg-ai-50/30 transition-all text-left">
                <Bot className="w-3.5 h-3.5 text-slate-400" /><span className="flex-1 text-xs">生成晋级分析</span><span className="badge border text-xs bg-green-50 text-green-700 border-green-200">L1</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-ai-200 hover:bg-ai-50/30 transition-all text-left">
                <FileText className="w-3.5 h-3.5 text-slate-400" /><span className="flex-1 text-xs">生成晋级理由</span><span className="badge border text-xs bg-green-50 text-green-700 border-green-200">L1</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-ai-200 hover:bg-ai-50/30 transition-all text-left">
                <Zap className="w-3.5 h-3.5 text-slate-400" /><span className="flex-1 text-xs">提交评审</span><span className="badge border text-xs bg-orange-50 text-orange-700 border-orange-200">L3</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
