<script setup>
// Stands in for the order, asset, payment and API pages when the signed-in demo account has not
// passed verification. Those pages hold no business data for such an account, so the entry sends
// the visitor to 身份认证 instead of showing empty tables.
</script>
<template>
  <section class="kyc-required">
    <h3>{{ $t('text009') }}</h3>
    <p>{{ $t('kycRequiredNotice') }}</p>
    <a href="/bge/hk/zh-CN/user/kyc">{{ $t('withdrawGoVerify') }}</a>
  </section>
</template>
<style scoped>
.kyc-required {
  padding: 56px 32px;
  border: 1px solid #f2d27a;
  border-radius: 6px;
  background: #fffbe9;
  text-align: center;
}
.kyc-required h3 {
  margin: 0 0 12px;
  color: #171d27;
  font-size: 18px;
  font-weight: 600;
}
.kyc-required p {
  margin: 0 0 24px;
  color: #737b87;
  font-size: 14px;
}
.kyc-required a {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 28px;
  border-radius: 6px;
  background: #f5ff18;
  color: #111;
  font-size: 14px;
  text-decoration: none;
}
.kyc-required a:hover {
  background: #e8f000;
}
</style>
