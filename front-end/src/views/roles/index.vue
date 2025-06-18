<template>
  <div class="app-container">
    <el-row :gutter="10">
      <transition-group name="list">
        <el-col :xs="24" :sm="24" :md="16" key="content-1">
          <el-card class="no-border mb-2" shadow="hover">
            <template #header>
              <div class="flex !w-full items-center justify-between">
                <svg-icon name="roles" class="fs-23 mr-2"></svg-icon>
                <span class="font-bold">{{ $t("Roles management") }}</span>
                <div class="grow"></div>
                <el-tooltip :content="$t('Add role group')">
                  <el-button
                    circle
                    type="primary"
                    icon="Plus"
                    @click="addRoleGroup"
                  >
                  </el-button>
                </el-tooltip>
              </div>
            </template>
            <el-table class="mb-2" :data="roles" fill>
              <el-table-column
                type="index"
                :label="$t('No')"
                width="80"
                :align="'center'"
              />
              <el-table-column
                prop="roleName"
                :label="$t('Role name')"
                sortable
                min-width="170px"
              ></el-table-column>
              <el-table-column
                prop="description"
                :label="$t('Description')"
                sortable
                min-width="150px"
              ></el-table-column>
              <el-table-column
                prop="level"
                :label="$t('Role level')"
                sortable
                :align="'center'"
                min-width="150px"
              ></el-table-column>
              <el-table-column
                :label="$t('Actions')"
                :align="'center'"
                min-width="150px"
              >
                <template #default="scoped">
                  <el-tooltip :content="$t('Edit')" placement="top">
                    <el-button
                      text
                      icon="edit"
                      type="primary"
                      circle
                      @click="editRoleGroup(scoped)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip :content="$t('Delete')" placement="top">
                    <el-button
                      text
                      type="danger"
                      icon="Delete"
                      circle
                      @click="removeRoleGroup(scoped)"
                    >
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" key="content-2">
          <role-detail
            v-model:visible="dialogVisible.detail"
            @close="closeRoleDetail"
            @complete="getRoles"
            @updateTree="getScreens"
            @addScreen="addScreen"
            ref="roleDetailRef"
            :screens.sync="screens"
          ></role-detail>
        </el-col>
      </transition-group>
    </el-row>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import RoleDetail from "./role-detail.vue";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import { screen, role } from "@/api";

const roles = ref([]);
const dialogVisible = reactive({
  detail: false,
});
const roleDetailRef = ref(null);
const screens = ref([]);

onBeforeMount(() => {
  getRoles();
  getScreens();
});

async function getRoles() {
  const res = await role.getAllRoles();
  roles.value = res;
}

async function getScreens() {
  const res = await screen.getScreens();
  screens.value = getChildren(res);
  roleDetailRef.value.updateTree();
}

function getChildren(raws, parent) {
  const children = raws.filter((item) => {
    if (!parent) return !item.parent;
    return item.parent === parent;
  });
  children.forEach((item) => {
    item.children = getChildren(raws, item.id);
  });
  return children;
}

function addScreen(parent) {
  if (!parent) {
    screens.value.push({
      locked: false,
      name: null,
      action: null,
      children: [],
    });
  } else addChild(screens.value, parent);
}

function addChild(nodes, parent) {
  nodes.forEach((item) => {
    if (item.id === parent) {
      item.children.push({
        name: null,
        action: null,
        children: [],
      });
    } else {
      addChild(item.children, parent);
    }
  });
  screens.value = nodes;
}

function addRoleGroup() {
  roleDetailRef.value.assignFrom({}, [], true);
  dialogVisible.detail = true;
}

function closeRoleDetail() {
  dialogVisible.detail = false;
}

async function editRoleGroup(scoped) {
  const res = await role.getRoleById(scoped.row.id);
  const rights = res.screens.map((item) => item.screen && item.screen.id);
  roleDetailRef.value.assignFrom(scoped.row, rights, false);
  dialogVisible.detail = true;
}

async function removeRoleGroup(scoped) {
  await mainConfirm(t("Remove role group"));
  await role.deleteRoleGroup(scoped.row.id);
  messageSuccess(t("Remove role group successfully"));
  getRoles();
}
</script>
<style lang="scss" scoped>
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
