<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import Footer from './Footer.vue'
import { formatMoney } from './currency'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const coins = [
  { symbol: 'ETH', name: '以太坊', glyph: '◆', network: 'eth-', chain: 'ETH', fee: 0.0001, min: 0.02, limit: 3952.316221, balance: 2.4 },
  { symbol: 'BTC', name: 'Bitcoin', glyph: '₿', network: 'btc-', chain: 'BTC', fee: 0.00005, min: 0.0005, limit: 100, balance: 0.08 },
  { symbol: 'USDT', name: '泰达币', glyph: '₮', network: 'trc20-', chain: 'TRC20', fee: 10, min: 10, limit: 1000000, balance: 3200 },
  { symbol: 'USDC', name: 'USD Coin', glyph: '$', network: 'erc20-', chain: 'ERC20', fee: 10, min: 10, limit: 500000, balance: 5600 },
]
const requested = decodeURIComponent(window.location.pathname.split('/withdraw/')[1] || 'ETH').toUpperCase()
const coin = ref(coins.some((item) => item.symbol === requested) ? requested : 'ETH')
const active = computed(() => coins.find((item) => item.symbol === coin.value))
// Demo balances mirror the funding account on /user/assets.
const prices = { ETH: 3450, BTC: 96000, USDT: 1, USDC: 1 }
const balances = ref(Object.fromEntries(coins.map((item) => [item.symbol, item.balance])))
const wallet = ref(JSON.parse(localStorage.getItem('bge-wallet-record') || 'null'))
const verified = computed(() => wallet.value?.status === '已认证' && wallet.value?.coin === coin.value)
const records = ref([])
const amount = ref('')
const formatAmount = (value) => Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 8 })
const available = computed(() => balances.value[coin.value] ?? 0)
const received = computed(() => Math.max(0, Number(amount.value || 0) - active.value.fee))
const remaining = computed(
  () =>
    active.value.limit -
    records.value.filter((record) => record.coin === coin.value).reduce((sum, record) => sum + record.amount, 0),
)
const feeText = computed(() => `${active.value.fee} ${coin.value}`)

function changeCoin(value) {
  window.location.href = `/bge/hk/zh-CN/user/crypto/withdraw/${value}`
}
function fillAll() {
  amount.value = String(available.value)
}
function submit() {
  const value = Number(amount.value)
  if (!Number.isFinite(value) || value <= 0) return ElMessage.warning('请输入取款数量')
  if (value < active.value.min) return ElMessage.warning(`最小提币数量为 ${active.value.min} ${coin.value}`)
  if (value > available.value) return ElMessage.warning('可用余额不足')
  if (value > remaining.value) return ElMessage.warning('超出 24H 剩余取款额度')
  balances.value[coin.value] = available.value - value
  records.value.unshift({
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    coin: coin.value,
    network: active.value.network,
    amount: value,
    received: value - active.value.fee,
    status: '处理中',
    address: wallet.value?.address ?? '—',
    remark: wallet.value?.remark || '—',
  })
  amount.value = ''
  ElMessage.success('取款申请已提交')
}
</script>

<template>
  <div class="user-page">
    <SiteHeader active="assets" />
    <div class="user-layout">
      <UserSidebar />
      <main class="withdraw-main">
        <section class="withdraw-box">
          <h1 class="withdraw-title">数字资产取款</h1>
          <div class="withdraw-notice">
            <span class="withdraw-notice-icon"><el-icon><InfoFilled /></el-icon></span>{{ $t('text277') }}<a href="/bge/hk/zh-CN/user/payment/crypto">去认证</a>
          </div>
          <div class="withdraw-columns">
            <div class="withdraw-form">
              <p class="withdraw-label">取款币种</p>
              <el-select
                :model-value="coin"
                class="withdraw-select"
                @change="changeCoin"
              >
                <el-option
                  v-for="item in coins"
                  :key="item.symbol"
                  :label="item.symbol"
                  :value="item.symbol"
                >
                  <span class="coin-option"><i>{{ item.glyph }}</i>{{ item.symbol }}<small>{{ item.name }}</small></span>
                </el-option>
              </el-select>

              <div class="withdraw-address-head">
                <p class="withdraw-label">取款网络及地址</p>
                <a
                  class="withdraw-link"
                  href="/bge/hk/zh-CN/user/payment/crypto"
                  >去添加地址›</a
                >
              </div>
              <div class="withdraw-network">
                <i class="coin-badge">{{ active.glyph }}</i>
                <b>{{ active.network }}</b>
                <span v-if="verified">{{ wallet.address }}</span>
                <span class="withdraw-fee">手续费 {{ feeText }} (≈{{ formatMoney(active.fee * prices[coin], 'USD') }})</span>
              </div>

              <div
                v-if="!verified"
                class="withdraw-unverified"
              >
                <svg
                  class="withdraw-illustration"
                  viewBox="0 0 220 160"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="120"
                    cy="147"
                    rx="72"
                    ry="8"
                    fill="#eef2f7"
                  />
                  <rect
                    x="112"
                    y="26"
                    width="72"
                    height="104"
                    rx="7"
                    fill="#fbfcfe"
                    stroke="#dde4ec"
                    stroke-width="2"
                  />
                  <rect
                    x="124"
                    y="42"
                    width="48"
                    height="30"
                    rx="4"
                    fill="#eaeff5"
                  />
                  <rect
                    x="124"
                    y="84"
                    width="48"
                    height="6"
                    rx="3"
                    fill="#e6ebf2"
                  />
                  <rect
                    x="124"
                    y="97"
                    width="30"
                    height="6"
                    rx="3"
                    fill="#e6ebf2"
                  />
                  <path
                    d="M163 30c6 0 11 5 11 11s-11 20-11 20-11-14-11-20 5-11 11-11z"
                    fill="#f5c518"
                  />
                  <circle
                    cx="163"
                    cy="41"
                    r="4.5"
                    fill="#fff"
                  />
                  <circle
                    cx="66"
                    cy="64"
                    r="13"
                    fill="#2c3a52"
                  />
                  <path
                    d="M46 132c0-24 9-36 20-36s20 12 20 36z"
                    fill="#2c3a52"
                  />
                  <path
                    d="M82 100l32-20"
                    stroke="#2c3a52"
                    stroke-width="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M60 116h10"
                    stroke="#f5c518"
                    stroke-width="6"
                    stroke-linecap="round"
                  />
                </svg>
                <p>您的{{ coin }}在{{ active.network }}网络地址未认证</p>
                <a
                  class="withdraw-verify"
                  href="/bge/hk/zh-CN/user/payment/crypto/add"
                  >立即认证</a
                >
              </div>

              <template v-else>
                <div class="withdraw-qty">
                  <p class="withdraw-label">{{ $t('text315') }}</p>
                  <span class="withdraw-available">可用余额 {{ formatAmount(available) }} {{ coin }}</span>
                </div>
                <el-input
                  v-model="amount"
                  class="withdraw-input"
                  placeholder="请输入取款数量"
                >
                  <template #suffix><button
                    class="withdraw-all"
                    type="button"
                    @click="fillAll"
                  >
                    {{ $t('text165') }}
                  </button></template>
                </el-input>
                <div class="withdraw-summary">
                  <span>手续费 <b>{{ feeText }}</b></span><span>到账数量 <b>{{ formatAmount(received) }} {{ coin }}</b></span>
                </div>
                <button
                  class="withdraw-submit"
                  type="button"
                  @click="submit"
                >
                  提交取款
                </button>
              </template>
            </div>

            <div class="withdraw-aside">
              <section class="withdraw-card">
                <h3>取款说明</h3>
                <p class="withdraw-quota">
                  24H剩余取款额度：{{ formatAmount(remaining) }}/{{ formatAmount(active.limit) }} {{ coin }}
                </p>
                <ul>
                  <li>仅支持向 {{ active.chain }} 网络的地址提币。如向非 {{ active.chain }} 网络的地址提币的话，资产将无法退回，请注意。</li>
                  <li>最小提币数量为：{{ active.min }} {{ coin }}。</li>
                  <li>为保障资金安全，当您账户安全策略变更、密码修改、我们会对比进行人工审核，请耐心等待工作人员电话或邮件联系。</li>
                  <li>请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</li>
                </ul>
              </section>
              <section class="withdraw-card">
                <h3>地址认证说明</h3>
                <p class="faq-q">为什么要完成地址认证才可进行数字资产存款和取款？</p>
                <p class="faq-a">根据监管要求,数字资产存款行为发起方的地址和取款行为接收方的地址必须为已认证过的地址,任何非认证过的地址转账均无法上账</p>
                <p class="faq-q">如何进行地址认证？</p>
                <p class="faq-a">在数字资产地址管理模块,完成地址绑定后进行地址认证,系统会随机生成一笔小额汇款金额,您需使用此次认证地址汇出指定金额至收款地址,系统确认收到即成功绑定</p>
                <p class="faq-q">认证地址需支付小额资金问题？</p>
                <p class="faq-a">地址认证完一次后,不需要再次认证,存款和取款可以使用同一认证地址,认证地址的资金在系统收到后会给您返还至资金账户</p>
              </section>
            </div>
          </div>

          <h2 class="withdraw-records-title">取款记录</h2>
          <div class="withdraw-table-head">
            <span>{{ $t('text313') }}</span
            ><span>数字货币</span><span>{{ $t('text285') }}</span><span>提现数量</span
            ><span class="withdraw-th-icon">到账数量<i class="withdraw-info">ⓘ</i></span
            ><span>{{ $t('text063') }}</span><span>到账地址</span><span>{{ $t('text286') }}</span
            ><span>{{ $t('text065') }}</span>
          </div>
          <div
            v-for="(record, index) in records"
            :key="index"
            class="withdraw-row"
          >
            <span>{{ record.time }}</span
            ><span>{{ record.coin }}</span
            ><span>{{ record.network }}</span
            ><span>{{ formatAmount(record.amount) }}</span
            ><span>{{ formatAmount(record.received) }}</span
            ><span>{{ record.status }}</span
            ><span>{{ record.address }}</span
            ><span>{{ record.remark }}</span
            ><span>—</span>
          </div>
          <div
            v-if="!records.length"
            class="withdraw-empty"
          >
            暂无数据
          </div>
          <p class="withdraw-footnote">
            * 仅展示最近10条记录，如需更多记录，请查看
            <a href="/bge/hk/zh-CN/user/report/wallet">存取款记录</a>
          </p>
        </section>
      </main>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.withdraw-main{padding:24px;flex:1;min-width:0}
.withdraw-box{padding:24px 28px 32px;background:#fff}
.withdraw-title{margin:0 0 26px;padding-left:12px;border-left:8px solid #ffd52a;font-size:22px;font-weight:600}
.withdraw-notice{display:flex;align-items:center;gap:8px;padding:14px 18px;border:1px solid #f2d27a;background:#fffbe9;color:#8a7a4b;font-size:13px}
.withdraw-notice a{margin-left:auto;color:#d9a600;text-decoration:none;white-space:nowrap}
.withdraw-notice-icon{display:inline-flex;color:#e6a23c}
.withdraw-columns{display:flex;gap:48px;margin-top:30px;align-items:flex-start}
.withdraw-form{flex:1;min-width:0;max-width:720px}
.withdraw-aside{display:flex;width:340px;flex:0 0 340px;flex-direction:column;gap:16px;padding-left:44px;border-left:1px solid #edf0f4;align-self:stretch}
.withdraw-label{margin:0 0 10px;color:#303744;font-size:15px}
.withdraw-select{width:100%}
.withdraw-select :deep(.el-select__wrapper){min-height:46px;border-radius:4px;box-shadow:0 0 0 1px #dfe4ec inset}
.coin-option{display:inline-flex;align-items:center;gap:10px}
.coin-option i{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#eceff3;color:#8a94a6;font-size:12px;font-style:normal}
.coin-option small{color:#9ba3ae}
.withdraw-address-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:26px 0 10px}
.withdraw-address-head .withdraw-label{margin:0}
.withdraw-link{color:#d9a600;font-size:13px;text-decoration:none}
.withdraw-link:hover{color:#b98c00}
.withdraw-network{display:flex;align-items:center;gap:16px;padding:14px 18px;border:1px solid #dfe4ec;border-radius:4px;color:#303744;font-size:14px}
.withdraw-network b{font-weight:400}
.withdraw-network span{color:#8a94a6}
.withdraw-fee{margin-left:auto;white-space:nowrap}
.coin-badge{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#fdf3d0;color:#e0a800;font-size:12px;font-style:normal;flex:0 0 auto}
.withdraw-unverified{margin-top:28px;border:1px solid #edf0f4;text-align:center}
.withdraw-illustration{display:block;margin:56px auto 26px;width:220px;height:160px}
.withdraw-unverified p{margin:0 0 60px;color:#171d27;font-size:17px;font-weight:500}
.withdraw-verify{display:block;height:52px;line-height:52px;background:#f5ff18;color:#111;font-size:16px;text-decoration:none}
.withdraw-verify:hover{background:#e8f000}
.withdraw-qty{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin:28px 0 10px}
.withdraw-qty .withdraw-label{margin:0}
.withdraw-available{color:#8a94a6;font-size:13px}
.withdraw-input :deep(.el-input__wrapper){min-height:46px;border-radius:4px;box-shadow:0 0 0 1px #dfe4ec inset}
.withdraw-all{padding:0;border:0;background:none;color:#d9a600;font-size:14px;cursor:pointer}
.withdraw-summary{display:flex;justify-content:space-between;gap:16px;margin-top:16px;padding:16px 18px;background:#f7f8fa;color:#6f7783;font-size:13px}
.withdraw-summary b{color:#303744;font-weight:500}
.withdraw-submit{width:100%;height:48px;margin-top:26px;border:0;border-radius:4px;background:#f5ff18;color:#111;font-size:16px;font-weight:600;cursor:pointer}
.withdraw-submit:hover{background:#e8f000}
.withdraw-card{padding:20px;background:#f4f7fa}
.withdraw-card h3{margin:0 0 16px;color:#303744;font-size:16px;font-weight:600}
.withdraw-quota{margin:0 0 14px;color:#c9a227;font-size:14px;font-weight:600}
.withdraw-card ul{margin:0;padding-left:16px;color:#6f7783;font-size:13px;line-height:1.9}
.withdraw-card li{margin:0 0 8px}
.faq-q{margin:0 0 6px;color:#c9a227;font-size:13px}
.faq-q::before{content:'•';margin-right:6px}
.faq-a{margin:0 0 14px;color:#6f7783;font-size:13px;line-height:1.8}
.withdraw-records-title{margin:44px 0 20px;padding-left:12px;border-left:8px solid #ffd52a;font-size:20px;font-weight:600}
.withdraw-table-head,.withdraw-row{display:grid;grid-template-columns:1.25fr .8fr .8fr .9fr .9fr .7fr 2fr .9fr .6fr;align-items:center;gap:8px;padding:0 12px;text-align:center}
.withdraw-table-head{height:44px;background:#f4f6f9;color:#697585;font-size:13px}
.withdraw-row{min-height:58px;border-bottom:1px solid #edf0f4;color:#697585;font-size:13px}
.withdraw-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.withdraw-th-icon{display:inline-flex;align-items:center;justify-content:center;gap:4px}
.withdraw-info{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;background:#ffd52a;color:#fff;font-size:10px;font-style:normal}
.withdraw-empty{padding:60px 0;color:#9aa2ad;font-size:14px;text-align:center}
.withdraw-footnote{margin:18px 0 0;color:#9aa2ad;font-size:12px}
.withdraw-footnote a{color:#d9a600;text-decoration:none}
@media (max-width:1200px){.withdraw-columns{flex-direction:column;gap:24px}.withdraw-aside{width:100%;flex:1 1 auto;padding-left:0;border-left:0}}
</style>
