<template>
  <dialog-template v-model="visible" :width="500" destroy-on-close>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ $t("Restrict key") }}</h3>
      </div>
    </template>
    <el-card class="my-3 no-border" shadow="never">
      <el-tree
        :data="screens"
        show-checkbox
        node-key="id"
        class="large-tree"
        :default-checked-keys="rights"
        ref="treeRef"
        accordion
        @check-change="handleCheck"
      >
        <template #default="{ data, node }">
          <span class="custom-tree-node">
            <span>
              {{ data.name }}
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
    <div class="flex justify-end">
      <el-button type="danger" class="no-bg" @click="visible = false">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ $t("Submit") }}
      </el-button>
    </div>
  </dialog-template>
</template>

<script setup>
import { shallowRef, ref } from "vue";
import { screen } from "@/api";
import apiKeyScreenApi from "@/api/authorization/api-key-screen-api";
import { messageSuccess } from "@/utils/message";
import { t } from "i18next";

const visible = shallowRef(false);

const apiKey = ref(null);

const show = async (keyData) => {
  visible.value = true;
  await getScreen();
  apiKey.value = keyData;
  await getRights();
};

const screens = ref([]);
const getScreen = async () => {
  const res = await screen.getScreens({
    limit: 1000,
  });
  screens.value = getChildren(res);
};

const treeRef = ref([]);

const getChildren = (raws, parent) => {
  const children = raws.filter((item) => {
    if (!parent) return !item.parent;
    return item.parent === parent;
  });
  children.forEach((item) => {
    item.children = getChildren(raws, item.id);
  });
  return children;
};

const rights = ref([]);
const getRights = async () => {
  const res = await apiKeyScreenApi.getApiKeyScreenByApiKeyId(apiKey.value.id);
  rights.value = res.map((item) => item.screen);
};

const handleCheck = async () => {
  const checkedNode = treeRef.value.getCheckedNodes();
  rights.value = checkedNode.map((item) => item.id);
};

const handleSubmit = async () => {
  const payload = {
    data: rights.value.map((item) => ({
      apiKey: apiKey.value.id,
      screen: item,
    })),
  };
  await apiKeyScreenApi.createMultipleApiKeyScreen(apiKey.value.id, payload);
  messageSuccess(t("Restrict key successfully"));
};

defineExpose({
  show,
});
</script>

<style lang="scss" scoped></style>
