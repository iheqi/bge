<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { tr } from './i18n'
import { ArrowDown, InfoFilled } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import WalletAdd from './WalletAdd.vue'
import BankDetail from './BankDetail.vue'
const crypto = window.location.pathname.includes('/crypto')
const addWallet = window.location.pathname.includes('/crypto/add')
const bankDetail = window.location.pathname.includes('/user/payment/fiat/detail')
const walletRecord = ref(JSON.parse(localStorage.getItem('bge-wallet-record') || 'null') || {
  address: '0x9e3729f5a1c237475d9f6a30ff6cf0f7138c7285',
  network: 'eth-', remark: '123', coin: 'ETH', status: '未认证', expires: '-',
})
const walletFilterCoin = ref('all')
const walletFilterStatus = ref('all')
// The bank card added on /user/payment/fiat/detail is stored locally, like the wallet records.
const bankRecord = ref(JSON.parse(localStorage.getItem('bge-bank-record') || 'null'))
const bankCount = computed(() => (bankRecord.value ? 1 : 0))
const usageCodes = (usage) =>
  (bankRecord.value?.cards || [])
    .filter((card) => card.usage === 'both' || card.usage === usage)
    .map((card) => card.code)
    .join(',') || '—'
</script>
<template>
  <div class="user-page payment-page">
    <SiteHeader active="payment" />
    <div class="user-layout">
      <UserSidebar />
      <main class="payment-main">
        <section class="payment-box">
          <div v-if="!addWallet && !bankDetail" class="payment-tabs">
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
          <BankDetail v-if="bankDetail" /><WalletAdd v-else-if="addWallet" /><template v-else-if="!crypto"
            ><div class="payment-title">
              <h2>{{ $t('text268') }} ({{ bankCount }})</h2>
              <a class="add-btn" href="/bge/hk/zh-CN/user/payment/fiat/detail?type=add">{{ $t('text271') }}</a>
            </div>
            <div class="payment-head">
              <span>{{ $t('text272') }}</span
              ><span>{{ $t('text273') }}</span
              ><span>{{ $t('text274') }}</span
              ><span>{{ $t('text275') }}</span
              ><span>{{ $t('text276') }}</span
              ><span>{{ $t('text063') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div v-if="!bankRecord" class="payment-empty">
              ♨<small>{{ $t('text066') }}</small>
            </div>
            <div v-else class="bank-saved-row"><span>{{ bankRecord.account }}</span><span>{{ bankRecord.name }}</span><span>{{ bankRecord.swift || '—' }}</span><span>{{ usageCodes('deposit') }}</span><span>{{ usageCodes('withdraw') }}</span><span class="bank-pending">{{ $t('text396') }}<el-icon><InfoFilled /></el-icon></span><span><a class="bank-edit" href="/bge/hk/zh-CN/user/payment/fiat/detail?type=edit">{{ $t('text397') }}</a></span></div>
            <el-pagination
              class="bank-pagination"
              :page-size="10"
              :total="bankCount"
              layout="prev, pager, next"
              :hide-on-single-page="false"
            /></template
          ><template v-else
            ><div class="notice-bar">{{ $t('text277') }}</div>
            <div class="payment-title">
              <h2>{{ $t('text278') }}</h2>
              <a class="add-btn" href="/bge/hk/zh-CN/user/payment/crypto/add">{{ $t('text279') }}</a>
            </div>
            <div class="wallet-filters">
              <el-select v-model="walletFilterCoin" class="wallet-filter-select" aria-label="币种"><el-option label="全部币种" value="all" /><el-option label="ETH" value="ETH" /><el-option label="BTC" value="BTC" /><el-option label="USDT" value="USDT" /><el-option label="USDC" value="USDC" /></el-select><el-select v-model="walletFilterStatus" class="wallet-filter-select" aria-label="状态"><el-option label="全部状态" value="all" /><el-option :label="$t('statusVerified')" value="verified" /><el-option :label="$t('statusUnverified')" value="unverified" /><el-option :label="$t('statusExpired')" value="expired" /></el-select
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
            <div v-if="!walletRecord" class="payment-empty">
              ♨<small>{{ $t('text066') }}</small>
            </div>
            <div v-else class="wallet-saved-row"><span>{{ walletRecord.address.slice(0, 10) }}...{{ walletRecord.address.slice(-8) }}</span><span>{{ walletRecord.network }}</span><span>{{ walletRecord.remark }} ✎</span><span>{{ walletRecord.coin }}</span><span class="wallet-unverified">{{ tr(walletRecord.status) }}</span><span>{{ walletRecord.expires }}</span><span><button class="wallet-action">{{ $t('walletVerifyBtn') }}</button><button class="wallet-delete">{{ $t('text182') }}</button></span></div></template
          >
        </section>
      </main>
    </div>
  </div>
</template>
