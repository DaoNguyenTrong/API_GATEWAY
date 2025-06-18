<template>
  <el-tooltip placement="top" :content="tooltip">
    <el-button
      circle
      :type="type"
      :icon="icon"
      class="floating-button"
      size="large"
      @click="$emit('buttonClick')"
    ></el-button>
  </el-tooltip>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: "primary" },
  icon: { type: String, default: "Plus" },
  tooltip: String,
});
const emit = defineEmits(["buttonClick"]);
</script>

<style lang="scss" scoped>
.floating-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
}
</style>
