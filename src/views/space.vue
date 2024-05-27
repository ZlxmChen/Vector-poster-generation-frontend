<template>
  <div class="base">
    <div style="display: flex; justify-content: left; align-items: flex-end">
      <n-menu v-model:value="menuKey" mode="horizontal" :options="menuOptions" responsive />
    </div>

    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted, h, defineComponent } from 'vue';
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import { get } from '@/network/index.js';
import 'vue3-carousel/dist/carousel.css';
import { useRouter, RouterLink } from 'vue-router';

const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'my',
          },
          style: [{ fontSize: '20px' }],
        },
        { default: () => '我的空间' }
      ),
    key: 'my',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'trash',
          },
          style: [{ fontSize: '20px' }],
        },
        { default: () => '回收站' }
      ),
    key: 'trash',
  },
];
const menuKey = ref('my');
</script>
<style lang="scss" scoped>
.base {
  margin-top: 20px;
  margin-left: 30px;
}

.custom-menu-item {
  padding: 10px;
  font-size: 50px;
}
</style>
