<template>
  <div class="app-container flex flex-col gap-4">
    <table-filter
      v-model="filter"
      @add-key="handleAddKey()"
      @filter-change="getApiKeys()"
      @clear="handleClearFilter()"
    ></table-filter>
    <el-card shadow="never" class="!border-none dense">
      <table-data
        :columns="columns"
        v-model:pagination="pagination"
        :data="pagination.items"
        :accounts="accounts"
        @update:pagination="getApiKeys()"
        @row-click="handleRowClick"
        @delete="handleDelete"
        @restrict="handleRestrictKey"
        @status="handleStatus"
      ></table-data>
    </el-card>
    <dialog-add-key ref="refDialogAddKey"></dialog-add-key>
    <dialog-restrict-key ref="refDialogRestrictKey"></dialog-restrict-key>
  </div>
</template>

<script setup>
import TableFilter from "./TableFilter.vue";
import TableData from "./TableData.vue";
import columns from "./columns.json";
import { computed, ref, shallowRef } from "vue";
import { useAppStore } from "@/store";
import DialogAddKey from "./DialogAddKey.vue";
import apiKeyApi from "@/api/authorization/api-key-api";
import { boxConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import { user } from "@/api";
import DialogRestrictKey from "./DialogRestrictKey.vue";

const filter = ref({
  keyword: null,
  status: null,
});

const handleClearFilter = async () => {
  filter.value = {
    keyword: null,
    status: null,
  };
  await getApiKeys();
};

const app = useAppStore();
const paginationLayout = computed(() => {
  if (app.device !== "mobile") return "total, sizes, prev, pager, next, jumper";
  else return "prev, pager, next";
});
const pagination = ref({
  sortBy: "name",
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

const getApiKeys = async () => {
  const res = await apiKeyApi.getApiKeys(query.value);
  pagination.value.items = res.results;
  pagination.value.total = res.totalResults;
};

const accounts = shallowRef([]);
const getAccounts = async () => {
  const res = await user.getAllUsers();
  accounts.value = res;
};

onMounted(async () => {
  await getApiKeys();
  await getAccounts();
});

const refDialogAddKey = ref(null);

const handleAddKey = async () => {
  await refDialogAddKey.value.open();
  await getApiKeys();
};

const handleRowClick = async (row) => {
  await refDialogAddKey.value.open(row);
  await getApiKeys();
};

const handleStatus = async (row) => {
  await apiKeyApi.updateApiKey(row.id, {
    ...row,
    status: row.status ? false : true,
  });
  messageSuccess(t("Update API key status successfully"));
  await getApiKeys();
};

const handleDelete = async (row) => {
  await boxConfirm(t("Delete this API key?"));
  await apiKeyApi.deleteApiKey(row.id);
  messageSuccess(t("Delete API key successfully"));
  await getApiKeys();
};

const refDialogRestrictKey = shallowRef(null);
const handleRestrictKey = async (row) => {
  await refDialogRestrictKey.value.show(row);
};
</script>

<style lang="scss" scoped></style>
