import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Megaphone } from 'lucide-react';
import { format } from 'date-fns';

const AnnouncementsWidget = () => {
  const { announcements } = useAppContext();

  if (announcements.length === 0) return null;

  return (
    <div className="bg-bg-panel rounded-xl border border-border-subtle p-6 relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[50px] pointer-events-none"></div>
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <Megaphone className="h-5 w-5 text-amber-400" />
        <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest">System Announcements</h2>
      </div>
      <div className="space-y-4 relative z-10">
        {announcements.slice(0, 3).map((ann) => (
          <div key={ann.id} className="p-4 bg-bg-base border border-border-faint rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium text-text-main">{ann.title}</h4>
              <span className="text-xs font-mono text-text-faint">{format(new Date(ann.date), 'MMM d, yyyy')}</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsWidget;
