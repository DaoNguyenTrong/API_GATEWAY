<template>
  <div class="app-container">
    <el-card class="no-border" shadow="hover">
      <template #header>
        <div class="flex-sb-m flex-w">
          <div class="flex-l-m">
            <svg-icon name="department" class="fs-23 mr-2"></svg-icon>
            <span class="font-bold">{{ $t("Department management") }}</span>
          </div>
          <div class="flex-sb flex-m">
            <el-input
              class="mr-3"
              :placeholder="$t('Search')"
              v-model="filter.search"
              @update:model-value="searchChange"
            ></el-input>
            <el-tooltip :content="$t('Add department')" placement="top">
              <el-button
                circle
                type="primary"
                icon="Plus"
                @click="showAddDepartment"
              >
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </template>
      <table-template
        :columns="columns"
        :data="departments"
        v-model:pagination="pagination"
        :show-overflow-tooltip="false"
        @update:pagination="queryData"
        @sortChange="sortChange"
      >
        <template #manager="{ data }">
          {{ getUserById(data.row) }}
        </template>
        <template #actions="{ data }">
          <el-button
            icon="Edit"
            type="warning"
            text
            circle
            @click="updateDepartment(data.row)"
          ></el-button>
          <el-button
            icon="Delete"
            type="danger"
            text
            circle
            @click="deleteDepartment(data.row)"
          ></el-button>
        </template>
      </table-template>
    </el-card>
    <department
      v-model:visible="dialogVisible.department"
      :selected="selected"
      :users="users"
      @complete="queryData"
    ></department>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  computed,
  shallowReactive,
  onBeforeMount,
  reactive,
} from "vue";
import columns from "./columns.json";
import api, { department } from "@/api/index";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store";
import Department from "./department.vue";
import constant from "@/configs/constant";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";

const router = useRouter();
const route = useRoute();
const app = useAppStore();

const departments = ref([]);
const dialogVisible = shallowReactive({ department: false });
const selected = ref({});
const users = ref([]);
const filter = reactive({
  search: "",
});

const paginationLayout = computed(() => {
  if (app.device !== "mobile") return "total, sizes, prev, pager, next, jumper";
  else return "prev, pager, next";
});
const pagination = ref({
  page: 1,
  pageSize: 20,
  sortBy: "name",
  descending: false,
  total: 0,
  pageSizes: [10, 20, 100, 200, 300, 400],
  layout: paginationLayout.value,
});

onBeforeMount(async () => {
  initFilter();
  await getUsers();
  await queryData();
});

function initFilter() {
  const query = route.query;
  filter.search = query.search || "";
  pagination.value.sortBy = query.sortBy || "name";
  pagination.value.pageSize = query.pageSize * 1 || 20;
  pagination.value.page = query.page * 1 || 1;
  pagination.value.descending = query.descending === "true";
}

async function getUsers() {
  const res = await api.user.getAllUsers({ type: constant.userType.employee });
  users.value = [...res];
}

const searchTimeout = shallowRef(null);
function searchChange() {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    await queryData();
  }, 500);
}

async function sortChange(e) {
  pagination.value.sortBy = e.prop;
  pagination.value.descending = e.order === "descending";
  await queryData();
}

async function queryData() {
  updateRouteQuery();
  await getData(
    filter.search,
    pagination.value.sortBy,
    pagination.value.pageSize,
    pagination.value.page,
    pagination.value.descending
  );
}

async function getData(keyword, sortBy, limit, page, descending) {
  const res = await department.queryDepartments(
    keyword,
    sortBy + (descending ? ":desc" : ":asc"),
    limit,
    page
  );
  departments.value = res.results;
  pagination.value.total = res.totalResults;
}

function updateRouteQuery() {
  router.replace({
    query: {
      search: filter.search,
      sortBy: pagination.value.sortBy,
      pageSize: pagination.value.pageSize,
      page: pagination.value.page,
      descending: pagination.value.descending,
    },
  });
}

function getUserById(row) {
  const manager = users.value.find((user) => user.id === row.manager);
  return manager ? manager.username : "";
}

function showAddDepartment() {
  dialogVisible.department = true;
  selected.value = {};
}

function updateDepartment(row) {
  dialogVisible.department = true;
  selected.value = { ...row };
}

async function deleteDepartment(row) {
  await mainConfirm(`${t("Remove department")}: ${row.name}`);
  await department.removeDepartmentById(row.id);
  messageSuccess(t("Remove department successfully"));
  await queryData();
}
</script>

<style lang="scss" scoped></style>
