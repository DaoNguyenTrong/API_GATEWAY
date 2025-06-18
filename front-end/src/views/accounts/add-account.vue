<template>
  <dialog-template :visible="visible" @update:visible="(e) => $emit('update:visible', e)" @close="closeDialog">
    <template #header>{{ $t("Add account") }}</template>
    <el-form :model="form" label-position="top" require-asterisk-position="right" :rules="rules" ref="formRef"
      autocomplete="off" inline-message>
      <div class="text-center mb-3">
        <el-upload accept="image/*" :auto-upload="false" :show-file-list="false" v-model:file-list="avatar"
          @update:file-list="updateFileList">
          <el-avatar icon="User" :size="65" fit="cover" :src="avatarSrc" class="fs-40 hov-pointer"></el-avatar>
        </el-upload>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item prop="username" :label="$t('Username')">
            <el-input v-model="form.username" class="outlined filled" :placeholder="$t('Input username')"></el-input>
          </el-form-item>
          <el-form-item prop="password" :label="$t('Password')">
            <el-input v-model="form.password" class="filled outlined" :type="passwordFieldType" autocomplete="off"
              :placeholder="$t('Enter password')">
              <template #suffix>
                <svg-icon :name="showPass ? 'eye-open' : 'eye-close'" color="#eeeeee" class="hov-pointer fs-20"
                  @click="showPass = !showPass"></svg-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="repeat" :label="$t('Repeat password')">
            <el-input v-model="form.repeat" class="filled outlined" :type="passwordFieldType" autocomplete="off"
              :placeholder="$t('Repeat password')">
            </el-input>
          </el-form-item>
          <el-form-item prop="roleId" :label="$t('Role group')">
            <el-select v-model="form.roleId" class="filled outlined w-100" :placeholder="$t('Select role group')">
              <el-option v-for="role in options.roles" :label="role.roleName" :value="role.id"></el-option></el-select>
          </el-form-item>
          <el-form-item prop="PrjID" :label="`${$t('Project')}:`" v-if="!form.accessAllProject">
            <el-select v-model="form.PrjID" class="filled outlined w-100" :placeholder="$t('Select project')" multiple
              collapse-tags filterable clearable collapse-tags-tooltip :max-collapse-tags="3">
              <el-option v-for="option in options.projects" :label="option.PrjName" :value="option.PrjID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="accessAllProject">
            <el-switch v-model="form.accessAllProject" :active-text="$t('Access all project')" />
          </el-form-item>
          <el-divider></el-divider>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item prop="email" :label="`${$t('Email')}:`">
            <el-input v-model="form.email" class="filled outlined" :placeholder="$t('Enter email')"></el-input>
          </el-form-item>
          <el-form-item prop="name" :label="$t('Name')">
            <el-input v-model="form.name" class="filled outlined" :placeholder="$t('Input full name')"></el-input>
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
import { ref, shallowRef, computed } from "vue";
import {
  requiredRule,
  requiredRuleBlur,
  usernameRule,
  passwordRule,
  emailRule,
} from "@/utils/validate";
import { useOptionsStore } from "@/store";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import api from "@/api";

const props = defineProps({ visible: Boolean, departments: Array });
const emit = defineEmits(["update:visible", "complete"]);
const options = useOptionsStore();

const form = ref({});
const formRef = shallowRef(null);
const rules = {
  username: [requiredRuleBlur, usernameRule],
  password: [requiredRuleBlur, passwordRule],
  repeat: [{ validator: checkRepeat, trigger: "change" }, requiredRuleBlur],
  roleId: [requiredRule],
  email: [emailRule],
  type: [requiredRule],
};
const avatar = ref([]);
const avatarSrc = ref("");
const showPass = ref(false);
const passwordFieldType = computed(() => {
  return showPass.value ? "text" : "password";
});

function updateFileList(e) {
  avatar.value = e;
  if (e.length) {
    let url = URL.createObjectURL(e[0].raw);
    avatarSrc.value = url;
  }
}

function checkRepeat(rule, str, callback) {
  if (str !== form.value.password) callback(new Error(t("Not match")));
  return true;
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
    await mainConfirm(t("Create account"));
    if (avatar.value.length) {
      let file = {};
      file = await api.file.uploadSingle(avatar.value[0].raw || "");
      form.value.avatar = file;
    }
    delete form.value.repeat;
    await api.user.createUser(form.value);
    messageSuccess(t("Create account successfully"));
    emit("update:visible", false);
    emit("complete");
  }
}
</script>

<style lang="scss" scoped></style>
