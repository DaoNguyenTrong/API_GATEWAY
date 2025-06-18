<template>
  <el-form
    :model="form"
    label-position="top"
    require-asterisk-position="right"
    :rules="rules"
    ref="formRef"
  >
    <dialog-template
      :visible="visible"
      @update:visible="closeDialog"
      width="30%"
    >
      <template #header>{{ $t("Change password") }}</template>
      <el-card shadow="never" class="no-border">
        <el-form-item prop="username" :label="`${$t('Username')}:`">
          <el-input :model-value="user.username" class="filled" disabled>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" :label="`${$t('Password')}:`" required>
          <el-input v-model="form.password" class="filled" :type="inputType">
            <template #suffix>
              <svg-icon
                :name="showPass ? 'eye-open' : 'eye-close'"
                color="#eeeeee"
                class="hov-pointer fs-20"
                @click="toggleShowPass"
              ></svg-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          prop="repeat"
          :label="`${$t('Repeat password')}:`"
          required
        >
          <el-input v-model="form.repeat" class="filled" :type="inputType">
            <template #suffix>
              <svg-icon
                :name="showPass ? 'eye-open' : 'eye-close'"
                color="#eeeeee"
                class="hov-pointer fs-20"
                @click="toggleShowPass"
              ></svg-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-card>
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
import { computed } from "@vue/reactivity";
import { ref } from "vue";
import userApi from "@/api/user";
import { mainConfirm, messageSuccess } from "@/utils/message";
import { validPassword } from "@/utils/validate";
import { t } from "i18next";

const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(["update:visible"]);

const user = ref({});
const formRef = ref(null);
const form = ref({});
const rules = {
  password: [
    { required: true, message: t("Required field"), trigger: "blur" },
    { validator: validPassword, trigger: "blur" },
  ],
  repeat: [
    { required: true, message: t("Required field"), trigger: "blur" },
    { validator: validRepeat, trigger: "blur" },
  ],
};

function validRepeat(rule, value, callback) {
  if (form.value.password !== form.value.repeat) {
    return callback(new Error(t("Not match")));
  } else return true;
}

function assignUser(obj = {}) {
  Object.assign(user.value, obj);
}

async function onSubmit() {
  await mainConfirm(t("Change password"));
  await userApi.changePassword(user.value.id, form.value.password);
  messageSuccess(t("Change password successfully"));
  closeDialog();
}

function closeDialog() {
  formRef.value.resetFields();
  emit("update:visible", false);
}

const showPass = ref(false);
const inputType = computed(() => {
  return showPass.value ? "text" : "password";
});
function toggleShowPass() {
  showPass.value = !showPass.value;
}

defineExpose({ assignUser });
</script>
