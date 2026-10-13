<script setup>
import { computed, ref } from 'vue'
import { tr } from './i18n'
import { currency, currencies, setCurrency } from './currency'
// Hover opens the list so a currency can be picked with a single click, matching the header menus.
const open = ref(false)
const root = ref(null)
const current = computed(() => ({ value: currency.value, label: currency.value }))
function show() {
  open.value = true
}
function hide() {
  open.value = false
}
function select(value) {
  setCurrency(value)
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
    class="currency-switcher"
    ref="root"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
    @keydown="escape"
  >
    <button
      class="currency-trigger"
      type="button"
      :aria-label="tr('显示币种')"
      :aria-expanded="open"
      aria-haspopup="menu"
    >
      {{ current.label }}
    </button>
    <div
      v-show="open"
      class="currency-options"
      role="menu"
      :aria-label="tr('显示币种')"
    >
      <button
        v-for="value in currencies"
        :key="value"
        class="currency-option"
        type="button"
        role="menuitemradio"
        :aria-checked="current.value === value"
        :class="{ selected: current.value === value }"
        @click="select(value)"
      >
        {{ value }}
      </button>
      <small class="currency-rate">{{ tr('参考汇率') }}<br />1 USD = 7.80 HKD</small>
    </div>
  </div>
</template>

<style scoped>
.currency-switcher {
  position: relative;
  display: flex;
  align-items: center;
  align-self: stretch;
  z-index: 40;
}
.currency-switcher .currency-trigger {
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
.currency-options {
  position: absolute;
  top: 100%;
  right: 0;
  width: 180px;
  padding: 8px 0;
  background: #2d3443;
  border-radius: 16px;
  box-shadow: 0 6px 16px #0002;
  overflow: hidden;
}
.currency-switcher .currency-option {
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
.currency-switcher .currency-option:hover,
.currency-switcher .currency-option.selected {
  background: #3a4355;
  color: #f4ff19;
}
.currency-switcher button:focus-visible {
  outline: 2px solid #f4ff19;
  outline-offset: -2px;
}
.currency-rate {
  display: block;
  padding: 8px 16px;
  color: #b8c0cf;
  font-size: 11px;
  line-height: 1.6;
}
</style>
