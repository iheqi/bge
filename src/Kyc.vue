<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { tr } from './i18n'
import { ref } from 'vue'
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
const showInvestorInfo = ref(false)
</script>
<template>
  <div class="user-page kyc-page">
    <SiteHeader active="kyc" />
    <div class="user-layout">
      <UserSidebar />
      <main class="kyc-main">
        <section class="kyc-box">
          <h2>{{ $t('text009') }}</h2>
          <p class="kyc-desc">{{ $t('text130') }}</p>
          <div class="investor-tab">{{ $t('text131') }}</div>
          <button class="kyc-rule" type="button" @click="showInvestorInfo = true">{{ $t('text132') }}</button>
          <div class="kyc-options">
            <article>
              <div class="kyc-icon">▤</div>
              <p>{{ $t('text133') }}</p>
              <a
                class="kyc-option-link"
                href="/bge/hk/zh-CN/user/kyc/person/prepare"
                >{{ $t('text134') }}</a
              >
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
    <div v-if="showInvestorInfo" class="investor-modal-mask" @click.self="showInvestorInfo = false">
      <section class="investor-modal" role="dialog" aria-modal="true" aria-labelledby="investor-title">
        <button class="investor-modal-close" type="button" :aria-label="$t('kycClose')" @click="showInvestorInfo = false">×</button>
        <h2 id="investor-title">{{ $t('proInvestorTitle') }}</h2>
        <div class="investor-modal-content">
          <p>{{ $t('proInvestorP1') }}</p>
          <p>{{ $t('proInvestorP2') }}</p>
          <p>{{ $t('proInvestorP3') }}</p>
          <p>{{ $t('proInvestorP4') }}</p>
        </div>
        <button class="investor-modal-confirm" type="button" @click="showInvestorInfo = false">{{ $t('kycGotIt') }}</button>
      </section>
    </div>
  </div>
</template>
