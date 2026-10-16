// Account data lives in `demoAccounts.js`, which namespaces every record by the signed-in uid.
// What is left here is the other half: preferences of whoever is walking through the demo, which
// belong to the browser rather than to an account.
export const globalKey = (name) => `bge-demo-global:${name}`

export function readGlobal(name, fallback) {
  try {
    return localStorage.getItem(globalKey(name)) ?? fallback
  } catch {
    return fallback
  }
}

export function writeGlobal(name, value) {
  try {
    localStorage.setItem(globalKey(name), value)
  } catch {
    /* Keep the page usable without persistent storage. */
  }
}
