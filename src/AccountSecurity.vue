<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
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
    <div v-if="bindPhone" class="user-layout">
      <aside>
        <a href="/bge/hk/zh-CN/user/dashboard"><el-icon><Grid /></el-icon>{{ $t('text008') }}</a>
        <a href="/bge/hk/zh-CN/user/kyc"><el-icon><User /></el-icon>{{ $t('text009') }}</a>
        <a class="sel" href="/bge/hk/zh-CN/user/security"><el-icon><Lock /></el-icon>{{ $t('text010') }}</a>
        <a href="/bge/hk/zh-CN/user/payment/fiat"><el-icon><Briefcase /></el-icon>{{ $t('text011') }}</a>
        <a href="/bge/hk/zh-CN/user/parameters"><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a>
        <a href="/bge/hk/zh-CN/user/api"><el-icon><Connection /></el-icon>{{ $t('text013') }}</a>
      </aside>
      <main class="phone-binding">
      <div class="binding-breadcrumb"><b>账户安全</b><span>/</span><span>绑定手机</span></div>
      <form class="binding-form" @submit.prevent="confirmBind">
        <label>手机</label>
        <div class="phone-input" :class="{ invalid: !phone && submitted }"><span>✤</span><b>+852</b><input v-model="phone" type="tel" placeholder="请输入手机号" /></div>
        <small v-if="!phone && submitted">请输入手机号</small>
        <label><i>*</i>验证码</label>
        <div class="phone-input" :class="{ invalid: !code && submitted }"><input v-model="code" placeholder="请输入验证码" /><button type="button" @click="sendCode">获取验证码</button></div>
        <small v-if="!code && submitted">请输入验证码</small>
        <button class="binding-submit" type="submit">确认</button>
      </form>
      </main>
    </div>
    <div v-else class="user-layout">
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
        ><a href="/bge/hk/zh-CN/user/fees">费率查询</a
        ><a href="/bge/hk/zh-CN/user/parameters"
          ><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a
        ><a href="/bge/hk/zh-CN/user/api"
          ><el-icon><Connection /></el-icon>{{ $t('text013') }}</a
        >
      </aside>
      <main class="security-main">
        <section v-if="resetPage" class="reset-password-page">
          <div class="reset-breadcrumb"><b>账户安全</b><span>/</span><span>更改登录密码</span></div>
          <div class="password-form">
            <div class="password-warning">ⓘ <span>为保障您的账户安全，更改密码后24小时内禁止出金或提币</span></div>
            <form @submit.prevent="submitPassword">
              <label><i>*</i>旧登录密码<div class="password-input" :class="{ invalid: passwordSubmitted && !oldPassword }"><input v-model="oldPassword" :type="showOldPassword ? 'text' : 'password'" placeholder="请输入旧登录密码" /><button type="button" @click="showOldPassword = !showOldPassword">◉</button></div><small v-if="passwordSubmitted && !oldPassword">请输入旧密码</small></label>
              <label>新登录密码<div class="password-input"><input v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" placeholder="请输入新登录密码" /><button type="button" @click="showNewPassword = !showNewPassword">◉</button></div></label>
              <label>确认新登录密码<div class="password-input"><input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="请确认新登录密码" /><button type="button" @click="showConfirmPassword = !showConfirmPassword">◉</button></div></label>
              <button class="password-submit" type="submit">确认</button>
            </form>
          </div>
        </section>
        <section v-else-if="bindEmailPage" class="reset-password-page email-page">
          <div class="reset-breadcrumb"><b>账户安全</b><span>/</span><span>更改邮箱</span></div>
          <div class="password-form">
            <div class="password-warning">ⓘ <span>为保障您的账户安全，更改邮箱后24小时内禁止出金或提币</span></div>
            <form @submit.prevent="submitEmail">
              <label>邮箱地址<div class="password-input" :class="{ invalid: emailSubmitted && !email }"><input v-model="email" type="email" placeholder="邮箱地址" /></div><small v-if="emailSubmitted && !email">请输入邮箱地址</small></label>
              <label><i>*</i>验证码<div class="password-input" :class="{ invalid: emailSubmitted && !emailCode }"><input v-model="emailCode" placeholder="请输入验证码" /><button type="button" @click="sendEmailCode">获取验证码</button></div><small v-if="emailSubmitted && !emailCode">请输入验证码</small></label>
              <button class="password-submit" type="submit">确认</button>
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
