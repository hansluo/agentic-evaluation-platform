import React, { useState } from 'react';
import { BarChart3, GripVertical, Bot, Zap, ArrowUpDown, CheckCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { mockRankingPools, mockTeamMembers, ratingLabels, RANKING_POOL_SIZE } from '../data/mockData';

export const RankingPage: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState(mockRankingPools[0]);
  const [rankedMembers, setRankedMembers] = useState(
    [...mockTeamMembers].sort((a, b) => (a.rankPosition || 0) - (b.rankPosition || 0))
  );

  const moveRank = (index: number, direction: 'up' | 'down') => {
    const newRank = [...rankedMembers];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newRank.length) return;
    [newRank[index], newRank[swapIndex]] = [newRank[swapIndex], newRank[index]];
    setRankedMembers(newRank);
  };

  const getRankPercentile = (index: number) => Math.round(((index + 1) / rankedMembers.length) * 100);
  const getSuggestedRating = (index: number) => {
    const pct = getRankPercentile(index);
    if (pct <= 20) return { rating: 'Outstanding', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (pct <= 80) return { rating: 'Good', color: 'text-green-700 bg-green-50 border-green-200' };
    return { rating: 'Underperform', color: 'text-orange-700 bg-orange-50 border-orange-200' };
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Ranking Workspace</h1>
            <p className="text-sm text-slate-400 mt-0.5">业务大排序，排序结果转化为绩效参考</p>
          </div>
          <button className="btn-primary text-xs"><BarChart3 className="w-3.5 h-3.5" />创建排序池</button>
        </div>

        {/* Pool Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {mockRankingPools.map(pool => (
            <button
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className={clsx(
                'flex flex-col px-3 py-2 rounded-lg border text-xs whitespace-nowrap transition-all',
                selectedPool.id === pool.id
                  ? 'border-secondary-fixed bg-secondary-fixed'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              )}
            >
              <span className={clsx('font-medium', selectedPool.id === pool.id ? 'text-space-gray' : 'text-slate-600')}>{pool.name}</span>
              <span className="text-slate-400 mt-0.5">{pool.scope} · {pool.status}</span>
            </button>
          ))}
        </div>

        {/* Dimensions */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">排序维度与权重</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPool.dimensions.map(dim => (
              <span key={dim.name} className="badge border border-slate-200 bg-slate-50 text-slate-600">
                {dim.name} · {dim.weight}%
              </span>
            ))}
          </div>
        </div>

        {/* Ranked List */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">排序结果</span>
              <span className="text-xs text-slate-400">{rankedMembers.length} / {RANKING_POOL_SIZE}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-xs text-ai-600 hover:text-ai-700 font-medium flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />AI 排序
              </button>
              <button className="text-xs text-space-gray hover:text-space-gray font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />映射绩效候选
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-50">
            {rankedMembers.map((member, idx) => {
              const percentile = getRankPercentile(idx);
              const suggested = getSuggestedRating(idx);
              const ratingInfo = ratingLabels[member.performanceRating || 'good'];
              return (
                <div key={member.employeeId} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col items-center gap-0.5">
                    <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab" />
                  </div>
                  <div className="w-7 text-center flex-shrink-0">
                    <span className={clsx('text-sm font-bold', idx < 3 ? 'text-space-gray' : 'text-slate-400')}>{idx + 1}</span>
                  </div>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-indigo-700">{member.employeeName[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{member.employeeName}</span>
                      {member.lastChangedBy === 'agent' && <Bot className="w-3 h-3 text-ai-500" />}
                    </div>
                    <div className="text-xs text-slate-400">证据 {member.evidenceScore}% · 前 {percentile}%</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveRank(idx, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30 text-xs">▲</button>
                    <button onClick={() => moveRank(idx, 'down')} disabled={idx === rankedMembers.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30 text-xs">▼</button>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 w-48 justify-end">
                    <span className={clsx('badge border text-xs', ratingInfo?.color)}>{ratingInfo?.label || '-'}</span>
                    <span className="text-xs text-slate-300">→</span>
                    <span className={clsx('badge border text-xs', suggested.color)}>{suggested.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-4 py-3 border-t border-slate-100">
            <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">排序只能生成绩效参考，正式绩效仍需管理者确认、规则校验和审计留痕。</p>
            </div>
          </div>
        </div>

        {/* Agent Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-ai-500 rounded flex items-center justify-center">
              <span className="text-white font-bold" style={{ fontSize: '8px' }}>AI</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Agent 操作</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-ai-200 hover:bg-ai-50/30 transition-all text-left">
              <Bot className="w-3.5 h-3.5 text-slate-400" /><span className="flex-1 text-xs">按综合贡献排序</span><span className="badge border text-xs bg-yellow-50 text-yellow-700 border-yellow-200">L2</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-ai-200 hover:bg-ai-50/30 transition-all text-left">
              <Zap className="w-3.5 h-3.5 text-slate-400" /><span className="flex-1 text-xs">前10%标记Outstanding</span><span className="badge border text-xs bg-yellow-50 text-yellow-700 border-yellow-200">L2</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-ai-200 hover:bg-ai-50/30 transition-all text-left">
              <CheckCircle className="w-3.5 h-3.5 text-slate-400" /><span className="flex-1 text-xs">生成排序说明</span><span className="badge border text-xs bg-green-50 text-green-700 border-green-200">L1</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
