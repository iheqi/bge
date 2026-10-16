<script setup>
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { tr } from './i18n'
import { currentAccount } from './demoAccounts'
// The tier, its discounts and the volumes come from the signed-in demo account, so switching
// accounts moves both this panel and the 我的费率 column below it.
const plan = currentAccount.value.plan
const level = `Lv ${plan.level}`
const discount = { maker: `${plan.makerDiscount}%`, taker: `${plan.takerDiscount}%` }
const volume = { spot: plan.spotVolume, assets: plan.assetVolume }
// The published rates the tier discount comes off, kept next to the discount that changes them.
const BASE_FEE = { maker: 0.2, taker: 0.25 }
const rate = (side) => `${Number((BASE_FEE[side] * (1 - plan[`${side}Discount`] / 100)).toFixed(4))}%`
const tabs = [
  ['spot', 'text426'],
  ['funding', 'text427'],
  ['otc', 'text229'],
]
const active = ref('spot')
const fundingTab = ref('crypto')
const search = ref('')
const spotFees = [
  ['BTC/USDC', '仅PI'],
  ['ETH/USDC', '仅PI'],
  ['BTC/HKD', ''],
  ['ETH/HKD', ''],
  ['USDC/USD', '仅PI'],
  ['BTC/USDT', '仅PI'],
  ['ETH/USDT', '仅PI'],
  ['USDT/USD', '仅PI'],
  ['USDT/HKD', '仅PI'],
].map(([pair, tag]) => ({
  pair,
  tag,
  maker: rate('maker'),
  makerBase: `${BASE_FEE.maker}%`,
  taker: rate('taker'),
  takerBase: `${BASE_FEE.taker}%`,
}))
const cryptoFunding = [
  ['ETH', 'ETH', '0.00010000', '0.00000000', '0.00400000'],
  ['USDC', 'ETH', '10.00000000', '0.00000000', '10.00000000'],
  ['USDT', 'ETH', '10.00000000', '0.00000000', '10.00000000'],
  ['BTC', 'BTC', '0.00005000', '0.00000000', '0.00012000'],
].map(([coin, network, minDeposit, fee, minWithdraw]) => ({ coin, network, minDeposit, fee, minWithdraw }))
const fiatFunding = [
  ['USD', 'USD', '10.00', '0.00', '10.00'],
  ['HKD', 'HKD', '100.00', '0.00', '100.00'],
].map(([coin, network, minDeposit, fee, minWithdraw]) => ({ coin, network, minDeposit, fee, minWithdraw }))
const funding = computed(() => (fundingTab.value === 'crypto' ? cryptoFunding : fiatFunding))
const visibleSpot = computed(() =>
  spotFees.filter((row) => row.pair.includes(search.value.trim().toUpperCase())),
)
// OTC keeps the commission split of the previous demo data: buy / sell rate per pair.
const otcFees = [
  ['BTC/USDC', '0.15%', '0.15%'],
  ['ETH/USDC', '0.15%', '0.15%'],
  ['BTC/HKD', '0.10%', '0.10%'],
  ['ETH/HKD', '0.10%', '0.10%'],
  ['USDC/USD', '0.05%', '0.05%'],
  ['BTC/USDT', '0.15%', '0.15%'],
  ['ETH/USDT', '0.15%', '0.15%'],
  ['USDT/USD', '0.05%', '0.05%'],
  ['USDT/HKD', '0.05%', '0.05%'],
].map(([pair, buy, sell]) => ({ pair, buy, sell }))
const visibleOtc = computed(() =>
  otcFees.filter((row) => row.pair.includes(search.value.trim().toUpperCase())),
)
// Worked examples from the fee schedule: buy 2 BTC at 25,000 USDC with 0.2% maker / 0.3% taker.
const buyExample = [
  ['Maker', '2 * 0.2%=0.004 BTC', '2-0.004=1.996 BTC'],
  ['Taker', '2 * 0.3%=0.006 BTC', '2-0.006=1.994 BTC'],
]
const sellExample = [
  ['Maker', '50,000 * 0.2%=100 USDC', '50,000-100=49,900 USDC'],
  ['Taker', '50,000 * 0.3%=150 USDC', '50,000-150=49,850 USDC'],
]
</script>

<template>
  <main class="fee-center">
    <section class="fee-card">
      <div class="fee-head">
        <h1>{{ $t('text418') }}<b>{{ level }}</b></h1>
        <a
          class="fee-link"
          href="/bge/hk/zh-CN/user/fee-standard"
          >{{ $t('text419') }} ›</a
        >
      </div>
      <div class="fee-metrics">
        <div class="fee-metric-group">
          <span class="fee-metric-label">{{ $t('text420') }}</span>
          <div class="fee-metric-row">
            <div>
              <small>{{ $t('text422') }}</small><b>{{ discount.maker }}</b>
            </div>
            <div>
              <small>{{ $t('text423') }}</small><b>{{ discount.taker }}</b>
            </div>
          </div>
        </div>
        <div class="fee-metric-group">
          <span class="fee-metric-label">{{ $t('text421') }}</span>
          <div class="fee-metric-row">
            <div>
              <small>{{ $t('text424') }}</small><b>{{ volume.spot }}</b>
            </div>
            <div>
              <small>{{ $t('text425') }}</small><b>{{ volume.assets }}</b>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="fee-standard"
      class="fee-card fee-standard"
    >
      <div class="fee-standard-head">
        <div class="fee-tabs">
          <button
            v-for="[value, label] in tabs"
            :key="value"
            type="button"
            :class="{ active: active === value }"
            @click="active = value"
          >
            {{ $t(label) }}
          </button>
        </div>
        <el-input
          v-model="search"
          class="fee-search"
          :prefix-icon="Search"
          :placeholder="$t('text283')"
          :aria-label="$t('text283')"
          clearable
        />
      </div>

      <template v-if="active === 'spot'">
        <!-- 表头两行：第一行只有 币对 / 挂单 / 吃单 三格，第二行把挂单与吃单各拆成「我的费率」「基础费率」。 -->
        <table class="fee-table fee-table-spot">
          <thead>
            <tr>
              <th
                class="fee-pair"
                rowspan="2"
              >
                {{ $t('text432') }}
              </th>
              <th colspan="2">{{ $t('text428') }}</th>
              <th colspan="2">{{ $t('text429') }}</th>
            </tr>
            <tr>
              <th class="fee-mine">{{ $t('text430') }}<small>{{ $t('lvDiscount', { level: plan.level, discount: plan.makerDiscount }) }}</small></th>
              <th class="fee-base">{{ $t('text431') }}</th>
              <th class="fee-mine">{{ $t('text430') }}<small>{{ $t('lvDiscount', { level: plan.level, discount: plan.takerDiscount }) }}</small></th>
              <th class="fee-base">{{ $t('text431') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in visibleSpot"
              :key="row.pair"
            >
              <td class="fee-pair">
                {{ tr(row.pair) }}<small v-if="row.tag">（{{ tr(row.tag) }}）</small>
              </td>
              <td>{{ row.maker }}</td>
              <td>{{ row.makerBase }}</td>
              <td>{{ row.taker }}</td>
              <td>{{ row.takerBase }}</td>
            </tr>
            <tr v-if="!visibleSpot.length">
              <td
                class="fee-empty"
                colspan="5"
              >
                {{ $t('text066') }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else-if="active === 'funding'">
        <div class="fee-sub-tabs">
          <button
            type="button"
            :class="{ active: fundingTab === 'crypto' }"
            @click="fundingTab = 'crypto'"
          >
            {{ $t('text439') }}
          </button>
          <button
            type="button"
            :class="{ active: fundingTab === 'fiat' }"
            @click="fundingTab = 'fiat'"
          >
            {{ $t('text440') }}
          </button>
        </div>
        <table class="fee-table">
          <thead>
            <tr>
              <th>{{ $t('text433') }}</th>
              <th>{{ $t('text434') }}</th>
              <th>{{ $t('text435') }}</th>
              <th>{{ $t('text436') }}</th>
              <th>{{ $t('text437') }}</th>
              <th>{{ $t('text438') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in funding"
              :key="row.coin"
            >
              <td>{{ row.coin }}</td>
              <td>{{ row.network }}</td>
              <td>{{ $t('text441') }}</td>
              <td>{{ row.minDeposit }}</td>
              <td>{{ row.fee }}</td>
              <td>{{ row.minWithdraw }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-else>
        <table class="fee-table">
          <thead>
            <tr>
              <th>{{ $t('text432') }}</th>
              <th>{{ $t('text400') }}</th>
              <th>{{ $t('text401') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in visibleOtc"
              :key="row.pair"
            >
              <td>{{ tr(row.pair) }}</td>
              <td>{{ row.buy }}</td>
              <td>{{ row.sell }}</td>
            </tr>
            <tr v-if="!visibleOtc.length">
              <td
                class="fee-empty"
                colspan="3"
              >
                {{ $t('text066') }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </section>

    <section class="fee-card fee-doc">
      <h2>{{ $t('text442') }}</h2>
      <table class="fee-table fee-glossary">
        <thead>
          <tr>
            <th>{{ $t('text443') }}</th>
            <th>{{ $t('text444') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t('text445') }}</td>
            <td>{{ $t('text446') }}</td>
          </tr>
        </tbody>
      </table>

      <h2 class="fee-doc-title">{{ $t('text447') }}</h2>
      <p class="fee-doc-note">{{ $t('text448') }}</p>

      <h3 class="fee-doc-sub">{{ $t('text449') }}</h3>
      <table class="fee-table">
        <thead>
          <tr>
            <th>{{ $t('text451') }}</th>
            <th>{{ $t('text452') }}</th>
            <th>{{ $t('text454') }}</th>
            <th>{{ $t('text456') }}</th>
            <th>{{ $t('text457') }}</th>
            <th>{{ $t('text458') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[role, fee, receive] in buyExample"
            :key="role"
          >
            <td>25,000.00 USDC</td>
            <td>2 BTC</td>
            <td>50,000.00 USDC</td>
            <td>{{ role }}</td>
            <td>{{ fee }}</td>
            <td>{{ receive }}</td>
          </tr>
        </tbody>
      </table>

      <h3 class="fee-doc-sub">{{ $t('text450') }}</h3>
      <table class="fee-table">
        <thead>
          <tr>
            <th>{{ $t('text451') }}</th>
            <th>{{ $t('text453') }}</th>
            <th>{{ $t('text455') }}</th>
            <th>{{ $t('text456') }}</th>
            <th>{{ $t('text457') }}</th>
            <th>{{ $t('text458') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="[role, fee, receive] in sellExample"
            :key="role"
          >
            <td>25,000.00 USDC</td>
            <td>2 BTC</td>
            <td>50,000.00 USDC</td>
            <td>{{ role }}</td>
            <td>{{ fee }}</td>
            <td>{{ receive }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<style scoped>
.fee-center {
  flex: 1;
  min-width: 0;
  /* The design keeps one 1190px content column centred on the page background. */
  width: 100%;
  max-width: 1190px;
  margin: 0 auto;
  padding: 34px 0 60px;
  background: transparent;
  color: #171a20;
}
.fee-card {

  padding: 26px 24px;
}
.fee-card + .fee-card {
  margin-top: 24px;
}
.fee-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.fee-head h1 {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0;
  color: #000;
  font-size: 24px;
  font-weight: 600;
}
.fee-head h1 b {
  padding: 5px 18px;
  border-radius: 6px;
  background: #272c37;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.fee-link {
  color: #d9a600;
  text-decoration: none;
  font-size: 14px;
}
.fee-link:hover {
  color: #b98c00;
}
.fee-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 24px;
  border: 1px solid #edf0f4;
}
.fee-metric-group + .fee-metric-group {
  border-left: 1px solid #edf0f4;
}
.fee-metric-label {
  display: block;
  padding: 16px;
  border-bottom: 1px solid #edf0f4;
  text-align: center;
  font-size: 14px;
}
.fee-metric-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.fee-metric-row > div {
  padding: 16px;
  text-align: center;
}
.fee-metric-row > div + div {
  border-left: 1px solid #edf0f4;
}
.fee-metric-row small {
  display: block;
  color: #42454b;
  font-size: 13px;
  line-height: 1.6;
}
.fee-metric-row b {
  display: block;
  margin-top: 12px;
  font-size: 16px;
  font-weight: 600;
}
.fee-standard-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #edf0f4;
}
.fee-tabs {
  display: flex;
  gap: 44px;
}
.fee-tabs button {
  position: relative;
  padding: 0 4px 16px;
  border: 0;
  background: none;
  color: #9aa1ad;
  font-size: 18px;
  cursor: pointer;
}
.fee-tabs button.active {
  color: #171a20;
  font-weight: 600;
}
.fee-tabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: #f0d000;
}
.fee-search {
  width: 220px;
}
.fee-search :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #d8dee8 inset;
}
.fee-sub-tabs {
  display: flex;
  gap: 32px;
  margin: 24px 0 0;
}
.fee-sub-tabs button {
  padding: 0 0 12px;
  border: 0;
  background: none;
  color: #9aa1ad;
  font-size: 16px;
  cursor: pointer;
}
.fee-sub-tabs button.active {
  color: #171a20;
  font-weight: 600;
}
.fee-table {
  width: 100%;
  margin-top: 18px;
  border-collapse: collapse;
  font-size: 14px;
}
/* Header cells carry the light band that separates them from the white rows. */
.fee-table th {
  height: 56px;
  padding: 8px 14px;
  border: 1px solid #edf0f4;
  background: #f7f8fa;
  color: #1b1f26;
  font-weight: 400;
  line-height: 1.5;
}
.fee-table th small {
  display: block;
  color: #9aa1ad;
  font-size: 12px;
}
/* 现货表：第一行 48px 的分组表头，第二行 48px 的费率表头，「我的费率」比「基础费率」浅一档。 */
.fee-table-spot thead tr:first-child th {
  height: 48px;
}
.fee-table-spot thead tr:last-child th {
  height: 48px;
  padding: 4px 14px;
  border-top: 0;
}
.fee-table-spot thead tr:last-child th small {
  margin-top: 2px;
  line-height: 1.35;
}
.fee-table-spot th.fee-mine {
  color: #9aa1ad;
}
.fee-table-spot th.fee-mine small {
  color: #9aa1ad;
}
.fee-table-spot th.fee-base {
  color: #1b1f26;
}
.fee-table td {
  height: 56px;
  padding: 10px 14px;
  border: 1px solid #edf0f4;
  background: #fff;
  text-align: center;
  color: #14181f;
}
.fee-table .fee-pair {
  text-align: center;
  color: #14181f;
  font-weight: 500;
}
.fee-table .fee-pair small {
  color: #9aa1ad;
  font-weight: 400;
}
.fee-table .fee-empty {
  height: 120px;
  color: #9aa1ad;
}
.fee-doc > h2 {
  margin: 0 0 18px;
  font-size: 20px;
  font-weight: 600;
}
.fee-doc .fee-doc-title {
  margin-top: 44px;
}
.fee-doc-note {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 14px;
}
.fee-doc-sub {
  margin: 24px 0 0;
  font-size: 15px;
  font-weight: 600;
}
.fee-glossary td {
  height: auto;
  padding: 22px 24px;
  line-height: 1.9;
}
.fee-glossary th {
  height: 48px;
}
@media (max-width: 900px) {
  .fee-center {
    padding: 20px 16px 32px;
  }
  .fee-metrics {
    grid-template-columns: 1fr;
  }
  .fee-metric-group + .fee-metric-group {
    border-left: 0;
    border-top: 1px solid #edf0f4;
  }
  .fee-standard-head {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .fee-search {
    width: 100%;
  }
  .fee-table {
    font-size: 12px;
  }
}
</style>
