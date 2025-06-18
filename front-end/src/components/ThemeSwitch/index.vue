<template>
  <div class="hov-pointer text-white" @click="toggleTheme">
    <svg-icon v-show="isDark" name="moon"></svg-icon>
    <svg-icon v-show="!isDark" name="sun"></svg-icon>
  </div>
</template>
<script setup>
import { isDark, toggleDark } from "@/utils/dark";
function toggleTheme() {
  toggleDark();
}
</script>
