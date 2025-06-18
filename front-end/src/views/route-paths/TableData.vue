<template>
  <table-template
    height="calc(100vh - 210px)"
    size="small"
    :show-overflow-tooltip="false"
    row-class-name="cursor-pointer"
  >
    <template #status="{ row }">
      <el-button
        :type="row.isActive ? 'success' : 'danger'"
        effect="dark"
        size="small"
        class="no-bg"
        @click.stop="$emit('status', row)"
      >
        {{ row.isActive ? $t("Active") : $t("Inactive") }}
      </el-button>
    </template>
    <template #proxy="{ row }">
      <el-switch
        :model-value="row.isProxy"
        :active-value="true"
        :inactive-value="false"
        @click.stop="$emit('proxy', row)"
      />
    </template>
    <template #screens="{ row }">
      <el-button
        icon="Monitor"
        class="no-bg"
        size="small"
        type="primary"
        @click.stop="$emit('screens', row)"
      >
      </el-button>
    </template>
    <template #manageChild="{ row }">
      <el-button
        icon="DocumentCopy"
        class="no-bg"
        size="small"
        type="info"
        @click.stop="$emit('manageChild', row)"
      ></el-button>
    </template>
    <template #actions="{ row }">
      <el-tooltip :content="$t('Edit')" placement="top" :show-after="300">
        <el-button icon="Edit" class="no-bg" size="small" type="warning">
        </el-button>
      </el-tooltip>
      <el-tooltip :content="$t('Delete')" placement="top" :show-after="300">
        <el-button
          icon="Delete"
          class="no-bg"
          size="small"
          type="danger"
          @click.stop="$emit('delete', row)"
        ></el-button>
      </el-tooltip>
    </template>
  </table-template>
</template>

<script setup>
const emit = defineEmits([
  "status",
  "proxy",
  "delete",
  "screens",
  "manageChild",
]);
</script>

<style lang="scss" scoped></style>
