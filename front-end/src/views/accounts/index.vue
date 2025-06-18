<template>
  <div class="app-container">
    <filter-panel
      :label="$t('Accounts management')"
      icon="users"
      v-model:search="search"
      v-model:firstFilter="filter.roleId"
      :firstOptions="roleOptions"
      :firstPlaceholder="$t('Role group')"
      @addNew="addUser"
      @update:firstFilter="queryUsers"
      @update:search="searchChange"
    ></filter-panel>
    <el-card shadow="never" class="no-border">
      <table-template
        v-model:pagination="pagination"
        :data="users"
        :columns="columns"
        @update:pagination="paginationChange"
        @sortChange="sortChange"
        max-height="calc(100vh - 300px)"
        class="!w-full"
      >
        <template #status="scope">
          <el-button
            :icon="scope.data.row.status ? 'CircleCheck' : 'CircleClose'"
            :type="scope.data.row.status ? 'success' : 'danger'"
            size="small"
            text
            @click="changeAccountStatus(scope.data)"
          >
            {{ scope.data.row.status ? $t("Active") : $t("Locked") }}
          </el-button>
        </template>
        <template #avatar="scope">
          <el-avatar
            icon="User"
            :size="40"
            fit="cover"
            :src="buildAvatarSource(scope)"
            class="fs-16 hov-pointer"
          ></el-avatar>
        </template>
        <template #roleId="scope"> {{ getRole(scope) }}</template>
        <template #accessAllProject="scope">
          <el-button
            :icon="
              scope.data.row.accessAllProject ? 'CircleCheck' : 'CircleClose'
            "
            :type="scope.data.row.accessAllProject ? 'success' : 'danger'"
            size="small"
            text
            @click="toggleAccessAllProject(scope.data)"
          >
            {{
              scope.data.row.accessAllProject
                ? $t("Accessible")
                : $t("Inaccessible")
            }}
          </el-button>
        </template>

        <template #actions="scope">
          <el-tooltip :content="$t('Edit')">
            <el-button
              text
              bg
              type="warning"
              @click="editAccount(scope.data)"
              size="small"
            >
              <svg-icon name="edit"></svg-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip :content="$t('Change password')">
            <el-button
              text
              bg
              type="primary"
              @click="changeAccountPassword(scope.data)"
              size="small"
            >
              <svg-icon name="shield"></svg-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip :content="$t('Delete')">
            <el-button
              text
              bg
              type="danger"
              @click="deleteAccount(scope.data)"
              size="small"
            >
              <svg-icon name="trash"></svg-icon>
            </el-button>
          </el-tooltip>
        </template>
      </table-template>
    </el-card>
    <change-password
      v-model:visible="dialogVisible.changePassword"
      ref="changePasswordRef"
    />
    <add-account
      v-model:visible="dialogVisible.add"
      @complete="completeChangeUser"
      :departments="departments"
    ></add-account>
    <update-account
      v-model:visible="dialogVisible.update"
      :selected="selected"
      @complete="completeChangeUser"
      :departments="departments"
    ></update-account>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onBeforeMount, shallowRef } from "vue";
import { t } from "i18next";
import { useAppStore, useAuthStore, useOptionsStore } from "@/store";
import columns from "./columns";
import userApi from "@/api/user";
import { useRouter, useRoute } from "vue-router";
import { mainConfirm, messageSuccess } from "@/utils/message";
import ChangePassword from "./change-password.vue";
import { buildFileUrl } from "@/api";
import AddAccount from "./add-account.vue";
import UpdateAccount from "./update-account.vue";
import constant from "@/configs/constant";

const router = useRouter();
const route = useRoute();
const app = useAppStore();
const auth = useAuthStore();
const options = useOptionsStore();
const users = ref([]);
const changePasswordRef = ref(null);
const selected = ref({});
const departments = shallowRef([]);

const dialogVisible = reactive({
  detail: false,
  changePassword: false,
  add: false,
  update: false,
});
const filter = reactive({
  roleId: "",
  type: "",
});
const search = ref("");
const roleOptions = computed(() => {
  return options.roles.map((item) => {
    return { value: item.id, label: item.roleName };
  });
});

const accountTypeOptions = computed(() => {
  return Object.values(constant.userType).map((item) => {
    return { value: item, label: t(item) };
  });
});

function getRole(scope) {
  const role = roleOptions.value.find(
    (item) => item.value === scope.data.row.roleId
  );
  return role.label;
}

const paginationLayout = computed(() => {
  if (app.device !== "mobile") return "total, sizes, prev, pager, next, jumper";
  else return "prev, pager, next";
});
const pagination = ref({
  page: 1,
  pageSize: 10,
  sortBy: "username",
  descending: false,
  total: 0,
  pageSizes: [2, 10, 15, 20, 100, 200, 300, 400],
  layout: paginationLayout.value,
});

onBeforeMount(async () => {
  await options.getRoles();
  initFilter();
  await queryUsers();
  await options.getProjects();
});

function initFilter() {
  const query = route.query;
  search.value = query.search || "";
  pagination.value.sortBy = query.sortBy || "username";
  pagination.value.pageSize = query.pageSize * 1 || 10;
  pagination.value.page = query.page * 1 || 1;
  pagination.value.descending = query.descending === "true";
  filter.roleId = query.roleId || "";
}

async function queryUsers() {
  await getData(
    search.value,
    pagination.value.sortBy,
    pagination.value.pageSize,
    pagination.value.page,
    pagination.value.descending,
    filter
  );
  updateRouteQuery();
}

function updateRouteQuery() {
  router.replace({
    query: {
      search: search.value,
      sortBy: pagination.value.sortBy,
      pageSize: pagination.value.pageSize,
      page: pagination.value.page,
      descending: pagination.value.descending,
      roleId: filter.roleId,
    },
  });
}

async function getData(keyword, sortBy, limit, page, descending, filter) {
  const res = await userApi.queryUsers(
    keyword,
    filter.roleId,
    sortBy + (descending ? ":desc" : ":asc"),
    limit,
    page
  );
  users.value = res.results;
  pagination.value.total = res.totalResults;
}

function buildAvatarSource(scope) {
  if (scope.data.row.avatar) {
    return buildFileUrl(scope.data.row.avatar.path, auth.token.token);
  } else {
    return "";
  }
}

function paginationChange() {
  queryUsers();
}

function sortChange(e) {
  pagination.value.sortBy = e.prop;
  pagination.value.descending = e.order === "descending";
  queryUsers();
}

const searchTimeout = ref(null);
function searchChange() {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    queryUsers();
  }, 500);
}

function addUser() {
  dialogVisible.add = true;
}

function editAccount(data) {
  dialogVisible.update = true;
  selected.value = { ...data.row };
}

function completeChangeUser() {
  dialogVisible.detail = false;
  queryUsers();
}

async function changeAccountStatus(data) {
  const user = data.row;
  await mainConfirm(
    user.status
      ? `${t("Lock account")} ${user.name}`
      : `${t("Unlock account")} ${user.name}`
  );
  await userApi.changeStatus(user.id, !user.status);
  messageSuccess(t("Change status successfully"));
  queryUsers();
}

async function toggleAccessAllProject(data) {
  const user = { ...data.row };
  await mainConfirm(
    user.accessAllProject
      ? `${t("Don't allow")} ${user.name} ${t("access all project")}`
      : `${t("Allow")} ${user.name} ${t("access all project")}`
  );
  user.accessAllProject = !user.accessAllProject;

  await userApi.updateUser(user.id, user);
  messageSuccess(t("update account successfully"));
  queryUsers();
}

function changeAccountPassword(data) {
  changePasswordRef.value.assignUser(data.row);
  dialogVisible.changePassword = true;
}

async function deleteAccount(data) {
  const user = data.row;
  await mainConfirm(t("Delete account"));
  await userApi.deleteUser(user.id);
  messageSuccess(t("Remove account successfully"));
  queryUsers();
}
</script>
