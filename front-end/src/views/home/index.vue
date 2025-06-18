<template>
  <div class="app-container">
    <el-row :gutter="30">
      <el-col
        v-for="tool in tools"
        :xs="8"
        :sm="4"
        :md="3"
        :lg="3"
        class="text-center"
      >
        <a :href="tool.url" target="_blank">
          <el-avatar
            icon="User"
            :size="70"
            fit="cover"
            :src="
              buildImageSrcWithAuth(
                constant.baseApi,
                tool.icon,
                auth.token.token
              )
            "
          ></el-avatar>
          <div class="pl-5 pr-5">
            {{ tool.name }}
          </div>
        </a>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { screen } from "@/api/index";
import constant from "@/configs/constant";
import { useAuthStore } from "@/store";
import { buildImageSrcWithAuth } from "@/utils/index";

const auth = useAuthStore();

const tools = ref([]);

onBeforeMount(async () => {
  await getTools();
});

async function getTools() {
  // Get only tools
  const res = await screen.getAccessedTools();
  tools.value = [...res];
  tools.value = tools.value.filter((item) => item.isTool);
}
</script>

<style lang="scss" scoped></style>
