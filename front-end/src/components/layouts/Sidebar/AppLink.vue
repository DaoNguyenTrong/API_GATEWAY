<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>
<script setup>
import { isExternal } from "@/utils/validate";
import { computed } from "@vue/reactivity";
const props = defineProps({
  to: { type: String, required: true },
});

const type = computed(() => {
  if (isExternal(props.to)) return "a";
  return "router-link";
});

function linkProps(to) {
  if (isExternal(props.to)) {
    return {
      href: to,
      target: "_blank",
      rel: "noopener",
    };
  }
  return { to: to };
}
</script>
