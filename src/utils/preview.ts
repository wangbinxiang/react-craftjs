export const LEGACY_PREVIEW_STORAGE_KEY = 'craftjs:preview-content';
export const SITE_STORAGE_KEY = 'craftjs:site-document';
export const SITE_DOCUMENT_VERSION = 1;
export const DEFAULT_LANDING_PAGE_DATA = '__CRAFTJS_LANDING_PAGE__';
export const DEFAULT_CASE_DETAIL_PAGE_DATA = '__CRAFTJS_CASE_DETAIL_PAGE__';
export const DEFAULT_PRODUCT_PAGE_DATA = '__CRAFTJS_PRODUCT_PAGE__';
export const PRODUCT_PAGE_TITLE = 'Product';
export const PRODUCT_PAGE_SLUG = 'product';

export type ExampleRoute = 'editor' | 'preview';
export type ExampleRouteMatch = { kind: 'editor' } | { kind: 'preview'; slug: string };
export type PreviewPersistenceTransition = {
  previousEnabled: boolean;
  nextEnabled: boolean;
};
export type PageFrameSource = 'landing' | 'detail' | 'product' | 'blank' | 'saved';
export type SitePage = {
  id: string;
  title: string;
  slug: string;
  frameData: string;
  createdAt: string;
  updatedAt: string;
};
export type SiteDocument = {
  version: number;
  pages: SitePage[];
  pageOrder: string[];
  currentPageId: string;
};

type StorageReader = Pick<Storage, 'getItem'> | null | undefined;
type StorageWriter = Pick<Storage, 'setItem'> | null | undefined;

const PREVIEW_SEGMENT = 'preview';
const EDITOR_SEGMENT = 'editor';
const DEFAULT_PAGE_TITLE = 'Home';
const DEFAULT_PAGE_SLUG = 'home';

const isSerializedNodeRecord = (
  value: unknown
): value is Record<string, Record<string, unknown>> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const entries = Object.values(value);

  if (entries.length === 0) {
    return false;
  }

  return entries.every((entry) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      return false;
    }

    return (
      'type' in entry &&
      'props' in entry &&
      'nodes' in entry &&
      'linkedNodes' in entry
    );
  });
};

const isSitePage = (value: unknown): value is SitePage => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.slug === 'string' &&
    typeof candidate.frameData === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
};

const isSiteDocument = (value: unknown): value is SiteDocument => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.version !== 'number' ||
    typeof candidate.currentPageId !== 'string' ||
    !Array.isArray(candidate.pages) ||
    !Array.isArray(candidate.pageOrder)
  ) {
    return false;
  }

  if (candidate.pages.length === 0 || !candidate.pages.every(isSitePage)) {
    return false;
  }

  if (!candidate.pageOrder.every((pageId) => typeof pageId === 'string')) {
    return false;
  }

  const pageIds = new Set(candidate.pages.map((page) => page.id));

  return (
    pageIds.has(candidate.currentPageId) &&
    candidate.pageOrder.length === candidate.pages.length &&
    candidate.pageOrder.every((pageId) => pageIds.has(pageId))
  );
};

const normalizeBaseUrl = (baseUrl: string) => {
  if (!baseUrl || baseUrl === '/') {
    return '/';
  }

  const withLeadingSlash = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  return withLeadingSlash.endsWith('/')
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
};

const getBasePath = (baseUrl: string) => normalizePathname(normalizeBaseUrl(baseUrl));

const createPageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `page-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const createTimestamp = () => new Date().toISOString();

const parseSiteDocument = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value);
    return isSiteDocument(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

const parseLegacyFrameData = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(value);
    return isSerializedNodeRecord(parsedValue) ? value : null;
  } catch {
    return null;
  }
};

const createMigratedHomePage = (frameData: string): SitePage => {
  const timestamp = createTimestamp();

  return {
    id: createPageId(),
    title: DEFAULT_PAGE_TITLE,
    slug: DEFAULT_PAGE_SLUG,
    frameData,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const createProductPage = (): SitePage => {
  const timestamp = createTimestamp();

  return {
    id: createPageId(),
    title: PRODUCT_PAGE_TITLE,
    slug: PRODUCT_PAGE_SLUG,
    frameData: DEFAULT_PRODUCT_PAGE_DATA,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const ensureFixedProductPage = (siteDocument: SiteDocument): SiteDocument => {
  // Product is a permanent editor tab, so every hydrated document must contain exactly one canonical product page.
  const existingProductPage = siteDocument.pages.find(
    (page) => page.slug === PRODUCT_PAGE_SLUG
  );

  if (existingProductPage) {
    if (existingProductPage.title === PRODUCT_PAGE_TITLE) {
      return siteDocument;
    }

    return {
      ...siteDocument,
      pages: siteDocument.pages.map((page) =>
        page.slug === PRODUCT_PAGE_SLUG
          ? {
            ...page,
            title: PRODUCT_PAGE_TITLE,
          }
          : page
      ),
    };
  }

  const productPage = createProductPage();

  return {
    ...siteDocument,
    pages: [...siteDocument.pages, productPage],
    pageOrder: [...siteDocument.pageOrder, productPage.id],
  };
};

export const createInitialSiteDocument = (): SiteDocument => {
  const timestamp = createTimestamp();
  const homePage: SitePage = {
    id: createPageId(),
    title: DEFAULT_PAGE_TITLE,
    slug: DEFAULT_PAGE_SLUG,
    // Persist a landing sentinel so preview reloads know which fallback tree to mount.
    frameData: DEFAULT_LANDING_PAGE_DATA,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const productPage: SitePage = {
    id: createPageId(),
    title: PRODUCT_PAGE_TITLE,
    slug: PRODUCT_PAGE_SLUG,
    frameData: DEFAULT_PRODUCT_PAGE_DATA,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return {
    version: SITE_DOCUMENT_VERSION,
    currentPageId: homePage.id,
    pageOrder: [homePage.id, productPage.id],
    pages: [homePage, productPage],
  };
};

export const buildExamplePath = (
  route: ExampleRoute,
  baseUrl: string,
  slug?: string
): string => {
  const basePath = getBasePath(baseUrl);

  if (route === 'editor') {
    return basePath === '/' ? '/' : `${basePath}/${EDITOR_SEGMENT}`;
  }

  const previewBase = basePath === '/' ? `/${PREVIEW_SEGMENT}` : `${basePath}/${PREVIEW_SEGMENT}`;

  return slug ? `${previewBase}/${slug}` : previewBase;
};

export const resolveExampleRoute = (
  pathname: string,
  baseUrl: string
): ExampleRouteMatch => {
  const normalizedPathname = normalizePathname(pathname);
  const basePath = getBasePath(baseUrl);
  const previewBase =
    basePath === '/' ? `/${PREVIEW_SEGMENT}` : `${basePath}/${PREVIEW_SEGMENT}`;
  const editorPath =
    basePath === '/' ? `/${EDITOR_SEGMENT}` : `${basePath}/${EDITOR_SEGMENT}`;

  if (
    normalizedPathname === '/' ||
    normalizedPathname === basePath ||
    normalizedPathname === editorPath
  ) {
    return { kind: 'editor' };
  }

  if (normalizedPathname.startsWith(`${previewBase}/`)) {
    const slug = normalizedPathname.slice(previewBase.length + 1);

    // Preview routes must address exactly one logical site page.
    if (slug && !slug.includes('/')) {
      return { kind: 'preview', slug };
    }
  }

  return { kind: 'editor' };
};

export const generateUniqueSlug = (title: string, existingSlugs: string[]) => {
  const baseSlug =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'page';

  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;

  while (existingSlugs.includes(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
};

export const getPageBySlug = (
  siteDocument: SiteDocument | null | undefined,
  slug: string
) => siteDocument?.pages.find((page) => page.slug === slug) ?? null;

export const resolvePageFrameSource = (frameData: string): PageFrameSource => {
  if (frameData === DEFAULT_LANDING_PAGE_DATA) {
    return 'landing';
  }

  if (frameData === DEFAULT_CASE_DETAIL_PAGE_DATA) {
    return 'detail';
  }

  if (frameData === DEFAULT_PRODUCT_PAGE_DATA) {
    return 'product';
  }

  if (!frameData) {
    return 'blank';
  }

  return 'saved';
};

export const readSiteDocument = (
  storage: StorageReader,
  storageKey = SITE_STORAGE_KEY
) => {
  const savedDocument = parseSiteDocument(storage?.getItem(storageKey) ?? null);

  if (savedDocument) {
    // Keep existing multi-page documents intact even though the editor no longer exposes page creation.
    return ensureFixedProductPage(savedDocument);
  }

  const legacyFrameData = parseLegacyFrameData(
    storage?.getItem(LEGACY_PREVIEW_STORAGE_KEY) ?? null
  );

  if (!legacyFrameData) {
    return null;
  }

  const homePage = createMigratedHomePage(legacyFrameData);

  // Legacy single-page saves become a minimal multi-page document on first read.
  return ensureFixedProductPage({
    version: SITE_DOCUMENT_VERSION,
    currentPageId: homePage.id,
    pageOrder: [homePage.id],
    pages: [homePage],
  });
};

export const writeSiteDocument = (
  storage: StorageWriter,
  siteDocument: SiteDocument,
  storageKey = SITE_STORAGE_KEY
) => {
  try {
    console.log('siteDocument:', siteDocument);
    storage?.setItem(storageKey, JSON.stringify(siteDocument));
  } catch {
    // Ignore quota or privacy-mode failures so editing still works without persistence.
  }
};

export const shouldPersistPreviewFrame = ({
  previousEnabled,
  nextEnabled,
}: PreviewPersistenceTransition) =>
  // Only publish the draft snapshot once the user leaves the live editing mode.
  previousEnabled && !nextEnabled;
