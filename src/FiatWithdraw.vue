<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import Footer from './Footer.vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { i18n, tr } from './i18n'

const t = (key, params) => i18n.global.t(key, params)

const coins = [
  { symbol: 'HKD', name: '港币', glyph: 'HK$', fee: 0, min: 100, limit: 5000000, balance: 68000 },
  { symbol: 'USD', name: '美元', glyph: '$', fee: 0, min: 10, limit: 1000000, balance: 12500 },
]
const requested = decodeURIComponent(window.location.pathname.split('/withdraw/')[1] || 'HKD').toUpperCase()
const coin = ref(coins.some((item) => item.symbol === requested) ? requested : 'HKD')
const active = computed(() => coins.find((item) => item.symbol === coin.value))
// Demo balances mirror the funding account on /user/assets.
const balances = ref(Object.fromEntries(coins.map((item) => [item.symbol, item.balance])))
const bank = ref(JSON.parse(localStorage.getItem('bge-bank-record') || 'null'))
const records = ref([])
const amount = ref('')
const percents = [25, 50, 75, 100]
const formatAmount = (value) => Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })
const available = computed(() => balances.value[coin.value] ?? 0)
const received = computed(() => Math.max(0, Number(amount.value || 0) - active.value.fee))
const remaining = computed(
  () =>
    active.value.limit -
    records.value.filter((record) => record.coin === coin.value).reduce((sum, record) => sum + record.amount, 0),
)
const maskedAccount = computed(() => {
  const account = bank.value?.account ?? ''
  return account.length > 4 ? `**** **** **** ${account.slice(-4)}` : account
})

function changeCoin(value) {
  window.location.href = `/bge/hk/zh-CN/user/fiat/withdraw/${value}`
}
function fillPercent(percent) {
  amount.value = ((available.value * percent) / 100).toFixed(2)
}
function submit() {
  const value = Number(amount.value)
  if (!bank.value) return ElMessage.warning(t('fiatNoCard', { coin: coin.value }))
  if (!Number.isFinite(value) || value <= 0) return ElMessage.warning(t('fiatAmountPlaceholder'))
  if (value < active.value.min) return ElMessage.warning(t('fiatMinMessage', { min: active.value.min, coin: coin.value }))
  if (value > available.value) return ElMessage.warning(t('insufficientBalance'))
  if (value > remaining.value) return ElMessage.warning(t('withdrawOverQuota'))
  balances.value[coin.value] = available.value - value
  records.value.unshift({
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    coin: coin.value,
    amount: value,
    fee: active.value.fee,
    sent: value - active.value.fee,
    account: maskedAccount.value,
    tag: bank.value?.tag || '—',
    payTime: '—',
    status: '处理中',
  })
  amount.value = ''
  ElMessage.success(t('withdrawSubmitted'))
}
</script>

<template>
  <div class="user-page">
    <SiteHeader active="assets" />
    <div class="user-layout">
      <UserSidebar />
      <main class="fiat-main">
        <section class="fiat-box">
          <h1 class="fiat-title">{{ $t('fiatWithdrawTitle') }}</h1>
          <div class="fiat-columns">
            <div class="fiat-form">
              <p class="fiat-label">{{ $t('fiatChooseCoin') }}</p>
              <el-select
                :model-value="coin"
                class="fiat-select"
                @change="changeCoin"
              >
                <el-option
                  v-for="item in coins"
                  :key="item.symbol"
                  :label="item.symbol"
                  :value="item.symbol"
                >
                  <span class="coin-option"><i>{{ item.glyph }}</i>{{ item.symbol }}<small>{{ tr(item.name) }}</small></span>
                </el-option>
              </el-select>

              <div class="fiat-card-head">
                <p class="fiat-label">{{ $t('fiatChooseCard') }}</p>
                <a
                  class="fiat-link"
                  href="/bge/hk/zh-CN/user/payment/fiat/detail?type=add"
                  >{{ $t('fiatAddCard') }}</a
                >
              </div>
              <div
                v-if="bank"
                class="fiat-card"
              >
                <i class="coin-badge">{{ active.glyph }}</i>
                <b>{{ maskedAccount }}</b>
                <span>{{ bank.name }}</span>
                <span class="fiat-tag">{{ bank.tag || '—' }}</span>
              </div>
              <div
                v-else
                class="fiat-no-card"
              >
                <svg
                  class="fiat-illustration"
                  viewBox="0 0 220 150"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="110"
                    cy="132"
                    rx="66"
                    ry="8"
                    fill="#eef2f7"
                  />
                  <rect
                    x="62"
                    y="52"
                    width="96"
                    height="60"
                    rx="7"
                    fill="#fbfcfe"
                    stroke="#dde4ec"
                    stroke-width="2"
                  />
                  <rect
                    x="62"
                    y="70"
                    width="96"
                    height="12"
                    fill="#e6ebf2"
                  />
                  <rect
                    x="74"
                    y="92"
                    width="34"
                    height="6"
                    rx="3"
                    fill="#e9edf3"
                  />
                  <circle
                    cx="146"
                    cy="38"
                    r="7"
                    fill="#dfe5ec"
                  />
                  <path
                    d="M150 8c3 0 5 3 5 6 0 5-5 12-5 12s-5-7-5-12c0-3 2-6 5-6z"
                    fill="#f5c518"
                  />
                  <circle
                    cx="150"
                    cy="14"
                    r="2.4"
                    fill="#fff"
                  />
                </svg>
                <p>{{ $t('fiatNoCard', { coin }) }}</p>
              </div>

              <div class="fiat-amount">
                <p class="fiat-label">{{ $t('fiatWithdrawAmount') }}</p>
                <p class="fiat-available">{{ $t('availableBalance') }}: {{ formatAmount(available) }} {{ coin }}</p>
                <label class="fiat-input-line">
                  <input
                    v-model="amount"
                    :placeholder="$t('fiatAmountPlaceholder')"
                  /><b>{{ coin }}</b>
                </label>
                <div class="fiat-percent">
                  <button
                    v-for="percent in percents"
                    :key="percent"
                    type="button"
                    @click="fillPercent(percent)"
                  >
                    {{ percent }}%
                  </button>
                </div>
                <p
                  v-if="bank"
                  class="fiat-summary"
                >
                  {{ $t('fiatSummaryFee') }}<b>{{ active.fee ? `${active.fee} ${coin}` : $t('text227') }}</b>　{{ $t('fiatSummarySent') }}<b>{{ formatAmount(received) }} {{ coin }}</b>
                </p>
              </div>

              <button
                class="fiat-submit"
                type="button"
                @click="submit"
              >
                {{ $t('fiatSubmit') }}
              </button>
            </div>

            <div class="fiat-aside">
              <h3>{{ $t('withdrawNotes') }}</h3>
              <div class="fiat-aside-box">
                <p class="fiat-quota">{{ $t('withdrawQuota') }}{{ formatAmount(remaining) }}/{{ formatAmount(active.limit) }} {{ coin }}</p>
                <ul>
                  <li>{{ $t('fiatMinAmount', { min: active.min, coin }) }}</li>
                  <li>{{ $t('fiatArrivalTime') }}</li>
                  <li>{{ $t('withdrawNote2') }}</li>
                  <li>{{ $t('commonSecurityNote') }}</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 class="fiat-records-title">{{ $t('withdrawRecords') }}</h2>
          <div class="fiat-table-head">
            <span>{{ $t('text313') }}</span
            ><span>{{ $t('text308') }}</span><span>{{ $t('fiatWithdrawAmount') }}</span><span>{{ $t('withdrawFeeLabel') }}</span><span>{{ $t('fiatSentColumn') }}</span
            ><span>{{ $t('fiatCardColumn') }}</span><span>{{ $t('fiatCardTag') }}</span><span>{{ $t('fiatPayTime') }}</span><span>{{ $t('text063') }}</span
            ><span>{{ $t('text065') }}</span>
          </div>
          <div
            v-for="(record, index) in records"
            :key="index"
            class="fiat-row"
          >
            <span>{{ record.time }}</span
            ><span>{{ record.coin }}</span
            ><span>{{ formatAmount(record.amount) }}</span
            ><span>{{ formatAmount(record.fee) }}</span
            ><span>{{ formatAmount(record.sent) }}</span
            ><span>{{ record.account }}</span
            ><span>{{ record.tag }}</span
            ><span>{{ record.payTime }}</span
            ><span>{{ tr(record.status) }}</span
            ><span>—</span>
          </div>
          <div
            v-if="!records.length"
            class="fiat-empty"
          >
            {{ $t('text066') }}
          </div>
          <p class="fiat-footnote">
            * {{ $t('recordsFootnote') }}
            <a href="/bge/hk/zh-CN/user/report/wallet">{{ $t('recordsLink') }}</a>
          </p>
        </section>
      </main>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.fiat-main{padding:24px;flex:1;min-width:0}
.fiat-box{padding:24px 28px 32px;background:#fff}
.fiat-title{margin:0 0 40px;padding-left:12px;border-left:8px solid #ffd52a;font-size:22px;font-weight:600}
.fiat-columns{display:flex;gap:48px;align-items:flex-start}
.fiat-form{flex:1;min-width:0;max-width:775px}
.fiat-aside{width:340px;flex:0 0 340px;padding-left:44px;border-left:1px solid #edf0f4;align-self:stretch}
.fiat-aside h3{margin:0 0 16px;color:#303744;font-size:16px;font-weight:600}
.fiat-aside-box{padding:20px;background:#f4f7fa}
.fiat-quota{margin:0 0 12px;color:#c9a227;font-size:13px;font-weight:600}
.fiat-aside-box ul{margin:0;padding-left:16px;color:#6f7783;font-size:13px;line-height:1.9}
.fiat-aside-box li{margin:0 0 8px}
.fiat-label{margin:0 0 12px;color:#303744;font-size:15px}
.fiat-select{width:100%}
.fiat-select :deep(.el-select__wrapper){min-height:46px;border-radius:4px;box-shadow:0 0 0 1px #dfe4ec inset}
.coin-option{display:inline-flex;align-items:center;gap:10px}
.coin-option i{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#eceff3;color:#8a94a6;font-size:11px;font-style:normal}
.coin-option small{color:#9ba3ae}
.fiat-card-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:34px 0 12px}
.fiat-card-head .fiat-label{margin:0}
.fiat-link{color:#d9a600;font-size:13px;text-decoration:none}
.fiat-link:hover{color:#b98c00}
.fiat-card{display:flex;align-items:center;gap:16px;padding:14px 18px;border:1px solid #dfe4ec;border-radius:4px;color:#303744;font-size:14px}
.fiat-card b{font-weight:400}
.fiat-card span{color:#8a94a6}
.fiat-tag{margin-left:auto;white-space:nowrap}
.coin-badge{display:inline-flex;align-items:center;justify-content:center;width:26px;height:24px;border-radius:4px;background:#fdf3d0;color:#e0a800;font-size:11px;font-style:normal;flex:0 0 auto}
.fiat-no-card{padding:44px 0 30px;text-align:center}
.fiat-illustration{display:block;margin:0 auto;width:170px;height:120px}
.fiat-no-card p{margin:10px 0 0;color:#9aa2ad;font-size:13px}
.fiat-amount{margin-top:44px}
.fiat-available{margin:0 0 6px;text-align:right;color:#6f7783;font-size:13px}
.fiat-input-line{display:flex;align-items:center;gap:12px;padding:0 0 12px;border-bottom:1px solid #dfe4ec}
.fiat-input-line input{flex:1;min-width:0;border:0;outline:none;background:transparent;color:#303744;font-size:15px}
.fiat-input-line input::placeholder{color:#b6bcc6}
.fiat-input-line b{color:#6f7783;font-size:15px;font-weight:400}
.fiat-percent{display:flex;gap:8px;margin-top:14px}
.fiat-percent button{min-width:38px;height:22px;padding:0 6px;border:1px solid #e2e6ed;border-radius:2px;background:#f7f8fa;color:#6f7783;font-size:12px;cursor:pointer}
.fiat-percent button:hover{border-color:#f0d000;color:#d9a600}
.fiat-summary{margin:16px 0 0;color:#6f7783;font-size:13px}
.fiat-summary b{color:#303744;font-weight:500}
.fiat-submit{width:100%;height:48px;margin-top:28px;border:0;border-radius:4px;background:#f5ff18;color:#111;font-size:16px;font-weight:600;cursor:pointer}
.fiat-submit:hover{background:#e8f000}
.fiat-records-title{margin:56px 0 20px;padding-left:12px;border-left:8px solid #ffd52a;font-size:20px;font-weight:600}
.fiat-table-head,.fiat-row{display:grid;grid-template-columns:1.2fr .6fr 1fr .7fr 1fr 1.5fr 1fr .9fr .7fr .5fr;align-items:center;gap:8px;padding:0 12px;text-align:center}
.fiat-table-head{height:44px;background:#f4f6f9;color:#697585;font-size:13px}
.fiat-row{min-height:58px;border-bottom:1px solid #edf0f4;color:#697585;font-size:13px}
.fiat-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fiat-empty{padding:60px 0;color:#9aa2ad;font-size:14px;text-align:center}
.fiat-footnote{margin:18px 0 0;color:#9aa2ad;font-size:12px}
.fiat-footnote a{color:#d9a600;text-decoration:none}
@media (max-width:1200px){.fiat-columns{flex-direction:column;gap:24px;align-items:stretch}.fiat-aside{width:100%;flex:1 1 auto;padding-left:0;border-left:0}.fiat-form{max-width:none}}
</style>
