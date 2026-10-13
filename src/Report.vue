<script setup>
import SiteHeader from './SiteHeader.vue'
import { tr } from './i18n'
import { Tickets } from '@element-plus/icons-vue'
import { computed, ref, watch } from 'vue'
const path = window.location.pathname
const type = path.includes('/wallet')
  ? 'wallet'
  : path.includes('/otc-orders')
    ? 'otc'
    : path.includes('/settle')
      ? 'settle'
      : 'spot'
const tabs = [
  ['spot', '现货交易记录', '/bge/hk/zh-CN/user/report/spot'],
  ['wallet', '钱包操作记录', '/bge/hk/zh-CN/user/report/wallet'],
  ['otc', 'OTC 订单', '/bge/hk/zh-CN/user/report/otc-orders'],
  ['settle', '结单记录', '/bge/hk/zh-CN/user/report/settle'],
]
const walletTab = ref('fiat')
const spotTab = ref('history')
const otcTab = ref('match')
const otcPair = ref('all')
const otcStatus = ref('all')
const settleTab = ref('all')
const walletDirection = ref('deposit')
const walletCoin = ref('all')
const walletStatus = ref('all')
const spotPair = ref('all')
const spotOrderType = ref('all')
const spotSide = ref('all')
const walletRange = ref([])
const otcRange = ref([])
const applied = ref({ spot: [], wallet: [], otc: [] })
function applyFilters() {
  applied.value = { ...applied.value, wallet: walletRange.value, otc: otcRange.value }
}
function inRange(time, range) {
  if (!range || range.length !== 2 || !range[0] || !range[1]) return true
  const day = String(time).slice(0, 10).replaceAll('/', '-')
  return day >= range[0] && day <= range[1]
}
const walletCoins = computed(() => walletTab.value === 'fiat'
  ? ['USD', 'HKD', 'CNY']
  : walletTab.value === 'digital'
    ? ['BTC', 'ETH', 'USDT', 'USDC']
    : ['USD', 'HKD', 'BTC', 'ETH', 'USDT', 'USDC'])
const rawRows = computed(() => {
  if (type === 'spot') {
    if (spotTab.value === 'deals') return [['2026-10-09 14:32:08', 'BTC/USDT', '买入', '84,106.64', '0.125 BTC', '10,513.33 USDT', '10.51 USDT', '主动成交']]
    if (spotTab.value === 'current') return [['2026-10-09 15:06:21', 'ETH/USDT', '限价单', '卖出', '4,982.00', '2.000 ETH', '--', '--', '--', '未成交', '详情']]
    return [['2026-10-08 11:18:42', 'BTC/USDT', '限价单', '买入', '83,800.00', '0.250 BTC', '83,812.40', '0.250 BTC', '20,953.10 USDT', '完全成交', '详情'], ['2026-10-07 09:44:10', 'ETH/USDT', '市价单', '卖出', '4,910.20', '1.500 ETH', '4,910.20', '1.500 ETH', '7,365.30 USDT', '完全成交', '详情']]
  }
  if (type === 'wallet') {
    if (walletTab.value === 'fiat') return [['2026-10-08 10:25:16', 'USD', '10,000.00', 'HSBC **** 2861', '主要银行卡', '已完成', '查看']]
    if (walletTab.value === 'transfer' || walletTab.value === 'quick') return [['2026-10-07 16:42:03', 'USDT', '2,500.00', '资金账户', '交易账户', '已完成']]
    return [['2026-10-06 12:08:44', 'BTC', '0.18000000', 'bc1q...9x2k', '已完成']]
  }
  if (type === 'otc') {
    if (otcTab.value === 'match') return [['2026-10-08 15:20:12', '买入', '10,000 HKD', '1,278.40 USDT', '12.00 HKD', '7.8220', '8.0000 HKD', '自行下单', '24', '已完成']]
    return [['2026-10-05 13:10:09', 'USDT', 'HKD', '1,000.00', '8.0000 HKD', '电邮联系', '12', '已完成']]
  }
  return settleTab.value === 'monthly' ? [['2026年09月结单', '下载']] : [['2026年10月08日日结单', '下载']]
})
function rowTime(row) {
  const name = String(row[0])
  const day = name.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (day) return `${day[1]}-${day[2].padStart(2, '0')}-${day[3].padStart(2, '0')}`
  const month = name.match(/(\d{4})年(\d{1,2})月/)
  if (month) return `${month[1]}-${month[2].padStart(2, '0')}-01`
  return name.slice(0, 10).replaceAll('/', '-')
}
const mockRows = computed(() => {
  const range = applied.value[type]
  if (!range || range.length !== 2 || !range[0] || !range[1]) return rawRows.value
  return rawRows.value.filter((row) => inRange(rowTime(row), range))
})
function resetWalletFilters() {
  walletCoin.value = 'all'
  walletStatus.value = 'all'
  walletRange.value = []
  applied.value = { ...applied.value, wallet: [] }
}
function resetOtcFilters() {
  otcPair.value = 'all'
  otcStatus.value = 'all'
  otcRange.value = []
  applied.value = { ...applied.value, otc: [] }
}
watch(walletTab, resetWalletFilters)
watch(walletDirection, () => { walletStatus.value = 'all' })
const columns = () => {
  if (type === 'spot') {
    if (spotTab.value === 'deals') return ['成交时间', '交易对', '买卖方向', '成交价格', '成交数量', '成交金额', '手续费', '成交角色']
    if (spotTab.value === 'history') return ['委托时间', '交易对', '订单类型', '买卖方向', '委托价格', '委托数量', '成交均价', '成交数量', '成交金额', '成交状态', '详情']
  }
  if (type === 'wallet') {
    if (walletTab.value === 'fiat') return ['时间', '法币', '汇款金额', '汇款银行卡', '银行卡标签', '状态', '操作']
    if (walletTab.value === 'transfer') return ['时间', '币种', '数量', '从', '到', '状态']
    return ['时间', '数字货币', '数量', '发起方地址', '状态']
  }
  if (type === 'otc') return otcTab.value === 'match'
    ? ['时间', '买卖方向', '支付金额', '获得金额', '手续费', '成交单价', '最高购买单价', '委托类型', '有效期（小时）', '状态']
    : ['时间', '支付币种', '获得币种', '购买/出售数量', '最高购买单价', '委托类型', '有效期（小时）', '状态']
  if (type === 'settle') return ['结单名称', '操作']
  return ['委托时间', '交易对', '订单类型', '买卖方向', '委托价格', '委托数量', '成交状态', '详情']
}
</script>
<style scoped>
.user-layout .order-sidebar {
  flex: 0 0 220px;
  width: 220px;
}
.user-layout .order-sidebar a {
  padding: 0 24px;
  white-space: nowrap;
}
.report-main {
  min-width: 0;
}
.order-title {
  margin: 0;
  padding: 0 0 22px;
  border-bottom: 1px solid #dce2eb;
  font-size: 22px;
  font-weight: 500;
}
</style>
<template>
  <div class="user-page report-page">
    <SiteHeader active="report" />
    <div class="user-layout">
      <aside
        class="order-sidebar"
        :aria-label="$t('text293')"
      >
        <a
          v-for="tab in tabs"
          :key="tab[0]"
          :href="tab[2]"
          :class="{ sel: type === tab[0] }"
          :aria-current="type === tab[0] ? 'page' : undefined"
          ><el-icon><Tickets /></el-icon>{{ tr(tab[1]) }}</a
        >
      </aside>
      <main class="report-main">
        <section class="report-box">
          <h1 class="order-title">{{ tr(tabs.find((tab) => tab[0] === type)[1]) }}</h1>
          <template v-if="type === 'spot'"
            ><div class="sub-tabs">
              <span :class="{ active: spotTab === 'current' }" @click="spotTab = 'current'">{{ $t('text294') }}</span
              ><span :class="{ active: spotTab === 'history' }" @click="spotTab = 'history'">{{ $t('text295') }}</span
              ><span :class="{ active: spotTab === 'deals' }" @click="spotTab = 'deals'">{{ $t('text296') }}</span>
            </div>
            <div v-if="spotTab !== 'deals'" class="filters">
              <el-select v-model="spotPair" class="filter-select" aria-label="交易对"><el-option label="全部交易对" value="all" /><el-option label="BTC/USDT" value="BTC/USDT" /><el-option label="ETH/USDT" value="ETH/USDT" /><el-option label="BTC/USD" value="BTC/USD" /></el-select><el-select v-model="spotOrderType" class="filter-select" aria-label="订单类型"><el-option label="全部订单类型" value="all" /><el-option label="限价单" value="limit" /><el-option label="市价单" value="market" /></el-select
              ><button class="yellow">{{ $t('text283') }}</button
              ><button>{{ $t('text299') }}</button>
            </div>
            <div v-else class="filters">
              <el-select v-model="spotPair" class="filter-select" aria-label="交易对"><el-option label="全部交易对" value="all" /><el-option label="BTC/USDT" value="BTC/USDT" /><el-option label="ETH/USDT" value="ETH/USDT" /><el-option label="BTC/USD" value="BTC/USD" /></el-select><el-select v-model="spotSide" class="filter-select" aria-label="买卖方向"><el-option label="全部方向" value="all" /><el-option label="买入" value="buy" /><el-option label="卖出" value="sell" /></el-select><button class="yellow">{{ $t('text283') }}</button><button>{{ $t('text299') }}</button>
            </div>
            <div v-if="spotTab === 'current'" class="table-head spot-head">
              <span>{{ $t('text300') }}</span
              ><span>{{ $t('text247') }}</span
              ><span>{{ $t('text301') }}</span
              ><span>{{ $t('text302') }}</span
              ><span>{{ $t('text303') }}</span
              ><span>{{ $t('text304') }}</span
              ><span>{{ $t('text305') }}</span
              ><span>{{ $t('text306') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div v-else-if="spotTab === 'history'" class="table-head spot-head">
              <span>委托时间</span><span>交易对</span><span>订单类型</span><span>买卖方向</span><span>委托价格</span><span>委托数量</span><span>成交均价</span><span>成交数量</span><span>成交金额</span><span>成交状态</span><span>详情</span>
            </div>
            <div v-else class="table-head spot-head">
              <span>成交时间</span><span>交易对</span><span>买卖方向</span><span>成交价格</span><span>成交数量</span><span>成交金额</span><span>手续费</span><span>成交角色</span>
            </div></template
          ><template v-else-if="type === 'wallet'"
            ><div class="sub-tabs">
              <span :class="{ active: walletTab === 'digital' }" @click="walletTab = 'digital'">{{ $t('text307') }}</span
              ><span :class="{ active: walletTab === 'fiat' }" @click="walletTab = 'fiat'">{{ $t('text308') }}</span
              ><span :class="{ active: walletTab === 'transfer' }" @click="walletTab = 'transfer'">{{ $t('text309') }}</span
              ><span :class="{ active: walletTab === 'quick' }" @click="walletTab = 'quick'">{{ $t('text310') }}</span>
            </div>
            <div class="filters">
              <el-select v-if="['fiat', 'digital'].includes(walletTab)" v-model="walletDirection" aria-label="存取款类型" class="filter-select">
                <el-option :label="tr('存款')" value="deposit" />
                <el-option :label="tr('取款')" value="withdraw" />
              </el-select>
              <el-select v-model="walletCoin" aria-label="币种" class="filter-select">
                <el-option :label="tr('全部币种')" value="all" />
                <el-option v-for="coin in walletCoins" :key="coin" :label="coin" :value="coin" />
              </el-select>
              <el-select v-if="['fiat', 'digital'].includes(walletTab)" v-model="walletStatus" aria-label="状态" class="filter-select">
                <el-option :label="tr('全部状态')" value="all" />
                <el-option :label="tr('处理中')" value="pending" />
                <el-option :label="tr('已完成')" value="completed" />
                <el-option v-if="walletDirection === 'withdraw'" :label="tr('已取消')" value="cancelled" />
              </el-select>
              <el-date-picker
                v-model="walletRange"
                class="date-picker"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="-"
                :start-placeholder="tr('开始日期')"
                :end-placeholder="tr('结束日期')"
                aria-label="日期范围"
              /><button class="yellow" @click="applyFilters">{{ $t('text283') }}</button
              ><button @click="resetWalletFilters">{{ $t('text299') }}</button>
            </div>
            <div v-if="walletTab === 'fiat'" class="table-head wallet-head">
              <span>{{ $t('text313') }}</span
              ><span>{{ $t('text314') }}</span
              ><span>{{ $t('text285') }}</span
              ><span>{{ $t('text315') }}</span
              ><span>{{ $t('text063') }}</span
              ><span>{{ $t('text316') }}</span
              ><span>{{ $t('text286') }}</span>
            </div>
            <div v-else class="table-head wallet-head transfer-head">
              <span>{{ $t('text313') }}</span><span>{{ $t('text314') }}</span><span>{{ $t('text285') }}</span><span>{{ $t('text315') }}</span><span>{{ $t('text316') }}</span>
            </div></template
          ><template v-else-if="type === 'otc'"
            ><div class="sub-tabs">
              <span :class="{ active: otcTab === 'intent' }" @click="otcTab = 'intent'">{{ $t('text317') }}</span
              ><span :class="{ active: otcTab === 'match' }" @click="otcTab = 'match'">{{ $t('text318') }}</span>
            </div>
            <div class="filters">
              <el-select v-model="otcPair" class="filter-select" aria-label="交易对"><el-option label="全部交易对" value="all" /><el-option label="BTC/USDT" value="BTC/USDT" /><el-option label="ETH/USDT" value="ETH/USDT" /></el-select><el-select v-model="otcStatus" class="filter-select" aria-label="状态"><el-option label="全部状态" value="all" /><el-option label="待处理" value="pending" /><el-option label="已完成" value="completed" /><el-option label="已取消" value="cancelled" /></el-select
              ><el-date-picker
                v-model="otcRange"
                class="date-picker"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="-"
                :start-placeholder="tr('开始日期')"
                :end-placeholder="tr('结束日期')"
                aria-label="日期范围"
              /><button class="yellow" @click="applyFilters">{{ $t('text283') }}</button
              ><button @click="resetOtcFilters">{{ $t('text299') }}</button>
            </div>
            <div class="table-head otc-head">
              <span>{{ $t('text313') }}</span
              ><span>{{ $t('text302') }}</span
              ><span>{{ $t('text321') }}</span
              ><span>{{ $t('text322') }}</span
              ><span>{{ $t('text323') }}</span
              ><span>最高购买单价</span><span>委托类型</span><span>有效期（小时）</span><span>{{ $t('text063') }}</span>
            </div></template
          ><template v-else
            ><div class="sub-tabs">
              <span :class="{ active: settleTab === 'all' }" @click="settleTab = 'all'">{{ $t('text165') }}</span
              ><span :class="{ active: settleTab === 'daily' }" @click="settleTab = 'daily'">{{ $t('text324') }}</span
              ><span :class="{ active: settleTab === 'monthly' }" @click="settleTab = 'monthly'">{{ $t('text325') }}</span
              ><em>{{ $t('text326') }}</em
              ><button>{{ $t('text020') }}</button>
            </div>
            <div class="table-head settle-head">
              <span>{{ $t('text327') }}</span
              ><span>{{ $t('text065') }}</span>
            </div></template
          >
          <el-table :data="mockRows.map(row => Object.fromEntries(row.map((cell, index) => [String(index), cell])))" class="report-table" :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }" empty-text="暂无数据">
            <el-table-column v-for="(column, index) in columns()" :key="column" :prop="String(index)" :label="column" min-width="130" align="center" />
          </el-table>
          <div class="pager">‹　›</div>
        </section>
      </main>
    </div>
    <footer>
      <div class="footer-inner">
        <a
          class="brand footer-brand"
          href="/bge/hk/zh-CN/"
          ><img
            class="brand-logo brand-logo-full"
            src="/logo-bge.svg"
            alt="BGE"
            width="116"
            height="28"
        /></a>
        <div>
          <h4>{{ $t('text004') }}</h4>
          <a href="/bge/hk/zh-CN/about">{{ $t('text067') }}</a
          ><a href="/bge/hk/zh-CN/security">{{ $t('text068') }}</a>
        </div>
        <div>
          <h4>{{ $t('text069') }}</h4>
          <a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a>{{ $t('text071') }}</a
          ><a>{{ $t('text110') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a>{{ $t('text072') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
