<template>
  <Button type="text" @click="goHome">返回主页</Button>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const goHome = () => {
  router.push('/home').then(() => {
    location.reload();
  });
};
</script>

<style scoped lang="less"></style>
