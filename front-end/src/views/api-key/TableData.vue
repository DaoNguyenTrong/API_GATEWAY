<template>
  <table-template
    height="calc(100vh - 210px)"
    size="small"
    :show-overflow-tooltip="false"
    row-class-name="cursor-pointer"
  >
    <template #status="{ row }">
      <el-tag
        :type="row.status ? 'success' : 'danger'"
        effect="dark"
        @click.stop="$emit('status', row)"
      >
        {{ row.status ? $t("Active") : $t("Inactive") }}
      </el-tag>
    </template>
    <template #key="{ row }">
      <div class="flex justify-between">
        {{ row.key }}
        <el-tooltip
          :content="$t('Copy to clipboard')"
          placement="right"
          :show-after="300"
        >
          <el-button
            icon="CopyDocument"
            size="small"
            type="primary"
            class="no-bg ml-2"
            @click.stop="copyToClipboard(row.key)"
          ></el-button>
        </el-tooltip>
      </div>
    </template>
    <template #expiredDate="{ row }">
      <div class="flex justify-between">
        {{ row.expiredDate ? format(row.expiredDate, "dd/MM/yyyy") : "-" }}
      </div>
    </template>
    <template #createdBy="{ row }">
      <div class="flex justify-between">
        {{
          props.accounts.find((account) => account.id === row.createdBy)
            ?.username
        }}
      </div>
    </template>
    <template #restrict="{ row }">
      <el-button
        type="primary"
        size="small"
        class="no-bg"
        icon="Lock"
        @click.stop="$emit('restrict', row)"
      ></el-button>
    </template>
    <template #actions="{ row }">
      <el-tooltip :content="$t('Edit')" placement="top" :show-after="300">
        <el-button
          icon="Edit"
          size="small"
          type="warning"
          class="no-bg"
        ></el-button>
      </el-tooltip>
      <el-tooltip :content="$t('Delete')" placement="top" :show-after="300">
        <el-button
          icon="Delete"
          size="small"
          type="danger"
          class="no-bg"
          @click.stop="$emit('delete', row)"
        ></el-button>
      </el-tooltip>
    </template>
  </table-template>
</template>

<script setup>
import { messageSuccess } from "@/utils/message";
import { format } from "date-fns";
import { t } from "i18next";

const props = defineProps({
  accounts: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(["delete", "restrict", "status"]);

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  messageSuccess(t("Copy to clipboard"));
};
</script>

<style lang="scss" scoped></style>
