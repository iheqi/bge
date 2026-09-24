import { onMounted, onBeforeUnmount, ref } from 'vue'

// Shared by header menus: pointer movement never changes the open state.
export function useClickDropdown() {
  const root = ref(null)
  const open = ref(false)
  function outside(event) {
    if (!root.value?.contains(event.target)) open.value = false
  }
  function escape(event) {
    if (event.key !== 'Escape' || !open.value) return
    open.value = false
    root.value?.querySelector('button')?.focus()
  }
  onMounted(() => {
    document.addEventListener('click', outside)
    document.addEventListener('keydown', escape)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('click', outside)
    document.removeEventListener('keydown', escape)
  })
  return { root, open }
}
