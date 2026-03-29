import { Editor, Frame } from '@craftjs/core';
import cx from 'classnames';
import React from 'react';

import { applyLandingLayoutToSerializedNodes } from '../data/landing';
import { applyProductDataToSerializedNodes } from '../data/product';
import {
  createBlankContentPage,
  createCaseDetailPage,
  createDefaultLandingPage,
  createProductDetailPage,
  editorResolver,
} from '../lib/editor-config';
import {
  PRODUCT_PAGE_SLUG,
  buildExamplePath,
  getPageBySlug,
  readSiteDocument,
  resolvePageFrameSource,
} from '../utils/preview';

type PreviewPageProps = {
  slug: string;
};

export const PreviewPage = ({ slug }: PreviewPageProps) => {
  const editorHref = buildExamplePath('editor', import.meta.env.BASE_URL);
  const siteDocument = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return readSiteDocument(window.localStorage);
  }, []);
  const currentPage = React.useMemo(
    () => getPageBySlug(siteDocument, slug),
    [siteDocument, slug]
  );
  const previewHref = currentPage
    ? buildExamplePath('preview', import.meta.env.BASE_URL, currentPage.slug)
    : buildExamplePath('preview', import.meta.env.BASE_URL, slug);
  const frameSource = resolvePageFrameSource(currentPage?.frameData ?? '');
  const frameData =
    frameSource === 'saved' && currentPage?.frameData
      // Preview must mirror editor hydration so saved landing/product pages render with the same runtime upgrades as the editor.
      ? currentPage.slug === 'home'
        ? applyLandingLayoutToSerializedNodes(currentPage.frameData)
        : currentPage.slug === PRODUCT_PAGE_SLUG
        ? applyProductDataToSerializedNodes(currentPage.frameData)
        : currentPage.frameData
      : undefined;
  const pageFallback =
    currentPage?.slug === PRODUCT_PAGE_SLUG || frameSource === 'product'
      ? createProductDetailPage()
      : frameSource === 'landing'
      ? createDefaultLandingPage()
      : frameSource === 'detail'
        ? createCaseDetailPage()
        : createBlankContentPage();

  if (!siteDocument || !currentPage) {
    return (
      <div className="min-h-screen bg-renderer-gray">
        <div className="mx-auto flex min-h-screen max-w-[900px] flex-col px-4 py-6">
          <div className="mb-6 flex items-center justify-between rounded bg-[#d4d4d4] px-5 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Preview
              </p>
              <h1 className="text-base font-semibold text-slate-900">
                Page unavailable
              </h1>
            </div>
            <a
              className={cx(
                'rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90'
              )}
              href={editorHref}
            >
              Back To Editor
            </a>
          </div>

          <div className="rounded bg-white px-8 py-10 text-slate-700 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              Page does not exist or has not been saved yet
            </h2>
            <p className="text-sm leading-6">
              The requested preview route could not be resolved from the saved
              site document. Open the editor, save the page, and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-renderer-gray">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col px-4 py-6">
        <div className="mb-6 flex items-center justify-between rounded bg-[#d4d4d4] px-5 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Preview
            </p>
            <h1 className="text-base font-semibold text-slate-900">
              {currentPage.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              className={cx(
                'rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90'
              )}
              href={editorHref}
            >
              Back To Editor
            </a>
            <a
              className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500"
              href={previewHref}
            >
              Refresh Preview
            </a>
          </div>
        </div>

        <div className="flex flex-1 justify-center pb-8">
          <Editor resolver={editorResolver} enabled={false}>
            <Frame data={frameData}>{pageFallback}</Frame>
          </Editor>
        </div>
      </div>
    </div>
  );
};
