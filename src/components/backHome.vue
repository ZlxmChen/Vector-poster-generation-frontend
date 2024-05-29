<template>
  <Button type="text" @click="goHome">返回主页</Button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
import { useUserStore } from '@/stores/userStore.ts';
const userStore = useUserStore();
const goHome = () => {
  router.push('/home').then(() => {
    userStore.cleanEditingProject();
    location.reload();
  });
};
</script>

<style scoped lang="less"></style>
