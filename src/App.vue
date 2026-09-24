<script setup>
import { elementLocale } from './i18n'
import UserMenu from './UserMenu.vue'
import { computed } from 'vue'
import Home from './Home.vue'
import Spot from './Spot.vue'
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
import Parameters from './Parameters.vue'
const path = window.location.pathname
const page = computed(() =>
  path.includes('/market')
    ? 'market'
    : path.includes('/user/payment')
      ? 'payment'
      : path.includes('/user/api')
        ? 'api'
        : path.includes('/user/security')
          ? 'user-security'
          : path.includes('/user/report')
            ? 'report'
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
    <MessageCenter v-if="path.replace(/\/$/, '') === '/bge/hk/zh-CN/user/messages'" />
    <Spot v-else-if="path.replace(/\/$/, '') === '/bge/hk/zh-CN/spot'" />
    <Otc v-else-if="page === 'otc'" />
    <Parameters v-else-if="path.replace(/\/$/, '').endsWith('/user/parameters')" />
    <Market v-else-if="page === 'market'" />
    <UserCenter
      v-else-if="page === 'assets' || page === 'dashboard'"
      :assets="page === 'assets'"
    />
    <Kyc v-else-if="page === 'kyc'" />
    <Report v-else-if="page === 'report'" />
    <AccountSecurity v-else-if="page === 'user-security'" />
    <ApiPage v-else-if="page === 'api'" />
    <Payment v-else-if="page === 'payment'" />
    <Company
      v-else-if="page === 'about' || page === 'security'"
      :security="page === 'security'"
    />
    <Home v-else />
  </el-config-provider>
</template>
