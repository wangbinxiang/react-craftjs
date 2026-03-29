import { describe, expect, it } from 'vitest';

import { applyLandingLayoutToSerializedNodes } from '../src/data/landing';

const legacyLandingNodes = JSON.stringify({
  ROOT: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: { width: '800px', className: '' },
    custom: { displayName: 'App' },
    displayName: 'Container',
    parent: null,
    linkedNodes: {},
    nodes: ['intro', 'feature', 'programmatic'],
    hidden: false,
  },
  intro: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Introduction' },
    displayName: 'Container',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: ['intro-heading', 'intro-description'],
    hidden: false,
  },
  'intro-heading': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Heading' },
    displayName: 'Container',
    parent: 'intro',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  'intro-description': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Description' },
    displayName: 'Container',
    parent: 'intro',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  feature: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'ComplexSection' },
    displayName: 'Container',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: ['feature-wrapper'],
    hidden: false,
  },
  'feature-wrapper': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Wrapper' },
    displayName: 'Container',
    parent: 'feature',
    linkedNodes: {},
    nodes: ['square', 'feature-content'],
    hidden: false,
  },
  square: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: { width: '350px' },
    custom: { displayName: 'Square' },
    displayName: 'Container',
    parent: 'feature-wrapper',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  'feature-content': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Content' },
    displayName: 'Container',
    parent: 'feature-wrapper',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  programmatic: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Programmatic' },
    displayName: 'Container',
    parent: 'ROOT',
    linkedNodes: {},
    nodes: ['programmatic-heading', 'programmatic-content'],
    hidden: false,
  },
  'programmatic-heading': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Heading' },
    displayName: 'Container',
    parent: 'programmatic',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  'programmatic-content': {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Content' },
    displayName: 'Container',
    parent: 'programmatic',
    linkedNodes: {},
    nodes: ['left', 'right'],
    hidden: false,
  },
  left: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Left' },
    displayName: 'Container',
    parent: 'programmatic-content',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
  right: {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: {},
    custom: { displayName: 'Right' },
    displayName: 'Container',
    parent: 'programmatic-content',
    linkedNodes: {},
    nodes: [],
    hidden: false,
  },
});

describe('landing layout hydration', () => {
  it('retrofits the legacy landing tree with the viewport-responsive class contract', () => {
    const hydrated = JSON.parse(
      applyLandingLayoutToSerializedNodes(legacyLandingNodes)
    );

    expect(hydrated.ROOT.props.width).toBe('100%');
    expect(hydrated.ROOT.props.className).toContain('landing-page-root');
    expect(hydrated.intro.props.className).toContain('landing-two-column');
    expect(hydrated.square.props.className).toContain('landing-square');
    expect(hydrated['programmatic-content'].props.className).toContain(
      'landing-programmatic-grid'
    );
  });

  it('leaves non-landing serialized trees untouched', () => {
    const nonLandingNodes = JSON.stringify({
      ROOT: {
        type: { resolvedName: 'Container' },
        isCanvas: true,
        props: { width: '640px' },
        custom: { displayName: 'Page' },
        displayName: 'Container',
        parent: null,
        linkedNodes: {},
        nodes: [],
        hidden: false,
      },
    });

    expect(applyLandingLayoutToSerializedNodes(nonLandingNodes)).toBe(
      nonLandingNodes
    );
  });
});
