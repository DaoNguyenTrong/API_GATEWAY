<template>
  <dialog-template
    v-model="visible"
    width="500"
    destroy-on-close
    @close="handleClose()"
  >
    <template #header>
      <div>
        {{ $t(isAdd ? "Add path" : "Edit path") }}
        <el-button
          :type="isAdd ? 'primary' : 'warning'"
          class="no-bg ml-2"
          size="small"
        >
          {{ isAdd ? $t("Add") : $t("Edit") }}
        </el-button>
      </div>
    </template>
    <el-form
      :model="form"
      :rules="rules"
      label-position="top"
      label-suffix=":"
      require-asterisk-position="right"
      inline-message
      ref="formRef"
      @submit.prevent="handleSubmit"
      @reset="handleReset"
    >
      <el-card shadow="never" class="!border-none dense my-3">
        <div class="grid grid-cols-2 gap-x-3">
          <el-form-item
            :label="$t('Path name')"
            prop="name"
            class="col-span-full"
          >
            <el-input
              v-model="form.name"
              :placeholder="$t('Input name')"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('Host')"
            prop="host"
            v-if="!form.parentId"
            class="col-span-full"
          >
            <el-input
              v-model.trim="form.host"
              :placeholder="$t('Input host')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('Path')" prop="path" class="col-span-full">
            <el-input
              v-model.trim="form.path"
              :placeholder="$t('Input path')"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('Method')"
            prop="method"
            class="col-span-full"
            v-if="form.parentId"
          >
            <el-select
              v-model="form.method"
              :placeholder="$t('Select method')"
              clearable
              filterable
            >
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
              <el-option label="PATCH" value="PATCH" />
              <el-option label="OPTIONS" value="OPTIONS" />
              <el-option label="HEAD" value="HEAD" />
              <el-option label="CONNECT" value="CONNECT" />
              <el-option label="TRACE" value="TRACE" />
              <el-option label="ALL" value="ALL" />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('Limit (requests/window)')"
            prop="limit"
            class="col-span-1"
          >
            <el-input-number
              v-model.number="form.limit"
              :placeholder="$t('Input limit')"
              :min="0"
              :max="10000"
              :step="1"
              :controls="true"
              :precision="0"
              class="!w-full"
            />
          </el-form-item>
          <el-form-item
            :label="$t('Window (ms)')"
            prop="windowMs"
            class="col-span-1"
          >
            <el-input-number
              v-model.number="form.windowMs"
              :placeholder="$t('Input window')"
              :min="0"
              :max="60000"
              :step="1000"
              :controls="true"
              :precision="0"
              class="!w-full"
            />
          </el-form-item>
          <el-form-item
            :label="$t('Description')"
            prop="description"
            class="col-span-full"
          >
            <el-input
              v-model="form.description"
              :placeholder="$t('Input description')"
              clearable
              type="textarea"
            />
          </el-form-item>
        </div>
      </el-card>
      <div class="flex justify-end">
        <el-button native-type="reset" type="danger" class="no-bg">
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
import routePathApi from "@/api/authorization/route-path-api";
import { messageSuccess } from "@/utils/message";
import { requiredRule, validateForm } from "@/utils/validate";
import { t } from "i18next";
import { computed, nextTick, shallowReactive, shallowRef } from "vue";

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
  Object.assign(form, payload);
  if (payload._id) {
    form.id = payload._id;
    delete form._id;
  }
  return new Promise(promiseHandler);
};

const defaultForm = {
  id: null,
  name: null,
  host: null,
  path: null,
  method: null,
  isProxy: false,
  description: null,
  isActive: true,
  parentId: null,
  limit: null,
  windowMs: null,
};
const rules = {
  name: requiredRule,
  path: requiredRule,
  host: requiredRule,
};
const form = shallowReactive({ ...defaultForm });
const isAdd = computed(() => !form.id);
const resetForm = () => {
  Object.assign(form, { ...defaultForm });
};

const formRef = shallowRef(null);
const isCompleted = shallowRef(false);
const handleSubmit = async () => {
  await validateForm(formRef.value);

  if (isAdd.value) {
    await routePathApi.createRoutePath(form);
    messageSuccess(t("Add path success"));
  } else {
    await routePathApi.updateRoutePath(form.id, form);
    messageSuccess(t("Update path success"));
  }
  isCompleted.value = true;
  visible.value = false;
};

const handleReset = async () => {
  resetForm();
  await nextTick();
  await nextTick();
  formRef.value.clearValidate();
  visible.value = false;
  isCompleted.value = false;
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
