import { computed, ref, watch } from 'vue'

export const messageCategories = [
  '全部消息',
  '系统消息',
  '充值提现',
  '安全消息',
  '认证消息',
  '场外消息',
  '活动消息',
]
const reward =
  'Congratulations on completing the task, please go to the Reward Center to claim or view the reward.'
const dates = [
  '2026-06-17 17:55:09',
  '2026-06-17 17:55:08',
  '2026-06-17 17:55:07',
  '2025-10-08 11:33:08',
  '2025-04-24 15:13:09',
  '2024-10-18 14:50:05',
  '2024-10-18 14:50:04',
  '2024-10-18 14:50:03',
  '2024-10-18 14:50:03',
  '2024-09-07 02:40:04',
]
const initialMessages = dates.map((date, index) => ({
  id: `reward-${index}`,
  category: '活动消息',
  text: reward,
  date,
  read: index === 6,
}))
const key = 'bge-demo-messages-v1'
let saved
try {
  saved = JSON.parse(localStorage.getItem(key))
} catch {
  /* Unavailable storage falls back to the demonstration data. */
}
export const messages = ref(
  Array.isArray(saved) &&
    saved.every(
      (m) =>
        m &&
        typeof m.id === 'string' &&
        typeof m.text === 'string' &&
        messageCategories.includes(m.category) &&
        typeof m.date === 'string' &&
        typeof m.read === 'boolean',
    )
    ? saved
    : initialMessages,
)
export const unreadCount = computed(() => messages.value.filter((m) => !m.read).length)
watch(
  messages,
  (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* Keep the session usable without persistent storage. */
    }
  },
  { deep: true },
)
export function markRead(id) {
  const message = messages.value.find((m) => m.id === id)
  if (message) message.read = true
}
export function removeMessages(ids) {
  messages.value = messages.value.filter((m) => !ids.includes(m.id))
}
