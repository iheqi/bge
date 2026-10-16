<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { i18n } from './i18n'
import { currentAccount, useAccountState } from './demoAccounts'
import VerifyDialog from './VerifyDialog.vue'

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
// The account may hold this many keys. The detail panel counts against the same number the form
// refuses to go past.
const API_KEY_LIMIT = 10
// The interface list the console groups by scenario: what a key is allowed to do reads better
// against the endpoints it opens than as the bare word 读取 or 交易.
const API_GROUPS = [
  ['apiGroupMarket', null, [
    ['GET /v1/currencies', 'apiEpCurrencies'],
    ['GET /v1/currencies/{currency}', 'apiEpCurrency'],
    ['GET /v1/products', 'apiEpProducts'],
    ['GET /v1/products/{product}', 'apiEpProduct'],
    ['GET /public/v1/products/{pair}/orderbook', 'apiEpOrderbook'],
    ['GET /public/v1/products/{pair}/ticker', 'apiEpTicker'],
    ['GET /public/v1/products/{pair}/trades', 'apiEpTrades'],
    ['GET /public/v1/products/{pair}/candles', 'apiEpCandles'],
  ]],
  ['apiGroupAccount', 'readonly', [
    ['GET /v1/accounts', 'apiEpAccounts'],
    ['GET /v1/accounts/{currency}', 'apiEpAccount'],
  ]],
  ['apiGroupOrder', 'readonly', [
    ['GET /v1/orders', 'apiEpOrders'],
    ['GET /v1/orders/{order_id}', 'apiEpOrder'],
    ['GET /v1/orders/single/{client_oid}', 'apiEpOrderByClientId'],
    ['GET /v1/fills', 'apiEpFills'],
  ]],
  ['apiGroupTrade', 'trade', [
    ['POST /v1/orders', 'apiEpCreateOrder'],
    ['DELETE /v1/orders/{order_id}', 'apiEpCancelOrder'],
    ['DELETE /v1/orders/single/{client_oid}', 'apiEpCancelByClientId'],
    ['DELETE /v1/orders', 'apiEpCancelAll'],
  ]],
  ['apiGroupTransfer', 'withdraw', [
    ['POST /v1/deposits/account', 'apiEpFundingIn'],
    ['POST /v1/withdrawals/account', 'apiEpFundingOut'],
  ]],
]
const permitTree = computed(() =>
  API_GROUPS.map(([groupKey, perm, endpoints]) => ({
    id: groupKey,
    label: t(groupKey),
    perm,
    children: endpoints.map(([path, labelKey]) => ({
      id: `${groupKey}:${path}`,
      label: t(labelKey),
      path,
      perm,
    })),
  })),
)
// Every group starts open, and the endpoints a key may call start ticked: the public ones need no
// permission, the rest are ticked when the key holds what the group asks for.
const permitExpanded = API_GROUPS.map(([groupKey]) => groupKey)
const permitChecked = computed(() =>
  permitTree.value
    .filter((group) => !group.perm || (detail.value?.authorities ?? []).includes(group.perm))
    .flatMap((group) => group.children.map((child) => child.id)),
)

const verification = ref(false)
const editId = ref(null)
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
  if (!row && rows.value.length >= API_KEY_LIMIT) return ElMessage.warning(t('apiLimit'))
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
// The three-field identity check lives in VerifyDialog; this page only remembers what to run once
// it passes.
function verify(action) {
  pending = action
  verification.value = true
}
function runPending() {
  const action = pending
  pending = null
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
  const now = new Date().toLocaleString('sv-SE')
  verify(() => {
    if (id) {
      Object.assign(
        rows.value.find((row) => row.id === id),
        values,
        // Touching the key — rights, remarks or IPs — is what 最近修改 records.
        { updatedDate: now },
      )
    } else {
      const token = crypto.randomUUID()
      const row = {
        ...values,
        id: token,
        // A key created through the demo form is valid, unbound and carries no risk flag yet.
        state: 'valid',
        createdDate: now,
        updatedDate: now,
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

    <VerifyDialog
      v-model="verification"
      @verified="runPending"
    />

    <el-dialog
      :model-value="!!detail"
      :title="$t('apiViewTitle')"
      width="760px"
      center
      @close="detail = null"
    >
      <div
        v-if="detail"
        class="key-detail"
      >
        <h4 class="key-detail-title">{{ $t('apiDetailBasic') }}</h4>
        <el-descriptions
          class="key-detail-basic"
          :column="2"
          border
        >
          <el-descriptions-item :label="$t('apiRemarkColumn')">
            {{ detail.remarks }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('text063')">
            <em :class="'api-state api-state-' + detail.state">{{ $t(stateKey(detail)) }}</em>
          </el-descriptions-item>
          <!-- The detail panel shows the same masked key as the list: the secret stays out of it. -->
          <el-descriptions-item
            :label="$t('apiKeyColumn')"
            :span="2"
          >
            <span class="api-masked-key">{{ maskKey(detail.apiKey) }}</span>
            <span class="key-detail-note">{{ $t('apiSecretNote') }}</span>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('apiPermissions')">
            {{ authText(detail) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('apiIpBinding')">
            {{ detail.ipAddresses || $t('apiIpUnbound') }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('text064')">
            {{ detail.createdDate }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('apiLastUpdated')">
            {{ detail.updatedDate || '—' }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('apiExpiry')">
            {{ $t(detail.ipAddresses ? 'apiExpiryBound' : 'apiExpiryUnbound') }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('apiKeyCount')">
            {{ rows.length }} / {{ API_KEY_LIMIT }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('apiRisk')"
            :span="2"
          >
            {{ (detail.risk ?? []).length ? riskText(detail) : '—' }}
          </el-descriptions-item>
        </el-descriptions>

        <h4 class="key-detail-title">{{ $t('apiDetailPerms') }}</h4>
        <p class="key-detail-caption">{{ $t('apiPermCaption') }}</p>
        <el-tree
          :key="detail.id"
          class="api-tree"
          :data="permitTree"
          node-key="id"
          show-checkbox
          :default-expanded-keys="permitExpanded"
          :default-checked-keys="permitChecked"
          :props="{ disabled: () => true }"
        >
          <template #default="{ data }">
            <span class="api-tree-node">
              <span class="api-tree-label">{{ data.label }}</span>
              <code
                v-if="data.path"
                class="api-tree-path"
                >{{ data.path }}</code
              >
              <!-- The permission a group asks for sits on the group: every interface under it needs the same one. -->
              <span
                v-if="!data.path"
                :class="'api-tree-tag api-tree-tag-' + (data.perm ? 'need' : 'public')"
              >
                {{
                  data.perm
                    ? $t('apiPermNeed', { name: t(authNames[data.perm]) })
                    : $t('apiPermPublic')
                }}
              </span>
            </span>
          </template>
        </el-tree>
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
/* Detail dialog: 基本信息 as a bordered description grid, 接口权限 as a read-only tree. */
.key-detail-title{margin:0 0 16px;padding-left:10px;border-left:4px solid #ffd52a;color:#303744;font-size:15px;font-weight:600}
.key-detail-basic{margin-bottom:28px}
.key-detail-basic :deep(.el-descriptions__label){width:112px;background:#f4f6f9;color:#697585;font-weight:400}
.key-detail-basic :deep(.el-descriptions__content){color:#303744;font-size:14px;overflow-wrap:anywhere}
.key-detail-note{margin-left:12px;color:#929ba9;font-size:12px}
.key-detail-caption{margin:-8px 0 14px;color:#929ba9;font-size:13px;line-height:1.7}
/* Five groups with twenty interfaces would outgrow the dialog, so the tree scrolls inside it. */
.api-tree{max-height:400px;overflow:auto;padding-right:6px}
.api-tree :deep(.el-tree-node__content){height:34px}
.api-tree :deep(.el-checkbox__inner){border-color:#dfe4ec}
.api-tree :deep(.el-checkbox__input.is-checked .el-checkbox__inner),
.api-tree :deep(.el-checkbox__input.is-checked.is-disabled .el-checkbox__inner){border-color:#f0d000;background:#f0d000}
.api-tree :deep(.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after){border-color:#fff}
.api-tree-node{display:flex;flex:1;align-items:center;gap:12px;min-width:0}
.api-tree-label{color:#303744}
.api-tree-path{color:#929ba9;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}
.api-tree-tag{margin-left:auto;padding:1px 8px;border-radius:4px;font-size:12px;white-space:nowrap}
.api-tree-tag-public{background:#f0f2f5;color:#8a93a0}
.api-tree-tag-need{background:#fff8dc;color:#b98c00}
@media (max-width:1200px){.api-columns{flex-direction:column;gap:24px;align-items:stretch}.api-notes{width:100%;flex:1 1 auto;padding-left:0;border-left:0}.api-form{max-width:none}}
</style>
