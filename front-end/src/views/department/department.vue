<template>
  <dialog-template
    :visible="visible"
    @update:visible="(e) => $emit('update:visible', e)"
    @open="openDialogHandler"
    width="500px"
  >
    <template #header>{{ $t("Department detail") }}</template>
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      require-asterisk-position="right"
      inline-message
    >
      <el-form-item prop="name" :label="$t('Department name')">
        <el-input
          class="outlined filled"
          v-model="form.name"
          :placeholder="$t('Input department name')"
        ></el-input>
      </el-form-item>
      <el-form-item prop="manager" :label="$t('Manger')">
        <el-select
          class="w-100 filled outlined"
          v-model="form.manager"
          :placeholder="$t('Select manager')"
        >
          <el-option
            v-for="item in users"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="description" :label="$t('Description')">
        <el-input
          type="textarea"
          class="filled outlined"
          :placeholder="$t('Input description')"
          v-model="form.description"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button text @click="$emit('update:visible', false)">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="primary" @click="complete">
        {{ $t("Complete") }}
      </el-button>
    </template>
  </dialog-template>
</template>

<script setup>
import { ref, shallowRef, computed } from "vue";
import { department } from "@/api";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import { requiredRule } from "@/utils/validate";

const props = defineProps({
  visible: Boolean,
  selected: { type: Object, default: {} },
  users: { type: Array },
});
const emit = defineEmits(["update:visible"]);

const form = ref({});
const formRef = shallowRef(null);
const isAdd = shallowRef(false);
const rules = { name: [requiredRule], manager: [requiredRule] };

function openDialogHandler() {
  if (Object.keys(props.selected).length === 0) {
    isAdd.value = true;
    form.value = {};
    formRef.value.resetFields();
  } else {
    isAdd.value = false;
    form.value = { ...props.selected };
  }
}

async function complete() {
  const valid = await formRef.value.validate();
  if (valid) {
    await mainConfirm(t("Update department"));
    await updateData();
    emit("update:visible", false);
    messageSuccess(t("Update department successfully"));
    emit("complete");
  }
}

async function updateData() {
  if (isAdd.value) {
    await department.createDepartment(form.value);
  } else {
    await department.updateDepartment(form.value.id, form.value);
  }
}
</script>

<style lang="scss" scoped></style>
