<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { CaretBottom } from '@element-plus/icons-vue'
defineProps({
  active: { type: String, default: '' },
  // Pages that are not signed in show the login/register pair instead of the account menu.
  guest: Boolean,
  // OTC keeps its own call to action next to the account area.
  contact: Boolean,
})
// 订单 and 资产管理 open the same kind of hover panel as 公司, so every header entry can be
// reached in one click. The first page of each menu names the sub page it leads to.
const menus = [
  {
    active: 'report',
    label: 'text005',
    href: '/bge/hk/zh-CN/user/report/spot',
    width: 168,
    popper: 'site-header-orders-popper',
    links: [
      { label: 'text289', href: '/bge/hk/zh-CN/user/report/spot' },
      { label: 'text290', href: '/bge/hk/zh-CN/user/report/wallet' },
      { label: 'text291', href: '/bge/hk/zh-CN/user/report/otc-orders' },
      { label: 'text292', href: '/bge/hk/zh-CN/user/report/settle' },
    ],
  },
  {
    active: 'assets',
    label: 'text006',
    href: '/bge/hk/zh-CN/user/assets',
    width: 168,
    popper: 'site-header-assets-popper',
    links: [
      { label: 'text333', href: '/bge/hk/zh-CN/user/assets?account=fund' },
      { label: 'text334', href: '/bge/hk/zh-CN/user/assets?account=trade' },
    ],
  },
]
</script>
<template>
  <header class="site-header">
    <a
      class="site-header-brand"
      href="/bge/hk/zh-CN/"
      ><img
        src="/logo-bge-light.svg"
        alt="BGE"
        width="116"
        height="28"
    /></a>
    <nav class="site-header-nav">
      <a
        :class="{ active: active === 'home' }"
        href="/bge/hk/zh-CN/"
        >{{ $t('text000') }}</a
      >
      <a
        :class="{ active: active === 'market' }"
        href="/bge/hk/zh-CN/market"
        >{{ $t('text001') }}</a
      >
      <a
        :class="{ active: active === 'otc' }"
        href="/bge/hk/zh-CN/otc"
        >{{ $t('text002') }}</a
      >
      <a
        :class="{ active: active === 'spot' }"
        href="/bge/hk/zh-CN/spot"
        >{{ $t('text003') }}</a
      >
      <el-popover
        placement="bottom"
        trigger="hover"
        :show-after="0"
        :hide-after="100"
        :offset="1"
        :width="100"
        :show-arrow="false"
        popper-class="site-header-company-popper"
        :teleported="false"
      >
        <template #reference>
          <div class="site-header-company-reference">
            <a
              :class="{ active: active === 'about' }"
              href="/bge/hk/zh-CN/about"
              class="site-header-company-trigger"
            >
              {{ $t('text004') }}<el-icon><CaretBottom /></el-icon>
            </a>
          </div>
        </template>
        <nav
          class="site-header-company-menu"
          aria-label="公司菜单"
        >
          <a
            :class="{ active: active === 'about' }"
            href="/bge/hk/zh-CN/about"
            >{{ $t('text067') }}</a
          >
          <a href="/bge/hk/zh-CN/security">{{ $t('text068') }}</a>
        </nav>
      </el-popover>
    </nav>
    <div class="site-header-right">
      <el-popover
        v-for="menu in menus"
        :key="menu.active"
        placement="bottom"
        trigger="hover"
        :show-after="0"
        :hide-after="100"
        :offset="1"
        :width="menu.width"
        :show-arrow="false"
        :popper-class="'site-header-menu-popper ' + menu.popper"
        :teleported="false"
      >
        <template #reference>
          <div class="site-header-menu-reference">
            <a
              :class="{ active: active === menu.active }"
              :href="menu.href"
              >{{ $t(menu.label) }}</a
            >
          </div>
        </template>
        <nav
          class="site-header-dropdown"
          :aria-label="$t(menu.label)"
        >
          <a
            v-for="link in menu.links"
            :key="link.href"
            :href="link.href"
            >{{ $t(link.label) }}</a
          >
        </nav>
      </el-popover>
      <MessageBell />
      <template v-if="guest"
        ><a href="/bge/hk/zh-CN/user/dashboard">{{ $t('text212') }}</a
        ><button
          type="button"
          class="site-header-register"
        >
          {{ $t('text213') }}</button
        ></template
      >
      <UserMenu v-else />
      <button
        v-if="contact"
        type="button"
        class="site-header-contact"
      >
        {{ $t('text213') }}
      </button>
      <LanguageSwitcher /><span class="site-header-divider"></span><CurrencySwitcher />
    </div>
  </header>
</template>
<style>
.site-header { height:72px; min-width:1100px; padding:0 40px; display:flex; align-items:center; gap:42px; background:#090e13; color:#c8cbd0; font-size:14px; }
.site-header-brand { flex:0 0 auto; display:flex; align-items:center; }
.site-header-brand img { display:block; width:116px; height:28px; }
.site-header-nav, .site-header-right { display:flex; align-items:center; flex-wrap:nowrap; white-space:nowrap; }
.site-header-nav { align-self:stretch; gap:38px; }
.site-header-right { gap:29px; margin-left:auto; align-self:stretch; }
.site-header a { color:inherit; text-decoration:none; }
.site-header-nav a.active, .site-header-right a.active { color:#fff; }
.site-header-company-reference { display:flex; align-items:center; align-self:stretch; }
.site-header-company-trigger { display:flex; align-items:center; gap:4px; }
.site-header-company-trigger .el-icon { font-size:12px; }
.site-header-company-menu { display:flex; flex-direction:column; }
.site-header .site-header-company-menu a { display:flex; align-items:center; height:36px; padding:0 8px; border-radius:6px; color:#fff; font-size:14px; }
.site-header .site-header-company-menu a:hover, .site-header .site-header-company-menu a.active { background:#343b49; color:#fff; }
.site-header .site-header-menu-popper a { display:flex; align-items:center; height:36px; padding:0 8px; border-radius:6px; color:#fff; font-size:14px; }
.site-header .site-header-menu-popper a:hover, .site-header .site-header-menu-popper a.active { background:#343b49; color:#fff; }
.site-header-menu-reference { display:flex; align-items:center; align-self:stretch; }
.site-header-dropdown { display:flex; flex-direction:column; }
.site-header-divider { height:16px; border-left:1px solid #41464d; }
.site-header-register, .site-header-contact { height:36px; padding:0 20px; border:0; border-radius:9px; background:#f5ff18; color:#111; font:inherit; cursor:pointer; }
.site-header-company-popper.el-popover, .site-header-orders-popper.el-popover, .site-header-assets-popper.el-popover { min-width:0; padding:8px; border:0; background:#272c37; border-radius:16px; box-shadow:0 12px 32px rgba(0,0,0,.28); }
</style>
