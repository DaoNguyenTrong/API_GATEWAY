<template>
  <div class="app-container">
    <el-card class="no-border" shadow="hover">
      <template #header>
        <div class="flex-sb-m flex-w">
          <div class="flex-l-m">
            <svg-icon name="bug" class="fs-23 mr-2"></svg-icon>
            <span class="font-bold">{{ $t("Problem management") }}</span>
          </div>
          <el-space wrap>
            <el-select
              class="mr-1 w-100 filled outlined"
              :placeholder="$t('Related departments')"
              clearable
              v-model="filter.department"
              @change="queryData"
            >
              <el-option
                v-for="item in departments"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
            <el-select
              class="mr-1 w-100 filled outlined"
              :placeholder="$t('Status')"
              clearable
              v-model="filter.status"
              @change="queryData"
            >
              <el-option
                v-for="item in Object.keys(constant.problemStatus)"
                :value="constant.problemStatus[item]"
                :label="$t(item)"
              ></el-option>
            </el-select>
            <el-select
              class="mr-1 w-100 filled outlined"
              :placeholder="$t('Priority')"
              clearable
              v-model="filter.priority"
              @change="queryData"
            >
              <el-option
                v-for="item in Object.keys(constant.problem.priority)"
                :value="constant.problem.priority[item]"
                :label="$t(item)"
              ></el-option>
            </el-select>
            <el-input
              v-model="filter.search"
              class="mr-1 filled outlined"
              :placeholder="$t('Search')"
              @update:model-value="searchChange"
            ></el-input>
            <el-tooltip :content="$t('Add problem')" placement="top">
              <el-button circle type="primary" icon="Plus" @click="addProblem">
              </el-button>
            </el-tooltip>
          </el-space>
        </div>
      </template>
      <table-template
        :columns="columns"
        :data="problems"
        v-model:pagination="pagination"
        :show-overflow-tooltip="false"
        @update:pagination="queryData"
        @sortChange="sortChange"
      >
        <template #project="{ data }">
          {{ getProjectById(data.row) }}
        </template>
        <template #createdBy="{ data }">
          {{ getUserById(data.row) }}
        </template>
        <template #status="{ data }">
          <el-button
            text
            :type="statusIcon[data.row.status].class"
            @click="changeStatus(data.row)"
          >
            <svg-icon
              :name="statusIcon[data.row.status].icon"
              class="mr-2"
            ></svg-icon>
            {{
              (typeof data.row.status === "number" &&
                $t(problemStatus[data.row.status])) ||
              "-"
            }}
          </el-button>
        </template>
        <template #priority="{ data }">
          <el-dropdown
            class="w-100"
            @command="(e) => changePriority(e, data.row)"
          >
            <div class="el-dropdown-link w-100">
              {{
                (typeof data.row.priority === "number" &&
                  $t(problemPriority[data.row.priority])) ||
                "-"
              }}
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="3">
                  {{ $t("low") }}
                </el-dropdown-item>
                <el-dropdown-item :command="2">
                  {{ $t("medium") }}
                </el-dropdown-item>
                <el-dropdown-item :command="1">
                  {{ $t("high") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #actions="{ data }">
          <el-button
            icon="Edit"
            type="warning"
            text
            circle
            @click="updateProblem(data.row)"
          ></el-button>
          <el-button
            icon="Delete"
            type="danger"
            text
            circle
            @click="removeProblem(data.row)"
          ></el-button>
        </template>
      </table-template>
    </el-card>
    <UpdateStatus
      v-model:visible="dialogVisible.status"
      :selected="selected"
      @complete="queryData"
    />
  </div>
</template>

<script setup>
import { shallowReactive, onBeforeMount, ref, shallowRef, computed } from "vue";
import api, { department, problem } from "@/api/index";
import columns from "./columns.json";
import { useRoute, useRouter } from "vue-router";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import constant from "@/configs/constant";
import UpdateStatus from "./update-status.vue";

const filter = shallowReactive({ search: "", status: "", priority: "" });
const problems = ref([]);
const router = useRouter();
const route = useRoute();
const departments = ref([]);
const projects = shallowRef([]);
const users = shallowRef([]);
const dialogVisible = shallowReactive({ status: false });
const selected = shallowRef({});

const paginationLayout = computed(() => {
  if (app.device !== "mobile") return "total, sizes, prev, pager, next, jumper";
  else return "prev, pager, next";
});
const pagination = ref({
  page: 1,
  pageSize: 20,
  sortBy: "name",
  descending: true,
  total: 0,
  pageSizes: [10, 20, 100, 200, 300, 400],
  layout: paginationLayout.value,
});

const problemStatus = computed(() => {
  const obj = {};
  Object.keys(constant.problemStatus).forEach((item) => {
    obj[constant.problemStatus[item]] = item;
  });
  return obj;
});

const statusIcon = {
  0: { icon: "send", class: "primary" },
  1: { icon: "letter", class: "warning" },
  2: { icon: "processing", class: "info" },
  3: { icon: "completed", class: "success" },
  4: { icon: "canceled", class: "danger" },
};

const problemPriority = computed(() => {
  const obj = {};
  Object.keys(constant.problem.priority).forEach((item) => {
    obj[constant.problem.priority[item]] = item;
  });
  return obj;
});

onBeforeMount(async () => {
  initFilter();
  await getDepartments();
  await queryData();
});

function initFilter() {
  const query = route.query;
  filter.search = query.search || "";
  filter.status = query.status;
  filter.priority = query.priority;
  pagination.value.sortBy = query.sortBy || "priority";
  pagination.value.pageSize = query.pageSize * 1 || 20;
  pagination.value.page = query.page * 1 || 1;
  pagination.value.descending = query.descending === "true";
}

async function getDepartments() {
  const res = await department.getDepartments();
  departments.value = [...res];
}

function addProblem() {
  router.push("/problem/detail");
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
    pagination.value.descending,
    filter.status,
    filter.priority
  );
  updateRouteQuery();
}

async function getData(
  keyword,
  sortBy,
  limit,
  page,
  descending,
  status,
  priority
) {
  const res = await problem.queryProblem(
    keyword,
    sortBy + (descending ? ":desc" : ":asc"),
    limit,
    page,
    status,
    priority
  );
  problems.value = [...res.results];
  pagination.value.total = res.totalResults;
  const IDs = res.results.map((item) => item.project);
  const users = res.results.map((item) => item.createdBy);
  await getProjectByIds(IDs);
  await getUsersByIds(users);
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

async function getProjectByIds(list = []) {
  const filter = { _id: { $in: list } };
  const res = await api.project.getProjectsByFilter(filter);
  projects.value = [...res];
}

async function getUsersByIds(list = []) {
  const filter = { _id: { $in: list } };
  const res = await api.user.getAllUsers(filter);
  users.value = [...res];
}

function getProjectById(row) {
  if (row.project) {
    const project = projects.value.find((item) => item.id === row.project);
    if (project) return project.name;
  }
  return "";
}

function getUserById(row) {
  if (row.createdBy) {
    const user = users.value.find((item) => item.id === row.createdBy);
    if (user) return user.name;
  }
  return "";
}

function changeStatus(row) {
  selected.value = { ...row };
  dialogVisible.status = true;
}

function test(data) {
  console.log(data);
}

async function removeProblem(row) {
  await mainConfirm(t("Remove problem"));
  await problem.removeProblemById(row.id);
  messageSuccess(t("Remove problem successfully"));
  await queryData();
}

function updateProblem(row) {
  router.push({ path: "/problem/detail", query: { id: row.id } });
}

async function changePriority(event, row) {
  const obj = {};
  Object.assign(obj, row);
  obj.priority = `${event}`;
  await problem.updateProblemById(obj.id, obj);
  messageSuccess(t("Change priority successfully"));
  await queryData();
}
</script>

<style lang="scss" scoped>
.created {
  color: var(--el-color-primary);
}
.received {
  color: var(--el-color-warning);
}
.processing {
  color: var(--el-color-info);
}
.completed {
  color: var(--el-color-success);
}
.canceled {
  color: var(--el-color-danger);
}
</style>
