<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import Footer from './Footer.vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import { i18n, tr } from './i18n'

const t = (key, params) => i18n.global.t(key, params)

const coins = [
  { symbol: 'ETH', name: '以太坊', glyph: '◆', network: 'eth-', chain: 'ETH', min: 0.00001, confirmations: 12 },
  { symbol: 'BTC', name: 'Bitcoin', glyph: '₿', network: 'btc-', chain: 'BTC', min: 0.00005, confirmations: 2 },
  { symbol: 'USDT', name: '泰达币', glyph: '₮', network: 'trc20-', chain: 'TRC20', min: 10, confirmations: 20 },
  { symbol: 'USDC', name: 'USD Coin', glyph: '$', network: 'erc20-', chain: 'ERC20', min: 10, confirmations: 12 },
  { symbol: 'SOL', name: 'Solana', glyph: '◎', network: 'sol-', chain: 'SOL', min: 0.01, confirmations: 32 },
]
const requested = decodeURIComponent(window.location.pathname.split('/deposit/')[1] || 'ETH').toUpperCase()
const coin = ref(coins.some((item) => item.symbol === requested) ? requested : 'ETH')
const active = computed(() => coins.find((item) => item.symbol === coin.value))
const wallet = ref(JSON.parse(localStorage.getItem('bge-wallet-record') || 'null'))
const verified = computed(() => wallet.value?.status === '已认证' && wallet.value?.coin === coin.value)
const records = ref([])

function changeCoin(value) {
  window.location.href = `/bge/hk/zh-CN/user/crypto/deposit/${value}`
}
async function copyAddress() {
  try {
    await navigator.clipboard.writeText(wallet.value?.address ?? '')
  } catch {
    /* The demo keeps working when the clipboard is unavailable. */
  }
  ElMessage.success(t('depositCopied'))
}
</script>

<template>
  <div class="user-page">
    <SiteHeader active="assets" />
    <div class="user-layout">
      <UserSidebar />
      <main class="deposit-main">
        <section class="deposit-box">
          <h1 class="deposit-title">{{ $t('depositTitle') }}</h1>
          <div class="deposit-notice">
            <span class="deposit-notice-icon"><el-icon><InfoFilled /></el-icon></span>{{ $t('text277') }}<a href="/bge/hk/zh-CN/user/payment/crypto">{{ $t('withdrawGoVerify') }}</a>
          </div>
          <div class="deposit-columns">
            <div class="deposit-form">
              <p class="deposit-label">{{ $t('depositCoin') }}</p>
              <el-select
                :model-value="coin"
                class="deposit-select"
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

              <p class="deposit-label deposit-network-label">{{ $t('depositNetworkAddress') }}</p>
              <span class="network-chip">{{ active.network }}</span>

              <div
                v-if="!verified"
                class="deposit-unverified"
              >
                <svg
                  class="deposit-illustration"
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
                <p>{{ $t('withdrawUnverified', { coin, network: active.network }) }}</p>
                <a
                  class="deposit-verify"
                  href="/bge/hk/zh-CN/user/payment/crypto/add"
                  >{{ $t('withdrawVerifyNow') }}</a
                >
              </div>

              <div
                v-else
                class="deposit-address"
              >
                <span class="deposit-qr" />
                <div class="deposit-address-info">
                  <p>{{ $t('depositAddressLabel') }}</p>
                  <b>{{ wallet.address }}</b>
                  <button
                    class="deposit-copy"
                    type="button"
                    @click="copyAddress"
                  >
                    {{ $t('depositCopyAddress') }}
                  </button>
                  <small>{{ wallet.remark && wallet.remark !== '—' ? $t('depositRemark', { remark: wallet.remark }) : '' }}</small>
                </div>
              </div>
            </div>

            <div class="deposit-aside">
              <h3>{{ $t('depositNotes') }}</h3>
              <div class="deposit-aside-box">
                <p class="deposit-min">{{ $t('depositMinLabel', { min: active.min, coin }) }}</p>
                <ul>
                  <li>{{ $t('depositNote1', { coin }) }}</li>
                  <li>{{ $t('depositNote2', { confirmations: active.confirmations }) }}</li>
                  <li>{{ $t('depositNote3', { min: active.min, coin }) }}</li>
                  <li>{{ $t('depositNote4') }}</li>
                  <li>{{ $t('commonSecurityNote') }}</li>
                </ul>
              </div>
              <h3 class="deposit-faq-title">{{ $t('addressFaqTitle') }}</h3>
              <div class="deposit-aside-box">
                <p class="faq-q">{{ $t('addressFaqQ1') }}</p>
                <p class="faq-a">{{ $t('addressFaqA1') }}</p>
                <p class="faq-q">{{ $t('addressFaqQ2') }}</p>
                <p class="faq-a">{{ $t('addressFaqA2') }}</p>
                <p class="faq-q">{{ $t('addressFaqQ3') }}</p>
                <p class="faq-a">{{ $t('addressFaqA3') }}</p>
              </div>
            </div>
          </div>

          <h2 class="deposit-records-title">{{ $t('depositRecords') }}</h2>
          <div class="deposit-table-head">
            <span>{{ $t('text313') }}</span
            ><span>{{ $t('text314') }}</span><span>{{ $t('text285') }}</span><span>{{ $t('text315') }}</span
            ><span>{{ $t('text063') }}</span><span>{{ $t('text316') }}</span><span>{{ $t('text286') }}</span>
          </div>
          <div
            v-for="(record, index) in records"
            :key="index"
            class="deposit-row"
          >
            <span>{{ record.time }}</span
            ><span>{{ record.coin }}</span
            ><span>{{ record.network }}</span
            ><span>{{ record.amount }}</span
            ><span>{{ record.status }}</span
            ><span>{{ record.from }}</span
            ><span>{{ record.remark }}</span>
          </div>
          <div
            v-if="!records.length"
            class="deposit-empty"
          >
            {{ $t('text066') }}
          </div>
          <p class="deposit-footnote">
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
.deposit-main{padding:24px;flex:1;min-width:0}
.deposit-box{padding:24px 28px 32px;background:#fff}
.deposit-title{margin:0 0 26px;padding-left:12px;border-left:8px solid #ffd52a;font-size:22px;font-weight:600}
.deposit-notice{display:flex;align-items:center;gap:8px;padding:14px 18px;border:1px solid #f2d27a;background:#fffbe9;color:#8a7a4b;font-size:13px}
.deposit-notice a{margin-left:auto;color:#d9a600;text-decoration:none;white-space:nowrap}
.deposit-notice-icon{display:inline-flex;color:#e6a23c}
.deposit-columns{display:flex;gap:48px;margin-top:30px;align-items:flex-start}
.deposit-form{flex:1;min-width:0;max-width:720px}
.deposit-aside{width:340px;flex:0 0 340px;padding-left:44px;border-left:1px solid #edf0f4;align-self:stretch}
.deposit-aside h3{margin:0 0 16px;color:#303744;font-size:16px;font-weight:600}
.deposit-faq-title{margin-top:32px}
.deposit-aside-box{padding:20px;background:#f4f7fa}
.deposit-min{margin:0 0 12px;color:#c9a227;font-size:13px;font-weight:600}
.deposit-aside-box ul{margin:0;padding-left:16px;color:#6f7783;font-size:13px;line-height:1.9}
.deposit-aside-box li{margin:0 0 8px}
.faq-q{margin:0 0 6px;color:#c9a227;font-size:13px}
.faq-q::before{content:'•';margin-right:6px}
.faq-a{margin:0 0 14px;color:#6f7783;font-size:13px;line-height:1.8}
.faq-a:last-child{margin-bottom:0}
.deposit-label{margin:0 0 10px;color:#303744;font-size:15px}
.deposit-select{width:100%}
.deposit-select :deep(.el-select__wrapper){min-height:46px;border-radius:4px;box-shadow:0 0 0 1px #dfe4ec inset}
.coin-option{display:inline-flex;align-items:center;gap:10px}
.coin-option i{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#eceff3;color:#8a94a6;font-size:11px;font-style:normal}
.coin-option small{color:#9ba3ae}
.deposit-network-label{margin:34px 0 12px}
.network-chip{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:2px;background:#f0f2f5;color:#4a5560;font-size:13px}
.deposit-unverified{margin-top:28px;border:1px solid #edf0f4;text-align:center}
.deposit-illustration{display:block;margin:56px auto 26px;width:220px;height:160px}
.deposit-unverified p{margin:0 0 60px;color:#171d27;font-size:17px;font-weight:500}
.deposit-verify{display:block;height:52px;line-height:52px;background:#f5ff18;color:#111;font-size:16px;text-decoration:none}
.deposit-verify:hover{background:#e8f000}
.deposit-address{display:flex;align-items:center;gap:32px;margin-top:28px;padding:32px;border:1px solid #edf0f4}
.deposit-qr{display:block;width:132px;height:132px;flex:0 0 132px;background:repeating-conic-gradient(#111 0 25%,#fff 0 50%) 0/12px 12px}
.deposit-address-info{min-width:0}
.deposit-address-info p{margin:0 0 10px;color:#6f7783;font-size:13px}
.deposit-address-info b{display:block;color:#171d27;font-size:14px;font-weight:500;word-break:break-all}
.deposit-copy{margin-top:14px;height:34px;padding:0 18px;border:1px solid #e1ad00;border-radius:6px;background:#fff;color:#d9a600;font-size:13px;cursor:pointer}
.deposit-copy:hover{background:#fffdf0}
.deposit-address-info small{display:block;margin-top:12px;color:#9aa2ad;font-size:12px}
.deposit-records-title{margin:44px 0 20px;padding-left:12px;border-left:8px solid #ffd52a;font-size:20px;font-weight:600}
.deposit-table-head,.deposit-row{display:grid;grid-template-columns:1.3fr .8fr .9fr 1fr .8fr 2fr 1fr;align-items:center;gap:8px;padding:0 12px;text-align:center}
.deposit-table-head{height:44px;background:#f4f6f9;color:#697585;font-size:13px}
.deposit-row{min-height:58px;border-bottom:1px solid #edf0f4;color:#697585;font-size:13px}
.deposit-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.deposit-empty{padding:60px 0;color:#9aa2ad;font-size:14px;text-align:center}
.deposit-footnote{margin:18px 0 0;color:#9aa2ad;font-size:12px}
.deposit-footnote a{color:#d9a600;text-decoration:none}
@media (max-width:1200px){.deposit-columns{flex-direction:column;gap:24px;align-items:stretch}.deposit-aside{width:100%;flex:1 1 auto;padding-left:0;border-left:0}}
</style>
