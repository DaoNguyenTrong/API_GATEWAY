<template>
  <el-form
    :model="form"
    label-position="left"
    label-width="190px"
    ref="formRef"
    inline-message
  >
    <el-card shadow="hover" class="no-border">
      <template #header>
        <div class="flex !w-full items-center justify-between">
          <div class="flex">
            <span class="font-bold">
              {{ isAdd ? $t("Add role group") : $t("Update role group") }}
            </span>
          </div>
          <div class="space"></div>
          <el-button text type="success" @click="onSubmitForm">
            {{ isAdd ? $t("Create new") : $t("Update") }}
          </el-button>
          <el-tooltip :content="$t('Close')">
            <el-button
              circle
              icon="Close"
              @click="$emit('close')"
              text
              size="small"
            >
            </el-button>
          </el-tooltip>
        </div>
      </template>
      <el-form-item prop="roleName" required :label="`${$t('Role name')}:`">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item prop="level" required :label="`${$t('Role level')}:`">
        <el-input v-model="form.level"></el-input>
      </el-form-item>
      <el-form-item
        prop="description"
        required
        :label="`${$t('Description')}:`"
      >
        <el-input
          v-model="form.description"
          type="textarea"
          show-word-limit
          :autosize="{ minRows: 5 }"
          :rows="5"
        ></el-input>
      </el-form-item>
      <div class="mb-2">
        {{ $t("Screen permissions") }}:
        <el-button
          link
          icon="CirclePlus"
          type="info"
          @click="addScreen()"
        ></el-button>
      </div>
      <el-tree
        :key="reRenderTree"
        :data="screens"
        show-checkbox
        node-key="id"
        class="large-tree"
        :default-checked-keys="rights"
        ref="treeRef"
        accordion
        @check-change="currentNodeChange"
      >
        <template #default="{ data, node }">
          <span class="custom-tree-node">
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
                @click="updateScreen(data, node)"
                link
                icon="Edit"
                type="warning"
              ></el-button>

              <el-button
                @click="addScreen(data.id)"
                link
                icon="CirclePlus"
                type="info"
              ></el-button>
              <el-button
                link
                icon="Close"
                type="danger"
                @click="removeScreen(data.id)"
              >
              </el-button>
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>
    <ScreenDialog
      v-model="dialogVisible.screen"
      :parent="parent"
      :screen="selected"
      @complete="completeScreenDialog"
    />
  </el-form>
</template>
<script setup>
import { ref, shallowRef, shallowReactive } from "vue";
import { t } from "i18next";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { createRole, updateRoleGroup } from "@/api/authorization/role-groups";
import { screen } from "@/api/index";
import ScreenDialog from "./screen-dialog.vue";

const props = defineProps({
  visible: Boolean,
  screens: { type: Array, default: [] },
});
const emit = defineEmits(["close", "complete", "updateTree", "addScreen"]);
const treeRef = ref(null);
const isAdd = shallowRef(true);
const form = ref({});
const formRef = ref(null);
const reRenderTree = shallowRef(false);
const rights = shallowRef([]);
const dialogVisible = shallowReactive({ screen: false });
const selected = ref({});
const parent = ref(null);

function assignFrom(obj, listAccessed = [], add = true) {
  isAdd.value = add;
  form.value = { ...obj };
  formRef.value.resetFields();
  reRenderTree.value = !reRenderTree.value;
  rights.value = [...listAccessed];
}

async function onSubmitForm() {
  const valid = await formRef.value.validate();
  if (valid) {
    await mainConfirm(
      isAdd.value ? t("Create new role group") : t("Update role group")
    );
    const checkedNode = treeRef.value.getCheckedNodes();
    const roleRight = createRoleRight(checkedNode);
    if (isAdd.value) {
      await createRole(form.value, roleRight);
      messageSuccess(t("Create role group successfully"));
    } else {
      await updateRoleGroup(form.value.id, form.value, roleRight);
      messageSuccess(t("Update role group successfully"));
    }
    emit("complete");
  }
}

function changeLockStatus() {}

function addScreen(id) {
  dialogVisible.screen = true;
  parent.value = id || null;
  selected.value = {};
}

function updateScreen(data, node) {
  selected.value = { ...data };
  dialogVisible.screen = true;
}

function createRoleRight(checkedNode) {
  return checkedNode.map((node) => node.id);
}

function completeScreenDialog() {
  selected.value = {};
  emit("updateTree");
}

function updateTree() {
  reRenderTree.value = !reRenderTree.value;
}

async function removeScreen(id) {
  await mainConfirm(t("Remove screen"));
  await screen.deleteScreen(id);
  messageSuccess(t("Remove screen successfully"));
  emit("updateTree");
}

function currentNodeChange() {
  const checkedNode = treeRef.value.getCheckedNodes();
  rights.value = checkedNode.map((item) => item.id);
}

defineExpose({
  assignFrom,
  updateTree,
});
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  &:hover {
    .actions {
      visibility: visible;
    }
  }
  .actions {
    visibility: hidden;
  }
}
</style>
