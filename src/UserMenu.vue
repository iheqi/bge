<script setup>
import { tr } from './i18n'
const links = [
  ['总览', 'dashboard'],
  ['身份认证', 'kyc'],
  ['账户安全', 'security'],
  ['收付款管理', 'payment/fiat'],
  ['参数查询', 'parameters'],
  ['API管理', 'api'],
]
</script>

<template>
  <div class="account-menu">
    <a
      class="avatar"
      href="/bge/hk/zh-CN/user/dashboard"
      :aria-label="$t('text184')"
      ><img
        src="/avatar.png"
        alt=""
        width="30"
        height="30"
    /></a>
    <div class="account-menu-panel">
      <div class="account-menu-profile">
        <b>heqi**gic@gmail.com</b><small>UID: 8395618828</small>
      </div>
      <a
        v-for="[label, path] in links"
        :key="path"
        :href="'/bge/hk/zh-CN/user/' + path"
        >{{ tr(label) }}</a
      >
      <a href="/bge/hk/zh-CN/">{{ $t('text349') }}</a>
    </div>
  </div>
</template>

<style scoped>
.account-menu {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  z-index: 31;
}
.account-menu-panel {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  padding: 12px;
  background: #2d3443;
  color: #fff;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 8px 18px #0002;
}
.account-menu:hover .account-menu-panel,
.account-menu:focus-within .account-menu-panel {
  display: block;
}
.account-menu-profile {
  padding: 8px 12px 16px;
  font-size: 14px;
}
.account-menu-profile small {
  display: block;
  margin-top: 8px;
  color: #cbd0d8;
}
.account-menu-panel a {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #fff;
  text-decoration: none;
}
.account-menu-panel a:hover,
.account-menu-panel a:focus-visible {
  background: #3a4355;
  border-radius: 4px;
}
</style>
