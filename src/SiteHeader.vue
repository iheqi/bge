<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { ArrowDown } from '@element-plus/icons-vue'
defineProps({ active: { type: String, default: '' } })
</script>
<template>
  <header class="site-header">
    <a class="site-header-brand" href="/bge/hk/zh-CN/"><img src="/logo-bge-light.svg" alt="BGE" width="116" height="28" /></a>
    <nav class="site-header-nav">
      <a :class="{ active: active === 'home' }" href="/bge/hk/zh-CN/">{{ $t('text000') }}</a>
      <a :class="{ active: active === 'market' }" href="/bge/hk/zh-CN/market">{{ $t('text001') }}</a>
      <a :class="{ active: active === 'otc' }" href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
      <a :class="{ active: active === 'spot' }" href="/bge/hk/zh-CN/spot">{{ $t('text003') }}</a>
      <a :class="{ active: active === 'about' }" href="/bge/hk/zh-CN/about">{{ $t('text004') }}<el-icon><ArrowDown /></el-icon></a>
    </nav>
    <div class="site-header-right"><a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a><MessageBell /><UserMenu /><LanguageSwitcher /><span class="site-header-divider"></span><CurrencySwitcher /></div>
  </header>
</template>
<style>
.site-header { height:72px; min-width:1100px; padding:0 40px; display:flex; align-items:center; gap:42px; background:#090e13; color:#c8cbd0; font-size:14px; }
.site-header-brand { flex:0 0 auto; display:flex; align-items:center; }
.site-header-brand img { display:block; width:116px; height:28px; }
.site-header-nav, .site-header-right { display:flex; align-items:center; flex-wrap:nowrap; white-space:nowrap; }
.site-header-nav { gap:38px; }
.site-header-right { gap:29px; margin-left:auto; align-self:stretch; }
.site-header a { color:inherit; text-decoration:none; }
.site-header-nav a.active { color:#fff; }
.site-header-divider { height:16px; border-left:1px solid #41464d; }
</style>
