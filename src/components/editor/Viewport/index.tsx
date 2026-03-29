import { useEditor } from '@craftjs/core';
import cx from 'classnames';
import React, { useEffect } from 'react';

import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Toolbox } from './Toolbox';
import {
  DEVICE_PREVIEW_WIDTHS,
  type DevicePreviewMode,
} from './devicePreview';

type ViewportProps = {
  children?: React.ReactNode;
  deviceMode: DevicePreviewMode;
  onChangeDeviceMode: (mode: DevicePreviewMode) => void;
  pageManager?: React.ReactNode;
  previewHref: string;
  onOpenPreview: () => void;
};

export const Viewport: React.FC<ViewportProps> = ({
  children,
  deviceMode,
  onChangeDeviceMode,
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

  const deviceWidth = DEVICE_PREVIEW_WIDTHS[deviceMode];

  return (
    <div className="viewport">
      <div
        className={cx(['flex h-full overflow-hidden flex-row w-full fixed'])}
      >
        <Toolbox />
        <div className="page-container flex flex-1 h-full flex-col">
          <Header
            deviceMode={deviceMode}
            onChangeDeviceMode={onChangeDeviceMode}
            previewHref={previewHref}
            onOpenPreview={onOpenPreview}
          />
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
            <div className="viewport-canvas-area relative flex min-h-full justify-center pt-8">
              <div
                className="viewport-canvas-shell"
                data-device-mode={deviceMode}
                style={{ width: `${deviceWidth}px` }}
              >
                {/* Keep a stable fixed-width shell so CSS breakpoints react to real layout width instead of zoom tricks. */}
                <div className="relative flex flex-col">{children}</div>
              </div>
            </div>
          </div>
        </div>
        <Sidebar />
      </div>
    </div>
  );
};
