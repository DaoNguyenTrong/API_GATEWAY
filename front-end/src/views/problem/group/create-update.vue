<template>
  <dialog-template
    :model-value="visible"
    @update:visible="(e) => $emit('update:visible', e)"
    @open="openDialogHandler"
    width="1000px"
  >
    <template #header>{{ $t("Problem group information") }}</template>
    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      require-asterisk-position="right"
      inline-message
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12">
          <el-form-item prop="name" :label="$t('Problem group name')">
            <el-input
              v-model="form.name"
              :placeholder="$t('Input name')"
              class="filled outlined"
            ></el-input>
          </el-form-item>

          <el-form-item prop="code" :label="$t('Problem group code')">
            <el-input-number
              v-model="form.code"
              :placeholder="$t('Input code')"
              class="w-100 filled outlined"
              :controls="false"
              :min="0"
              :step="1"
              step-strictly
            ></el-input-number>
          </el-form-item>

          <el-form-item prop="departments" :label="$t('Related departments')">
            <el-select
              v-model="form.departments"
              multiple
              :placeholder="$t('Select department')"
              class="w-100 outlined filled"
              size="large"
              @change="changeDepartmentHandler"
            >
              <el-option
                v-for="item in departments"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="users" :label="$t('Responsible employee')">
            <el-select
              v-model="form.users"
              multiple
              :placeholder="$t('Select employees')"
              class="w-100 outlined filled"
              size="large"
            >
              <el-option
                v-for="item in users"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="reference" :label="$t('Reference link')">
            <el-input
              class="outlined filled"
              v-model="form.reference"
              :placeholder="$t('Input reference link')"
            ></el-input>
          </el-form-item>

          <el-form-item prop="description" :label="$t('Description')">
            <el-input
              :placeholder="$t('Input description')"
              type="textarea"
              class="filled outlined"
              v-model="form.description"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <div class="w-100 text-center p-1">
            {{ $t("Set of questions") }}
          </div>
          <div>
            <el-scrollbar height="445px">
              <Question
                label="test"
                class="mb-2"
                v-for="(item, index) in form.questions"
                v-model="item.question"
                v-model:type.number="item.type"
                @remove="removeQuestion(index)"
              />
              <div class="w-100 text-center mt-3">
                <el-tooltip :content="$t('Add question')" placement="right">
                  <el-button
                    type="primary"
                    icon="Plus"
                    @click="addQuestion"
                  ></el-button>
                </el-tooltip>
              </div>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
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
import { ref, shallowRef } from "vue";
import { requiredRule, URLRule } from "@/utils/validate";
import { problem, user } from "@/api/index";
import { messageSuccess } from "@/utils/message";
import { t } from "i18next";
import constant from "@/configs/constant";
import Question from "./question.vue";

const props = defineProps({
  visible: Boolean,
  departments: Array,
  selected: Object,
});
const emit = defineEmits(["update:visible"]);
const form = ref({ questions: [] });
const formRef = shallowRef(null);
const rules = {
  name: [requiredRule],
  code: [requiredRule],
  reference: [URLRule],
};
const isAdd = shallowRef(true);
const users = shallowRef([]);
const questions = ref([]);
const question = { question: "", type: 1 };

async function openDialogHandler() {
  if (Object.keys(props.selected).length === 0) {
    isAdd.value = true;
    form.value = { questions: [] };
    formRef.value.resetFields();
  } else {
    isAdd.value = false;
    form.value = { ...props.selected };
    changeDepartmentHandler(form.value.departments);
  }
}

async function changeDepartmentHandler(departments) {
  const filter = { type: constant.userType.employee };
  filter.department = {};
  filter.department.$in = [...departments];
  const res = await user.getAllUsers(filter);
  users.value = [...res];
  if (form.value.users) {
    for (let i = 0; i < form.value.users.length; i++) {
      const index = users.value.findIndex(
        (item) => item.id === form.value.users[i]
      );
      if (index === -1) {
        form.value.users.splice(i, 1);
        i--;
      }
    }
  }
}

function addQuestion() {
  form.value.questions.push({ ...question });
}

function removeQuestion(index) {
  form.value.questions.splice(index, 1);
}

async function complete() {
  const valid = await formRef.value.validate();
  if (!valid) return;
  await updateData();
  messageSuccess(t("Update data successfully"));
  emit("update:visible", false);
  emit("complete");
}

async function updateData() {
  if (isAdd.value) {
    await problem.createProblemGroup(form.value);
  } else {
    await problem.updateProblemGroup(props.selected.id, form.value);
  }
}
</script>

<style lang="scss" scoped></style>
