// Packages the built site into one HTML file: dist-single/bge-demo.html.
//
// The deployed site is one HTML file per route, served over HTTP. Handed to a client as a file, that
// falls apart — file:// has no server to resolve /bge/hk/zh-CN/user/api, and opening a directory of
// HTML files leaves whoever opened it to guess which one to double-click. So this script builds the
// ordinary production bundle and then folds everything into a single document:
//
//   - the stylesheet becomes a <style> block, the bundle a <script type="module"> block;
//   - the images in public/ become data URIs, since there is no directory beside the file to read;
//   - window.__BGE_SINGLE_FILE__ is set ahead of the bundle, which tells src/route.js to read the
//     route out of the hash instead of the path — that is the whole of the single-file build.
//
// The result opens by double-click and navigates internally; see src/route.js for how.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const dist = path.join(root, 'dist')
const outDir = path.join(root, 'dist-single')
const outFile = path.join(outDir, 'bge-demo.html')

// Everything the app reaches for by absolute path. Each is embedded whole, so the file needs no
// neighbours; a new image in public/ that the app references has to be listed here to come along.
const ASSETS = [
  'logo.png',
  'logo-bge.svg',
  'logo-bge-light.svg',
  'avatar.png',
  'images/about-bg.jpg',
  'images/spot-trading-demo.png',
]
const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

const read = (file) => fs.readFileSync(file, 'utf8')
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

// The build is run here rather than expected to have been run, so the file always matches the source
// it was built from.
execFileSync(path.join(root, 'node_modules/.bin/vite'), ['build'], { cwd: root, stdio: 'inherit' })

const shell = read(path.join(dist, 'index.html'))
const pick = (pattern, what) => {
  const found = shell.match(pattern)
  if (!found) throw Error(`dist/index.html has no ${what} — did the build output change?`)
  return found[1]
}
const bundlePath = path.join(dist, pick(/src="\/bge\/(assets\/[^"]+\.js)"/, 'bundle script'))
const stylePath = path.join(dist, pick(/href="\/bge\/(assets\/[^"]+\.css)"/, 'stylesheet'))
const title = pick(/<title>([^<]*)<\/title>/, 'title')

let bundle = read(bundlePath)
const style = read(stylePath)

// A data URI per asset, longest path first so a name that contains another (`logo-bge.svg` inside
// `logo-bge-light.svg`) is never matched through the shorter one.
const embedded = new Map()
for (const asset of [...ASSETS].sort((a, b) => b.length - a.length)) {
  const file = path.join(dist, asset)
  if (!fs.existsSync(file)) throw Error(`public/${asset} is listed but missing from dist/`)
  const mime = MIME[path.extname(asset)] ?? 'application/octet-stream'
  embedded.set(`/bge/${asset}`, `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`)
}

// The references live in the bundle (template src attributes, CSS url()), so the swap happens on the
// text of both. A path the app no longer uses is reported rather than quietly kept.
const used = new Map()
const inlineAssets = (text) => {
  let swapped = text
  for (const [url, data] of embedded) {
    const hits = swapped.split(url).length - 1
    if (hits) {
      swapped = swapped.split(url).join(data)
      used.set(url, (used.get(url) ?? 0) + hits)
    }
  }
  return swapped
}
bundle = inlineAssets(bundle)
const styled = inlineAssets(style)
// The favicon is the one reference that lives in the shell rather than the bundle, so it is read out
// of the shell and put through the same swap rather than looked up in the map.
const favicon = inlineAssets(pick(/<link[^>]*rel="icon"[^>]*href="([^"]+)"/, 'favicon link'))

// A literal </script> or </style> would close the block early; nothing in the bundle produces one
// today, and this keeps that true if something ever does. The escaped form is the same string to both
// the JS parser and the CSS one.
const escape = (text, tag) => text.replace(new RegExp(`</${tag}`, 'gi'), `<\\/${tag}`)

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" type="image/png" href="${favicon}" />
    <title>${title}</title>
    <style>
${escape(styled, 'style')}
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script>window.__BGE_SINGLE_FILE__ = true</script>
    <script type="module">
${escape(bundle, 'script')}
    </script>
  </body>
</html>
`

// A single document that still points at a file beside itself would open blank, so nothing is written
// until the leftover references are gone.
const leftovers = html.match(
  /["'(]\/bge\/(?:assets\/|[a-zA-Z0-9._/-]+\.(?:png|jpe?g|svg|gif|webp))/g,
)
if (leftovers) throw Error(`still points at files: ${[...new Set(leftovers)].join(', ')}`)

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, html)

const unused = [...embedded.keys()].filter((url) => !used.has(url))
if (unused.length) console.warn(`not referenced by the build: ${unused.join(', ')}`)
console.log(`${path.relative(root, outFile)}  ${mb(Buffer.byteLength(html))}`)
for (const [url, hits] of used) console.log(`  ${url} → ${hits} reference(s) embedded`)
