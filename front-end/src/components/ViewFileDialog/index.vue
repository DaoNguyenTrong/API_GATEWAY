<template>
  <dialog-template
    :visible="visible"
    @update:visible="$emit('update:visible')"
    align-center
  >
    <template #header>{{ $t("Files list") }}</template>
    <el-row :gutter="15">
      <el-col :xs="8" :sm="4" :md="3" v-for="item in files" class="mb-3">
        <div class="text-center pos-relative item-wrapper">
          <el-button
            type="primary"
            circle
            icon="Download"
            class="ab-c-m"
            @click="downloadFile(item)"
          ></el-button>
          <img :src="getImageSource(item)" class="fit-cover" />
          <div class="file-item-wrapper w-100">{{ item.filename }}</div>
        </div>
      </el-col>
      <el-col :xs="8" :sm="4" :md="3" v-for="item in fileList" class="mb-3">
        <el-tooltip :content="item.name" placement="top">
          <div class="text-center">
            <img :src="getImageSource(item)" class="fit-cover" />
            <div class="file-item-wrapper w-100">{{ item.name }}</div>
          </div>
        </el-tooltip>
      </el-col>
      <el-col :xs="8" :sm="4" :md="3" class="mb-3">
        <el-tooltip :content="$t('Upload file')">
          <el-upload
            class="flex-c-m"
            style="height: 100px"
            :show-file-list="false"
            v-model:file-list="fileList"
            multiple
            :auto-upload="false"
            drag
          >
            <el-button icon="Plus" text></el-button>
          </el-upload>
        </el-tooltip>
      </el-col>
    </el-row>
    <!-- <iframe
        id="b730a6f9-5419-4277-b2f8-ad0ca48167b7"
        src="http://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2F27.71.229.69%3A30000%2Fuploads%2F632c3be6f072baea4d180724%2FDocuments%2F5.%20Th%C3%83%C2%B4ng%20tin%20h%C3%A1%C2%BB%C2%93%20ch%C3%A1%C2%BB%C2%A9a.xlsx"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        referrerpolicy="strict-origin-when-cross-origin"
        scrolling="yes"
        width="100%"
        frameborder="0"
        style="height: calc(100vh - 34px)"
      ></iframe> -->
    <template #footer>
      <el-button text size="large" @click="$emit('update:visible', false)">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="primary" size="large" @click="complete">
        {{ $t("Complete") }}
      </el-button>
    </template>
  </dialog-template>
  <vue-simple-context-menu
    element-id="myUniqueId"
    :options="contextMenus"
    ref="simpleContextMenu"
    @option-clicked="optionClick"
  />
</template>
<script setup>
import { ref, reactive } from "vue";
import VueSimpleContextMenu from "vue-simple-context-menu";
import "vue-simple-context-menu/dist/vue-simple-context-menu.css";
import { t } from "i18next";
import fileTypes, { fileType } from "@/configs/file-type";
import api from "@/api";
import { mainConfirm } from "@/utils/message";

const props = defineProps({
  visible: Boolean,
  files: Array,
  projectId: String,
});
const emit = defineEmits(["update:visible", "uploaded"]);

const simpleContextMenu = ref(null);
const contextMenus = [{ name: t("Download"), value: "download" }];
const fileList = ref([]);

function handleClick(e, item) {
  e.preventDefault();
  simpleContextMenu.value.showMenu(e, item);
}

function optionClick(e) {
  if (e.option.value === "properties") {
    viewProperties(e.item);
  }
  if (e.option.value === "download") {
    downloadFile(e.item);
  }
}

function getImageSource(item) {
  if (item && item.mimetype && fileTypes[item.mimetype]) {
    return `/assets/images/${fileTypes[item.mimetype]}.png`;
  }
  return "/assets/images/document.png";
}

async function complete() {
  await mainConfirm(t("Upload files to the system"));
  const files = fileList.value.map((item) => item.raw);
  const res = await api.file.uploadMulti(files, props.projectId);
  fileList.value = [];
  emit("uploaded", res);
}

async function downloadFile(item) {
  const res = await api.file.downloadFile(item.path);
  const url = window.URL.createObjectURL(new Blob([res]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", item.filename);
  document.body.appendChild(link);
  link.click();
}
</script>
<style lang="scss">
.fit-cover {
  width: 100%;
  object-fit: cover;
}

.vue-simple-context-menu {
  transform: translateX(-60px) !important;
}

.file-item-wrapper {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-wrapper {
  .el-button {
    opacity: 0;
    transition: opacity 0.5s;
    z-index: 1;
  }
}
.item-wrapper:hover {
  img {
    opacity: 0.2;
    transition: opacity 0.5s;
  }
  .el-button {
    opacity: 1;
    transition: opacity 0.5s;
  }
}
</style>
