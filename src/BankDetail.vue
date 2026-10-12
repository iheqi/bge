<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { i18n, tr } from './i18n'
// Fiat currencies the bank card can be used for; ADS/DSz are the demo placeholders of the design.
const currencies = [
  { code: 'USD', name: '美元' },
  { code: 'HKD', name: '港币' },
  { code: 'ADS', name: 'ADS' },
  { code: 'DSz', name: 'test' },
]
const usages = ['both', 'deposit', 'withdraw']
const usageKeys = { both: 'text375', deposit: 'text376', withdraw: 'text377' }
// ?type=add opens the empty form, ?type=edit prefills the stored card (from the 编辑 action).
const editMode = new URLSearchParams(window.location.search).get('type') === 'edit'
const titleKey = editMode ? 'text389' : 'text364'
const submitKey = editMode ? 'text390' : 'text383'
const confirmTitleKey = editMode ? 'text391' : 'text388'
// usage stays empty until a currency is picked, so the design's unchecked rows render as-is.
const rows = ref(currencies.map((currency) => ({ ...currency, on: false, usage: '' })))
const form = ref({ account: '', name: '', branch: '', swift: '', tag: '' })
const tab = ref('card')
const preview = ref('')
const fileInput = ref(null)
const confirming = ref(false)
const chosen = computed(() => rows.value.filter((row) => row.on))
const summary = computed(() =>
  [
    { key: 'text392', value: form.value.account },
    { key: 'text273', value: form.value.name },
    ...(form.value.tag ? [{ key: 'text393', value: form.value.tag }] : []),
  ].filter((item) => item.value),
)
const stored = JSON.parse(localStorage.getItem('bge-bank-record') || 'null')
if (editMode && stored) {
  form.value = {
    account: stored.account || '',
    name: stored.name || '',
    branch: stored.branch || '',
    swift: stored.swift || '',
    tag: stored.tag || '',
  }
  rows.value.forEach((row) => {
    const card = (stored.cards || []).find((item) => item.code === row.code)
    if (card) {
      row.on = true
      row.usage = card.usage || 'both'
    }
  })
}

function toggleRow(row, value) {
  row.on = value
  row.usage = value ? row.usage || 'both' : ''
}
function pick() {
  fileInput.value?.click()
}
function readFile(file) {
  if (file?.type.startsWith('image/')) preview.value = URL.createObjectURL(file)
}
function choose(event) {
  readFile(event.target.files?.[0])
}
function drop(event) {
  readFile(event.dataTransfer?.files?.[0])
}
function back() {
  window.location.href = '/bge/hk/zh-CN/user/payment/fiat'
}
function submit() {
  if (!chosen.value.length) return ElMessage.warning(i18n.global.t('text384'))
  if (!form.value.account.trim() || !form.value.name.trim())
    return ElMessage.warning(i18n.global.t('text385'))
  confirming.value = true
}
function save() {
  // Stored locally so the fiat page can list the card; the backend call replaces this later.
  localStorage.setItem(
    'bge-bank-record',
    JSON.stringify({
      ...form.value,
      cards: chosen.value.map((row) => ({ code: row.code, usage: row.usage })),
    }),
  )
  ElMessage.success(i18n.global.t('text386'))
  back()
}
</script>

<template>
  <section class="bank-detail">
    <div class="bank-breadcrumb">
      <b>{{ $t('text011') }}</b><span>/</span><b>{{ $t('text268') }}</b
      ><span>/</span><span>{{ $t(titleKey) }}</span>
    </div>

    <div class="bank-field">
      <p>{{ $t('text272') }}<i>*</i><em>{{ $t('text365') }}</em></p>
      <input
        v-model="form.account"
        :placeholder="$t('text366')"
      />
    </div>
    <div class="bank-field">
      <p>{{ $t('text273') }}</p>
      <input
        v-model="form.name"
        :placeholder="$t('text367')"
      />
    </div>
    <div class="bank-field">
      <p>{{ $t('text368') }}</p>
      <input
        v-model="form.branch"
        :placeholder="$t('text369')"
      />
    </div>
    <div class="bank-field">
      <p>{{ $t('text370') }}</p>
      <input
        v-model="form.swift"
        :placeholder="$t('text371')"
      />
    </div>
    <div class="bank-field">
      <p>{{ $t('text372') }}</p>
      <input
        v-model="form.tag"
        :placeholder="$t('text373')"
      />
    </div>

    <section class="bank-section">
      <h3>{{ $t('text374') }}</h3>
      <div
        v-for="row in rows"
        :key="row.code"
        class="bank-currency"
      >
        <el-checkbox
          :model-value="row.on"
          @change="toggleRow(row, $event)"
        />
        <span
          class="bank-coin"
          aria-hidden="true"
        ></span>
        <b class="bank-code">{{ row.code }}</b>
        <span class="bank-name">{{ tr(row.name) }}</span>
        <el-radio-group
          v-model="row.usage"
          class="bank-usage"
          @change="row.on = true"
        >
          <el-radio
            v-for="usage in usages"
            :key="usage"
            :value="usage"
            >{{ $t(usageKeys[usage]) }}</el-radio
          >
        </el-radio-group>
      </div>
    </section>

    <section class="bank-section">
      <h3>{{ $t('text378') }}</h3>
      <div class="bank-tabs">
        <button
          type="button"
          :class="{ active: tab === 'card' }"
          @click="tab = 'card'"
        >
          {{ $t('text379') }}
        </button>
        <button
          type="button"
          :class="{ active: tab === 'sample' }"
          @click="tab = 'sample'"
        >
          {{ $t('text380') }}
        </button>
      </div>
      <div
        v-if="tab === 'card'"
        class="bank-drop"
        @click="pick"
        @dragover.prevent
        @drop.prevent="drop"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @click.stop
          @change="choose"
        />
        <img
          v-if="preview"
          :src="preview"
          alt=""
        />
        <template v-else>
          <el-icon><UploadFilled /></el-icon>
          <p>{{ $t('text381') }}<br /><em>{{ $t('text382') }}</em></p>
        </template>
      </div>
      <div
        v-else
        class="bank-sample"
        aria-hidden="true"
      >
        <i></i><p>{{ $t('text380') }}</p>
      </div>
    </section>

    <div class="bank-actions">
      <button
        type="button"
        class="cancel"
        @click="back"
      >
        {{ $t('text183') }}
      </button>
      <button
        type="button"
        class="primary"
        @click="submit"
      >
        {{ $t(submitKey) }}
      </button>
    </div>

    <div
      v-if="confirming"
      class="payment-modal-mask"
    >
      <section class="payment-modal">
        <button
          type="button"
          class="payment-modal-close"
          :aria-label="$t('text183')"
          @click="confirming = false"
        >
          ×
        </button>
        <h2>{{ $t(confirmTitleKey) }}</h2>
        <dl class="payment-modal-summary">
          <div
            v-for="item in summary"
            :key="item.key"
          >
            <dt>{{ $t(item.key) }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
          <div>
            <dt>{{ $t('text394') }}</dt>
            <dd class="payment-modal-currencies">
              <span
                v-for="row in chosen"
                :key="row.code"
                >{{ row.code }}({{ $t(usageKeys[row.usage]) }})</span
              >
            </dd>
          </div>
        </dl>
        <div class="payment-modal-actions">
          <button
            type="button"
            class="secondary"
            @click="confirming = false"
          >
            {{ $t('text183') }}
          </button>
          <button
            type="button"
            class="primary"
            @click="save"
          >
            {{ $t('text395') }}
          </button>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.bank-detail {
  --el-color-primary: #f0d000;
  padding-bottom: 40px;
  color: #303744;
}
.bank-breadcrumb {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 44px;
  color: #9aa3af;
  font-size: 14px;
}
.bank-breadcrumb b {
  color: #171d27;
  font-weight: 500;
}
.bank-field {
  margin-bottom: 18px;
}
.bank-field p {
  margin: 0 0 14px;
  color: #171d27;
  font-size: 16px;
  line-height: 22px;
}
.bank-field i {
  margin-left: 8px;
  color: #f56c6c;
  font-style: normal;
}
.bank-field em {
  color: #f56c6c;
  font-size: 12px;
  font-style: normal;
}
.bank-field input {
  width: 580px;
  max-width: 100%;
  height: 60px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #d7dae2;
  background: transparent;
  color: #303744;
  font-size: 14px;
  outline: 0;
}
.bank-field input::placeholder {
  color: #c0c4cc;
}
.bank-field input:focus {
  border-bottom-color: #f0d000;
}
.bank-section {
  margin-top: 36px;
}
.bank-section h3 {
  margin: 0 0 24px;
  color: #171d27;
  font-size: 16px;
  font-weight: 600;
}
.bank-currency {
  display: flex;
  align-items: center;
  width: 580px;
  max-width: 100%;
  height: 40px;
  font-size: 14px;
}
.bank-currency :deep(.el-checkbox) {
  height: auto;
  margin-right: 11px;
}
.bank-coin {
  width: 24px;
  height: 24px;
  margin-right: 9px;
  border-radius: 50%;
  background: #f2f4f8;
}
.bank-code {
  margin-right: 10px;
  color: #1d1d1d;
  font-weight: 600;
}
.bank-name {
  color: #b0b6c0;
}
.bank-usage {
  display: flex;
  gap: 30px;
  margin-left: auto;
  height: auto;
}
.bank-usage :deep(.el-radio) {
  height: auto;
  margin-right: 0;
}
.bank-usage :deep(.el-radio__label) {
  padding-left: 11px;
  color: #303744;
  font-size: 14px;
}
.bank-tabs {
  display: flex;
}
.bank-tabs button {
  width: 120px;
  height: 32px;
  border: 0;
  background: #eaedf3;
  color: #303744;
  font-size: 14px;
  cursor: pointer;
}
.bank-tabs button:first-child {
  border-radius: 4px 0 0 4px;
}
.bank-tabs button:last-child {
  border-radius: 0 4px 4px 0;
}
.bank-tabs button.active {
  background: #f5ff18;
}
.bank-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  margin-top: 39px;
  border: 1px dashed #d4d4d4;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
}
.bank-drop input[type='file'] {
  display: none;
}
.bank-drop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bank-drop .el-icon {
  color: #c8ccd4;
  font-size: 26px;
}
.bank-drop p {
  margin: 2px 0 0;
  color: #9aa3af;
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
}
.bank-drop em {
  color: #d9a600;
  font-style: normal;
}
.bank-sample {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 39px;
}
.bank-sample i {
  display: block;
  width: 230px;
  height: 145px;
  border: 1px solid #e4e8ee;
  border-radius: 8px;
  background: linear-gradient(#f7f9fc 0 34%, #fff 34%);
  position: relative;
}
.bank-sample i::after {
  content: '';
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 90px;
  height: 8px;
  border-radius: 4px;
  background: #eef1f5;
}
.bank-sample p {
  margin: 0;
  color: #9aa3af;
  font-size: 12px;
}
.bank-actions {
  display: flex;
  gap: 11px;
  margin-top: 69px;
}
.bank-actions button {
  width: 118px;
  height: 40px;
  border: 0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.bank-actions .cancel {
  background: #eaedf3;
  color: #303744;
}
.bank-actions .primary {
  background: #f5ff18;
  color: #111;
}
</style>
