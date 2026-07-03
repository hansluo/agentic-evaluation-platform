import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Radar, Users, CalendarCheck, BarChart3, TrendingUp,
  RefreshCw, PieChart, Settings, Bot, Shield,
  ChevronLeft, ChevronRight, Zap, GitCompare
} from 'lucide-react';
import { clsx } from 'clsx';
import { UserRole } from '../types';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  labelEn: string;
  badge?: number;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { path: '/radar', icon: Radar, label: '评估雷达', labelEn: 'Radar', badge: 5 },
  { path: '/people', icon: Users, label: '人员评估', labelEn: 'People', badge: 2 },
  { path: '/events', icon: CalendarCheck, label: '事件评估', labelEn: 'Events' },
  { path: '/ranking', icon: BarChart3, label: '排序', labelEn: 'Ranking' },
  { path: '/promotion', icon: TrendingUp, label: '晋级', labelEn: 'Promotion', badge: 1 },
  { path: '/cycle', icon: RefreshCw, label: '周期确认', labelEn: 'Cycle' },
  { path: '/analytics', icon: PieChart, label: '校验分析', labelEn: 'Analytics' },
  { path: '/calibration', icon: GitCompare, label: '团队校准', labelEn: 'Calibration' },
  { path: '/rules', icon: Settings, label: '规则配置', labelEn: 'Rules' },
  { path: '/agents', icon: Bot, label: 'Agent 配置', labelEn: 'Agents' },
  { path: '/audit', icon: Shield, label: '审计', labelEn: 'Audit' },
];

interface SidebarProps {
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // AEP v2 §1.3 原则：弱化层级区隔，所有菜单对所有角色可见
  const visibleItems = navItems;

  return (
    <div className={clsx(
      'relative flex flex-col bg-white border-r border-slate-200 transition-all duration-300 flex-shrink-0',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-2.5 px-4 h-14 border-b border-slate-100',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-7 h-7 bg-gradient-to-br from-secondary-fixed0 to-tertiary-container rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-slate-800 leading-tight">AEP</div>
            <div className="text-xs text-slate-400 leading-tight">Evaluation Platform</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-none">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group relative',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-secondary-fixed text-space-gray font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-space-gray' : '')} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && item.badge > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-xs"></span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-400" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-400" />
        )}
      </button>

      {/* Bottom: Version */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="text-xs text-slate-400">V2.0 · Calm Intelligence</div>
        </div>
      )}
    </div>
  );
};
