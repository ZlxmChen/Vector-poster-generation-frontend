<template>
  <div class="layout">
    <n-layout has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="15"
        :width="300"
        :collapsed="layoutStore.isCollapsed"
        show-trigger
        @collapse="layoutStore.setCollapsed(true)"
        @expand="layoutStore.setCollapsed(false)"
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
              <n-avatar round size="large" class="avatar" :src="userStore.user.avatarUrl" />
              <div>
                <h3>{{ userStore.user.username }}</h3>
                <p>高级用户</p>
              </div>
              <div style="margin-left: auto; margin-right: 10px">
                <RouterLink
                  :to="{ path: '/notification' }"
                  custom
                  v-slot="{ href, navigate, isActive }"
                >
                  <n-button
                    strong
                    quaternary
                    circle
                    size="large"
                    :active="isActive"
                    :href="href"
                    @click="navigate"
                  >
                    <template #icon>
                      <n-icon><NotificationsOutline /></n-icon>
                    </template>
                  </n-button>
                </RouterLink>
              </div>
            </div>
            <n-menu
              class="menu"
              v-model:value="activeKey"
              :collapsed="layoutStore.isCollapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
            />
          </div>
          <p
            v-if="!layoutStore.isCollapsed"
            style="white-space: nowrap; text-align: center; margin-bottom: 20px; color: #666666"
          >
            Copyright © 2025 YIYAN
          </p>
        </div>
      </n-layout-sider>
      <n-layout style="margin-left: 10px">
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
  NotificationsOutline,
} from '@vicons/ionicons5';
import { RouterLink } from 'vue-router';
/**
 * 渲染图标组件
 *
 * @param icon 图标组件
 * @returns 返回一个函数，用于渲染图标组件
 */
import { h, ref, onMounted } from 'vue';
import { NIcon } from 'naive-ui';
import { useLayoutStore } from '@/stores/layout';
import { get } from '@/network/index';
const layoutStore = useLayoutStore();
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const activeKey = ref('go-back-home'); // 当前激活的菜单项
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

onMounted(() => {
  get('/user/profile', {}, (res) => {
    console.log(res);
    userStore.setUser({
      id: res.id,
      username: res.username,
      email: res.email,
      gender: res.gender,
      avatarUrl: res.avatarUrl,
      registerTime: res.registerTime,
    });
  });
});
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
            path: '/space',
          },
        },
        { default: () => '资源空间' }
      ),
    key: 'go-space',
    icon: renderIcon(AlbumsOutline),
  },
  // {
  //   label: () =>
  //     h(
  //       RouterLink,
  //       {
  //         to: {
  //           path: '/temmplate',
  //         },
  //       },
  //       { default: () => '模板' }
  //     ),
  //   key: 'go-project',
  //   icon: renderIcon(FileTrayFullOutline),
  // },
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
    key: 'go-settings',
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
</style>
