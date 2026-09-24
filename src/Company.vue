<script setup>
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
          <a href="/bge/hk/zh-CN/">首页</a><a href="/bge/hk/zh-CN/market">行情</a
          ><a href="/bge/hk/zh-CN/otc">场外</a><a>现货交易</a>
          <div class="company-menu">
            <a
              >公司 <el-icon><ArrowDown /></el-icon
            ></a>
            <div class="company-dropdown">
              <a
                href="/bge/hk/zh-CN/about"
                :class="{ selected: !security }"
                >关于我们</a
              ><a
                href="/bge/hk/zh-CN/security"
                :class="{ selected: security }"
                >安全</a
              >
            </div>
          </div>
        </nav>
        <div class="company-account">
          <a href="/bge/hk/zh-CN/user/report/spot">订单</a
          ><a href="/bge/hk/zh-CN/user/assets">资产管理</a><MessageBell /><UserMenu /><a>简体中文</a
          ><span
            class="account-divider"
            aria-hidden="true"
          ></span
          ><a>USD</a>
        </div>
      </header>
      <div class="company-intro">
        <h1>{{ security ? '安全' : '关于我们' }}</h1>
        <template v-if="!security"
          ><p>
            Hong Kong BGE Limited
            (“HKBGE”)是一家总部位于香港的虚拟资产交易平台营运商，为香港交易所上市公司 HKE<br />Holdings
            Limited（股份代号：1726.HK）的全资附属公司。
          </p>
          <p>
            HKBGE 已获香港证监会发出的第1类 (证券交易) 及第7类 (提供自动化交易服务)
            牌照，以及根据《打击洗钱及恐怖分子<br />资金筹集条例》(AMLO)
            颁发的牌照，用于运营虚拟资产交易平台。
          </p>
          <p>
            HKBGE 的全资子公司 HKBGE TSP Limited（“HKBGE TSP”）持有信托或公司服务提供商 (TCSP)
            牌照，并为 HKBGE 的交<br />易平台提供虚拟资产托管服务。
          </p></template
        >
        <p v-else>
          我们始终将客户资产安全和监管合规作为公司最高准则和执行标准，为了保障客户资产不受侵害，公司体系持续健康正常<br />运转，我们为此做了很多努力。
        </p>
      </div>
    </section>
    <main
      v-if="!security"
      class="company-body"
    >
      <section class="mission-grid">
        <article>
          <div class="mission-icon">⚑</div>
          <h2>我们的使命</h2>
          <p>
            我们和广大数字货币投资者与区块链技术爱好者拥有共同的目标和期望，即实现财富更加透明和健康，经济更加完善和平衡，人与人之间更加公平和自由。作为一个具有独立思考和行动能力的所谓的人，都拥有与其自由思想相同的权益。
          </p>
        </article>
        <article>
          <div class="mission-icon">◎</div>
          <h2>我们的目标</h2>
          <p>
            我们严格遵守虚拟资产交易、清算、结算和托管平台的预期监管标准，建立稳健的合规框架，确保洗钱、恐怖主义融资和扩散融资风险，并通过充分的网络安全和规避风险的内部控制来保护客户的资产不受侵害
          </p>
        </article>
      </section>
      <section class="directors">
        <h2>HKE 集团董事</h2>
        <article>
          <div>
            <h3>连浩民</h3>
            <span>董事长</span>
          </div>
          <p>
            连浩民先生曾投资及管理多家公司，公司管治经验丰富。连先生为大圣集团控股有限公司（「大圣集团」）之创始人，大圣集团愿景成为一家提供一站式金融服务的金融科技企业，其子公司拥有香港证监会所颁发可进行第1类、第4类及第9类受规管活动之牌照。彼亦为永卓御富国际有限公司之董事长，其主要业务为从事海外房地产投资。除上述职务外，彼亦担任香港第六届选举委员会委员、中华全国青年联合会第十三届委员、九龙社团联会第九届首席会长、香港个人资料私隐专员公署第64届个人资料（私隐）咨询委员会委员、东华三院2021/2022辛丑年总理、香港政协青年联会执委会第四届副主席、香港菁英会执委会委员暨第十四届执委会副秘书长、江苏省青年联合会第十一届港澳界别委员、香港青年联会第二十九届常务董事、南天青年协进会第八届荣誉董事、青少年勉励基金副主席暨秘书长以及香港大学基金名誉董事。
          </p>
        </article>
        <article>
          <div>
            <h3>郑耀武</h3>
            <span>董事</span>
          </div>
          <p>
            郑耀武先生在香港执法及国际打击洗钱方面经验丰富，将为本集团的工程业务及金融科技平台业务的合规事宜带来宝贵贡献。郑先生自2019年4月起一直担任柏年顾问有限公司的执行董事，该公司从事提供打击洗钱（「打击洗钱」）和金融犯罪的咨询及调查服务。郑先生曾效力香港警务处（「香港警务处」），于2018年9月退休，退休时担任警务处助理处长。郑先生效力香港警务处期间，于2007年至2010年曾出任香港联合财富情报组主管，并率领香港警务处财富调查组，专责监管重大洗钱案件的调查工作、定期为本地和海外的执法部门及金融监管机构举办有关打击洗钱的培训，并且为金融机构及指定非金融企业和专业筹办一系列的训练活动。郑先生于2006年及2007年被派驻香港政府总部，负责协调政府部门及相关监管机构有关打击洗钱的立法工作和运作，同时于2008年筹备财务行动特别组织对香港的评核。彼于2012至2015年出任世界经济论坛之有组织罪行议事会成员。郑先生于2015年至2023年为野生动物司法委员会的委员并于2022年至2023年担任督导委员。郑先生分别于1986年及2004年获香港大学颁授理学学士学位及公共行政硕士学位。
          </p>
        </article>
      </section>
    </main>
    <main
      v-else
      class="company-body security-body"
    >
      <section class="security-row">
        <div>
          <h2>安全资产托管</h2>
          <p>
            我们采用分层托管架构，将资产安全置于首位。绝大多数客户资产存储于香港离线冷钱包中，而运营用的热钱包则存放于严格隔离的高安全环境。<br />所有私钥均在银行级硬件安全模块（HSM）内生成存储。密钥使用受严格内部管控，包括职责严格分离与多层审批流程，确保任何单一人员均无法独立访问敏感资产。
          </p>
        </div>
        <div class="security-illustration">▣<span>✓</span></div>
      </section>
      <section class="security-row reverse">
        <div class="security-illustration server">▤<span>₿</span></div>
        <div>
          <h2>系统可靠性</h2>
          <p>
            我们构建了强大的基础设施以支持持续稳定的交易运营。技术团队遵循严格的系统维护升级规程，最大限度减少服务中断。<br />我们运用全面监控工具主动检测系统异常。若遇突发状况，已建立完善的恢复协议以高效恢复服务并保障数据完整性。
          </p>
        </div>
      </section>
      <section class="system-security">
        <h2>系统安全</h2>
        <p>为确保系统安全，我们将在认证、授权和应用安全方面实施安全控制，以保护平台不被滥用。</p>
        <div class="security-grid">
          <article
            v-for="(card, index) in cards"
            :key="card[0]"
            :class="'security-card card-' + index"
          >
            <h3>
              <span>{{ card[0] }}</span
              >{{ card[1] }}
            </h3>
            <p>{{ card[2] }}</p>
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
          <h4>公司</h4>
          <a href="/bge/hk/zh-CN/about">关于我们</a><a href="/bge/hk/zh-CN/security">安全</a>
        </div>
        <div>
          <h4>产品</h4>
          <a>现货交易</a><a href="/bge/hk/zh-CN/otc">场外</a>
          <h4 class="service">服务</h4>
          <a>帮助中心</a>
        </div>
        <div>
          <h4>条款</h4>
          <a>条款及细则</a><a>隐私政策</a><a>免责声明</a><a>交易规则</a><a>Cookie政策</a
          ><a>Cookie偏好设置</a>
        </div>
        <div>
          <h4>关于我们</h4>
          <a>邮箱：cs@bg.exchange</a
          ><a>地址：香港上环干诺道中168-200号信德中心<br />招商局大厦24楼2414-2416室</a>
        </div>
      </div>
    </footer>
  </div>
</template>
