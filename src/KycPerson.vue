<script setup>
import SiteHeader from './SiteHeader.vue'
import UserSidebar from './UserSidebar.vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const mode = ref('remote')
const remoteDocs = [
  '你的香港身份证/护照',
  '你的居住地址证明（最近3个月内）',
  '最近12个月内签发的专业投资者资产证明',
  '资产证明（最近12个月内）',
  '虚拟投资经验证明',
  '雇主的同意书（如适用）',
]
const remoteMethods = [
  '从您在香港的个人银行账户转账不少于10,000港元/1,500美元',
  '签发不少于10,000港币/1,500美元的个人支票',
  '寻找合格的见证人',
]
const onsiteDocs = [
  { title: '你的香港身份证/护照' },
  { title: '最近3个月内的住址证明' },
  {
    title: '最近12个月内签发的专业投资者资产证明',
    note: [
      '请提供下列证明文件中的一种：',
      '即：不少于800万港元或等值的任何外币的投资组合，包括股票、债券、单位信托、股票挂钩投资、存款证、现金或现金等值的存款，列明在：',
      'a. 由审计师或注册会计师在开户日前12个月内出具的证明',
      'b. 由注册机构或持牌公司在开户日期前12个月内出具的保管人报表',
    ],
  },
  {
    title: '最近12个月内的资产证明',
    note: [
      '请提供下列证明文件中的一种：',
      '即：以任何外币组成的投资组合，包括股票、债券、单位信托基金、股票挂钩投资、存款证、现金或现金等价物存款和虚拟资产，说明如下：',
      'a. 由审计师或注册会计师在开户日前12个月内出具的证明',
      'b. 由注册机构或持牌公司在开户日期前12个月内出具的保管人声明',
      '注意：',
      '该证明将被视为未来账户的持仓限额和每日交易限额的依据。',
    ],
  },
  {
    title: '虚拟投资经验证明（以下任选其一）:',
    note: [
      'a. 账户记录显示最近连续3年内有多次交易',
      'b. 虚拟资产相关课程的证书',
      'c. 虚拟资产方面的相关工作经验证明',
      '如果以上都不能提供，我们将为客户安排随后的在线相关培训',
    ],
  },
  { title: '雇主的同意书（如适用）' },
]

function next() {
  ElMessage.info('资料填写页（Demo 中略）')
}
</script>

<template>
  <div class="user-page">
    <SiteHeader active="kyc" />
    <div class="user-layout">
      <UserSidebar />
      <main class="person-main">
        <section class="person-box">
          <h1 class="person-title">个人认证（专业投资者）</h1>

          <div class="person-hero">
            <div class="person-hero-text">
              <b>个人资料</b>
              <span>个人相关的身份、税务、地址资料</span>
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
              非亲身开户
            </button>
            <button
              type="button"
              :class="{ active: mode === 'onsite' }"
              @click="mode = 'onsite'"
            >
              亲身见证
            </button>
          </div>

          <template v-if="mode === 'remote'">
            <div class="person-steps">
              <div class="person-steps-text">
                <p><span class="person-step-label">Step</span> <b class="person-step-no">1</b> 申请填写　—　<b>2</b> 提交　—　<b>3</b> 审核</p>
                <small>申请全程大约需时 5~15分钟</small>
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

            <div class="person-chip-row"><span class="person-chip">请准备以下内容</span></div>
            <ol class="person-list">
              <li
                v-for="doc in remoteDocs"
                :key="doc"
              >
                {{ doc }}
              </li>
            </ol>

            <div class="person-chip-row"><span class="person-chip">请选择以下三种验证方法中的一种</span></div>
            <ol class="person-list">
              <li
                v-for="method in remoteMethods"
                :key="method"
              >
                {{ method }}
              </li>
            </ol>
          </template>

          <template v-else>
            <div class="person-onsite">
              <p class="person-onsite-title">你可以亲自到我们的办公室开立账户</p>
              <p class="person-onsite-sub">请您携带以下文件:</p>
              <ol class="person-onsite-list">
                <li
                  v-for="doc in onsiteDocs"
                  :key="doc.title"
                >
                  <b>{{ doc.title }}</b>
                  <div
                    v-if="doc.note"
                    class="person-note"
                  >
                    <p
                      v-for="line in doc.note"
                      :key="line"
                    >
                      {{ line }}
                    </p>
                  </div>
                </li>
              </ol>
              <div class="person-office">
                <p>办公时间：星期一至星期五：上午9时至下午6时, 星期六、星期日及香港公众假期休息</p>
                <p>地址：香港上环干诺道中168-200号信德中心招商局大厦24楼 2414-2416室</p>
                <p>如有任何疑问，请随时与我们联系，电话：(852)2379 2088</p>
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
              >返回</a
            >
            <button
              class="person-next"
              type="button"
              @click="next"
            >
              下一页
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
