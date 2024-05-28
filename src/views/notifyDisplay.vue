<template>
  <div v-if="props.data != null && props.data.length != 0">
    <n-card
      v-for="item in props.data"
      style="margin-bottom: 16px"
      :title="item.title"
      :key="item.id"
    >
      <template #header-extra>
        <n-tag v-if="item.isRead" :bordered="false" type="success">
          <text style="font-weight: 500">已读</text>
          <template #icon>
            <n-icon :component="CheckmarkCircle" />
          </template>
        </n-tag>
        <n-button v-else strong secondary @click="$emit('markAsRead', item.id)">设为已读</n-button>
      </template>
      {{ item.content }}
      <template #footer>{{ item.sentAt }}</template>
    </n-card>
  </div>
  <div v-else>
    <text style="margin-top: 20px">暂无通知</text>
  </div>
</template>

<script setup>
import { CheckmarkCircle } from '@vicons/ionicons5';
const props = defineProps(['data']);
defineEmits(['markAsRead']);
</script>

<style lang="scss" scoped></style>
