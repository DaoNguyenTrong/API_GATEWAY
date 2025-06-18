<template>
  <dialog-template :visible="visible" @update:visible="(e) => $emit('update:visible', e)" @close="closeDialog"
    @open="openDialog" width="600px">
    <template #header>
      {{ $t("Update account") }}: {{ selected.username }}
    </template>
    <el-form :model="form" label-position="top" require-asterisk-position="right" :rules="rules" ref="formRef"
      autocomplete="off">
      <div class="text-center mb-3">
        <el-upload accept="image/*" :auto-upload="false" :show-file-list="false" v-model:file-list="avatar"
          @update:file-list="updateFileList">
          <el-avatar icon="User" :size="90" fit="cover" :src="avatarSrc" class="fs-40 hov-pointer"></el-avatar>
        </el-upload>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item prop="roleId" :label="$t('Role group')">
            <el-select v-model="form.roleId" class="filled outlined w-100" :placeholder="$t('Select role group')">
              <el-option v-for="role in options.roles" :label="role.roleName" :value="role.id"></el-option></el-select>
          </el-form-item>
          <el-form-item prop="PrjID" :label="`${$t('Project')}:`" v-if="!form.accessAllProject">
            <el-select v-model="form.PrjID" class="filled outlined w-100" :placeholder="$t('Select project')" multiple
              size="large" collapse-tags filterable clearable collapse-tags-tooltip :max-collapse-tags="2">
              <el-option v-for="option in options.projects" :label="option.PrjName" :value="option.PrjID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="accessAllProject">
            <el-switch v-model="form.accessAllProject" :active-text="$t('Access all project')" />
          </el-form-item>

          <el-form-item prop="name" :label="$t('Name')">
            <el-input v-model="form.name" class="filled outlined" :placeholder="$t('Input full name')"></el-input>
          </el-form-item>
          <el-form-item prop="email" :label="`${$t('Email')}:`">
            <el-input v-model="form.email" class="filled outlined" :placeholder="$t('Enter email')"></el-input>
          </el-form-item>
          <el-form-item prop="phone" :label="`${$t('Phone')}:`">
            <el-input v-model="form.phone" class="filled outlined" :placeholder="$t('Enter phone number')"></el-input>
          </el-form-item>
          <el-form-item prop="position" :label="`${$t('Position')}:`">
            <el-input v-model="form.position" class="filled outlined" :placeholder="$t('Enter position')"></el-input>
          </el-form-item>
          <el-form-item prop="address" :label="`${$t('Address')}:`">
            <el-input v-model="form.address" class="filled outlined" :placeholder="$t('Enter address')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button link @click="$emit('update:visible', false)">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="success" @click="onSubmit">
        {{ $t("Complete") }}
      </el-button>
    </template>
  </dialog-template>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import { requiredRule, requiredRuleBlur, emailRule } from "@/utils/validate";
import { useOptionsStore, useAuthStore } from "@/store";
import constant from "@/configs/constant";
import { mainConfirm, messageSuccess } from "@/utils/message";
import api from "@/api";
import { t } from "i18next";
import { buildImageSrcWithAuth } from "@/utils";

const props = defineProps({
  visible: Boolean,
  selected: Object,
  departments: Array,
});
const emit = defineEmits(["update:visible", "complete"]);
const options = useOptionsStore();
const auth = useAuthStore();

const formRef = shallowRef(null);
const form = ref({});
const avatar = ref([]);
const avatarSrc = ref("");

function updateFileList(e) {
  avatar.value = e;
  if (e.length) {
    let url = URL.createObjectURL(e[0].raw);
    avatarSrc.value = url;
  }
}

const rules = {
  roleId: [requiredRule],
  email: [emailRule],
  type: [requiredRule],
};

function openDialog() {
  form.value = { ...props.selected };
  if (form.value.avatar && form.value.avatar.path) {
    avatarSrc.value = buildImageSrcWithAuth(
      constant.baseApi,
      form.value.avatar.path,
      auth.token.token
    );
  }
}

function closeDialog() {
  formRef.value.resetFields();
  form.value = {};
  avatar.value = [];
  avatarSrc.value = "";
}

async function onSubmit() {
  const valid = await formRef.value.validate();
  if (valid) {
    await mainConfirm(t("Update account"));
    if (avatar.value.length) {
      let file = {};
      file = await api.file.uploadSingle(avatar.value[0].raw || "");
      form.value.avatar = file;
    }
    delete form.value.repeat;
    let obj = {};
    Object.assign(obj, form.value);
    delete obj.roles;
    delete obj.status;
    delete obj.username;
    delete obj.id;
    delete obj.repeat;
    await api.user.updateUser(form.value.id, obj);
    messageSuccess(t("Update account successfully"));
    emit("update:visible", false);
    emit("complete");
    closeDialog();
  }
}
</script>

<style lang="scss" scoped></style>
