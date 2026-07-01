import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { RadarPage } from './pages/RadarPage';
import { PeopleListPage } from './pages/PeopleListPage';
import { PeoplePage } from './pages/PeoplePage';
import { AgentConsolePage } from './pages/AgentConsolePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { mockCurrentUser } from './data/mockData';

const breadcrumbMap: Record<string, string[]> = {
  '/radar': ['Evaluation Radar'],
  '/people': ['人员评估'],
  '/events': ['事件评估'],
  '/ranking': ['排序工作台'],
  '/promotion': ['晋级工作台'],
  '/cycle': ['周期确认'],
  '/analytics': ['校验分析'],
  '/rules': ['规则配置'],
  '/agents': ['Agent 配置'],
  '/audit': ['审计中心'],
};

function AppShell() {
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const breadcrumb = breadcrumbMap[base] || ['页面'];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar userRole={mockCurrentUser.role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar user={mockCurrentUser} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/radar" replace />} />
            <Route path="/radar" element={<RadarPage />} />
            <Route path="/people" element={<PeopleListPage />} />
            <Route path="/people/:id" element={<PeoplePage />} />
            <Route path="/events" element={
              <PlaceholderPage title="Event Evaluation Workspace" description="事件评估工作台，支持在项目/里程碑/管理事件后即时沉淀贡献证据。即将上线。" />
            } />
            <Route path="/ranking" element={
              <PlaceholderPage title="Ranking Workspace" description="排序工作台，支持业务大排序和绩效候选映射。即将上线。" />
            } />
            <Route path="/promotion" element={
              <PlaceholderPage title="Promotion Workspace" description="晋级工作台，支持 Offcycle 晋级发起和材料管理。即将上线。" />
            } />
            <Route path="/cycle" element={
              <PlaceholderPage title="Cycle Confirmation" description="严肃周期确认工作台，支持 H1/H2 周期汇总确认。即将上线。" />
            } />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/rules" element={
              <PlaceholderPage title="Rules 规则配置" description="治理规则、名额比例、Agent 操作边界配置。即将上线。" />
            } />
            <Route path="/agents" element={<AgentConsolePage />} />
            <Route path="/audit" element={
              <PlaceholderPage title="Audit 审计中心" description="完整操作日志、版本历史对比、申诉材料导出。即将上线。" />
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
