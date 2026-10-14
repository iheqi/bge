<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { ElMessage } from 'element-plus'
import { i18n } from './i18n'
import { ref } from 'vue'

const mode = ref('remote')
const remoteDocs = [
  'personDocId',
  'personDocAddress',
  'personDocProfessional',
  'personDocAssets',
  'personDocExperience',
  'personDocEmployer',
]
const remoteMethods = [
  'personMethodTransfer',
  'personMethodCheque',
  'personMethodWitness',
]
const onsiteDocs = [
  { title: 'personDocId' },
  { title: 'personDocAddressShort' },
  {
    title: 'personDocProfessional',
    note: ['personNoteProvide', 'personNote8m', 'personNoteAuditor', 'personNoteCustodian'],
  },
  {
    title: 'personDocAssetsShort',
    note: ['personNoteProvide', 'personNoteAny', 'personNoteAuditor', 'personNoteCustodianDecl', 'personNoteAttention', 'personNoteBasis'],
  },
  {
    title: 'personDocExpChoose',
    note: ['personExpTrades', 'personExpCourse', 'personExpWork', 'personExpTraining'],
  },
  { title: 'personDocEmployer' },
]

function next() {
  ElMessage.info(i18n.global.t('personNextDemo'))
}
</script>

<template>
  <div class="user-page">
    <SiteHeader active="kyc" />
    <div class="user-layout">
      <UserSidebar />
      <main class="person-main">
        <section class="person-box">
          <h1 class="person-title">{{ $t('personTitle') }}</h1>

          <div class="person-hero">
            <div class="person-hero-text">
              <b>{{ $t('personProfile') }}</b>
              <span>{{ $t('personProfileDesc') }}</span>
            </div>
            <svg
              class="person-hero-art"
              viewBox="0 0 460 240"
              aria-hidden="true"
            >
              <rect
                x="150"
                y="24"
                width="200"
                height="150"
                rx="6"
                fill="#fffdf8"
                stroke="#efe3cd"
                stroke-width="2"
              />
              <rect
                x="186"
                y="52"
                width="20"
                height="60"
                rx="3"
                fill="#e8b93f"
              />
              <rect
                x="216"
                y="74"
                width="20"
                height="38"
                rx="3"
                fill="#f2cf6a"
              />
              <rect
                x="246"
                y="40"
                width="20"
                height="72"
                rx="3"
                fill="#e8b93f"
              />
              <polyline
                points="286,96 306,74 322,84"
                fill="none"
                stroke="#d9a600"
                stroke-width="3"
                stroke-linecap="round"
              />
              <circle
                cx="322"
                cy="84"
                r="4"
                fill="#d9a600"
              />
              <circle
                cx="414"
                cy="42"
                r="22"
                fill="none"
                stroke="#eadfca"
                stroke-width="4"
              />
              <path
                d="M414 30v14l10 6"
                stroke="#d9a600"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
              <circle
                cx="112"
                cy="70"
                r="15"
                fill="#2c3a52"
              />
              <path
                d="M88 190c0-42 12-64 26-64s26 22 26 64z"
                fill="#2c3a52"
              />
              <path
                d="M136 118l52-22"
                stroke="#2c3a52"
                stroke-width="11"
                stroke-linecap="round"
              />
              <rect
                x="178"
                y="82"
                width="26"
                height="10"
                rx="3"
                transform="rotate(-22 178 82)"
                fill="#e8b93f"
              />
              <path
                d="M60 190h96"
                stroke="#e6dbc6"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M404 190c0-18 8-28 14-28s14 10 14 28z"
                fill="#e8b93f"
              />
              <path
                d="M418 162c-10-14-6-30 0-36 6 6 10 22 0 36z"
                fill="#8fbf6a"
              />
              <path
                d="M418 162c12-12 26-12 32-6-6 8-20 12-32 6z"
                fill="#a9cf85"
              />
            </svg>
          </div>

          <div class="person-modes">
            <button
              type="button"
              :class="{ active: mode === 'remote' }"
              @click="mode = 'remote'"
            >
              {{ $t('personRemote') }}
            </button>
            <button
              type="button"
              :class="{ active: mode === 'onsite' }"
              @click="mode = 'onsite'"
            >
              {{ $t('personOnsite') }}
            </button>
          </div>

          <template v-if="mode === 'remote'">
            <div class="person-steps">
              <div class="person-steps-text">
                <p><span class="person-step-label">Step</span> <b class="person-step-no">1</b> {{ $t('personStepApply') }}　—　<b>2</b> {{ $t('personStepSubmit') }}　—　<b>3</b> {{ $t('personStepReview') }}</p>
                <small>{{ $t('personStepTime') }}</small>
              </div>
              <svg
                class="person-steps-art"
                viewBox="0 0 300 150"
                aria-hidden="true"
              >
                <rect
                  x="150"
                  y="18"
                  width="110"
                  height="86"
                  rx="4"
                  fill="#fdfbf4"
                  stroke="#efe3cd"
                  stroke-width="2"
                />
                <path
                  d="M154 88l26-26 20 16 24-30 32 40z"
                  fill="#e9dfc8"
                />
                <circle
                  cx="236"
                  cy="42"
                  r="8"
                  fill="#f2cf6a"
                />
                <path
                  d="M118 150h60"
                  stroke="#e6dbc6"
                  stroke-width="4"
                  stroke-linecap="round"
                />
                <path
                  d="M148 150l8-34 10 4 10-6-12 36z"
                  fill="#2c3a52"
                />
                <path
                  d="M176 104c14-10 30-6 38 2-8 10-26 12-38-2z"
                  fill="#e8b93f"
                />
                <circle
                  cx="96"
                  cy="70"
                  r="12"
                  fill="#2c3a52"
                />
                <path
                  d="M78 132c14-24 32-28 44-22 10 5 8 14-2 22z"
                  fill="#e8b93f"
                />
                <path
                  d="M60 120c0-16 6-26 12-26s12 10 12 26z"
                  fill="#c9a227"
                />
                <path
                  d="M72 96c-8-12-4-24 0-28 5 6 8 18 0 28z"
                  fill="#a9cf85"
                />
                <path
                  d="M72 96c10-10 22-10 27-5-5 7-17 10-27 5z"
                  fill="#8fbf6a"
                />
              </svg>
            </div>

            <div class="person-chip-row"><span class="person-chip">{{ $t('personPrepareTitle') }}</span></div>
            <ol class="person-list">
              <li
                v-for="doc in remoteDocs"
                :key="doc"
              >
                {{ $t(doc) }}
              </li>
            </ol>

            <div class="person-chip-row"><span class="person-chip">{{ $t('personMethodsTitle') }}</span></div>
            <ol class="person-list">
              <li
                v-for="method in remoteMethods"
                :key="method"
              >
                {{ $t(method) }}
              </li>
            </ol>
          </template>

          <template v-else>
            <div class="person-onsite">
              <p class="person-onsite-title">{{ $t('depHintTitle') }}</p>
              <p class="person-onsite-sub">{{ $t('personOnsiteSub') }}</p>
              <ol class="person-onsite-list">
                <li
                  v-for="doc in onsiteDocs"
                  :key="doc.title"
                >
                  <b>{{ $t(doc.title) }}</b>
                  <div
                    v-if="doc.note"
                    class="person-note"
                  >
                    <p
                      v-for="line in doc.note"
                      :key="line"
                    >
                      {{ $t(line) }}
                    </p>
                  </div>
                </li>
              </ol>
              <div class="person-office">
                <p>{{ $t('personOfficeHours') }}</p>
                <p>{{ $t('personOfficeAddress') }}</p>
                <p>{{ $t('personOfficePhone') }}</p>
              </div>
            </div>
          </template>

          <div
            v-if="mode === 'remote'"
            class="person-actions"
          >
            <a
              class="person-back"
              href="/bge/hk/zh-CN/user/kyc"
              >{{ $t('personBack') }}</a
            >
            <button
              class="person-next"
              type="button"
              @click="next"
            >
              {{ $t('personNext') }}
            </button>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.person-main{padding:24px;flex:1;min-width:0}
.person-box{padding:28px 24px 40px;background:#fff}
.person-title{display:inline-block;margin:0 0 26px;padding-bottom:8px;border-bottom:2px dashed #f0d000;color:#171d27;font-size:22px;font-weight:600}
.person-hero{position:relative;display:flex;align-items:center;gap:24px;max-width:955px;min-height:180px;margin-bottom:26px;padding:44px 40px;background:linear-gradient(90deg,#fdf4e0,#fdf9ee 70%,#fefdf9);overflow:hidden}
.person-hero-text b{display:block;color:#d9a600;font-size:21px;font-weight:600}
.person-hero-text span{display:block;margin-top:14px;color:#8a8f99;font-size:15px}
.person-hero-art{position:absolute;right:0;bottom:0;width:330px;height:172px}
.person-modes{display:flex;gap:16px;max-width:955px;margin-bottom:26px}
.person-modes button{flex:1;height:78px;border:1px solid transparent;border-radius:4px;background:#f4f6f9;color:#4a5560;font-size:16px;cursor:pointer}
.person-modes button.active{border-color:#e8c34a;background:#fdf6e6;color:#171d27}
.person-steps{position:relative;display:flex;align-items:center;max-width:955px;min-height:152px;padding:34px 40px;background:linear-gradient(90deg,#fdf4e0,#fdf9f0 70%,#fefdf9);overflow:hidden}
.person-steps-text p{margin:0;color:#171d27;font-size:22px;font-weight:500}
.person-step-label{margin-right:6px;color:#8a8f99;font-size:20px;font-weight:400}
.person-step-no{color:#d9a600;font-weight:600}
.person-steps-text small{display:block;margin-top:14px;color:#d9a600;font-size:13px}
.person-steps-art{position:absolute;right:20px;bottom:0;width:280px;height:140px}
.person-chip-row{display:flex;align-items:center;gap:18px;max-width:955px;margin:44px 0 26px;border-bottom:1px solid #e2e6ed}
.person-chip{position:relative;display:inline-flex;align-items:center;justify-content:center;min-width:300px;height:36px;padding:0 34px 0 24px;background:#f0c518;color:#fff;font-size:16px;font-weight:600;clip-path:polygon(0 0,92% 0,100% 100%,0 100%)}
.person-list{max-width:955px;margin:0;padding:0;list-style:none;counter-reset:doc}
.person-list li{position:relative;counter-increment:doc;padding-left:28px;color:#303744;font-size:15px;line-height:2.4}
.person-list li::before{content:counter(doc) ')';position:absolute;left:0;color:#303744}
.person-onsite{max-width:955px;padding:40px 44px 24px;background:#f6f6f6}
.person-onsite-title{position:relative;margin:0 0 30px;padding-left:22px;color:#303744;font-size:16px;font-weight:600}
.person-onsite-title::before{content:'';position:absolute;left:0;top:50%;width:9px;height:9px;transform:translateY(-50%);background:#f0c518}
.person-onsite-sub{margin:0 0 22px;color:#303744;font-size:15px}
.person-onsite-list{margin:0;padding:0;list-style:none;counter-reset:doc}
.person-onsite-list > li{position:relative;counter-increment:doc;margin-bottom:30px;padding-left:30px;color:#303744;font-size:15px;line-height:1.9}
.person-onsite-list > li::before{content:counter(doc) ')';position:absolute;left:0}
.person-onsite-list b{font-weight:600}
.person-note{margin-top:14px}
.person-note p{margin:0 0 8px;color:#8a8f99;font-size:13px;line-height:1.9}
.person-office{margin-top:44px;padding-top:24px}
.person-office p{margin:0 0 10px;color:#8a8f99;font-size:14px;line-height:1.8}
.person-actions{display:flex;justify-content:space-between;gap:24px;max-width:955px;margin-top:64px}
.person-back{display:inline-flex;align-items:center;justify-content:center;width:300px;height:48px;border:1px solid #dfe4ec;border-radius:4px;background:#fff;color:#303744;font-size:16px;text-decoration:none}
.person-back:hover{border-color:#f0d000;color:#d9a600}
.person-next{width:300px;height:48px;border:0;border-radius:4px;background:#f5ff18;color:#111;font-size:16px;font-weight:600;cursor:pointer}
.person-next:hover{background:#e8f000}
@media (max-width:1200px){.person-hero{padding:32px 24px}.person-hero-art{position:static;width:100%;height:200px}.person-actions{flex-direction:column}.person-back,.person-next{width:100%}}
</style>
