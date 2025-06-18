<template>
  <dialog-template
    :visible="modelValue"
    @update:visible="(e) => $emit('update:modelValue', e)"
    width="500px"
    destroy-on-close
    @close="resetForm"
    ref="formRef"
  >
    <template #header>{{ $t("Change password") }}</template>
    <el-form
      inline-message
      :model="form"
      label-position="top"
      require-asterisk-position="right"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item prop="oldPassword" :label="$t('Old password')">
        <el-input
          v-model="form.oldPassword"
          class="overlay"
          :placeholder="$t('Input old password')"
          :type="showPass ? 'text' : 'password'"
        >
          <template #suffix>
            <svg-icon
              :name="showPass ? 'eye-open' : 'eye-close'"
              color="#eeeeee"
              class="hov-pointer"
              @click="toggleShowPass"
            ></svg-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" :label="$t('Password')">
        <el-input
          v-model="form.password"
          class="overlay"
          :placeholder="$t('Input new password')"
          :type="showPass ? 'text' : 'password'"
        ></el-input>
      </el-form-item>

      <el-form-item prop="repeat" :label="$t('Repeat password')">
        <el-input
          v-model="form.repeat"
          class="overlay"
          :placeholder="$t('Repeat password')"
          :type="showPass ? 'text' : 'password'"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button text @click="$emit('update:modelValue', false)">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="primary" @click="complete">
        {{ $t("Complete") }}
      </el-button>
    </template>
  </dialog-template>
</template>

<script setup>
import { ref, reactive } from "vue";
import { requiredRule, passwordRule } from "@/utils/validate";
import user from "@/api/user";
import { messageSuccess } from "@/utils/message";
import { t } from "i18next";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const form = reactive({
  oldPassword: null,
  password: null,
  repeat: null,
});
const formRef = ref(null);
const showPass = ref(false);

const rules = {
  oldPassword: [requiredRule, passwordRule],
  password: [requiredRule, passwordRule],
  repeat: [requiredRule, { validator: checkRepeat, trigger: "blur" }],
};

function toggleShowPass() {
  showPass.value = !showPass.value;
}

function resetForm() {
  form.oldPassword = null;
  form.password = null;
  form.repeat = null;
  formRef.value.resetFields();
}

function checkRepeat(rule, value, callback) {
  return value === form.password || t("Not match");
}

async function complete() {
  const valid = await formRef.value.validate();
  if (valid) {
    await user.changeAccountPassword(form.password, form.oldPassword);
    messageSuccess(t("Change password successfully"));
    emit("update:modelValue", false);
  }
}
</script>
