import { ref } from 'vue'

// Demo session: signing in only flips a flag and remembers which demo account
// was used, so the header and the account pages can switch between the signed
// out and signed in layouts without a backend.
const sessionKey = 'bge-session'
const accountKey = 'bge-account'
let savedSession
let savedAccount
try {
  savedSession = localStorage.getItem(sessionKey)
  savedAccount = JSON.parse(localStorage.getItem(accountKey) || 'null')
} catch {
  /* Storage can be disabled by the browser. */
}
export const loggedIn = ref(savedSession === 'in')
// 100002 passed personal verification, 100003 corporate and 100004
// institutional; any other account is signed in but not verified yet.
export const accountId = ref(savedAccount?.id ?? null)
export const kycVerified = ref(savedAccount?.kyc === true)
export const kycType = ref(savedAccount?.type ?? null)

export function signIn(id) {
  const type = id === '100002' ? 'person' : id === '100003' ? 'corporation' : id === '100004' ? 'institution' : null
  const profile = { id, kyc: Boolean(type), type }
  loggedIn.value = true
  accountId.value = profile.id
  kycVerified.value = profile.kyc
  kycType.value = profile.type
  try {
    localStorage.setItem(sessionKey, 'in')
    localStorage.setItem(accountKey, JSON.stringify(profile))
  } catch {}
}
export function signOut() {
  loggedIn.value = false
  accountId.value = null
  kycVerified.value = false
  kycType.value = null
  try {
    localStorage.removeItem(sessionKey)
    localStorage.removeItem(accountKey)
  } catch {}
}
