import config from "@/configs/constant";
import {
  createCellValue,
  createWorkbook,
  loadBuffer,
  thinBorder,
} from "@/excels/index";
import { messageError } from "@/utils/message";
import * as Excel from "exceljs/dist/exceljs.min.js";
import { t } from "i18next";

const title = config.appTitle || "ICT";

/**
 * Generate zfv file template
 * @returns {Promise<Buffer>}
 */
export async function genZVFTemplate() {
  const workbook = createWorkbook(
    title,
    title,
    new Date(),
    new Date(),
    "ZVF file"
  );
  const sheet = workbook.addWorksheet(t("ZVF table"));
  createCellValue("A1", config.validateExcel.capacityCurveZ, sheet);
  createCellValue("B1", config.validateExcel.capacityCurveV, sheet);
  createCellValue("C1", config.validateExcel.capacityCurveF, sheet);
  createCellValue("A2", "", sheet);
  createCellValue("B2", "", sheet);
  createCellValue("C2", "", sheet);

  /**
   * Bordered each cells
   */
  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = thinBorder;
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

/**
 * Read zvf content to list zvf
 * @param {buffer} buffer
 * @returns {Array<Object>}
 */
export async function readZVFFile(buffer) {
  const result = [];
  try {
    const workbook = await loadBuffer(buffer);
    const sheet = workbook.getWorksheet(1);
    await sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        validateZVFFile(row);
      } else {
        let obj = {};
        obj.z = row.getCell(1).value;
        obj.v = row.getCell(2).value;
        obj.f = row.getCell(3).value;
        result.push(obj);
      }
    });
  } catch (error) {
    if (error.message) {
      messageError(t(error.message));
    } else messageError(t("Fail to load the file content"));
    throw error;
  }
  return result;
}

/**
 * Validate zvf file
 * @param {Excel.Workbook.WorkSheet.Row} row
 */
function validateZVFFile(row) {
  const A1 = row.getCell(1).value;
  const B1 = row.getCell(2).value;
  const C1 = row.getCell(3).value;
  if (
    A1 !== config.validateExcel.capacityCurveZ &&
    B1 !== config.validateExcel.capacityCurveV &&
    C1 !== config.validateExcel.capacityCurveF
  ) {
    throw new Error("File is not in the correct format");
  }
}

/**
 * Gen zvf file from data array
 * @param {array} data
 * @returns {buffer}
 */
export async function genZVFFile(data = []) {
  const workbook = createWorkbook(
    title,
    title,
    new Date(),
    new Date(),
    "Zvf file"
  );
  const sheet = workbook.addWorksheet("zvf table");
  createCellValue("A1", config.validateExcel.capacityCurveZ, sheet);
  createCellValue("B1", config.validateExcel.capacityCurveV, sheet);
  createCellValue("C1", config.validateExcel.capacityCurveF, sheet);
  data.forEach((item, index) => {
    createCellValue(`A${index + 2}`, item.z, sheet);
    createCellValue(`B${index + 2}`, item.v, sheet);
    createCellValue(`C${index + 2}`, item.f, sheet);
  });

  workbook.eachSheet((sheet) => {
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = thinBorder;
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
