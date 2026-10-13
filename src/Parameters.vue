<script setup>
import SiteHeader from './SiteHeader.vue'
import { tr } from './i18n'
import ParameterContent from './ParameterContent.vue'
import FeeContent from './FeeContent.vue'
import UserSidebar from './UserSidebar.vue'
import {
  ArrowDown,
  Grid,
  Wallet,
  Tickets,
  User,
  Lock,
  Briefcase,
  Connection,
} from '@element-plus/icons-vue'
const props = defineProps({ fees: Boolean })
</script>
<template>
  <div class="user-page parameter-page">
    <SiteHeader active="parameters" />
    <div class="user-layout">
      <UserSidebar />
      <!--
      <aside>
        <a href="/bge/hk/zh-CN/user/dashboard"
          ><el-icon><Grid /></el-icon>{{ $t('text008') }}</a
        ><a href="/bge/hk/zh-CN/user/kyc"
          ><el-icon><User /></el-icon>{{ $t('text009') }}</a
        ><a href="/bge/hk/zh-CN/user/security"
          ><el-icon><Lock /></el-icon>{{ $t('text010') }}</a
        ><a href="/bge/hk/zh-CN/user/payment/fiat"
          ><el-icon><Briefcase /></el-icon>{{ $t('text011') }}</a
        ><a :class="{ sel: props.fees }" href="/bge/hk/zh-CN/user/fees"><el-icon><Tickets /></el-icon>费率查询</a
        ><a
          :class="{ sel: !props.fees }"
          href="/bge/hk/zh-CN/user/parameters"
          ><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a
        ><a href="/bge/hk/zh-CN/user/api"
          ><el-icon><Connection /></el-icon>{{ $t('text013') }}</a
        >
      </aside> -->
      <FeeContent v-if="props.fees" /><ParameterContent v-else />
    </div>
    <footer>
      <div class="footer-inner">
        <a
          class="brand footer-brand"
          href="/bge/hk/zh-CN/"
          ><img
            class="brand-logo brand-logo-full"
            src="/logo-bge.svg"
            alt="BGE"
            width="116"
            height="28"
        /></a>
        <div>
          <h4>{{ $t('text004') }}</h4>
          <a href="/bge/hk/zh-CN/about">{{ $t('text067') }}</a
          ><a href="/bge/hk/zh-CN/security">{{ $t('text068') }}</a>
        </div>
        <div>
          <h4>{{ $t('text069') }}</h4>
          <a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a>{{ $t('text071') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a>{{ $t('text072') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
