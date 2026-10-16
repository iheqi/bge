// A statement download with no dependency behind it. The demo builds the PDF here and hands it to
// the browser as a Blob.
//
// Two constraints shape this file. PDF strings are Latin-1, and the base-14 fonts are not embedded,
// so no CJK glyph can be drawn — the statement is therefore written in English, with the Chinese
// only in the file name. And the cross-reference table needs byte offsets, which are only correct
// while every string stays single-byte, so the escaping below also strips anything outside ASCII.

const escapeText = (value) =>
  String(value)
    .replace(/[\\()]/g, (char) => `\\${char}`)
    // Anything the standard fonts cannot draw becomes a placeholder rather than a broken byte.
    .replace(/[^\x20-\x7e]/g, '?')

const A4 = '[0 0 595 842]'
const LEFT = 56
const RIGHT = 539
const LINE = 14

// One page: a bold title, a table with a rule under its header, and a column of label/value pairs.
export function buildStatementPdf({ title, subtitle, meta = [], table = null, note = '' }) {
  const commands = []
  let y = 780
  const text = (value, x, size, font = 'F1') => {
    commands.push(`BT /${font} ${size} Tf ${x} ${y} Td (${escapeText(value)}) Tj ET`)
  }
  const rule = (width = 1) => {
    commands.push(`0.6 w ${LEFT} ${y + 6} m ${RIGHT} ${y + 6} l S`)
  }

  text(title, LEFT, 18)
  y -= 22
  if (subtitle) {
    text(subtitle, LEFT, 11)
    y -= 20
  }
  rule()
  y -= 14

  meta.forEach(([label, value]) => {
    text(label, LEFT, 10)
    text(value, 200, 10)
    y -= LINE
  })

  if (table) {
    y -= 12
    const span = (RIGHT - LEFT) / table.head.length
    table.head.forEach((cell, index) => text(cell, LEFT + index * span, 10))
    y -= 6
    rule()
    y -= LINE
    table.rows.forEach((row) => {
      row.forEach((cell, index) => text(cell, LEFT + index * span, 10))
      y -= LINE
      if (y < 90) y = 90
    })
  }

  if (note) {
    y -= 20
    text(note, LEFT, 9)
  }

  // Four objects plus the content stream, assembled with the offsets the xref table needs.
  const content = commands.join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox ${A4} /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>`,
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objects.forEach((body, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`

  // Latin-1 bytes, one per character — the offsets above are only valid if nothing is multi-byte.
  const bytes = new Uint8Array(pdf.length)
  for (let index = 0; index < pdf.length; index++) bytes[index] = pdf.charCodeAt(index) & 0xff
  return new Blob([bytes], { type: 'application/pdf' })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // The click starts the download; the object URL only has to outlive it.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// The statement the 结单记录 tab hands out: the account's holdings as of the statement date.
export function statementRows(account) {
  const coins = new Set([
    ...Object.keys(account.balances.fund),
    ...Object.keys(account.balances.trade),
  ])
  return [...coins]
    .sort()
    .map((coin) => [
      coin,
      (account.balances.fund[coin] ?? 0).toFixed(8),
      (account.balances.trade[coin] ?? 0).toFixed(8),
      (account.frozen.fund[coin]?.amount ?? 0).toFixed(8),
    ])
}
