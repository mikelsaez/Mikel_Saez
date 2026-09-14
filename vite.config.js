import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function serveAdminIndex() {
  return {
    name: 'serve-admin-index',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const [pathname, query] = (request.url || '').split('?')

        if (pathname === '/admin' || pathname === '/admin/') {
          request.url = `/admin/index.html${query ? `?${query}` : ''}`
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [serveAdminIndex(), react()],
})
