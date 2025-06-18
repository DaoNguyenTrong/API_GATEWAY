<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/"
    v-if="app.device !== 'mobile'"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ $t(item.meta.title) }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{
          $t(item.meta.title)
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store";

const route = useRoute();
const router = useRouter();
const levelList = ref(null);
const app = useAppStore();

watch(
  () => route.fullPath,
  () => {
    // if you go to the redirect page, do not update the breadcrumbs
    if (route.path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

onBeforeMount(() => getBreadcrumb());

function getBreadcrumb() {
  // only show routes with meta.title
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  const first = matched[0];
  if (!isHome(first)) {
    matched = [{ path: "/dashboard", meta: { title: "Dashboard" } }].concat(
      matched
    );
  }
  levelList.value = matched.filter(
    (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );
}

function isHome(route) {
  const name = route && route.name;
  if (!name) {
    return false;
  }
  return name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase();
}

function handleLink(item) {
  const { redirect, path } = item;
  if (redirect) {
    router.push({ path: redirect });
    return;
  }
  router.push({ path: path });
}
</script>
<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
