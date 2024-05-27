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
              <n-icon v-if="activeLayout === 'grid'">
                <LayoutGrid />
              </n-icon>
              <n-icon v-if="activeLayout === 'list'">
                <LayoutList />
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </div>
      <divider style="margin-top: 5px" />
      <!-- 主要部分 -->
      <n-layout has-sider>
        <!-- 文件夹 -->
        <n-layout-sider
          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="200"
          :collapsed="collapsed"
          show-trigger
          @collapse="(collapsed = true), (menuOptions.value = folderData.value)"
          @expand="(collapsed = false), (menuOptions.value = [])"
        >
          <div v-if="collapsed">
            <div style="height: 85vh; overflow-y: auto; overflow-x: hidden">
              <n-menu
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
                :render-label="renderMenuLabel"
                :render-icon="renderMenuIcon"
              />
            </div>
          </div>

          <div v-else>
            <div style="display: flex; margin: 5px">
              <n-input placeholder="搜索我的空间" size="small" style="margin-right: 5px"></n-input>
              <n-button text style="margin-right: 5px">
                <n-icon size="20">
                  <Search />
                </n-icon>
              </n-button>
              <n-button text style="margin-right: 5px">
                <n-icon size="20">
                  <FolderPlus />
                </n-icon>
              </n-button>
            </div>
            <div style="height: 80vh; overflow-y: auto; overflow-x: hidden">
              <div v-for="item in menuOptions" :key="item.key">
                <div>
                  <div style="display: flex; align-items: center; margin-bottom: 5px">
                    <n-button quaternary>
                      <template #icon>
                        <n-icon>
                          <Folder />
                        </n-icon>
                      </template>
                      <n-input
                        v-if="item.key === curDealFoldId && renameStatus == true"
                        size="tiny"
                        maxlength="10"
                        minlength="2"
                        show-count
                        v-model:value="renameString"
                        style="width: 100px"
                      ></n-input>
                      <text v-else>{{ item.label }}</text>
                    </n-button>

                    <div style="margin-left: auto">
                      <n-button
                        quaternary
                        @click="renameFolder"
                        v-if="item.key === curDealFoldId && renameStatus == true"
                      >
                        <n-icon>
                          <Check />
                        </n-icon>
                      </n-button>
                      <n-dropdown
                        v-else
                        trigger="hover"
                        placement="bottom-start"
                        :options="foldOptions"
                        @select="
                          (key) => {
                            curDealFoldId = item.key;
                            handleFoldSelect(key);
                          }
                        "
                      >
                        <n-button quaternary style="font-size: 15px">
                          <n-icon>
                            <Dots />
                          </n-icon>
                        </n-button>
                      </n-dropdown>
                    </div>
                  </div>
                  <!-- <n-list hoverable :show-divider="false">
                    <n-list-item v-for="file in item.children" @click="loadDoc(file.key)">
                      <div
                        v-if="file.key == props.docId"
                        style="display: flex; align-items: center"
                      >
                        <n-icon size="20">
                          <DocumentTextOutline />
                        </n-icon>
                        <p style="font-size: large; font-weight: bolder; margin-left: 5px">
                          {{ file.label }}
                        </p>
                      </div>
                      <div v-else style="display: flex; align-items: center">
                        <n-icon>
                          <DocumentTextOutline />
                        </n-icon>
                        <p style="margin-left: 3px">{{ file.label }}</p>
                      </div>
                      <template #suffix>
                        <n-dropdown
                          trigger="hover"
                          :options="docOptions"
                          @select="
                            (aaa) => {
                              curDealDocId = file.key;
                              handleDocSelect(aaa);
                            }
                          "
                        >
                          <n-button text style="font-size: 15px">
                            <n-icon>
                              <EllipsisHorizontalSharp />
                            </n-icon>
                          </n-button>
                        </n-dropdown>
                      </template>
                    </n-list-item>
                    <div class="separator"></div>
                  </n-list> -->
                </div>
              </div>
            </div>
          </div>
        </n-layout-sider>
        <!-- 内容 -->
        <n-layout-content style="margin-left: 10px; margin-right: 20px; margin-bottom: 20px">
          <n-data-table
            v-if="activeLayout === 'list'"
            remote
            ref="table"
            :columns="columnsRef"
            :data="dataRef"
            :loading="loadingRef"
            :pagination="paginationReactive"
            :row-key="rowKey"
            @update:page="handlePageChange"
          />
        </n-layout-content>
      </n-layout>
    </div>

    <n-modal
      preset="dialog"
      title="删除文件夹"
      type="error"
      content="删除后，文件夹中的内容将移动至默认文件夹。"
      positive-text="确认"
      negative-text="取消"
      @positive-click="deleteFold()"
      @negative-click="onNegativeClick"
      v-model:show="delFoldModel"
    ></n-modal>
  </div>
</template>
<script setup>
import { LayoutGrid, LayoutList, FolderPlus, Search, Dots, Folder, Check } from '@vicons/tabler';
import { NIcon, NButton, NImage } from 'naive-ui';
import { get } from '@/network/index.js';

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
};
const renderMenuLabel = (option) => {
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, option.label);
  }
  return option.label;
};

const renderMenuIcon = () => {
  return h(NIcon, null, { default: () => h(Folder) });
};
const tabs = [
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

const activeTab = ref('project');

const setActiveTab = (key) => {
  activeTab.value = key;
  switch (key) {
    case 'project':
      get('/project/folder', {}, (res) => {
        folderData.values = res.folderList.map((folder) => ({
          id: folder.id,
          name: folder.folderName,
        }));
      });
      get('/project', {}, (res) => {
        dataRef.value = res.projectList.map((project) => ({
          id: project.id,
          name: project.projectName,
          src: project.projectUrl,
          isPublic: project.isPublic,
          fileUrl: project.fileUrl,
          editTime: project.editTime,
        }));

        console.log(dataRef.value);
        paginationReactive.pageCount = 1;
        paginationReactive.itemCount = res.projectList.length;
        loadingRef.value = false;
      });
      break;
    case 'template':
      get('/template/my', {}, (res) => {
        dataRef.value = res.projectList.map((template) => ({
          id: template.id,
          name: template.templateName,
          src: template.templateUrl,
          isPublic: template.isPublic,
          fileUrl: template.fileUrl,
          editTime: template.editTime,
        }));

        console.log(dataRef.value);
        paginationReactive.pageCount = 1;
        paginationReactive.itemCount = res.projectList.length;
        loadingRef.value = false;
      });
      break;
  }
};

const activeLayout = ref('list');
const setActiveLayout = (key) => {
  activeLayout.value = key;
};

const collapsed = ref(false);
const menuOptions = reactive([
  {
    label: '平铺',
    key: 'grid',
  },
  {
    label: '列表',
    key: 'list',
  },
]);

const curDealFoldId = ref(0);
const foldOptions = reactive([
  {
    label: '重命名文件夹',
    key: 4,
  },
  {
    label: '删除文件夹',
    key: 5,
  },
]);

const renameStatus = ref(false);
const delFoldModel = ref(false);

function handleFoldSelect(key) {
  switch (key) {
    case 4:
      return (renameStatus.value = true);
    case 5:
      return (delFoldModel.value = true);
  }
}

const renameString = ref(null);
function renameFolder(id) {
  console.log(id);
  console.log(renameString.value);
  renameStatus.value = false;
  renameString.value = null;
}

const folderData = ref([
  {
    label: '平铺',
    key: 'grid',
  },
  {
    label: '列表',
    key: 'list',
  },
]);

// 表格

const settingColumn = {
  title: '操作',
  key: 'opreation',
  render(row) {
    return h(
      NButton,
      {
        size: 'small',
        quaternary: true,
        onClick: () => {
          console.log('test');
        },
      },
      { default: () => h(NIcon, null, { default: () => h(Dots) }) }
    );
  },
};

const previewColumn = {
  title: '预览图',
  key: 'src',
  render(row) {
    return h(NImage, {
      width: '40px',
      src: row.src,
    });
  },
};

const columns = [
  previewColumn,
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '更新时间',
    key: 'editTime',
  },
  {
    title: '是否公开',
    key: 'isPublic',
  },
  settingColumn,
];

function query(page, pageSize = 10, order = 'ascend', filterValues = []) {
  return new Promise((resolve) => {
    const copiedData = data.map((v) => v);
    const orderedData = order === 'descend' ? copiedData.reverse() : copiedData;
    const filteredData = filterValues.length
      ? orderedData.filter((row) => filterValues.includes(row.column2))
      : orderedData;
    const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize);
    const total = filteredData.length;
    const pageCount = Math.ceil(filteredData.length / pageSize);
    setTimeout(
      () =>
        resolve({
          pageCount,
          data: pagedData,
          total,
        }),
      1500
    );
  });
}

onMounted(() => {
  setActiveTab('project');
});

const dataRef = ref([]);
const loadingRef = ref(true);
const columnsRef = ref(columns);
const paginationReactive = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `共 ${itemCount} 项`;
  },
});

const rowKey = (rowData) => {
  return rowData.id;
};

const handlePageChange = (currentPage) => {
  if (!loadingRef.value) {
    loadingRef.value = true;
  }
};
</script>
<style lang="scss" scoped>
.active-tab {
  font-weight: bold;
}
</style>
