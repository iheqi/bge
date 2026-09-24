<script setup>
import { formatMoney, formatFiatText } from './currency'
import { tr, formatCell } from './i18n'
import { ref } from 'vue'
const active = ref('fees')
const detail = ref(null)
const fees = [
  ['BTC/USDT', '0.10%', '0.10%', '0.0005 BTC', '2026-01-01'],
  ['ETH/USDT', '0.10%', '0.10%', '0.005 ETH', '2026-01-01'],
  ['SOL/USDT', '0.10%', '0.10%', '0.01 SOL', '2026-01-01'],
  ['USDC/HKD', '0.05%', '0.05%', '免费', '2026-01-01'],
]
const types = [
  [
    '现货交易',
    true,
    'BTC/USDT, ETH/USDT, SOL/USDT, USDC/HKD, USDT/HKD',
    '限价单、市价单、高级限价单',
  ],
  ['OTC交易', true, 'BTC/USDT, ETH/USDT, USDC/HKD', '一口价模式，电话/邮件人工撮合'],
  ['杠杆交易', false, '-', '香港VATP牌照不支持杠杆交易'],
  ['合约交易', false, '-', '香港VATP牌照不支持衍生品交易'],
]
const limits = [
  ['法币充值', '500,000 HKD', '2,000,000 HKD', '10,000,000 HKD', '0%'],
  ['法币提现', '500,000 HKD', '1,000,000 HKD', '5,000,000 HKD', '0%'],
  ['代币充值', '无限制', '无限制', '无限制', '-'],
  ['代币提现', '5 BTC (等值)', '20 BTC (等值)', '100 BTC (等值)', '0%'],
  ['现货交易', '500,000 HKD', '1,000,000 HKD', '-', '0%'],
]
const summaries = [
  { title: 'Daily Trading Limit (每日交易限额)', total: '1,000,000 HKD' },
  { title: 'Position Limit (持仓限额)', total: '5,000,000 HKD' },
]
</script>

<template>
  <main class="parameter-main">
    <h1>{{ $t('text012') }}</h1>
    <p class="parameter-description">{{ $t('text245') }}</p>
    <el-tabs
      v-model="active"
      class="parameter-tabs"
    >
      <el-tab-pane
        :label="$t('text246')"
        name="fees"
      >
        <el-table :data="fees">
          <el-table-column
            :formatter="formatCell"
            v-for="(label, i) in ['交易对', 'Maker 费率', 'Taker 费率', '提币费率', '生效时间']"
            :key="label"
            :label="tr(label)"
            :prop="String(i)"
            min-width="150"
          />
        </el-table>
        <p class="parameter-note">{{ $t('text252') }}</p>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('text253')"
        name="types"
      >
        <p class="investor-summary">
          <el-tag size="small">{{ $t('text131') }}</el-tag
          >{{ $t('text254') }}
        </p>
        <el-table :data="types">
          <el-table-column
            :formatter="formatCell"
            :label="$t('text255')"
            prop="0"
            min-width="130"
          />
          <el-table-column
            :label="$t('text063')"
            min-width="120"
            ><template #default="{ row }"
              ><el-tag
                :type="row[1] ? 'success' : 'danger'"
                size="small"
                >{{ tr(row[1] ? '已开通' : '未开通') }}</el-tag
              ></template
            ></el-table-column
          >
          <el-table-column
            :formatter="formatCell"
            :label="$t('text258')"
            prop="2"
            min-width="390"
          />
          <el-table-column
            :formatter="formatCell"
            :label="$t('text053')"
            prop="3"
            min-width="260"
          />
        </el-table>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('text259')"
        name="limits"
      >
        <div class="limit-summaries">
          <div
            v-for="item in summaries"
            :key="item.title"
          >
            <p>{{ tr(item.title) }}</p>
            <strong
              >{{ tr('Total:') }} {{ formatFiatText(item.total) }} | {{ tr('Used:') }} 0%</strong
            >
            <el-button
              link
              @click="detail = item"
              >{{ tr('Details') }}</el-button
            >
          </div>
        </div>
        <el-table :data="limits">
          <el-table-column
            :formatter="(_row, _column, value) => tr(formatFiatText(value))"
            v-for="(label, i) in ['限额类型', '单笔限额', '日累计限额', '月累计限额', '当前已用']"
            :key="label"
            :label="tr(label)"
            :prop="String(i)"
            min-width="150"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :model-value="!!detail"
      :title="tr(detail?.title)"
      width="480px"
      @close="detail = null"
    >
      <el-descriptions
        v-if="detail"
        :column="1"
        border
        ><el-descriptions-item :label="$t('text265')">{{
          formatFiatText(detail.total)
        }}</el-descriptions-item
        ><el-descriptions-item :label="$t('text266')"
          >{{ formatMoney(0, 'HKD') }} (0%)</el-descriptions-item
        ><el-descriptions-item :label="$t('text267')">{{
          formatFiatText(detail.total)
        }}</el-descriptions-item></el-descriptions
      >
    </el-dialog>
  </main>
</template>

<style scoped>
.parameter-main {
  flex: 1;
  min-width: 0;
  padding: 24px;
  background: #f6f6f6;
  color: #252a32;
}
h1 {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 500;
}
.parameter-description,
.parameter-note {
  font-size: 13px;
  color: #929ba9;
}
.parameter-description {
  margin: 0 0 24px;
}
.parameter-tabs {
  background: #fff;
  --el-color-primary: #d8b000;
  --el-border-color-light: #e2e6ed;
}
.parameter-tabs :deep(.el-tabs__header) {
  margin: 0;
}
.parameter-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0 24px;
}
.parameter-tabs :deep(.el-tabs__item) {
  height: 56px;
  font-size: 15px;
}
.parameter-tabs :deep(.el-tabs__content) {
  padding: 20px 24px 24px;
}
.parameter-tabs :deep(.el-table) {
  --el-table-header-bg-color: #f4f6f9;
  --el-table-header-text-color: #697585;
  --el-table-border-color: #edf0f4;
  --el-table-text-color: #303744;
  font-size: 13px;
}
.parameter-tabs :deep(.el-table__cell) {
  padding: 14px 0;
}
.parameter-note {
  margin: 16px 0 0;
}
.investor-summary {
  margin: 0 0 18px;
  font-size: 14px;
}
.limit-summaries {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
.limit-summaries > div {
  background: #f4f6f9;
  padding: 16px;
  min-width: 0;
}
.limit-summaries p {
  color: #929ba9;
  font-size: 13px;
  margin: 0 0 8px;
}
.limit-summaries strong {
  font-size: 14px;
}
@media (max-width: 700px) {
  .limit-summaries {
    grid-template-columns: 1fr;
  }
}
</style>
