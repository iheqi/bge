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
    <main class="spot-placeholder">
      <div
        class="spot-placeholder-icon"
        aria-hidden="true"
      >
        📈
      </div>
      <h1>{{ $t('text003') }}</h1>
      <p>{{ $t('spotPlaceholder') }}</p>
    </main>
  </div>
</template>

<style scoped>
.spot-placeholder {
  min-height: 100vh;
  padding: 120px 24px 48px;
  background: #f0f2f5;
  color: #999;
  text-align: center;
}
.spot-placeholder-icon {
  font-size: 44px;
  line-height: 54px;
  opacity: 0.3;
}
.spot-placeholder h1 {
  margin: 22px 0 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}
.spot-placeholder p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
}
</style>
