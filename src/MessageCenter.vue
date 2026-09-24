<script setup>
import { tr } from './i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CurrencySwitcher from './CurrencySwitcher.vue'
import { computed, ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import MessageBell from './MessageBell.vue'
import { messages, messageCategories, markRead, removeMessages } from './messages'

const category = ref('全部消息')
const currentPage = ref(1)
const filtered = computed(() =>
  messages.value.filter((m) => category.value === '全部消息' || m.category === category.value),
)
const visible = computed(() =>
  filtered.value.slice((currentPage.value - 1) * 10, currentPage.value * 10),
)
watch(category, () => {
  currentPage.value = 1
})
watch(
  () => filtered.value.length,
  (length) => {
    currentPage.value = Math.min(currentPage.value, Math.max(1, Math.ceil(length / 10)))
  },
)
function readAll() {
  filtered.value.forEach((m) => markRead(m.id))
}
async function deleteAll() {
  const ids = filtered.value.map((m) => m.id)
  try {
    await ElMessageBox.confirm(tr('确定删除当前分类中的全部消息？'), tr('删除消息'), {
      confirmButtonText: tr('删除'),
      cancelButtonText: tr('取消'),
      type: 'warning',
    })
  } catch {
    return
  }
  removeMessages(ids)
}
</script>

<template>
  <div class="message-page">
    <header class="user-nav">
      <a
        class="brand"
        href="/bge/hk/zh-CN/"
        ><img
          class="brand-logo brand-logo-full"
          src="/logo-bge-light.svg"
          alt="BGE"
          width="116"
          height="28"
      /></a>
      <nav>
        <a href="/bge/hk/zh-CN/">{{ $t('text000') }}</a
        ><a href="/bge/hk/zh-CN/market">{{ $t('text001') }}</a
        ><a href="/bge/hk/zh-CN/otc">{{ $t('text002') }}</a
        ><a href="/bge/hk/zh-CN/about">{{ $t('text004') }}</a>
      </nav>
      <div class="user-right">
        <a href="/bge/hk/zh-CN/user/report/spot">{{ $t('text005') }}</a
        ><a href="/bge/hk/zh-CN/user/assets">{{ $t('text006') }}</a
        ><MessageBell /><a
          class="avatar"
          href="/bge/hk/zh-CN/user/dashboard"
          :aria-label="$t('text184')"
          ><img
            src="/avatar.png"
            alt=""
            width="30"
            height="30" /></a
        ><LanguageSwitcher /><CurrencySwitcher />
      </div>
    </header>
    <main class="message-layout">
      <aside class="message-sidebar">
        <h1>{{ $t('text174') }}</h1>
        <button
          v-for="item in messageCategories"
          :key="item"
          :class="{ selected: category === item }"
          :aria-pressed="category === item"
          @click="category = item"
        >
          {{ tr(item) }}
        </button>
      </aside>
      <div class="message-content">
        <section
          class="message-list"
          :aria-label="tr(category)"
        >
          <h2>{{ tr(category) }}</h2>
          <div class="message-actions">
            <button
              :disabled="!filtered.some((m) => !m.read)"
              @click="readAll"
            >
              {{ $t('text175') }}</button
            ><button
              :disabled="!filtered.length"
              @click="deleteAll"
            >
              {{ $t('text185') }}
            </button>
          </div>
          <div class="message-rows">
            <article
              v-for="message in visible"
              :key="message.id"
              class="message-row"
              :class="{ read: message.read }"
            >
              <button
                class="message-text"
                :aria-label="`${tr(message.read ? '已读' : '标记已读')}: ${tr(message.text)}`"
                @click="markRead(message.id)"
              >
                <span>{{ tr(message.text) }}</span
                ><time>{{ tr(message.date) }}</time>
              </button>
              <button
                class="message-delete"
                @click="removeMessages([message.id])"
              >
                {{ $t('text182') }}
              </button>
            </article>
            <el-empty
              v-if="!visible.length"
              :description="$t('text177')"
              :image-size="80"
            />
          </div>
        </section>
        <el-pagination
          class="message-pagination"
          v-model:current-page="currentPage"
          :page-size="10"
          :total="filtered.length"
          layout="prev, pager, next"
          :hide-on-single-page="false"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.message-page {
  min-height: 100vh;
  background: #f5f5f5;
  --el-color-primary: #12baa6;
  color: #111;
}
.message-page .user-right {
  align-self: stretch;
}
.message-layout {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 20px;
  padding: 40px 0 20px;
}
.message-sidebar h1 {
  font-size: 16px;
  font-weight: 400;
  margin: 6px 0 24px;
}
.message-sidebar button {
  display: block;
  width: 100%;
  height: 50px;
  padding: 0 20px;
  border: 0;
  background: transparent;
  color: #606266;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}
.message-sidebar button.selected {
  background: white;
  color: #111;
}
.message-list {
  background: #fff;
}
.message-list h2 {
  font-size: 14px;
  font-weight: 400;
  padding: 18px 15px;
  margin: 0;
  border-bottom: 1px solid #eee;
}
.message-actions {
  margin: 0 15px;
  min-height: 53px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
}
.message-actions button,
.message-delete {
  border: 0;
  background: none;
  color: #12baa6;
  cursor: pointer;
  padding: 4px 0;
  font-size: 14px;
}
.message-actions button:disabled {
  color: #b5bfbd;
  cursor: default;
}
.message-rows {
  padding: 0 15px;
}
.message-row {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 67px;
  border-bottom: 1px solid #eee;
  padding-left: 20px;
}
.message-text {
  min-width: 0;
  flex: 1;
  text-align: left;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 12px 0;
  color: #111;
  font-size: 14px;
  line-height: 20px;
}
.message-text span {
  overflow-wrap: anywhere;
}
.message-text time {
  display: block;
  font-size: 12px;
  color: #606266;
  margin-top: 3px;
  line-height: 16px;
}
.message-row.read .message-text {
  color: #606266;
}
.message-delete {
  flex-shrink: 0;
}
.message-pagination {
  justify-content: flex-end;
  margin-top: 20px;
  --el-pagination-bg-color: transparent;
  --el-pagination-button-disabled-bg-color: transparent;
}
@media (max-width: 1240px) {
  .message-layout {
    margin: 0 24px;
  }
}
@media (max-width: 700px) {
  .message-page .user-nav {
    padding: 0 16px;
    gap: 16px;
  }
  .message-page .user-nav nav,
  .message-page .user-right > a:not(.avatar) {
    display: none;
  }
  .message-layout {
    display: block;
    margin: 0 16px;
    padding-top: 24px;
  }
  .message-sidebar {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  .message-sidebar h1 {
    width: 100%;
    margin: 0 0 12px;
  }
  .message-sidebar button {
    width: auto;
    padding: 0 12px;
    height: 40px;
  }
  .message-row {
    padding-left: 0;
    gap: 12px;
  }
  .message-page .user-right {
    gap: 20px;
  }
}
</style>
