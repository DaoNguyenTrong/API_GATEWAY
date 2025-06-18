<template>
  <div class="app-container">
    <el-card class="no-border" shadow="hover">
      <template #header>
        <div class="flex-sb-m flex-w">
          <div class="flex-l-m">
            <svg-icon name="problem-group" class="fs-23 mr-2"></svg-icon>
            <span class="font-bold">{{ $t("Problem group") }}</span>
          </div>
          <el-space wrap>
            <el-select
              class="mr-1 w-100 filled outlined"
              :placeholder="$t('Related departments')"
              v-model="filter.department"
              clearable
              @change="queryData"
            >
              <el-option
                v-for="item in departments"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-input
              class="mr-1 filled outlined"
              :placeholder="$t('Search')"
              v-model="filter.search"
              @update:model-value="searchChange"
            ></el-input>
            <el-tooltip :content="$t('Add problem group')" placement="top">
              <el-button
                circle
                type="primary"
                icon="Plus"
                @click="showAddProblemGroup"
              >
              </el-button>
            </el-tooltip>
          </el-space>
        </div>
      </template>
      <table-template
        :columns="columns"
        :data="problemGroups"
        v-model:pagination="pagination"
        :show-overflow-tooltip="false"
        @update:pagination="queryData"
        @sortChange="sortChange"
      >
        <template #actions="{ data }">
          <el-button
            icon="Edit"
            type="warning"
            text
            circle
            @click="updateProblemGroup(data.row)"
          ></el-button>
          <el-button
            icon="Delete"
            type="danger"
            text
            circle
            @click="deleteProblemGroup(data.row)"
          ></el-button>
        </template>
      </table-template>
    </el-card>
    <create-update
      v-model:visible="dialogVisible.detail"
      :departments="departments"
      :selected="selected"
      @complete="queryData"
    ></create-update>
  </div>
</template>

<script setup>
import { shallowReactive, onBeforeMount, ref, shallowRef, computed } from "vue";
import { department, problem } from "@/api";
import CreateUpdate from "./create-update.vue";
import { useRouter, useRoute } from "vue-router";
import columns from "./columns.json";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";

const filter = shallowReactive({ search: "", department: "" });
const departments = ref([]);
const dialogVisible = shallowReactive({ detail: false });
const selected = shallowRef({});
const router = useRouter();
const route = useRoute();
const problemGroups = shallowRef([]);
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
  await queryData();
  await getDepartments();
});

function initFilter() {
  const query = route.query;
  filter.search = query.search || "";
  pagination.value.sortBy = query.sortBy || "name";
  pagination.value.pageSize = query.pageSize * 1 || 20;
  pagination.value.page = query.page * 1 || 1;
  pagination.value.descending = query.descending === "true";
}

async function getDepartments() {
  const res = await department.getDepartments();
  departments.value = [...res];
}

function showAddProblemGroup() {
  dialogVisible.detail = true;
  selected.value = {};
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
  await getData(
    filter.search,
    pagination.value.sortBy,
    pagination.value.pageSize,
    pagination.value.page,
    pagination.value.descending
  );
  updateRouteQuery();
}

async function getData(keyword, sortBy, limit, page, descending) {
  const res = await problem.queryProblemGroups(
    keyword,
    sortBy + (descending ? ":desc" : ":asc"),
    limit,
    page
  );
  problemGroups.value = [...res.results];
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

function updateProblemGroup(e) {
  selected.value = { ...e };
  dialogVisible.detail = true;
}

async function deleteProblemGroup(e) {
  await mainConfirm(t("Delete problem group"));
  await problem.removeProblemGroupById(e.id);
  messageSuccess(t("Remove problem group successfully"));
  await queryData();
}
</script>

<style lang="scss" scoped></style>
