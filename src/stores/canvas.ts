import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCanvasStore = defineStore('canvas', () => {
  // State
  const height = ref<number>(600);
  const width = ref<number>(800);

  // Getters
  const getHeight = computed(() => height.value);
  const getWidth = computed(() => width.value);

  // Actions
  function setHeight(newHeight: number) {
    height.value = newHeight;
  }

  function setWidth(newWidth: number) {
    width.value = newWidth;
  }
  function setSize(newWidth: number, newHeight: number) {
    width.value = newWidth;
    height.value = newHeight;
    console.log('useCanvasStore set size:' +width.value + height.value);
  }
  return {
    height,
    width,
    getHeight,
    getWidth,
    setHeight,
    setWidth,
    setSize
  };
});
