<script setup>
import SiteHeader from './SiteHeader.vue'
import { tr } from './i18n'
import Footer from './Footer.vue'
import { currentAccount } from './demoAccounts'

// The same plan the asset page reads, so the two pages cannot quote different limits.
const plan = currentAccount.value.plan
const hkd = (value) =>
  `${Number(Math.abs(value)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} HKD`
// One decimal, so a day that has barely started still reads as a live figure rather than 0%.
const share = (used, limit) =>
  limit > 0 ? Math.min(Math.round((used / limit) * 1000) / 10, 100) : 0
// The record table carries no currency suffix, so it formats on its own.
const amount = (value) =>
  Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const dailyUsedShare = share(plan.dailyUsed, plan.dailyLimit)
const holdUsedShare = share(plan.holdUsed, plan.holdLimit)
const changes = [
  ['使用额度', '法币购买数字货币（如BTC/USD，ETH/HKD）', '委托发起'],
  ['恢复额度', '数字货币卖出成法币（如BTC/USD，ETH/HKD）', '委托成交'],
  ['恢复额度', '撤销法币购买数字货币(如BTC/USD，ETH/HKD)的委托单', '委托撤销'],
]
</script>

<template>
  <div class="user-page quote-page">
    <SiteHeader active="assets" />
    <main class="quote-main">
      <h1>{{ $t('quotaTitle') }}</h1>
      <div class="quote-columns">
        <div class="quote-body">
          <h2>{{ $t('quotaHoldTitle') }}</h2>
          <ol>
            <li>{{ $t('quotaHoldBody1') }}</li>
            <li>{{ $t('quotaHoldBody2') }}</li>
            <li>{{ $t('quotaHoldBody3') }}</li>
            <li>{{ $t('quotaHoldBody4') }}</li>
          </ol>

          <h2>{{ $t('quotaDailyTitle') }}</h2>
          <ol>
            <li>{{ $t('quotaDailyBody1') }}</li>
            <li>{{ $t('quotaDailyBody2') }}</li>
          </ol>
          <table class="quote-table">
            <thead>
              <tr><th>{{ $t('quotaChange') }}</th><th>{{ $t('quotaAction') }}</th><th>{{ $t('quotaTrigger') }}</th></tr>
            </thead>
            <tbody>
              <tr
                v-for="row in changes"
                :key="row[1]"
              >
                <td>{{ tr(row[0]) }}</td>
                <td>{{ tr(row[1]) }}</td>
                <td>{{ tr(row[2]) }}</td>
              </tr>
            </tbody>
          </table>

          <h2>{{ $t('quotaRecordsTitle') }}</h2>
          <table class="quote-table quote-records">
            <thead>
              <tr>
                <th>{{ $t('text313') }}</th><th>{{ $t('quotaChangeType') }}</th><th>{{ $t('quotaAction') }}</th><th>{{ $t('text247') }}</th><th>{{ $t('quotaChangeAmount') }}</th><th>{{ $t('quotaLeftAmount') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-09-01 17:15:03</td>
                <td>{{ tr('每日恢复额度') }}</td>
                <td>—</td>
                <td>—</td>
                <td class="positive">+{{ amount(plan.dailyLimit) }}</td>
                <td>{{ amount(plan.dailyLimit) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="quote-pager">
            <span>‹</span><span class="active">1</span><span>›</span>
          </div>
        </div>

        <div class="quote-aside">
          <section class="quote-card">
            <h3>{{ $t('quotaRiskTitle') }}</h3>
            <dl>
              <div>
                <dt>{{ $t('quotaRiskLevel') }}</dt>
                <dd>{{ $t(plan.riskKey) }} <span class="quote-bars"><i v-for="step in 5" :key="step" :class="{ off: step > plan.riskLevel }" /></span></dd>
              </div>
              <div><dt>{{ $t('quotaAssessedAt') }}</dt><dd>{{ plan.riskDate }}</dd></div>
            </dl>
            <p class="quote-note">{{ $t('quotaRiskNote') }}</p>
          </section>
          <section class="quote-card">
            <h3>{{ $t('assetQuota') }}</h3>
            <p class="quote-meter-title">{{ $t('quotaDailyLimit') }}</p>
            <span class="quote-meter"><i :style="{ width: dailyUsedShare + '%' }" /></span>
            <dl>
              <div>
                <dt>{{ $t('quotaTotal') }}</dt><dd>{{ hkd(plan.dailyLimit) }}</dd>
              </div>
              <div>
                <dt>{{ $t('text266') }} {{ dailyUsedShare }}%</dt><dd>{{ hkd(plan.dailyUsed) }}</dd>
              </div>
              <div>
                <dt>{{ $t('quotaLeft') }}</dt><dd>{{ hkd(plan.dailyLimit - plan.dailyUsed) }}</dd>
              </div>
            </dl>
            <p class="quote-meter-title">{{ $t('quotaPositionLimit') }}</p>
            <span class="quote-meter filled"><i :style="{ width: holdUsedShare + '%' }" /></span>
            <dl>
              <div>
                <dt>{{ $t('quotaTotal') }}</dt><dd>{{ hkd(plan.holdLimit) }}</dd>
              </div>
              <div>
                <dt>{{ $t('text266') }} {{ holdUsedShare }}%</dt><dd>{{ hkd(plan.holdUsed) }}</dd>
              </div>
              <div>
                <dt>{{ $t('quotaLeft') }}</dt><dd :class="{ over: plan.holdLimit - plan.holdUsed < 0 }">{{ plan.holdLimit - plan.holdUsed < 0 ? $t('assetQuotaOver') + ' ' : '' }}{{ hkd(plan.holdLimit - plan.holdUsed) }}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.quote-page{background:#fff}
.quote-main{width:min(1190px,calc(100% - 64px));margin:0 auto;padding:48px 0 72px;color:#2c3a47}
.quote-main h1{margin:0 0 44px;color:#171d27;font-size:30px;font-weight:600}
.quote-columns{display:flex;gap:48px;align-items:flex-start}
.quote-body{flex:1;min-width:0}
.quote-body h2{margin:44px 0 18px;color:#171d27;font-size:19px;font-weight:600}
.quote-body h2:first-child{margin-top:0}
.quote-body ol{margin:0;padding-left:22px;color:#3f4a56;font-size:14px;line-height:2}
.quote-body li{margin:0 0 12px}
.quote-table{width:100%;margin-top:22px;border-collapse:collapse;font-size:14px}
.quote-table th,.quote-table td{padding:14px 16px;border:1px solid #e6e6e6;text-align:center;color:#3f4a56}
.quote-table th{background:#f7f8fa;color:#5d6a76;font-weight:500;white-space:nowrap}
.quote-records td{height:64px}
.quote-table .positive{color:#0ca30c}
.quote-pager{display:flex;justify-content:center;gap:8px;margin-top:26px}
.quote-pager span{display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:30px;border:1px solid #e6e6e6;border-radius:2px;color:#9aa2ad;font-size:14px}
.quote-pager span.active{border-color:#f5ff18;background:#f5ff18;color:#111}
.quote-aside{width:380px;flex:0 0 380px;display:flex;flex-direction:column;gap:20px}
.quote-card{padding:26px 24px;border:1px solid #ececec;border-radius:4px;background:#fbfcfd}
.quote-card h3{margin:0 0 20px;color:#171d27;font-size:16px;font-weight:600}
.quote-card dl{margin:0}
.quote-card dl > div{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px;font-size:13.5px}
.quote-card dl > div:last-child{margin-bottom:0}
.quote-card dt{margin:0;color:#8a94a6}
.quote-card dd{display:flex;align-items:center;gap:8px;margin:0;color:#171d27;font-weight:500}
.quote-card dd.over{color:#e0443a}
.quote-bars{display:inline-flex;gap:3px}
.quote-bars i{display:block;width:6px;height:15px;background:#f5c518}
.quote-bars i.off{background:#e6e8ec}
.quote-note{margin:20px 0 0;color:#9aa2ad;font-size:12px}
.quote-meter-title{margin:22px 0 0;color:#3f4a56;font-size:13.5px;font-weight:600}
.quote-meter{display:block;height:6px;margin:12px 0 16px;border-radius:3px;background:#ececec}
.quote-meter i{display:block;height:6px;border-radius:3px;background:#f5c518}
@media (max-width:1100px){.quote-columns{flex-direction:column;align-items:stretch}.quote-aside{width:100%;flex:1 1 auto}.quote-main{width:calc(100% - 40px)}}
</style>
