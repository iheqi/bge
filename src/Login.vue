<script setup>
import SiteHeader from './SiteHeader.vue'
import Footer from './Footer.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { i18n, tr } from './i18n'
import { signIn } from './session'
import { demoAccounts } from './demoAccounts'

const account = ref('')
const picked = ref('')
const password = ref('')
const captchaOpen = ref(false)
const captchaState = ref('idle')
const securityOpen = ref(false)
const smsCode = ref('')
const gaCode = ref('')
const t = (key) => i18n.global.t(key)

function submit() {
  if (!account.value.trim()) return ElMessage.warning(t('loginAccountPlaceholder'))
  if (!password.value) return ElMessage.warning(t('loginPasswordPlaceholder'))
  captchaState.value = 'idle'
  captchaOpen.value = true
}
function checkCaptcha() {
  if (captchaState.value !== 'idle') return
  captchaState.value = 'checking'
  setTimeout(() => {
    captchaState.value = 'done'
    setTimeout(() => {
      captchaOpen.value = false
      securityOpen.value = true
    }, 420)
  }, 700)
}
// Fills the form with one of the built-in demo accounts. The captcha and SMS steps still run, so
// the walkthrough keeps showing the real sign-in flow.
function pick(item) {
  picked.value = item.id
  account.value = item.id
  password.value = 'bge-demo'
}
function sendSms() {
  ElMessage.success(t('apiCodeSent', { channel: t('apiSmsChannel') }))
}
function confirmSecurity() {
  if (smsCode.value !== '111111') return ElMessage.warning(t('loginDemoHint'))
  signIn(account.value.trim())
  window.location.href = '/bge/hk/zh-CN/user/dashboard'
}
</script>

<template>
  <div class="user-page login-page">
    <SiteHeader
      active=""
      guest
    />
    <main class="login-main">
      <section class="login-card">
        <h1>{{ $t('text212') }}</h1>
        <el-input
          v-model="account"
          class="login-input"
          :placeholder="$t('loginAccountPlaceholder')"
        />
        <el-input
          v-model="password"
          class="login-input"
          type="password"
          show-password
          :placeholder="$t('loginPasswordPlaceholder')"
          @keydown.enter="submit"
        />
        <button
          class="login-submit"
          :class="{ loading: captchaOpen && captchaState !== 'done' }"
          type="button"
          @click="submit"
        >
          {{ $t('text212') }}
        </button>
        <div class="login-links">
          <a class="login-forgot">{{ $t('loginForgot') }}</a>
          <a
            class="login-register"
            href="/bge/hk/zh-CN/register"
            >{{ $t('loginRegister') }}</a
          >
        </div>
        <section class="demo-accounts">
          <p>{{ $t('demoLoginPick') }}</p>
          <div class="demo-account-row">
            <button
              v-for="item in demoAccounts"
              :key="item.id"
              type="button"
              :class="{ picked: picked === item.id }"
              @click="pick(item)"
            >
              <b>{{ tr(item.label) }}</b
              ><small>{{ item.uid }}</small>
            </button>
          </div>
          <em>{{ $t('demoLoginHint') }}</em>
        </section>
      </section>
    </main>
    <Footer />

    <div
      v-if="captchaOpen"
      class="login-mask"
      @click.self="captchaOpen = false"
    >
      <section
        class="captcha-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('loginCaptchaTitle')"
      >
        <header>
          <h2>{{ $t('loginCaptchaTitle') }}</h2>
          <button
            type="button"
            :aria-label="$t('kycClose')"
            @click="captchaOpen = false"
          >
            ✕
          </button>
        </header>
        <div
          class="captcha-box"
          role="checkbox"
          :aria-checked="captchaState === 'done'"
          tabindex="0"
          @click="checkCaptcha"
          @keydown.enter="checkCaptcha"
        >
          <span
            class="captcha-check"
            :class="captchaState"
          >
            <svg
              v-if="captchaState === 'done'"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                fill="none"
                stroke="#fff"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="captcha-label">{{ $t('loginCaptchaLabel') }}</span>
          <span class="captcha-brand">
            <svg
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path
                d="M16 4a12 12 0 0 1 10.4 6H22v3h8V5h-3v3.6A15 15 0 0 0 16 1v3Z"
                fill="#1c62d6"
              />
              <path
                d="M16 28A12 12 0 0 1 5.6 22H10v-3H2v8h3v-3.6A15 15 0 0 0 16 31v-3Z"
                fill="#6b7280"
              />
              <path
                d="M14 12.4v7.2l6-3.6-6-3.6Z"
                fill="#1c62d6"
              />
            </svg>
            reCAPTCHA
          </span>
        </div>
      </section>
    </div>

    <div
      v-if="securityOpen"
      class="login-mask"
      @click.self="securityOpen = false"
    >
      <section
        class="security-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('apiVerifyTitle')"
      >
        <header>
          <h2>{{ $t('apiVerifyTitle') }}</h2>
          <button
            type="button"
            :aria-label="$t('kycClose')"
            @click="securityOpen = false"
          >
            ✕
          </button>
        </header>
        <div class="security-field">
          <p class="security-label">{{ $t('loginSmsLabel') }}</p>
          <p class="security-hint">{{ $t('loginSmsHint') }}</p>
          <label class="security-line">
            <input
              v-model="smsCode"
              maxlength="6"
              :placeholder="$t('apiSmsPlaceholder')"
            /><button
              type="button"
              @click="sendSms"
            >
              {{ $t('apiSend') }}
            </button>
          </label>
        </div>
        <div class="security-field">
          <p class="security-label">{{ $t('loginGaLabel') }}</p>
          <p class="security-hint">{{ $t('apiGaLabel') }}</p>
          <label class="security-line">
            <input
              v-model="gaCode"
              maxlength="6"
              :placeholder="$t('apiGaLabel')"
            />
          </label>
        </div>
        <div class="security-actions">
          <button
            class="security-cancel"
            type="button"
            @click="securityOpen = false"
          >
            {{ $t('text183') }}
          </button>
          <button
            class="security-confirm"
            type="button"
            @click="confirmSecurity"
          >
            {{ $t('transferConfirm') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background: #f5f5f5;
}
.login-main {
  display: flex;
  justify-content: center;
  padding: 98px 24px 120px;
  min-height: calc(100vh - 72px - 420px);
}
.login-card {
  width: 478px;
  max-width: 100%;
  padding: 52px 48px 44px;
  background: #fff;
  box-shadow: 0 1px 4px rgb(35 45 60 / 6%);
}
.login-card h1 {
  margin: 0 0 52px;
  color: #171d27;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
}
.login-input {
  margin-bottom: 22px;
}
.login-input :deep(.el-input__wrapper) {
  height: 48px;
  border-radius: 4px;
  background: #eef3fb;
  box-shadow: none;
}
.login-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #f0d000 inset;
}
.login-input :deep(.el-input__inner) {
  color: #171d27;
  font-size: 15px;
}
.login-submit {
  position: relative;
  width: 100%;
  height: 48px;
  margin-top: 24px;
  border: 0;
  border-radius: 4px;
  background: #f5ff18;
  color: #111;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.login-submit:hover {
  background: #e8f000;
}
/* The button keeps its spinner while the captcha is being checked. */
.login-submit.loading {
  background: #e6ea9b;
  color: #6f7783;
  cursor: default;
}
.login-submit.loading::before {
  content: '';
  display: inline-block;
  width: 13px;
  height: 13px;
  margin-right: 8px;
  border: 2px solid #6f7783;
  border-top-color: transparent;
  border-radius: 50%;
  vertical-align: -2px;
  animation: login-spin 0.8s linear infinite;
}
@keyframes login-spin {
  to {
    transform: rotate(360deg);
  }
}
.login-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
  font-size: 14px;
}
.login-forgot {
  color: #303744;
  cursor: pointer;
}
.login-register {
  color: #d9a600;
  text-decoration: none;
}
.login-register:hover {
  color: #b98c00;
}
.demo-accounts {
  margin-top: 34px;
  padding-top: 24px;
  border-top: 1px solid #edf0f4;
}
.demo-accounts > p {
  margin: 0 0 12px;
  color: #171d27;
  font-size: 14px;
  font-weight: 500;
}
.demo-account-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.demo-account-row button {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border: 1px solid #dfe4ec;
  border-radius: 6px;
  background: #fff;
  color: #303744;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.demo-account-row button b {
  font-size: 14px;
  font-weight: 500;
}
.demo-account-row button small {
  color: #9aa2ad;
  font-size: 12px;
}
.demo-account-row button:hover {
  border-color: #f0d000;
}
.demo-account-row button.picked {
  border-color: #f0d000;
  background: #fffbe0;
}
.demo-accounts > em {
  display: block;
  margin-top: 12px;
  color: #9aa2ad;
  font-size: 12px;
  font-style: normal;
  line-height: 1.6;
}
.login-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 45%);
}
.captcha-modal {
  width: 340px;
  max-width: 100%;
  padding: 26px 28px 30px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 10px 30px rgb(0 0 0 / 25%);
}
.captcha-modal header,
.security-modal header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.captcha-modal h2 {
  margin: 0;
  color: #171d27;
  font-size: 17px;
  font-weight: 500;
}
.captcha-modal header button,
.security-modal header button {
  padding: 0;
  border: 0;
  background: none;
  color: #b0b6c0;
  font-size: 17px;
  line-height: 1.2;
  cursor: pointer;
}
.captcha-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
  padding: 20px 18px;
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  background: #fafafa;
  cursor: pointer;
}
.captcha-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex: 0 0 22px;
  border: 2px solid #c1c1c1;
  border-radius: 2px;
  background: #fff;
}
.captcha-check.checking {
  border-color: transparent;
  background: none;
}
.captcha-check.checking::after {
  content: '';
  width: 18px;
  height: 18px;
  border: 3px solid #1c62d6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: login-spin 0.8s linear infinite;
}
.captcha-check.done {
  border-color: #1c62d6;
  background: #1c62d6;
}
.captcha-label {
  color: #171d27;
  font-size: 14px;
}
.captcha-brand {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  color: #6b7280;
  font-size: 9px;
}
.captcha-brand svg {
  width: 26px;
  height: 26px;
}
.security-modal {
  width: 400px;
  max-width: 100%;
  padding: 30px 32px 34px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 10px 30px rgb(0 0 0 / 25%);
}
.security-modal h2 {
  flex: 1;
  margin: 0;
  color: #171d27;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.security-field {
  margin-top: 26px;
}
.security-label {
  margin: 0 0 10px;
  color: #171d27;
  font-size: 15px;
}
.security-hint {
  margin: 0 0 10px;
  color: #8a94a6;
  font-size: 13px;
}
.security-line {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dfe4ec;
}
.security-line input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #303744;
  font-size: 14px;
}
.security-line input::placeholder {
  color: #b6bcc6;
}
.security-line button {
  padding: 0;
  border: 0;
  background: none;
  color: #d9a600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.security-actions {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 34px;
}
.security-cancel,
.security-confirm {
  width: 120px;
  height: 40px;
  border: 0;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}
.security-cancel {
  background: #eef0f5;
  color: #171d27;
}
.security-cancel:hover {
  background: #e4e8ee;
}
.security-confirm {
  background: #f5ff18;
  color: #111;
  font-weight: 600;
}
.security-confirm:hover {
  background: #e8f000;
}
</style>
