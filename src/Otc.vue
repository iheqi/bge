<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import { tr } from './i18n'
import MessageBell from './MessageBell.vue'
import { ArrowDown } from '@element-plus/icons-vue'
const services = [
  ['a', '专属客户经理', '享受机构级专属服务'],
  ['b', '深度流动性', '大宗交易小滑点'],
  ['c', '定价透明', '零隐藏费用'],
  ['d', '安全结算', '准确、及时、安全的结算方案'],
  ['e', '全面的币种列表', '支持灵活定制'],
]
const steps = [
  ['01', '联系专属客户经理', '获取1对1定制方案'],
  ['02', '价格确认', '资产价格锁定'],
  ['03', '交易完成', '资金安全交付'],
]
const faqs = [
  [
    '什么是OTC交易？',
    'OTC（场外交易）支持直接协商大额数字资产交易，减少公开市场滑点。作为中介机构，促进流动性匹配，提供相对交易所订单簿具有竞争力的专业定价。',
  ],
  ['BGE提供哪些数字资产？', 'BGE提供多种OTC交易的数字资产，请联系我们获取完整的资产列表。'],
  ['在哪里查看我的OTC交易记录', '登录账户后，在个人中心-账户-OTC订单处可查看相关记录。'],
  [
    '如何成为BGE的报价方？',
    '若您是市场上具有竞争力的流动性提供商，有能力和兴趣与BGE进行合作，提供报价服务，请联系我们 cs@bg.exchange',
  ],
]
</script>
<template>
  <div class="otc-page">
    <header class="otc-nav">
      <a
        class="otc-brand"
        href="/bge/hk/zh-CN/"
        ><img
          class="brand-logo brand-logo-full"
          src="/logo-bge-light.svg"
          alt="BGE"
          width="116"
          height="28"
      /></a>
      <nav>
        <a href="/bge/hk/zh-CN/">{{ $t('text000') }}</a
        ><a href="/bge/hk/zh-CN/market">{{ $t('text001') }}</a
        ><a
          class="on"
          href="/bge/hk/zh-CN/otc"
          >{{ $t('text002') }}</a
        ><a href="#">{{ $t('text003') }}</a
        ><a href="/bge/hk/zh-CN/about"
          >{{ $t('text004') }}<el-icon><ArrowDown /></el-icon
        ></a>
      </nav>
      <div class="otc-right">
        <MessageBell /><a href="#">{{ $t('text212') }}</a
        ><button>{{ $t('text213') }}</button><LanguageSwitcher /><span
          class="account-divider"
          aria-hidden="true"
        ></span
        ><a href="#">USD</a>
      </div>
    </header>
    <main>
      <section class="service-section">
        <h1>{{ $t('text214') }}</h1>
        <div class="service-grid">
          <article
            v-for="item in services"
            :key="item[0]"
            class="service-card"
          >
            <span class="badge">{{ tr(item[0]) }}</span>
            <h3>{{ tr(item[1]) }}</h3>
            <p>{{ tr(item[2]) }}</p>
          </article>
          <article class="service-card more">
            <h3>{{ $t('text215') }}</h3>
          </article>
        </div>
        <button class="contact-btn">{{ $t('text216') }}</button>
      </section>
      <section class="steps-section">
        <h2>{{ $t('text217') }}</h2>
        <div class="steps-grid">
          <article
            v-for="item in steps"
            :key="item[0]"
            class="service-card"
          >
            <span class="badge">{{ tr(item[0]) }}</span>
            <h3>{{ tr(item[1]) }}</h3>
            <p>{{ tr(item[2]) }}</p>
          </article>
        </div>
      </section>
      <section class="group-section">
        <h2>{{ $t('text218') }}</h2>
        <div class="group-grid">
          <article>
            <div class="laurel">❧ HKF HOLDINGS ❧<small>1726.HK</small></div>
            <h3>{{ $t('text121') }}</h3>
            <p>{{ $t('text219') }}</p>
          </article>
          <article>
            <div class="laurel">❧ Audit ❧<small>Insurance</small></div>
            <h3>{{ $t('text220') }}</h3>
            <p>{{ $t('text221') }}</p>
          </article>
          <article>
            <div class="laurel">❧ SFC ❧<small>Licensed</small></div>
            <h3>{{ $t('text222') }}</h3>
            <p>{{ $t('text223') }}</p>
          </article>
          <article>
            <div class="laurel">❧ Professional ❧<small>Team</small></div>
            <h3>{{ $t('text224') }}</h3>
            <p>{{ $t('text225') }}</p>
          </article>
        </div>
      </section>
      <section class="faq-section">
        <h2>{{ $t('text226') }}</h2>
        <div class="faq-list">
          <article
            v-for="item in faqs"
            :key="item[0]"
          >
            <h3>{{ tr(item[0]) }}</h3>
            <p>{{ tr(item[1]) }}</p>
          </article>
        </div>
      </section>
    </main>
    <footer class="otc-footer">
      <div class="footer-inner">
        <a
          class="otc-brand dark"
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
          <a href="#">{{ $t('text003') }}</a
          ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
          <h4>{{ $t('text108') }}</h4>
          <a href="#">{{ $t('text109') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a href="#">{{ $t('text071') }}</a
          ><a href="#">{{ $t('text110') }}</a
          ><a href="#">{{ $t('text111') }}</a
          ><a href="#">{{ $t('text112') }}</a
          ><a href="#">{{ $t('text113') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a href="mailto:cs@bg.exchange">{{ $t('text072') }}</a
          ><a href="#">{{ $t('text115') }}<br />{{ $t('text116') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
