<template>
  <div class="app-container flex flex-col gap-4">
    <table-filter
      v-model="filter"
      @filter-change="getRoutePaths()"
      @clear="handleClearFilter()"
      @addPath="addOrEditPath({ isProxy: true })"
      @reloadRoutes="reloadRoutes()"
    ></table-filter>
    <el-card shadow="never" class="no-border dense">
      <table-data
        :columns="columns"
        v-model:pagination="pagination"
        :data="pagination.items"
        @update:pagination="getRoutePaths()"
        @status="handleStatus"
        @proxy="handleProxy"
        @delete="handleDelete"
        @row-click="addOrEditPath"
        @screens="handleScreens"
        @manageChild="handleManageChild"
      ></table-data>
    </el-card>
    <dialog-add-path ref="dialogAddPathRef"></dialog-add-path>
    <dialog-add-actions ref="dialogAddActionsRef"></dialog-add-actions>
    <dialog-manage-child ref="dialogManageChildRef"></dialog-manage-child>
  </div>
</template>

<script setup>
import TableFilter from "./TableFilter.vue";
import TableData from "./TableData.vue";
import columns from "./columns.json";
import DialogAddPath from "./DialogAddPath.vue";

import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/store";
import routePathApi from "@/api/authorization/route-path-api";
import { boxConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import DialogAddActions from "./DialogAddActions.vue";
import DialogManageChild from "./DialogManageChild.vue";

const filter = ref({
  keyword: null,
  status: null,
});

const handleClearFilter = async () => {
  filter.value = {
    keyword: null,
    status: null,
    method: null,
  };
  await getRoutePaths();
};

const app = useAppStore();
const paginationLayout = computed(() => {
  if (app.device !== "mobile") return "total, sizes, prev, pager, next, jumper";
  else return "prev, pager, next";
});
const pagination = ref({
  sortBy: "createdAt",
  descending: false,
  page: 1,
  pageSize: 40,
  items: [],
  total: 0,
  pageSizes: [5, 10, 15, 20, 40, 100, 200, 300, 400],
  layout: paginationLayout.value,
});

const query = computed(() => {
  return {
    ...filter.value,
    sortBy: pagination.value.sortBy,
    descending: pagination.value.descending,
    page: pagination.value.page,
    limit: pagination.value.pageSize,
  };
});

const getRoutePaths = async () => {
  const res = await routePathApi.getRoutePaths(query.value);
  pagination.value.items = res.results;
  pagination.value.total = res.totalResults;
};

onMounted(async () => {
  await getRoutePaths();
});

const dialogAddPathRef = shallowRef(null);
const addOrEditPath = async (row = {}) => {
  await dialogAddPathRef.value.open(row);
  await getRoutePaths();
};

const handleStatus = async (row) => {
  await boxConfirm(t("Are you sure you want to change the status?"));
  const payload = {
    ...row,
    isActive: row.isActive ? false : true,
  };
  await routePathApi.updateRoutePath(row.id, payload);
  messageSuccess(t("Status updated successfully"));
  await getRoutePaths();
  await boxConfirm(t("Are you sure you want to reload routes?"));
  await routePathApi.reloadRoutes();
  messageSuccess(t("Routes reloaded successfully"));
};

const handleProxy = async (row) => {
  await boxConfirm(t("Are you sure you want to change the proxy?"));
  const payload = {
    ...row,
    isProxy: row.isProxy ? false : true,
  };
  await routePathApi.updateRoutePath(row.id, payload);
  messageSuccess(t("Proxy updated successfully"));
  await getRoutePaths();
};

const handleDelete = async (row) => {
  await boxConfirm(t("Are you sure you want to delete this route path?"));
  await routePathApi.deleteRoutePath(row.id);
  messageSuccess(t("Route path deleted successfully"));
  await getRoutePaths();
};

const dialogAddActionsRef = shallowRef(null);
const handleScreens = async (row) => {
  await dialogAddActionsRef.value.open(row);
};

const reloadRoutes = async () => {
  await boxConfirm(t("Are you sure you want to reload routes?"));
  await routePathApi.reloadRoutes();
  messageSuccess(t("Routes reloaded successfully"));
};

const dialogManageChildRef = shallowRef(null);
const handleManageChild = async (row) => {
  await dialogManageChildRef.value.open(row);
};
</script>

<style lang="scss" scoped></style>
