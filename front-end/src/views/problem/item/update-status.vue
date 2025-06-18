<template>
  <dialog-template
    :visible="visible"
    @update:visible="(e) => $emit('update:visible', e)"
    @open="openDialogHandler()"
    destroy-on-close
    ref="formRef"
  >
    <el-form label-position="top">
      <el-form-item :label="$t('Problem status')">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">{{ $t("created") }}</el-radio>
          <el-radio :label="1">{{ $t("received") }}</el-radio>
          <el-radio :label="2">{{ $t("processing") }}</el-radio>
          <el-radio :label="3">{{ $t("completed") }}</el-radio>
          <el-radio :label="4">{{ $t("canceled") }}</el-radio>
        </el-radio-group>
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
import { problem } from "@/api";
import { messageSuccess } from "@/utils/message";
import { ref } from "vue";
import { t } from "i18next";

const props = defineProps({ visible: Boolean, selected: Object });
const emit = defineEmits(["update:visible"]);

const form = ref({});

function openDialogHandler() {
  form.value = { ...props.selected };
  console.log(form.value);
}

async function complete() {
  await problem.updateProblemById(form.value.id, form.value);
  messageSuccess(t("Change problem status successfully"));
  emit("complete");
  emit("update:visible", false);
}
</script>

<style lang="scss" scoped></style>
