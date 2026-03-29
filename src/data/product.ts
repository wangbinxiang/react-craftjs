export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDetail = {
  name: string;
  tagline: string;
  price: string;
  heroImage: string;
  highlights: string[];
  specs: ProductSpec[];
  ctaLabel: string;
  ctaHref: string;
};

type ProductField =
  | 'name'
  | 'tagline'
  | 'price'
  | 'heroImage'
  | 'highlight'
  | 'specLabel'
  | 'specValue'
  | 'ctaLabel';

type SerializedNodeLike = {
  type?: {
    resolvedName?: string;
  };
  displayName?: string;
  props?: Record<string, unknown>;
};

type SerializedNodesLike = Record<string, SerializedNodeLike>;

const productHeroSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 720" fill="none">
    <rect width="960" height="720" rx="48" fill="#F3EDE4"/>
    <rect x="64" y="72" width="832" height="576" rx="40" fill="#FFF9F0"/>
    <rect x="112" y="124" width="736" height="472" rx="32" fill="#1E293B"/>
    <circle cx="248" cy="252" r="118" fill="#F59E0B"/>
    <circle cx="692" cy="212" r="84" fill="#38BDF8" fill-opacity="0.92"/>
    <rect x="208" y="388" width="544" height="28" rx="14" fill="#E2E8F0"/>
    <rect x="208" y="436" width="404" height="20" rx="10" fill="#94A3B8"/>
    <rect x="208" y="486" width="320" height="20" rx="10" fill="#94A3B8"/>
    <rect x="646" y="420" width="106" height="106" rx="28" fill="#0F172A"/>
    <path d="M688 446l24 27-24 27" stroke="#F8FAFC" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`)}`;

// The detail page is intentionally fed by a single in-repo variable so the route stays independent from Craft persistence.
export const productDetail: ProductDetail = {
  name: 'Craft Board Pro123',
  tagline:
    'A tactile planning surface for teams that want product detail pages to feel as considered as the products they launch.',
  price: '$2491',
  heroImage: productHeroSvg,
  highlights: [
    'Pressure-tuned drawing surface with low-latency pen response.',
    'Modular workspace rails for notes, sketches, and roadmap slices.',
    'One-tap export presets for product reviews, demos, and launch decks.',
  ],
  specs: [
    { label: 'Finish', value: 'Sandstone Alloy' },
    { label: 'Battery', value: '18 hours active sketching' },
    { label: 'Connectivity', value: 'Wi-Fi 6E + Bluetooth 5.4' },
    { label: 'Weight', value: '1.2 kg' },
  ],
  ctaLabel: 'Buy Craft Board Pro',
  ctaHref: 'https://craft.js.org',
};

const isSerializedNodesLike = (value: unknown): value is SerializedNodesLike => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every((entry) => {
    if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
      return false;
    }

    return 'props' in entry;
  });
};

const resolveBoundText = (
  field: ProductField,
  detail: ProductDetail,
  index?: number
) => {
  switch (field) {
    case 'name':
      return detail.name;
    case 'tagline':
      return detail.tagline;
    case 'price':
      return detail.price;
    case 'highlight':
      return typeof index === 'number' ? detail.highlights[index] : undefined;
    case 'specLabel':
      return typeof index === 'number' ? detail.specs[index]?.label : undefined;
    case 'specValue':
      return typeof index === 'number' ? detail.specs[index]?.value : undefined;
    case 'ctaLabel':
      return detail.ctaLabel;
    default:
      return undefined;
  }
};

export const applyProductDataToSerializedNodes = (
  frameData: string,
  detail: ProductDetail = productDetail
) => {
  try {
    const parsedValue = JSON.parse(frameData) as unknown;

    if (!isSerializedNodesLike(parsedValue)) {
      return frameData;
    }

    // Product pages stay layout-editable, but these marked props are always refreshed from the canonical data source.
    Object.values(parsedValue).forEach((node) => {
      const props = node.props;

      if (!props) {
        return;
      }

      const field = props.productField;
      const index = typeof props.productIndex === 'number' ? props.productIndex : undefined;

      if (field === 'heroImage') {
        props.src = detail.heroImage;
        return;
      }

      if (field === 'ctaLabel') {
        // Legacy product saves still deserialize the old Button node, so upgrade only the bound CTA in place.
        if (node.type?.resolvedName === 'Button') {
          node.type = { resolvedName: 'ProductCta' };
          node.displayName = 'ProductCta';
        }

        props.text = detail.ctaLabel;
        props.href = detail.ctaHref;
        return;
      }

      if (typeof field !== 'string') {
        return;
      }

      const nextText = resolveBoundText(field as ProductField, detail, index);

      if (typeof nextText === 'string') {
        props.text = nextText;
      }
    });

    return JSON.stringify(parsedValue);
  } catch {
    return frameData;
  }
};
