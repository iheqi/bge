<script setup>
import { computed, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import Footer from './Footer.vue'

const base = '/bge/hk/zh-CN/support/announcement'
const articles = [
  { id: 23, title: '系统维护完成：HKBGE 服务已全面恢复', date: '2026-07-14 18:10:16' },
  { id: 22, title: '关于2026年7月11日至7月15日进行系统临时维护及全站暂停服务的通知', date: '2026-07-08 16:33:09' },
  { id: 21, title: '谨防欺诈网站和诈骗', date: '2026-01-21 14:19:47' },
  { id: 20, title: '保护您的账户与资产安全', date: '2026-09-21 16:58:45' },
  { id: 19, title: '系统维护通知（3月5日）', date: '2026-03-05 17:32:51' },
  { id: 18, title: '系统维护通知（2月27日）', date: '2026-02-27 15:04:21' },
]
const hot = [articles[3], articles[0], articles[1], articles[2]]
const query = ref('')
const filtered = computed(() => {
  const value = query.value.trim().toLowerCase()
  return value ? articles.filter(item => item.title.toLowerCase().includes(value)) : articles
})
const detail = window.location.pathname.includes('/article/')
const detailArticle = computed(() => {
  const id = Number(window.location.pathname.split('/article/')[1])
  return articles.find(item => item.id === id) || articles[0]
})
</script>

<template>
  <div class="announcement-page">
    <header class="nav announcement-nav">
      <a class="brand" href="/bge/hk/zh-CN/"><img class="brand-logo brand-logo-full" src="/logo-bge-light.svg" alt="BGE" width="116" height="28" /></a>
      <nav class="main-links"><a href="/bge/hk/zh-CN/">首页</a><a href="/bge/hk/zh-CN/otc">场外</a><a href="/bge/hk/zh-CN/spot">现货交易</a><a class="company" href="/bge/hk/zh-CN/about">公司<el-icon><ArrowDown /></el-icon></a></nav>
      <div class="right-links"><a href="/bge/hk/zh-CN/user/report/spot">账户记录</a><a href="/bge/hk/zh-CN/user/assets">资产管理</a><MessageBell /><UserMenu /><LanguageSwitcher /><span class="account-divider"></span><CurrencySwitcher /></div>
    </header>

    <section v-if="!detail" class="announcement-hero">
      <h1>公告中心</h1>
      <form class="announcement-search" @submit.prevent><input v-model="query" placeholder="请输入您的问题" /><button>搜索</button></form>
    </section>

    <main class="announcement-main" :class="{ 'is-detail': detail }">
      <section class="announcement-content">
        <template v-if="detail">
          <a class="back-link" :href="base">← 返回公告列表</a>
          <h1>{{ detailArticle.title }}</h1><time>{{ detailArticle.date }}</time>
          <div class="article-body"><p>亲爱的用户：</p><p>我们高兴地通知您，我们的全站系统维护工作已顺利完成，目前所有服务已全面恢复正常运作。</p><p>再次衷心感谢您在维护期间的耐心配合、理解与支持。</p><p>HKBGE 团队<br />2026 年 7 月 14 日</p></div>
        </template>
        <template v-else>
          <a v-for="item in filtered" :key="item.id" class="announcement-item" :href="`${base}/article/${item.id}`"><strong>{{ item.title }}</strong><time>{{ item.date }}</time></a>
          <p v-if="!filtered.length" class="empty">暂无相关公告</p>
        </template>
      </section>
      <aside class="hot-announcements"><h2>热门公告</h2><a v-for="item in hot" :key="item.id" :href="`${base}/article/${item.id}`"><span>★</span>{{ item.title }}</a></aside>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.announcement-page { min-width: 1100px; background: #fff; color: #303238; }
.announcement-nav { height: 64px; padding: 0 30px; background: #20242a; }
.announcement-nav .main-links, .announcement-nav .right-links { gap: 34px; }
.announcement-nav .main-links a, .announcement-nav .right-links a { color: #d7d9dd; font-size: 14px; }
.announcement-hero { height: 280px; background: #ebbd00; padding-top: 49px; text-align: center; color: #fff; }
.announcement-hero h1 { margin: 0 0 28px; font-size: 42px; font-weight: 600; }
.announcement-search { width: 700px; height: 56px; margin: auto; display: flex; align-items: center; padding: 0 16px 0 25px; border-radius: 15px; background: #fff; }
.announcement-search input { flex: 1; border: 0; outline: 0; font-size: 16px; color: #555; }
.announcement-search button { width: 80px; height: 40px; border: 0; border-radius: 10px; background: #f6ff16; font-weight: 600; cursor: pointer; }
.announcement-main { max-width: 1200px; min-height: 580px; margin: 20px auto 0; display: grid; grid-template-columns: 700px 330px; gap: 170px; }
.announcement-content { border-top: 1px solid #e1e4e8; }
.announcement-item { display: block; padding: 39px 0 31px; border-bottom: 1px solid #e1e4e8; }
.announcement-item strong { display: block; color: #111; font-size: 14px; font-weight: 600; }
time { display: block; margin-top: 9px; color: #9298a1; font-size: 14px; }
.hot-announcements { padding-top: 43px; }
.hot-announcements h2 { margin: 0 0 27px; font-size: 22px; }
.hot-announcements a { display: flex; gap: 12px; margin: 0 0 22px; line-height: 1.5; font-size: 16px; color: #444; }
.hot-announcements span { color: #f4ff00; font-size: 18px; }
.is-detail { min-height: 560px; margin-top: 56px; }
.is-detail .announcement-content { border-top: 0; }
.back-link { color: #e6b900; font-size: 16px; }
.is-detail h1 { margin: 28px 0 7px; font-size: 26px; }
.article-body { margin-top: 40px; color: #171717; font-size: 15px; line-height: 2.8; }
.article-body p { margin: 0 0 10px; }
.empty { padding-top: 50px; text-align: center; color: #999; }
@media (max-width: 1200px) { .announcement-main { padding: 0 24px; grid-template-columns: minmax(0, 1fr) 300px; gap: 70px; } .announcement-search { width: min(700px, calc(100% - 40px)); } }
</style>
