<script setup>
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { ref, computed } from 'vue'
import { Search, StarFilled, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const tab = ref('spot'),
  quote = ref('all'),
  search = ref('')
const markets = [
  [
    'BTC/USDT',
    '84,106.6420',
    '¥ 564,474.11',
    '-2.77%',
    '86,542.9629',
    '83,516.9365',
    '¥ 13.69亿',
    true,
  ],
  ['ETH/USDT', '4,981.810', '¥ 33,434.97', '0.00%', '4,981.810', '4,981.810', '¥ 0.00', true],
  ['SOL/USDT', '175.49605', '¥ 1,177.83', '0.00%', '175.49605', '175.49605', '¥ 0.00'],
  ['DOGE/USDT', '0.18128', '¥ 1.22', '0.00%', '0.18128', '0.18128', '¥ 0.00'],
  ['ADA/USDT', '0.895476', '¥ 6.01', '0.00%', '0.895476', '0.895476', '¥ 0.00'],
  ['ETH/BTC', '0.03348402', '¥ 18,911.19', '0.00%', '0.03348402', '0.03348402', '¥ 0.00', true],
  ['EOS/USDT', '--/--', '--', '--', '--', '--', '--'],
  ['ABCA/USDT', '1.0000', '¥ 6.71', '0.00%', '1.0000', '1.0000', '¥ 0.00'],
]
let saved = ['ETH/USDT']
try {
  const value = JSON.parse(localStorage.getItem('bge-market-favorites'))
  if (Array.isArray(value)) saved = value.filter((v) => typeof v === 'string')
} catch {}
const favorites = ref(saved)
const sort = ref({ key: '', order: '' })
const rows = markets.map((m) => ({
  pair: m[0],
  price: m[1],
  fiat: m[2],
  change: m[3],
  high: m[4],
  low: m[5],
  turnover: m[6],
  hot: m[7],
}))
const filtered = computed(() => {
  if (tab.value === 'contract') return []
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
          : (parseFloat(a[key].replaceAll(',', '')) || 0) -
            (parseFloat(b[key].replaceAll(',', '')) || 0)
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
  ElMessage.info('现货交易页面尚未开放')
}
</script>
<template>
  <div class="market-page">
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
        <a href="/bge/hk/zh-CN/">首页</a><a href="/bge/hk/zh-CN/otc">场外</a
        ><a
          class="active"
          href="/bge/hk/zh-CN/market"
          >行情</a
        ><a href="#">现货交易</a><a href="/bge/hk/zh-CN/about">公司</a>
      </nav>
      <div class="market-right">
        <a href="/bge/hk/zh-CN/user/report/spot">订单</a
        ><a href="/bge/hk/zh-CN/user/assets">资产管理</a><MessageBell /><UserMenu />
      </div>
    </header>
    <section class="market-tickers">
      <div class="market-container ticker-cards">
        <article
          v-for="(coin, index) in markets.slice(0, 2)"
          :key="coin[0]"
          class="ticker-card"
        >
          <div class="ticker-title">
            <span
              class="coin-symbol"
              :class="{ ethereum: index === 1 }"
              >{{ index === 0 ? '₿' : '♦' }}</span
            >{{ coin[0]
            }}<span
              class="ticker-change"
              :class="{ negative: index === 0 }"
              >{{ coin[3] }}</span
            >
          </div>
          <div class="ticker-price">
            <strong>{{ coin[1] }}</strong
            ><small>{{ coin[2] }}</small>
          </div>
          <div class="ticker-volume">
            24H Vol {{ index === 0 ? '2,405.25206' : '0.00000'
            }}<button
              title="交易"
              aria-label="交易"
              @click="trade"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
        </article>
      </div>
    </section>
    <main class="market-container market-main">
      <h1>行情</h1>
      <div class="market-toolbar">
        <div
          class="market-modes"
          role="tablist"
          aria-label="市场类型"
        >
          <button
            v-for="mode in [
              ['favorites', '自选'],
              ['spot', '现货'],
              ['contract', '合约'],
            ]"
            :key="mode[0]"
            role="tab"
            :aria-selected="tab === mode[0]"
            :class="{ selected: tab === mode[0] }"
            @click="tab = mode[0]"
          >
            <el-icon v-if="mode[0] === 'favorites'"><StarFilled /></el-icon>{{ mode[1] }}
          </button>
        </div>
        <el-input
          v-model="search"
          class="market-search"
          :prefix-icon="Search"
          placeholder="搜索币种"
          aria-label="搜索币种"
          clearable
        />
      </div>
      <div
        class="quote-tabs"
        role="tablist"
        aria-label="报价币"
      >
        <button
          v-for="item in [
            ['all', '全部行情'],
            ['USDT', 'USDT'],
            ['BTC', 'BTC'],
          ]"
          :key="item[0]"
          role="tab"
          :aria-selected="quote === item[0]"
          :class="{ active: quote === item[0] }"
          @click="quote = item[0]"
        >
          {{ item[1] }}
        </button>
      </div>
      <el-table
        :data="filtered"
        class="market-table"
        :empty-text="
          tab === 'contract'
            ? '暂无合约行情'
            : tab === 'favorites'
              ? '暂无符合条件的自选行情'
              : '暂无匹配行情'
        "
        @sort-change="({ prop, order }) => (sort = { key: prop, order })"
      >
        <el-table-column
          prop="pair"
          label="市场"
          sortable="custom"
          min-width="180"
          ><template #default="{ row }"
            ><div class="market-pair">
              <button
                class="favorite-toggle"
                :class="{ saved: favorites.includes(row.pair) }"
                :aria-pressed="favorites.includes(row.pair)"
                :aria-label="(favorites.includes(row.pair) ? '取消自选 ' : '添加自选 ') + row.pair"
                :title="favorites.includes(row.pair) ? '取消自选' : '添加自选'"
                @click="toggleFavorite(row.pair)"
              >
                <el-icon><StarFilled /></el-icon></button
              ><span>{{ row.pair }}</span
              ><small
                v-if="row.hot"
                class="hot-label"
                >热门</small
              >
            </div></template
          ></el-table-column
        >
        <el-table-column
          prop="price"
          label="最新价"
          sortable="custom"
          min-width="230"
          ><template #default="{ row }"
            >{{ row.price
            }}<span
              v-if="row.fiat !== '--'"
              class="fiat-price"
              >/ {{ row.fiat }}</span
            ></template
          ></el-table-column
        >
        <el-table-column
          prop="change"
          label="涨跌幅"
          sortable="custom"
          min-width="115"
          ><template #default="{ row }"
            ><span :class="{ negative: row.change.startsWith('-') }">{{
              row.change
            }}</span></template
          ></el-table-column
        >
        <el-table-column
          prop="high"
          label="最高价"
          sortable="custom"
          min-width="170"
        />
        <el-table-column
          prop="low"
          label="最低价"
          sortable="custom"
          min-width="170"
        />
        <el-table-column
          prop="turnover"
          label="24H成交额"
          min-width="200"
        />
        <el-table-column
          label="操作"
          align="right"
          width="80"
          ><template #default
            ><button
              class="market-trade"
              @click="trade"
            >
              交易
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
  --market-accent: #0ab99f;
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
  border-radius: 8px;
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
  color: var(--market-accent);
  background: #dff6f1;
}
.market-search {
  width: 300px;
  flex-shrink: 0;
}
.market-search :deep(.el-input__wrapper) {
  border-radius: 24px;
  background: #f7f7f7;
  box-shadow: none;
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
  --el-table-border-color: #eee;
  --el-table-header-text-color: #9da1ac;
  --el-table-text-color: #101114;
  --el-table-row-hover-bg-color: #f8fcfb;
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
  background: #e3f8f3;
  color: var(--market-accent);
  font-size: 11px;
  line-height: 14px;
}
.fiat-price {
  color: #60636b;
}
.market-trade {
  border: 0;
  padding: 0;
  background: none;
  color: var(--market-accent);
  font-size: 14px;
  cursor: pointer;
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
