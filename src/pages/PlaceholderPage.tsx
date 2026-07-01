import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Construction className="w-7 h-7 text-slate-400" />
      </div>
      <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
      <p className="text-sm text-slate-400 mt-1.5 max-w-sm">{description || '该页面正在开发中，将在后续版本上线'}</p>
    </div>
  </div>
);
