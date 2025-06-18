<template>
  <el-affix :offset="offset" :key="key" position="top">
    <el-page-header
      @back="$emit('back')"
      class="bg-overlay p-3 mb-3 border"
      :title="null"
      :icon="showBack ? 'Back' : null"
    >
      <template #title>
        {{ showBack ? $t("Back") : "" }}
      </template>
      <template #content>
        <div class="flex items-center">
          <span class="text-large font-600 mr-3"> {{ pageHeader }} </span>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <el-button size="default" @click="$emit('cancel')">
            {{ $t("Cancel") }}
          </el-button>
          <el-button
            size="default"
            type="success"
            class="ml-2"
            icon="CircleCheck"
            @click="$emit('complete')"
          >
            {{ $t("Complete") }}
          </el-button>
          <el-button
            class="ml-2"
            v-if="accession && showExport"
            type="primary"
            icon="download"
            @click="$emit('exportLatex')"
          >
            {{ $t("Export Latex") }}
          </el-button>
        </div>
      </template>
    </el-page-header>
  </el-affix>
</template>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuthStore } from "@/store";
import { allRoles } from "@/configs/roles";

const auth = useAuthStore();

const props = defineProps({
  pageHeader: { type: String, default: "" },
  offset: { type: Number, default: 75 },
  showBack: { type: Boolean, default: true },
  showExport: { type: Boolean, default: false },
});
const emit = defineEmits(["back", "complete", "cancel"]);

const key = ref(false);

onMounted(() => {
  registerResizeObserve();
});

const sizeChangeTimeOut = ref(null);

function registerResizeObserve() {
  const el = document.getElementById("app-container");
  const ro = new ResizeObserver(() => {
    clearTimeout(sizeChangeTimeOut.value);
    sizeChangeTimeOut.value = setTimeout(function () {
      key.value = !key.value;
    }, 200);
  });
  ro.observe(el);
}

const accession = computed(() => {
  return auth.roles.includes(allRoles.admin);
});
</script>
