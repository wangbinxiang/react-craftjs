import { ThemeProvider } from '@mui/material';

import { editorTheme } from './lib/editor-config';
import { EditorPage } from './pages/EditorPage';
import { PreviewPage } from './pages/PreviewPage';
import { resolveExampleRoute } from './utils/preview';

function App() {
  const route = resolveExampleRoute(
    typeof window === 'undefined' ? '/' : window.location.pathname,
    import.meta.env.BASE_URL
  );

  return (
    <ThemeProvider theme={editorTheme}>
      {route.kind === 'preview' ? (
        <PreviewPage slug={route.slug} />
      ) : (
        <EditorPage />
      )}
    </ThemeProvider>
  );
}

export default App;
