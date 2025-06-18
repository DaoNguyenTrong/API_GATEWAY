<template>
  <dialog-template
    :visible="modelValue"
    @update:visible="(e) => $emit('update:modelValue', e)"
    width="500px"
  >
    <template #header
      ><span>{{ form.name }}</span></template
    >
    <el-form
      :model="form"
      label-position="top"
      require-asterisk-position="right"
      :rules="rules"
      ref="formRef"
      size="default"
    >
      <el-row :gutter="20">
        <el-col :span="24" class="text-center mb-3">
          <el-avatar
            icon="User"
            :size="90"
            fit="cover"
            :src="avatarSrc"
            class="fs-40 hov-pointer"
            @click="pickAvatar()"
          ></el-avatar>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('Full name')">
            <el-input
              v-model="form.name"
              :placeholder="$t('Input your full name')"
              size="default"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Phone')">
            <el-input
              v-model="form.phone"
              :placeholder="$t('Input phone number')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Position')">
            <el-input
              v-model="form.position"
              :placeholder="$t('Input position')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Address')">
            <el-input
              v-model="form.address"
              :placeholder="$t('Input address')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button text @click="$emit('update:modelValue', false)">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="primary" @click="complete">
        {{ $t("Complete") }}
      </el-button>
    </template>
  </dialog-template>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useAuthStore } from "@/store/index";
import config from "@/configs/constant";
import { buildImageSrcWithAuth, pickFile } from "@/utils/index";
import { rules } from "./rules";
import file from "@/api/file";
import { messageSuccess } from "@/utils/message";
import { t } from "i18next";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits("update:modelValue");
const auth = useAuthStore();

const avatarSrc = computed(() => {
  if (localFile.url) {
    return localFile.url;
  } else if (form.value.avatar) {
    return buildImageSrcWithAuth(
      config.baseApi,
      form.value.avatar.path,
      auth.token.token
    );
  } else {
    return "";
  }
});
const localFile = reactive({ url: "", file: {} });

const form = ref({});
const formRef = ref(null);

function setForm(obj) {
  Object.assign(form.value, obj);
}

function pickAvatar() {
  pickFile(config.fileAccept.image, false, fileHandler);
}

function fileHandler(file) {
  if (file) {
    let url = URL.createObjectURL(file);
    localFile.file = file;
    localFile.url = url;
  }
}

async function complete() {
  const valid = await formRef.value.validate();
  if (valid) {
    await updateData();
    messageSuccess(t("Update information successfully"));
    emit("update:modelValue", false);
  }
}

async function updateData() {
  console.log(form.value);
  const res = await file.uploadSingle(
    localFile.file || "",
    form.value.projectId.length && form.value.projectId[0]
  );
  form.value.avatar = res;
  await auth.updateInfo({
    name: form.value.name,
    phone: form.value.phone,
    position: form.value.position,
    address: form.value.address,
    avatar: form.value.avatar,
  });
  localFile.file = {};
  localFile.url = "";
}

defineExpose({
  setForm,
});
</script>
