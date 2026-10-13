<script setup>
import SiteHeader from './SiteHeader.vue'
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
const coin = computed(() => pair.value.split('/')[0])
const payCoin = computed(() => pair.value.split('/')[1])
const canSubmit = computed(() => Boolean(quantity.value && price.value && validity.value))

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
  <div class="otc-trade-page">
    <SiteHeader active="otc" />
    <main class="otc-trade-main">
      <div class="otc-trade-title"><h1>OTC订单</h1><button class="otc-primary" @click="showForm = true">下单</button></div>
      <el-tabs v-model="tab"><el-tab-pane label="买卖意向单" name="intent" /><el-tab-pane label="OTC匹配单" name="match" /></el-tabs>
      <el-table :data="orders" class="otc-orders-table" empty-text="暂无数据">
        <el-table-column prop="time" label="时间" min-width="170" />
        <el-table-column prop="pair" label="交易对" min-width="120" />
        <el-table-column prop="side" label="买卖方向" min-width="100" />
        <el-table-column prop="quantity" label="购买/出售数量" min-width="150" />
        <el-table-column prop="price" label="最高购买单价" min-width="150" />
        <el-table-column prop="validity" label="有效期（小时）" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100" />
        <el-table-column label="操作" width="100"><template #default="{ row }"><el-button v-if="row.status === '待成交'" link type="danger" @click="cancelOrder(row)">撤单</el-button><span v-else>--</span></template></el-table-column>
      </el-table>
    </main>
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
.otc-trade-page{min-height:100vh;background:#f5f6f8;color:#303744}
.otc-trade-main{max-width:1360px;margin:28px auto 56px;padding:30px 34px 42px;background:#fff;box-shadow:0 1px 4px rgb(35 45 60 / 5%)}
.otc-trade-title{display:flex;align-items:center;justify-content:space-between;padding-bottom:22px;border-bottom:1px solid #dce2eb}.otc-trade-title h1{margin:0;color:#202633;font-size:24px;font-weight:600}
.otc-primary{height:40px;padding:0 28px;border:0;border-radius:5px;background:#f5ff18;color:#111;font-size:14px;font-weight:600;cursor:pointer}.otc-primary:hover,.otc-trade-btn:hover{background:#e8f000}
.otc-primary:disabled{background:#eef1f5;color:#a6adb8;cursor:not-allowed}
.otc-trade-main :deep(.el-tabs__header){margin:20px 0 0}.otc-trade-main :deep(.el-tabs__item){height:48px;padding:0 26px;color:#8992a2;font-size:16px}.otc-trade-main :deep(.el-tabs__item.is-active){color:#ddb500;font-weight:600}.otc-trade-main :deep(.el-tabs__active-bar){background:#f0cf00}
.otc-orders-table{margin-top:4px;border:1px solid #edf0f4}.otc-orders-table :deep(.el-table__header th){height:48px;background:#f5f7fa;color:#697585;font-weight:400}.otc-orders-table :deep(.el-table__row td){height:56px;color:#596576}.otc-orders-table :deep(.el-table__row:hover>td){background:#fffdf0}
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
.otc-actions{display:flex;gap:16px;justify-content:center}.otc-trade-btn{display:inline-flex;align-items:center;justify-content:center;width:140px;height:42px;border-radius:6px;background:#f5ff18;color:#111;text-decoration:none;font-size:15px;font-weight:600}
@media (max-width:800px){.otc-trade-main{margin:0;padding:20px 16px 30px}.otc-form{padding:20px 16px 4px}.otc-form :deep(.el-form-item__label){font-size:13px}.otc-trade-main :deep(.el-table){font-size:12px}}
</style>
