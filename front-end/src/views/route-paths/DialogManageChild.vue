<template>
  <dialog-template v-model="visible" :width="700" destroy-on-close>
    <template #header>
      <h3 class="text-lg font-medium">{{ $t("Manage child") }}</h3>
    </template>
    <el-card shadow="never" class="no-border dense my-3">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm text-gray-500">{{ parent.name }}</span>
        <el-tooltip
          :content="$t('Add child')"
          placement="top"
          :show-after="300"
        >
          <el-button
            icon="CirclePlus"
            type="primary"
            @click="addRoutePath(parent)"
            size="small"
          >
          </el-button>
        </el-tooltip>
      </div>
      <el-divider class="dense"></el-divider>
      <el-tree
        :data="children"
        node-key="id"
        class="large-tree"
        ref="treeRef"
        accordion
        :key="reRenderTree"
      >
        <template #default="{ data, node }">
          <span class="flex items-center justify-between !w-full">
            <span>
              {{ data.name }}
              <el-tooltip
                placement="top"
                :content="$t('Screen corresponds to a tool')"
                v-if="data.isTool"
              >
                <el-icon>
                  <Tools />
                </el-icon>
              </el-tooltip>
            </span>
            <span class="actions">
              <el-button
                @click.stop="updateRoutePath(data)"
                link
                icon="Edit"
                type="warning"
              ></el-button>
              <el-button
                @click.stop="addRoutePath(data)"
                link
                icon="CirclePlus"
                type="primary"
              ></el-button>
              <el-button
                @click.stop="removeRoutePath(data._id)"
                link
                icon="Close"
                type="danger"
              >
              </el-button>
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
    <dialog-add-path ref="dialogAddPathRef" />
  </dialog-template>
</template>

<script setup>
import routePathApi from "@/api/authorization/route-path-api";
import { nextTick } from "vue";
import { shallowRef, ref } from "vue";
import DialogAddPath from "./DialogAddPath.vue";
import { boxConfirm } from "@/utils/message";
import { t } from "i18next";

const visible = shallowRef(false);

const parent = ref(null);
const open = async (row) => {
  visible.value = true;
  parent.value = { ...row };
  await nextTick();
  await getPathChildren();
};

const children = ref([]);
const reRenderTree = shallowRef(0);
const getPathChildren = async () => {
  const res = await routePathApi.getPathChildren(parent.value.id);
  children.value = res.children;
  reRenderTree.value++;
};

const dialogAddPathRef = shallowRef(null);
const addRoutePath = async (row) => {
  await dialogAddPathRef.value.open({
    parentId: row.id || row._id,
    path: row.path,
  });
  await nextTick();
  await getPathChildren();
};

const updateRoutePath = async (data) => {
  await dialogAddPathRef.value.open(data);
  await nextTick();
  await getPathChildren();
};

const removeRoutePath = async (id) => {
  await boxConfirm(t("Are you sure you want to delete this path?"));
  await routePathApi.deleteRoutePath(id);
  await getPathChildren();
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
