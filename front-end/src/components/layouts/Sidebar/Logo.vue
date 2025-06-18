<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="!collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img src="../../../assets/images/logo.png" class="sidebar-logo" />
        <div class="fs-23 text-white ml-5 font-regular" style="line-height: 20px">
          <div>Weatherplus</div>
        </div>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img src="../../../assets/images/logo.png" class="sidebar-logo" />
      </router-link>
    </transition>
  </div>
</template>
<script setup>
defineProps({ collapse: { type: Boolean, default: false } });

const title = "HNT";
const subTitle = "Flow control";
</script>
<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  height: 70px;
  text-align: center;
  overflow: hidden;
  padding: 0 0 0 20px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex !important;
    align-items: center;
    justify-content: center;

    & .sidebar-logo {
      height: 45px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      font-size: 25px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
