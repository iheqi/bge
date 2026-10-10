<script setup>
import { formatMoney, HKD_PER_USD } from './currency'
import { tr, formatCell } from './i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { ref, computed } from 'vue'
import { Search, StarFilled, ArrowRight } from '@element-plus/icons-vue'
import SiteHeader from './SiteHeader.vue'
const tab = ref('spot'),
  quote = ref('all'),
  search = ref('')
// Demo quotes; USDC/USDT are valued at 1 USD. Turnover is stored in USD.
const markets = [
  ['BTC/USDC', 84106.64, '+1.82%', 85880.12, 82410.55, 18650000, true],
  ['ETH/USDC', 4981.81, '+0.64%', 5098.22, 4876.34, 8420000, true],
  ['BTC/HKD', 654320.18, '-0.73%', 662800.45, 648210.12, 3150000, false],
  ['ETH/HKD', 38762.26, '+0.18%', 39420.6, 37980.15, 1760000, false],
  ['USDC/USD', 1.0002, '+0.02%', 1.0012, 0.9991, 420000, true],
  ['BTC/USDT', 84112.38, '-2.77%', 86542.96, 83516.94, 1369000000, true],
  ['ETH/USDT', 4981.81, '+0.91%', 5072.2, 4810.5, 286000000, true],
  ['USDT/USD', 0.9998, '-0.01%', 1.0004, 0.9992, 1180000, true],
  ['USDT/HKD', 7.8124, '+0.03%', 7.8241, 7.8012, 630000, true],
].map(([pair, price, change, high, low, turnover, hot]) => ({ pair, price, change, high, low, turnover, hot }))
function usdPrice(row, value) {
  return value === null ? null : value / (row.pair.endsWith('/HKD') ? HKD_PER_USD : 1)
}
function priceCell(row, column, value) {
  return formatMoney(
    column.property === 'turnover' ? value : usdPrice(row, value),
    'USD',
    column.property === 'turnover' ? 2 : 6,
  )
}
let saved = ['ETH/USDT']
try {
  const value = JSON.parse(localStorage.getItem('bge-market-favorites'))
  if (Array.isArray(value)) saved = value.filter((v) => typeof v === 'string')
} catch {}
const favorites = ref(saved)
const sort = ref({ key: '', order: '' })
const rows = markets
const filtered = computed(() => {
  const result = rows.filter(
    (m) =>
      m.pair.includes(search.value.trim().toUpperCase()) &&
      (quote.value === 'all' || m.pair.endsWith('/' + quote.value)) &&
      (tab.value !== 'favorites' || favorites.value.includes(m.pair)),
  )
  if (sort.value.order)
    result.sort((a, b) => {
      const key = sort.value.key
      const value =
        key === 'pair'
          ? a.pair.localeCompare(b.pair)
          : key === 'change'
            ? parseFloat(a[key]) - parseFloat(b[key])
            : (usdPrice(a, a[key]) ?? -Infinity) - (usdPrice(b, b[key]) ?? -Infinity)
      return sort.value.order === 'ascending' ? value : -value
    })
  return result
})
function toggleFavorite(pair) {
  favorites.value = favorites.value.includes(pair)
    ? favorites.value.filter((v) => v !== pair)
    : [...favorites.value, pair]
  try {
    localStorage.setItem('bge-market-favorites', JSON.stringify(favorites.value))
  } catch {}
}
function trade() {
  window.location.href = '/bge/hk/zh-CN/spot'
}
</script>
<template>
  <div class="market-page">
    <SiteHeader active="market" />
    <!--
    <header class="market-nav">
      <a
        class="market-brand"
        href="/bge/hk/zh-CN/"
        ><img
          src="/logo-bge-light.svg"
          alt="BGE"
          width="116"
          height="28"
      /></a>
      <nav>
        <a href="/bge/hk/zh-CN/">{{ $t('text000') }}</a
        ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a
        ><a
          class="active"
          href="/bge/hk/zh-CN/market"
          >{{ $t('text001') }}</a
        ><a href="/bge/hk/zh-CN/spot">{{ $t('text003') }}</a
        ><a href="/bge/hk/zh-CN/about">{{ $t('text004') }}</a>
      </nav>
      <div class="market-right">
        <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
        ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
        ><MessageBell /><UserMenu /><LanguageSwitcher /><CurrencySwitcher />
      </div>
    </header> -->
    <section class="market-tickers">
      <div class="market-container ticker-cards">
        <article
          v-for="(coin, index) in markets.slice(0, 2)"
          :key="coin.pair"
          class="ticker-card"
        >
          <div class="ticker-title">
            <span
              class="coin-symbol"
              :class="{ ethereum: index === 1 }"
              >{{ tr(index === 0 ? '₿' : '♦') }}</span
            >{{ coin.pair
            }}<span
              class="ticker-change"
              :class="{ negative: coin.change.startsWith('-'), positive: coin.change.startsWith('+') }"
              >{{ coin.change }}</span
            >
          </div>
          <div class="ticker-price">
            <strong>{{ formatMoney(usdPrice(coin, coin.price), 'USD', 6).split(' ')[0] }}</strong>
            <b>{{
              formatMoney(usdPrice(coin, coin.price), 'USD', 6).split(' ').slice(1).join(' ')
            }}</b>
            <small>{{ coin.price }} {{ coin.pair.split('/')[1] }}</small>
          </div>
          <div class="ticker-volume">
            24H Vol {{ (coin.turnover / usdPrice(coin, coin.price)).toFixed(4) }} {{ coin.pair.split('/')[0]
            }}<button
              :title="$t('text145')"
              :aria-label="$t('text145')"
              @click="trade"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
        </article>
      </div>
    </section>
    <main class="market-container market-main">
      <h1>{{ $t('text001') }}</h1>
      <div class="market-toolbar">
        <div
          class="market-modes"
          role="tablist"
          :aria-label="$t('text146')"
        >
          <button
            v-for="mode in [
              ['favorites', '自选'],
              ['spot', '现货'],
            ]"
            :key="mode[0]"
            role="tab"
            :aria-selected="tab === mode[0]"
            :class="{ selected: tab === mode[0] }"
            @click="tab = mode[0]"
          >
            <el-icon v-if="mode[0] === 'favorites'"><StarFilled /></el-icon>{{ tr(mode[1]) }}
          </button>
        </div>
        <el-input
          v-model="search"
          class="market-search"
          :prefix-icon="Search"
          :placeholder="$t('text150')"
          :aria-label="$t('text150')"
          clearable
        />
      </div>
      <div
        class="quote-tabs"
        role="tablist"
        :aria-label="$t('text151')"
      >
        <button
          v-for="item in [
            ['all', '全部行情'],
            ['USDC', 'USDC'],
            ['USDT', 'USDT'],
            ['HKD', 'HKD'],
            ['USD', 'USD'],
          ]"
          :key="item[0]"
          role="tab"
          :aria-selected="quote === item[0]"
          :class="{ active: quote === item[0] }"
          @click="quote = item[0]"
        >
          {{ tr(item[1]) }}
        </button>
      </div>
      <el-table
        :data="filtered"
        class="market-table"
        :empty-text="
          tr(tab === 'favorites' ? '暂无符合条件的自选行情' : '暂无匹配行情')
        "
        @sort-change="({ prop, order }) => (sort = { key: prop, order })"
      >
        <el-table-column
          :formatter="formatCell"
          prop="pair"
          :label="$t('text156')"
          sortable="custom"
          min-width="180"
          ><template #default="{ row }"
            ><div class="market-pair">
              <button
                class="favorite-toggle"
                :class="{ saved: favorites.includes(row.pair) }"
                :aria-pressed="favorites.includes(row.pair)"
                :aria-label="
                  tr(favorites.includes(row.pair) ? '取消自选' : '添加自选') + ' ' + row.pair
                "
                :title="tr(favorites.includes(row.pair) ? '取消自选' : '添加自选')"
                @click="toggleFavorite(row.pair)"
              >
                <el-icon><StarFilled /></el-icon></button
              ><span>{{ tr(row.pair) }}</span
              ><small
                v-if="row.hot"
                class="hot-label"
                >{{ tr('仅PI') }}</small
              >
            </div></template
          ></el-table-column
        >
        <el-table-column
          :formatter="formatCell"
          prop="price"
          :label="$t('text160')"
          sortable="custom"
          min-width="230"
          ><template #default="{ row }"
            >{{ formatMoney(usdPrice(row, row.price), 'USD', 6)
            }}<span
              v-if="row.price !== null"
              class="fiat-price"
              >/ {{ row.price }} {{ row.pair.split('/')[1] }}</span
            ></template
          ></el-table-column
        >
        <el-table-column
          :formatter="formatCell"
          prop="change"
          :label="$t('text161')"
          sortable="custom"
          min-width="115"
          ><template #default="{ row }"
            ><span :class="{ negative: row.change.startsWith('-'), positive: row.change.startsWith('+') }">{{
              tr(row.change)
            }}</span></template
          ></el-table-column
        >
        <el-table-column
          :formatter="priceCell"
          prop="high"
          :label="$t('text162')"
          sortable="custom"
          min-width="170"
        />
        <el-table-column
          :formatter="priceCell"
          prop="low"
          :label="$t('text163')"
          sortable="custom"
          min-width="170"
        />
        <el-table-column
          :formatter="priceCell"
          prop="turnover"
          :label="$t('text164')"
          min-width="200"
        />
        <el-table-column
          :label="$t('text065')"
          align="right"
          width="100"
          ><template #default
            ><button
              class="market-trade"
              @click="trade"
            >
              {{ $t('text145') }}
            </button></template
          ></el-table-column
        >
      </el-table>
    </main>
  </div>
</template>

<style scoped>
.market-page {
  min-height: 100vh;
  background: #fff;
  color: #101114;
  --market-accent: #d9aa00;
}
.market-nav {
  min-height: 72px;
  background: #090e13;
  color: #cbd0d8;
  display: flex;
  align-items: center;
  padding: 0 40px;
  gap: 36px;
  font-size: 14px;
}
.market-brand {
  display: flex;
  flex-shrink: 0;
}
.market-nav nav,
.market-right {
  display: flex;
  align-items: center;
  gap: 28px;
}
.market-nav nav {
  flex-wrap: wrap;
}
.market-nav .active {
  color: #fff;
}
.market-right {
  margin-left: auto;
  align-self: stretch;
  white-space: nowrap;
}
.market-container {
  width: calc(100% - 48px);
  max-width: 1200px;
  margin: 0 auto;
}
.market-tickers {
  background: #f5f5f5;
  padding: 14px 0 24px;
}
.ticker-cards {
  display: flex;
  gap: 16px;
}
.ticker-card {
  width: 288px;
  min-width: 0;
  height: 123px;
  padding: 16px;
  background: #fff;
  border-radius: 5px;
  font-size: 14px;
}
.ticker-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.coin-symbol {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff8200;
  color: #fff;
  border-radius: 50%;
  font-size: 17px;
  font-weight: 700;
}
.coin-symbol.ethereum {
  background: #327ca5;
}
.ticker-change {
  margin-left: auto;
  color: #60636b;
}
.negative {
  color: #fa3557;
}
.positive { color: #169c74; }
.ticker-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 14px 0;
}
.ticker-price strong {
  font-size: 24px;
}
.ticker-price small {
  font-size: 12px;
  color: #60636b;
  white-space: nowrap;
}
.ticker-volume {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #60636b;
}
.ticker-volume button {
  display: flex;
  border: 0;
  background: none;
  padding: 0;
  color: #a2a5ae;
  font-size: 16px;
  cursor: pointer;
}
.market-main {
  padding: 30px 0 40px;
}
.market-main h1 {
  font-size: 36px;
  line-height: 1.4;
  margin: 0 16px 34px;
  color: #000;
}
.market-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-left: 16px;
}
.market-modes {
  display: flex;
  gap: 12px;
}
.market-modes button {
  height: 32px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 0;
  border-radius: 4px;
  background: #f7f7f8;
  color: #60636b;
  padding: 0 16px;
  cursor: pointer;
  font-size: 14px;
}
.market-modes button.selected {
  color: #151923;
  background: #f5ff18;
}
.market-search {
  width: 300px;
  flex-shrink: 0;
}
.market-search :deep(.el-input__wrapper) {
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 0 0 1px #d8dfeb inset;
  padding: 4px 16px;
}
.market-search :deep(.el-input__icon) {
  font-size: 18px;
}
.quote-tabs {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 22px 0 18px;
  padding-left: 16px;
}
.quote-tabs button {
  border: 0;
  border-right: 1px solid #eee;
  background: none;
  padding: 0 16px;
  color: #60636b;
  font-size: 14px;
  cursor: pointer;
}
.quote-tabs button:first-child {
  padding-left: 0;
}
.quote-tabs button:last-child {
  border-right: 0;
}
.quote-tabs button.active {
  color: var(--market-accent);
}
.market-table {
  --el-table-border-color: #e7e8eb;
  --el-table-header-text-color: #858b96;
  --el-table-text-color: #20242b;
  --el-table-row-hover-bg-color: #fffdf0;
  font-size: 14px;
}
.market-table :deep(th.el-table__cell) {
  height: 42px;
  font-size: 12px;
  font-weight: 400;
  border-bottom: 0;
}
.market-table :deep(td.el-table__cell) {
  height: 64px;
}
.market-table :deep(.cell) {
  padding: 0 16px;
  white-space: nowrap;
}
.market-table :deep(.sort-caret) {
  border-width: 3px;
}
.market-table :deep(.sort-caret.ascending) {
  top: 7px;
}
.market-table :deep(.sort-caret.descending) {
  bottom: 9px;
}
.market-pair {
  display: flex;
  align-items: center;
  gap: 6px;
}
.favorite-toggle {
  border: 0;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  color: #a1a5ae;
  font-size: 18px;
  cursor: pointer;
}
.favorite-toggle.saved {
  color: var(--market-accent);
}
.hot-label {
  background: #fff5a8;
  color: var(--market-accent);
  font-size: 11px;
  line-height: 14px;
  padding: 3px 6px;
  border-radius: 5px;
}
.fiat-price {
  color: #60636b;
}
.market-trade {
  border: 0;
  padding: 8px 12px;
  border-radius: 5px;
  background: #f5ff18;
  color: #151923;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
@media (max-width: 1000px) {
  .market-nav {
    padding: 12px 24px;
    gap: 20px;
    flex-wrap: wrap;
  }
  .market-right {
    height: 40px;
  }
  .market-nav nav {
    gap: 20px;
  }
}
@media (max-width: 600px) {
  .market-container {
    width: calc(100% - 24px);
  }
  .ticker-cards {
    gap: 10px;
    flex-wrap: wrap;
  }
  .ticker-card {
    width: 100%;
  }
  .market-toolbar {
    align-items: flex-start;
    flex-direction: column;
    padding-left: 0;
  }
  .market-search {
    width: 100%;
  }
  .market-main h1 {
    margin-left: 0;
    font-size: 30px;
  }
  .market-nav {
    padding: 12px;
  }
  .market-right {
    margin-left: 0;
    gap: 20px;
  }
  .market-nav nav {
    font-size: 13px;
  }
}
</style>
