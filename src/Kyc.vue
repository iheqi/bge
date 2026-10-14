<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { tr } from './i18n'
import { computed, ref } from 'vue'
import { kycType, kycVerified } from './session'
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
const doneTitle = computed(() =>
  kycType.value === 'corporation' ? 'kycCorpTitle' : kycType.value === 'institution' ? 'kycInstTitle' : 'personTitle',
)
const doneMessage = computed(() =>
  kycType.value === 'corporation' ? 'kycCorpDone' : kycType.value === 'institution' ? 'kycInstDone' : 'kycPersonDone',
)
</script>
<template>
  <div class="user-page kyc-page">
    <SiteHeader active="kyc" />
    <div class="user-layout">
      <UserSidebar />
      <main class="kyc-main">
        <section class="kyc-box">
          <template v-if="kycVerified">
            <h2>{{ $t(doneTitle) }}</h2>
            <div class="kyc-done">
              <svg
                viewBox="0 0 220 130"
                aria-hidden="true"
              >
                <ellipse
                  cx="112"
                  cy="124"
                  rx="70"
                  ry="6"
                  fill="#eef2f7"
                />
                <rect
                  x="82"
                  y="12"
                  width="96"
                  height="96"
                  rx="6"
                  fill="#fbfcfe"
                  stroke="#dde4ec"
                  stroke-width="2"
                />
                <path
                  d="M98 38h64M98 52h64M98 66h44"
                  stroke="#e6ebf2"
                  stroke-width="4"
                  stroke-linecap="round"
                />
                <circle
                  cx="170"
                  cy="94"
                  r="16"
                  fill="#2fac6a"
                />
                <path
                  d="m163 94 5 5.5 10-11"
                  fill="none"
                  stroke="#fff"
                  stroke-width="3.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="50"
                  cy="54"
                  r="13"
                  fill="#f0a02a"
                />
                <path
                  d="M28 124c0-26 10-40 22-40s22 14 22 40z"
                  fill="#f0a02a"
                />
                <path
                  d="M70 88l26-16"
                  stroke="#f0a02a"
                  stroke-width="10"
                  stroke-linecap="round"
                />
                <rect
                  x="88"
                  y="60"
                  width="18"
                  height="12"
                  rx="2"
                  transform="rotate(-32 88 60)"
                  fill="#2fac6a"
                />
              </svg>
              <p>{{ $t(doneMessage) }}</p>
            </div>
          </template>
          <template v-else>
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
          </template>
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
