import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: set this to `/<repo-name>/`
  // Example: if your GitHub repo is `dialog-coach-employees`,
  // the site URL will be `https://<username>.github.io/dialog-coach-employees/`
  // and base must be `/dialog-coach-employees/`.
  //
  // If you later choose a different repo name, update this string to match.
  base: '/dialog-coach-employees/',

  plugins: [react()],

  // Put the production build into `docs/` so GitHub Pages
  // can serve it directly from the `main` branch.
  build: {
    outDir: 'docs',
  },
});

