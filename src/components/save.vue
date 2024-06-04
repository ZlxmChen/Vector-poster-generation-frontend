<!-- * @LastEditTime: 2023-07-24 23:12:22

 * @LastEditTime: 2023-04-10 14:33:18
 * @Description: 保存文件
-->

<template>
  <div class="save-box">
    <Button style="margin-left: 10px" type="text" @click="beforeClear">
      {{ $t('empty') }}
    </Button>
    <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">
        {{ $t('keep') }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="clipboard">{{ $t('copy_to_clipboard') }}</DropdownItem>
          <DropdownItem name="saveImg">{{ $t('save_as_picture') }}</DropdownItem>
          <DropdownItem name="saveSvg">{{ $t('save_as_svg') }}</DropdownItem>
          <DropdownItem name="saveJson">{{ $t('save_as_json') }}</DropdownItem>
          <DropdownItem name="modifyProjectName" divided>{{ $t('save_project') }}</DropdownItem>
          <DropdownItem name="modifyTemplateName">{{ $t('save_template') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <Modal v-model="modal" title="输入名称" @on-ok="gotoSave" @on-cancel="cancel">
      <div style="display: flex; justify-content: center">
        <Input v-model="newName" placeholder="输入名称" style="width: 300px" />
      </div>
    </Modal>
  </div>
</template>

<script setup name="save-bar">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';

import { debounce } from 'lodash-es';
import { useI18n } from 'vue-i18n';
// import { downloadFile } from '@/utils/utils';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
const { t } = useI18n();
const modal = ref(false);
const type = ref(0);
const newName = ref('');
const { canvasEditor } = useSelect();
const cbMap = {
  clipboard() {
    canvasEditor.clipboard();
  },

  saveJson() {
    canvasEditor.saveJson();
  },

  saveSvg() {
    canvasEditor.saveSvg();
  },

  saveImg() {
    canvasEditor.saveImg();
  },
  modifyProjectName() {
    if (userStore.haveProject) this.saveProject();
    else modal.value = true;
    type.value = 0;
  },
  modifyTemplateName() {
    modal.value = true;
    type.value = 1;
  },
};

const saveWith = debounce(function (type) {
  cbMap[type] && typeof cbMap[type] === 'function' && cbMap[type]();
}, 300);
const gotoSave = () => {
  if (type.value == 0) {
    userStore.setEditingProjectName(newName.value);
    canvasEditor.saveProject();
  } else {
    canvasEditor.saveTemplate();
  }
};
/**
 * @desc clear canvas 清空画布
 */
const clear = () => {
  canvasEditor.clear();
};
const modifyName = () => {};
const beforeClear = () => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('clearTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => clear(),
  });
};
</script>

<style scoped lang="less">
.save-box {
  display: inline-block;
  padding-right: 10px;
}
</style>
