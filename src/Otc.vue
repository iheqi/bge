<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
const services = [
  ['a', '专属客户经理', '享受机构级专属服务'], ['b', '深度流动性', '大宗交易小滑点'], ['c', '定价透明', '零隐藏费用'],
  ['d', '安全结算', '准确、及时、安全的结算方案'], ['e', '全面的币种列表', '支持灵活定制']
]
const steps = [['01', '联系专属客户经理', '获取1对1定制方案'], ['02', '价格确认', '资产价格锁定'], ['03', '交易完成', '资金安全交付']]
const faqs = [['什么是OTC交易？', 'OTC（场外交易）支持直接协商大额数字资产交易，减少公开市场滑点。作为中介机构，促进流动性匹配，提供相对交易所订单簿具有竞争力的专业定价。'], ['BGE提供哪些数字资产？', 'BGE提供多种OTC交易的数字资产，请联系我们获取完整的资产列表。'], ['在哪里查看我的OTC交易记录', '登录账户后，在个人中心-账户-OTC订单处可查看相关记录。'], ['如何成为BGE的报价方？', '若您是市场上具有竞争力的流动性提供商，有能力和兴趣与BGE进行合作，提供报价服务，请联系我们 cs@bg.exchange']]
</script>
<template>
<div class="otc-page">
  <header class="otc-nav"><a class="otc-brand" href="/hk/zh-CN/"><span>╱</span><b>BGE</b></a><nav><a href="/hk/zh-CN/">首页</a><a class="on" href="/hk/zh-CN/otc">场外</a><a href="#">现货交易</a><a href="/hk/zh-CN/about">公司 <el-icon><ArrowDown/></el-icon></a></nav><div class="otc-right"><a href="#">登录</a><button>注册</button><a href="#">简体中文</a><i></i><a href="#">USD</a></div></header>
  <main>
    <section class="service-section"><h1>提供安全可信赖的OTC服务</h1><div class="service-grid"><article v-for="item in services" :key="item[0]" class="service-card"><span class="badge">{{item[0]}}</span><h3>{{item[1]}}</h3><p>{{item[2]}}</p></article><article class="service-card more"><h3>了解更多</h3></article></div><button class="contact-btn">联系我们</button></section>
    <section class="steps-section"><h2>OTC流程指引</h2><div class="steps-grid"><article v-for="item in steps" :key="item[0]" class="service-card"><span class="badge">{{item[0]}}</span><h3>{{item[1]}}</h3><p>{{item[2]}}</p></article></div></section>
    <section class="group-section"><h2>HKBGE集团简介</h2><div class="group-grid"><article><div class="laurel">❧ HKF HOLDINGS ❧<small>1726.HK</small></div><h3>香港上市公司旗下成员</h3><p>我们是香港上市公司HKE Holdings Limited 旗下虚拟资产交易平台。</p></article><article><div class="laurel">❧ Audit ❧<small>Insurance</small></div><h3>审计与保险</h3><p>我们的财务报表有专业会计师事务所审计，且已根据证监会要求投保。</p></article><article><div class="laurel">❧ SFC ❧<small>Licensed</small></div><h3>合规运营，持牌经营</h3><p>BGE 获香港证监会发出的第1类证券交易及第7类提供自动化交易服务牌照。</p></article><article><div class="laurel">❧ Professional ❧<small>Team</small></div><h3>行业资深团队</h3><p>团队具备强大技术支持能力，开发专有产品和服务，服务超高净值客户。</p></article></div></section>
    <section class="faq-section"><h2>常见问题</h2><div class="faq-list"><article v-for="item in faqs" :key="item[0]"><h3>{{item[0]}}</h3><p>{{item[1]}}</p></article></div></section>
  </main>
  <footer class="otc-footer"><div class="footer-inner"><a class="otc-brand dark" href="/hk/zh-CN/"><span>╱</span><b>BGE</b></a><div><h4>公司</h4><a href="/hk/zh-CN/about">关于我们</a><a href="/hk/zh-CN/security">安全</a></div><div><h4>产品</h4><a href="#">现货交易</a><a href="/hk/zh-CN/otc">场外</a><h4>服务</h4><a href="#">帮助中心</a></div><div><h4>条款</h4><a href="#">条款及细则</a><a href="#">隐私政策</a><a href="#">免责声明</a><a href="#">交易规则</a><a href="#">Cookie政策</a></div><div><h4>关于我们</h4><a href="mailto:cs@bg.exchange">邮箱：cs@bg.exchange</a><a href="#">地址：香港上环干诺道中168-200号信德中心<br/>招商局大厦24楼2414-2416室</a></div></div></footer>
</div></template>
