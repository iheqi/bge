<script setup>
import { tr, formatCell } from './i18n'
import { ref } from 'vue'
const active = ref('trade')
const fees = [['普通用户', '< 50', '或', '< 50', '或', '< 10', '0.300000% / 0.300000%'], ['VIP1', '≥ 50', '或', '≥ 50', '或', '≥ 10', '0.200000% / 0.200000%'], ['VIP2 ✓', '≥ 100', '或', '≥ 100', '或', '≥ 20', '0.100000% / 0.100000%']]
const withdrawal = [['USDT', 'USDT', 'TRC20', '5', '1', '免费'], ['BTC', 'Bitcoin', 'BitCoin', '0.0001', '0.0000046', '免费'], ['ETH', 'Ethereum', 'ERC20', '0.005', '0.0005', '免费'], ['USDC', 'USD Coin', 'ERC20', '5', '1', '免费'], ['HKD', '港币', '法币', '—', '—', '免费'], ['USD', '美元', '法币', '—', '—', '免费']]
const otc = [['BTC/USDC', '0.15%', '0.15%', '—'], ['ETH/USDC', '0.15%', '0.15%', '—'], ['BTC/HKD', '0.10%', '0.10%', '—'], ['ETH/HKD', '0.10%', '0.10%', '—'], ['USDC/USD', '0.05%', '0.05%', '—'], ['BTC/USDT', '0.15%', '0.15%', '—'], ['ETH/USDT', '0.15%', '0.15%', '—'], ['USDT/USD', '0.05%', '0.05%', '—'], ['USDT/HKD', '0.05%', '0.05%', '—']]
</script>
<template><main class="parameter-main fee-content"><h1>费率查询</h1><p class="parameter-description">查看平台交易、提现及 OTC 费率</p><el-tabs v-model="active" class="fee-tabs"><el-tab-pane label="交易费率" name="trade"><el-table :data="fees"><el-table-column v-for="(label, i) in ['等级', '30天成交量 (USD)', '及/或', '资产量 (USD)', '及/或', '邀请总数', 'Maker/Taker']" :key="label" :label="label" :prop="String(i)" min-width="130" /></el-table></el-tab-pane><el-tab-pane label="OTC费率" name="otc"><el-table :data="otc"><el-table-column v-for="(label, i) in ['交易对', '买入费率', '卖出费率', '备注']" :key="label" :label="label" :prop="String(i)" min-width="180" /></el-table></el-tab-pane><el-tab-pane label="提现费率" name="withdrawal"><el-table :data="withdrawal"><el-table-column v-for="(label, i) in ['币种', '全称', '主链类型', '最小提现数量', '提现手续费', '充值手续费']" :key="label" :label="label" :prop="String(i)" min-width="150" /></el-table></el-tab-pane></el-tabs></main></template>
<style scoped>
.fee-content{flex:1;min-width:0;padding:30px 32px 48px;background:#f6f6f6}
.fee-content h1{margin:0 0 12px;font-size:24px;font-weight:500}
.parameter-description{margin:0 0 28px;color:#929ba9;font-size:14px}
.fee-tabs{background:#fff;padding:0 24px 30px;--el-color-primary:#d8b000;--el-border-color-light:#e2e6ed}
.fee-tabs :deep(.el-tabs__header){margin:0 0 24px}
.fee-tabs :deep(.el-tabs__nav-wrap){padding:0 8px}
.fee-tabs :deep(.el-tabs__item){height:62px;padding:0 28px;font-size:16px}
.fee-tabs :deep(.el-table){--el-table-header-bg-color:#fff;--el-table-header-text-color:#9aa1ad;--el-table-border-color:#edf0f4;--el-table-text-color:#171a20;font-size:14px}
.fee-tabs :deep(.el-table th.el-table__cell){height:62px;font-weight:400}
.fee-tabs :deep(.el-table td.el-table__cell){height:64px;padding:0}
.fee-tabs :deep(.el-table .cell){padding:0 16px;white-space:nowrap}
.parameter-note{margin:22px 0 0;color:#929ba9;font-size:13px}
</style>
