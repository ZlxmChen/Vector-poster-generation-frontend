<template>
  <div class="homepage">
    <h1>今天你想设计什么？</h1>
    <p>使用Canva可画，轻松创建专业设计，还能将其分享或打印。</p>
    <n-button strong secondary round type="info">Info</n-button>
    <Carousel v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="slide in 10" :key="slide">
        <div class="carousel-item">{{ slide }}</div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Carousel, Navigation, Slide } from 'vue3-carousel';

import 'vue3-carousel/dist/carousel.css';

const settings = ref({
  itemsToShow: 1,
  snapAlign: 'center',
});

const breakpoints = ref({
  // 700px and up
  700: {
    itemsToShow: 3.5,
    snapAlign: 'center',
  },
  // 1024 and up
  1024: {
    itemsToShow: 5,
    snapAlign: 'start',
  },
});

// Sample data for the slides
const items = ref([
  /* your items data here */
]);
</script>

<style scoped>
.homepage {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel {
  width: 100%;
  height: 240px;
}
</style>
