import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useLayoutStore = defineStore('layout', () => {
  // State
  const collapsed = ref<boolean>(false);


  // Getters
  const isCollapsed = computed(() => collapsed.value);

  // Actions
  function toggleCollapsed() {
    collapsed.value = !collapsed.value;
  }

  function setCollapsed(value: boolean) {
    collapsed.value = value;
    console.log('setCollapsed', value);
  }

  return {
    collapsed,
    isCollapsed,
    toggleCollapsed,
    setCollapsed
  };
});
