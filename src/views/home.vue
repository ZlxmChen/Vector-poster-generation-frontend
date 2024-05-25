<template>
  <div class="homepage">
    <div class="text-title">
      今天你想
      <span class="text-color-gradient">设计</span>
      什么？
    </div>
    <p>使用Canva可画，轻松创建专业设计，还能将其分享或打印。</p>
    <n-button secondary strong round type="info">立即开始</n-button>
    <Carousel v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="(slide, i) in slides" :index="i" :key="i">
        <div class="slide-card">
          <img class="slide-img" :src="slide.src" />
          <p>aaa</p>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
    <!-- 项目部分 -->
    <div class="project-block">
      <h1>回到项目</h1>
    </div>
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
    itemsToShow: 1.2,
    snapAlign: 'center',
  },
  800: {
    itemsToShow: 2.2,
    snapAlign: 'center',
  },
  900: {
    itemsToShow: 3.2,
    snapAlign: 'center',
  },
  // 1024 and up
  1024: {
    itemsToShow: 4.2,
    snapAlign: 'center',
  },
});

const slides = ref([
  { id: 1, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 2, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 3, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 4, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 5, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 11, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 12, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 13, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 14, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
  { id: 15, src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg' },
]);
</script>

<style lang="scss" scoped>
.homepage {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .text-color-gradient {
    display: inline-block;
    font-size: 1em;
    font-weight: 700;
    background: linear-gradient(0.25turn, #c21500, #ffc500);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  .text-title {
    font-size: 4em;
    font-weight: 700;
    margin-top: 80px;
  }
  p {
    font-size: 1em;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 20px;
  }
}
.carousel {
  width: 90%;
  height: 240px;
  margin-top: 40px;
  margin-bottom: 20px;
}

.slide-card {
  width: 240px;
  height: 240px;
  border-radius: 10px;

  p {
    position: absolute;
    margin: auto;
    display: block;
    margin-left: 20px;
    margin-right: auto;

    bottom: 10px;
    color: white;
    font-size: medium;
    transition: bottom 0.3s ease, font-size 0.3s ease; // 添加transition属性
  }

  &:hover {
    p {
      font-size: large;
      bottom: 20px;
    }
  }
}

.slide-img {
  object-fit: cover;
  width: 90%;
  margin-top: 5%;
  margin-left: 5%;
  height: 90%;
  border-radius: 10px;
}
</style>
