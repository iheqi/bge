<script setup>
import SiteHeader from './SiteHeader.vue'
</script>

<template>
  <div class="spot-page">
    <SiteHeader active="spot" />
    <main class="spot-screenshot"><img src="/images/spot-trading-demo.png" :alt="$t('spotPageAlt')" /></main>
  </div>
</template>

<style scoped>
.spot-screenshot{min-height:calc(100vh - 72px);background:#20252e;overflow:auto}.spot-screenshot img{display:block;width:100%;min-width:1100px;height:auto}
</style>
