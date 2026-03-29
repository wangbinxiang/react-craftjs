import React from 'react';

import { SitePage } from '../../../utils/preview';

type PageTabsProps = {
  pages: SitePage[];
  currentPageId: string;
  onSelectPage: (pageId: string) => void;
};

export const PageTabs = ({
  pages,
  currentPageId,
  onSelectPage,
}: PageTabsProps) => {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {pages.map((page) => {
          const selected = page.id === currentPageId;

          // The tab strip is now the only page-management surface shown in the editor header.
          return (
            <button
              key={page.id}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
                selected
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900',
              ].join(' ')}
              type="button"
              onClick={() => onSelectPage(page.id)}
            >
              {page.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};
