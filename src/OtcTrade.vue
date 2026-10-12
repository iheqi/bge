<script setup>
import { computed, ref } from 'vue'
import { ArrowDown, Calendar, Close } from '@element-plus/icons-vue'

const tab = ref('intent')
const showForm = ref(false)
const pair = ref('ETH/USDC')
const side = ref('buy')
const contactType = ref('email')
const uid = ref('')
const quantity = ref('')
const price = ref('')
const validity = ref('24')
const remark = ref('')
const orders = ref([
  { id: 1, time: '2026-10-10 10:32:18', pair: 'ETH/USDC', side: '买入', quantity: '10.0000 ETH', price: '3,850.00 USDC', contact: '电邮联系', validity: '24', status: '待成交' },
])
const pairOptions = ['ETH/USDC', 'BTC/USDC', 'BTC/USDT', 'ETH/USDT']
const coin = computed(() => pair.value.split('/')[0])
const payCoin = computed(() => pair.value.split('/')[1])

function submitOrder() {
  if (!uid.value || !quantity.value || !price.value || !validity.value) return
  orders.value.unshift({
    id: Date.now(), time: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
    pair: pair.value, side: side.value === 'buy' ? '买入' : '卖出', quantity: `${quantity.value} ${coin.value}`,
    price: `${price.value} ${payCoin.value}`, contact: contactType.value === 'email' ? '电邮联系' : '电话联系', validity: validity.value, status: '待成交',
  })
  showForm.value = false
  uid.value = ''; quantity.value = ''; price.value = ''; remark.value = ''
}
function cancelOrder(order) { order.status = '已撤单' }
</script>

<template>
  <div class="otc-trade-page">
    <header class="otc-nav">
      <a class="otc-brand" href="/bge/hk/zh-CN/"><img class="brand-logo brand-logo-full" src="/logo-bge-light.svg" alt="BGE" width="116" height="28" /></a>
      <nav><a href="/bge/hk/zh-CN/">首页</a><a href="/bge/hk/zh-CN/market">行情</a><a class="on" href="/bge/hk/zh-CN/otc">场外</a><a href="/bge/hk/zh-CN/spot">现货交易</a><a href="/bge/hk/zh-CN/about">公司<el-icon><ArrowDown /></el-icon></a></nav>
      <div class="otc-right"><a href="/bge/hk/zh-CN/user/report/otc-orders">订单记录</a><a href="/bge/hk/zh-CN/user/assets">资产管理</a><a href="/bge/hk/zh-CN/otc">返回 OTC</a></div>
    </header>
    <main class="otc-trade-main">
      <div class="otc-trade-title"><h1>OTC订单</h1><button class="otc-primary" @click="showForm = true">下单</button></div>
      <el-tabs v-model="tab"><el-tab-pane label="买卖意向单" name="intent" /><el-tab-pane label="OTC匹配单" name="match" /></el-tabs>
      <el-table :data="orders" class="otc-orders-table" empty-text="暂无数据">
        <el-table-column prop="time" label="时间" min-width="170" />
        <el-table-column prop="pair" label="交易对" min-width="120" />
        <el-table-column prop="side" label="买卖方向" min-width="100" />
        <el-table-column prop="quantity" label="购买/出售数量" min-width="150" />
        <el-table-column prop="price" label="最高购买单价" min-width="150" />
        <el-table-column prop="contact" label="委托类型" min-width="110" />
        <el-table-column prop="validity" label="有效期（小时）" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100" />
        <el-table-column label="操作" width="100"><template #default="{ row }"><el-button v-if="row.status === '待成交'" link type="danger" @click="cancelOrder(row)">撤单</el-button><span v-else>--</span></template></el-table-column>
      </el-table>
    </main>
    <div v-if="showForm" class="otc-form-mask" @click.self="showForm = false">
      <section class="otc-form-dialog"><button class="otc-close" @click="showForm = false"><el-icon><Close /></el-icon></button><h2>创建OTC单边意向单</h2>
        <el-form label-width="180px" @submit.prevent="submitOrder">
          <el-form-item label="交易对" required><el-select v-model="pair"><el-option v-for="item in pairOptions" :key="item" :label="item" :value="item" /></el-select></el-form-item>
          <el-form-item label="委托方向" required><el-radio-group v-model="side"><el-radio value="buy">买方</el-radio><el-radio value="sell">卖方</el-radio></el-radio-group></el-form-item>
          <el-form-item label="委托人UID" required><el-input v-model="uid" placeholder="请输入委托人UID" /></el-form-item>
          <el-form-item label="委托类型" required><el-radio-group v-model="contactType"><el-radio value="email">电邮联系</el-radio><el-radio value="phone">电话联系</el-radio></el-radio-group></el-form-item>
          <el-form-item label="购买币种"><el-input :model-value="coin" disabled /></el-form-item>
          <el-form-item label="购买数量" required><el-input v-model="quantity" /></el-form-item>
          <el-form-item label="支付币种"><el-input :model-value="payCoin" disabled /></el-form-item>
          <el-form-item label="最高购买单价" required><el-input v-model="price"><template #append>{{ payCoin }}</template></el-input></el-form-item>
          <el-form-item label="资产冻结数量"><el-input model-value="0" disabled><template #append>{{ payCoin }}</template></el-input></el-form-item>
          <el-form-item label="有效期（仅支持至小时）" required><el-input v-model="validity"><template #prefix><el-icon><Calendar /></el-icon></template></el-input></el-form-item>
          <el-form-item label="备注内容"><el-input v-model="remark" type="textarea" :rows="3" /></el-form-item>
          <el-form-item label="附件"><el-button type="primary">↥ 点击上传</el-button></el-form-item>
          <div class="otc-form-actions"><el-button @click="showForm = false">返回</el-button><el-button type="primary" @click="submitOrder">提交</el-button></div>
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
.otc-trade-main :deep(.el-tabs__header){margin:20px 0 0}.otc-trade-main :deep(.el-tabs__item){height:48px;padding:0 26px;color:#8992a2;font-size:16px}.otc-trade-main :deep(.el-tabs__item.is-active){color:#ddb500;font-weight:600}.otc-trade-main :deep(.el-tabs__active-bar){background:#f0cf00}
.otc-orders-table{margin-top:4px;border:1px solid #edf0f4}.otc-orders-table :deep(.el-table__header th){height:48px;background:#f5f7fa;color:#697585;font-weight:400}.otc-orders-table :deep(.el-table__row td){height:56px;color:#596576}.otc-orders-table :deep(.el-table__row:hover>td){background:#fffdf0}
.otc-form-mask{position:fixed;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;padding:24px;background:rgb(17 24 39 / 48%)}
.otc-form-dialog{position:relative;width:min(1060px,calc(100vw - 48px));max-height:calc(100vh - 48px);overflow:auto;padding:30px 42px 26px;background:#fff;border-radius:4px;box-shadow:0 10px 40px rgb(0 0 0 / 18%)}
.otc-form-dialog h2{margin:0 0 28px;color:#252b36;font-size:26px;font-weight:600}.otc-close{position:absolute;right:22px;top:20px;width:32px;height:32px;border:0;background:none;color:#9299a2;font-size:20px;cursor:pointer}.otc-close:hover{color:#303744}
.otc-form-dialog :deep(.el-form-item){margin-bottom:18px}.otc-form-dialog :deep(.el-form-item__label){padding-right:18px;color:#69717e;font-size:15px;line-height:48px}.otc-form-dialog :deep(.el-input__wrapper),.otc-form-dialog :deep(.el-select__wrapper){min-height:48px;border-radius:5px;box-shadow:0 0 0 1px #d8dee8 inset}.otc-form-dialog :deep(.el-input__wrapper.is-focus),.otc-form-dialog :deep(.el-select__wrapper.is-focused){box-shadow:0 0 0 1px #409eff inset}.otc-form-dialog :deep(.el-textarea__inner){padding:12px;border-color:#d8dee8;border-radius:5px}.otc-form-dialog :deep(.el-radio){margin-right:28px;color:#505967;font-size:15px}.otc-form-dialog :deep(.el-radio__label){padding-left:8px}.otc-form-dialog :deep(.el-input-group__append){padding:0 20px;color:#7a8391;background:#f5f6f8;border-color:#d8dee8}
.otc-form-actions{display:flex;gap:16px;margin:24px 0 0 140px}.otc-form-actions .el-button{min-width:104px;height:42px;border-radius:5px;font-size:15px}.otc-form-actions .el-button--primary{border:0;background:#409eff}
.otc-actions{display:flex;gap:16px;justify-content:center}.otc-trade-btn{display:inline-flex;align-items:center;justify-content:center;width:140px;height:42px;border-radius:6px;background:#f5ff18;color:#111;text-decoration:none;font-size:15px;font-weight:600}
@media (max-width:800px){.otc-trade-main{margin:0;padding:20px 16px 30px}.otc-form-dialog{padding:24px 18px}.otc-form-dialog :deep(.el-form-item__label){font-size:13px}.otc-form-actions{margin-left:0}.otc-trade-main :deep(.el-table){font-size:12px}}
</style>
