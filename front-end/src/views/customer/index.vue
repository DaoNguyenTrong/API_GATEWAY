<template>
  <div class="m-l-r-auto app-container container">
    <el-form
      :model="form"
      label-position="top"
      ref="formRef"
      inline-message
      :rules="rules"
      @submit="complete"
      @reset="resetForm"
    >
      <el-form-item prop="title">
        <label for="title" slot="label">{{ $t("Title") }}</label>
        <el-input
          class="overlay outlined"
          :placeholder="$t('Input problem title')"
          v-model="form.title"
          id="title"
        ></el-input>
      </el-form-item>

      <el-form-item prop="project">
        <label slot="label" for="project">{{ $t("Project") }}</label>
        <el-select
          class="overlay outlined w-100"
          :placeholder="$t('Select project')"
          id="project"
          v-model="form.project"
        >
          <el-option
            v-for="item in options.projects"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="group">
        <label for="group" slot="label">{{ $t("Problem group") }}</label>
        <el-select
          id="group"
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
        <span v-if="getReference()">
          {{ $t("Reference Guide") }}:
          <a :href="getReference()" target="_blank">{{ getReference() }}</a>
        </span>
      </el-form-item>

      <el-form-item prop="description">
        <label for="description" slot="label">{{ $t("Description") }}</label>
        <el-input
          id="description"
          type="textarea"
          class="overlay outlined"
          :placeholder="$t('Input description')"
          :rows="8"
          v-model="form.description"
        ></el-input>
      </el-form-item>

      <m-expansion :title="$t('Survey question')" class="mt-5">
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
                class="overlay outlined"
                v-if="item.type === 1"
                :placeholder="$t('Answer the question')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </m-expansion>
      <upload-image
        class="mt-5"
        v-model:fileList="files"
        :uploaded="form.images"
        :title="$t('Images')"
        @removeFile="removeFile"
        @removeUploaded="removeUploaded"
      />
      <div class="mt-4 w-100 flex-r">
        <el-button text native-type="reset">{{ $t("Cancel") }}</el-button>
        <el-button type="primary" native-type="submit">
          {{ $t("Complete") }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, shallowRef, shallowReactive } from "vue";
import api, { problem } from "@/api";
import { mainConfirm } from "@/utils/message";
import { t } from "i18next";
import { requiredRule } from "@/utils/validate";
import { promiseAllSettled } from "@/utils";
import { useOptionsStore } from "@/store/index";
import { messageSuccess } from "@/utils/message";

const form = ref({});
const formRef = shallowRef(null);
const problemGroups = ref([]);
const options = useOptionsStore();
const isAdd = shallowRef(true);
const dialogVisible = shallowReactive({ list: false });

const rules = {
  title: [requiredRule],
  project: [requiredRule],
};

onBeforeMount(async () => {
  prepareData();
});

async function prepareData() {
  const promises = [];
  promises.push(getProblemGroup());
  await promiseAllSettled(promises);
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

// Image manage.
const files = ref([]);
function removeFile(index) {
  files.value.splice(index, 1);
}
function removeUploaded(index) {
  form.value.images.splice(index, 1);
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

async function complete(e) {
  e.preventDefault();
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
    form.value = {};
    formRef.value.resetFields();
  }
}

function resetForm() {
  form.value.answers = [];
}

function getReference() {
  const group = problemGroups.value.find(
    (item) => item.id === form.value.group
  );
  if (group && group.reference) {
    return group.reference;
  } else {
    return null;
  }
}

function showList() {
  dialogVisible.list = true;
}

function test() {
  console.log("test");
}
</script>

<style lang="scss" scoped></style>
