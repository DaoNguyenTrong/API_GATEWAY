<template>
  <span
    class="pl-2 pr-2 bg-overlay hov-pointer version-container fs-12"
    @click="showDetail()"
  >
    {{ current.tag }} - {{ current.description }}
  </span>
  <dialog-template v-model:visible="dialogVisible" alignCenter>
    <template #header>{{ $t("Version information") }}</template>
    <el-scrollbar max-height="500px">
      <m-expansion
        v-for="(version, index) in versions"
        :expand="index === 0"
        :title="`${version.tag} - ${version.description}`"
        class="mb-2"
      >
        <ul class="m-0">
          <li v-if="version.added && version.added.length">
            {{ $t("Added") }}
          </li>
          <ul v-if="version.added && version.added.length">
            <li v-for="add in version.added">{{ add }}</li>
          </ul>
          <li v-if="version.changed && version.changed.length">
            {{ $t("Changed") }}
          </li>
          <ul v-if="version.changed && version.changed.length">
            <li v-for="change in version.changed">{{ change }}</li>
          </ul>
          <li v-if="version.fixed && version.fixed.length">
            {{ $t("Fixed") }}
          </li>
          <ul v-if="version.fixed && version.fixed.length">
            <li v-for="fix in version.fixed">{{ fix }}</li>
          </ul>
        </ul>
      </m-expansion>
    </el-scrollbar>
  </dialog-template>
</template>

<script setup>
import { ref } from "vue";
import versions from "@/versions.json";
import { getCurrentVersion } from "@/utils/index";

const current = getCurrentVersion(versions);
const dialogVisible = ref(false);

function showDetail() {
  dialogVisible.value = true;
}
</script>

<style lang="scss" scoped>
.version-container {
  z-index: 1000000;
  position: fixed;
  bottom: 0;
  right: 0;
  border-radius: 10px 0 0 0;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.version-container:hover {
  text-decoration: underline;
}
</style>
