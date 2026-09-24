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
  <div class="user-page account-security">
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
        ><a href="#">{{ $t('text003') }}</a
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
        ><a href="/bge/hk/zh-CN/user/kyc"
          ><el-icon><User /></el-icon>{{ $t('text009') }}</a
        ><a
          class="sel"
          href="/bge/hk/zh-CN/user/security"
          ><el-icon><Lock /></el-icon>{{ $t('text010') }}</a
        ><a href="/bge/hk/zh-CN/user/payment/fiat"
          ><el-icon><Briefcase /></el-icon>{{ $t('text011') }}</a
        ><a href="/bge/hk/zh-CN/user/parameters"
          ><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a
        ><a href="/bge/hk/zh-CN/user/api"
          ><el-icon><Connection /></el-icon>{{ $t('text013') }}</a
        >
      </aside>
      <main class="security-main">
        <section class="security-setting">
          <div>
            <h3>{{ $t('text014') }}</h3>
            <p>{{ $t('text015') }}</p>
          </div>
          <a>{{ $t('text016') }}</a>
        </section>
        <section class="security-setting">
          <div>
            <h3>{{ $t('text017') }}</h3>
            <p>{{ $t('text018') }}</p>
          </div>
          <a>{{ $t('text019') }}</a>
        </section>
        <section class="security-setting">
          <div>
            <h3>{{ $t('text020') }}</h3>
            <p>{{ $t('text021') }}</p>
          </div>
          <div>
            <a>{{ $t('text022') }}</a
            ><a>{{ $t('text023') }}</a
            ><a>{{ $t('text024') }}</a>
          </div>
        </section>
        <section class="security-setting twofa">
          <h3>{{ $t('text025') }}</h3>
          <p>{{ $t('text026') }}</p>
          <div class="verify-grid">
            <div>
              {{ $t('text027') }}<small>{{ $t('text028') }}</small>
            </div>
            <div>
              {{ $t('text029') }}<small>{{ $t('text030') }}</small>
            </div>
            <div>
              {{ $t('text031') }}<small>{{ $t('text032') }}</small>
            </div>
          </div>
        </section>
        <section class="security-setting">
          <div>
            <h3>{{ $t('text033') }}</h3>
            <p>{{ $t('text034') }}</p>
          </div>
          <a>{{ $t('text035') }}</a>
        </section>
        <section class="security-setting">
          <div>
            <h3>{{ $t('text036') }}</h3>
            <p>{{ $t('text037') }}</p>
          </div>
          <div class="checks">{{ $t('text038') }}</div>
        </section>
        <section class="security-setting">
          <div>
            <h3>{{ $t('text039') }}</h3>
            <p>{{ $t('text040') }}</p>
          </div>
          <div>{{ $t('text041') }}<b>◉ English</b></div>
        </section>
        <section class="security-setting devices">
          <div>
            <h3>{{ $t('text042') }}</h3>
            <p>{{ $t('text043') }}</p>
          </div>
          <a>{{ $t('text044') }}</a>
          <div class="device-row">{{ $t('text045') }}</div>
          <div class="device-row">{{ $t('text046') }}</div>
        </section>
        <section class="security-setting activity">
          <h3>{{ $t('text047') }}</h3>
          <p>{{ $t('text048') }}</p>
          <div class="activity-head">{{ $t('text049') }}</div>
          <div
            v-for="i in 5"
            :key="i"
            class="activity-row"
          >
            {{ $t('text050') }}
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
