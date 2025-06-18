<template>
  <svg aria-hidden="true" :class="svgClass">
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  prefix: {
    type: String,
    default: "icon",
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  className: {
    type: String,
    default: "",
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);

const svgClass = computed(() => {
  if (props.className) {
    return "svg-icon " + this.className;
  } else {
    return "svg-icon";
  }
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
