<template>
  <el-table
    class="mb-2 table-min-height-450"
    @sort-change="changeSorting"
    @row-click="rowClick"
    :data="tableData"
    :default-sort="defaultSort"
  >
    <el-table-column type="index" :index="indexMethod" />
    <el-table-column property="projectId" :label="$t('Project ID')" sortable />
    <el-table-column property="PrjName" :label="$t('Project name')" sortable />
    <el-table-column property="HPPName" :label="$t('Plant name')" sortable />
  </el-table>
</template>
<script setup>
import { computed } from "@vue/reactivity";

const props = defineProps({
  tableData: Array,
  pagination: Object,
});

const emit = defineEmits(["sortChange", "rowClick"]);

function changeSorting(e) {
  emit("sortChange", e);
}

function rowClick(e) {
  emit("rowClick", e);
}

function indexMethod(index) {
  return index + 1 + (props.pagination.page - 1) * props.pagination.pageSize;
}
const defaultSort = computed(() => {
  return {
    prop: props.pagination.sortBy,
    order: props.pagination.descending ? "descending" : "ascending",
  };
});
</script>
