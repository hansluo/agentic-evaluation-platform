import React, { useState } from 'react';
import {
  CalendarCheck, Briefcase, Target, CheckCircle, Star,
  Users, FileText, Zap, AlertCircle, Plus, ExternalLink, Bot
} from 'lucide-react';
import { clsx } from 'clsx';
import { mockEvents, mockEvidenceItems, mockTeamMembers } from '../data/mockData';
import { GapCard, EvidenceCard, AgentActionButton } from '../components/Cards';

const eventTypeIcon: Record<string, React.ElementType> = {
  project_start: Briefcase,
  project_complete: CheckCircle,
  milestone: Star,
  okr_change: Target,
  task_complete: CheckCircle,
  peer_feedback: Users,
  management_event: Briefcase,
  offcycle_review: CalendarCheck,
};

const participantContributions = [
  { employeeId: 'e001', name: '张三', role: 'Owner', strength: 'strong', contribution: '主导架构设计和核心模块开发', evidenceCount: 7 },
  { employeeId: 'e002', name: '李四', role: '核心贡献者', strength: 'strong', contribution: '负责推荐算法优化，CTR 提升 23%', evidenceCount: 4 },
  { employeeId: 'e003', name: '王五', role: '关键协作者', strength: 'medium', contribution: '数据管道和 AB 测试框架搭建', evidenceCount: 2 },
  { employeeId: 'e004', name: '赵六', role: '参与者', strength: 'weak', contribution: '前端页面适配', evidenceCount: 1 },
];

export const EventPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);
  const [showGapCard, setShowGapCard] = useState(true);

  const Icon = eventTypeIcon[selectedEvent.type] || Briefcase;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-slate-800">Event Evaluation Workspace</h1>
          <p className="text-sm text-slate-400 mt-0.5">项目/里程碑/管理事件后即时沉淀贡献证据</p>
        </div>

        {/* Event Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {mockEvents.map(event => {
            const EventIcon = eventTypeIcon[event.type] || Briefcase;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs whitespace-nowrap transition-all',
                  selectedEvent.id === event.id
                    ? 'border-secondary-fixed bg-secondary-fixed text-space-gray'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                )}
              >
                <EventIcon className="w-3.5 h-3.5" />
                <span className="max-w-40 truncate">{event.title}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Event Overview */}
        <div className="card p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-secondary-fixed rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-space-gray" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-800">{selectedEvent.title}</h2>
                {selectedEvent.isIncludedInCycle && (
                  <span className="badge badge-confirmed">已纳入周期</span>
                )}
                {selectedEvent.aiImportance === 'high' && (
                  <span className="badge badge-ai"><Zap className="w-3 h-3" />AI 高重要度</span>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-1">{selectedEvent.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>日期: {selectedEvent.date}</span>
                {selectedEvent.relatedProject && <span>项目: {selectedEvent.relatedProject}</span>}
                {selectedEvent.relatedGoal && <span>目标: {selectedEvent.relatedGoal}</span>}
                <span>证据: {selectedEvent.evidenceCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Contribution Map */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">贡献地图</span>
            </div>
            <button className="text-xs text-space-gray hover:text-space-gray font-medium">
              <Plus className="w-3 h-3 inline" />添加参与者
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {participantContributions.map(p => {
              const member = mockTeamMembers.find(m => m.employeeId === p.employeeId);
              const strengthColor = p.strength === 'strong' ? 'evidence-strong' : p.strength === 'medium' ? 'evidence-medium' : 'evidence-weak';
              return (
                <div key={p.employeeId} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-indigo-700">{p.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-800">{p.name}</span>
                      <span className={clsx('badge border text-xs', strengthColor)}>{p.role}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{p.contribution}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-400">证据</div>
                    <div className="text-sm font-medium text-slate-700">{p.evidenceCount}</div>
                  </div>
                  {member?.lastChangedBy === 'agent' && (
                    <Bot className="w-3 h-3 text-ai-500 flex-shrink-0" title="Agent 已修改" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Evidence Wall */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">证据墙</span>
              <span className="text-xs text-slate-400">{mockEvidenceItems.length} 条</span>
            </div>
            <button className="btn-secondary text-xs"><Plus className="w-3 h-3" />添加证据</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {mockEvidenceItems.map(ev => (
              <EvidenceCard key={ev.id} title={ev.title} type={ev.type} sourceSystem={ev.sourceSystem}
                strength={ev.strength} summary={ev.summary} createdAt={ev.createdAt} />
            ))}
          </div>
        </div>

        {/* Gap Card */}
        {showGapCard && (
          <GapCard
            gapType="协作反馈不足"
            impact="当前对赵六的参与深度判断置信度较低，仅 1 条弱证据"
            suggestedAction="向项目负责人请求补充赵六在项目中的具体角色和贡献描述"
            className=""
          />
        )}

        {/* 4. Event Evaluation Cards + Agent Actions */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">事件评价</span>
            <span className="text-xs text-slate-400 ml-1">项目负责人轻量评价参与人</span>
          </div>
          <div className="space-y-2">
            {participantContributions.slice(0, 3).map(p => (
              <div key={p.employeeId} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-indigo-700">{p.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.role} · 证据 {p.evidenceCount}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200 hover:bg-green-100">建议纳入</button>
                  <button className="text-xs px-2 py-1 bg-white text-slate-500 rounded border border-slate-200 hover:bg-slate-50">跳过</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Quick Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-ai-500 rounded flex items-center justify-center">
              <span className="text-white font-bold" style={{ fontSize: '8px' }}>AI</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">Agent 快捷操作</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <AgentActionButton icon={Bot} label="生成事件摘要" level="L1" />
            <AgentActionButton icon={AlertCircle} label="识别贡献缺口" level="L1" />
            <AgentActionButton icon={Zap} label="纳入周期评价" level="L2" />
          </div>
        </div>
      </div>
    </div>
  );
};
