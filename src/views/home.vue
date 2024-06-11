<template>
  <div class="homepage">
    <div class="text-title">
      今天你想
      <span class="text-color-gradient">设计</span>
      什么？
    </div>
    <p>使用艺言，轻松创建专业设计，还能将其分享或打印。</p>
    <n-space>
      <n-button tertiary circle type="info" @click="searchModal = !searchModal">
        <template #icon>
          <n-icon><SearchSharp /></n-icon>
        </template>
      </n-button>
      <n-button v-if="!searchModal" secondary strong round type="info" @click="blankCanvas()">
        立即开始
      </n-button>
      <n-input
        v-else
        round
        placeholder="搜索"
        v-model:value="searchValue"
        @keyup.enter.native="search"
        @keyup.esc.native="
          searchModal = false;
          searchModal2 = false;
          searchValue = '';
        "
      >
        <template #suffix>
          <n-icon :component="ChevronForwardSharp" @click="search" />
        </template>
      </n-input>
    </n-space>
    <transition name="fade">
      <div class="search-page" v-if="searchModal2">
        <n-tabs type="segment" animated>
          <n-tab-pane name="project" tab="项目">
            <div class="search-tab">
              <div class="search-item" v-for="project in searchProjectList" :key="project.id">
                <img
                  :src="project.projectUrl"
                  alt="project-preview"
                  @click="openProject(project)"
                />

                <p>{{ project.projectName }}</p>
              </div>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div class="page-index">
              <Page :total="2" v-model="searchProjectPageIndex" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="template" tab="模板">
            <div class="search-tab">
              <div class="search-item" v-for="template in searchTemplateList" :key="template.id">
                <img
                  :src="template.templateUrl"
                  alt="template-preview"
                  @click="openTemplate(template)"
                />

                <p @click="openTemplate(template)">{{ template.templateName }}</p>
              </div>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div class="page-index">
              <Page :total="2" v-model="searchTemplatePageIndex" />
            </div>
          </n-tab-pane>
          <n-tab-pane name="element" tab="元素">
            <div class="search-tab">
              <div class="search-item" v-for="element in searchElementList" :key="element.id">
                <img :src="element.elementUrl" alt="template-preview" />

                <p>{{ element.elementName }}</p>
              </div>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div class="page-index">
              <Page :total="2" v-model="searchElementPageIndex" />
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </transition>
    <Carousel class="carousel-blank" v-bind="settings" :breakpoints="breakpoints">
      <Slide v-for="(slide, i) in slides" :index="i" :key="i">
        <div class="slide-card">
          <img class="slide-img" :src="slide.src" />
          <p @click="blankCanvasSetSize(slide)">{{ slide.name }}</p>
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
          <Slide v-for="project in formatedProjectList.slice(0, 10)" :key="project.id">
            <div class="slide-card-project">
              <img class="slide-img-project" :src="project.projectUrl" alt="" />
              <div>
                <h2>{{ project.projectName }}</h2>
                <p>
                  最后编辑时间：
                  <span style="color: #666666">{{ project.formattedEditTime }}</span>
                </p>
                <n-button
                  icon-placement="right"
                  secondary
                  strong
                  round
                  class="project-button"
                  @click="openProject(project)"
                >
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
          <n-button text style="font-size: 2rem" @click="goProject()">
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
          <n-button text style="font-size: 2rem" @click="goTemplate()">
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
          <Slide v-for="template in formatedTemplateList.slice(0, 10)" :key="template.id">
            <div class="slide-card-template">
              <img class="slide-img-template" :src="template.templateUrl" alt="" />
              <div>
                <h2>{{ template.templateName }}</h2>
                <p>
                  创建时间：
                  <span style="color: #666666">{{ template.formattedCreateTime }}</span>
                </p>
                <n-button
                  icon-placement="right"
                  secondary
                  strong
                  round
                  class="project-button"
                  @click="openTemplate(template)"
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
import { get, post } from '@/network/index.js';
import 'vue3-carousel/dist/carousel.css';
import { ChevronForwardCircleOutline, ChevronForwardSharp, SearchSharp } from '@vicons/ionicons5';
const projectList = ref([]);
const myTemplateList = ref([]);
import { useRouter } from 'vue-router';
const router = useRouter();
import { useLayoutStore } from '@/stores/layout.ts';
import { useUserStore } from '@/stores/userStore';
import { Message } from 'view-ui-plus';
import { formatTimestamp } from '@/utils/utils';
const userStore = useUserStore();
const layoutStore = useLayoutStore();
const formatedTemplateList = computed(() => {
  return myTemplateList.value.map((item) => ({
    ...item,
    formattedCreateTime: formatTimestamp(item.createTime),
  }));
});
const formatedProjectList = computed(() => {
  return projectList.value.map((item) => ({
    ...item,
    formattedEditTime: formatTimestamp(item.editTime),
  }));
});
const searchModal = ref(false);
const searchModal2 = ref(false);
onMounted(() => {
  get('/project/my', {}, (res) => {
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
    itemsToShow: 1.7,
    snapAlign: 'center',
  },
  800: {
    itemsToShow: 2.7,
    snapAlign: 'center',
  },
  900: {
    itemsToShow: 3.7,
    snapAlign: 'center',
  },
  // 1024 and up
  1024: {
    itemsToShow: 4.7,
    snapAlign: 'center',
  },
});
const searchProjectPageIndex = ref(1);
const searchProjectList = ref([]);
const searchProject = computed(() => {
  //显示projectList中前10个数据
  return searchProjectList;
});
const searchTemplatePageIndex = ref(1);
const searchTemplateList = ref([]);
const searchTemplate = computed(() => {
  //显示projectList中前10个数据
  return searchTemplateList.value.slice(
    0 + 10 * (searchTemplatePageIndex.value - 1),
    10 * searchTemplatePageIndex.value
  );
});
const searchElementPageIndex = ref(1);
const searchElementList = ref([]);
const searchElement = computed(() => {
  //显示elementList中前10个数据
  return searchElementList.value.slice(
    0 + 10 * (searchElementPageIndex.value - 1),
    10 * searchElementPageIndex.value
  );
});
const searchValue = ref('');

const search = () => {
  searchModal2.value = true;
  console.log(searchValue.value);
  post('/template/search', { value: searchValue.value, pageNo: 1 }, (res) => {
    console.log(res);
    searchTemplateList.value = res.list;
  });
  post('/project/search', { value: searchValue.value, pageNo: 1 }, (res) => {
    console.log(res);
    searchProjectList.value = res.projectList;
  });
  post('/element/search', { value: searchValue.value, pageNo: 1 }, (res) => {
    console.log(res);
    searchElementList.value = res.elementList;
  });
};
const slides = ref([
  {
    id: 1,
    src: 'https://template.canva.cn/EAFaJTNsL0A/5/0/283w-jKkKLkt9694.jpg',
    name: '简历',
    x: 600,
    y: 800,
  },
  {
    id: 2,
    src: 'https://template.canva.cn/EAFaIgSj1zE/2/0/283w-lbUgzFF_LtI.jpg',
    name: '海报',
    x: 600,
    y: 800,
  },
  {
    id: 3,
    src: 'https://template.canva.cn/EAFIKQ2cuZU/1/0/283w-Y9TMsiXnxg8.jpg',
    name: '画板',
    x: 800,
    y: 600,
  },
  {
    id: 4,
    src: 'https://template.canva.cn/EAFhYPU66GA/1/0/400w-TC1Bvi7Aoo4.jpg',
    name: '公众号',
    x: 900,
    y: 383,
  },
  {
    id: 5,
    src: 'https://template.canva.cn/EAFMFYuEJNw/1/0/600w-zuQ8jZXbabQ.png',
    name: '文档',
    x: 600,
    y: 800,
  },
  {
    id: 11,
    src: 'https://template.canva.cn/EAFLaUaLMrU/5/0/493w-pNC0kRGrsPg.jpg',
    name: '白板',
    x: 800,
    y: 600,
  },
  {
    id: 12,
    src: 'https://template.canva.cn/EAFS6smtOfg/2/0/400w-5wP8BdUV_TM.jpg',
    name: '三折页',
    x: 1100,
    y: 850,
  },
  {
    id: 13,
    src: 'https://template.canva.cn/EAE2D3dgzIU/1/0/400w-QDULZnptaqs.jpg',
    name: 'logo',
    x: 500,
    y: 500,
  },
  {
    id: 14,
    src: 'https://template.canva.cn/EAE48sajKnk/1/0/283w-aDoIYdCUT3I.jpg',
    name: '传单',
    x: 1050,
    y: 1485,
  },
  {
    id: 15,
    src: 'https://template.canva.cn/EAEwbuFFxkk/1/0/400w-AFIkKVX5y9Y.jpg',
    name: '朋友圈',
    x: 1080,
    y: 1080,
  },
]);

const blankCanvasSetSize = (slide) => {
  layoutStore.setCollapsed(true);
  router.push({
    name: 'editer',
    params: {
      command: JSON.stringify({
        height: slide.y,
        width: slide.x,
      }),
    },
  });
};

const blankCanvas = () => {
  router.push({
    name: 'editer',
    params: {
      command: JSON.stringify({ height: 800, width: 600 }),
    },
  });
};

const openTemplate = (temmplate) => {
  Message.info('正在从模板创建，请稍后');
  post(
    '/template/data',
    { id: temmplate.id },
    (res) => {
      console.log(res);
      router.push({
        name: 'editer',
        params: {
          command: JSON.stringify({ json: res.file }),
        },
      });
    },
    (err) => {
      console.log('err:' + err);
    }
  );
};
const openProject = (project) => {
  Message.info('项目恢复中，请稍后');
  post(
    '/project/data',
    { id: project.id },
    (res) => {
      console.log('/project/data' + res);
      //存入store中
      if (res.file != null) {
        userStore.setEditingProject({
          id: project.id,
          userId: project.userId,
          projectName: project.projectName,
          projectUrl: project.projectUrl,
          isDelete: project.isDelete,
          isPublic: project.isPublic,
          file: res.file,
          editTime: project.editTime,
          folderId: project.folderId,
        });

        router.push({
          name: 'editer',
          params: {
            command: JSON.stringify({ json: res.file }),
          },
        });
      }
    },
    (err) => {
      Message.err('登陆失败请重试');
    }
  );
};

const goProject = () => {
  router.push('/space/my');
};
const goTemplate = () => {
  router.push('/space/my');
};
</script>

<style lang="scss" scoped>
.homepage {
  /* global 94%+ browsers support */
  background: linear-gradient(32deg, #fff1eb 0%, #ace0f9 100%),
    linear-gradient(90deg, #fff1eb 0%, #ace0f9 100%);

  /* safari 5.1+,chrome 10+ */
  background: -webkit-linear-gradient(32deg, #fff1eb 0%, #ace0f9 100%),
    -webkit-linear-gradient(90deg, #fff1eb 0%, #ace0f9 100%);

  /* ff 3.6+ */
  background: -moz-linear-gradient(32deg, #fff1eb 0%, #ace0f9 100%),
    -moz-linear-gradient(90deg, #fff1eb 0%, #ace0f9 100%);

  /* opera 11.10+ */
  background: -o-linear-gradient(32deg, #fff1eb 0%, #ace0f9 100%),
    -o-linear-gradient(90deg, #fff1eb 0%, #ace0f9 100%);

  /* ie 10+ */
  background: -ms-linear-gradient(32deg, #fff1eb 0%, #ace0f9 100%),
    -ms-linear-gradient(90deg, #fff1eb 0%, #ace0f9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 20px;
  .search-page {
    margin-top: 20px;
    width: 95%;
    // min-height: 70vh;

    .search-tab {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .page-index {
      display: flex;
      justify-content: center;
    }
    .search-item {
      width: 200px;
      height: 250px;
      margin-bottom: 10px;
      margin-right: 10px;
      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 10px;
      }
      p {
        margin: 0;
      }
    }

    .search-tab > i {
      width: 65px;
      margin-right: 10px;
    }
  }
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
  background-color: #f2f3f5;
  p {
    position: absolute;
    margin: auto;
    display: block;
    margin-left: 20px;
    margin-right: auto;

    bottom: 10px;
    color: rgb(37, 37, 37);
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
  object-fit: contain;
  width: 90%;
  margin: 5px;
  margin-top: 10px;
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
  width: 45vw;
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
  object-fit: contain;
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
  width: 45vw;
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
  object-fit: contain;
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
