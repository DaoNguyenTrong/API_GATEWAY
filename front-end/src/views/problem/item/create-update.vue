<template>
  <el-form
    label-position="top"
    class="app-container container m-l-r-auto"
    :rules="rules"
    inline-message
    :model="form"
    ref="formRef"
  >
    <page-header-template
      :pageHeader="isAdd ? $t('Add problem') : $t('Update problem')"
      :show-back="auth.userInform.type !== constant.userType.customer"
      @back="back"
      @complete="complete"
    ></page-header-template>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12">
        <el-form-item prop="project" :label="$t('Project')">
          <el-select
            class="w-100 overlay outlined"
            :placeholder="$t('Select project')"
            v-model="form.project"
            clearable
          >
            <el-option
              v-for="item in options.projects"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" :label="$t('Title')">
          <el-input
            v-model="form.title"
            :placeholder="$t('Input problem title')"
            class="overlay outlined"
          ></el-input>
        </el-form-item>
        <el-form-item prop="group" :label="$t('Problem group')">
          <el-select
            :placeholder="$t('Select problem group')"
            class="w-100 overlay outlined"
            v-model="form.group"
            @change="selectProblemGroup"
            clearable
          >
            <el-option
              v-for="item in problemGroups"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-form-item prop="description" :label="$t('Description')">
          <el-input
            type="textarea"
            class="overlay outlined"
            :placeholder="$t('Input description')"
            :rows="8"
            v-model="form.description"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col
        :span="24"
        class="mt-3"
        v-if="form.answers && form.answers.length"
      >
        <m-expansion :title="$t('Survey question')">
          <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="12" v-for="item in form.answers">
              <el-form-item :label="item.question">
                <el-radio-group v-model="item.answer" v-if="item.type === 0">
                  <el-radio :label="true">{{ $t("Yes") }}</el-radio>
                  <el-radio :label="false">{{ $t("No") }}</el-radio>
                  <el-radio :label="null">{{ $t("Unknown") }}</el-radio>
                </el-radio-group>
                <el-input
                  v-model="item.answer"
                  class="filled outlined"
                  v-if="item.type === 1"
                  :placeholder="$t('Answer the question')"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </m-expansion>
      </el-col>
      <el-col :span="24" class="mt-3">
        <upload-image
          class="mb-2"
          v-model:fileList="files"
          :uploaded="form.images"
          :title="$t('Images')"
          @removeFile="removeFile"
          @removeUploaded="removeUploaded"
        />
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, onBeforeMount, shallowRef } from "vue";
import api, { problem } from "@/api";
import { useOptionsStore, useAuthStore } from "@/store/index";
import { promiseAllSettled } from "@/utils";
import { useRouter, useRoute } from "vue-router";
import { requiredRule } from "@/utils/validate";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { t } from "i18next";
import constant from "@/configs/constant";

const router = useRouter();
const route = useRoute();
const options = useOptionsStore();
const auth = useAuthStore();
const form = ref({});
const files = ref([]);
const problemGroups = ref([]);
const formRef = shallowRef(null);
const isAdd = shallowRef(true);

const rules = {
  project: [requiredRule],
  title: [requiredRule],
};

onBeforeMount(async () => {
  prepareData();
});

async function prepareData() {
  const promises = [];
  promises.push(getProblemGroup(), getProblem());
  await promiseAllSettled(promises);
}

async function getProblem() {
  const id = route.query.id;
  if (!id) {
    isAdd.value = true;
    return;
  }
  const res = await problem.getProblemById(id);
  isAdd.value = false;
  form.value = { ...res };
}

async function getProblemGroup() {
  const res = await problem.getAllProblemGroup();
  problemGroups.value = [...res];
  return res;
}

function selectProblemGroup(e) {
  let group = problemGroups.value.find((item) => item.id === e);
  if (group && group.questions) {
    form.value.answers = group.questions.map((item) => {
      return {
        question: item.question,
        answer: null,
        type: item.type,
      };
    });
  } else {
    form.value.answers = [];
  }
}

function removeFile(index) {
  files.value.splice(index, 1);
}

function removeUploaded(index) {
  form.value.images.splice(index, 1);
}

async function complete() {
  const valid = await formRef.value.validate();
  if (valid) {
    await mainConfirm(t("Report problem"));
    await uploadImages();
    if (isAdd.value) {
      await problem.createProblem(form.value);
    } else {
      await problem.updateProblemById(form.value.id, form.value);
    }
    messageSuccess(t("Crash reported"));
  }
}

async function uploadImages() {
  const res = await api.file.uploadArray(files.value, form.value.project);
  res.forEach((file) => {
    if (!form.value.images) {
      form.value.images = [];
    }
    let uploaded = form.value.images.filter((item) => item.path);
    form.value.images = [...uploaded, file];
  });
  files.value = [];
  return res;
}

function back() {
  router.back();
}
</script>

<style lang="scss" scoped></style>
