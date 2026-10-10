<script setup>
import UserSidebar from './UserSidebar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
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
