<template>
  <div class="sidebar-container has-logo">
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
        background-color="transparent"
        text-color="var(--el-text-color-secondary)"
        active-text-color="var(--el-color-primary-light-3)"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <SignOut :collapse="isCollapse" @logout="logout" />
    <div class="pos-absolute toggle-button">
      <el-button
        circle
        type="primary"
        @click="app.toggleSidebar"
        :class="{ 'rotate-180': !app.sidebar }"
        size="small"
      >
        <font-awesome-icon icon="fa-solid fa-angles-left" />
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useAppStore, usePermissionStore, useAuthStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { mainConfirm } from "@/utils/message";
import { t } from "i18next";

const app = useAppStore();
const auth = useAuthStore();
const permissionStore = usePermissionStore();
const route = useRoute();

const permission_routes = computed(() => {
  return permissionStore.routes;
});

const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});

const isCollapse = computed(() => !app.sidebar);

async function logout() {
  await mainConfirm(t("Logout"));
  await auth.logout();
}
</script>
<style scoped>
.test {
  color: #94abbb;
}

.toggle-button {
  border: 7px solid var(--el-bg-color) !important;
  right: -17px;
  bottom: 50px;
  border-radius: 20px;
  font-weight: bold;
  background-color: var(--el-bg-color) !important;
}
</style>
