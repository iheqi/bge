<script setup>
import { ref } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { messages, unreadCount, markRead } from './messages'
const open = ref(false)
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
      aria-label="消息中心"
      :aria-expanded="open"
      aria-controls="message-preview"
      title="消息中心"
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
      <div class="preview-body">
        <a
          v-for="message in messages.slice(0, 4)"
          :key="message.id"
          class="preview-message"
          href="/bge/hk/zh-CN/user/messages"
          @click="markRead(message.id)"
          >{{ message.text }}</a
        >
        <p
          v-if="!messages.length"
          class="preview-empty"
        >
          暂无消息
        </p>
      </div>
      <a
        class="preview-more"
        href="/bge/hk/zh-CN/user/messages"
        >查看所有消息</a
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
  width: 320px;
  max-width: calc(100vw - 24px);
  background: white;
  color: #111;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 4px 14px #0002;
  text-align: left;
}
.preview-message {
  display: block !important;
  font-size: 13px;
  line-height: 1.15;
  color: #111 !important;
  white-space: normal;
  overflow-wrap: anywhere;
  text-decoration: none;
}
.preview-message:hover {
  text-decoration: underline;
}
.preview-more {
  display: block !important;
  padding-top: 26px;
  font-size: 13px;
  color: #111 !important;
}
.preview-empty {
  color: #999;
  font-size: 13px;
}
.message-trigger:focus-visible,
.preview-more:focus-visible,
.preview-message:focus-visible {
  outline: 2px solid #12b99e;
  outline-offset: 2px;
}
</style>
