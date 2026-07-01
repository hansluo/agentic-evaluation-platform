import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Command } from 'lucide-react';
import { User } from '../types';

interface TopBarProps {
  user: User;
  breadcrumb?: string[];
}

const roleLabels = {
  manager: { label: '管理者', color: 'bg-indigo-50 text-indigo-700' },
  hr: { label: 'HR/PP', color: 'bg-purple-50 text-purple-700' },
  admin: { label: '超管', color: 'bg-slate-100 text-slate-700' },
  employee: { label: '员工', color: 'bg-green-50 text-green-700' },
  indirect_manager: { label: '间接上级', color: 'bg-blue-50 text-blue-700' },
};

export const TopBar: React.FC<TopBarProps> = ({ user, breadcrumb }) => {
  const [showSearch, setShowSearch] = useState(false);
  const roleInfo = roleLabels[user.role] || roleLabels.employee;

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 flex-shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {breadcrumb?.map((item, idx) => (
          <React.Fragment key={item}>
            {idx > 0 && <span className="text-slate-300">/</span>}
            <span className={idx === breadcrumb.length - 1 ? 'text-slate-800 font-medium' : 'hover:text-slate-700 cursor-pointer'}>
              {item}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-400 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>搜索</span>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs text-slate-400">
            <Command className="w-3 h-3" />K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <img
            src={`https://r.hrc.woa.com/photo/150/${user.engName}.png?default_when_absent=true`}
            alt={user.chnName}
            className="w-7 h-7 rounded-full object-cover bg-slate-200"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.chnName)}&background=6366f1&color=fff&size=56`;
            }}
          />
          <div className="text-left">
            <div className="text-sm font-medium text-slate-800 leading-tight">{user.chnName}</div>
            <div className="text-xs text-slate-400 leading-tight">{user.level} · {user.deptName}</div>
          </div>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleInfo.color}`}>{roleInfo.label}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* Command Palette Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-24" onClick={() => setShowSearch(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 border border-slate-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                autoFocus
                className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none"
                placeholder="搜索员工、项目、事件..."
              />
              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-500">Esc</kbd>
            </div>
            <div className="p-4">
              <div className="text-xs text-slate-400 mb-3">快捷操作</div>
              {[
                '打开张三的评估档案',
                '查看本期 Outstanding 超比例风险',
                '生成团队评价摘要',
                '查看待确认 Agent 操作',
                '发起晋级事件',
              ].map(item => (
                <button
                  key={item}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  onClick={() => setShowSearch(false)}
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
