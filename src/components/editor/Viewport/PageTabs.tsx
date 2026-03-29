import React from 'react';

import { PRODUCT_PAGE_SLUG, SitePage } from '../../../utils/preview';

type PageTabsProps = {
  pages: SitePage[];
  currentPageId: string;
  onSelectPage: (pageId: string) => void;
  onRenamePage: (pageId: string, title: string) => void;
  onMovePage: (pageId: string, direction: 'left' | 'right') => void;
};

const actionButtonClassName =
  'rounded border border-slate-300 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-400 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40';

export const PageTabs = ({
  pages,
  currentPageId,
  onSelectPage,
  onRenamePage,
  onMovePage,
}: PageTabsProps) => {
  // Existing saved pages remain visible so older multi-page documents still have a stable navigation surface.
  const currentPage =
    pages.find((page) => page.id === currentPageId) ?? pages[0] ?? null;
  const currentPageIndex = currentPage
    ? pages.findIndex((page) => page.id === currentPage.id)
    : -1;
  const canRenameCurrentPage = currentPage?.slug !== PRODUCT_PAGE_SLUG;

  const handleRename = () => {
    if (!currentPage || typeof window === 'undefined') {
      return;
    }

    const nextTitle = window.prompt('Rename page', currentPage.title)?.trim();

    if (!nextTitle) {
      return;
    }

    onRenamePage(currentPage.id, nextTitle);
  };

  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {pages.map((page) => {
            const selected = page.id === currentPageId;

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

        {currentPage && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              {currentPage.slug}
            </span>
            <button
              className={actionButtonClassName}
              disabled={currentPageIndex <= 0}
              type="button"
              onClick={() => onMovePage(currentPage.id, 'left')}
            >
              Move Left
            </button>
            <button
              className={actionButtonClassName}
              disabled={currentPageIndex === -1 || currentPageIndex >= pages.length - 1}
              type="button"
              onClick={() => onMovePage(currentPage.id, 'right')}
            >
              Move Right
            </button>
            {canRenameCurrentPage && (
              <button
                className={actionButtonClassName}
                type="button"
                onClick={handleRename}
              >
                Rename
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
