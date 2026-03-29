import fs from 'fs';
import path from 'path';

describe('sidebar ad integration', () => {
  it('does not ship the Carbon Ads sidebar script or styles', () => {
    const sidebarSource = fs.readFileSync(
      path.resolve(__dirname, '../src/components/editor/Viewport/Sidebar/index.tsx'),
      'utf8'
    );
    const appCssSource = fs.readFileSync(
      path.resolve(__dirname, '../src/styles/app.css'),
      'utf8'
    );

    expect(sidebarSource).not.toContain('cdn.carbonads.com');
    expect(sidebarSource).not.toContain('<Carbonads />');
    expect(sidebarSource).not.toContain('CarbonAdsContainer');
    expect(appCssSource).not.toContain('#carbonads');
  });
});
