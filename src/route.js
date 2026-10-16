// The deployed build is one HTML file per route, so the route is the address bar: /bge/hk/zh-CN/user/api.
// The single-file build (npm run build:single) carries every route in one document instead, where the
// same path rides in the hash: #/bge/hk/zh-CN/user/api. Both spellings are read here so a component
// never has to know which build it is running in — it asks for the path and navigates, the same way
// either way.

// Set by a one-line script the single-file build puts ahead of the bundle.
const single = Boolean(window.__BGE_SINGLE_FILE__)

// Both read the route as it stands, so a component can call them wherever the address bar suited it.
const current = () => {
  if (!single) return window.location.pathname + window.location.search
  const raw = window.location.hash.replace(/^#/, '')
  return raw.startsWith('/') ? raw : '/bge/hk/zh-CN/'
}

// The path half of the route, always starting with /bge/.
export const routePath = () => {
  const route = current()
  const mark = route.indexOf('?')
  return mark < 0 ? route : route.slice(0, mark)
}
// Everything from `?` on, so `new URLSearchParams(routeSearch())` reads a single-file route's query
// exactly like the address bar's.
export const routeSearch = () => {
  const route = current()
  const mark = route.indexOf('?')
  return mark < 0 ? '' : route.slice(mark)
}

// One document holds every route, so moving between them means writing the target to the hash and
// running the app again against it. The reload costs nothing (there is nothing left to fetch) and it
// keeps every page's setup code working from a clean state. Assigning the hash instead of the path
// also keeps the reload working under file://, where there is no server to serve the path.
const move = (target) => {
  if (!single) return false
  window.location.hash = target
  window.location.reload()
  return true
}

export const go = (target) => {
  if (!move(target)) window.location.href = target
}
// Same destination, minus the history entry. The single-file build cannot keep that difference.
export const redirect = (target) => {
  if (!move(target)) window.location.replace(target)
}

// Back and Forward move the hash without going through go(), so they reload on their own — otherwise
// the address bar and the page would disagree about where the reader is. A move already started its
// own reload, so the event it raises reloads a second time at most, and the browser drops a reload
// asked of a document it is already replacing.
if (single) window.addEventListener('hashchange', () => window.location.reload())

// Internal links are plain <a href="/bge/..."> throughout the app; in a single document they would
// walk out of the file, so they are turned into hash navigation as they are clicked. Modified clicks
// (new tab, download) are left to the browser.
if (single)
  document.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return
    const anchor = event.target.closest?.('a[href]')
    const href = anchor?.getAttribute('href')
    if (!href?.startsWith('/bge/')) return
    if (anchor.target && anchor.target !== '_self') return
    event.preventDefault()
    go(href)
  })
