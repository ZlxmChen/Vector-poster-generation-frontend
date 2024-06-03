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
                  <div style="height: 220px">
                    <img :src="item.src" />
                  </div>
                </template>
                <div style="margin: auto; display: flex; margin-top: 10px">
                  <text style="margin: auto">{{ item.name }}</text>
                  <n-button
                    secondary
                    size="small"
                    style="margin-left: auto"
                    @click="recoverItem(item.id)"
                  >
                    恢复
                  </n-button>
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
  </div>
</template>
<script setup>
import { LayoutGrid, LayoutList } from '@vicons/tabler';
import { NIcon, NButton, NImage, NDropdown } from 'naive-ui';
import { get, post } from '@/network/index.js';

const renderIcon = (icon) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    });
  };
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
const activeTab = ref('project');

const setActiveTab = (key) => {
  activeTab.value = key;

  switch (key) {
    case 'project':
      get('/project/trash', {}, (res) => {
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
      }).then(() => {
        setCurFolder('all');
      });
      break;
    case 'template':
      get('/template/trash', {}, (res) => {
        dataRef.value = res.templateList.map((template) => ({
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
      }).then(() => {
        setCurFolder('all');
      });
      break;
    case 'element':
      get('/element/trash', {}, (res) => {
        dataRef.value = res.elementList.map((element) => ({
          id: element.id,
          name: element.elementName,
          src: element.elementUrl,
          isPublic: element.isPublic == 1 ? '公开' : '私有',
          folderId: element.folderId,
          editTime: element.creatTime,
          prompt: element.prompt,
        }));

        console.log(dataRef.value);
        loadingRef.value = false;
      }).then(() => {
        setCurFolder('all');
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

// 表格

const settingColumn = {
  title: '操作',
  key: 'opreation',
  render(row) {
    return h(
      NButton,
      {
        size: 'small',
        secondary: true,
        onClick: () => {
          recoverItem(row.id);
        },
      },
      { default: () => '恢复' }
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
  setActiveTab(activeTab.value);
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

function recoverItem(id) {
  post('/folder/recoverItem', { id: id, type: activeTab.value }, (res) => {
    console.log(res);
  });
  setActiveTab(activeTab.value);
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
