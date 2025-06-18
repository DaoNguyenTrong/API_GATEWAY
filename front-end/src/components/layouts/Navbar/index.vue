<template>
  <div class="navbar flex-m">
    <Logo />
    <hamburger
      id="hamburger-container"
      :isActive="app.sidebar"
      class="hamburger-container ml-5 color-text-white"
      @toggleClick="app.toggleSidebar()"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container light"
      v-if="app.device !== 'mobile'"
    />
    <div class="space"></div>

    <!-- <tour-guide class="mr-3" /> -->
    <theme-switch class="mr-3" />
    <!-- <notification class="mr-10" /> -->
    <change-language class="mr-3" />

    <el-dropdown trigger="click">
      <Avatar
        :name="auth.userInform.name || ''"
        :showName="app.device !== 'mobile'"
        :src="avatar"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <router-link to="/">
            <el-dropdown-item>{{ $t("Dashboard") }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="showUpdateInfo()" divided>
            <span style="display: block">{{ $t("Account information") }}</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="dialogVisible.password = true">
            <span style="display: block">{{ $t("Change password") }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">{{ $t("Logout") }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <update-info v-model="dialogVisible.info" ref="infoRef"></update-info>
    <change-password v-model="dialogVisible.password"></change-password>
  </div>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppStore, useAuthStore } from "@/store/index";
import { buildFileUrl } from "@/api";
import constant from "@/configs/constant";

const router = useRouter();
const app = useAppStore();
const auth = useAuthStore();

const dialogVisible = reactive({ info: false, password: false });
const infoRef = ref(null);

const avatar = computed(() => {
  if (auth.userInform.avatar) {
    return buildFileUrl(auth.userInform.avatar.path, auth.token.token);
  } else {
    return "";
  }
});

function showUpdateInfo() {
  dialogVisible.info = true;
  infoRef.value.setForm(auth.userInform);
}

async function logout() {
  await auth.logout();
}
</script>
