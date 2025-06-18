<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="(e) => $emit('update:visible', e)"
    :fullscreen="fullscreen || isMobile"
    :width="width"
    draggable
    :destroy-on-close="destroyOnClose"
    :top="top"
    :align-center="alignCenter"
    :append-to-body="!modal ? true : appendToBody"
    :modal="modal"
    :close-on-click-modal="closeOnClickModal"
    @open="$emit('open')"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
  >
    <template #header>
      <slot name="header"></slot>
    </template>
    <slot> </slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>
<script setup>
import { computed } from "vue";
import { useAppStore } from "@/store";

const props = defineProps({
  visible: { type: Boolean },
  width: [String, Number],
  appendToBody: { type: Boolean, default: false },
  top: { type: String, default: "15vh" },
  alignCenter: { type: Boolean, default: true },
  destroyOnClose: { type: Boolean, default: true },
  modal: { type: Boolean, default: true },
  fullscreen: { type: Boolean, default: false },
  closeOnClickModal: { type: Boolean, default: false },
});
const emit = defineEmits([
  "update:visible",
  "close",
  "open",
  "opened",
  "closed",
]);
const app = useAppStore();

function closeDialog() {
  emit("update:visible", false);
}

const isMobile = computed(() => app.device === "mobile");
</script>
