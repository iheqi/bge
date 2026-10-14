<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { formatMoney } from './currency'
import { i18n, tr } from './i18n'
import Footer from './Footer.vue'
import { ElMessage } from 'element-plus'
import { kycVerified } from './session'
import {
  ArrowDown,
  Grid,
  Wallet,
  Tickets,
  User,
  Lock,
  Briefcase,
  Connection,
  Search,
  Sort,
} from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
const accountParam = new URLSearchParams(window.location.search).get('account')
const props = defineProps({ assets: Boolean })
const accountTab = ref(
  accountParam === 'trade' || accountParam === 'fund'
    ? accountParam
    : props.assets
      ? 'fund'
      : 'total',
)
const coins = [
  ['$', 'USD', '美元', '法币'],
  ['◆', 'ETH', '以太坊', ''],
  ['$', 'USDC', 'USD Coin', '仅PI'],
  ['₮', 'USDT', '泰达币', '仅PI'],
  ['HK$', 'HKD', '港币', '法币'],
  ['₿', 'BTC', 'Bitcoin', ''],
  ['◎', 'SOL', 'Solana', ''],
]
// Demo balances and USD prices behind the transfer flow, so a transfer always has funds to move.
const prices = { USD: 1, HKD: 0.128, ETH: 3450, USDC: 1, USDT: 1, BTC: 96000, SOL: 150 }
const balances = ref({
  fund: { USD: 12500, HKD: 68000, ETH: 2.4, USDC: 5600, USDT: 3200, BTC: 0.08, SOL: 0.02 },
  trade: { USD: 3000, HKD: 5000, ETH: 0.35, USDC: 420, USDT: 180, BTC: 0.012, SOL: 0.01 },
})
// Rows under this USD value answer the 隐藏小额资产 switch.
const SMALL_ASSET_USD = 10
const hideSmall = ref(false)
const visibleCoins = computed(() =>
  hideSmall.value
    ? coins.filter((coin) => balanceOf(activeAccount.value, coin[1]) * (prices[coin[1]] ?? 0) >= SMALL_ASSET_USD)
    : coins,
)
const activeAccount = computed(() => (accountTab.value === 'trade' ? 'trade' : 'fund'))
const accountName = (account) => tr(account === 'trade' ? '交易账户' : '资金账户')
const balanceOf = (account, symbol) => balances.value[account][symbol] ?? 0
const btcValue = (symbol, amount) => (amount * (prices[symbol] ?? 0)) / prices.BTC
const accountBtc = (account) => coins.reduce((sum, coin) => sum + btcValue(coin[1], balanceOf(account, coin[1])), 0)
const formatAmount = (value) => Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 8 })
const withdrawHref = (symbol) =>
  ['USD', 'HKD'].includes(symbol)
    ? `/bge/hk/zh-CN/user/fiat/withdraw/${symbol}`
    : `/bge/hk/zh-CN/user/crypto/withdraw/${symbol}`
const depositHref = (symbol) =>
  ['USD', 'HKD'].includes(symbol)
    ? `/bge/hk/zh-CN/user/fiat/deposit/${symbol}`
    : `/bge/hk/zh-CN/user/crypto/deposit/${symbol}`
const activeBtc = computed(() => accountBtc(activeAccount.value))
const totalBtc = computed(() => accountBtc('fund') + accountBtc('trade'))

const transferOpen = ref(false)
const transferFrom = ref('fund')
const transferCoin = ref('BTC')
const transferAmount = ref('')
const transferTo = computed(() => (transferFrom.value === 'fund' ? 'trade' : 'fund'))
const transferAvailable = computed(() => balanceOf(transferFrom.value, transferCoin.value))
const coinOf = (symbol) => coins.find((coin) => coin[1] === symbol) ?? coins[0]

function openTransfer(symbol) {
  transferFrom.value = activeAccount.value
  transferCoin.value = symbol
  transferAmount.value = ''
  transferOpen.value = true
}
function swapTransfer() {
  transferFrom.value = transferTo.value
}
function fillTransferAmount() {
  transferAmount.value = String(transferAvailable.value)
}
function confirmTransfer() {
  const amount = Number(transferAmount.value)
  if (!Number.isFinite(amount) || amount <= 0)
    return ElMessage.warning(i18n.global.t('transferAmountPlaceholder'))
  if (amount > transferAvailable.value)
    return ElMessage.warning(i18n.global.t('insufficientBalance'))
  balances.value[transferFrom.value][transferCoin.value] = transferAvailable.value - amount
  balances.value[transferTo.value][transferCoin.value] = balanceOf(transferTo.value, transferCoin.value) + amount
  transferOpen.value = false
  ElMessage.success(i18n.global.t('transferSuccess'))
}
</script>
<template>
  <div class="user-page">
    <SiteHeader active="assets" />
    <div class="user-layout">
      <aside
        v-if="assets"
        class="asset-sidebar"
      >
        <a
          class="asset-menu-link"
          :class="{ sel: accountTab === 'fund' }"
          href="/bge/hk/zh-CN/user/assets?account=fund"
          ><el-icon><Wallet /></el-icon>{{ $t('text333') }}</a
        ><a
          class="asset-menu-link"
          :class="{ sel: accountTab === 'trade' }"
          href="/bge/hk/zh-CN/user/assets?account=trade"
          ><el-icon><Tickets /></el-icon>{{ $t('text334') }}</a
        >
      </aside>
      <UserSidebar v-else />
      <main class="user-main">
        <section
          v-if="!assets"
          class="profile"
        >
          <div class="avatar big">
            <img
              src="/avatar.png"
              :alt="$t('text335')"
              width="44"
              height="44"
            />
          </div>
          <div>
            <h3>heqi**gic@gmail.com</h3>
            <p>UID 8395618828　<span>▢</span>{{ $t('text336') }}</p>
          </div>
        </section>
        <template v-if="!assets"
          ><section class="overview">
            <h2>{{ $t('text337') }}</h2>
            <div class="tabs">
              <b
                :class="{ active: accountTab === 'total' }"
                role="button"
                tabindex="0"
                @click="accountTab = 'total'"
                @keydown.enter="accountTab = 'total'"
              >{{ $t('text338') }}</b
              ><span
                :class="{ active: accountTab === 'fund' }"
                role="button"
                tabindex="0"
                @click="accountTab = 'fund'"
                @keydown.enter="accountTab = 'fund'"
              >{{ $t('text333') }}</span
              ><span
                :class="{ active: accountTab === 'trade' }"
                role="button"
                tabindex="0"
                @click="accountTab = 'trade'"
                @keydown.enter="accountTab = 'trade'"
              >{{ $t('text334') }}</span>
            </div>
            <p class="label">
              {{ accountTab === 'total' ? $t('text338') : tr(accountTab === 'fund' ? '资金账户' : '交易账户') }}{{ $t('text339') }}
            </p>
            <strong>{{ formatMoney(0, 'USD', 4) }}</strong>
            <div>
              <button>{{ $t('text275') }}</button><button class="muted">{{ $t('text276') }}</button>
            </div>
          </section>
          <div class="panels">
            <section>
              <h2>
                {{ $t('text294') }}<small>{{ $t('text340') }}</small>
              </h2>
              <div class="empty">{{ $t('text066') }}</div>
            </section>
            <section>
              <h2>
                {{ $t('text005') }}<small>{{ $t('text340') }}</small>
              </h2>
              <div class="empty">{{ $t('text066') }}</div>
            </section>
          </div><div v-if="!assets" class="dashboard-cards">
            <section class="dashboard-card activity-card">
              <header><h2>{{ $t('text047') }}</h2><a href="/bge/hk/zh-CN/user/security">{{ $t('text340') }}</a></header>
              <div class="activity-row"><span>OSX Chrome 154.0.0.0<small>2026-10-08 15:33:28</small></span><b>116.49.145.110<small>{{ tr('登录') }}</small></b></div>
              <div class="activity-row"><span>OSX Chrome 152.0.0.0<small>2026-09-23 15:55:22</small></span><b>116.49.145.110<small>{{ tr('登录') }}</small></b></div>
            </section>
            <section class="dashboard-card security-card">
              <header><h2>{{ $t('dashSecurityCenter') }}</h2><a href="/bge/hk/zh-CN/user/security">{{ $t('text340') }}</a></header>
              <div class="security-grid"><a href="/bge/hk/zh-CN/user/security"><b>{{ $t('dashEmailVerify') }}</b><small>{{ tr('更改邮箱') }}</small></a><a href="/bge/hk/zh-CN/user/security"><b>{{ $t('dashPhoneVerify') }}</b><small class="warning">{{ tr('未绑定') }}</small></a><a href="/bge/hk/zh-CN/user/security"><b>{{ $t('dashGaVerify') }}</b><small>{{ tr('更改GA') }}</small></a><a href="/bge/hk/zh-CN/user/security"><b>{{ tr('登录密码') }}</b><small>{{ tr('更改密码') }}</small></a></div>
            </section>
            <section class="dashboard-card quick-links">
              <a href="/bge/hk/zh-CN/user/api"><b>{{ $t('text013') }}</b><span>›</span></a>
              <a href="/bge/hk/zh-CN/user/kyc"><b>{{ $t('text009') }}</b><span>›</span></a>
            </section>
          </div></template
        ><template v-else
          ><section class="asset-banner">
            <span>{{ $t('text341') }}</span
            ><strong
              >{{ totalBtc.toFixed(8) }} BTC <small>≈ {{ formatMoney(totalBtc * prices.BTC, 'USD', 4) }}</small></strong
            ><a>{{ $t('text342') }}</a>
          </section>
          <div
            v-if="kycVerified"
            class="asset-panels"
          >
            <section class="asset-panel risk-panel">
              <h3>{{ $t('assetRisk') }}</h3>
              <div class="risk-level">
                <b>{{ $t('assetRiskLevel') }}</b><span class="risk-bars"><i /><i /><i /><i /><i /></span>
              </div>
              <p class="risk-date">2026-08-18</p>
            </section>
            <section class="asset-panel quota-panel">
              <header>
                <h3>{{ $t('assetQuota') }}</h3>
                <a href="/bge/hk/zh-CN/quote-limit">{{ $t('assetQuotaLink') }}</a>
              </header>
              <div class="quota-grid">
                <div><b>HKD 3,000,000,000.00</b><small>{{ $t('assetQuotaHolding') }}</small></div>
                <div><b class="over">{{ $t('assetQuotaOver') }} HKD 2,056,268,000,953.32</b><small>{{ $t('assetQuotaHoldingLeft') }}</small></div>
                <div><b>HKD 1,500,000,000.00</b><small>{{ $t('assetQuotaDaily') }}</small></div>
                <div><b>HKD 1,500,000,000.00</b><small>{{ $t('assetQuotaDailyLeft') }}</small></div>
              </div>
            </section>
          </div>
          <section class="asset-box">
            <h2 class="asset-account-title">{{ accountName(activeAccount) }}</h2>
            <p class="label">{{ accountName(activeAccount) }}{{ $t('text343') }}</p>
            <strong
              >{{ activeBtc.toFixed(8) }} BTC <small>≈ {{ formatMoney(activeBtc * prices.BTC, 'USD', 4) }}</small></strong
            >
            <div class="asset-tools">
              <el-checkbox
                v-model="hideSmall"
                class="asset-hide-small"
                >{{ $t('hideSmallAssets') }}</el-checkbox
              >
              <div class="search">
                <input :placeholder="$t('text283')" /><el-icon><Search /></el-icon>
              </div>
            </div>
            <div class="coin-head">
              <span>{{ $t('text345') }}</span
              ><span>{{ $t('text346') }}</span
              ><span>{{ $t('text347') }}</span
              ><span>{{ $t('text348') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div
              v-for="coin in visibleCoins"
              :key="coin[1]"
              class="coin-row"
            >
              <div class="coin-name">
                <i>{{ tr(coin[0]) }}</i
                ><span
                  >{{ tr(coin[1]) }} <em v-if="coin[3]">{{ tr(coin[3]) }}</em
                  ><small>{{ tr(coin[2]) }}</small></span
                >
              </div>
              <b>{{ formatAmount(balanceOf(activeAccount, coin[1])) }}</b><b>0</b
              ><b
                >{{ btcValue(coin[1], balanceOf(activeAccount, coin[1])).toFixed(8) }}<small>≈ {{ formatMoney(balanceOf(activeAccount, coin[1]) * (prices[coin[1]] ?? 0), 'USD', 4) }}</small></b
              >
              <div>
                <a
                  v-if="activeAccount !== 'trade'"
                  :href="depositHref(coin[1])"
                  >{{ $t('text275') }}</a
                ><a
                  v-if="activeAccount !== 'trade'"
                  :href="withdrawHref(coin[1])"
                  >{{ $t('text276') }}</a
                ><a
                  href="#"
                  @click.prevent="openTransfer(coin[1])"
                  >{{ $t('text309') }}</a
                >
              </div>
            </div>
            <div
              v-if="!visibleCoins.length"
              class="asset-empty"
            >
              {{ $t('text066') }}
            </div>
          </section></template
        >
      </main>
    </div>
    <div
      v-if="transferOpen"
      class="transfer-mask"
      @click.self="transferOpen = false"
    >
      <section
        class="transfer-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('text309')"
      >
        <h2>{{ $t('text309') }}</h2>
        <button
          class="transfer-close"
          type="button"
          :aria-label="$t('text183')"
          @click="transferOpen = false"
        >
          ✕
        </button>
        <a
          class="transfer-records"
          href="/bge/hk/zh-CN/user/report/wallet"
          >{{ $t('transferRecords') }} ›</a
        >
        <div class="transfer-route">
          <div class="route-item">
            <i class="route-dot" /><span>{{ $t('transferFrom') }}</span
            ><b>{{ accountName(transferFrom) }}</b>
          </div>
          <div class="route-item">
            <i class="route-dot dot-to" /><span>{{ $t('transferTo') }}</span
            ><b>{{ accountName(transferTo) }}</b>
          </div>
          <button
            class="route-swap"
            type="button"
            :aria-label="$t('text309')"
            @click="swapTransfer"
          >
            <el-icon><Sort /></el-icon>
          </button>
        </div>
        <p class="transfer-label">{{ $t('text345') }}</p>
        <el-select
          v-model="transferCoin"
          class="transfer-select"
        >
          <template #label="{ value }">
            <span class="transfer-coin"
              ><i>{{ tr(coinOf(value)[0]) }}</i
              ><b>{{ tr(value) }}</b
              ><small>{{ tr(coinOf(value)[2]) }}</small></span
            >
          </template>
          <el-option
            v-for="coin in coins"
            :key="coin[1]"
            :label="coin[1]"
            :value="coin[1]"
          >
            <span class="transfer-coin"
              ><i>{{ tr(coin[0]) }}</i
              ><b>{{ tr(coin[1]) }}</b
              ><small>{{ tr(coin[2]) }}</small></span
            >
          </el-option>
        </el-select>
        <div class="transfer-qty">
          <p class="transfer-label">{{ $t('text315') }}</p>
          <span class="transfer-available"
            >{{ $t('availableBalance') }} {{ formatAmount(transferAvailable) }} {{ transferCoin }}</span
          >
        </div>
        <el-input
          v-model="transferAmount"
          class="transfer-input"
          :placeholder="$t('transferAmountPlaceholder')"
        >
          <template #suffix>
            <button
              class="transfer-all"
              type="button"
              @click="fillTransferAmount"
            >
              {{ $t('text165') }}
            </button>
          </template>
        </el-input>
        <div class="transfer-actions">
          <button
            class="transfer-cancel"
            type="button"
            @click="transferOpen = false"
          >
            {{ $t('text183') }}
          </button>
          <button
            class="transfer-confirm"
            type="button"
            @click="confirmTransfer"
          >
            {{ $t('transferConfirm') }}
          </button>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.asset-hide-small{--el-checkbox-checked-bg-color:#f0d000;--el-checkbox-checked-input-border-color:#f0d000;--el-checkbox-checked-icon-color:#111;--el-checkbox-input-border-color-hover:#f0d000}
.asset-hide-small :deep(.el-checkbox__label){padding-left:8px;color:#6f7783;font-size:13px;font-weight:400}
.asset-panels{display:grid;grid-template-columns:1fr 1.72fr;gap:16px;margin-top:16px}
.asset-empty{padding:60px 0;color:#9aa2ad;font-size:14px;text-align:center}
.asset-panel{padding:24px 28px;border-radius:5px;background:#fff}
.asset-panel h3{margin:0;color:#171d27;font-size:16px;font-weight:600}
.risk-level{display:flex;align-items:center;gap:14px;margin-top:26px}
.risk-level b{color:#171d27;font-size:15px;font-weight:500}
.risk-bars{display:inline-flex;gap:3px}
.risk-bars i{display:block;width:6px;height:15px;background:#f5c518}
.risk-date{margin:14px 0 0;color:#9aa2ad;font-size:12px}
.quota-panel header{display:flex;align-items:center;justify-content:space-between;gap:16px}
.quota-panel header a{color:#d9a600;font-size:13px;text-decoration:none}
.quota-panel header a:hover{color:#b98c00}
.quota-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:26px}
.quota-grid b{display:block;color:#171d27;font-size:15px;font-weight:500}
.quota-grid b.over{color:#e0443a}
.quota-grid small{display:block;margin-top:8px;color:#9aa2ad;font-size:12px}
.transfer-mask{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;padding:24px;background:rgb(0 0 0 / 50%)}
.transfer-modal{position:relative;width:484px;max-width:100%;padding:30px 32px 40px;border-radius:4px;background:#fff;box-shadow:0 10px 30px rgb(0 0 0 / 25%)}
.transfer-modal h2{margin:0;color:#171d27;font-size:20px;font-weight:500;text-align:center}
.transfer-close{position:absolute;top:16px;right:20px;padding:0;border:0;background:none;color:#b0b6c0;font-size:18px;line-height:1;cursor:pointer}
.transfer-close:hover{color:#6f7783}
.transfer-records{display:block;margin:26px 0 8px;color:#e1b600;font-size:13px;text-align:right;text-decoration:none}
.transfer-records:hover{color:#c9a300}
.transfer-route{position:relative;display:flex;flex-direction:column;gap:26px;padding:20px;background:#f6f6f6}
.transfer-route::before{content:'';position:absolute;left:23px;top:33px;bottom:33px;border-left:1px dashed #c4cad4}
.route-item{position:relative;z-index:1;display:flex;align-items:center;gap:12px;color:#8a94a6;font-size:15px}
.route-item b{color:#171d27;font-weight:400}
.route-dot{width:6px;height:6px;border-radius:50%;background:#2c3a52}
.route-dot.dot-to{background:#f0cf00}
.route-swap{position:absolute;right:18px;top:50%;display:flex;align-items:center;justify-content:center;width:32px;height:32px;transform:translateY(-50%);border:0;border-radius:50%;background:#f5ff18;color:#111;font-size:16px;cursor:pointer}
.route-swap:hover{background:#e8f000}
.transfer-label{margin:26px 0 10px;color:#171d27;font-size:15px}
.transfer-qty{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin:26px 0 10px}
.transfer-qty .transfer-label{margin:0}
.transfer-available{color:#8a94a6;font-size:13px}
.transfer-select,.transfer-input{width:100%}
.transfer-select :deep(.el-select__wrapper),.transfer-input :deep(.el-input__wrapper){min-height:44px;border-radius:4px;box-shadow:0 0 0 1px #e2e6ed inset}
.transfer-input :deep(.el-input__inner){font-size:15px}
.transfer-coin{display:inline-flex;align-items:center;gap:8px}
.transfer-coin i{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#eceff3;color:#8a94a6;font-size:11px;font-style:normal}
.transfer-coin b{color:#171d27;font-weight:400;font-size:15px}
.transfer-coin small{color:#9ba3ae;font-size:13px}
.transfer-all{padding:0;border:0;background:none;color:#e1b600;font-size:14px;cursor:pointer}
.transfer-all:hover{color:#c9a300}
.transfer-actions{display:flex;justify-content:center;gap:80px;margin-top:38px}
.transfer-cancel,.transfer-confirm{width:136px;height:40px;border:0;border-radius:4px;font-size:15px;cursor:pointer}
.transfer-cancel{background:#eef0f5;color:#171d27}
.transfer-cancel:hover{background:#e4e8ee}
.transfer-confirm{background:#f5ff18;color:#111;font-weight:600}
.transfer-confirm:hover{background:#e8f000}
@media (max-width:700px){.transfer-actions{gap:24px}.transfer-modal{padding:24px 20px 30px}}
</style>
