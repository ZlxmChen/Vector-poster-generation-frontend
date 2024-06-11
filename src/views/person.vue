<template>
  <div>
    <n-card
      title="个人信息"
      :bordered="false"
      style="margin-top: 20px; min-height: 700px; width: 600px"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
    >
      <template #header-extra>
        <n-tag :bordered="false" type="success">尊贵的高级用户</n-tag>
      </template>
      <div>
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 10px">个人头像</div>
        <n-avatar round :size="90" :src="userStore.user.avatarUrl" />
      </div>
      <divider></divider>
      <div>
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 10px">名称</div>
        <text>
          {{ userStore.user.username }}
        </text>
      </div>
      <divider></divider>
      <div>
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 10px">电子邮箱地址</div>
        <text>
          {{ userStore.user.email }}
        </text>
      </div>
      <divider></divider>
      <div>
        <div style="font-size: 15px; font-weight: bold; margin-bottom: 10px">性别</div>
        <text>
          {{ userStore.user.gender }}
        </text>
      </div>
      <template #footer>
        <div style="color: gray">
          您在{{ formatTimestamp(userStore.user.registerTime) }}加入了艺言
        </div>
      </template>
      <template #action><n-button strong secondary type="info">修改个人信息</n-button></template>
    </n-card>
  </div>
</template>

<script setup>
import { get, post } from '@/network/index';
import { formatTimestamp } from '@/utils/utils';
import { h, ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

function setUser() {
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
}
</script>

<style lang="scss" scoped></style>
