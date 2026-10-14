<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import Footer from './Footer.vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { i18n, tr } from './i18n'

const t = (key, params) => i18n.global.t(key, params)
import { CopyDocument, InfoFilled, UploadFilled, WarningFilled } from '@element-plus/icons-vue'

const coins = [
  {
    symbol: 'HKD',
    name: '港币',
    glyph: 'HK$',
    min: 10,
    account: {
      holder: 'BGE Digital Assets Limited',
      bank: '渣打银行（香港）',
      number: '8888989921',
      branch: '香港中环金融街 8 号',
    },
  },
  {
    symbol: 'USD',
    name: '美元',
    glyph: '$',
    min: 10,
    account: {
      holder: 'BGE Digital Assets Limited',
      bank: 'Standard Chartered Bank (HK)',
      number: '8888989922',
      branch: '8 Finance Street, Central, Hong Kong',
    },
  },
]
const requested = decodeURIComponent(window.location.pathname.split('/deposit/')[1] || 'HKD').toUpperCase()
const coin = ref(coins.some((item) => item.symbol === requested) ? requested : 'HKD')
const active = computed(() => coins.find((item) => item.symbol === coin.value))
const bankRows = computed(() => [
  { label: 'depRow1', value: active.value.account.holder },
  { label: 'depRow2', value: active.value.account.bank },
  { label: 'depRow3', value: active.value.account.number },
  { label: 'depRow4', value: active.value.account.branch },
])
const bank = ref(JSON.parse(localStorage.getItem('bge-bank-record') || 'null'))
const records = ref([])
const amount = ref('')
const proofName = ref('')
const showSample = ref(false)
const docsCollapsed = ref(false)
const fileInput = ref(null)
const formatAmount = (value) => Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })
const maskedAccount = computed(() => {
  const account = bank.value?.account ?? ''
  return account.length > 4 ? `**** **** **** ${account.slice(-4)}` : account
})

function changeCoin(value) {
  window.location.href = `/bge/hk/zh-CN/user/fiat/deposit/${value}`
}
async function copyValue(value) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    /* The demo keeps working when the clipboard is unavailable. */
  }
  ElMessage.success(t('depCopied'))
}
function pickFile() {
  fileInput.value?.click()
}
function onFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  proofName.value = file.name
}
function submit() {
  const value = Number(amount.value)
  if (!bank.value) return ElMessage.warning(t('fiatNoCard', { coin: coin.value }))
  if (!Number.isFinite(value) || value <= 0) return ElMessage.warning(t('depAmountPlaceholder'))
  if (value < active.value.min) return ElMessage.warning(t('depMinMessage', { min: `${active.value.min}.00`, coin: coin.value }))
  if (!proofName.value) return ElMessage.warning(t('depProofRequired'))
  records.value.unshift({
    time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    coin: coin.value,
    amount: value,
    account: maskedAccount.value,
    tag: bank.value?.tag || '—',
    status: '处理中',
  })
  amount.value = ''
  proofName.value = ''
  ElMessage.success(t('depSubmitted'))
}
</script>

<template>
  <div class="user-page">
    <SiteHeader active="assets" />
    <div class="user-layout">
      <UserSidebar />
      <main class="dep-main">
        <section class="dep-box">
          <h1 class="dep-title">{{ $t('fiatDepositTitle') }}</h1>
          <div class="dep-columns">
            <div class="dep-step">
              <span class="dep-badge">Step 1</span>
              <div class="dep-hint">
                <svg
                  class="dep-hint-icon"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <rect
                    x="6"
                    y="10"
                    width="30"
                    height="22"
                    rx="4"
                    fill="#f7fafc"
                    stroke="#cfe0ea"
                    stroke-width="1.6"
                  />
                  <rect
                    x="6"
                    y="16"
                    width="30"
                    height="5"
                    fill="#dceaf2"
                  />
                  <circle
                    cx="36"
                    cy="30"
                    r="9"
                    fill="#f5c518"
                  />
                  <text
                    x="36"
                    y="34"
                    text-anchor="middle"
                    font-size="11"
                    font-weight="700"
                    fill="#4b3b00"
                  >
                    $
                  </text>
                </svg>
                <div>
                  <b>{{ $t('depHint1') }}</b>
                  <small>{{ $t('depHint1Sub') }}</small>
                </div>
              </div>
              <p class="dep-label dep-coin-label">{{ $t('depositCoin') }}</p>
              <el-select
                :model-value="coin"
                class="dep-select"
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

              <div class="dep-receipt">
                <p class="dep-receipt-warn">
                  <el-icon><WarningFilled /></el-icon>{{ $t('depWarn') }}
                </p>
                <dl>
                  <div
                    v-for="row in bankRows"
                    :key="row.label"
                  >
                    <dt>{{ $t(row.label) }}</dt>
                    <dd>
                      {{ row.value }}<button
                        class="dep-copy"
                        type="button"
                        :aria-label="`${$t('depCopy')}${$t(row.label)}`"
                        @click="copyValue(row.value)"
                      >
                        <el-icon><CopyDocument /></el-icon>
                      </button>
                    </dd>
                  </div>
                </dl>
                <p class="dep-receipt-min">{{ $t('depMin', { min: `${active.min}.00`, coin }) }}</p>
              </div>

              <div class="dep-cards-head">
                <p class="dep-label">{{ $t('depChooseCard') }}</p>
                <a
                  class="dep-link"
                  href="/bge/hk/zh-CN/user/payment/fiat/detail?type=add"
                  >{{ $t('fiatAddCard') }}</a>
                >
              </div>
              <div
                v-if="bank"
                class="dep-card"
              >
                <i class="coin-badge">{{ active.glyph }}</i>
                <b>{{ maskedAccount }}</b>
                <span>{{ bank.name }}</span>
                <span class="dep-card-tag">{{ bank.tag || '—' }}</span>
              </div>
              <div
                v-else
                class="dep-no-card"
              >
                <svg
                  class="dep-no-card-icon"
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
            </div>

            <div class="dep-step dep-step-two">
              <span class="dep-badge">Step 2</span>
              <div class="dep-hint">
                <svg
                  class="dep-hint-icon"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <rect
                    x="10"
                    y="8"
                    width="26"
                    height="32"
                    rx="4"
                    fill="#f7fafc"
                    stroke="#cfe0ea"
                    stroke-width="1.6"
                  />
                  <path
                    d="M16 18h14M16 24h14M16 30h9"
                    stroke="#d3e2ec"
                    stroke-width="2.4"
                    stroke-linecap="round"
                  />
                  <path
                    d="M34 32l6 6-3 1-1 3z"
                    fill="#f5c518"
                  />
                </svg>
                <div>
                  <b>{{ $t('depHint2') }}</b>
                  <small>{{ $t('depHint2Sub') }}</small>
                </div>
              </div>
              <p class="dep-label dep-amount-label">{{ $t('depositAmount') }}</p>
              <label class="dep-input-line">
                <input
                  v-model="amount"
                  :placeholder="$t('depAmountPlaceholder')"
                /><b>{{ coin }}</b>
              </label>
              <p class="dep-note">* {{ $t('depNote') }}</p>

              <p class="dep-label dep-proof-label">{{ $t('depUploadProof') }} <el-icon class="dep-proof-info"><InfoFilled /></el-icon></p>
              <div class="dep-proof-actions">
                <button
                  class="dep-proof-upload"
                  type="button"
                  @click="pickFile"
                >
                  {{ $t('depUploadBtn') }}
                </button>
                <button
                  class="dep-proof-sample"
                  type="button"
                  @click="showSample = true"
                >
                  {{ $t('depSampleBtn') }}
                </button>
              </div>
              <button
                class="dep-dropzone"
                type="button"
                @click="pickFile"
              >
                <el-icon><UploadFilled /></el-icon>
                <span>{{ $t('depDropzoneA') }}<br />{{ $t('depDropzoneB') }}</span>
              </button>
              <p
                v-if="proofName"
                class="dep-proof-name"
              >
                {{ proofName }}
                <button
                  type="button"
                  @click="proofName = ''"
                >
                  {{ $t('depRemove') }}
                </button>
              </p>
              <input
                ref="fileInput"
                type="file"
                accept="image/*,.pdf"
                hidden
                @change="onFile"
              />

              <button
                class="dep-submit"
                type="button"
                @click="submit"
              >
                {{ $t('depSubmit') }}
              </button>
            </div>
          </div>

          <section class="dep-doc">
            <header>
              <el-icon class="dep-doc-warn"><WarningFilled /></el-icon>
              <h3>{{ $t('depositNotes') }}</h3>
              <button
                type="button"
                @click="docsCollapsed = !docsCollapsed"
              >
                {{ docsCollapsed ? $t('depExpand') : $t('depCollapse') }}
              </button>
            </header>
            <ul v-show="!docsCollapsed">
              <li>{{ $t('depDocNote1') }}</li>
              <li>{{ $t('depDocNote2') }}</li>
              <li>{{ $t('depDocNote3') }}</li>
              <li>{{ $t('depDocNote4') }}</li>
              <li>{{ $t('commonSecurityNote') }}</li>
            </ul>
          </section>

          <h2 class="dep-records-title">{{ $t('depositRecords') }}</h2>
          <div class="dep-table-head">
            <span>{{ $t('text313') }}</span
            ><span>{{ $t('text308') }}</span><span>{{ $t('depRemitColumn') }}</span><span>{{ $t('depRemitCard') }}</span><span>{{ $t('fiatCardTag') }}</span
            ><span>{{ $t('text063') }}</span><span>{{ $t('text065') }}</span>
          </div>
          <div
            v-for="(record, index) in records"
            :key="index"
            class="dep-row"
          >
            <span>{{ record.time }}</span
            ><span>{{ record.coin }}</span
            ><span>{{ formatAmount(record.amount) }}</span
            ><span>{{ record.account }}</span
            ><span>{{ record.tag }}</span
            ><span>{{ tr(record.status) }}</span
            ><span>—</span>
          </div>
          <div
            v-if="!records.length"
            class="dep-empty"
          >
            {{ $t('text066') }}
          </div>
          <p class="dep-footnote">
            * {{ $t('recordsFootnote') }}
            <a href="/bge/hk/zh-CN/user/report/wallet">{{ $t('recordsLink') }}</a>
          </p>
        </section>
      </main>
    </div>
    <Footer />

    <el-dialog
      v-model="showSample"
      :title="$t('depSampleBtn')"
      width="420px"
    >
      <div class="dep-sample">
        <p class="dep-sample-title">{{ active.account.bank }}</p>
        <dl>
          <div><dt>{{ $t('depSampleDate') }}</dt><dd>2026-10-13</dd></div>
          <div><dt>{{ $t('depSampleBy') }}</dt><dd>heqi**gic</dd></div>
          <div><dt>{{ $t('depSampleAccount') }}</dt><dd>{{ active.account.number }}</dd></div>
          <div><dt>{{ $t('depRemitColumn') }}</dt><dd>{{ coin }} 10,000.00</dd></div>
          <div><dt>{{ $t('depSampleRef') }}</dt><dd>SCB202610130001</dd></div>
        </dl>
        <p class="dep-sample-note">{{ $t('depSampleNote') }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.dep-main{padding:24px;flex:1;min-width:0}
.dep-box{padding:24px 28px 32px;background:#fff}
.dep-title{margin:0 0 26px;padding-left:12px;border-left:8px solid #ffd52a;font-size:22px;font-weight:600}
.dep-columns{display:flex;gap:48px;align-items:flex-start}
.dep-step{flex:1;min-width:0;max-width:775px}
.dep-step-two{max-width:none;padding-left:44px;border-left:1px solid #edf0f4;align-self:stretch;display:block}
.dep-badge{display:inline-flex;align-items:center;height:24px;padding:0 12px;border-radius:2px;background:#f5ff18;color:#111;font-size:13px;font-weight:600}
.dep-hint{display:flex;align-items:center;gap:16px;margin:14px 0 30px;padding:18px 22px;background:#f4f8fb;border-radius:4px}
.dep-hint-icon{width:46px;height:46px;flex:0 0 46px}
.dep-hint b{display:block;color:#171d27;font-size:16px;font-weight:600}
.dep-hint small{display:block;margin-top:6px;color:#8a94a6;font-size:12.5px}
.dep-label{margin:0 0 10px;color:#303744;font-size:15px}
.dep-select{width:100%}
.dep-select :deep(.el-select__wrapper){min-height:46px;border-radius:4px;box-shadow:0 0 0 1px #dfe4ec inset}
.coin-option{display:inline-flex;align-items:center;gap:10px}
.coin-option i{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:#eceff3;color:#8a94a6;font-size:11px;font-style:normal}
.coin-option small{color:#9ba3ae}
.dep-receipt{position:relative;margin-top:18px;padding:24px 26px;background:linear-gradient(180deg,#fdf8ef,#fffdf8)}
.dep-receipt::after{content:'';position:absolute;left:0;right:0;bottom:-9px;height:9px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='9' viewBox='0 0 18 9'%3E%3Cpath d='M0 0h18L9 9z' fill='%23fffdf8'/%3E%3C/svg%3E") repeat-x;background-size:18px 9px}
.dep-receipt-warn{display:flex;align-items:center;gap:8px;margin:0 0 18px;padding-bottom:16px;border-bottom:1px solid #f0e3cd;color:#e0443a;font-size:15px;font-weight:600}
.dep-receipt dl{margin:0}
.dep-receipt dl > div{display:flex;align-items:center;margin-bottom:16px}
.dep-receipt dl > div:last-child{margin-bottom:0}
.dep-receipt dt{width:140px;flex:0 0 140px;color:#8a94a6;font-size:14px}
.dep-receipt dd{display:flex;align-items:center;gap:10px;margin:0;color:#171d27;font-size:14px;min-width:0}
.dep-copy{padding:0;border:0;background:none;color:#d9a600;font-size:15px;line-height:1;cursor:pointer}
.dep-copy:hover{color:#b98c00}
.dep-receipt-min{margin:22px 0 0;color:#171d27;font-size:15px;font-weight:600}
.dep-cards-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:44px 0 12px}
.dep-cards-head .dep-label{margin:0}
.dep-link{color:#d9a600;font-size:13px;text-decoration:none}
.dep-link:hover{color:#b98c00}
.dep-card{display:flex;align-items:center;gap:16px;padding:14px 18px;border:1px solid #dfe4ec;border-radius:4px;color:#303744;font-size:14px}
.dep-card b{font-weight:400}
.dep-card span{color:#8a94a6}
.dep-card-tag{margin-left:auto;white-space:nowrap}
.coin-badge{display:inline-flex;align-items:center;justify-content:center;width:26px;height:24px;border-radius:4px;background:#fdf3d0;color:#e0a800;font-size:11px;font-style:normal;flex:0 0 auto}
.dep-no-card{padding:44px 0 30px;text-align:center}
.dep-no-card-icon{display:block;margin:0 auto;width:170px;height:120px}
.dep-no-card p{margin:10px 0 0;color:#9aa2ad;font-size:13px}
.dep-amount-label{margin-top:0}
.dep-input-line{display:flex;align-items:center;gap:12px;padding:0 0 12px;border-bottom:1px solid #dfe4ec}
.dep-input-line input{flex:1;min-width:0;border:0;outline:none;background:transparent;color:#303744;font-size:15px}
.dep-input-line input::placeholder{color:#b6bcc6}
.dep-input-line b{color:#6f7783;font-size:15px;font-weight:400}
.dep-note{margin:14px 0 0;color:#9a7b22;font-size:12.5px}
.dep-proof-label{display:flex;align-items:center;gap:6px;margin:34px 0 14px}
.dep-proof-info{color:#b6bcc6;font-size:14px}
.dep-proof-actions{display:flex;gap:12px}
.dep-proof-upload{height:36px;padding:0 22px;border:0;border-radius:2px;background:#f5ff18;color:#111;font-size:14px;cursor:pointer}
.dep-proof-upload:hover{background:#e8f000}
.dep-proof-sample{height:36px;padding:0 18px;border:0;border-radius:2px;background:#edf0f6;color:#303744;font-size:14px;cursor:pointer}
.dep-proof-sample:hover{background:#e4e8ee}
.dep-dropzone{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:122px;height:104px;margin-top:18px;border:1px dashed #d8dee8;border-radius:4px;background:#fff;color:#9aa2ad;font-size:13px;line-height:1.4;cursor:pointer}
.dep-dropzone:hover{border-color:#f0d000;color:#d9a600}
.dep-dropzone .el-icon{font-size:26px}
.dep-proof-name{margin:12px 0 0;color:#303744;font-size:13px}
.dep-proof-name button{margin-left:8px;border:0;background:none;color:#d9a600;font-size:13px;cursor:pointer}
.dep-submit{width:100%;height:48px;margin-top:34px;border:0;border-radius:4px;background:#f5ff18;color:#111;font-size:16px;font-weight:600;cursor:pointer}
.dep-submit:hover{background:#e8f000}
.dep-doc{margin-top:56px;padding:18px 22px 6px;background:#f7f8fa}
.dep-doc header{display:flex;align-items:center;gap:10px}
.dep-doc-warn{font-size:16px;color:#303744}
.dep-doc h3{margin:0;color:#303744;font-size:16px;font-weight:600}
.dep-doc header button{margin-left:auto;padding:0;border:0;background:none;color:#d9a600;font-size:14px;cursor:pointer}
.dep-doc ul{margin:16px 0 0;padding-left:16px;color:#6f7783;font-size:13px;line-height:1.9}
.dep-doc li{margin:0 0 8px}
.dep-records-title{margin:44px 0 20px;padding-left:12px;border-left:8px solid #ffd52a;font-size:20px;font-weight:600}
.dep-table-head,.dep-row{display:grid;grid-template-columns:1.3fr .7fr 1fr 1.6fr 1fr .8fr .6fr;align-items:center;gap:8px;padding:0 12px;text-align:center}
.dep-table-head{height:44px;background:#f4f6f9;color:#697585;font-size:13px}
.dep-row{min-height:58px;border-bottom:1px solid #edf0f4;color:#697585;font-size:13px}
.dep-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dep-empty{padding:60px 0;color:#9aa2ad;font-size:14px;text-align:center}
.dep-footnote{margin:18px 0 0;color:#9aa2ad;font-size:12px}
.dep-footnote a{color:#d9a600;text-decoration:none}
.dep-sample{padding:20px;border:1px solid #e4e8ee}
.dep-sample-title{margin:0 0 16px;color:#171d27;font-size:15px;font-weight:600;text-align:center}
.dep-sample dl{margin:0}
.dep-sample dl > div{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px dashed #edf0f4;font-size:13px}
.dep-sample dt{margin:0;color:#8a94a6}
.dep-sample dd{margin:0;color:#303744}
.dep-sample-note{margin:14px 0 0;color:#9aa2ad;font-size:12px}
@media (max-width:1200px){.dep-columns{flex-direction:column;gap:32px;align-items:stretch}.dep-step-two{padding-left:0;border-left:0}}
</style>
