<script setup>
defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue'])
</script>
<template>
  <div
    v-if="modelValue"
    class="kyc-notice-mask"
    @click.self="$emit('update:modelValue', false)"
  >
    <section
      class="kyc-notice"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('walletNoticeTitle')"
    >
      <header>
        <h2>{{ $t('walletNoticeTitle') }}</h2>
        <button
          type="button"
          :aria-label="$t('kycClose')"
          @click="$emit('update:modelValue', false)"
        >
          ✕
        </button>
      </header>
      <p>{{ $t('kycRequiredNotice') }}</p>
      <div class="kyc-notice-actions">
        <button
          class="kyc-notice-cancel"
          type="button"
          @click="$emit('update:modelValue', false)"
        >
          {{ $t('text183') }}
        </button>
        <a
          class="kyc-notice-confirm"
          href="/bge/hk/zh-CN/user/kyc"
          >{{ $t('withdrawGoVerify') }}</a
        >
      </div>
    </section>
  </div>
</template>
<style scoped>
.kyc-notice-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 45%);
}
.kyc-notice {
  width: 396px;
  max-width: 100%;
  padding: 28px 32px 32px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 10px 30px rgb(0 0 0 / 25%);
}
.kyc-notice header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.kyc-notice h2 {
  flex: 1;
  margin: 0;
  color: #171d27;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
}
.kyc-notice header button {
  padding: 0;
  border: 0;
  background: none;
  color: #b0b6c0;
  font-size: 17px;
  line-height: 1.2;
  cursor: pointer;
}
.kyc-notice p {
  margin: 30px 0 0;
  color: #303744;
  text-align: center;
  font-size: 15px;
}
.kyc-notice-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
.kyc-notice-cancel,
.kyc-notice-confirm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 164px;
  height: 44px;
  border: 0;
  border-radius: 4px;
  font-size: 15px;
  text-decoration: none;
  cursor: pointer;
}
.kyc-notice-cancel {
  background: #eef0f5;
  color: #171d27;
}
.kyc-notice-cancel:hover {
  background: #e4e8ee;
}
.kyc-notice-confirm {
  background: #f5ff18;
  color: #111;
  font-weight: 600;
}
.kyc-notice-confirm:hover {
  background: #e8f000;
}
</style>
