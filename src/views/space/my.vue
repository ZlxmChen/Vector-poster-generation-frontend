<template>
  <div>
    <div style="margin-left: 25px; margin-top: 10px">
      <div style="display: flex; margin-top: 20px">
        <!-- 左边 -->
        <div style="margin-top: 2px">
          <text
            v-for="item in tabs"
            @click="setActiveTab(item.key)"
            style="cursor: pointer; font-size: 15px; margin-right: 15px"
            :key="item.key"
            :class="{ 'active-tab': activeTab === item.key }"
          >
            {{ item.name }}
          </text>
        </div>
        <div>
          <!-- 右边 -->
        </div>
        <n-dropdown trigger="hover" :options="options" @select="setActiveLayout">
          <n-button quaternary size="small">
            <template #icon>
              <n-icon v-if="activeLayout === 'grid'"><LayoutGrid /></n-icon>
              <n-icon v-if="activeLayout === 'list'"><LayoutList /></n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </div>
      <divider style="margin-top: 5px" />
    </div>
  </div>
</template>
<script setup>
import { LayoutGrid, LayoutList } from '@vicons/tabler';
import { NIcon } from 'naive-ui';
const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
const tabs = [
  {
    name: '全部',
    key: 'all',
  },
  {
    name: '项目',
    key: 'project',
  },
  {
    name: '模板',
    key: 'template',
  },
  {
    name: '素材',
    key: 'asset',
  },
];

const options = [
  {
    label: '平铺',
    key: 'grid',
    icon: renderIcon(LayoutGrid),
  },
  {
    label: '列表',
    key: 'list',
    icon: renderIcon(LayoutList),
  },
];

const activeTab = ref('all');
const setActiveTab = (key) => {
  activeTab.value = key;
};

const activeLayout = ref('grid');
const setActiveLayout = (key) => {
  activeLayout.value = key;
};
</script>
<style lang="scss" scoped>
.active-tab {
  font-weight: bold;
}
</style>
