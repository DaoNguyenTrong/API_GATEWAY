<template>
  <el-form
    :model="form"
    label-position="top"
    require-asterisk-position="right"
    :rules="rules"
    ref="formRef"
    status-icon
  >
    <dialog-template
      :visible="modelValue"
      @update:visible="closeDialog"
      @open="openDialogHandler"
    >
      <template #header>{{ $t("Add new project") }}</template>
      <div class="project-id-container border border-radius-base mb-4">
        <span class="title fs-16">{{ $t("Project ID") }}</span>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item prop="type">
              <el-select
                v-model="form.first"
                class="overlay w-100"
                :placeholder="$t('Project type')"
              >
                <el-option
                  v-for="item in projectTypeOptions"
                  :label="$t(item.label)"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item prop="second">
              <el-input
                class="overlay"
                :placeholder="$t('Project name')"
                v-model="form.second"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <el-form-item prop="type">
              <el-select
                class="overlay w-100"
                :placeholder="$t('Software')"
                v-model="form.type"
              >
                <el-option
                  v-for="item in projectSoftwareOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="$t(item.label)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="w-100 text-center">{{ projectId }}</div>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item :label="$t('Project name') + ':'" prop="name">
            <el-input
              v-model="form.name"
              class="overlay"
              :placeholder="$t('Project name')"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item :label="$t('Plant name') + ':'" prop="hydroPowerName">
            <el-input
              v-model="form.hydroPowerName"
              class="overlay"
              :placeholder="$t('Input hydro power name')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <template #footer>
        <el-button link @click="closeDialog" size="large">
          {{ $t("Cancel") }}
        </el-button>
        <el-button type="success" @click="onSubmit" size="large">
          {{ $t("Complete") }}
        </el-button>
      </template>
    </dialog-template>
  </el-form>
</template>
<script setup>
import { ref, computed, shallowRef } from "vue";
import { t } from "i18next";
import project from "@/api/project";
import { mainConfirm, messageSuccess } from "@/utils/message";
import constant from "@/configs/constant";

const props = defineProps({
  modelValue: Boolean,
  selected: Object,
});
const emit = defineEmits(["update:modelValue", "created"]);

const form = ref({
  first: "TD",
  type: constant.projectTypes.RENEW,
  second: "",
});
const formRef = ref(null);
const isAdd = shallowRef(false);

const rules = {
  type: [{ required: true, message: t("Required field"), trigger: "blur" }],
  name: [{ required: true, message: t("Required field"), trigger: "blur" }],
  PrjName: [{ required: true, message: t("Required field"), trigger: "blur" }],
  HPPName: [{ required: true, message: t("Required field"), trigger: "blur" }],
};

const projectTypeOptions = [
  { label: "Hydroelectric", value: "TD" },
  { label: "Irrigation", value: "TL" },
  { label: "Disaster prevention", value: "PCTT" },
];

const projectSoftwareOptions = [
  { label: "Seho advance", value: constant.projectTypes.ADVANCE },
  { label: "Seho renew", value: constant.projectTypes.RENEW },
  { label: "Seho tool", value: constant.projectTypes.TOOL },
];

function openDialogHandler() {
  if (Object.values(props.selected).length) {
    isAdd.value = false;
    form.value = { ...props.selected };
    [form.value.first, form.value.second] = form.value.projectId.split("_");
  } else {
    isAdd.value = true;
    form.value = { first: "TD", type: constant.projectTypes.RENEW, second: "" };
  }
}

function PrjNameMinLength(rules, value, callback) {
  return value.length >= 4 || callback(new Error(t("At least 6 characters")));
}

const projectId = computed(() => {
  return `${form.value.first}_${form.value.second}_${form.value.type}`;
});

async function onSubmit() {
  const valid = await formRef.value.validate();
  if (valid) await createProject();
}

async function createProject() {
  if (isAdd.value) {
    await mainConfirm(t("Create new project"));
    await project.createProject({
      projectId: projectId.value,
      name: form.value.name,
      type: form.value.type,
      hydroPowerName: form.value.hydroPowerName,
    });
    messageSuccess(t("Create project successfully"));
  } else {
    await mainConfirm(t("Update project"));
    await project.updateProject(form.value.id, {
      projectId: projectId.value,
      name: form.value.name,
      type: form.value.type,
      hydroPowerName: form.value.hydroPowerName,
    });
    messageSuccess(t("Update project successfully"));
  }
  emit("created");
  closeDialog();
}

function closeDialog() {
  formRef.value.resetFields();
  emit("update:modelValue", false);
}
</script>
<style lang="scss" scoped>
.project-id-container {
  padding: 20px 20px 10px 20px;
  .title {
    position: absolute;
    transform: translateY(-37px);
    background-color: var(--el-dialog-bg-color);
    padding: 5px;
  }
}
</style>
