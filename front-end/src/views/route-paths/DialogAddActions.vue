<template>
  <dialog-template
    v-model="visible"
    :width="500"
    destroy-on-close
    @close="handleClose"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ $t("Add actions") }}</h3>
      </div>
    </template>
    <el-card shadow="never" class="no-border dense my-3">
      <el-tree
        :data="screens"
        show-checkbox
        node-key="id"
        class="large-tree"
        ref="treeRef"
        accordion
        :default-checked-keys="rights"
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
import { screen } from "@/api";
import routePathScreenApi from "@/api/authorization/route-path-screen-api";
import { nextTick, shallowRef } from "vue";
import { t } from "i18next";
import { messageSuccess } from "@/utils/message";

const visible = shallowRef(false);
const routePath = shallowRef({});

const open = async (row) => {
  visible.value = true;
  routePath.value = { ...row };
  if (routePath.value._id) {
    routePath.value.id = routePath.value._id;
    delete routePath.value._id;
  }
  await nextTick();
  await getScreens();
  await getRights(row);
};

const screens = ref([]);
const getScreens = async () => {
  const res = await screen.getScreens({
    limit: 1000,
  });
  screens.value = getChildren(res);
};

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
const getRights = async (row) => {
  const res = await routePathScreenApi.getPathByRoutePathId(row.id);
  rights.value = res.map((item) => item.screen.id);
  treeRef.value.setCheckedKeys(rights.value);
};

const treeRef = ref([]);

const handleCheck = async () => {
  const checkedNode = treeRef.value.getCheckedNodes();
  rights.value = checkedNode.map((item) => item.id);
};

const handleSubmit = async () => {
  const payload = rights.value.map((item) => ({
    routePath: routePath.value.id,
    screen: item,
  }));
  await routePathScreenApi.createMultipleRoutePathScreen({ data: payload });
  messageSuccess(t("Add actions successfully"));
  visible.value = false;
};

const handleClose = () => {
  rights.value = [];
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
