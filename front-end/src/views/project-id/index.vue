<template>
  <div class="app-container">
    <filter-panel
      :label="$t('Project ID management')"
      :icon="'card_travel'"
      v-model:search="search"
      v-model:firstFilter="filter.type"
      :firstOptions="projectTypeOptions"
      :firstPlaceholder="$t('Select project type')"
      v-model:secondFilter="filter.software"
      :secondOptions="projectSoftwareOptions"
      :secondPlaceholder="$t('Select software')"
      @update:search="searchChange"
      @addNew="addProject"
      @update:firstFilter="queryData"
      @update:secondFilter="queryData"
    />
    <el-card shadow="never" class="no-border">
      <table-template
        :data="tableData"
        v-model:pagination="pagination"
        :columns="columns"
        @update:pagination="paginationChange"
        @sortChange="sortChange"
      >
        <template #actions="{ data }">
          <el-tooltip :content="$t('Edit')" placement="top">
            <el-button
              text
              bg
              type="warning"
              @click="editProject(data)"
              size="small"
            >
              <svg-icon name="edit"></svg-icon>
            </el-button>
          </el-tooltip>
        </template>
      </table-template>
    </el-card>
    <!-- Dialog create project id -->
    <ProjectIdCreation
      v-model="dialogVisible.detail"
      @created="created"
      :selected="selected"
    />
  </div>
</template>
<script setup>
import { ref, onBeforeMount, reactive, computed, shallowRef } from "vue";
import project from "@/api/project";
import { useAppStore } from "@/store";
import ProjectIdCreation from "./project-id-creation.vue";
import columns from "./columns";
import { t } from "i18next";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const app = useAppStore();

const selected = shallowRef({});

const tableData = ref([]);
const search = ref("");
const filter = reactive({
  type: "",
  software: "",
});
const projectTypeOptions = [
  { label: t("Hydroelectric"), value: "TD" },
  { label: t("Irrigation"), value: "TL" },
  { label: t("Disaster prevention"), value: "PCTT" },
];

const projectSoftwareOptions = [
  { label: "Seho advance", value: "HNT" },
  { label: "Seho renew", value: "RENEW" },
  { label: "Seho lite", value: "LITE" },
];

const paginationLayout = computed(() => {
  if (app.device !== "mobile") return "total, sizes, prev, pager, next, jumper";
  else return "prev, pager, next";
});
const pagination = ref({
  page: 1,
  pageSize: 20,
  sortBy: "projectId",
  descending: false,
  total: 0,
  pageSizes: [10, 20, 100, 200, 300, 400],
  layout: paginationLayout.value,
});

const dialogVisible = reactive({
  detail: false,
});

onBeforeMount(async () => {
  initFilter();
  await queryData();
});

async function getData(keyword, sortBy, limit, page, descending, filter) {
  const res = await project.queryProject(
    keyword,
    sortBy + (descending ? ":desc" : ":asc"),
    limit,
    page,
    filter
  );
  tableData.value = res.results;
  pagination.value.total = res.totalResults;
}

async function queryData() {
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

function initFilter() {
  const query = route.query;
  search.value = query.search || "";
  pagination.value.sortBy = query.sortBy || "projectId";
  pagination.value.pageSize = query.pageSize * 1 || 20;
  pagination.value.page = query.page * 1 || 1;
  pagination.value.descending = query.descending === "true";
  filter.type = query.type || "";
  filter.software = query.software;
}

function updateRouteQuery() {
  router.replace({
    query: {
      search: search.value,
      sortBy: pagination.value.sortBy,
      pageSize: pagination.value.pageSize,
      page: pagination.value.page,
      descending: pagination.value.descending,
      type: filter.type,
      software: filter.software,
    },
  });
}

const searchTimeout = ref(null);
function searchChange() {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(async () => {
    await queryData();
  }, 500);
}

async function paginationChange() {
  await queryData();
}

async function sortChange(e) {
  pagination.value.sortBy = e.prop;
  pagination.value.descending = e.order === "descending";
  await queryData();
}

async function created() {
  await queryData();
}

function addProject() {
  selected.value = {};
  dialogVisible.detail = true;
}

function editProject(data) {
  dialogVisible.detail = true;
  selected.value = { ...data.row };
}
</script>
