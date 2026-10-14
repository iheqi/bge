<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { tr } from './i18n'
import Footer from './Footer.vue'
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
const bindPhone = new URLSearchParams(window.location.search).get('bind') === 'phone'
const resetPage = window.location.pathname.includes('/reset-password')
const bindEmailPage = window.location.pathname.includes('/bind-email')
const phone = ref('')
const code = ref('')
const submitted = ref(false)
const sendCode = () => { if (phone.value) submitted.value = true }
const confirmBind = () => { if (phone.value && code.value) window.location.href = '/bge/hk/zh-CN/user/security' }
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordSubmitted = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const submitPassword = () => { passwordSubmitted.value = true }
const email = ref('')
const emailCode = ref('')
const emailSubmitted = ref(false)
const emailCodeSent = ref(false)
const sendEmailCode = () => { if (email.value) emailCodeSent.value = true }
const submitEmail = () => { emailSubmitted.value = true }
</script>
<template>
  <div class="user-page account-security">
    <SiteHeader active="security" />
    <div v-if="bindPhone" class="user-layout">
      <UserSidebar />
      <main class="phone-binding">
      <div class="binding-breadcrumb"><b>{{ $t('text010') }}</b><span>/</span><span>{{ $t('secBindPhone') }}</span></div>
      <form class="binding-form" @submit.prevent="confirmBind">
        <label>{{ $t('secPhone') }}</label>
        <div class="phone-input" :class="{ invalid: !phone && submitted }"><span>✤</span><b>+852</b><input v-model="phone" type="tel" :placeholder="$t('secPhonePlaceholder')" /></div>
        <small v-if="!phone && submitted">{{ $t('secPhonePlaceholder') }}</small>
        <label><i>*</i>{{ $t('secCode') }}</label>
        <div class="phone-input" :class="{ invalid: !code && submitted }"><input v-model="code" :placeholder="$t('secCodePlaceholder')" /><button type="button" @click="sendCode">{{ $t('secGetCode') }}</button></div>
        <small v-if="!code && submitted">{{ $t('secCodePlaceholder') }}</small>
        <button class="binding-submit" type="submit">{{ $t('apiConfirm') }}</button>
      </form>
      </main>
    </div>
    <div v-else class="user-layout">
      <UserSidebar />
      <main class="security-main">
        <section v-if="resetPage" class="reset-password-page">
          <div class="reset-breadcrumb"><b>账户安全</b><span>/</span><span>{{ $t('secChangePwd') }}</span></div>
          <div class="password-form">
            <div class="password-warning">ⓘ <span>{{ $t('secPwdWarning') }}</span></div>
            <form @submit.prevent="submitPassword">
              <label><i>*</i>{{ $t('secOldPwd') }}<div class="password-input" :class="{ invalid: passwordSubmitted && !oldPassword }"><input v-model="oldPassword" :type="showOldPassword ? 'text' : 'password'" :placeholder="$t('secOldPwdPlaceholder')" /><button type="button" @click="showOldPassword = !showOldPassword">◉</button></div><small v-if="passwordSubmitted && !oldPassword">{{ $t('secOldPwdRequired') }}</small></label>
              <label>{{ $t('secNewPwd') }}<div class="password-input"><input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" :placeholder="$t('secNewPwdPlaceholder')" /><button type="button" @click="showNewPassword = !showNewPassword">◉</button></div></label>
              <label>{{ $t('secConfirmPwd') }}<div class="password-input"><input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" :placeholder="$t('secConfirmPwdPlaceholder')" /><button type="button" @click="showConfirmPassword = !showConfirmPassword">◉</button></div></label>
              <button class="password-submit" type="submit">{{ $t('apiConfirm') }}</button>
            </form>
          </div>
        </section>
        <section v-else-if="bindEmailPage" class="reset-password-page email-page">
          <div class="reset-breadcrumb"><b>账户安全</b><span>/</span><span>{{ $t('text028') }}</span></div>
          <div class="password-form">
            <div class="password-warning">ⓘ <span>{{ $t('secEmailWarning') }}</span></div>
            <form @submit.prevent="submitEmail">
              <label>{{ $t('secEmailAddress') }}<div class="password-input" :class="{ invalid: emailSubmitted && !email }"><input v-model="email" type="email" :placeholder="$t('secEmailAddress')" /></div><small v-if="emailSubmitted && !email">{{ $t('secEmailRequired') }}</small></label>
              <label><i>*</i>验证码<div class="password-input" :class="{ invalid: emailSubmitted && !emailCode }"><input v-model="emailCode" placeholder="请输入验证码" /><button type="button" @click="sendEmailCode">获取验证码</button></div><small v-if="emailSubmitted && !emailCode">{{ $t('secCodePlaceholder') }}</small></label>
              <button class="password-submit" type="submit">{{ $t('apiConfirm') }}</button>
            </form>
          </div>
        </section>
        <template v-else>
        <section class="security-setting">
          <div>
            <h3>{{ $t('text014') }}</h3>
            <p>{{ $t('text015') }}</p>
          </div>
          <a href="/bge/hk/zh-CN/user/security/reset-password">{{ $t('text016') }}</a>
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
            <a href="/bge/hk/zh-CN/user/security/bind-email">
              {{ $t('text027') }}<small>{{ $t('text028') }}</small>
            </a>
            <a href="/bge/hk/zh-CN/user/security?bind=phone">
              {{ $t('text029') }}<small>{{ $t('text030') }}</small>
            </a>
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
        </template>
      </main>
    </div>
    <Footer />
  </div>
</template>
