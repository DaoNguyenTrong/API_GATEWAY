<template>
  <el-carousel trigger="click" :height="height" :interval="interval">
    <el-carousel-item v-for="(item, index) in images" :key="item">
      <el-image
        style="width: 100%; height: 100%"
        :src="item.url"
        fit="cover"
        :preview-src-list="srcList"
        :preview-teleported="true"
        :initial-index="index"
        @click="setIndex()"
      />
    </el-carousel-item>
  </el-carousel>
</template>
<script setup>
import { computed, ref } from "vue";
const props = defineProps({
  height: { type: String, default: "250px" },
  images: { type: Array, default: [] },
  interval: { type: Number, default: 7000 },
});
const index = ref(0);

const srcList = computed(() => {
  return props.images.map((item) => item.url);
});

function setIndex(i) {
  index.value = i;
}
</script>
