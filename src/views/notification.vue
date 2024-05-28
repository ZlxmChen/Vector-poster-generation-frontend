<template>
  <div>
    <n-card title="通知中心" style="margin-top: 20px; min-height: 700px">
      <template #header-extra>
        <div style="margin-right: 20px; margin-top: 20px">
          <n-button v-if="isGetAllNoti" strong secondary type="info" @click="switchGetNotiState">
            仅查看未读通知
          </n-button>
          <n-button v-else strong secondary @click="switchGetNotiState">查看全部通知</n-button>
          <n-button
            strong
            secondary
            type="success"
            @click="readAll"
            style="margin-left: 20px"
            :disabled="unReadCnt === 0"
          >
            一键已读
          </n-button>
        </div>
      </template>
      <div>
        <n-tabs type="line" animated v-model:value="curActiveTab" @update:value="setActiveTab">
          <n-tab-pane name="all" tab="全部消息">
            <NotiDispaly
              @markAsRead="
                (id) => {
                  markAsRead(id);
                }
              "
              v-bind:data="filteredDataRef"
            />
          </n-tab-pane>
          <n-tab-pane name="system" tab="系统消息">
            <NotiDispaly
              @markAsRead="
                (id) => {
                  markAsRead(id);
                }
              "
              v-bind:data="filteredDataRef"
            />
          </n-tab-pane>
          <n-tab-pane name="user" tab="用户消息">
            <NotiDispaly
              @markAsRead="
                (id) => {
                  markAsRead(id);
                }
              "
              v-bind:data="filteredDataRef"
            />
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { get, post } from '@/network/index';
import NotiDispaly from './notifyDisplay';
const curActiveTab = ref('all');
const isGetAllNoti = ref(true);

onMounted(() => {
  getAllNotification(isGetAllNoti.value);
});

function setActiveTab() {
  getAllNotification(isGetAllNoti.value);
}

const dataRef = ref(null);
const filteredDataRef = ref(null);
const unReadCnt = ref(0);

function switchGetNotiState() {
  isGetAllNoti.value = !isGetAllNoti.value;
  getAllNotification(isGetAllNoti.value);
}

function getAllNotification(isGetAll) {
  if (isGetAll) {
    get('/notifications/getAllNotifications', {}, (res) => {
      dataRef.value = res.map((noti) => ({
        id: noti.id,
        title: noti.title,
        content: noti.content,
        type: noti.type,
        sentAt: noti.sentAt,
        isRead: noti.isRead,
      }));
    }).then(() => {
      filterByTab(curActiveTab.value);
    });
  } else {
    get('/notifications/getAllUnreadNotifications', {}, (res) => {
      dataRef.value = res.map((noti) => ({
        id: noti.id,
        title: noti.title,
        content: noti.content,
        type: noti.type,
        sentAt: noti.sentAt,
        isRead: noti.isRead,
      }));
    }).then(() => {
      filterByTab(curActiveTab.value);
    });
  }
}

function filterByTab(tab) {
  if (tab == 'all') filteredDataRef.value = dataRef.value;
  else filteredDataRef.value = dataRef.value.filter((noti) => noti.type == tab);
  unReadCnt.value = filteredDataRef.value.filter((noti) => noti.isRead == false).length;
}

function markAsRead(id) {
  post('/notifications/markAsRead', id, () => {
    getAllNotification(isGetAllNoti.value);
  });
}

function readAll() {
  post('/notifications/markAllAsRead', {}, () => {
    getAllNotification(isGetAllNoti.value);
  });
}
</script>

<style lang="scss" scoped></style>
