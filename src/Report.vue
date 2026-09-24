<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { ArrowDown, Tickets, Calendar } from '@element-plus/icons-vue'
const path = window.location.pathname
const type = path.includes('/wallet')
  ? 'wallet'
  : path.includes('/otc-orders')
    ? 'otc'
    : path.includes('/settle')
      ? 'settle'
      : 'spot'
const tabs = [
  ['spot', '现货交易记录', '/bge/hk/zh-CN/user/report/spot'],
  ['wallet', '钱包操作记录', '/bge/hk/zh-CN/user/report/wallet'],
  ['otc', 'OTC 订单', '/bge/hk/zh-CN/user/report/otc-orders'],
  ['settle', '结单记录', '/bge/hk/zh-CN/user/report/settle'],
]
</script>
<style scoped>
.user-layout .order-sidebar {
  flex: 0 0 220px;
  width: 220px;
}
.user-layout .order-sidebar a {
  padding: 0 24px;
  white-space: nowrap;
}
.report-main {
  min-width: 0;
}
.order-title {
  margin: 0;
  padding: 0 0 22px;
  border-bottom: 1px solid #dce2eb;
  font-size: 22px;
  font-weight: 500;
}
</style>
<template>
  <div class="user-page report-page">
    <header class="user-nav">
      <a
        class="brand"
        href="/bge/hk/zh-CN/"
        ><img
          class="brand-logo brand-logo-full"
          src="/logo-bge-light.svg"
          alt="BGE"
          width="116"
          height="28"
      /></a>
      <nav>
        <a href="/bge/hk/zh-CN/">{{ $t('text000') }}</a
        ><a href="/bge/hk/zh-CN/market">{{ $t('text001') }}</a
        ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a
        ><a href="/bge/hk/zh-CN/spot">{{ $t('text003') }}</a
        ><a href="/bge/hk/zh-CN/about"
          >{{ $t('text004') }}<el-icon><ArrowDown /></el-icon
        ></a>
      </nav>
      <div class="user-right">
        <a
          class="active"
          href="/bge/hk/zh-CN/user/report/spot"
          >{{ $t('text005') }}</a
        ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
        ><MessageBell /><UserMenu /><LanguageSwitcher /><span
          class="account-divider"
          aria-hidden="true"
        ></span>
        <CurrencySwitcher />
      </div>
    </header>
    <div class="user-layout">
      <aside
        class="order-sidebar"
        :aria-label="$t('text293')"
      >
        <a
          v-for="tab in tabs"
          :key="tab[0]"
          :href="tab[2]"
          :class="{ sel: type === tab[0] }"
          :aria-current="type === tab[0] ? 'page' : undefined"
          ><el-icon><Tickets /></el-icon>{{ tr(tab[1]) }}</a
        >
      </aside>
      <main class="report-main">
        <section class="report-box">
          <h1 class="order-title">{{ tr(tabs.find((tab) => tab[0] === type)[1]) }}</h1>
          <template v-if="type === 'spot'"
            ><div class="sub-tabs">
              <b>{{ $t('text294') }}</b
              ><span>{{ $t('text295') }}</span
              ><span>{{ $t('text296') }}</span>
            </div>
            <div class="filters">
              <button>{{ $t('text297') }}</button><button>{{ $t('text298') }}</button
              ><button class="yellow">{{ $t('text283') }}</button
              ><button>{{ $t('text299') }}</button>
            </div>
            <div class="table-head spot-head">
              <span>{{ $t('text300') }}</span
              ><span>{{ $t('text247') }}</span
              ><span>{{ $t('text301') }}</span
              ><span>{{ $t('text302') }}</span
              ><span>{{ $t('text303') }}</span
              ><span>{{ $t('text304') }}</span
              ><span>{{ $t('text305') }}</span
              ><span>{{ $t('text306') }}</span
              ><span>{{ $t('text065') }}</span>
            </div></template
          ><template v-else-if="type === 'wallet'"
            ><div class="sub-tabs">
              <b>{{ $t('text307') }}</b
              ><span>{{ $t('text308') }}</span
              ><span>{{ $t('text309') }}</span
              ><span>{{ $t('text310') }}</span>
            </div>
            <div class="filters">
              <button>{{ $t('text311') }}</button><button>{{ $t('text280') }}</button
              ><button>{{ $t('text281') }}</button
              ><button class="date">
                <el-icon><Calendar /></el-icon>{{ $t('text312') }}</button
              ><button class="yellow">{{ $t('text283') }}</button
              ><button>{{ $t('text299') }}</button>
            </div>
            <div class="table-head wallet-head">
              <span>{{ $t('text313') }}</span
              ><span>{{ $t('text314') }}</span
              ><span>{{ $t('text285') }}</span
              ><span>{{ $t('text315') }}</span
              ><span>{{ $t('text063') }}</span
              ><span>{{ $t('text316') }}</span
              ><span>{{ $t('text286') }}</span>
            </div></template
          ><template v-else-if="type === 'otc'"
            ><div class="sub-tabs">
              <b>{{ $t('text317') }}</b
              ><span>{{ $t('text318') }}</span>
            </div>
            <div class="filters">
              <button>{{ $t('text297') }}</button><button>{{ $t('text319') }}</button
              ><button class="date">{{ $t('text320') }}</button
              ><button class="yellow">{{ $t('text283') }}</button
              ><button>{{ $t('text299') }}</button>
            </div>
            <div class="table-head otc-head">
              <span>{{ $t('text313') }}</span
              ><span>{{ $t('text302') }}</span
              ><span>{{ $t('text321') }}</span
              ><span>{{ $t('text322') }}</span
              ><span>{{ $t('text323') }}</span
              ><span>{{ $t('text063') }}</span>
            </div></template
          ><template v-else
            ><div class="sub-tabs">
              <b>{{ $t('text165') }}</b
              ><span>{{ $t('text324') }}</span
              ><span>{{ $t('text325') }}</span
              ><em>{{ $t('text326') }}</em
              ><button>{{ $t('text020') }}</button>
            </div>
            <div class="table-head settle-head">
              <span>{{ $t('text327') }}</span
              ><span>{{ $t('text065') }}</span>
            </div></template
          >
          <div class="no-data">{{ $t('text066') }}</div>
          <div class="pager">‹　›</div>
        </section>
      </main>
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
          <a>{{ $t('text071') }}</a
          ><a>{{ $t('text110') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a>{{ $t('text072') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
