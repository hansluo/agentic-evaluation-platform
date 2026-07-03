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
import { AuditPage } from './pages/AuditPage';
import { EventPage } from './pages/EventPage';
import { CalibrationPage } from './pages/CalibrationPage';
import { RankingPage } from './pages/RankingPage';
import { PromotionPage } from './pages/PromotionPage';
import { CyclePage } from './pages/CyclePage';
import { mockCurrentUser } from './data/mockData';

const breadcrumbMap: Record<string, string[]> = {
  '/radar': ['Evaluation Radar'],
  '/people': ['人员评估'],
  '/events': ['事件评估'],
  '/ranking': ['排序工作台'],
  '/promotion': ['晋级工作台'],
  '/cycle': ['周期确认'],
  '/analytics': ['校验分析'],
  '/calibration': ['团队校准'],
  '/rules': ['规则配置'],
  '/agents': ['Agent 配置'],
  '/audit': ['审计中心'],
};

function AppShell() {
  const { pathname } = useLocation();
  const base = '/' + pathname.split('/')[1];
  const breadcrumb = breadcrumbMap[base] || ['页面'];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f9f9fb' }}>
      <Sidebar userRole={mockCurrentUser.role} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar user={mockCurrentUser} breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/radar" replace />} />
            <Route path="/radar" element={<RadarPage />} />
            <Route path="/people" element={<PeopleListPage />} />
            <Route path="/people/:id" element={<PeoplePage />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/promotion" element={<PromotionPage />} />
            <Route path="/cycle" element={<CyclePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/calibration" element={<CalibrationPage />} />
            <Route path="/rules" element={
              <PlaceholderPage title="Rules 规则配置" description="治理规则、名额比例、Agent 操作边界配置。即将上线。" />
            } />
            <Route path="/agents" element={<AgentConsolePage />} />
            <Route path="/audit" element={<AuditPage />} />
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
