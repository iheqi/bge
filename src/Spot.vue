<template>
  <main class="spot-placeholder">
    <div
      class="spot-placeholder-icon"
      aria-hidden="true"
    >
      📈
    </div>
    <h1>{{ $t('text003') }}</h1>
    <p>{{ $t('spotPlaceholder') }}</p>
  </main>
</template>

<style scoped>
.spot-placeholder {
  min-height: 100vh;
  padding: 120px 24px 48px;
  background: #f0f2f5;
  color: #999;
  text-align: center;
}
.spot-placeholder-icon {
  font-size: 44px;
  line-height: 54px;
  opacity: 0.3;
}
.spot-placeholder h1 {
  margin: 22px 0 12px;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}
.spot-placeholder p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
}
</style>
