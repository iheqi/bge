<script setup>
import { computed, ref } from 'vue'
import SiteHeader from './SiteHeader.vue'
import Footer from './Footer.vue'
import { tr } from './i18n'

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
    <SiteHeader active="announcement" />

    <section v-if="!detail" class="announcement-hero">
      <h1>{{ $t('annTitle') }}</h1>
      <form class="announcement-search" @submit.prevent><input v-model="query" :placeholder="$t('annPlaceholder')" /><button>{{ $t('text283') }}</button></form>
    </section>

    <main class="announcement-main" :class="{ 'is-detail': detail }">
      <section class="announcement-content">
        <template v-if="detail">
          <a class="back-link" :href="base">{{ $t('annBack') }}</a>
          <h1>{{ detailArticle.title }}</h1><time>{{ detailArticle.date }}</time>
          <div class="article-body"><p>{{ $t('annGreeting') }}</p><p>{{ $t('annBody1') }}</p><p>{{ $t('annBody2') }}</p><p>{{ $t('annTeam') }}<br />{{ $t('annDate') }}</p></div>
        </template>
        <template v-else>
          <a v-for="item in filtered" :key="item.id" class="announcement-item" :href="`${base}/article/${item.id}`"><strong>{{ tr(item.title) }}</strong><time>{{ item.date }}</time></a>
          <p v-if="!filtered.length" class="empty">{{ $t('annEmpty') }}</p>
        </template>
      </section>
      <aside class="hot-announcements"><h2>{{ $t('annHot') }}</h2><a v-for="item in hot" :key="item.id" :href="`${base}/article/${item.id}`"><span>★</span>{{ tr(item.title) }}</a></aside>
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
