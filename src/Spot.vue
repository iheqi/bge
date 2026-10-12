<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import MessageBell from './MessageBell.vue'
import UserMenu from './UserMenu.vue'
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<template>
  <div class="spot-page">
    <header class="otc-nav spot-nav">
      <a
        class="otc-brand"
        href="/bge/hk/zh-CN/"
        ><img
          class="brand-logo brand-logo-full"
          src="/logo-bge-light.svg"
          alt="BGE"
          width="116"
          height="28"
      /></a>
      <nav>
        <a href="/bge/hk/zh-CN/">{{ $t('text000') }}</a>
        <a href="/bge/hk/zh-CN/market">{{ $t('text001') }}</a>
        <a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
        <a
          class="on"
          href="/bge/hk/zh-CN/spot"
          >{{ $t('text003') }}</a
        >
        <a href="/bge/hk/zh-CN/about"
          >{{ $t('text004') }}<el-icon><ArrowDown /></el-icon
        ></a>
      </nav>
      <div class="otc-right">
        <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
        ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
        ><MessageBell /><UserMenu /><LanguageSwitcher /><span
          class="account-divider"
          aria-hidden="true"
        ></span
        ><CurrencySwitcher />
      </div>
    </header>
    <main class="spot-screenshot"><img src="/images/spot-trading-demo.png" alt="现货交易页面" /></main>
  </div>
</template>

<style scoped>
.spot-screenshot{min-height:calc(100vh - 72px);background:#20252e;overflow:auto}.spot-screenshot img{display:block;width:100%;min-width:1100px;height:auto}
</style>
