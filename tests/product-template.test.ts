import fs from 'fs';
import path from 'path';

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
});
