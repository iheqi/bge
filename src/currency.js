import { ref } from 'vue'

// Reference rate for demo data; replace with the backend FX quote before live trading.
export const HKD_PER_USD = 7.8
export const currencies = ['USD', 'HKD']
let saved
try {
  saved = localStorage.getItem('bge-currency')
} catch {}
export const currency = ref(currencies.includes(saved) ? saved : 'USD')
export function setCurrency(value) {
  if (!currencies.includes(value)) return
  currency.value = value
  try {
    localStorage.setItem('bge-currency', value)
  } catch {}
}
export function convertCurrency(amount, from = 'USD', to = currency.value) {
  if (!currencies.includes(from) || !currencies.includes(to)) return null
  if (amount === null || amount === undefined || amount === '') return null
  const number = Number(amount)
  if (!Number.isFinite(number)) return null
  return (number / (from === 'HKD' ? HKD_PER_USD : 1)) * (to === 'HKD' ? HKD_PER_USD : 1)
}
export function formatMoney(amount, from = 'USD', digits = 2) {
  const value = convertCurrency(amount, from)
  return value === null
    ? '--'
    : `${currency.value} ${value.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })}`
}
// Only explicit fiat amounts are converted. Symbols, trading pairs and token units stay intact.
export function formatFiatText(value) {
  if (typeof value !== 'string') return value
  const match = value.match(/^([\d,]+(?:\.\d+)?) (USD|HKD)$/)
  return match ? formatMoney(Number(match[1].replaceAll(',', '')), match[2]) : value
}
