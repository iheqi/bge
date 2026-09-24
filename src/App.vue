<script setup>
import UserMenu from './UserMenu.vue'
import { computed } from 'vue'
import Home from './Home.vue'
import Otc from './Otc.vue'
import Company from './Company.vue'
import UserCenter from './UserCenter.vue'
import Kyc from './Kyc.vue'
import Report from './Report.vue'
import AccountSecurity from './AccountSecurity.vue'
import ApiPage from './ApiPage.vue'
import Payment from './Payment.vue'
import MessageCenter from './MessageCenter.vue'
import Market from './Market.vue'
const path = window.location.pathname
const page = computed(() => path.includes('/market') ? 'market' : path.includes('/user/payment') ? 'payment' : path.includes('/user/api') ? 'api' : path.includes('/user/security') ? 'user-security' : path.includes('/user/report') ? 'report' : path.includes('/user/kyc') ? 'kyc' : path.includes('/user/assets') ? 'assets' : path.includes('/user/dashboard') ? 'dashboard' : path.includes('/otc') ? 'otc' : path.includes('/security') ? 'security' : path.includes('/about') ? 'about' : 'home')
</script>

<template>
  <MessageCenter v-if="path.replace(/\/$/, '') === '/bge/hk/zh-CN/user/messages'" />
  <Otc v-else-if="page === 'otc'" />
  <Market v-else-if="page === 'market'" />
  <UserCenter v-else-if="page === 'assets' || page === 'dashboard'" :assets="page === 'assets'" />
  <Kyc v-else-if="page === 'kyc'" />
  <Report v-else-if="page === 'report'" />
  <AccountSecurity v-else-if="page === 'user-security'" />
  <ApiPage v-else-if="page === 'api'" />
  <Payment v-else-if="page === 'payment'" />
  <Company v-else-if="page === 'about' || page === 'security'" :security="page === 'security'" />
  <Home v-else />
<!--
      <div class="brand"><img class="brand-logo brand-logo-full" src="/logo-bge.svg" alt="BGE" width="116" height="28" /></div>
      <nav class="main-links"><a class="active">首页</a><a>场外</a><a>现货交易</a><a class="company">公司 <el-icon><ArrowDown /></el-icon></a></nav>
      <div class="right-links"><a href="/bge/hk/zh-CN/user/report/spot">订单</a><a href="/bge/hk/zh-CN/user/assets">资产管理</a><UserMenu /><a>简体中文</a><i></i><a>USD</a></div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-inner">
          <h1>在安全可靠的<br/>数字资产平台交易</h1>
          <div class="hero-art" aria-hidden="true"><div class="coin coin-back">₿</div><div class="card-art"><span></span></div></div>
        </div>
        <div class="news"><span class="slider"></span><div>保护您的账户与资产安全　 2026-09-21　/　 系统维护完成：HKBGF 服务已全面恢复　 2026-07-14　/　 关于2026年7月11日至7月15日进行系统临时性维护...　 2026-07-08　/　 更多 &gt;</div></div>
      </section>

      <section class="about"><h2>进一步了解我们</h2><div class="about-row company-row"><div class="scene scene-hk"><div class="disc">✦</div><div class="disc coin-hk">◆</div></div><div class="copy"><h3>香港上市公司旗下成员</h3><p>BGE 为香港上市公司旗下成员公司，我们致力于打造一家安全、稳健、合规的数字资产交易平台，客户的资产安全和合规运营从第一天开始都是我们的首要任务。</p><strong><span class="hk-icon">✤</span> 股票代码 1726.HK</strong></div></div><div class="about-row safety-row"><div class="copy"><h3>资产安全</h3><ul><li>线下冷钱包存储 98% 的用户资产，冷温热三层安全结构</li><li>更高安全级别的 HSM 加密机</li><li>离线签名，多重验证</li><li>多级审核冷钱包体系确保资产安全</li></ul></div><div class="scene shield-scene"><div class="shield">✓</div><div class="coin green">₮</div><div class="coin gold">₿</div></div></div></section>
    </main>

    <footer><div class="footer-inner"><div class="brand footer-brand"><img class="brand-logo brand-logo-full" src="/logo-bge.svg" alt="BGE" width="116" height="28" /></div><div><h4>公司</h4><a>关于我们</a><a>安全</a></div><div><h4>产品</h4><a>现货交易</a><a>场外</a><h4 class="service">服务</h4><a>帮助中心</a></div><div><h4>条款</h4><a>条款及细则</a><a>隐私政策</a><a>免责声明</a><a>交易规则</a><a>Cookie政策</a><a>Cookie偏好设置</a></div><div class="contact"><h4>关于我们</h4><a>邮箱：cs@bg.exchange</a><a>地址：香港上环干诺道中168-200号信德中心<br/>招商局大厦24楼2414-2416室</a></div></div><div class="legal"><span>BGE@2026</span><p>免责声明：HKBGF所提供的虚拟资产交易服务只针对专业投资者。虚拟资产的价值很可能剧烈波动。虚拟资产交易有极高风险，因此可能不适合所有投资者/交易者。虚拟资产过去的价格不代表未来的结果。在决定投资之前，您应该仔细考虑您的投资目标、经验水平和风险偏好。</p></div></footer>
  </div> -->
</template>
