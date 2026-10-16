<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { i18n } from './i18n'
import { currentAccount, useAccountState } from './demoAccounts'

const t = (key, params) => i18n.global.t(key, params)
// The key list is editable, so it is stored per demo account on top of that account's seed rows.
const rows = useAccountState('api-records', currentAccount.value.apiKeys)

const authNames = { readonly: 'apiRead', trade: 'apiTrade', withdraw: 'text309' }
const authText = (row) => (row.authorities ?? []).map((a) => t(authNames[a])).join('+')
const stateKeys = { valid: 'apiValid', expired: 'statusExpired', revoked: 'apiStateRevoked' }
const stateKey = (row) => stateKeys[row.state] ?? 'apiInvalid'
// The list never shows a whole key; the head and the tail are enough to tell two keys apart.
const maskKey = (apiKey) => `${apiKey.slice(0, 8)}****${apiKey.slice(-4)}`
const riskText = (row) => (row.risk ?? []).map((key) => t(key)).join('、')

const detail = ref(null)
const verification = ref(false)
const editId = ref(null)
const codes = reactive({ sms: '', email: '', ga: '' })
const formRef = ref()
const form = reactive({ remarks: '', ipAddresses: '', authorities: ['readonly'] })
let pending = null
const rules = {
  remarks: [
    {
      validator: (_, value, done) =>
        done(value.trim() ? undefined : new Error(t('apiRemarkRequired'))),
      trigger: 'blur',
    },
  ],
  // Binding an IP is optional: an empty field is what the list shows as 免绑.
  ipAddresses: [
    {
      validator: (_, value, done) => {
        const ips = value
          .split(/[,\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
        const valid = ips.every(
          (ip) => /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every((n) => Number(n) <= 255),
        )
        done(
          !valid ? new Error(t('apiIpInvalid')) : ips.length > 10 ? new Error(t('apiIpLimit')) : undefined,
        )
      },
      trigger: 'blur',
    },
  ],
}
function edit(row) {
  if (!row && rows.value.length >= 10) return ElMessage.warning(t('apiLimit'))
  editId.value = row?.id ?? null
  Object.assign(form, {
    remarks: row?.remarks ?? '',
    ipAddresses: row?.ipAddresses ?? '',
    authorities: [...(row?.authorities ?? ['readonly'])],
  })
  formRef.value?.clearValidate()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function resetForm() {
  editId.value = null
  Object.assign(form, { remarks: '', ipAddresses: '', authorities: ['readonly'] })
  formRef.value?.clearValidate()
}
function verify(action) {
  pending = action
  Object.assign(codes, { sms: '', email: '', ga: '' })
  verification.value = true
}
function sendCode(channel) {
  ElMessage.success(t('apiCodeSent', { channel }))
}
function confirmVerification() {
  if (!/^\d{6}$/.test(codes.sms) || !/^\d{6}$/.test(codes.email) || !/^\d{6}$/.test(codes.ga)) {
    return ElMessage.warning(t('apiDemoHint'))
  }
  const action = pending
  pending = null
  verification.value = false
  action?.()
}
async function save() {
  if (!(await formRef.value.validate().catch(() => false))) return
  const values = {
    remarks: form.remarks.trim(),
    ipAddresses: form.ipAddresses
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(','),
    authorities: [...form.authorities],
  }
  const id = editId.value
  verify(() => {
    if (id) {
      Object.assign(
        rows.value.find((row) => row.id === id),
        values,
      )
    } else {
      const token = crypto.randomUUID()
      const row = {
        ...values,
        id: token,
        // A key created through the demo form is valid, unbound and carries no risk flag yet.
        state: 'valid',
        createdDate: new Date().toLocaleString('sv-SE'),
        apiKey: `dccb2137${token.replace(/-/g, '').slice(0, 20)}8fee`,
        secret: `demo_secret_${crypto.randomUUID()}`,
        risk: [],
      }
      rows.value.unshift(row)
      detail.value = row
    }
    resetForm()
    ElMessage.success(t(id ? 'apiUpdated' : 'apiCreated'))
  })
}
async function remove(row) {
  try {
    await ElMessageBox.confirm(t('apiDeleteConfirm'), t('apiDeleteTitle'), {
      confirmButtonText: t('apiConfirm'),
      cancelButtonText: t('text183'),
      type: 'warning',
    })
  } catch {
    return
  }
  verify(() => {
    rows.value = rows.value.filter((r) => r.id !== row.id)
    ElMessage.success(t('apiDeleted'))
  })
}
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value)
    ElMessage.success(t('apiCopied'))
  } catch {
    ElMessage.warning(t('apiCopyFailed'))
  }
}
</script>
<template>
  <section class="api-record api-key-records">
    <div class="api-head">
      <h2 class="api-bar-title">{{ $t('text051') }}</h2>
      <a class="api-doc-link">{{ $t('text052') }}</a>
    </div>
    <div class="api-columns">
      <el-form
        ref="formRef"
        class="api-form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="save"
      >
        <el-form-item
          :label="$t('apiRemark')"
          prop="remarks"
          required
        >
          <el-input
            v-model="form.remarks"
            :placeholder="$t('apiRemarkPlaceholder')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('apiBindIp')"
          prop="ipAddresses"
        >
          <el-input
            v-model="form.ipAddresses"
            type="textarea"
            :rows="3"
            :placeholder="$t('apiBindIpPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('apiPermissions')">
          <el-checkbox-group v-model="form.authorities">
            <el-checkbox
              value="readonly"
              disabled
              >{{ $t('apiRead') }}</el-checkbox
            ><el-checkbox value="trade">{{ $t('apiTrade') }}</el-checkbox
            ><el-checkbox value="withdraw">{{ $t('text309') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <button
          class="api-submit"
          type="submit"
        >
          {{ editId ? $t('apiModify') : $t('apiCreateBtn') }}
        </button>
        <a
          v-if="editId"
          class="api-cancel-edit"
          @click="resetForm"
          >{{ $t('apiCancelEdit') }}</a
        >
      </el-form>
      <div class="api-notes">
        <h3>{{ $t('text053') }}</h3>
        <div class="api-notes-box">
          <p>{{ $t('text054') }}</p>
          <p>{{ $t('text055') }}</p>
          <p>{{ $t('text056') }}</p>
          <p>{{ $t('text057') }}</p>
          <p>{{ $t('text058') }}<a>{{ $t('text059') }}</a></p>
        </div>
      </div>
    </div>

    <h2 class="api-bar-title api-record-title">{{ $t('apiRecordsTitle') }}</h2>
    <el-table
      :data="rows"
      row-key="id"
      :empty-text="$t('text066')"
      :header-cell-style="{ background: '#f4f6f9', color: '#697585', fontWeight: '400' }"
    >
      <el-table-column
        prop="remarks"
        :label="$t('apiRemarkColumn')"
        min-width="150"
      />
      <el-table-column
        :label="$t('apiKeyColumn')"
        min-width="170"
      ><template #default="{ row }"><span class="api-masked-key">{{ maskKey(row.apiKey) }}</span></template></el-table-column>
      <el-table-column
        :label="$t('apiPermissions')"
        min-width="150"
      ><template #default="{ row }">{{ authText(row) }}</template></el-table-column>
      <el-table-column
        :label="$t('apiIpBinding')"
        min-width="130"
      ><template #default="{ row }">{{ row.ipAddresses || $t('apiIpUnbound') }}</template></el-table-column>
      <el-table-column
        :label="$t('text063')"
        width="110"
      ><template #default="{ row }"><em :class="'api-state api-state-' + row.state">{{ $t(stateKey(row)) }}</em></template></el-table-column>
      <el-table-column
        :label="$t('apiRisk')"
        min-width="180"
      ><template #default="{ row }">{{ (row.risk ?? []).length ? riskText(row) : '—' }}</template></el-table-column>
      <el-table-column
        :label="$t('text065')"
        width="240"
        fixed="right"
      ><template #default="{ row }"><el-button
        link
        class="api-action"
        @click="verify(() => (detail = row))"
        >{{ $t('apiView') }}</el-button
      ><el-button
        link
        class="api-action"
        @click="edit(row)"
        >{{ $t('apiEdit') }}</el-button
      ><el-button
        link
        class="api-action api-danger"
        @click="remove(row)"
        >{{ $t('text182') }}</el-button></template></el-table-column>
    </el-table>

    <el-dialog
      v-model="verification"
      width="400px"
      align-center
      class="verify-dialog"
      @closed="pending = null"
    >
      <template #header><h3 class="verify-title">{{ $t('apiVerifyTitle') }}</h3></template>
      <div class="verify-field">
        <p>{{ $t('apiSmsLabel') }}</p>
        <label class="verify-line"><input
          v-model="codes.sms"
          :placeholder="$t('apiSmsPlaceholder')"
          maxlength="6"
        /><button
          type="button"
          @click="sendCode(t('apiSmsChannel'))"
        >
          {{ $t('apiSend') }}
        </button></label>
      </div>
      <div class="verify-field">
        <p>{{ $t('apiEmailLabel') }}</p>
        <label class="verify-line"><input
          v-model="codes.email"
          :placeholder="$t('apiEmailPlaceholder')"
          maxlength="6"
        /><button
          type="button"
          @click="sendCode(t('apiEmailChannel'))"
        >
          {{ $t('apiSend') }}
        </button></label>
      </div>
      <div class="verify-field">
        <p>{{ $t('apiGaLabel') }}</p>
        <label class="verify-line"><input
          v-model="codes.ga"
          :placeholder="$t('apiGaLabel')"
          maxlength="6"
        /></label>
      </div>
      <div class="verify-actions">
        <button
          class="verify-cancel"
          type="button"
          @click="verification = false"
        >
          {{ $t('text183') }}
        </button>
        <button
          class="verify-confirm"
          type="button"
          @click="confirmVerification"
        >
          {{ $t('transferConfirm') }}
        </button>
      </div>
      <p class="verify-hint">{{ $t('apiDemoHint') }}</p>
    </el-dialog>

    <el-dialog
      :model-value="!!detail"
      :title="$t('apiViewTitle')"
      width="760px"
      center
      @close="detail = null"
    >
      <div
        v-if="detail"
        class="key-details"
      >
        <div>
          <label>{{ $t('apiRemarkColumn') }}</label>
          <p>{{ detail.remarks }}</p>
          <label>{{ $t('apiPermissions') }}</label>
          <p>{{ authText(detail) }}</p>
          <label>{{ $t('apiIpBinding') }}</label>
          <p>{{ detail.ipAddresses || $t('apiIpUnbound') }}</p>
        </div>
        <div>
          <label>API Key</label>
          <p>
            {{ detail.apiKey }}
            <el-button
              link
              class="api-action"
              @click="copy(detail.apiKey)"
              >{{ $t('depCopy') }}</el-button
            >
          </p>
          <label>{{ $t('apiSecret') }}</label>
          <p>
            {{ detail.secret }}
            <el-button
              link
              class="api-action"
              @click="copy(detail.secret)"
              >{{ $t('depCopy') }}</el-button
            >
          </p>
        </div>
      </div>
    </el-dialog>
  </section>
</template>
<style scoped>
.api-key-records{--el-color-primary:#c9a000}
.api-head{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:30px}
.api-bar-title{margin:0;padding-left:12px;border-left:8px solid #ffd52a;color:#171d27;font-size:22px;font-weight:600}
.api-doc-link{color:#d9a600;text-decoration:none;font-size:14px;cursor:pointer}
.api-doc-link:hover{color:#b98c00}
.api-columns{display:flex;gap:48px;align-items:flex-start}
.api-form{flex:1;min-width:0;max-width:775px}
.api-form :deep(.el-form-item__label){color:#303744;font-size:15px;line-height:1.4;padding-bottom:6px}
.api-form :deep(.el-form-item__label:before){color:#e0443a}
.api-form :deep(.el-input__wrapper),.api-form :deep(.el-textarea__inner){border-radius:4px;box-shadow:0 0 0 1px #dfe4ec inset}
.api-form :deep(.el-input__wrapper){min-height:46px}
.api-form :deep(.el-textarea__inner){padding:12px 14px;line-height:1.7}
.api-form :deep(.el-form-item){margin-bottom:26px}
.api-form :deep(.el-checkbox){margin-right:28px;color:#505967}
.api-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
.api-form :deep(.el-checkbox__input.is-checked.is-disabled .el-checkbox__inner){border-color:#f0d000;background:#f0d000}
.api-form :deep(.el-checkbox__input.is-checked + .el-checkbox__label){color:#303744}
.api-submit{width:100%;height:48px;margin-top:6px;border:0;border-radius:4px;background:#f5ff18;color:#111;font-size:16px;font-weight:600;cursor:pointer}
.api-submit:hover{background:#e8f000}
.api-cancel-edit{display:block;margin-top:14px;color:#d9a600;font-size:13px;text-align:center;cursor:pointer}
.api-notes{width:340px;flex:0 0 340px;padding-left:44px;border-left:1px solid #edf0f4;align-self:stretch}
.api-notes h3{margin:0 0 16px;color:#303744;font-size:16px;font-weight:600}
.api-notes-box{padding:20px;background:#f4f7fa}
.api-notes-box p{margin:0 0 10px;color:#6f7783;font-size:13px;line-height:1.9}
.api-notes-box p:last-child{margin-bottom:0}
.api-notes-box a{margin-left:6px;color:#d9a600;text-decoration:none}
.api-record-title{margin:56px 0 20px}
.api-key-records :deep(.el-table){font-size:14px}
.api-key-records :deep(.el-table__cell){padding:16px 0}
.api-masked-key{color:#303744;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
/* 状态 reads as a chip, the way the key list does elsewhere in the console. */
.api-state{display:inline-block;padding:2px 10px;border-radius:4px;font-size:13px;font-style:normal}
.api-state-valid{background:#e8f7ec;color:#2f9e5c}
.api-state-expired,.api-state-revoked{background:#f0f2f5;color:#8a93a0}
.api-action{color:#d9a600;font-size:14px}
.api-action:hover{color:#b98c00}
.api-danger{color:#e0443a}
.api-danger:hover{color:#c2352c}
.verify-title{margin:0;color:#171d27;font-size:20px;font-weight:500;text-align:center}
.verify-field{margin-bottom:22px}
.verify-field p{margin:0 0 10px;color:#3f4a56;font-size:14px}
.verify-line{display:flex;align-items:center;gap:16px;padding-bottom:10px;border-bottom:1px solid #dfe4ec}
.verify-line input{flex:1;min-width:0;border:0;outline:none;background:transparent;color:#303744;font-size:14px}
.verify-line input::placeholder{color:#b6bcc6}
.verify-line button{padding:0;border:0;background:none;color:#d9a600;font-size:14px;cursor:pointer;white-space:nowrap}
.verify-line button:hover{color:#b98c00}
.verify-actions{display:flex;justify-content:center;gap:48px;margin-top:34px}
.verify-cancel,.verify-confirm{width:120px;height:40px;border:0;border-radius:4px;font-size:15px;cursor:pointer}
.verify-cancel{background:#eef0f5;color:#171d27}
.verify-cancel:hover{background:#e4e8ee}
.verify-confirm{background:#f5ff18;color:#111;font-weight:600}
.verify-confirm:hover{background:#e8f000}
.verify-hint{margin:16px 0 0;color:#9aa2ad;font-size:12px;text-align:center}
.key-details{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.key-details > div:first-child{border-right:1px dashed #e4e7ed;padding-right:24px}
.key-details label{color:#929ba9}
.key-details p{overflow-wrap:anywhere;margin:8px 0 24px;line-height:1.6}
@media (max-width:1200px){.api-columns{flex-direction:column;gap:24px;align-items:stretch}.api-notes{width:100%;flex:1 1 auto;padding-left:0;border-left:0}.api-form{max-width:none}}
</style>
