<template>
  <div class="layout">
    <n-layout has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="15"
        :width="300"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          "
        >
          <div>
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
              class="menu"
              v-model:value="activeKey"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
            />
          </div>
          <p style="text-align: center; margin-bottom: 20px; color: #666666">
            Copyright © 2025 YIYAN
          </p>
        </div>
      </n-layout-sider>
      <n-layout>
        <RouterView />
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import {
  AlbumsOutline,
  BookOutline,
  PersonOutline,
  WineOutline,
  HomeOutline,
  FileTrayFullOutline,
  SettingsOutline,
} from '@vicons/ionicons5';
import { RouterLink } from 'vue-router';
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

const activeKey = ref('go-back-home'); // 当前激活的菜单项
const collapsed = ref(false); // 菜单是否收起
// 菜单项
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/home',
          },
        },
        { default: () => '主页' }
      ),
    key: 'go-back-home',
    icon: renderIcon(HomeOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/project',
          },
        },
        { default: () => '项目' }
      ),
    key: 'go-project',
    icon: renderIcon(AlbumsOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/temmplate',
          },
        },
        { default: () => '模板' }
      ),
    key: 'go-project',
    icon: renderIcon(FileTrayFullOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/settings',
          },
        },
        { default: () => '设置' }
      ),
    key: 'go-project',
    icon: renderIcon(SettingsOutline),
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
.menu {
  margin-right: 20px;
}
</style>
