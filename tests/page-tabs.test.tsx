import React from 'react';
import { MessageChannel } from 'worker_threads';

import { PageTabs } from '../src/components/editor/Viewport/PageTabs';
import { SitePage } from '../src/utils/preview';

const globalWithMessageChannel = globalThis as typeof globalThis & {
  MessageChannel?: typeof MessageChannel;
};

if (!globalWithMessageChannel.MessageChannel) {
  (globalWithMessageChannel as { MessageChannel?: unknown }).MessageChannel =
    MessageChannel;
}

const { renderToStaticMarkup } = require('react-dom/server.node');

const pages: SitePage[] = [
  {
    id: 'page-home',
    title: 'Home',
    slug: 'home',
    frameData: '',
    createdAt: '2026-03-28T00:00:00.000Z',
    updatedAt: '2026-03-28T00:00:00.000Z',
  },
  {
    id: 'page-product',
    title: 'Product',
    slug: 'product',
    frameData: '',
    createdAt: '2026-03-28T00:00:00.000Z',
    updatedAt: '2026-03-28T00:00:00.000Z',
  },
];

describe('PageTabs', () => {
  it('renders only existing-page management controls', () => {
    const html = renderToStaticMarkup(
      <PageTabs
        currentPageId="page-home"
        pages={pages}
        onMovePage={() => {}}
        onRenamePage={() => {}}
        onSelectPage={() => {}}
      />
    );

    expect(html).toContain('Home');
    expect(html).toContain('Product');
    expect(html).toContain('Rename');
    expect(html).toContain('Move Left');
    expect(html).toContain('Move Right');
    expect(html).not.toContain('New Page');
    expect(html).not.toContain('New Detail Page');
    expect(html).not.toContain('Duplicate');
    expect(html).not.toContain('Delete');
  });

  it('does not render rename controls for the fixed product tab', () => {
    const html = renderToStaticMarkup(
      <PageTabs
        currentPageId="page-product"
        pages={pages}
        onMovePage={() => {}}
        onRenamePage={() => {}}
        onSelectPage={() => {}}
      />
    );

    expect(html).not.toContain('Rename');
    expect(html).toContain('Move Left');
  });
});
