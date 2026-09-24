<script setup>
import { computed, ref } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { tr, i18n } from './i18n'
import { messages, unreadCount, markRead } from './messages'
const open = ref(false)
const category = ref('all')
const categories = [
  { id: 'all', label: '全部', value: null },
  { id: 'system', label: '系统', value: '系统消息' },
  { id: 'wallet', label: '充提', value: '充值提现' },
  { id: 'security', label: '安全', value: '安全消息' },
]
const visibleMessages = computed(() => {
  const value = categories.find((item) => item.id === category.value).value
  return messages.value.filter((message) => !value || message.category === value)
})
const icons = {
  系统消息: '📣',
  充值提现: '💰',
  安全消息: '🔒',
  认证消息: '🪪',
  场外消息: '🤝',
  活动消息: '🎁',
}
function readAll() {
  messages.value.forEach((message) => markRead(message.id))
}
function relativeTime(value) {
  const minutes = Math.floor((Date.now() - new Date(value.replace(' ', 'T')).getTime()) / 60000)
  if (!Number.isFinite(minutes)) return value
  if (minutes < 1) return tr('刚刚')
  const suffix =
    minutes < 60
      ? '{count}分钟前'
      : minutes < 1440
        ? '{count}小时前'
        : minutes < 10080
          ? '{count}天前'
          : null
  if (minutes >= 1440 && minutes < 2880) return tr('昨天')
  if (!suffix) return value.slice(0, 10)
  const count =
    minutes < 60 ? minutes : minutes < 1440 ? Math.floor(minutes / 60) : Math.floor(minutes / 1440)
  const keys = { '{count}分钟前': 'text361', '{count}小时前': 'text362', '{count}天前': 'text363' }
  return i18n.global.t(keys[suffix], { count })
}
function leave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) open.value = false
}
</script>
<template>
  <div
    class="message-bell"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusin="open = true"
    @focusout="leave"
    @keydown.esc="open = false"
  >
    <button
      class="message-trigger"
      :aria-label="tr('消息中心')"
      :aria-expanded="open"
      aria-controls="message-preview"
      :title="tr('消息中心')"
      @click="open = !open"
    >
      <el-icon :size="20"><Bell /></el-icon
      ><span
        v-if="unreadCount"
        class="message-dot"
      />
    </button>
    <div
      v-show="open"
      id="message-preview"
      class="message-preview"
    >
      <div class="preview-toolbar">
        <button
          type="button"
          :disabled="!unreadCount"
          @click="readAll"
        >
          {{ tr('全部已读') }}
        </button>
      </div>
      <div
        class="preview-tabs"
        :aria-label="tr('消息分类')"
      >
        <button
          v-for="item in categories"
          :key="item.id"
          type="button"
          :class="{ selected: category === item.id }"
          :aria-pressed="category === item.id"
          @click="category = item.id"
        >
          {{ tr(item.label) }}
        </button>
      </div>
      <div class="preview-body">
        <a
          v-for="message in visibleMessages"
          :key="message.id"
          class="preview-message"
          :class="{ unread: !message.read }"
          href="/bge/hk/zh-CN/user/messages"
          @click="markRead(message.id)"
          ><span
            class="preview-icon"
            :class="{ 'security-icon': message.category === '安全消息' }"
            aria-hidden="true"
            >{{ icons[message.category] || '🔔' }}</span
          >
          <div class="preview-copy">
            <strong>{{ tr(message.title || message.category) }}</strong>
            <p :title="tr(message.text)">{{ tr(message.text) }}</p>
            <time :datetime="message.date.replace(' ', 'T')">{{ relativeTime(message.date) }}</time>
          </div></a
        >
        <p
          v-if="!visibleMessages.length"
          class="preview-empty"
        >
          {{ tr('暂无消息') }}
        </p>
      </div>
      <a
        class="preview-more"
        href="/bge/hk/zh-CN/user/messages"
        >{{ tr('查看全部消息 →') }}</a
      >
    </div>
  </div>
</template>
<style scoped>
.message-bell {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  z-index: 30;
}
.message-trigger {
  position: relative;
  display: grid;
  place-items: center;
  width: 30px;
  height: 32px;
  border: 0;
  background: transparent;
  color: #12b99e;
  cursor: pointer;
  padding: 0;
}
.message-dot {
  position: absolute;
  top: 4px;
  right: 1px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f15a64;
}
.message-preview {
  position: absolute;
  top: 100%;
  right: -30px;
  width: 350px;
  max-width: calc(100vw - 24px);
  background: #fff;
  color: #333;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 4px 14px #0002;
  text-align: left;
  overflow: hidden;
}
.preview-toolbar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 12px;
  border-bottom: 1px solid #eee;
}
.message-preview .preview-toolbar button {
  border: 0;
  background: transparent;
  color: #888;
  padding: 0;
  font-size: 12px;
  height: auto;
  cursor: pointer;
}
.preview-toolbar button:disabled {
  cursor: default;
  opacity: 0.5;
}
.preview-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}
.message-preview .preview-tabs button {
  flex: 1;
  height: 42px;
  padding: 0 5px;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}
.message-preview .preview-tabs button.selected {
  border-bottom-color: #efc600;
  color: #d8af00;
}
.preview-body {
  max-height: 360px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #c6c6c6 #f6f6f6;
}
.message-preview .preview-message {
  display: flex;
  gap: 10px;
  min-height: 83px;
  padding: 12px 10px;
  border-bottom: 1px solid #f2f2f2;
  color: #333;
  text-decoration: none;
  white-space: normal;
}
.preview-message.unread {
  background: #fffbe5;
}
.preview-message:hover {
  background: #f6f7f9;
}
.preview-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e5f5f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}
.preview-icon.security-icon {
  background: #fbe5ee;
}
.preview-copy {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.5;
}
.preview-copy strong {
  font-weight: 600;
}
.preview-copy p {
  margin: 2px 0;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.preview-copy time {
  font-size: 12px;
  color: #aaa;
}
.message-preview .preview-more {
  display: block;
  padding: 15px 0;
  text-align: center;
  border-top: 1px solid #eee;
  color: #d8af00;
  font-size: 13px;
  text-decoration: none;
}
.preview-empty {
  padding: 35px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}
.message-trigger:focus-visible,
.message-preview a:focus-visible,
.message-preview button:focus-visible {
  outline: 2px solid #12b99e;
  outline-offset: -2px;
}
</style>
