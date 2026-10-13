<script setup>
import { ElMessage } from 'element-plus'
import {
  CircleCheck,
  CopyDocument,
  CreditCard,
  Grid,
  SwitchButton,
} from '@element-plus/icons-vue'
import { tr } from './i18n'
const email = 'heqi**gic@gmail.com'
const uid = '8395618828'
// Element Plus icons are used where the design has an equivalent; the shield, percent and
// API marks are drawn inline so the menu keeps the artwork of the design reference.
const links = [
  { label: '总览', path: 'dashboard', icon: Grid },
  { label: '身份认证', path: 'kyc', icon: CircleCheck },
  { label: '账户安全', path: 'security', custom: 'shield' },
  { label: '收付款管理', path: 'payment/fiat', icon: CreditCard },
  { label: '费率中心', path: 'fees', custom: 'percent' },
  { label: 'API管理', path: 'api', custom: 'api' },
]
async function copyUid() {
  try {
    await navigator.clipboard.writeText(uid)
    ElMessage.success(tr('UID 已复制'))
  } catch {
    /* The browser can block clipboard access; the UID stays readable. */
  }
}
</script>

<template>
  <div class="account-menu">
    <el-popover
      placement="bottom"
      trigger="hover"
      :show-after="0"
      :hide-after="100"
      :offset="1"
      :width="200"
      :show-arrow="false"
      popper-class="account-menu-popper"
      :teleported="false"
    >
      <template #reference>
        <a
          class="avatar"
          href="/bge/hk/zh-CN/user/dashboard"
          :aria-label="$t('text184')"
          aria-haspopup="menu"
        >
          <img
            src="/avatar.png"
            alt=""
            width="30"
            height="30"
            style="height: 30px; width: 30px;"
          />
        </a>
      </template>
      <div class="account-menu-panel">
        <div class="account-menu-profile">
          <img
            class="account-menu-avatar"
            src="/avatar.png"
            alt=""
            width="48"
            height="48"
          />
          <b>{{ email }}</b>
          <small
            >UID: {{ uid
            }}<button
              type="button"
              class="account-menu-copy"
              :aria-label="tr('复制 UID')"
              @click="copyUid"
            >
              <el-icon><CopyDocument /></el-icon>
            </button></small
          >
        </div>
        <nav
          class="account-menu-list"
          role="menu"
        >
          <a
            v-for="item in links"
            :key="item.path"
            role="menuitem"
            :href="'/bge/hk/zh-CN/user/' + item.path"
          >
            <span class="account-menu-icon">
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <svg
                v-else-if="item.custom === 'shield'"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.6 20 5.6v5.7c0 5.2-3.4 8.8-8 10.3-4.6-1.5-8-5.1-8-10.3V5.6Z" />
                <path d="m8.6 11.8 2.5 2.5 4.7-4.9" />
              </svg>
              <svg
                v-else-if="item.custom === 'percent'"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="7"
                  cy="7"
                  r="3.5"
                />
                <circle
                  cx="17"
                  cy="17"
                  r="3.5"
                />
                <path d="M19.5 4.5 4.5 19.5" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <path d="M7.4 12h7.8" />
                <path d="m12.6 8.9 3.1 3.1-3.1 3.1" />
              </svg>
            </span>
            {{ tr(item.label) }}
          </a>
          <a
            role="menuitem"
            href="/bge/hk/zh-CN/"
          >
            <span class="account-menu-icon"><el-icon><SwitchButton /></el-icon></span>
            {{ $t('text349') }}
          </a>
        </nav>
      </div>
    </el-popover>
  </div>
</template>

<style scoped>
.account-menu {
  display: flex;
  align-items: center;
  align-self: stretch;
}
.account-menu .avatar {
  /* The trigger fills the header so the panel opens flush below it. */
  align-self: stretch;
  height: auto;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.account-menu-panel {
  box-sizing: border-box;
  width: 200px;
  padding: 24px 8px 16px;
  background: #272c37;
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
}
.account-menu-profile {
  padding: 0 8px;
  text-align: center;
}
.account-menu-avatar {
  display: block;
  margin: 0 auto;
  border-radius: 50%;
}
.account-menu-profile b {
  display: block;
  margin-top: 18px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}
.account-menu-profile small {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  color: #6c798d;
  font-size: 12px;
  line-height: 1.4;
}
.account-menu-copy {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  height: auto;
  margin-left: 4px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font-size: 13px;
  cursor: pointer;
}
.account-menu-copy:hover,
.account-menu-copy:focus-visible {
  color: #fff;
}
.account-menu-list {
  display: block;
  margin-top: 14px;
}
.account-menu-list a {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 19px;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  text-decoration: none;
}
.account-menu-list a:hover,
.account-menu-list a:focus-visible {
  background: #343b49;
}
.account-menu-icon {
  display: flex;
  flex: 0 0 18px;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 15px;
  font-size: 18px;
}
.account-menu-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>

<!-- ElPopover renders this wrapper outside the component scope. -->
<style>
.account-menu-popper.el-popover {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}
</style>
