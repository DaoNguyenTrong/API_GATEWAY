<template>
  <i
    style="font-size: 23px"
    v-if="icon && icon.includes('el-icon')"
    :class="[icon, 'sub-el-icon']"
  ></i>
  <svg-icon
    style="font-size: 23px"
    v-if="icon && !icon.includes('el-icon')"
    :name="icon"
  />
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
