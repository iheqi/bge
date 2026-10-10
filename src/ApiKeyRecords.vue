<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const storageKey = 'bge-demo-api-records-v1'
const seed = [{ id: 'demo-1', remarks: '行情查询', authorities: ['readonly'], ipAddresses: '192.0.2.10', state: 'valid', createdDate: '2026-10-08 10:20:00', apiKey: 'demo_api_readonly_001', secret: 'demo_secret_readonly_001' }, { id: 'demo-2', remarks: '交易策略', authorities: ['readonly', 'trade', 'withdraw'], ipAddresses: '198.51.100.20,198.51.100.21', state: 'overdue', createdDate: '2026-09-01 09:30:00', apiKey: 'demo_api_strategy_002', secret: 'demo_secret_strategy_002' }]
let initial = seed
try { const saved = JSON.parse(localStorage.getItem(storageKey)); if (Array.isArray(saved) && saved.every(r => r.id && Array.isArray(r.authorities))) initial = saved } catch {}
const rows = ref(initial)
const authNames = { readonly: '读取', trade: '交易', withdraw: '划转' }
const authText = row => row.authorities.map(a => authNames[a]).join('、')
const editor = ref(false), detail = ref(null), verification = ref(false), code = ref(''), verifyError = ref(''), editId = ref(null)
const formRef = ref()
const form = reactive({ remarks: '', ipAddresses: '', authorities: ['readonly'] })
let pending = null
const rules = {
 remarks: [{ validator: (_, value, done) => done(value.trim() ? undefined : new Error('请输入备注')), trigger: 'blur' }],
 ipAddresses: [{ validator: (_, value, done) => {
  const ips = value.split(',').map(s => s.trim())
  const valid = ips.every(ip => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every(n => Number(n) <= 255))
  done(!value.trim() ? new Error('请输入IP地址') : ips.length > 10 ? new Error('最多支持配置10个IP') : !valid ? new Error('请输入正确的IPv4地址，多个地址以英文逗号分隔') : undefined)
 }, trigger: 'blur' }]
}
function persist() { try { localStorage.setItem(storageKey, JSON.stringify(rows.value)) } catch { ElMessage.warning('浏览器无法保存，本次变更仅在当前页面有效') } }
function edit(row) {
 if (!row && rows.value.length >= 10) return ElMessage.warning('最多创建10个API Key')
 editId.value = row?.id ?? null
 Object.assign(form, { remarks: row?.remarks ?? '', ipAddresses: row?.ipAddresses ?? '', authorities: [...(row?.authorities ?? ['readonly'])] })
 editor.value = true
}
function verify(action) { pending = action; code.value = ''; verifyError.value = ''; verification.value = true }
function confirmVerification() {
 if (code.value !== '123456') { verifyError.value = '请输入演示验证码 123456'; return }
 verification.value = false
 const action = pending; pending = null; action?.()
}
async function save() {
 if (!(await formRef.value.validate().catch(() => false))) return
 const values = { remarks: form.remarks.trim(), ipAddresses: form.ipAddresses.split(',').map(s => s.trim()).join(','), authorities: [...form.authorities] }
 const id = editId.value
 verify(() => {
  if (id) Object.assign(rows.value.find(r => r.id === id), values)
  else {
   const token = crypto.randomUUID()
   const row = { ...values, id: token, state: 'valid', createdDate: new Date().toLocaleString('sv-SE'), apiKey: `demo_api_${token}`, secret: `demo_secret_${crypto.randomUUID()}` }
   rows.value.unshift(row); detail.value = row
  }
  persist(); editor.value = false; ElMessage.success(id ? 'API修改成功' : 'API创建成功')
 })
}
async function remove(row) {
 try { await ElMessageBox.confirm('删除后，API将会失效，是否确认删除？', '删除API', { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }) } catch { return }
 verify(() => { rows.value = rows.value.filter(r => r.id !== row.id); persist(); ElMessage.success('API已删除') })
}
async function copy(value) { try { await navigator.clipboard.writeText(value); ElMessage.success('已复制') } catch { ElMessage.warning('复制失败，请手动选择复制') } }
</script>
<template>
 <section class="api-record api-key-records">
  <div class="records-heading"><h2>API Key记录</h2><el-button type="primary" @click="edit(null)">创建API Key</el-button></div>
  <el-table :data="rows" row-key="id" empty-text="暂无数据">
   <el-table-column prop="remarks" label="备注名" min-width="180" />
   <el-table-column label="权限" min-width="200"><template #default="{ row }">{{ authText(row) }}</template></el-table-column>
   <el-table-column label="状态" width="100"><template #default="{ row }"><span :class="{ expired: row.state === 'overdue' }">{{ row.state === 'valid' ? '有效' : '失效' }}</span></template></el-table-column>
   <el-table-column prop="createdDate" label="创建时间" min-width="190" />
   <el-table-column label="操作" width="210" fixed="right"><template #default="{ row }"><el-button link type="primary" @click="verify(() => detail = row)">查看</el-button><el-button link type="primary" @click="edit(row)">编辑</el-button><el-button link type="primary" @click="remove(row)">删除</el-button></template></el-table-column>
  </el-table>
  <el-dialog v-model="editor" :title="editId ? '编辑API' : '创建API Key'" width="456px" center destroy-on-close>
   <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="save">
    <el-form-item label="备注" prop="remarks"><el-input v-model="form.remarks" placeholder="请输入API Key备注名" /></el-form-item>
    <el-form-item label="绑定IP地址" prop="ipAddresses"><el-input v-model="form.ipAddresses" type="textarea" :rows="3" placeholder="多个IPv4地址使用英文逗号分隔，最多10个" /></el-form-item>
    <el-form-item label="权限"><el-checkbox-group v-model="form.authorities"><el-checkbox value="readonly" disabled>读取</el-checkbox><el-checkbox value="trade">交易</el-checkbox><el-checkbox value="withdraw">划转</el-checkbox></el-checkbox-group></el-form-item>
    <el-button class="full" type="primary" native-type="submit">{{ editId ? '修改' : '创建' }}</el-button>
   </el-form>
  </el-dialog>
  <el-dialog v-model="verification" title="账户验证" width="456px" center append-to-body @closed="pending = null">
   <el-form label-position="top" @submit.prevent="confirmVerification"><p>演示验证码：123456</p><el-form-item label="验证码" :error="verifyError"><el-input v-model="code" maxlength="6" placeholder="请输入验证码" /></el-form-item><el-button type="primary" class="full" native-type="submit">确认</el-button></el-form>
  </el-dialog>
  <el-dialog :model-value="!!detail" title="查看API" width="760px" center @close="detail = null">
   <div v-if="detail" class="key-details"><div><label>备注名</label><p>{{ detail.remarks }}</p><label>权限</label><p>{{ authText(detail) }}</p><label>绑定IP地址</label><p>{{ detail.ipAddresses }}</p></div><div><label>API Key</label><p>{{ detail.apiKey }} <el-button link type="primary" @click="copy(detail.apiKey)">复制</el-button></p><label>秘钥</label><p>{{ detail.secret }} <el-button link type="primary" @click="copy(detail.secret)">复制</el-button></p></div></div>
  </el-dialog>
 </section>
</template>
<style scoped>
.api-key-records { --el-color-primary: #c9a000; }
.records-heading { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.records-heading h2 { margin:0; font-size:20px; font-weight:500; }
.api-key-records :deep(.el-table) { --el-table-header-bg-color:#f4f6f9; --el-table-header-text-color:#929ba9; }
.api-key-records :deep(.el-table__cell) { padding:18px 0; }
.api-key-records :deep(.el-button--primary:not(.is-link)) { background:#f5ff18; border-color:#f5ff18; color:#151923; }
.full { width:100%; height:40px; }
.expired { color:#f56c6c; }
.key-details { display:grid; grid-template-columns:1fr 1fr; gap:40px; }
.key-details > div:first-child { border-right:1px dashed #e4e7ed; padding-right:24px; }
.key-details label { color:#929ba9; }
.key-details p { overflow-wrap:anywhere; margin:8px 0 24px; line-height:1.6; }
</style>
