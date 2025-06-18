<template>
  <div class="app-container">
    <el-button type="primary" @click="exportInflowForecast('kiv')">
      Lưu lượng lũ mô phỏng
    </el-button>
    <el-button type="primary" @click="exportInflowForecast('way')">
      Lưu lượng thềm mô phỏng
    </el-button>
  </div>
</template>

<script setup>
import inflowForecast from "./data-export.json";
import { createWorkbook, downloadFile } from "@/excels/index";
import { format, parse } from "date-fns";

async function exportInflowForecast(type) {
  const now = new Date();
  const workbook = await createWorkbook(
    "daoNT",
    now,
    now,
    now,
    "Lưu lượng dự báo mô phỏng"
  );
  const sheet = workbook.addWorksheet("inflow");
  inflowForecast.forEach((item, index) => {
    const time = parse(item.time, "dd/MM/yyyy HH:mm:ss", new Date());
    const timeString = format(time, "HH:mm:ss dd/MM/yyyy");
    sheet.getCell(`A${index + 1}`).value = `${timeString};${
      type === "kiv" ? item.kiv_forecast_value : item.floodway_forecast_value
    }`;
  });
  const buffer = await workbook.xlsx.writeBuffer();
  downloadFile(buffer, "inflow.xlsx");
}
</script>

<style lang="scss" scoped></style>
