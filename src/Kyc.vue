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
        <button class="investor-modal-close" type="button" aria-label="关闭" @click="showInvestorInfo = false">×</button>
        <h2 id="investor-title">专业投资者</h2>
        <div class="investor-modal-content">
          <p>根据香港《证券及期货条例》的规定，专业投资者包括机构专业投资者、法团专业投资者和个人专业投资者。</p>
          <p>机构专业投资者是指《证券及期货条例》附表1第1部第1条“专业投资者”定义中的人士，例如认可交易所、认可结算所、中介人、认可财务机构、获授权的保险人、认可的集体投资计划、注册的强积金计划、职业退休计划、政府等。</p>
          <p>法团专业投资者是指《证券及期货（专业投资者）规则》第4、6及7条所指的信托法团、法团或合伙。根据规则，信托法团需要持有港币4000万（或等值外币）以上的总资产；法团或合伙需要持有港币800万（或等值外币）以上的投资组合，或港币4000万（或等值外币）以上的总资产。</p>
          <p>个人专业投资者是指《证券及期货（专业投资者）规则》第5条所指的个人，并持有港币800万（或等值外币）以上的投资组合，如现金、存款及《证券及期货条例》所定义的证券。</p>
        </div>
        <button class="investor-modal-confirm" type="button" @click="showInvestorInfo = false">我知道了</button>
      </section>
    </div>
  </div>
</template>
