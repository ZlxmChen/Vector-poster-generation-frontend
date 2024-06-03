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
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <!-- 收起状态 -->
          <div v-if="collapsed">
            <div style="height: 85vh; overflow-y: auto; overflow-x: hidden">
              <n-menu
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="folderData"
                @update:value="
                  (key, item) => {
                    setCurFolder(key);
                  }
                "
                :render-label="renderMenuLabel"
                :render-icon="renderMenuIcon"
              />
            </div>
          </div>
          <!-- 打开状态 -->
          <div v-else>
            <div style="display: flex; margin: 5px; margin-bottom: 20px">
              <text style="font-size: 16px">我的文件夹</text>
            </div>
            <div style="height: 80vh; overflow-y: auto; overflow-x: hidden">
              <div v-for="item in folderData" :key="item.key">
                <div>
                  <div style="display: flex; align-items: center; margin-bottom: 5px">
                    <!-- 文件夹图标 -->
                    <n-button
                      @click="setCurFolder(item.key)"
                      :secondary="curFolderRef === item.key"
                      :strong="curFolderRef === item.key"
                      :quaternary="curFolderRef !== item.key"
                    >
                      <template #icon>
                        <n-icon>
                          <AlignJustified v-if="item.key === 'all'" />
                          <Folder v-else />
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
                    <!-- 文件夹操作 -->
                    <div v-if="item.key != 'all'" style="margin-left: auto">
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
                    <div v-else style="margin-left: auto">
                      <n-button quaternary @click="createFolder">
                        <n-icon size="16">
                          <FolderPlus />
                        </n-icon>
                      </n-button>
                    </div>
                  </div>
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
            :data="filteredDataRef"
            :loading="loadingRef"
            :row-key="rowKey"
          />
          <div v-else>
            <div v-if="filteredDataRef.length != 0" class="card-container">
              <n-card
                v-for="item in filteredDataRef"
                :key="item.id"
                hoverable
                style="height: 250px"
              >
                <template #cover>
                  <div style="height: 210px">
                    <img :src="item.src" />
                  </div>
                </template>
                <div style="margin: auto; display: flex; margin-top: 10px">
                  <text style="margin-top: auto">{{ item.name }}</text>
                  <n-dropdown
                    trigger="hover"
                    placement="bottom-start"
                    :options="detailOptions"
                    @select="
                      (key) => {
                        curDealItemId = item.id;
                        handleDetailSelect(key);
                      }
                    "
                  >
                    <n-button quaternary size="small" style="margin-left: auto">
                      <n-icon><Dots /></n-icon>
                    </n-button>
                  </n-dropdown>
                </div>
              </n-card>
            </div>
            <text v-else style="margin-top: 20px; margin-bottom: 20px; margin-left: 20px">
              无数据
            </text>
          </div>
          <n-pagination
            style="display: flex; justify-content: center; margin-top: 20px"
            v-model:page="page"
            :page-count="pageCount"
            @update:page="filterDataByPage"
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
    <n-modal
      preset="dialog"
      title="删除"
      type="error"
      content="删除后将永远无法恢复。"
      positive-text="确认"
      negative-text="取消"
      @positive-click="deleteItem()"
      @negative-click="onNegativeClick"
      v-model:show="deleteModal"
    ></n-modal>
    <n-modal v-model:show="moveFolderModal">
      <n-card
        style="width: 600px"
        title="移动至"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-select v-model:value="move2folder" :options="folderData" />
        <div style="display: flex; justify-content: flex-end; margin-top: 20px">
          <n-button size="small" style="margin-right: 10px" @click="moveFolderModal = false">
            取消
          </n-button>
          <n-button type="primary" size="small" @click="moveItem">确定</n-button>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>
<script setup>
import {
  LayoutGrid,
  LayoutList,
  FolderPlus,
  Dots,
  Folder,
  Check,
  AlignJustified,
} from '@vicons/tabler';
import { NIcon, NButton, NImage, NDropdown } from 'naive-ui';
import { get, post } from '@/network/index.js';

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

const renderMenuIcon = (option) => {
  return h(NIcon, null, {
    default: () => {
      if (option.key === 'all') {
        return h(AlignJustified);
      } else {
        return h(Folder);
      }
    },
  });
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
    key: 'element',
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

const detailOptions = [
  {
    label: '移动',
    key: 'move',
  },
  {
    label: '切换',
    key: 'switch',
  },
  {
    label: '删除',
    key: 'delete',
  },
];

const activeTab = ref('project');

const setActiveTab = (key, folder = 'all') => {
  activeTab.value = key;

  switch (key) {
    case 'project':
      get(
        '/project/folder',
        {},
        (res) => {
          folderData.value = [
            { key: 'all', label: '全部' },
            ...res.folderList.map((folder) => ({
              key: folder.id,
              value: folder.id,
              label: folder.folderName,
            })),
          ];
          console.log(folderData.value);
        },
        errorHandler
      );
      get(
        '/project/my',
        {},
        (res) => {
          dataRef.value = res.projectList.map((project) => ({
            id: project.id,
            name: project.projectName,
            src: project.projectUrl,
            isPublic: project.isPublic == 1 ? '公开' : '私有',
            fileUrl: project.fileUrl,
            editTime: project.editTime,
          }));

          console.log(dataRef.value);
          loadingRef.value = false;
        },
        errorHandler
      ).then(() => {
        setCurFolder(folder);
      });
      break;
    case 'template':
      get(
        '/template/folder',
        {},
        (res) => {
          folderData.value = [
            { key: 'all', label: '全部' },
            ...res.folderList.map((folder) => ({
              key: folder.id,
              value: folder.id,
              label: folder.folderName,
            })),
          ];
          console.log(folderData.value);
        },
        errorHandler
      );
      get(
        '/template/my',
        {},
        (res) => {
          dataRef.value = res.list.map((template) => ({
            id: template.id,
            name: template.templateName,
            src: template.templateUrl,
            folderId: template.folderId,
            isPublic: template.isPublic == 1 ? '公开' : '私有',
            fileUrl: template.fileUrl,
            editTime: template.createTime,
          }));

          console.log(dataRef.value);
          loadingRef.value = false;
        },
        errorHandler
      ).then(() => {
        setCurFolder(folder);
      });
      break;
    case 'element':
      get(
        '/element/folder',
        {},
        (res) => {
          folderData.value = [
            { key: 'all', label: '全部' },
            ...res.folderList.map((folder) => ({
              key: folder.id,
              value: folder.id,
              label: folder.folderName,
            })),
          ];

          console.log(folderData.value);
        },
        errorHandler
      );
      get(
        '/element/my',
        {},
        (res) => {
          dataRef.value = res.elementList.map((element) => ({
            id: element.id,
            name: element.elementName,
            src: element.elementUrl,
            isPublic: element.isPublic == 1 ? '公开' : '私有',
            folderId: element.folderId,
            editTime: element.createTime,
            prompt: element.prompt,
          }));
          console.log(dataRef.value);
          loadingRef.value = false;
        },
        errorHandler
      ).then(() => {
        setCurFolder(folder);
      });
      break;
    default:
      console.log('unknown tab key!');
  }
};

const activeLayout = ref('grid');
const setActiveLayout = (key) => {
  activeLayout.value = key;
};

const collapsed = ref(false);

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

const curDealItemId = ref(null);
const moveFolderModal = ref(false);
const deleteModal = ref(false);
const move2folder = ref(null);
function handleDetailSelect(key) {
  switch (key) {
    case 'move':
      return (moveFolderModal.value = true);
    case 'switch':
      return switchStatus();
    case 'delete':
      return (deleteModal.value = true);
  }
}

function deleteItem() {
  post('/folder/delItem', { id: curDealItemId.value, type: activeTab.value }, (res) => {
    console.log(res);
  }).then(() => {
    setActiveTab(activeTab.value, curFolderRef.value);
  });
}

function moveItem() {
  moveFolderModal.value = false;
  post(
    '/folder/move',
    {
      id: curDealItemId.value,
      type: activeTab.value,
      folderId: move2folder.value,
    },
    (res) => {
      console.log(res);
    }
  ).then(() => {
    setActiveTab(activeTab.value, curFolderRef.value);
  });
}

const renameString = ref(null);
function renameFolder() {
  console.log(renameString.value);
  post('/folder/rename', { id: curDealFoldId.value, name: renameString.value }, (res) => {
    console.log(res);
  });
  const item = folderData.value.find((folder) => folder.key === curDealFoldId.value);
  item.label = renameString.value;
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
      NDropdown,
      {
        trigger: 'hover',
        placement: 'bottom-start',
        options: detailOptions,
        onSelect: (key) => {
          curDealItemId.value = row.id;
          handleDetailSelect(key);
        },
      },
      {
        default: () =>
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              style: { marginLeft: 'auto' },
            },
            {
              default: () =>
                h(NIcon, null, {
                  default: () => h(Dots),
                }),
            }
          ),
      }
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

onMounted(() => {
  setActiveTab('project');
});

const dataRef = ref([]);
const filteredDataRef = ref([]);
const folderDataRef = ref([]);
const loadingRef = ref(true);
const columnsRef = ref(columns);
const page = ref(1);
const pageSize = 10;
const pageCount = ref(1);

const curFolderRef = ref('all');

function setCurFolder(key) {
  curFolderRef.value = key;
  filterData(key);
}

function filterData(key) {
  if (key === 'all') {
    folderDataRef.value = dataRef.value;
  } else {
    folderDataRef.value = dataRef.value.filter((item) => item.folderId === key);
  }
  page.value = 1;
  pageCount.value = Math.ceil(folderDataRef.value.length / pageSize);
  filterDataByPage();
}

function filterDataByPage() {
  const startIndex = (page.value - 1) * pageSize;
  const endIndex = page.value * pageSize;
  filteredDataRef.value = folderDataRef.value.slice(startIndex, endIndex);
}

const rowKey = (rowData) => {
  return rowData.id;
};

function deleteFold() {
  post('/folder/delete', { id: curDealFoldId.value }, (res) => {
    console.log(res);
    delFoldModel.value = false;
  });
  setActiveTab(activeTab.value);
}

function createFolder() {
  post('/folder/new', { type: activeTab.value }, (res) => {
    console.log(res);
  }).then(() => {
    setActiveTab(activeTab.value, curFolderRef.value);
  });
}

function switchStatus() {
  post('/folder/switch', { id: curDealItemId.value, type: activeTab.value }, (res) => {
    console.log(res);
  }).then(() => {
    setActiveTab(activeTab.value, curFolderRef.value);
  });
}

function errorHandler(msg) {
  console.log(msg);
}
</script>
<style lang="scss" scoped>
.active-tab {
  font-weight: bold;
}
.card-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 30px; /* 只设置卡片之间的垂直间距 */
  column-gap: 16px; /* 只设置卡片之间的水平间距，可以根据需要调整 */
}
</style>
