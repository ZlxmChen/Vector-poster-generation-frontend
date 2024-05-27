<template>
  <div class="homepage">
    <div class="text-title">
      今天你想
      <span class="text-color-gradient">设计</span>
      什么？
    </div>
    <p>使用Canva可画，轻松创建专业设计，还能将其分享或打印。</p>
    <n-button secondary strong round type="info" @click="blankCanvas()">立即开始</n-button>
    <Carousel class="carousel-blank" v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="(slide, i) in slides" :index="i" :key="i">
        <div class="slide-card">
          <img class="slide-img" :src="slide.src" />
          <p @click="blankCanvasSetSize()">aaa</p>
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
    <!-- 项目部分 -->
    <div class="project">
      <div class="project-block">
        <Carousel>
          <Slide v-for="project in projectList.slice(0, 10)" :key="project.id">
            <div class="slide-card-project">
              <img class="slide-img-project" :src="project.projectUrl" alt="" />
              <div>
                <h2>{{ project.projectName }}</h2>
                <p>
                  最后编辑时间：
                  <span style="color: #666666">{{ project.editTime }}</span>
                </p>
                <n-button icon-placement="right" secondary strong round class="project-button">
                  <template #icon>
                    <n-icon>
                      <ChevronForwardCircleOutline />
                    </n-icon>
                  </template>
                  继续编辑
                </n-button>
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
      <div class="project-right">
        <h1>
          回到你的项目
          <n-button text style="font-size: 2rem">
            <template #icon>
              <n-icon><ChevronForwardSharp /></n-icon>
            </template>
          </n-button>
        </h1>
        <p>或者从更多之前的项目中开始</p>
      </div>
    </div>
    <!-- 模板部分 -->
    <div class="template">
      <div class="template-right">
        <h1>
          <n-button text style="font-size: 2rem">
            <template #icon>
              <n-icon><ChevronForwardSharp /></n-icon>
            </template>
          </n-button>
          从你的模板开始
        </h1>
        <p>或者在模板库中浏览更多的选择</p>
      </div>
      <div class="template-block">
        <Carousel>
          <Slide v-for="template in myTemplateList.slice(0, 10)" :key="template.id">
            <div class="slide-card-template">
              <img class="slide-img-template" :src="template.templateUrl" alt="" />
              <div>
                <h2>{{ template.templateName }}</h2>
                <p>
                  创建时间：
                  <span style="color: #666666">{{ template.createTime }}</span>
                </p>
                <n-button
                  icon-placement="right"
                  secondary
                  strong
                  round
                  class="project-button"
                  @click="openProject(template)"
                >
                  <template #icon>
                    <n-icon>
                      <ChevronForwardCircleOutline />
                    </n-icon>
                  </template>
                  从模板创建
                </n-button>
              </div>
            </div>
          </Slide>

          <template #addons>
            <Navigation />
            <Pagination />
          </template>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { Carousel, Navigation, Slide } from 'vue3-carousel';
import { get } from '@/network/index.js';
import 'vue3-carousel/dist/carousel.css';
import { ChevronForwardCircleOutline, ChevronForwardSharp } from '@vicons/ionicons5';
const projectList = ref([]);
const myTemplateList = ref([]);
import { useRouter } from 'vue-router';
const router = useRouter();
import { useLayoutStore } from '@/stores/layout.ts';
const layoutStore = useLayoutStore();
onMounted(() => {
  get('/project', {}, (res) => {
    projectList.value = res.projectList;
  });
  get('/template/my', {}, (res) => {
    myTemplateList.value = res.list;
  });
});
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
  {
    id: 1,
    src: 'https://zzq-typora-picgo.oss-cn-beijing.aliyuncs.com/2024-fengru/svg/macaw.svg',
    size: {},
  },
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

const blankCanvasSetSize = () => {
  layoutStore.setCollapsed(true);
  router.push({
    name: 'editor',
    params: {
      command: JSON.stringify({
        height: 240,
        width: 240,
      }),
    },
  });
};

const blankCanvas = () => {
  router.push({
    name: 'editor',
    params: {
      command: JSON.stringify({ height: 800, width: 600 }),
    },
  });
};

const openProject = (temmplate) => {
  router.push({
    name: 'editor',
    params: {
      command: JSON.stringify({ json: temmplate.fileUrl }),
    },
  });
};
</script>

<style lang="scss" scoped>
.homepage {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;

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
.carousel-blank {
  width: 96%;
  height: 240px;
  margin-top: 40px;
  margin-bottom: 40px;
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
.project {
  display: flex;
  height: 300px;
  width: 96%;
  margin-bottom: 40px;
  margin-right: 20px;
}
.project-block {
  height: 300px;
  width: 50vw;
  border-radius: 20px;
  background-color: #f2f3f5;
  margin-right: 20px;

  Carousel {
    width: 100%;
    height: 100%;
  }
}
.slide-img-project {
  height: 100%;
  width: 50%;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 40px;
}
.slide-card-project {
  padding: 20px;
  height: 300px;
  width: 80%;
  display: flex;

  div {
    display: flex;
    flex-direction: column;
    text-align: start;
    justify-content: center;
  }
}
.project-button {
  width: min-content;
  margin-top: 20px;
  margin-left: -10px;
}
.project-right {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  p {
    margin-bottom: 20px;
  }
}

.template {
  display: flex;
  justify-content: flex-end;
  height: 300px;
  width: 96%;
  margin-bottom: 40px;
  margin-left: 20px;
}
.template-block {
  height: 300px;
  width: 50vw;
  border-radius: 20px;
  background-color: #f2f3f5;
  margin-left: 20px;

  Carousel {
    width: 100%;
    height: 100%;
  }
}
.slide-img-template {
  height: 100%;
  width: 50%;
  object-fit: cover;
  border-radius: 10px;
  margin-right: 40px;
}
.slide-card-template {
  padding: 20px;
  height: 300px;
  width: 80%;
  display: flex;

  div {
    display: flex;
    flex-direction: column;
    text-align: start;
    justify-content: center;
  }
}
.template-button {
  width: min-content;
  margin-top: 20px;
  margin-right: -10px;
}
.template-right {
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: end;
  p {
    margin-bottom: 20px;
  }
}
</style>
