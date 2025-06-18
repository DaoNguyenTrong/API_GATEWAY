<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'sub-menu-title-noDropdown': !isNest }"
        >
          <sidebar-icon
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
          />
          <template v-if="onlyOneChild.meta.title" #title>
            <span>{{ $t(onlyOneChild.meta.title) }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu
      v-else
      ref="sub-Menu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template v-if="onlyOneChild.meta.title" #title>
        <sidebar-icon v-if="item.meta" :icon="item.meta && item.meta.icon" />
        <span>{{ $t(item.meta.title) }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { isExternal } from "@/utils/validate";

const props = defineProps({
  item: { type: Object, required: true },
  isNest: { type: Boolean, default: true },
  basePath: { type: String, default: "" },
});

const onlyOneChild = ref(null);

function hasOneShowingChild(children = [], parent) {
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      onlyOneChild.value = item;
      return true;
    }
  });

  if (showingChildren.length === 1) {
    return true;
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
    return true;
  }
}

function resolvePath(routePath) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  if (props.basePath === "/") return props.basePath + routePath;
  if (routePath) return props.basePath + "/" + routePath;
  else return props.basePath;
}
</script>
