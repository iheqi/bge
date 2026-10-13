<script setup>
import { computed, ref } from 'vue'
import { i18n, languages, setLanguage, tr } from './i18n'
// Hover opens the list so a language can be picked with a single click, matching the header menus.
const open = ref(false)
const root = ref(null)
const current = computed(() => languages.find((item) => item.value === i18n.global.locale.value))
function show() {
  open.value = true
}
function hide() {
  open.value = false
}
function select(value) {
  setLanguage(value)
  hide()
}
function escape(event) {
  if (event.key !== 'Escape' || !open.value) return
  hide()
  root.value?.querySelector('button')?.focus()
}
</script>

<template>
  <div
    class="language-switcher"
    ref="root"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown="escape"
  >
    <button
      class="language-trigger"
      type="button"
      :aria-label="tr('语言')"
      :aria-expanded="open"
      aria-haspopup="menu"
    >
      {{ current.label }}
    </button>
    <div
      v-show="open"
      class="language-options"
      role="menu"
      :aria-label="tr('语言')"
    >
      <button
        v-for="item in languages"
        :key="item.value"
        class="language-option"
        type="button"
        role="menuitemradio"
        :aria-checked="current.value === item.value"
        :class="{ selected: current.value === item.value }"
        :lang="item.value"
        @click="select(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: flex;
  align-items: center;
  align-self: stretch;
  z-index: 40;
}
.language-switcher .language-trigger {
  height: auto;
  border: 0;
  border-radius: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  white-space: nowrap;
  cursor: pointer;
}
.language-options {
  position: absolute;
  top: 100%;
  right: 0;
  width: 120px;
  padding: 8px 0;
  background: #2d3443;
  border-radius: 16px;
  box-shadow: 0 6px 16px #0002;
  overflow: hidden;
}
.language-switcher .language-option {
  display: block;
  width: 100%;
  height: 36px;
  padding: 0 16px;
  border: 0;
  border-radius: 0;
  text-align: left;
  background: transparent;
  color: #f4f6f8;
  font-size: 13px;
  cursor: pointer;
}
.language-switcher .language-option:hover,
.language-switcher .language-option.selected {
  background: #3a4355;
  color: #f4ff19;
}
.language-switcher button:focus-visible {
  outline: 2px solid #f4ff19;
  outline-offset: -2px;
}
</style>
