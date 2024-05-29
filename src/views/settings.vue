<template>
  <div class="settings-container">
    <n-button type="warning" @click="logout">退出登录</n-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const logout = () => {
  localStorage.removeItem('Token');
  router.push('login');
};
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 20px;
}
</style>
