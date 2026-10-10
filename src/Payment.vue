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
import { ref } from 'vue'
const crypto = window.location.pathname.includes('/crypto')
const showBankForm = ref(false)
const bankSaved = ref(false)
const bankForm = ref({ account: '', name: '', swift: '', branch: '' })
const openAddBank = () => { showBankForm.value = true }
const saveBank = () => { if (bankForm.value.account && bankForm.value.name && bankForm.value.swift) { bankSaved.value = true; showBankForm.value = false } }
</script>
<template>
  <div class="user-page payment-page">
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
        ><a href="/bge/hk/zh-CN/user/kyc"
          ><el-icon><User /></el-icon>{{ $t('text009') }}</a
        ><a href="/bge/hk/zh-CN/user/security"
          ><el-icon><Lock /></el-icon>{{ $t('text010') }}</a
        ><a
          class="sel"
          href="/bge/hk/zh-CN/user/payment/fiat"
          ><el-icon><Briefcase /></el-icon>{{ $t('text011') }}</a
        ><a href="/bge/hk/zh-CN/user/parameters"
          ><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a
        ><a href="/bge/hk/zh-CN/user/api"
          ><el-icon><Connection /></el-icon>{{ $t('text013') }}</a
        >
      </aside>
      <main class="payment-main">
        <section class="payment-box">
          <div class="payment-tabs">
            <a
              :class="{ active: !crypto }"
              href="/bge/hk/zh-CN/user/payment/fiat"
              >{{ $t('text268') }}</a
            ><a
              :class="{ active: crypto }"
              href="/bge/hk/zh-CN/user/payment/crypto"
              >{{ $t('text269') }}</a
            >
          </div>
          <template v-if="!crypto"
            ><h2>{{ $t('text270') }}</h2>
            <button class="add-btn" type="button" @click="openAddBank">{{ $t('text271') }}</button>
            <form v-if="showBankForm" class="bank-form" @submit.prevent="saveBank">
              <h3>添加新的银行卡</h3>
              <label>银行卡账号/卡号<input v-model="bankForm.account" required placeholder="请输入银行卡账号/卡号" /></label>
              <label>银行名称<input v-model="bankForm.name" required placeholder="请输入银行名称" /></label>
              <label>开户行名称<input v-model="bankForm.branch" placeholder="请输入开户行名称" /></label>
              <label>SWIFT号码<input v-model="bankForm.swift" required placeholder="请输入SWIFT号码" /></label>
              <div class="bank-form-actions"><button type="button" class="cancel" @click="showBankForm = false">取消</button><button type="submit">提交审核</button></div>
            </form>
            <div class="payment-head">
              <span>{{ $t('text272') }}</span
              ><span>{{ $t('text273') }}</span
              ><span>{{ $t('text274') }}</span
              ><span>{{ $t('text275') }}</span
              ><span>{{ $t('text276') }}</span
              ><span>{{ $t('text063') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div v-if="!bankSaved" class="payment-empty">
              ♨<small>{{ $t('text066') }}</small>
            </div>
            <div v-else class="bank-saved-row"><span>{{ bankForm.account }}</span><span>{{ bankForm.name }}</span><span>{{ bankForm.swift }}</span><span>待审核</span><span>—</span><span>—</span><span>—</span></div></template
          ><template v-else
            ><div class="notice-bar">{{ $t('text277') }}</div>
            <h2>{{ $t('text278') }}</h2>
            <button class="add-btn">{{ $t('text279') }}</button>
            <div class="wallet-filters">
              <button>{{ $t('text280') }}</button><button>{{ $t('text281') }}</button
              ><input :placeholder="$t('text282')" /><button class="search-btn">
                {{ $t('text283') }}
              </button>
            </div>
            <div class="payment-head wallet-columns">
              <span>{{ $t('text284') }}</span
              ><span>{{ $t('text285') }}</span
              ><span>{{ $t('text286') }}</span
              ><span>{{ $t('text287') }}</span
              ><span>{{ $t('text063') }}</span
              ><span>{{ $t('text288') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div class="payment-empty">
              ♨<small>{{ $t('text066') }}</small>
            </div></template
          >
        </section>
      </main>
    </div>
  </div>
</template>
