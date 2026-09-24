<script setup>
import { formatMoney } from './currency'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import { tr } from './i18n'
import UserMenu from './UserMenu.vue'
import MessageBell from './MessageBell.vue'
import {
  ArrowDown,
  Grid,
  Wallet,
  Tickets,
  User,
  Lock,
  Briefcase,
  Connection,
  Search,
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const accountTab = ref(
  new URLSearchParams(window.location.search).get('account') === 'trade' ? 'trade' : 'fund',
)
defineProps({ assets: Boolean })
const coins = [
  ['$', 'USD', '美元', '法币'],
  ['◆', 'ETH', '以太坊', ''],
  ['$', 'USDC', 'USD Coin', '仅PI'],
  ['₮', 'USDT', '泰达币', '仅PI'],
  ['HK$', 'HKD', '港币', '法币'],
  ['₿', 'BTC', 'Bitcoin', ''],
]
</script>
<template>
  <div class="user-page">
    <header class="user-nav">
      <a
        class="brand"
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
        ><a>{{ $t('text003') }}</a
        ><a href="/bge/hk/zh-CN/about"
          >{{ $t('text004') }}<el-icon><ArrowDown /></el-icon
        ></a>
      </nav>
      <div class="user-right">
        <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
        ><a
          :class="{ active: assets }"
          href="/bge/hk/zh-CN/user/assets"
          >{{ $t('text006') }}</a
        ><MessageBell /><UserMenu /><LanguageSwitcher /><span
          class="account-divider"
          aria-hidden="true"
        ></span>
        <CurrencySwitcher />
      </div>
    </header>
    <div class="user-layout">
      <aside
        v-if="assets"
        class="asset-sidebar"
      >
        <a
          class="asset-menu-link"
          :class="{ sel: accountTab === 'fund' }"
          href="/bge/hk/zh-CN/user/assets?account=fund"
          ><el-icon><Wallet /></el-icon>{{ $t('text333') }}</a
        ><a
          class="asset-menu-link"
          :class="{ sel: accountTab === 'trade' }"
          href="/bge/hk/zh-CN/user/assets?account=trade"
          ><el-icon><Tickets /></el-icon>{{ $t('text334') }}</a
        >
      </aside>
      <aside v-else>
        <a
          href="/bge/hk/zh-CN/user/dashboard"
          :class="{ sel: !assets }"
          ><el-icon><Grid /></el-icon>{{ $t('text008') }}</a
        ><a href="/bge/hk/zh-CN/user/kyc"
          ><el-icon><User /></el-icon>{{ $t('text009') }}</a
        ><a href="/bge/hk/zh-CN/user/security"
          ><el-icon><Lock /></el-icon>{{ $t('text010') }}</a
        ><a href="/bge/hk/zh-CN/user/payment/fiat"
          ><el-icon><Briefcase /></el-icon>{{ $t('text011') }}</a
        ><a href="/bge/hk/zh-CN/user/parameters"
          ><el-icon><Tickets /></el-icon>{{ $t('text012') }}</a
        ><a href="/bge/hk/zh-CN/user/api"
          ><el-icon><Connection /></el-icon>{{ $t('text013') }}</a
        >
      </aside>
      <main class="user-main">
        <section
          v-if="!assets"
          class="profile"
        >
          <div class="avatar big">
            <img
              src="/avatar.png"
              :alt="$t('text335')"
              width="44"
              height="44"
            />
          </div>
          <div>
            <h3>heqi**gic@gmail.com</h3>
            <p>UID 8395618828　<span>▢</span>{{ $t('text336') }}</p>
          </div>
        </section>
        <template v-if="!assets"
          ><section class="overview">
            <h2>{{ $t('text337') }}</h2>
            <div class="tabs">
              <b>{{ $t('text338') }}</b
              ><span>{{ $t('text333') }}</span
              ><span>{{ $t('text334') }}</span>
            </div>
            <p class="label">{{ $t('text339') }}</p>
            <strong>{{ formatMoney(0, 'USD', 4) }}</strong>
            <div>
              <button>{{ $t('text275') }}</button><button class="muted">{{ $t('text276') }}</button>
            </div>
          </section>
          <div class="panels">
            <section>
              <h2>
                {{ $t('text294') }}<small>{{ $t('text340') }}</small>
              </h2>
              <div class="empty">{{ $t('text066') }}</div>
            </section>
            <section>
              <h2>
                {{ $t('text005') }}<small>{{ $t('text340') }}</small>
              </h2>
              <div class="empty">{{ $t('text066') }}</div>
            </section>
          </div></template
        ><template v-else
          ><section class="asset-banner">
            <span>{{ $t('text341') }}</span
            ><strong
              >0.00000000 BTC <small>≈ {{ formatMoney(0, 'USD', 4) }}</small></strong
            ><a>{{ $t('text342') }}</a>
          </section>
          <section class="asset-box">
            <h2 class="asset-account-title">
              {{ tr(accountTab === 'fund' ? '资金账户' : '交易账户') }}
            </h2>
            <p class="label">
              {{ tr(accountTab === 'fund' ? '资金账户' : '交易账户') }}{{ $t('text343') }}
            </p>
            <strong
              >0.00000000 BTC <small>≈ {{ formatMoney(0, 'USD', 4) }}</small></strong
            >
            <div class="asset-tools">
              <label>{{ $t('text344') }}</label>
              <div class="search">
                <input :placeholder="$t('text283')" /><el-icon><Search /></el-icon>
              </div>
            </div>
            <div class="coin-head">
              <span>{{ $t('text345') }}</span
              ><span>{{ $t('text346') }}</span
              ><span>{{ $t('text347') }}</span
              ><span>{{ $t('text348') }}</span
              ><span>{{ $t('text065') }}</span>
            </div>
            <div
              v-for="coin in coins"
              :key="coin[1]"
              class="coin-row"
            >
              <div class="coin-name">
                <i>{{ tr(coin[0]) }}</i
                ><span
                  >{{ tr(coin[1]) }} <em v-if="coin[3]">{{ tr(coin[3]) }}</em
                  ><small>{{ tr(coin[2]) }}</small></span
                >
              </div>
              <b>0.00000000</b><b>0.00000000</b
              ><b
                >0.00000000<small>≈ {{ formatMoney(0, 'USD', 4) }}</small></b
              >
              <div>
                <a class="disabled">{{ $t('text275') }}</a
                ><a>{{ $t('text276') }}</a
                ><a>{{ $t('text309') }}</a>
              </div>
            </div>
          </section></template
        >
      </main>
    </div>
  </div>
</template>
