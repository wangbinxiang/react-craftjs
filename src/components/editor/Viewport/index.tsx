import { useEditor } from '@craftjs/core';
import cx from 'classnames';
import React, { useEffect } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toolbox } from './Toolbox';

type ViewportProps = {
  children?: React.ReactNode;
  pageManager?: React.ReactNode;
  previewHref: string;
  onOpenPreview: () => void;
};

export const Viewport: React.FC<ViewportProps> = ({
  children,
  pageManager,
  previewHref,
  onOpenPreview,
}) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.requestAnimationFrame(() => {
      // Preserve the legacy landing contract so external hosts can wait for the editor shell to hydrate.
      window.parent.postMessage(
        {
          LANDING_PAGE_LOADED: true,
        },
        '*'
      );

      setTimeout(() => {
        // The original demo reveals editing shortly after mount so the static initial tree is visible first.
        setOptions((options) => {
          options.enabled = true;
        });
      }, 200);
    });
  }, [setOptions]);

  return (
    <div className="viewport">
      <div
        className={cx(['flex h-full overflow-hidden flex-row w-full fixed'])}
      >
        <Toolbox />
        <div className="page-container flex flex-1 h-full flex-col">
          <Header previewHref={previewHref} onOpenPreview={onOpenPreview} />
          {pageManager}
          <div
            className={cx([
              'craftjs-renderer flex-1 h-full w-full transition pb-8 overflow-auto',
              {
                'bg-renderer-gray': enabled,
              },
            ])}
            ref={(ref) => {
              // Register the viewport as the shared hover/select surface for any node rendered inside the frame.
              connectors.select(connectors.hover(ref, null), null);
            }}
          >
            <div className="relative flex-col flex items-center pt-8">
              {children}
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};
