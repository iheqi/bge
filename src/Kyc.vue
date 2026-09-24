<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
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
</script>
<template>
  <div class="user-page kyc-page">
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
        <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
        ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
        ><MessageBell /><UserMenu /><LanguageSwitcher /><span
          class="account-divider"
          aria-hidden="true"
        ></span>
        <CurrencySwitcher />
      </div>
    </header>
    <div class="user-layout">
      <aside>
        <a href="/bge/hk/zh-CN/user/dashboard"
          ><el-icon><Grid /></el-icon>{{ $t('text008') }}</a
        ><a
          class="sel"
          href="/bge/hk/zh-CN/user/kyc"
          ><el-icon><User /></el-icon>{{ $t('text009') }}</a
        ><a href="/bge/hk/zh-CN/user/security"
          ><el-icon><Lock /></el-icon>{{ $t('text010') }}</a
        ><a href="/bge/hk/zh-CN/user/payment/fiat"
          ><el-icon><Briefcase /></el-icon>{{ $t('text011') }}</a
        ><a href="/bge/hk/zh-CN/user/parameters"
          ><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a
        ><a href="/bge/hk/zh-CN/user/api"
          ><el-icon><Connection /></el-icon>{{ $t('text013') }}</a
        >
      </aside>
      <main class="kyc-main">
        <section class="kyc-box">
          <h2>{{ $t('text009') }}</h2>
          <p class="kyc-desc">{{ $t('text130') }}</p>
          <div class="investor-tab">{{ $t('text131') }}</div>
          <div class="kyc-rule">{{ $t('text132') }}</div>
          <div class="kyc-options">
            <article>
              <div class="kyc-icon">▤</div>
              <p>{{ $t('text133') }}</p>
              <button>{{ $t('text134') }}</button>
            </article>
            <article>
              <div class="kyc-icon">▣</div>
              <p>{{ $t('text135') }}</p>
              <button>{{ $t('text136') }}</button>
            </article>
            <article>
              <div class="kyc-icon">▥</div>
              <p>{{ $t('text137') }}</p>
              <button>{{ $t('text138') }}</button>
            </article>
          </div>
          <div class="notice">
            <b>{{ $t('text139') }}</b>
            <ol>
              <li>{{ $t('text140') }}</li>
              <li>{{ $t('text141') }}</li>
              <li>{{ $t('text142') }}</li>
            </ol>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
