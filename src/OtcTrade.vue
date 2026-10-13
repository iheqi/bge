<script setup>
import SiteHeader from './SiteHeader.vue'
import Footer from './Footer.vue'
import { computed, ref } from 'vue'
import { Calendar, Close, UploadFilled } from '@element-plus/icons-vue'

const tab = ref('intent')
const showForm = ref(false)
const pair = ref('ETH/USDC')
const side = ref('buy')
const quantity = ref('')
const price = ref('')
const validity = ref('24')
const remark = ref('')
const orders = ref([
  { id: 1, time: '2026-10-10 10:32:18', pair: 'ETH/USDC', side: '买入', quantity: '10.0000 ETH', price: '3,850.00 USDC', validity: '24', status: '待成交' },
])
const pairOptions = ['ETH/USDC', 'BTC/USDC', 'BTC/USDT', 'ETH/USDT']
const filterPair = ref('all')
const filterStatus = ref('all')
const applied = ref({ pair: 'all', status: 'all' })
const coin = computed(() => pair.value.split('/')[0])
const payCoin = computed(() => pair.value.split('/')[1])
const canSubmit = computed(() => Boolean(quantity.value && price.value && validity.value))
const visibleOrders = computed(() =>
  orders.value.filter(
    (order) =>
      (applied.value.pair === 'all' || order.pair === applied.value.pair) &&
      (applied.value.status === 'all' || order.status === applied.value.status),
  ),
)

function applyFilters() {
  applied.value = { pair: filterPair.value, status: filterStatus.value }
}
function resetFilters() {
  filterPair.value = 'all'
  filterStatus.value = 'all'
  applyFilters()
}
function submitOrder() {
  if (!canSubmit.value) return
  orders.value.unshift({
    id: Date.now(), time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    pair: pair.value, side: side.value === 'buy' ? '买入' : '卖出', quantity: `${quantity.value} ${coin.value}`,
    price: `${price.value} ${payCoin.value}`, validity: validity.value, status: '待成交',
  })
  showForm.value = false
  quantity.value = ''; price.value = ''; remark.value = ''
}
function cancelOrder(order) { order.status = '已撤单' }
</script>

<template>
  <div class="user-page">
    <SiteHeader active="otc" />
    <main class="otc-trade-main">
      <section class="otc-trade-box">
        <div class="otc-trade-head">
          <h1>{{ $t('text291') }}</h1>
          <button class="otc-primary" @click="showForm = true">下单</button>
        </div>
        <div class="sub-tabs">
          <span :class="{ active: tab === 'intent' }" @click="tab = 'intent'">{{ $t('text317') }}</span>
          <span :class="{ active: tab === 'match' }" @click="tab = 'match'">{{ $t('text318') }}</span>
        </div>
        <div class="filters">
          <el-select v-model="filterPair" class="filter-select" aria-label="交易对"><el-option label="全部交易对" value="all" /><el-option v-for="item in pairOptions" :key="item" :label="item" :value="item" /></el-select><el-select v-model="filterStatus" class="filter-select" aria-label="状态"><el-option label="全部状态" value="all" /><el-option label="待成交" value="待成交" /><el-option label="已撤单" value="已撤单" /></el-select><button class="date"><el-icon><Calendar /></el-icon>{{ $t('text312') }}</button><button class="yellow" @click="applyFilters">{{ $t('text283') }}</button><button @click="resetFilters">{{ $t('text299') }}</button>
        </div>
        <el-table
          :data="visibleOrders"
          class="report-table"
          :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }"
          empty-text="暂无数据"
        >
          <el-table-column prop="time" :label="$t('text313')" min-width="170" align="center" />
          <el-table-column prop="pair" :label="$t('text247')" min-width="120" align="center" />
          <el-table-column prop="side" :label="$t('text302')" min-width="100" align="center" />
          <el-table-column prop="quantity" :label="$t('text323')" min-width="150" align="center" />
          <el-table-column prop="price" :label="$t('text407')" min-width="150" align="center" />
          <el-table-column prop="validity" label="有效期（小时）" min-width="140" align="center" />
          <el-table-column prop="status" :label="$t('text063')" min-width="100" align="center" />
          <el-table-column :label="$t('text065')" width="100" align="center">
            <template #default="{ row }"><button v-if="row.status === '待成交'" class="otc-cancel" @click="cancelOrder(row)">撤单</button><span v-else>--</span></template>
          </el-table-column>
        </el-table>
        <div class="pager">‹　›</div>
      </section>
    </main>
    <Footer />
    <!-- The dialog follows the site panels: dark rounded title bar and the yellow primary action. -->
    <div v-if="showForm" class="otc-form-mask" @click.self="showForm = false">
      <section class="otc-form-dialog">
        <header class="otc-form-head">
          <h2>{{ $t('text398') }}</h2>
          <button class="otc-close" :aria-label="$t('text412')" @click="showForm = false"><el-icon><Close /></el-icon></button>
        </header>
        <el-form class="otc-form" label-width="180px" @submit.prevent="submitOrder">
          <el-form-item :label="$t('text247')" required><el-select v-model="pair"><el-option v-for="item in pairOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item :label="$t('text399')" required><el-radio-group v-model="side"><el-radio value="buy">{{ $t('text400') }}</el-radio><el-radio value="sell">{{ $t('text401') }}</el-radio></el-radio-group></el-form-item>
          <el-form-item :label="$t('text405')"><el-input :model-value="coin" disabled /></el-form-item>
          <el-form-item :label="$t('text406')" required><el-input v-model="quantity" :placeholder="$t('text414')" /></el-form-item>
          <el-form-item :label="$t('text321')"><el-input :model-value="payCoin" disabled /></el-form-item>
          <el-form-item :label="$t('text407')" required><el-input v-model="price" :placeholder="$t('text415')"><template #append>{{ payCoin }}</template></el-input></el-form-item>
          <el-form-item :label="$t('text408')"><el-input model-value="0" disabled><template #append>{{ payCoin }}</template></el-input></el-form-item>
          <el-form-item :label="$t('text409')" required><el-input v-model="validity" :placeholder="$t('text416')"><template #prefix><el-icon><Calendar /></el-icon></template></el-input></el-form-item>
          <el-form-item :label="$t('text410')"><el-input v-model="remark" type="textarea" :rows="3" /></el-form-item>
          <el-form-item :label="$t('text411')"><button type="button" class="otc-upload"><el-icon><UploadFilled /></el-icon>{{ $t('text382') }}</button></el-form-item>
          <div class="otc-form-actions"><button type="button" class="otc-secondary" @click="showForm = false">{{ $t('text412') }}</button><button type="button" class="otc-primary" :disabled="!canSubmit" @click="submitOrder">{{ $t('text413') }}</button></div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.otc-trade-main{padding:24px;max-width:1700px}
.otc-trade-box{position:relative;min-height:640px;padding:24px;background:#fff}
.otc-trade-head{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-bottom:22px;border-bottom:1px solid #dce2eb}
.otc-trade-head h1{margin:0;font-size:22px;font-weight:500}
.otc-primary{flex:0 0 auto;height:40px;padding:0 28px;border:0;border-radius:5px;background:#f5ff18;color:#111;font-size:14px;font-weight:600;cursor:pointer}.otc-primary:hover{background:#e8f000}
.otc-primary:disabled{background:#eef1f5;color:#a6adb8;cursor:not-allowed}
.otc-cancel{border:0;background:none;color:#d6a500;font-size:13px;cursor:pointer}
.otc-cancel:hover{color:#b98e00}
.otc-form-mask{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:24px;background:rgb(0 0 0 / 50%)}
.otc-form-dialog{position:relative;display:flex;flex-direction:column;width:min(720px,calc(100vw - 48px));max-height:calc(100vh - 48px);border-radius:16px;background:#fff;box-shadow:0 12px 32px rgb(0 0 0 / 28%);overflow:hidden}
/* The dark title bar mirrors the header dropdown panels. */
.otc-form-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;background:#272c37;color:#fff}
.otc-form-head h2{margin:0;font-size:18px;font-weight:600}
.otc-close{display:flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:6px;background:transparent;color:#c0c4cc;font-size:18px;cursor:pointer}
.otc-close:hover{background:#343b49;color:#fff}
.otc-form{padding:26px 24px 4px;overflow:auto}
.otc-form :deep(.el-form-item){margin-bottom:18px}
.otc-form :deep(.el-form-item__label){padding-right:18px;color:#69717e;font-size:14px;line-height:44px}
.otc-form :deep(.el-input__wrapper),.otc-form :deep(.el-select__wrapper){min-height:44px;border-radius:8px;box-shadow:0 0 0 1px #d8dee8 inset}
.otc-form :deep(.el-input__wrapper.is-focus),.otc-form :deep(.el-select__wrapper.is-focused){box-shadow:0 0 0 1px #f0d000 inset}
.otc-form :deep(.el-textarea__inner){padding:12px;border-radius:8px;box-shadow:0 0 0 1px #d8dee8 inset}
.otc-form :deep(.el-radio){margin-right:28px;color:#505967;font-size:14px}
.otc-form :deep(.el-radio__label){padding-left:8px}
.otc-form :deep(.el-radio__input.is-checked .el-radio__inner){border-color:#f0d000;background:#f0d000}
.otc-form :deep(.el-radio__input.is-checked + .el-radio__label){color:#303744}
.otc-form :deep(.el-input-group__append){padding:0 20px;color:#7a8391;background:#f5f6f8;border-color:#d8dee8}
.otc-upload{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 22px;border:1px dashed #d8dee8;border-radius:8px;background:#fff;color:#d9a600;font-size:14px;cursor:pointer}
.otc-upload:hover{border-color:#f0d000;background:#fffdf0}
.otc-form-actions{display:flex;gap:11px;justify-content:flex-end;margin:8px 0 0;padding:18px 0 22px;border-top:1px solid #edf0f4}
.otc-secondary{min-width:118px;height:40px;border:0;border-radius:6px;background:#eaedf3;color:#303744;font-size:14px;cursor:pointer}
.otc-secondary:hover{background:#e2e6ee}
</style>
