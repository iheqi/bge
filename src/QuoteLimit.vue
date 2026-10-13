<script setup>
import SiteHeader from './SiteHeader.vue'
import Footer from './Footer.vue'

const changes = [
  ['使用额度', '法币购买数字货币（如BTC/USD，ETH/HKD）', '委托发起'],
  ['恢复额度', '数字货币卖出成法币（如BTC/USD，ETH/HKD）', '委托成交'],
  ['恢复额度', '撤销法币购买数字货币(如BTC/USD，ETH/HKD)的委托单', '委托撤销'],
]
const holders = [
  ['总共', '1,500,000,000.00 HKD'],
  ['已用 0%', '0.00 HKD'],
  ['剩余', '1,500,000,000.00 HKD'],
]
const position = [
  ['总共', '3,000,000,000.00 HKD'],
  ['已用 100%', '2,059,268,000,953.32 HKD'],
  ['剩余', '超出 2,056,268,000,953.32 HKD'],
]
</script>

<template>
  <div class="user-page quote-page">
    <SiteHeader active="assets" />
    <main class="quote-main">
      <h1>账户持仓说明</h1>
      <div class="quote-columns">
        <div class="quote-body">
          <h2>持仓限额说明</h2>
          <ol>
            <li>仓位持仓限额是根据您在身份认证(KYC)验证期间提交的资产证明和风险评估的结果而确定的数值。这是您可以在您的账户中持有的虚拟资产的最大值。剩余仓位限制是您可以使用法定货币购买的账户中虚拟资产的剩余价值。当您持有的虚拟资产价值超过仓位限制时，您可能不再能够使用 HKBGE 以法定货币购买虚拟资产，但仍然可以进行出售操作。</li>
            <li>仅法定货币交易对的购买受到仓位限制。虚拟资产交易对之间的买卖（例如BTC/USDC）不受限制，每天的仓位限制恢复不会超过每日交易限制。</li>
            <li>虚拟资产的存款入账价值将被计算为已使用的仓位限制，而虚拟资产成功提款价值将被视为恢复已使用的仓位限制。</li>
            <li>如果仓位限制剩余为零，或者客户希望申请更大的限制，您可能需要联系我们，并相应提供更多的资产证明。</li>
          </ol>

          <h2>每日交易限额说明</h2>
          <ol>
            <li>每日交易限制（UTC+8时区，00:00-23:59:59）是您每天可以用法定货币购买虚拟资产的价值。这个价值每天在00:00时重置，额度为持仓限额的一半。</li>
            <li>以下行为会使用/恢复您的每日交易限额</li>
          </ol>
          <table class="quote-table">
            <thead>
              <tr><th>额度变化</th><th>操作</th><th>触发条件</th></tr>
            </thead>
            <tbody>
              <tr
                v-for="row in changes"
                :key="row[1]"
              >
                <td>{{ row[0] }}</td>
                <td>{{ row[1] }}</td>
                <td>{{ row[2] }}</td>
              </tr>
            </tbody>
          </table>

          <h2>每日交易额度变动记录</h2>
          <table class="quote-table quote-records">
            <thead>
              <tr>
                <th>时间</th><th>变动类型</th><th>操作</th><th>交易对</th><th>变动金额(HKD)</th><th>剩余金额(HKD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-09-01 17:15:03</td>
                <td>每日恢复额度</td>
                <td>—</td>
                <td>—</td>
                <td class="positive">+1,500,000,000.00</td>
                <td>1,500,000,000.00</td>
              </tr>
            </tbody>
          </table>
          <div class="quote-pager">
            <span>‹</span><span class="active">1</span><span>›</span>
          </div>
        </div>

        <div class="quote-aside">
          <section class="quote-card">
            <h3>风险评测</h3>
            <dl>
              <div>
                <dt>风险等级</dt>
                <dd>极高风险承受能力 <span class="quote-bars"><i /><i /><i /><i /><i /></span></dd>
              </div>
              <div><dt>测评时间</dt><dd>2026-08-18</dd></div>
            </dl>
            <p class="quote-note">账户限额取决于您的风险测评等级和流动资产净值</p>
          </section>
          <section class="quote-card">
            <h3>帐户限额</h3>
            <p class="quote-meter-title">当日交易限额</p>
            <span class="quote-meter"><i style="width: 0" /></span>
            <dl>
              <div
                v-for="row in holders"
                :key="row[0]"
              >
                <dt>{{ row[0] }}</dt><dd>{{ row[1] }}</dd>
              </div>
            </dl>
            <p class="quote-meter-title">账户持仓额度</p>
            <span class="quote-meter filled"><i style="width: 100%" /></span>
            <dl>
              <div
                v-for="row in position"
                :key="row[0]"
              >
                <dt>{{ row[0] }}</dt><dd :class="{ over: row[1].startsWith('超出') }">{{ row[1] }}</dd>
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
.quote-note{margin:20px 0 0;color:#9aa2ad;font-size:12px}
.quote-meter-title{margin:22px 0 0;color:#3f4a56;font-size:13.5px;font-weight:600}
.quote-meter{display:block;height:6px;margin:12px 0 16px;border-radius:3px;background:#ececec}
.quote-meter i{display:block;height:6px;border-radius:3px;background:#f5c518}
@media (max-width:1100px){.quote-columns{flex-direction:column}.quote-aside{width:100%;flex:1 1 auto}.quote-main{width:calc(100% - 40px)}}
</style>
