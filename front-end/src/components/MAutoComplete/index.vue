<template>
  <el-autocomplete
    :model-value="modelValue"
    @update:modelValue="updateModelValue"
    :placeholder="placeholder"
    :debounce="debounce"
    :placement="placement"
    :fetch-suggestions="querySearch"
    :class="className"
    :clearable="clearable"
    :disabled="disabled"
    :valueKey="valueKey"
    :popperClass="popperClass"
    :triggerOnFocus="triggerOnFocus"
    :name="name"
    :selectWhenUnmatched="selectWhenUnmatched"
    :label="label"
    :hideLoading="hideLoading"
    :teleported="teleported"
    :highlightFirstItem="highlightFirstItem"
    :fitInputWidth="fitInputWidth"
    @change="changeHandler"
  ></el-autocomplete>
</template>
<script setup>
import { computed } from "vue";
import { useOptionsStore } from "@/store";

const props = defineProps({
  options: { type: Array, default: [] },
  modelValue: String,
  clearable: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  disabled: Boolean,
  valueKey: { type: String, default: "value" },
  debounce: { type: Number, default: 100 },
  placement: { type: String, default: "bottom-start" },
  popperClass: { type: String, default: "" },
  triggerOnFocus: { type: Boolean, default: true },
  name: { type: String },
  selectWhenUnmatched: { type: String, default: "" },
  label: String,
  hideLoading: { type: Boolean, default: false },
  teleported: { type: Boolean, default: true },
  highlightFirstItem: { type: Boolean, default: false },
  fitInputWidth: { type: Boolean, default: false },
  className: String,
  optionsField: { type: String },
});
const emit = defineEmits(["update:modelValue"]);

const options = useOptionsStore();

const optionsFormatted = computed(() => {
  if (props.options[0] && typeof props.options[0] === "string") {
    return props.options.map((item) => {
      return { value: item };
    });
  } else return props.options;
});

const querySearch = (queryString, cb) => {
  const results = queryString
    ? optionsFormatted.value.filter(createFilter(queryString))
    : optionsFormatted.value;
  // call callback function to return suggestions
  cb(results);
};

const createFilter = (queryString) => {
  return (type) => {
    if (queryString === "null") {
      console.log("query string");
      return true;
    } else {
      return type.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    }
  };
};

function updateModelValue(e) {
  emit("update:modelValue", e);
}

function changeHandler(e) {
  if (props.optionsField) options.updateSuggestion(props.optionsField, e);
}
</script>
