<template>
  <div @click="toggleClick" class="fs-25 color-text-primary">
    <svg-icon name="menu" />
  </div>
</template>
<script setup>
defineProps({
  isActive: { type: Boolean, default: false },
});
const emit = defineEmits(["toggleClick"]);

function toggleClick() {
  emit("toggleClick");
}
</script>
