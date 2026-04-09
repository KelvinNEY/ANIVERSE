import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  appType: 'mpa',
  server: {
    open: '/index.html'
  }
});
