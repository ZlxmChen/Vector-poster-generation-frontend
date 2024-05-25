<template>
  <div class="layout">
    <n-layout has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="15"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div class="avatar-bar">
          <n-avatar
            round
            size="large"
            class="avatar"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
          <div>
            <h3>Username</h3>
            <p>高级用户</p>
          </div>
        </div>
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>
      <n-layout>
        <RouterView />
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { GameControllerOutline, BookOutline, PersonOutline, WineOutline } from '@vicons/ionicons5';

/**
 * 渲染图标组件
 *
 * @param icon 图标组件
 * @returns 返回一个函数，用于渲染图标组件
 */
import { h, ref } from 'vue';
import { NIcon } from 'naive-ui';
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const activeKey = ref(''); // 当前激活的菜单项
const collapsed = ref(false); // 菜单是否收起
// 菜单项
const menuOptions = [
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookOutline),
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    icon: renderIcon(BookOutline),
    disabled: true,
    children: [
      {
        label: '鼠',
        key: 'rat',
      },
    ],
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    disabled: true,
    icon: renderIcon(BookOutline),
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    icon: renderIcon(BookOutline),
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
            icon: renderIcon(PersonOutline),
          },
          {
            label: '羊男',
            key: 'sheep-man',
            icon: renderIcon(PersonOutline),
          },
        ],
      },
      {
        label: '饮品',
        key: 'beverage',
        icon: renderIcon(WineOutline),
        children: [
          {
            label: '威士忌',
            key: 'whisky',
          },
        ],
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich',
          },
        ],
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes',
      },
    ],
  },
];
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  height: 100vh;
}

.avatar-bar {
  display: flex;
  height: 80px;
  align-items: center;
  margin-left: 30px;
  .avatar {
    margin-right: 20px;
  }
}
</style>
