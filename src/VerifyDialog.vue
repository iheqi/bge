<script setup>
// The identity check the demo puts in front of anything sensitive. 修改 API Key and 结单密码 both
// open this, so the three-field form lives here rather than in either page.
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { i18n } from './i18n'

const t = i18n.global.t
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // The heading differs per entry point; the fields never do.
  title: { type: String, default: 'apiVerifyTitle' },
})
const emit = defineEmits(['update:modelValue', 'verified'])

const codes = reactive({ sms: '', email: '', ga: '' })
const open = ref(props.modelValue)
watch(
  () => props.modelValue,
  (value) => {
    open.value = value
    // Reopening always starts from an empty form.
    if (value) Object.assign(codes, { sms: '', email: '', ga: '' })
  },
)
function close() {
  open.value = false
  emit('update:modelValue', false)
}
function sendCode(channel) {
  ElMessage.success(t('apiCodeSent', { channel }))
}
function confirm() {
  // The demo accepts any six digits per field; the point is the flow, not the codes.
  if (!/^\d{6}$/.test(codes.sms) || !/^\d{6}$/.test(codes.email) || !/^\d{6}$/.test(codes.ga)) {
    return ElMessage.warning(t('apiDemoHint'))
  }
  close()
  emit('verified')
}
</script>

<template>
  <el-dialog
    v-model="open"
    width="400px"
    align-center
    class="verify-dialog"
    @close="emit('update:modelValue', false)"
  >
    <template #header
      ><h3 class="verify-title">{{ $t(title) }}</h3></template
    >
    <div class="verify-field">
      <p>{{ $t('apiSmsLabel') }}</p>
      <label class="verify-line"
        ><input
          v-model="codes.sms"
          :placeholder="$t('apiSmsPlaceholder')"
          maxlength="6"
        /><button
          type="button"
          @click="sendCode(t('apiSmsChannel'))"
        >
          {{ $t('apiSend') }}
        </button></label
      >
    </div>
    <div class="verify-field">
      <p>{{ $t('apiEmailLabel') }}</p>
      <label class="verify-line"
        ><input
          v-model="codes.email"
          :placeholder="$t('apiEmailPlaceholder')"
          maxlength="6"
        /><button
          type="button"
          @click="sendCode(t('apiEmailChannel'))"
        >
          {{ $t('apiSend') }}
        </button></label
      >
    </div>
    <div class="verify-field">
      <p>{{ $t('apiGaLabel') }}</p>
      <label class="verify-line"
        ><input
          v-model="codes.ga"
          :placeholder="$t('apiGaLabel')"
          maxlength="6"
      /></label>
    </div>
    <div class="verify-actions">
      <button
        class="verify-cancel"
        type="button"
        @click="close"
      >
        {{ $t('text183') }}
      </button>
      <button
        class="verify-confirm"
        type="button"
        @click="confirm"
      >
        {{ $t('transferConfirm') }}
      </button>
    </div>
    <p class="verify-hint">{{ $t('apiDemoHint') }}</p>
  </el-dialog>
</template>

<style scoped>
.verify-title {
  margin: 0;
  color: #171d27;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
}
.verify-field {
  margin-bottom: 22px;
}
.verify-field p {
  margin: 0 0 10px;
  color: #3f4a56;
  font-size: 14px;
}
.verify-line {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dfe4ec;
}
.verify-line input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #303744;
  font-size: 14px;
}
.verify-line input::placeholder {
  color: #b6bcc6;
}
.verify-line button {
  padding: 0;
  border: 0;
  background: none;
  color: #d9a600;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.verify-line button:hover {
  color: #b98c00;
}
.verify-actions {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 34px;
}
.verify-cancel,
.verify-confirm {
  width: 120px;
  height: 40px;
  border: 0;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}
.verify-cancel {
  background: #eef0f5;
  color: #171d27;
}
.verify-cancel:hover {
  background: #e4e8ee;
}
.verify-confirm {
  background: #f5ff18;
  color: #111;
  font-weight: 600;
}
.verify-confirm:hover {
  background: #e8f000;
}
.verify-hint {
  margin: 16px 0 0;
  color: #9aa2ad;
  font-size: 12px;
  text-align: center;
}
</style>
