<template>
  <div class="flex-c-m hov-pointer text-white">
    <el-avatar :src="src" :size="size" fit="cover" class="mr-2 border-primary" icon="User">
      <span>{{ name[0] || "" }}</span>
    </el-avatar>
    <span v-if="showName" class="text-white">{{ name }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  src: String,
  size: Number,
  name: { type: String, default: "" },
  showName: { type: Boolean, default: true },
});
</script>
