<script setup>
import LanguageSwitcher from './LanguageSwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import { ArrowDown } from '@element-plus/icons-vue'
defineProps({ security: Boolean })
const cards = [
  [
    'a',
    '高级身份验证',
    '系统认证在认证政策和程式下，严格控制登录环境、补登/注销、多因素认证、白名单IP/闸道位址的内部密码和一次性密码。',
  ],
  [
    'b',
    '严格权限管理',
    '根据公司和使用者层面的授权政策和程式，系统授权严格控制具有不同登录许可权（介面、GUI）、一般许可权、工具组许可权和参考资料许可权的角色。',
  ],
  [
    'c',
    '数据加密',
    '所有应用程序、敏感数据及密码均采用业界领先的哈希与加密标准进行保护。传输中的数据通过高级TLS协议防护，确保您设备与我方服务器间的通信始终保持私密且不可篡改。',
  ],
  [
    'd',
    '全面审计追踪',
    '实施审计跟踪，以跟踪系统时间戳记、认证成功或失败、应用程式的启动、重启和错误、流程配置更新和市场操作行动。',
  ],
]
</script>
<template>
  <div class="company-page">
    <section
      class="company-hero"
      :class="{ security }"
    >
      <header class="company-nav">
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
          ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a
          ><a>{{ $t('text003') }}</a>
          <div class="company-menu">
            <a
              >{{ $t('text004') }}<el-icon><ArrowDown /></el-icon
            ></a>
            <div class="company-dropdown">
              <a
                href="/bge/hk/zh-CN/about"
                :class="{ selected: !security }"
                >{{ $t('text067') }}</a
              ><a
                href="/bge/hk/zh-CN/security"
                :class="{ selected: security }"
                >{{ $t('text068') }}</a
              >
            </div>
          </div>
        </nav>
        <div class="company-account">
          <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
          ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
          ><MessageBell /><UserMenu /><LanguageSwitcher /><span
            class="account-divider"
            aria-hidden="true"
          ></span
          ><a>USD</a>
        </div>
      </header>
      <div class="company-intro">
        <h1>{{ tr(security ? '安全' : '关于我们') }}</h1>
        <template v-if="!security"
          ><p>{{ $t('text081') }}<br />{{ $t('text082') }}</p>
          <p>{{ $t('text083') }}<br />{{ $t('text084') }}</p>
          <p>{{ $t('text085') }}<br />{{ $t('text086') }}</p></template
        >
        <p v-else>{{ $t('text087') }}<br />{{ $t('text088') }}</p>
      </div>
    </section>
    <main
      v-if="!security"
      class="company-body"
    >
      <section class="mission-grid">
        <article>
          <div class="mission-icon">⚑</div>
          <h2>{{ $t('text089') }}</h2>
          <p>{{ $t('text090') }}</p>
        </article>
        <article>
          <div class="mission-icon">◎</div>
          <h2>{{ $t('text091') }}</h2>
          <p>{{ $t('text092') }}</p>
        </article>
      </section>
      <section class="directors">
        <h2>{{ $t('text093') }}</h2>
        <article>
          <div>
            <h3>{{ $t('text094') }}</h3>
            <span>{{ $t('text095') }}</span>
          </div>
          <p>{{ $t('text096') }}</p>
        </article>
        <article>
          <div>
            <h3>{{ $t('text097') }}</h3>
            <span>{{ $t('text098') }}</span>
          </div>
          <p>{{ $t('text099') }}</p>
        </article>
      </section>
    </main>
    <main
      v-else
      class="company-body security-body"
    >
      <section class="security-row">
        <div>
          <h2>{{ $t('text100') }}</h2>
          <p>{{ $t('text101') }}<br />{{ $t('text102') }}</p>
        </div>
        <div class="security-illustration">▣<span>✓</span></div>
      </section>
      <section class="security-row reverse">
        <div class="security-illustration server">▤<span>₿</span></div>
        <div>
          <h2>{{ $t('text103') }}</h2>
          <p>{{ $t('text104') }}<br />{{ $t('text105') }}</p>
        </div>
      </section>
      <section class="system-security">
        <h2>{{ $t('text106') }}</h2>
        <p>{{ $t('text107') }}</p>
        <div class="security-grid">
          <article
            v-for="(card, index) in cards"
            :key="card[0]"
            :class="'security-card card-' + index"
          >
            <h3>
              <span>{{ tr(card[0]) }}</span
              >{{ tr(card[1]) }}
            </h3>
            <p>{{ tr(card[2]) }}</p>
            <div
              v-if="index === 0"
              class="identity-art"
            >
              ♙<span>✓</span>♙
            </div>
          </article>
        </div>
      </section>
    </main>
    <footer>
      <div class="footer-inner">
        <div class="otc-brand dark">
          <img
            class="brand-logo brand-logo-full"
            src="/logo-bge.svg"
            alt="BGE"
            width="116"
            height="28"
          />
        </div>
        <div>
          <h4>{{ $t('text004') }}</h4>
          <a href="/bge/hk/zh-CN/about">{{ $t('text067') }}</a
          ><a href="/bge/hk/zh-CN/security">{{ $t('text068') }}</a>
        </div>
        <div>
          <h4>{{ $t('text069') }}</h4>
          <a>{{ $t('text003') }}</a
          ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a>
          <h4 class="service">{{ $t('text108') }}</h4>
          <a>{{ $t('text109') }}</a>
        </div>
        <div>
          <h4>{{ $t('text070') }}</h4>
          <a>{{ $t('text071') }}</a
          ><a>{{ $t('text110') }}</a
          ><a>{{ $t('text111') }}</a
          ><a>{{ $t('text112') }}</a
          ><a>{{ $t('text113') }}</a
          ><a>{{ $t('text114') }}</a>
        </div>
        <div>
          <h4>{{ $t('text067') }}</h4>
          <a>{{ $t('text072') }}</a
          ><a>{{ $t('text115') }}<br />{{ $t('text116') }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>
