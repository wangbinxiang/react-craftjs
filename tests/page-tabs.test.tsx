import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
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
  it('renders only the page switcher tabs', () => {
    const html = renderToStaticMarkup(
      <PageTabs
        currentPageId="page-home"
        pages={pages}
        onSelectPage={() => {}}
      />
    );

    assert.match(html, /Home/);
    assert.match(html, /Product/);
    assert.doesNotMatch(html, />home</);
    assert.doesNotMatch(html, /Rename/);
    assert.doesNotMatch(html, /Move Left/);
    assert.doesNotMatch(html, /Move Right/);
    assert.doesNotMatch(html, /New Page/);
    assert.doesNotMatch(html, /New Detail Page/);
    assert.doesNotMatch(html, /Duplicate/);
    assert.doesNotMatch(html, /Delete/);
  });

  it('does not render any management controls for the fixed product tab', () => {
    const html = renderToStaticMarkup(
      <PageTabs
        currentPageId="page-product"
        pages={pages}
        onSelectPage={() => {}}
      />
    );

    assert.doesNotMatch(html, /Rename/);
    assert.doesNotMatch(html, /Move Left/);
    assert.doesNotMatch(html, /Move Right/);
    assert.doesNotMatch(html, />product</);
  });
});
