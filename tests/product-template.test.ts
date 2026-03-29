import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

describe('product template wiring', () => {
  it('uses the ProductCta selector in the product template and resolver', () => {
    const editorConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../src/lib/editor-config.tsx'),
      'utf8'
    );
    const selectorExportSource = fs.readFileSync(
      path.resolve(__dirname, '../src/components/selectors/index.ts'),
      'utf8'
    );

    expect(editorConfigSource).toContain('ProductCta');
    expect(editorConfigSource).toContain('Product Detail pages keep a dedicated CTA');
    expect(selectorExportSource).toContain("export * from './ProductCta';");
  });

  it('includes the upgraded product hero support structure and asymmetric merchandising hooks', () => {
    const editorConfigSource = fs.readFileSync(
      path.resolve(__dirname, '../src/lib/editor-config.tsx'),
      'utf8'
    );
    const appStylesSource = fs.readFileSync(
      path.resolve(__dirname, '../src/styles/app.css'),
      'utf8'
    );

    expect(editorConfigSource).toContain('product-hero-support');
    expect(editorConfigSource).toContain('product-trust-strip');
    expect(editorConfigSource).toContain('product-trust-item');
    expect(editorConfigSource).toContain('product-copy-meta');
    expect(editorConfigSource).toContain('product-media-frame');
    expect(editorConfigSource).toContain('product-section-intro');

    expect(appStylesSource).toContain('.product-highlight-card:first-child');
    expect(appStylesSource).toContain('.product-hero-support');
    expect(appStylesSource).toContain('.product-trust-strip');
    expect(appStylesSource).toContain('.product-copy-meta');
    expect(appStylesSource).toContain('.product-media-frame');
    expect(appStylesSource).toContain('.product-section-intro');
  });
});
