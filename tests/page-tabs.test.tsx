import React from 'react';
import { MessageChannel } from 'worker_threads';
import { describe, expect, it } from 'vitest';

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
  it('renders only the page switcher tabs', () => {
    const html = renderToStaticMarkup(
      <PageTabs
        currentPageId="page-home"
        pages={pages}
        onSelectPage={() => {}}
      />
    );

    expect(html).toMatch(/Home/);
    expect(html).toMatch(/Product/);
    expect(html).not.toMatch(/>home</);
    expect(html).not.toMatch(/Rename/);
    expect(html).not.toMatch(/Move Left/);
    expect(html).not.toMatch(/Move Right/);
    expect(html).not.toMatch(/New Page/);
    expect(html).not.toMatch(/New Detail Page/);
    expect(html).not.toMatch(/Duplicate/);
    expect(html).not.toMatch(/Delete/);
  });

  it('does not render any management controls for the fixed product tab', () => {
    const html = renderToStaticMarkup(
      <PageTabs
        currentPageId="page-product"
        pages={pages}
        onSelectPage={() => {}}
      />
    );

    expect(html).not.toMatch(/Rename/);
    expect(html).not.toMatch(/Move Left/);
    expect(html).not.toMatch(/Move Right/);
    expect(html).not.toMatch(/>product</);
  });
});
