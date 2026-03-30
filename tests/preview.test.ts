import { describe, expect, it } from 'vitest';

import {
  DEFAULT_CASE_DETAIL_PAGE_DATA,
  DEFAULT_LANDING_PAGE_DATA,
  DEFAULT_PRODUCT_PAGE_DATA,
  LEGACY_PREVIEW_STORAGE_KEY,
  PRODUCT_PAGE_SLUG,
  PRODUCT_PAGE_TITLE,
  buildExamplePath,
  createInitialSiteDocument,
  generateUniqueSlug,
  getPageBySlug,
  readSiteDocument,
  resolveExampleRoute,
  resolvePageFrameSource,
  writeSiteDocument,
} from '../src/utils/preview';

import { SITE_STORAGE_KEY } from '../src/utils/siteDocument';

const serializedFrameData =
  '{"ROOT":{"type":"div","props":{},"nodes":[],"linkedNodes":{},"isCanvas":true}}';

describe('preview helpers', () => {
  it('keeps editor routes on the example base path', () => {
    expect(buildExamplePath('editor', '/')).toBe('/');
    expect(buildExamplePath('editor', '/examples/react/')).toBe(
      '/examples/react/editor'
    );
  });

  it('nests preview routes under the current example base path', () => {
    expect(buildExamplePath('preview', '/', 'home')).toBe('/preview/home');
    expect(buildExamplePath('preview', '/examples/react/', 'about-us')).toBe(
      '/examples/react/preview/about-us'
    );
  });

  it('parses editor and preview routes with slugs', () => {
    expect(resolveExampleRoute('/', '/')).toEqual({ kind: 'editor' });
    expect(resolveExampleRoute('/editor', '/')).toEqual({ kind: 'editor' });
    expect(resolveExampleRoute('/preview/home', '/')).toEqual({
      kind: 'preview',
      slug: 'home',
    });
    expect(
      resolveExampleRoute('/examples/react/preview/about', '/examples/react/')
    ).toEqual({
      kind: 'preview',
      slug: 'about',
    });
  });

  it('treats malformed preview paths as editor routes', () => {
    expect(resolveExampleRoute('/preview', '/')).toEqual({ kind: 'editor' });
    expect(resolveExampleRoute('/preview/home/extra', '/')).toEqual({
      kind: 'editor',
    });
    expect(resolveExampleRoute('/product', '/')).toEqual({
      kind: 'editor',
    });
    expect(
      resolveExampleRoute('/examples/react/preview', '/examples/react/')
    ).toEqual({ kind: 'editor' });
  });

  it('slugifies titles and appends a numeric suffix for collisions', () => {
    expect(generateUniqueSlug(' About Us ', [])).toBe('about-us');
    expect(generateUniqueSlug('About Us', ['about-us'])).toBe('about-us-2');
    expect(
      generateUniqueSlug('About Us', ['about-us', 'about-us-2'])
    ).toBe('about-us-3');
  });

  it('seeds a home page and a fixed product page', () => {
    const siteDocument = createInitialSiteDocument();

    expect(siteDocument.pages).toHaveLength(2);
    expect(siteDocument.pageOrder).toHaveLength(2);
    expect(siteDocument.pages[0].title).toBe('Home');
    expect(siteDocument.pages[0].slug).toBe('home');
    expect(siteDocument.pages[0].frameData).toBe(DEFAULT_LANDING_PAGE_DATA);
    expect(siteDocument.pages[1].title).toBe(PRODUCT_PAGE_TITLE);
    expect(siteDocument.pages[1].slug).toBe(PRODUCT_PAGE_SLUG);
    expect(siteDocument.pages[1].frameData).toBe(DEFAULT_PRODUCT_PAGE_DATA);
    expect(siteDocument.currentPageId).toBe(siteDocument.pages[0].id);
  });

  it('distinguishes landing, detail, blank, and saved frames', () => {
    expect(resolvePageFrameSource(DEFAULT_LANDING_PAGE_DATA)).toBe('landing');
    expect(resolvePageFrameSource(DEFAULT_CASE_DETAIL_PAGE_DATA)).toBe('detail');
    expect(resolvePageFrameSource('')).toBe('blank');
    expect(resolvePageFrameSource(serializedFrameData)).toBe('saved');
  });

  it('does not export draft-creation helpers anymore', async () => {
    const previewModule = await import('../src/utils/preview');

    expect('createPageDraft' in previewModule).toBe(false);
    expect('createCaseDetailPageDraft' in previewModule).toBe(false);
    expect('duplicatePageDraft' in previewModule).toBe(false);
  });

  it('returns a saved site document when storage contains valid page data', () => {
    const siteDocument = {
      version: 1,
      currentPageId: 'page-home',
      pageOrder: ['page-home', 'page-product'],
      pages: [
        {
          id: 'page-home',
          title: 'Home',
          slug: 'home',
          frameData: serializedFrameData,
          createdAt: '2026-03-28T00:00:00.000Z',
          updatedAt: '2026-03-28T00:00:00.000Z',
        },
        {
          id: 'page-product',
          title: PRODUCT_PAGE_TITLE,
          slug: PRODUCT_PAGE_SLUG,
          frameData: DEFAULT_PRODUCT_PAGE_DATA,
          createdAt: '2026-03-28T00:00:00.000Z',
          updatedAt: '2026-03-28T00:00:00.000Z',
        },
      ],
    };
    const storage = {
      getItem(key: string) {
        return key === SITE_STORAGE_KEY ? JSON.stringify(siteDocument) : null;
      },
    };

    expect(readSiteDocument(storage)).toEqual(siteDocument);
  });

  it('supplements a fixed product page when saved data is missing it', () => {
    const siteDocument = {
      version: 1,
      currentPageId: 'page-home',
      pageOrder: ['page-home'],
      pages: [
        {
          id: 'page-home',
          title: 'Home',
          slug: 'home',
          frameData: serializedFrameData,
          createdAt: '2026-03-28T00:00:00.000Z',
          updatedAt: '2026-03-28T00:00:00.000Z',
        },
      ],
    };
    const storage = {
      getItem(key: string) {
        return key === SITE_STORAGE_KEY ? JSON.stringify(siteDocument) : null;
      },
    };
    const hydrated = readSiteDocument(storage);

    expect(hydrated?.pages).toHaveLength(2);
    expect(hydrated?.pageOrder).toContain('page-home');
    expect(hydrated?.pages[1].slug).toBe(PRODUCT_PAGE_SLUG);
    expect(hydrated?.pages[1].frameData).toBe(DEFAULT_PRODUCT_PAGE_DATA);
  });

  it('migrates the legacy single-page preview payload into a home page document', () => {
    const storage = {
      getItem(key: string) {
        if (key === SITE_STORAGE_KEY) {
          return null;
        }

        return key === LEGACY_PREVIEW_STORAGE_KEY ? serializedFrameData : null;
      },
    };
    const migrated = readSiteDocument(storage);

    expect(migrated?.pages).toHaveLength(2);
    expect(migrated?.pages[0].slug).toBe('home');
    expect(migrated?.pages[0].frameData).toBe(serializedFrameData);
    expect(migrated?.pages[1].slug).toBe(PRODUCT_PAGE_SLUG);
    expect(migrated?.pages[1].frameData).toBe(DEFAULT_PRODUCT_PAGE_DATA);
    expect(migrated?.currentPageId).toBe(migrated?.pages[0].id);
  });

  it('falls back when storage is missing, invalid, or malformed', () => {
    expect(readSiteDocument({ getItem: () => null })).toBeNull();
    expect(readSiteDocument({ getItem: () => 'not-json' })).toBeNull();
    expect(readSiteDocument({ getItem: () => '3' })).toBeNull();
    expect(
      readSiteDocument({
        getItem: () =>
          '{"version":1,"currentPageId":"page-home","pageOrder":[],"pages":[]}',
      })
    ).toBeNull();
  });

  it('stores the serialized site document under the site storage key', () => {
    let keyUsed = '';
    let valueUsed = '';

    writeSiteDocument(
      {
        setItem(key: string, value: string) {
          keyUsed = key;
          valueUsed = value;
        },
      },
      {
        version: 1,
        currentPageId: 'page-home',
        pageOrder: ['page-home'],
        pages: [
          {
            id: 'page-home',
            title: 'Home',
            slug: 'home',
            frameData: serializedFrameData,
            createdAt: '2026-03-28T00:00:00.000Z',
            updatedAt: '2026-03-28T00:00:00.000Z',
          },
        ],
      }
    );

    expect(keyUsed).toBe(SITE_STORAGE_KEY);
    expect(JSON.parse(valueUsed).pages[0].slug).toBe('home');
  });

  it('returns the matching page and skips unknown slugs', () => {
    const siteDocument = {
      version: 1,
      currentPageId: 'page-home',
      pageOrder: ['page-home', 'page-about'],
      pages: [
        {
          id: 'page-home',
          title: 'Home',
          slug: 'home',
          frameData: serializedFrameData,
          createdAt: '2026-03-28T00:00:00.000Z',
          updatedAt: '2026-03-28T00:00:00.000Z',
        },
        {
          id: 'page-about',
          title: 'About',
          slug: 'about',
          frameData: '',
          createdAt: '2026-03-28T00:00:00.000Z',
          updatedAt: '2026-03-28T00:00:00.000Z',
        },
      ],
    };

    expect(getPageBySlug(siteDocument, 'about')?.id).toBe('page-about');
    expect(getPageBySlug(siteDocument, 'missing')).toBeNull();
  });
});
