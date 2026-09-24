<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<template>
  <div class="page">
    <header class="nav">
      <div class="brand">
        <img
          class="brand-logo brand-logo-full"
          src="/logo-bge-light.svg"
          alt="BGE"
          width="116"
          height="28"
        />
      </div>
      <nav class="main-links">
        <a
          class="active"
          href="/bge/hk/zh-CN/"
          >{{ $t('text000') }}</a
        ><a href="/bge/hk/zh-CN/market">{{ $t('text001') }}</a
        ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a
        ><a href="#">{{ $t('text003') }}</a
        ><a
          class="company"
          href="/bge/hk/zh-CN/about"
          >{{ $t('text004') }}<el-icon><ArrowDown /></el-icon
        ></a>
      </nav>
      <div class="right-links">
        <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
        ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
        ><MessageBell /><UserMenu /><LanguageSwitcher /><span
          class="account-divider"
          aria-hidden="true"
        ></span
        ><a href="#">USD</a>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="hero-inner">
          <h1>{{ $t('text117') }}<br />{{ $t('text118') }}</h1>
          <div
            class="hero-art"
            aria-hidden="true"
          >
            <div class="coin coin-back">₿</div>
            <div class="card-art"><span></span></div>
          </div>
        </div>
        <div class="news">
          <span class="slider"></span>
          <div>{{ $t('text119') }}</div>
        </div>
      </section>

      <section class="about">
        <h2>{{ $t('text120') }}</h2>
        <div class="about-row company-row">
          <div class="scene scene-hk">
            <div class="disc">✦</div>
            <div class="disc coin-hk">◆</div>
          </div>
          <div class="copy">
            <h3>{{ $t('text121') }}</h3>
            <p>{{ $t('text122') }}</p>
            <strong><span class="hk-icon">✤</span>{{ $t('text123') }}</strong>
          </div>
        </div>
        <div class="about-row safety-row">
          <div class="copy">
            <h3>{{ $t('text124') }}</h3>
            <ul>
              <li>{{ $t('text125') }}</li>
              <li>{{ $t('text126') }}</li>
              <li>{{ $t('text127') }}</li>
              <li>{{ $t('text128') }}</li>
            </ul>
          </div>
          <div class="scene shield-scene">
            <div class="shield">✓</div>
            <div class="coin green">₮</div>
            <div class="coin gold">₿</div>
          </div>
        </div>
      </section>
    </main>

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
          <a href="#">{{ $t('text003') }}</a
          ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
          <h4 class="service">{{ $t('text108') }}</h4>
          <a href="#">{{ $t('text109') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a href="#">{{ $t('text071') }}</a
          ><a href="#">{{ $t('text110') }}</a
          ><a href="#">{{ $t('text111') }}</a
          ><a href="#">{{ $t('text112') }}</a
          ><a href="#">{{ $t('text113') }}</a
          ><a href="#">{{ $t('text114') }}</a>
        </div>
        <div class="contact">
          <h4>{{ $t('text067') }}</h4>
          <a href="mailto:cs@bg.exchange">{{ $t('text072') }}</a
          ><a href="#">{{ $t('text115') }}<br />{{ $t('text116') }}</a>
        </div>
      </div>
      <div class="legal">
        <span>BGE@2026</span>
        <p>{{ $t('text129') }}</p>
      </div>
    </footer>
  </div>
</template>
