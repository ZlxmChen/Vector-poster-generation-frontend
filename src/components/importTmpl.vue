<!-- * @LastEditTime: 2024-02-06 16:35:45
 * @Description: 导入模板
-->

<template>
  <div>
    <div class="search-box">
      <Cascader
        :data="[allType, ...state.materialTypelist]"
        v-model="state.materialType"
        @on-change="handleChange"
      >
        <Button icon="ios-menu"></Button>
      </Cascader>
      <Input
        class="input"
        :placeholder="state.placeholder"
        v-model="state.search"
        search
        @on-change="search"
      />
    </div>
    <div :key="templateList.id" v-for="templateList in templateData">
      <Divider plain orientation="left">{{ templateList.folderName }}</Divider>
      <Tooltip
        :content="temp.label"
        v-for="(temp, i) in templateList.list"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <img
          class="tmpl-img"
          :alt="temp.templateName"
          v-lazy="temp.templateUrl"
          @click="beforeClearTipAPI(temp.id)"
        />
      </Tooltip>
    </div>

    <div :key="item.value" v-for="item in state.materialist">
      <Divider plain orientation="left">{{ item.label }}</Divider>
      <Tooltip
        :content="info.label"
        v-for="(info, i) in item.list"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <img
          class="tmpl-img"
          :alt="info.label"
          v-lazy="info.src"
          @click="beforeClearTip(info.tempUrl)"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script setup name="ImportTmpl" lang="ts">
import useSelect from '@/hooks/select';
import axios from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash-es';
import { get, post } from '@/network/index';
import { onMounted } from 'vue';
const { t } = useI18n();
const { canvasEditor }: { canvasEditor: any } = useSelect();
/**
 * template/all
 */

interface Datum {
  folderName: string;
  id: string;
  list: List[];
  [property: string]: any;
}

interface List {
  createTime: string;
  delete: boolean;
  fileUrl: null;
  folderId: string;
  id: string;
  isDelete?: number;
  isPublic?: number;
  public: boolean;
  templateName: string;
  templateUrl: string;
  userId: string;
  [property: string]: any;
}
interface Response {
  /**
   * template的json
   */
  data: Datum[];
  [property: string]: any;
}
const templateData = ref<Datum[]>([]);
onMounted(() => {
  get('/template/all', {}, (res: Response) => {
    console.log('/template/all');
    console.log(res);
    templateData.value = res.data;
  });
});
interface materialTypeI {
  value: string;
  label: string;
  list?: materialItemI[];
}

interface materialItemI {
  value: string;
  label: string;
  tempUrl: string;
  src: string;
}

const allType: materialTypeI = {
  value: '',
  label: '全部',
};

const state = reactive({
  search: '',
  placeholder: <undefined | string>'',
  jsonFile: <any>null,
  materialType: [''], // 选中分类
  materialTypelist: <materialTypeI[]>[], // 分类列表
  materialist: <materialTypeI[]>[], // 列表内容
});

// 获取素材分类
canvasEditor.getMaterialType('template').then((list: materialTypeI[]) => {
  state.materialTypelist = [...list];
  state.materialist = list;
});

// 插入文件
const insertSvgFile = () => {
  console.log(state.jsonFile);
  canvasEditor.insertSvgFile(state.jsonFile);
};

// 替换提示
const beforeClearTip = (tmplUrl: string) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(tmplUrl),
  });
};
const beforeClearTipAPI = (tmpId: string) => {
  post(
    '/template/data',
    { id: tmpId },
    (res: any) => {
      console.log(res);
      Modal.confirm({
        title: t('tip'),
        content: `<p>${t('replaceTip')}</p>`,
        okText: t('ok'),
        cancelText: t('cancel'),
        onOk: () => getTempData(res.file),
      });
    },
    (err) => {
      console.log('err:' + err);
    }
  );
};
// 获取模板数据
const getTempData = (tmplUrl: string) => {
  Spin.show({
    render: (h: any) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(tmplUrl);
  getTemp.then((res) => {
    state.jsonFile = JSON.stringify(res.data);
    Spin.hide();
    insertSvgFile();
  });
};
// 切换素材类型
const handleChange = (e: Event, item: [materialItemI]) => {
  // 搜索框文字设置
  const { label, value } = item[0];
  state.placeholder = label;
  state.search = '';
  filterTypeList(value);
};

// 模板搜索功能
const filterTypeList = (value: string) => {
  // 全部类型
  if (!value) {
    state.materialist = cloneDeep(state.materialTypelist);
  } else {
    // 当前分类详情
    const materialTypeInfoList =
      state.materialTypelist.filter((item) => item.value === value) || [];
    state.materialist = materialTypeInfoList;
  }

  // 展示分类
  if (state.search) {
    const list = cloneDeep(state.materialist);
    // 按照搜索内容展示
    state.materialist = list.map((item) => {
      if (item.list) {
        item.list = item.list.filter((info) => info.label.includes(state.search));
      }
      return item;
    });
  }
};

const search = () => {
  const [typeValue] = state.materialType;
  filterTypeList(typeValue);
};
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
}
.tmpl-img {
  width: 132px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
