import { describe, expect, it } from 'vitest';

import { applyProductDataToSerializedNodes, productDetail } from '../src/data/product';

const serializedNodes = JSON.stringify({
  ROOT: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: {},
    displayName: 'Container',
    parent: null,
    linkedNodes: {},
    nodes: ['name', 'price', 'image', 'cta', 'spec-label', 'spec-value', 'extra'],
    hidden: false,
  },
  name: {
    type: { resolvedName: 'Text' },
    isCanvas: false,
    props: { text: 'Old name', productField: 'name' },
    custom: {},
    displayName: 'Text',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  price: {
    type: { resolvedName: 'Text' },
    isCanvas: false,
    props: { text: '$0', productField: 'price' },
    custom: {},
    displayName: 'Text',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  image: {
    type: { resolvedName: 'Image' },
    isCanvas: false,
    props: { src: '', alt: '', productField: 'heroImage' },
    custom: {},
    displayName: 'Image',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  cta: {
    type: { resolvedName: 'Button' },
    isCanvas: false,
    props: {
      text: 'Old CTA',
      href: '#',
      productField: 'ctaLabel',
    },
    custom: {},
    displayName: 'Button',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  'spec-label': {
    type: { resolvedName: 'Text' },
    isCanvas: false,
    props: { text: 'Label', productField: 'specLabel', productIndex: 0 },
    custom: {},
    displayName: 'Text',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  'spec-value': {
    type: { resolvedName: 'Text' },
    isCanvas: false,
    props: { text: 'Value', productField: 'specValue', productIndex: 0 },
    custom: {},
    displayName: 'Text',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  extra: {
    type: { resolvedName: 'Text' },
    isCanvas: false,
    props: { text: 'Keep me' },
    custom: {},
    displayName: 'Text',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
});

describe('product data bindings', () => {
  it('overrides only product-bound fields from the product data source', () => {
    const hydrated = JSON.parse(applyProductDataToSerializedNodes(serializedNodes));

    expect(hydrated.name.props.text).toBe(productDetail.name);
    expect(hydrated.price.props.text).toBe(productDetail.price);
    expect(hydrated.image.props.src).toBe(productDetail.heroImage);
    expect(hydrated.cta.props.text).toBe(productDetail.ctaLabel);
    expect(hydrated.cta.props.href).toBe(productDetail.ctaHref);
    expect(hydrated['spec-label'].props.text).toBe(productDetail.specs[0].label);
    expect(hydrated['spec-value'].props.text).toBe(productDetail.specs[0].value);
    expect(hydrated.extra.props.text).toBe('Keep me');
  });

  it('upgrades the legacy product CTA node to ProductCta while keeping product bindings live', () => {
    const legacySerializedNodes = JSON.stringify({
      ROOT: {
        type: { resolvedName: 'Container' },
        isCanvas: true,
        props: {},
        custom: {},
        displayName: 'Container',
        parent: null,
        linkedNodes: {},
        nodes: ['cta', 'secondary'],
        hidden: false,
      },
      cta: {
        type: { resolvedName: 'Button' },
        isCanvas: false,
        props: {
          text: 'Old CTA',
          href: '#',
          productField: 'ctaLabel',
        },
        custom: {},
        displayName: 'Button',
        parent: 'ROOT',
        linkedNodes: {},
        nodes: [],
        hidden: false,
      },
      secondary: {
        type: { resolvedName: 'Button' },
        isCanvas: false,
        props: {
          text: 'Leave me alone',
          href: '/docs',
        },
        custom: {},
        displayName: 'Button',
        parent: 'ROOT',
        linkedNodes: {},
        nodes: [],
        hidden: false,
      },
    });

    const hydrated = JSON.parse(
      applyProductDataToSerializedNodes(legacySerializedNodes)
    );

    expect(hydrated.cta.type.resolvedName).toBe('ProductCta');
    expect(hydrated.cta.displayName).toBe('ProductCta');
    expect(hydrated.cta.props.text).toBe(productDetail.ctaLabel);
    expect(hydrated.cta.props.href).toBe(productDetail.ctaHref);
    expect(hydrated.secondary.type.resolvedName).toBe('Button');
  });
});
