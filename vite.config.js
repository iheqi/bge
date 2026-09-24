import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

export default defineConfig({
  // GitHub Pages serves this repository under /bge/.
  base: '/bge/',
  plugins: [
    vue(),
    {
      name: 'static-page-entries',
      closeBundle() {
        const routes = new Set()
        for (const file of readdirSync('src').filter((file) => /\.(vue|js)$/.test(file))) {
          const source = readFileSync(join('src', file), 'utf8')
          for (const match of source.matchAll(/\/bge\/(hk\/zh-CN\/[a-zA-Z0-9/-]*)/g))
            routes.add(match[1])
        }
        for (const route of routes) {
          const target = join('dist', route, 'index.html')
          mkdirSync(dirname(target), { recursive: true })
          copyFileSync('dist/index.html', target)
        }
      },
    },
  ],
})
