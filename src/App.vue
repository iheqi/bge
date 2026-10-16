<script setup>
import { elementLocale } from './i18n'
import UserMenu from './UserMenu.vue'
import { computed } from 'vue'
import Home from './Home.vue'
import Spot from './Spot.vue'
import Otc from './Otc.vue'
import Company from './Company.vue'
import UserCenter from './UserCenter.vue'
import CryptoWithdraw from './CryptoWithdraw.vue'
import CryptoDeposit from './CryptoDeposit.vue'
import FiatDeposit from './FiatDeposit.vue'
import QuoteLimit from './QuoteLimit.vue'
import FiatWithdraw from './FiatWithdraw.vue'
import Kyc from './Kyc.vue'
import KycPerson from './KycPerson.vue'
import KycCorp from './KycCorp.vue'
import KycInstitution from './KycInstitution.vue'
import Report from './Report.vue'
import ReportDetail from './ReportDetail.vue'
import AccountSecurity from './AccountSecurity.vue'
import ApiPage from './ApiPage.vue'
import Payment from './Payment.vue'
import MessageCenter from './MessageCenter.vue'
import Market from './Market.vue'
import Parameters from './Parameters.vue'
import FeeStandard from './FeeStandard.vue'
import Announcement from './Announcement.vue'
import Login from './Login.vue'
import DemoNote from './DemoNote.vue'
import { loggedIn } from './session'
const path = window.location.pathname
// Signed-out visitors are sent to the login page when they open an account page.
if (!loggedIn.value && path.startsWith('/bge/hk/zh-CN/user/')) {
  window.location.replace('/bge/hk/zh-CN/login')
}
// 场外 › 去交易 used to open its own page; it now shares 订单 › OTC 订单.
if (path.replace(/\/$/, '') === '/bge/hk/zh-CN/otc/trade') {
  window.location.replace('/bge/hk/zh-CN/user/report/otc-orders')
}
const page = computed(() =>
  path.includes('/login')
    ? 'login'
    : path.includes('/support/announcement')
    ? 'announcement'
    : path.includes('/market')
    ? 'market'
    : path.includes('/quote-limit')
    ? 'quote-limit'
    : path.includes('/user/fiat/deposit')
    ? 'fiat-deposit'
    : path.includes('/user/crypto/deposit')
    ? 'crypto-deposit'
    : path.includes('/user/crypto/withdraw')
    ? 'crypto-withdraw'
    : path.includes('/user/fiat/withdraw')
    ? 'fiat-withdraw'
    : path.includes('/user/payment')
      ? 'payment'
      : path.includes('/user/api')
        ? 'api'
        : path.includes('/user/security')
          ? 'user-security'
          // A record's detail page sits under /user/report, so its branch has to come first.
          : path.includes('/user/report/detail')
            ? 'report-detail'
            : path.includes('/user/report')
            ? 'report'
            : path.includes('/user/kyc/person')
              ? 'kyc-person'
              : path.includes('/user/kyc/corp')
                ? 'kyc-corp'
                : path.includes('/user/kyc/institution')
                  ? 'kyc-institution'
                  : path.includes('/user/kyc')
                ? 'kyc'
              : path.includes('/user/assets')
                ? 'assets'
                : path.includes('/user/dashboard')
                  ? 'dashboard'
    : path.includes('/otc')
                    ? 'otc'
                    : path.includes('/security')
                      ? 'security'
                      : path.includes('/about')
                        ? 'about'
                        : 'home',
)
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <Login v-if="page === 'login'" />
    <Announcement v-else-if="page === 'announcement'" />
    <MessageCenter v-else-if="path.replace(/\/$/, '') === '/bge/hk/zh-CN/user/messages'" />
    <Spot v-else-if="path.replace(/\/$/, '') === '/bge/hk/zh-CN/spot'" />
    <Otc v-else-if="page === 'otc'" />
    <FeeStandard v-else-if="path.replace(/\/$/, '').endsWith('/user/fee-standard')" />
    <Parameters v-else-if="path.replace(/\/$/, '').endsWith('/user/fees')" />
    <Market v-else-if="page === 'market'" />
    <UserCenter
      v-else-if="page === 'assets' || page === 'dashboard'"
      :assets="page === 'assets'"
    />
    <Kyc v-else-if="page === 'kyc'" />
    <KycPerson v-else-if="page === 'kyc-person'" />
    <KycCorp v-else-if="page === 'kyc-corp'" />
    <KycInstitution v-else-if="page === 'kyc-institution'" />
    <CryptoWithdraw v-else-if="page === 'crypto-withdraw'" />
    <CryptoDeposit v-else-if="page === 'crypto-deposit'" />
    <FiatDeposit v-else-if="page === 'fiat-deposit'" />
    <QuoteLimit v-else-if="page === 'quote-limit'" />
    <FiatWithdraw v-else-if="page === 'fiat-withdraw'" />
    <ReportDetail v-else-if="page === 'report-detail'" />
    <Report v-else-if="page === 'report'" />
    <AccountSecurity v-else-if="page === 'user-security'" />
    <ApiPage v-else-if="page === 'api'" />
    <Payment v-else-if="page === 'payment'" />
    <Company
      v-else-if="page === 'about' || page === 'security'"
      :security="page === 'security'"
    />
    <Home v-else />
    <!-- Lives here rather than in each page so the note follows every route on its own. -->
    <DemoNote />
  </el-config-provider>
</template>
