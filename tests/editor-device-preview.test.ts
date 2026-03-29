import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const readWorkspaceFile = (relativePath: string) =>
  readFileSync(path.resolve(process.cwd(), relativePath), 'utf8');

describe('editor device preview wiring', () => {
  it('defines the desktop, tablet, and mobile device labels in the editor header', () => {
    const headerSource = readWorkspaceFile(
      'src/components/editor/Viewport/Header.tsx'
    );
    const devicePreviewSource = readWorkspaceFile(
      'src/components/editor/Viewport/devicePreview.ts'
    );

    expect(devicePreviewSource).toContain('PC 1440');
    expect(devicePreviewSource).toContain('平板 1024');
    expect(devicePreviewSource).toContain('手机 390');
    expect(headerSource).toContain('DEVICE_PREVIEW_OPTIONS.map');
  });

  it('adds a shared device-mode contract for the viewport shell', () => {
    const editorPageSource = readWorkspaceFile('src/pages/EditorPage.tsx');
    const viewportSource = readWorkspaceFile(
      'src/components/editor/Viewport/index.tsx'
    );

    expect(editorPageSource).toContain("'desktop' | 'tablet' | 'mobile'");
    expect(viewportSource).toContain('viewport-canvas-shell');
    expect(viewportSource).toContain('deviceWidth');
  });

  it('keeps the default home page template responsive inside the viewport shell', () => {
    const editorConfigSource = readWorkspaceFile('src/lib/editor-config.tsx');
    const appStylesSource = readWorkspaceFile('src/styles/app.css');

    expect(editorConfigSource).toContain(
      'className="landing-page-root landing-page-shell"'
    );
    expect(editorConfigSource).toContain('landing-two-column');
    expect(editorConfigSource).toContain('width="100%"');
    expect(appStylesSource).toContain('.landing-page-root {');
    expect(appStylesSource).toContain('.landing-page-shell {');
    expect(appStylesSource).toContain('width: 100%;');
    expect(appStylesSource).toContain('.landing-page-shell');
    expect(appStylesSource).toContain('.landing-two-column');
    expect(appStylesSource).not.toContain('max-width: 800px');
  });

  it('maps mobile editor preview mode to the same responsive layout rules as a narrow viewport', () => {
    const appStylesSource = readWorkspaceFile('src/styles/app.css');

    expect(appStylesSource).toContain(
      ".viewport-canvas-shell[data-device-mode='mobile'] .landing-two-column"
    );
    expect(appStylesSource).toContain(
      ".viewport-canvas-shell[data-device-mode='mobile'] .landing-page-root"
    );
    expect(appStylesSource).toContain(
      ".viewport-canvas-shell[data-device-mode='mobile'] .detail-hero-grid"
    );
  });
});
