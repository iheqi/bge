// What the change note says on each page. Keys rather than sentences, so the note is translated
// like the rest of the site.
const notes = {
  '/bge/hk/zh-CN/market': ['noteMarket'],
  '/bge/hk/zh-CN/user/messages': ['noteMessages'],
  '/bge/hk/zh-CN/otc': ['noteOtc'],
  '/bge/hk/zh-CN/user/dashboard': ['noteDashboard', 'noteKycGate'],
  '/bge/hk/zh-CN/user/report': ['noteOrders', 'noteKycGate'],
  '/bge/hk/zh-CN/user/report/otc-orders': ['noteOrders', 'noteMatch', 'noteKycGate'],
  '/bge/hk/zh-CN/user/assets': ['noteAssets', 'noteKycGate'],
  // 收付款管理 and API 管理 take the same gate, so they carry the 未认证 line as well.
  '/bge/hk/zh-CN/user/payment': ['noteKycGate'],
  '/bge/hk/zh-CN/user/api': ['noteApi', 'noteKycGate'],
}

// Exact page first, then the longest matching prefix, so /user/report/otc-orders wins over the
// /user/report entry it sits under.
export function noteFor(path) {
  const clean = path.replace(/\/$/, '')
  if (notes[clean]) return notes[clean]
  const prefix = Object.keys(notes)
    .filter((key) => clean.startsWith(key))
    .sort((a, b) => b.length - a.length)[0]
  return prefix ? notes[prefix] : []
}
