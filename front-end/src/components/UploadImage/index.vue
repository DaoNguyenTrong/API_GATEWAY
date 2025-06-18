<template>
  <m-expansion :title="title" class="mb-2">
    <el-space wrap>
      <div
        class="image-container border border-radius-base of-hidden pos-relative"
        v-for="(item, index) in listUploaded"
      >
        <el-tooltip :content="$t('Remove image')" placement="top">
          <el-button
            icon="Delete"
            type="danger"
            circle
            class="absolute remove-button"
            style="z-index: 2"
            @click="$emit('removeUploaded', index)"
          ></el-button>
        </el-tooltip>
        <el-image
          :src="item.url"
          :preview-src-list="srcList"
          class="img-class"
          fit="cover"
        />
        <el-button icon="Delete"></el-button>
      </div>
      <div
        class="image-container border border-radius-base of-hidden pos-relative"
        v-for="(item, index) in fileList"
      >
        <el-tooltip :content="$t('Remove image')" placement="top">
          <el-button
            icon="Delete"
            type="danger"
            circle
            class="absolute remove-button"
            style="z-index: 2"
            @click="$emit('removeFile', index)"
          ></el-button>
        </el-tooltip>
        <el-image
          :src="item.url"
          :preview-src-list="srcList"
          class="img-class"
          fit="cover"
        />
      </div>
      <el-upload
        multiple
        accept="image/*"
        drag
        :auto-upload="false"
        :model-value:file-list="fileList"
        @update:file-list="updateFileList"
        :show-file-list="false"
        class="upload-container"
      >
        <el-button icon="Plus" text></el-button>
      </el-upload>
    </el-space>
  </m-expansion>
</template>
<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/store";

const auth = useAuthStore();

const props = defineProps({
  fileList: { type: Array, default: [] },
  uploaded: { type: Array, default: [] },
  title: { type: String, default: "" },
});
const emit = defineEmits([
  "addImage",
  "update:fileList",
  "removeFile",
  "removeUploaded",
]);

const listUploaded = computed(() => {
  return props.uploaded.map((item) => {
    let url = "";
    if (typeof item === "object") {
      url = auth.makeFileUrl(item.path);
    } else {
      url = auth.makeFileUrl(item);
    }
    return { url, uploaded: true, name: url };
  });
});

const srcList = computed(() => {
  let files = props.fileList.map((item) => item.url);
  let list = listUploaded.value.map((item) => item.url);
  return [...files, ...list];
});

function updateFileList(files) {
  let arrayTmp = [];
  for (let file of files) {
    let url = URL.createObjectURL(file.raw);
    let obj = { ...file };
    obj.url = url;
    obj.uploaded = false;
    arrayTmp.push(obj);
  }
  emit("update:fileList", arrayTmp);
}
</script>
<style lang="scss" scoped>
.image-container {
  width: 130px;
  height: 130px;
  .img-class {
    width: 100%;
    height: 100%;
  }
}
.image-container {
  .remove-button {
    transition: all 0.3s;
    visibility: hidden;
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.image-container:hover {
  .remove-button {
    transition: all 0.3s;
    opacity: 1;
    visibility: visible;
  }
}

.upload-container {
  width: 130px;
}
</style>
