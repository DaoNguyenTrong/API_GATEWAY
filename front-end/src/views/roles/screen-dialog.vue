<template>
  <el-form
    inline-message
    :model="form"
    label-position="top"
    require-asterisk-position="right"
    :rules="rules"
    ref="formRef"
    @submit="complete"
  >
    <dialog-template
      :visible="modelValue"
      @update:visible="(e) => $emit('update:modelValue', e)"
      width="600px"
      @open="openHandler"
    >
      <template #header>{{ $t("Screen information") }}</template>
      <div class="text-center mb-3" v-if="form.isTool">
        <el-upload
          accept="image/*"
          :auto-upload="false"
          :show-file-list="false"
          v-model:file-list="avatar"
          @update:file-list="updateFileList"
        >
          <el-avatar
            icon="User"
            :size="90"
            fit="cover"
            :src="avatarSrc"
            class="fs-40 hov-pointer"
          ></el-avatar>
        </el-upload>
      </div>
      <el-form-item prop="name" :label="$t('Screen name')">
        <el-input
          v-model="form.name"
          class="overlay"
          :placeholder="$t('Input name')"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="name" :label="$t('Screen value')">
        <el-input
          v-model="form.action"
          class="overlay"
          :placeholder="$t('Input value')"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="isLink">
        <el-switch
          v-model="form.isTool"
          :active-text="$t('Is tool')"
        ></el-switch>
      </el-form-item>
      <el-form-item prop="url" :label="$t('URL address')" v-if="form.isTool">
        <el-input
          v-model="form.url"
          class="overlay"
          :placeholder="$t('Input url')"
        >
        </el-input>
      </el-form-item>
      <template #footer>
        <el-button
          text
          @click="$emit('update:modelValue', false)"
          native-type="reset"
        >
          {{ $t("Cancel") }}
        </el-button>
        <el-button type="primary" native-type="submit">
          {{ $t("Complete") }}
        </el-button>
      </template>
    </dialog-template>
  </el-form>
</template>

<script setup>
import { screen } from "@/api";
import { requiredRule } from "@/utils/validate";
import { ref, shallowRef } from "vue";
import { t } from "i18next";
import { messageSuccess } from "@/utils/message";
import api from "@/api/index.js";
import constant from "@/configs/constant";
import { useAuthStore } from "@/store";
import { buildImageSrcWithAuth } from "@/utils";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  parent: { type: String, default: null },
  screen: { type: Object },
});
const emit = defineEmits(["update:modelValue"]);
const formRef = shallowRef(null);
const avatar = ref([]);
const avatarSrc = ref("");
const auth = useAuthStore();

const form = ref({});
const rules = {
  name: [requiredRule],
  action: [requiredRule],
  url: [requiredRule],
};

function openHandler() {
  form.value = {};
  avatarSrc.value = "";
  if (Object.values(props.screen).length) {
    Object.assign(form.value, props.screen);
    if (form.value.icon) {
      avatarSrc.value = buildImageSrcWithAuth(
        constant.baseApi,
        form.value.icon,
        auth.token.token
      );
    }
  } else {
    form.value = {};
    form.value.parent = props.parent;
  }
}

function updateFileList(e) {
  avatar.value = e;
  if (e.length) {
    let url = URL.createObjectURL(e[0].raw);
    avatarSrc.value = url;
  }
}

async function complete(e) {
  e.preventDefault();
  const valid = await formRef.value.validate();
  if (!valid) return;
  if (avatar.value.length) {
    let file = {};
    file = await api.file.uploadSingle(avatar.value[0].raw || "");
    form.value.icon = file.path;
  }
  if (props.screen.id) {
    delete form.value.children;
    await screen.updateScreen(props.screen.id, form.value);
  } else {
    await screen.createScreen(form.value);
  }
  emit("complete");
  messageSuccess(t("Update screen successfully"));
  emit("update:modelValue", false);
}
</script>

<style lang="scss" scoped></style>
