<template>
  <div class="login-container">
    <el-form
      class="login-form"
      ref="loginFormRef"
      :model="form"
      autocomplete="on"
      :rules="loginRules"
    >
      <div class="title-container text-gray-700 align-center">
        <img
          src="../../assets/images/logo.png"
          alt="logo"
          class="mx-auto mb-4"
          style="width: 100px"
        />
        <h3 class="title lh-1-6 text-up text-3xl font-semibold">
          {{ $t("Operation tools") }}
        </h3>
      </div>
      <el-form-item prop="username" class="mb-5" style="margin-bottom: 25px">
        <el-input
          ref="username"
          :placeholder="$t('Username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          class="rounded"
          v-model="form.username"
        >
          <template #suffix>
            <svg-icon name="user-1" color="#eeeeee" class="fs-20"></svg-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password" style="margin-bottom: 25px">
        <el-input
          ref="password"
          :placeholder="$t('Password')"
          name="password"
          :type="showPass ? 'text' : 'password'"
          tabindex="2"
          autocomplete="on"
          class="rounded"
          v-model="form.password"
          @keyup.enter.native="handleLogin"
        >
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
      <el-button
        size="large"
        class="w-full submit-button border-radius-round mb-5"
        type="primary"
        :loading="loading"
        @click="handleLogin"
      >
        {{ t("login") }}
      </el-button>
      <div class="w-full flex items-center justify-between">
        <el-switch
          :active-text="$t('Keep login')"
          v-model="keepLogin"
          :active-value="true"
          :inactive-value="false"
        />
        <change-language />
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { shallowReactive, shallowRef } from "vue";
import { t } from "i18next";
import { validPassword, validUsername } from "@/utils/validate";
import { useAuthStore } from "@/store/index";
import { messageSuccess } from "@/utils/message";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const form = shallowReactive({
  username: "",
  password: "",
});
const loginRules = {
  username: [{ required: true, trigger: "blur", validator: validUsername }],
  password: [{ required: true, trigger: "blur", validator: validPassword }],
};
const loginFormRef = shallowRef(null);
const loading = shallowRef(false);
const showPass = shallowRef(false);
const keepLogin = shallowRef(true);

function toggleShowPass() {
  showPass.value = !showPass.value;
}

async function handleLogin() {
  const valid = await loginFormRef.value.validate();
  if (valid) {
    await authStore.login(form.username, form.password, keepLogin.value);
    messageSuccess(t("Login successfully"));

    const redirect = route.query.redirect || "/dashboard";

    if (typeof redirect === "string" && redirect.startsWith("http")) {
      window.location.href = decodeURIComponent(redirect);
    } else {
      router.push(redirect);
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  min-height: 100%;
  width: 100%;
  // background: linear-gradient(#55bcff 0%, #23a9ff 60%, #077ac5 90%);
  background-image: url("../../assets/images/login-background.jpg");
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 10px;

  .login-form {
    border-radius: 10px;
    position: relative;
    width: 600px;
    max-width: 100%;
    padding: 70px;
    margin: auto;
    overflow: hidden;
    border-radius: 43px;
    background: #21242954;
    backdrop-filter: blur(2px) saturate(180%);
    box-shadow:
      41px 41px 82px #272727,
      -10px -10px 82px #3f3f3f,
      inset 0 0px 15px rgba(255, 255, 255, 0.3);
    .title-container {
      position: relative;

      .title {
        color: #fff;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: normal;
      }
    }
  }
}

@media screen and (max-width: 599px) {
  .login-container {
    .login-form {
      padding: 40px;
    }
  }
}
</style>
