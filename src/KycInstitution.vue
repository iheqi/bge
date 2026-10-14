<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { Message } from '@element-plus/icons-vue'
</script>

<template>
  <div class="user-page">
    <SiteHeader active="kyc" />
    <div class="user-layout">
      <UserSidebar />
      <main class="person-main">
        <section class="person-box">
          <h1 class="person-title">{{ $t('kycInstTitle') }}</h1>
          <div class="inst-body">
            <svg
              class="inst-art"
              viewBox="0 0 260 200"
              aria-hidden="true"
            >
              <path
                d="M158 12c0-8 6-14 14-14v10l10-8 10 8V-2c8 0 14 6 14 14 0 4-2 7-5 9h-38c-3-2-5-5-5-9z"
                transform="translate(-24 6)"
                fill="#e8b93f"
              />
              <rect
                x="46"
                y="44"
                width="168"
                height="110"
                rx="10"
                fill="#fff"
                stroke="#dfe4ec"
                stroke-width="3"
              />
              <rect
                x="34"
                y="60"
                width="192"
                height="8"
                rx="4"
                fill="#eef1f6"
              />
              <path
                d="M66 132l30-34 22 18 28-40 30 22 18-26"
                fill="none"
                stroke="#e8a33f"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <rect
                x="70"
                y="112"
                width="14"
                height="24"
                rx="3"
                fill="#f0c518"
              />
              <rect
                x="96"
                y="122"
                width="14"
                height="14"
                rx="3"
                fill="#f0c518"
              />
              <rect
                x="122"
                y="104"
                width="14"
                height="32"
                rx="3"
                fill="#f0c518"
              />
              <circle
                cx="52"
                cy="150"
                r="18"
                fill="#fff3d6"
                stroke="#f0d79a"
                stroke-width="2"
              />
              <path
                d="M44 150h16M46 143h12M46 157h12"
                stroke="#d9a600"
                stroke-width="2.4"
                stroke-linecap="round"
              />
              <circle
                cx="208"
                cy="150"
                r="18"
                fill="#fff3d6"
                stroke="#f0d79a"
                stroke-width="2"
              />
              <path
                d="M200 142h16v16h-16zM204 142v-6h8v6"
                fill="none"
                stroke="#d9a600"
                stroke-width="2.4"
                stroke-linejoin="round"
              />
            </svg>
            <p class="inst-text">{{ $t('instContact') }}</p>
            <div class="inst-mail">
              <el-icon><Message /></el-icon><span>Email</span><b>cs@bg.exchange</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.inst-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 96px 0 168px;
  text-align: center;
}
.inst-art {
  width: 260px;
  height: 200px;
}
.inst-text {
  margin: 44px 0 0;
  color: #303744;
  font-size: 16px;
}
.inst-mail {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  padding: 16px 44px;
  background: #f4f6f9;
  font-size: 15px;
}
.inst-mail .el-icon {
  color: #9aa2ad;
  font-size: 17px;
}
.inst-mail span {
  color: #9aa2ad;
}
.inst-mail b {
  color: #171d27;
  font-weight: 600;
}
</style>
