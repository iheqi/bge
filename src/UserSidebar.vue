<script setup>
import { Grid, Wallet, Tickets, User, Lock, Briefcase, Connection } from '@element-plus/icons-vue'
const path = window.location.pathname
const links = [
  ['总览', '/bge/hk/zh-CN/user/dashboard', Grid],
  ['身份认证', '/bge/hk/zh-CN/user/kyc', User],
  ['账户安全', '/bge/hk/zh-CN/user/security', Lock],
  ['收付款管理', '/bge/hk/zh-CN/user/payment/fiat', Briefcase],
  ['费率查询', '/bge/hk/zh-CN/user/fees', Tickets],
  ['参数查询', '/bge/hk/zh-CN/user/parameters', Tickets],
  ['API管理', '/bge/hk/zh-CN/user/api', Connection]
]
const isActive = (href) => {
  if (href.endsWith('/report/spot')) return path.includes('/user/report')
  if (href.endsWith('/payment/fiat')) return path.includes('/user/payment')
  return path === href || path.startsWith(`${href}/`)
}
</script>
<template><aside class="user-sidebar"><a v-for="[label,href,icon] in links" :key="href" :href="href" :class="{ sel: isActive(href) }"><el-icon><component :is="icon" /></el-icon>{{ label }}</a></aside></template>
<style scoped>.user-sidebar{width:200px;flex:0 0 200px;min-height:calc(100vh - 72px);padding-top:25px;background:#fff}.user-sidebar a{display:flex;align-items:center;gap:10px;height:56px;padding:0 28px;color:#303744;text-decoration:none;white-space:nowrap;font-size:14px}.user-sidebar a.sel{background:#f5f5f5;border-right:2px solid #f5ff18}.user-sidebar :deep(.el-icon){font-size:18px}</style>
