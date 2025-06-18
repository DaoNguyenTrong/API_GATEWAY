<template>
  <dialog-template
    v-model="visible"
    width="500"
    destroy-on-close
    @close="handleClose()"
  >
    <template #header>
      <div class="flex items-center gap-2">
        {{ isAdd ? $t("Add API Key") : $t("Edit API Key") }}
        <el-tag v-if="isAdd" type="primary">
          {{ $t("Add") }}
        </el-tag>
        <el-tag v-else type="warning">
          {{ $t("Edit") }}
        </el-tag>
      </div>
    </template>
    <el-form
      :model="form"
      label-position="top"
      label-suffix=":"
      :rules="rules"
      require-asterisk-position="right"
      inline-message
      ref="formRef"
      @submit.prevent="handleSubmit"
    >
      <el-card shadow="never" class="!border-none dense my-3">
        <el-form-item :label="$t('Key name')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('Input key name')" />
        </el-form-item>
        <el-form-item :label="$t('Key')" prop="key">
          <el-input v-model="form.key" :placeholder="$t('Key')" disabled>
            <template #append>
              <el-tooltip placement="top" :content="$t('Generate key')">
                <el-button icon="Refresh" @click="generateKey" />
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item :label="$t('Expired date')" prop="expiredDate">
          <template #label>
            <div class="flex items-center gap-2">
              <span>{{ $t("Expired date") }}</span>
              <el-tooltip
                placement="top"
                :content="$t('Leave blank for no expiration')"
              >
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <el-date-picker
            v-model="form.expiredDate"
            type="date"
            :placeholder="$t('Expired date')"
            class="!w-full"
          />
        </el-form-item>
        <el-form-item :label="$t('Description')" prop="description">
          <el-input
            v-model="form.description"
            :placeholder="$t('Description')"
            type="textarea"
          />
        </el-form-item>
      </el-card>
      <div class="flex justify-end">
        <el-button
          type="danger"
          class="no-bg"
          native-type="reset"
          @click="visible = false"
        >
          {{ $t("Cancel") }}
        </el-button>
        <el-button type="primary" native-type="submit">
          {{ $t("Save") }}
        </el-button>
      </div>
    </el-form>
  </dialog-template>
</template>

<script setup>
import apiKeyApi from "@/api/authorization/api-key-api";
import { messageSuccess } from "@/utils/message";
import { requiredRule, validateForm } from "@/utils/validate";
import { t } from "i18next";
import { computed, shallowReactive, shallowRef } from "vue";

const visible = shallowRef(false);

const resolver = shallowRef(null);
const rejecter = shallowRef(null);
const promiseHandler = (resolve, reject) => {
  resolver.value = resolve;
  rejecter.value = reject;
};

const open = (payload = {}) => {
  visible.value = true;
  resetForm();
  form.key = crypto.randomUUID();
  if (payload.id) {
    Object.assign(form, payload);
  }
  return new Promise(promiseHandler);
};

const defaultForm = {
  id: null,
  name: null,
  key: null,
  description: null,
  expiredDate: null,
};
const rules = {
  name: requiredRule,
  key: requiredRule,
};
const form = shallowReactive({ ...defaultForm });
const isAdd = computed(() => !form.id);

const resetForm = () => {
  Object.assign(form, defaultForm);
};

const generateKey = () => {
  form.key = crypto.randomUUID();
  copyToClipboard(form.key);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  messageSuccess(t("Copied to clipboard"));
};

const formRef = shallowRef(null);
const isCompleted = shallowRef(false);
const handleSubmit = async () => {
  await validateForm(formRef.value);
  if (isAdd.value) {
    await apiKeyApi.createApiKey(form);
    messageSuccess(t("Add API Key success"));
  } else {
    await apiKeyApi.updateApiKey(form.id, form);
    messageSuccess(t("Update API Key success"));
  }
  isCompleted.value = true;
  visible.value = false;
};

const handleClose = () => {
  if (isCompleted.value) {
    resolver.value(true);
  } else {
    rejecter.value("cancel");
  }
  isCompleted.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="scss" scoped></style>
