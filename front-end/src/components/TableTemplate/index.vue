<template>
  <div class="w-full">
    <el-table
      ref="tableRef"
      class="mb-2"
      :class="{ dense: dense, large: large }"
      :data="paginatedData"
      :default-sort="defaultSort"
      :border="border"
      :size="size"
      :highlightCurrentRow="highlightCurrentRow"
      :flexible="flexible"
      :stripe="stripe"
      @selection-change="selectionChange"
      @sort-change="sortChange"
      @row-click="rowClick"
      @select-all="handleSelectAll"
      @filter-change="filterChange"
      @current-change="(e) => $emit('current-change', e)"
      :rowClassName="rowClassName"
      :height="app.device == 'mobile' ? 'auto' : height"
      :max-height="app.device == 'mobile' ? 'auto' : maxHeight"
      :show-summary="showSummary"
      :summary-method="summaryMethod"
      :row-key="rowKey"
      :default-expand-all="defaultExpandAll"
      :load="load"
      :lazy="lazy"
      :tree-props="treeProps"
      :style="{ 'min-height': minHeight || 'auto' }"
      v-el-table-infinite-scroll="scroll"
      :infinite-scroll-disabled="disabledScroll"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="STT"
        width="60"
        :align="'center'"
        v-if="showNO"
        :fixed="!isMobile && true"
      />
      <el-table-column
        v-for="(item, index) in props.columns"
        :key="item.property"
        :property="item.property"
        :label="item.label"
        :sortable="item.sortable || false"
        :width="item.width || ''"
        :min-width="item.minWidth || 100"
        :fixed="!isMobile && (item.fixed || false)"
        :resizable="item.resizable || true"
        :show-overflow-tooltip="showOverflowTooltip"
        :align="item.align || 'left'"
        :header-align="item.headerAlign || ''"
        :type="item.type"
        :sort-orders="['ascending', 'descending']"
        :filters="item.filters"
        :column-key="item.columnKey"
      >
        <template #header="scope">
          <slot
            v-if="item.headerSlot"
            :name="`header-${item.name}`"
            :index="scope.$index"
            :column="scope.column"
          ></slot>
          <span v-else>{{ $t(scope.column.label) || "" }}</span>
          <table-filter v-if="item.filterable" @click.stop=""></table-filter>
          <el-input
            v-if="item.searchable"
            class="filled h-5 mb-1"
            style="order: 1"
            v-model.lazy="searchFieldInputs[index].search"
            @update:model-value="assignSearchFields()"
            placeholder="Tìm kiếm"
            @click.stop="() => {}"
          ></el-input>
        </template>
        <template #default="scope" v-if="item.slot">
          <slot
            :name="typeof item.slot === 'string' ? item.slot : item.name"
            :row="scope.row"
            :$index="scope.$index"
            :data="scope"
          >
          </slot>
        </template>
      </el-table-column>
      <template #empty v-if="showEmpty"> </template>
      <slot name="append"></slot>
    </el-table>
    <div class="flex justify-between flex-wrap gap-3">
      <div class="flex items-center">
        <slot></slot>
      </div>
      <el-pagination
        v-if="pagination"
        :size="size"
        :current-page="pagination.page"
        :page-size="pagination.pageSize || 5"
        :page-sizes="pagination.pageSizes || [5, 10, 15, 20]"
        :pager-count="pagination.pagerCount || 5"
        :total="total"
        :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
        @update:current-page="changeCurrentPage"
        @update:page-size="changePageSize"
      />
    </div>
  </div>
</template>
<script setup>
import constant from "@/configs/constant";
import { onMounted, ref, shallowRef, watch } from "vue";
import { computed } from "vue";
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";
import { useAppStore } from "@/store";
import { searchString } from "@/utils";

const props = defineProps({
  data: Array,
  columns: { type: Array, default: [] },
  pagination: { type: Object, default: null },
  size: String,
  fit: { type: Boolean, default: true },
  highlightCurrentRow: { type: Boolean, default: false },
  flexible: { type: Boolean, default: false },
  border: { type: Boolean, default: false },
  stripe: { type: Boolean, default: false },
  height: { type: String },
  maxHeight: { type: String },
  showOverflowTooltip: { type: Boolean, default: true },
  showNO: { type: Boolean, default: true },
  rowClassName: { type: [String, Function] },
  synchronous: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },
  large: { type: Boolean, default: false },
  showSummary: { type: Boolean, default: false },
  summaryMethod: { type: Function, default: undefined },
  treeProps: { type: Object, default: undefined },
  lazy: { type: Boolean, default: false },
  load: { type: Function, default: undefined },
  rowKey: { type: String, default: undefined },
  defaultExpandAll: { type: Boolean, default: false },
  showEmpty: { type: Boolean, default: true },
  showAppendLoading: { type: Boolean, default: true },
  minHeight: { type: [String, Number], default: null },
  defaultSort: { type: Object, default: {} },
  disabledScroll: { type: Boolean, default: false },
});
const emit = defineEmits([
  "sortChange",
  "rowClick",
  "sizeChange",
  "current-change",
  "prevClick",
  "nextClick",
  "update:pagination",
  "scrollBottom",
  "selectionChange",
  "selectAll",
  "columnSearchChange",
  "filterChange",
]);

const app = useAppStore();
const isMobile = computed(() => {
  return app.device === constant.mobile;
});

const sortState = ref(null);

function sortChange(e) {
  if (e.column.sortable === constant.custom) {
    sortState.value = null;
  } else {
    sortState.value = e;
  }
  emit("sortChange", e);
}

function selectionChange(e) {
  emit("selectionChange", e);
}

function handleSelectAll(e) {
  emit("selectAll", e);
}

function rowClick(e) {
  emit("rowClick", e);
}

function filterChange(e) {
  emit("filterChange", e);
}

function scroll(e) {
  emit("scrollBottom", e);
}

function indexMethod(index) {
  if (!props.pagination) return index + 1;
  return index + 1 + (props.pagination.page - 1) * props.pagination.pageSize;
}

function changeCurrentPage(page) {
  let tmp = {};
  Object.assign(tmp, props.pagination);
  tmp.page = page;
  emit("update:pagination", tmp);
}

function changePageSize(size) {
  let tmp = {};
  Object.assign(tmp, props.pagination);
  tmp.pageSize = size;
  emit("update:pagination", tmp);
}

const defaultSort = computed(() => {
  if (!props.pagination) return props.defaultSort;
  return {
    prop: props.pagination.sortBy,
    order: props.pagination.descending ? "descending" : "ascending",
  };
});

const paginatedData = computed(() => {
  return props.synchronous
    ? props.data
    : props.data.slice(from.value, to.value);
});

const searchFieldInputs = ref([]);
onMounted(() => {
  initSearchFieldInputs();
});
const searchFields = ref([]);

const searchTimeout = shallowRef();
const assignSearchFields = () => {
  clearTimeout(searchTimeout.value);
  searchTimeout.value = setTimeout(() => {
    searchFields.value = [...searchFieldInputs.value];
    emit("columnSearchChange");
  }, 500);
};
watch(
  () => props.columns,
  () => {
    initSearchFieldInputs();
  }
);

const initSearchFieldInputs = () => {
  searchFieldInputs.value = [];
  for (let i = 0; i < props.columns.length; i++) {
    const item = props.columns[i];
    const searchItem = { property: item.property || null, search: "" };
    searchFieldInputs.value.push({ ...searchItem });
  }
  searchFields.value = [...searchFieldInputs.value];
};

const filteredData = computed(() => {
  let queriedData = paginatedData.value;
  for (let i = 0; i < searchFields.value.length; i++) {
    const search = searchFields.value[i].search;
    const property = props.columns[i]?.field;
    if (search) {
      queriedData = queriedData.filter((item) => {
        return searchString(item[property], search);
      });
    }
  }
  return queriedData;
});

const to = computed(() => {
  let highBound = from.value + props.pagination.pageSize;
  if (total.value < highBound) {
    highBound = total.value;
  }
  return highBound;
});

const from = computed(() => {
  return props.pagination?.pageSize * (props.pagination?.page - 1);
});

const total = computed(() => {
  return props.synchronous ? props.pagination.total : props.data.length;
});

// #region expose table method
const tableRef = shallowRef(null);
const setCurrentRow = (row) => {
  tableRef.value.setCurrentRow(row);
};
const toggleAllSelection = (status) => {
  tableRef.value.toggleAllSelection(status);
};

const getFilterFields = () => {
  return searchFieldInputs.value;
};

defineExpose({
  setCurrentRow,
  toggleAllSelection,
  searchFieldInputs,
  getFilterFields,
});
// #endregion
</script>
