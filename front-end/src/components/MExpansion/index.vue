<template>
  <el-collapse
    accordion
    class="m-expansion hov-shadow-light"
    v-model="activeNames"
  >
    <el-collapse-item name="1">
      <template #title>
        {{ title }}
        <div class="space"></div>
        <el-button
          class="mr-1"
          @click.stop="$emit('button-1-click')"
          v-if="button1"
          :type="buttonType1"
        >
          {{ button1 }}
        </el-button>
        <el-button
          class="mr-1"
          @click.stop="$emit('button-2-click')"
          v-if="button2"
          :type="buttonType2"
        >
          {{ button2 }}
        </el-button>
        <el-button
          class="mr-3"
          @click.stop="$emit('button-3-click')"
          v-if="button3"
          :type="buttonType3"
        >
          {{ button3 }}
        </el-button>
      </template>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  title: { type: String, default: "" },
  expand: { type: Boolean, default: true },
  button1: { type: String },
  buttonType1: { type: String, default: "primary" },
  button2: { type: String },
  buttonType2: { type: String, default: "primary" },
  button3: { type: String },
  buttonType3: { type: String, default: "primary" },
});
const emit = defineEmits([
  "button-1-click",
  "button-2-click",
  "button-3-click",
]);
const activeNames = ref(["1"]);
if (!props.expand) {
  activeNames.value = null;
}
</script>
