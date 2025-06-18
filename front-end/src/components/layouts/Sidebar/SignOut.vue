<template>
  <div class="sign-out">
    <el-menu
      background-color="transparent"
      text-color="var(--el-text-color-regular)"
      active-text-color="var(--el-color-primary-light-3)"
      :unique-opened="false"
      :collapse-transition="false"
      mode="vertical"
      :collapse="collapse"
    >
      <el-menu-item class="text-lg" @click="$emit('logout')" index="1">
        <sidebar-icon icon="logout" />
        <template #title>
          <span class="fs-16">{{ $t("Logout") }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
const props = defineProps({
  collapse: Boolean,
});
const emit = defineEmits(["logout"]);
</script>
<style lang="scss" scoped>
.sign-out {
  border-top: solid 1px var(--el-border-color-lighter);
  position: relative;
  width: 100%;
  height: 60px;
  text-align: center;
}
</style>
