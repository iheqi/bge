import { computed, ref, watch } from 'vue'
import { currentAccount, readAccountState, writeAccountState } from './demoAccounts'

export const messageCategories = [
  '全部消息',
  '系统消息',
  '充值提现',
  '安全消息',
  '认证消息',
  '场外消息',
  '活动消息',
]
// Body copy per category. The wording is translated through source-keys.json, the same way the
// previous reward notice was, so no new language keys are needed here.
const bodies = {
  系统消息: [
    '系统维护完成：HKBGE 服务已全面恢复，请您放心使用。',
    '关于2026年7月11日至7月15日进行系统临时维护及全站暂停服务的通知，维护期间充值、提现及交易功能暂停使用。',
    '系统将于本周日 02:00-04:00（UTC+8）进行例行升级，期间行情推送可能出现短暂延迟。',
    '平台已完成本轮流动性升级，大宗交易的滑点进一步降低。',
    '为提升访问速度，系统已切换至新的行情推送节点，如遇异常请刷新页面。',
  ],
  充值提现: [
    '您的 10,000.00 USDT 充值已到账，可用余额已更新，请前往资产页面查看。',
    '您的 0.50000000 BTC 提现申请已提交，正在等待区块确认，预计 30 分钟内完成。',
    '您的 5,000.00 HKD 提现已完成，资金已转出至尾号 8842 的银行账户。',
    '根据监管要求，数字资产提现需使用已认证且有效的地址，请及时完成地址认证。',
    '充值提醒：向非本人地址转账可能导致资产无法找回，请务必核对地址与网络类型。',
  ],
  安全消息: [
    '您的账户于 2026-10-08 15:33:28 在新设备（OSX Chrome）登录，如非本人操作请立即修改密码。',
    '检测到您的账户尝试从陌生 IP 116.49.145.110 登录，已暂时拦截本次登录请求。',
    '您的登录密码已修改成功，如非本人操作请立即联系客服冻结账户。',
    '建议开启双重验证（2FA），为提现和交易操作增加一层保护。',
    '您的账户已成功设置防钓鱼码，请留意后续所有邮件中的防钓鱼码是否一致。',
  ],
  认证消息: [
    '您的身份认证资料已提交，我们将在 1-3 个工作日内完成审核。',
    '恭喜您，身份认证已通过，账户等级提升后可享受更高的提现额度。',
    '您的身份认证资料已过期，请重新提交以继续使用法币出入金服务。',
    '请补充上传手持证件照，以便我们继续处理您的认证申请。',
    '您的银行卡认证已通过，现在可以进行法币存款与取款操作。',
  ],
  场外消息: [
    '您的 OTC 订单 #20260617001 已匹配到报价方，请在 15 分钟内完成支付。',
    '您的 OTC 订单 #20260617002 已完成，数字资产已划转至您的交易账户。',
    '您的 OTC 订单 #20260617003 已超时取消，如有需要请重新下单。',
    '您有一笔新的场外询价，请前往 OTC 订单页面查看详情。',
    '场外交易提醒：请仅通过平台确认的收款方式付款，谨防冒充客服的诈骗行为。',
  ],
  活动消息: [
    'Congratulations on completing the task, please go to the Reward Center to claim or view the reward.',
    '恭喜您获得新用户专享返现奖励，奖励已发放至您的资金账户。',
    '限时活动：邀请好友注册并完成认证，双方均可获得 20 USDT 奖励。',
    '您的交易大赛排名已更新，当前位列第 68 名，活动结束时间为 2026-10-31。',
    '佳节活动已开启，完成一笔现货交易即可参与抽奖。',
  ],
}
// Newest first, one entry per category per day. The copy is stepped per category so that a
// category never shows the same wording twice in a row, and neighbouring entries stay ~1 day
// apart, which keeps every filter on two to three pages. Each demo account gets its own depth
// and unread ratio, so the message centre is not identical for every login.
const start = Date.UTC(2026, 9, 12, 9, 55, 9)
function stamp(hoursBack) {
  const date = new Date(start - hoursBack * 60 * 60 * 1000)
  const pad = (value) => String(value).padStart(2, '0')
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
  )
}
// Unverified clients have only just registered, so their mailbox is short and mostly read. It also
// has no transaction history to be notified about and nothing that says a review already passed,
// so those copies are withheld from that mailbox: a client with no assets, orders or card should
// not be reading a 提现已提交 or 认证已通过 notice.
const MESSAGE_PROFILE = {
  person: { days: 18, readEvery: 3, shift: 0 },
  corporation: { days: 21, readEvery: 2, shift: 1 },
  institution: { days: 24, readEvery: 4, shift: 2 },
  unverified: { days: 6, readEvery: 1, shift: 3 },
}
const UNVERIFIED_SKIP = {
  充值提现: [0, 1, 2],
  认证消息: [1, 4],
  场外消息: [0, 1, 2],
  活动消息: [1],
}
function buildMessages(kind) {
  const categories = Object.keys(bodies)
  const shape = MESSAGE_PROFILE[kind] ?? MESSAGE_PROFILE.person
  const textsOf = (category) =>
    kind === 'unverified'
      ? bodies[category].filter((_, index) => !(UNVERIFIED_SKIP[category] ?? []).includes(index))
      : bodies[category]
  // Each category walks its own copy list from a different offset, so a page never repeats wording.
  const offsets = Object.fromEntries(
    categories.map((category, index) => [
      category,
      (index * 2 + shape.shift) % textsOf(category).length,
    ]),
  )
  const list = []
  for (let day = 0; day < shape.days; day++) {
    for (let order = 0; order < categories.length; order++) {
      const category = categories[order]
      const texts = textsOf(category)
      const copy = (day + offsets[category]) % texts.length
      // Most entries start read so the unread badge stays realistic.
      list.push({
        id: `${category}-${day}-${copy}`,
        category,
        text: texts[copy],
        date: stamp(day * 24 + order * 3.5),
        read: list.length % (shape.readEvery + 1) !== 0,
      })
    }
  }
  if (list.length !== categories.length * shape.days) throw Error('message mock count drifted')
  return list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
function isMessageList(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        m &&
        typeof m.id === 'string' &&
        typeof m.text === 'string' &&
        messageCategories.includes(m.category) &&
        typeof m.date === 'string' &&
        typeof m.read === 'boolean',
    )
  )
}
const initialMessages = buildMessages(currentAccount.value.kind)
const saved = readAccountState('messages', null)
export const messages = ref(isMessageList(saved) ? saved : initialMessages)
export const unreadCount = computed(() => messages.value.filter((m) => !m.read).length)
// Only the read state survives a reload; the wording itself is regenerated from the account.
watch(messages, (value) => writeAccountState('messages', value), { deep: true })
export function markRead(id) {
  const message = messages.value.find((m) => m.id === id)
  if (message) message.read = true
}
export function removeMessages(ids) {
  messages.value = messages.value.filter((m) => !ids.includes(m.id))
}
