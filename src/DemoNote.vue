<script setup>
import { computed, ref } from 'vue'
import { noteFor } from './demoNotes'
import { readGlobal, writeGlobal } from './storage'
import { loggedIn } from './session'

const items = computed(() => (loggedIn.value ? noteFor(window.location.pathname) : []))
// Collapsed by default so the note never covers the page until the presenter asks for it.
const open = ref(readGlobal('note-open', '0') === '1')
function toggle() {
  open.value = !open.value
  writeGlobal('note-open', open.value ? '1' : '0')
}
</script>
<template>
  <aside
    v-if="items.length"
    class="demo-note"
    :class="{ open }"
  >
    <button
      type="button"
      class="demo-note-toggle"
      :aria-expanded="open"
      @click="toggle"
    >
      <b>{{ $t('demoNoteTitle') }}</b
      ><em>{{ $t(open ? 'demoNoteHide' : 'demoNoteShow') }}</em>
    </button>
    <ul v-show="open">
      <li
        v-for="key in items"
        :key="key"
      >
        {{ $t(key) }}
      </li>
    </ul>
  </aside>
</template>
<style scoped>
.demo-note {
  position: fixed;
  top: 84px;
  right: 24px;
  z-index: 25;
  width: max-content;
  max-width: 320px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgb(9 14 19 / 14%);
  overflow: hidden;
}
.demo-note.open {
  width: 320px;
  box-shadow: 0 12px 32px rgb(9 14 19 / 18%);
}
.demo-note-toggle {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  height: 34px;
  padding: 0 14px;
  border: 0;
  border-left: 4px solid #f5ff18;
  background: #fffbe0;
  color: #171d27;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.demo-note-toggle b {
  font-weight: 600;
}
.demo-note-toggle em {
  margin-left: auto;
  color: #9aa2ad;
  font-size: 12px;
  font-style: normal;
}
.demo-note ul {
  margin: 0;
  padding: 12px 16px 14px 30px;
  list-style: none;
}
.demo-note li {
  position: relative;
  margin-bottom: 8px;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.6;
}
.demo-note li:last-child {
  margin-bottom: 0;
}
.demo-note li::before {
  content: '';
  position: absolute;
  top: 7px;
  left: -14px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f5ff18;
}
</style>
