<script setup>
import SiteHeader from './SiteHeader.vue'
import FeeContent from './FeeContent.vue'
</script>
<template>
  <div class="user-page parameter-page">
    <SiteHeader active="parameters" />
    <div class="user-layout">
      <FeeContent />
    </div>
    <footer>
      <div class="footer-inner">
        <a
          class="brand footer-brand"
          href="/bge/hk/zh-CN/"
          ><img
            class="brand-logo brand-logo-full"
            src="/logo-bge.svg"
            alt="BGE"
            width="116"
            height="28"
        /></a>
        <div>
          <h4>{{ $t('text004') }}</h4>
          <a href="/bge/hk/zh-CN/about">{{ $t('text067') }}</a
          ><a href="/bge/hk/zh-CN/security">{{ $t('text068') }}</a>
        </div>
        <div>
          <h4>{{ $t('text069') }}</h4>
          <a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a>{{ $t('text071') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a>{{ $t('text072') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
