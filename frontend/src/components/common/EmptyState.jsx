import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no items available to display at this time.',
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300 my-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn-secondary text-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
