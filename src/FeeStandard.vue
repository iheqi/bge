<script setup>
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { tr } from './i18n'
// Standalone fee schedule page (/user/fee-standard), reachable from the fee centre.
const active = ref('spot')
const fundingTab = ref('crypto')
const search = ref('')
const tabs = [
  ['spot', 'text460'],
  ['funding', 'text427'],
  ['otc', 'text229'],
  ['refund', 'text461'],
]
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
].map(([pair, tag]) => ({ pair, tag, maker: '0%', taker: '0.25%' }))
const fundingFees = {
  crypto: [
    ['ETH', 'ETH', '0.00010000', '0.00000000', '0.00400000'],
    ['USDC', 'ETH', '10.00000000', '0.00000000', '10.00000000'],
    ['USDT', 'ETH', '10.00000000', '0.00000000', '10.00000000'],
    ['BTC', 'BTC', '0.00005000', '0.00000000', '0.00012000'],
  ].map(([coin, network, minDeposit, fee, minWithdraw]) => ({ coin, network, minDeposit, fee, minWithdraw })),
  fiat: [
    ['USD', 'USD', '10.00', '0.00', '10.00'],
    ['HKD', 'HKD', '100.00', '0.00', '100.00'],
  ].map(([coin, network, minDeposit, fee, minWithdraw]) => ({ coin, network, minDeposit, fee, minWithdraw })),
}
const refundFees = ['ETH(ERC20)', 'USDC(ERC20)', 'USDT(ERC20)', 'BTC(Bitcoin)'].map((coin) => ({
  coin,
  fee: 'text441',
}))
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
const funding = computed(() => fundingFees[fundingTab.value])
const visibleSpot = computed(() =>
  spotFees.filter((row) => row.pair.includes(search.value.trim().toUpperCase())),
)
const visibleOtc = computed(() =>
  otcFees.filter((row) => row.pair.includes(search.value.trim().toUpperCase())),
)
const visibleRefund = computed(() =>
  refundFees.filter((row) => row.coin.toUpperCase().includes(search.value.trim().toUpperCase())),
)
</script>

<template>
  <main class="fee-standard">
    <h1>{{ $t('text459') }}</h1>

    <section class="fee-card">
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
        <table class="fee-table">
          <thead>
            <tr>
              <th>{{ $t('text432') }}</th>
              <th>{{ $t('text428') }}</th>
              <th>{{ $t('text429') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in visibleSpot"
              :key="row.pair"
            >
              <td>
                {{ tr(row.pair) }}<small v-if="row.tag">（{{ tr(row.tag) }}）</small>
              </td>
              <td>{{ row.maker }}</td>
              <td>{{ row.taker }}</td>
            </tr>
            <tr v-if="!visibleSpot.length">
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

      <template v-else-if="active === 'otc'">
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

      <template v-else>
        <p class="fee-notice">{{ $t('text463') }}</p>
        <table class="fee-table">
          <thead>
            <tr>
              <th>{{ $t('text433') }}</th>
              <th>{{ $t('text462') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in visibleRefund"
              :key="row.coin"
            >
              <td>{{ row.coin }}</td>
              <td>{{ $t(row.fee) }}</td>
            </tr>
            <tr v-if="!visibleRefund.length">
              <td
                class="fee-empty"
                colspan="2"
              >
                {{ $t('text066') }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </section>
  </main>
</template>

<style scoped>
.fee-standard {
  min-height: calc(100vh - 72px);
  padding: 40px 0 64px;
  background: #f5f5f5;
  color: #171a20;
}
.fee-standard > h1,
.fee-card {
  width: min(1210px, calc(100% - 64px));
  margin: 0 auto;
}
.fee-standard > h1 {
  margin-bottom: 34px;
  font-size: 28px;
  font-weight: 600;
}
.fee-card {
  padding: 0 24px 30px;
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
  padding: 22px 4px 18px;
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
  width: 240px;
}
.fee-search :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #d8dee8 inset;
}
.fee-sub-tabs {
  display: flex;
  gap: 32px;
  margin: 28px 0 0;
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
.fee-notice {
  display: flex;
  gap: 10px;
  margin: 24px 0 0;
  padding: 16px 20px;
  border: 1px solid #f2d27a;
  background: #fffbe9;
  color: #4f5865;
  font-size: 13px;
  line-height: 2;
}
.fee-notice::before {
  content: '⚠';
  flex: 0 0 auto;
  color: #e6a23c;
}
.fee-table {
  width: 100%;
  margin-top: 24px;
  border-collapse: collapse;
  font-size: 14px;
}
.fee-table th {
  height: 58px;
  padding: 8px 14px;
  border: 1px solid #edf0f4;
  background: #fff;
  color: #171a20;
  font-weight: 500;
}
.fee-table td {
  height: 56px;
  padding: 10px 14px;
  border: 1px solid #edf0f4;
  text-align: center;
}
.fee-table td small {
  color: #9aa1ad;
}
.fee-table .fee-empty {
  height: 120px;
  color: #9aa1ad;
}
@media (max-width: 900px) {
  .fee-standard > h1,
  .fee-card {
    width: calc(100% - 32px);
  }
  .fee-standard-head {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding-top: 12px;
  }
  .fee-tabs {
    gap: 24px;
  }
  .fee-tabs button {
    padding: 12px 0;
    font-size: 16px;
  }
  .fee-search {
    width: 100%;
  }
  .fee-table {
    font-size: 12px;
  }
}
</style>
