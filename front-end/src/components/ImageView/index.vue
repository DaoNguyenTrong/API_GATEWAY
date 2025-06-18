<template>
  <m-expansion :title="$t('Images')">
    <transition name="fade-transition" mode="out-in">
      <image-carousel
        v-if="images.length"
        :images="images"
        class="mb-3"
        height="400px"
        :key="imagesSource"
      ></image-carousel>
    </transition>
    <el-table :data="rows" stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="name" :label="$t('File name')">
        <template #default="scope">
          {{ $t(scope.row.name) }}
        </template>
      </el-table-column>
      <el-table-column :align="'right'">
        <template #default="scope">
          <el-tooltip placement="top" :content="$t('View image')">
            <el-button
              icon="view"
              type="primary"
              circle
              text
              @click="viewImages(scope.row.field)"
            ></el-button>
          </el-tooltip>
          <el-tooltip placement="top" :content="$t('Update')">
            <el-button
              icon="edit"
              type="warning"
              circle
              text
              @click="pickImage(scope.row.field)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </m-expansion>
</template>

<script setup>
import { computed, shallowRef, onBeforeMount } from "vue";
import { pickFile } from "@/utils";
import { buildFileUrl } from "@/api";
import { useAuthStore } from "@/store";

const props = defineProps({
  rows: { type: Array, default: [] },
  initialView: { type: String, default: "" },
  form: { type: Object, default: {} },
});

const auth = useAuthStore();

const currentImageView = shallowRef("PowerhousePlan");

const imagesSource = shallowRef(false);

const emit = defineEmits(["pickImage"]);

const listImages = computed(() => {
  return props.form[currentImageView.value] || [];
});

const images = computed(() => {
  return listImages.value.map((file) => {
    if (!file.path) {
      const url = URL.createObjectURL(file);
      file.url = url;
    } else {
      const url = buildFileUrl(file.path, auth.token.token);
      file.url = url;
    }
    return file;
  });
});

onBeforeMount(() => {
  currentImageView.value = props.initialView;
});

function viewImages(field) {
  currentImageView.value = field;
  imagesSource.value = !imagesSource.value;
}

function pickImage(field) {
  pickFile("image/*", true, (e) => pickImageHandler(e, field));
}

function pickImageHandler(e, field) {
  emit("pickImage", e, field);
  viewImages(field);
}
</script>

<style lang="scss" scoped></style>
