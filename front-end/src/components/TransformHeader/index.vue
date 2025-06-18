<template>
  <div
    class="transform-header-container border-radius-base border pt-5 pr-5 pl-5"
    :style="{ 'background-color': bg }"
  >
    <span
      class="transform-header pl-2 pr-2 fs-14"
      :style="{ 'background-color': bg }"
    >
      <svg-icon :name="icon" v-if="icon"></svg-icon>
      {{ header }}
    </span>
    <slot></slot>
  </div>
</template>
<script setup>
defineProps({
  header: { type: String, default: "" },
  icon: String,
  bg: { type: String, default: "var(--el-bg-color-overlay)" },
});
</script>
<style lang="scss" scoped>
.transform-header-container {
  .transform-header {
    position: absolute;
    transform: translateY(-32px);
  }
}
</style>
