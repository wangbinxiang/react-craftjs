import { Editor, Frame, useEditor } from '@craftjs/core';
import React from 'react';

import { PageTabs, RenderNode, Viewport } from '../components/editor';
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
  SiteDocument,
  SitePage,
  buildExamplePath,
  createInitialSiteDocument,
  readSiteDocument,
  resolvePageFrameSource,
  shouldPersistPreviewFrame,
  writeSiteDocument,
} from '../utils/preview';

type SerializableQuery = {
  serialize: () => string;
};

type PreviewPersistenceGateProps = {
  onFinishEditing: () => void;
};

const getOrderedPages = (siteDocument: SiteDocument) =>
  // Page order remains canonical so legacy multi-page saves keep their persisted tab order.
  siteDocument.pageOrder
    .map((pageId) => siteDocument.pages.find((page) => page.id === pageId) ?? null)
    .filter((page): page is SitePage => page !== null);

const getCurrentPage = (siteDocument: SiteDocument) =>
  // Fall back to the first surviving page when persisted currentPageId is stale because of bad data or legacy saves.
  siteDocument.pages.find((page) => page.id === siteDocument.currentPageId) ??
  getOrderedPages(siteDocument)[0] ??
  null;

const PreviewPersistenceGate = ({
  onFinishEditing,
}: PreviewPersistenceGateProps) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const previousEnabledRef = React.useRef(enabled);

  React.useEffect(() => {
    if (
      shouldPersistPreviewFrame({
        previousEnabled: previousEnabledRef.current,
        nextEnabled: enabled,
      })
    ) {
      onFinishEditing();
    }

    previousEnabledRef.current = enabled;
  }, [enabled, onFinishEditing]);

  return null;
};

const createInitialDocument = () => {
  if (typeof window === 'undefined') {
    return createInitialSiteDocument();
  }

  return readSiteDocument(window.localStorage) ?? createInitialSiteDocument();
};

export const EditorPage = () => {
  const [siteDocument, setSiteDocument] = React.useState<SiteDocument>(
    createInitialDocument
  );
  const siteDocumentRef = React.useRef(siteDocument);
  const currentPageIdRef = React.useRef(siteDocument.currentPageId);
  const pendingFrameDataRef = React.useRef<Record<string, string>>({});

  const commitSiteDocument = React.useCallback(
    (nextSiteDocument: SiteDocument, persist = true) => {
      // Refs and React state must move together so preview, tab switching, and edit completion all read the same document.
      siteDocumentRef.current = nextSiteDocument;
      currentPageIdRef.current = nextSiteDocument.currentPageId;
      setSiteDocument(nextSiteDocument);

      if (persist && typeof window !== 'undefined') {
        writeSiteDocument(window.localStorage, nextSiteDocument);
      }

      return nextSiteDocument;
    },
    []
  );

  React.useEffect(() => {
    // Seed the new site-document key so preview works even before the first explicit save.
    commitSiteDocument(siteDocumentRef.current, true);
  }, [commitSiteDocument]);

  const commitPageDraft = React.useCallback(
    (pageId: string, persist = true) => {
      const pendingFrameData = pendingFrameDataRef.current[pageId];
      const currentDocument = siteDocumentRef.current;

      if (!pendingFrameData) {
        return currentDocument;
      }

      const page = currentDocument.pages.find((entry) => entry.id === pageId);

      if (!page || page.frameData === pendingFrameData) {
        delete pendingFrameDataRef.current[pageId];
        return currentDocument;
      }

      const nextTimestamp = new Date().toISOString();
      const nextSiteDocument = {
        ...currentDocument,
        // Persist only the edited page so switching tabs does not overwrite siblings with stale frame data.
        pages: currentDocument.pages.map((entry) =>
          entry.id === pageId
            ? {
                ...entry,
                frameData: pendingFrameData,
                updatedAt: nextTimestamp,
              }
            : entry
        ),
      };

      delete pendingFrameDataRef.current[pageId];

      return commitSiteDocument(nextSiteDocument, persist);
    },
    [commitSiteDocument]
  );

  const orderedPages = React.useMemo(() => getOrderedPages(siteDocument), [siteDocument]);
  const currentPage = React.useMemo(() => getCurrentPage(siteDocument), [siteDocument]);

  React.useEffect(() => {
    if (currentPage) {
      currentPageIdRef.current = currentPage.id;
    }
  }, [currentPage]);

  const previewHref = React.useMemo(() => {
    if (!currentPage) {
      return buildExamplePath('preview', import.meta.env.BASE_URL, 'home');
    }

    return buildExamplePath('preview', import.meta.env.BASE_URL, currentPage.slug);
  }, [currentPage]);

  const currentPageFrameSource = resolvePageFrameSource(currentPage?.frameData ?? '');
  const currentPageFrameData = React.useMemo(() => {
    if (currentPageFrameSource !== 'saved' || !currentPage?.frameData) {
      return undefined;
    }

    // Product pages keep editable layout, but product-bound fields always refresh from the shared data source.
    return currentPage.slug === PRODUCT_PAGE_SLUG
      ? applyProductDataToSerializedNodes(currentPage.frameData)
      : currentPage.frameData;
  }, [currentPage, currentPageFrameSource]);
  const currentPageFallback =
    currentPage?.slug === PRODUCT_PAGE_SLUG || currentPageFrameSource === 'product'
      ? createProductDetailPage()
      : currentPageFrameSource === 'landing'
      ? createDefaultLandingPage()
      : currentPageFrameSource === 'detail'
        ? createCaseDetailPage()
        : createBlankContentPage();

  const handleNodesChange = React.useCallback((query: SerializableQuery) => {
    if (typeof window === 'undefined') {
      return;
    }

    const currentPageId = currentPageIdRef.current;

    if (!currentPageId) {
      return;
    }

    // Track the freshest serialized node tree for the active page without re-rendering on every drag.
    pendingFrameDataRef.current[currentPageId] = query.serialize();
  }, []);

  const handleOpenPreview = React.useCallback(() => {
    commitPageDraft(currentPageIdRef.current, true);
  }, [commitPageDraft]);

  const handleSelectPage = React.useCallback(
    (pageId: string) => {
      // Flush the active draft before switching tabs so saved previews stay aligned with what the user just edited.
      const currentDocument = commitPageDraft(currentPageIdRef.current, true);

      if (currentDocument.currentPageId === pageId) {
        return;
      }

      commitSiteDocument(
        {
          ...currentDocument,
          currentPageId: pageId,
        },
        true
      );
    },
    [commitPageDraft, commitSiteDocument]
  );

  if (!currentPage) {
    return null;
  }

  return (
    <div className="h-full h-screen">
      <Editor
        key={currentPage.id}
        resolver={editorResolver}
        enabled={false}
        onRender={RenderNode}
        onNodesChange={handleNodesChange}
      >
        <PreviewPersistenceGate
          onFinishEditing={() => commitPageDraft(currentPageIdRef.current, true)}
        />
        <Viewport
          pageManager={
            <PageTabs
              currentPageId={currentPage.id}
              pages={orderedPages}
              onSelectPage={handleSelectPage}
            />
          }
          previewHref={previewHref}
          onOpenPreview={handleOpenPreview}
        >
          <Frame data={currentPageFrameData}>
            {currentPageFallback}
          </Frame>
        </Viewport>
      </Editor>
    </div>
  );
};
