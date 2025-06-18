<template>
  <el-form>
    <el-row :gutter="20" justify="space-between" tag="div" :align="'middle'">
      <el-col class="col text-left font-size-medium font-bold flex">
        {{ label }}
      </el-col>
      <el-col class="text-right" :xs="24" :sm="24" :md="16">
        <el-row :align="'middle'" justify="end" :gutter="10" class="flex-w">
          <el-col
            class="mb-1"
            :xs="24"
            :sm="8"
            :md="8"
            v-if="firstFilter !== undefined"
          >
            <el-form-item>
              <el-select
                :model-value="firstFilter"
                @update:model-value="(e) => $emit('update:firstFilter', e)"
                class="overlay filter-field w-100"
                :placeholder="firstPlaceholder"
                clearable
                filterable
              >
                <el-option
                  v-for="option in firstOptions"
                  :key="option"
                  :value="option.value"
                  :label="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            class="mb-1"
            :xs="24"
            :sm="8"
            :md="8"
            v-if="secondFilter !== undefined"
          >
            <el-form-item>
              <el-select
                :model-value="secondFilter"
                @update:model-value="(e) => $emit('update:secondFilter', e)"
                class="overlay col filter-field w-100"
                :placeholder="secondPlaceholder"
                clearable
                filterable
              >
                <el-option
                  v-for="option in secondOptions"
                  :key="option"
                  :value="option.value"
                  :label="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            class="mb-1"
            :xs="24"
            :sm="8"
            :md="6"
            v-if="typeof search === 'string'"
          >
            <el-form-item>
              <el-input
                :model-value="search"
                class="overlay col filter-field w-100"
                :placeholder="$t('Search')"
                prefix-icon="Search"
                @update:model-value="inputSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="2" :md="2" :lg="2" :xl="1" v-if="showAdd">
            <el-form-item>
              <el-button
                type="primary"
                icon="Plus"
                circle
                @click="$emit('addNew')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup>
const props = defineProps({
  search: { type: String },
  firstFilter: { type: [String, Number] },
  firstOptions: { type: Array, default: [] },
  firstPlaceholder: { type: String },
  secondFilter: { type: [String, Number] },
  secondOptions: { type: Array, default: [] },
  secondPlaceholder: { type: String },
  label: { type: String, default: "" },
  icon: { type: String, default: "" },
  showAdd: { type: Boolean, default: true },
});
const emit = defineEmits([
  "update:search",
  "update:firstFilter",
  "update:secondFilter",
  "addNew",
  "inputSearch",
]);

function inputSearch(e) {
  emit("update:search", e);
}
</script>
<style lang="scss" scoped></style>
