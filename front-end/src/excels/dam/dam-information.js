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
 * Generate practical file template
 * @returns {Promise<Buffer>}
 */
export async function genPracticalTemplate() {
  const workbook = createWorkbook(
    title,
    title,
    new Date(),
    new Date(),
    "Practical file"
  );

  const sheet = workbook.addWorksheet(t("Practical"));
  createCellValue("A1", "X", sheet);
  createCellValue("B1", "Y", sheet);
  createCellValue("A2", "", sheet);
  createCellValue("B2", "", sheet);
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
 * Read practical file
 * @param {Buffer} buffer
 * @returns {Array<Object>}
 */
export async function readPractical(buffer) {
  const result = [];
  try {
    const workbook = await loadBuffer(buffer);
    const sheet = workbook.getWorksheet(1);
    await sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        validatePracticalFile(row);
      } else {
        const obj = {};
        obj.x = row.getCell(1).value;
        obj.y = row.getCell(2).value;
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
 * Validate practical file
 * @param {Excel.Workbook.WorkSheet.Row} row
 */
function validatePracticalFile(row) {
  const A1 = row.getCell(1).value;
  const B1 = row.getCell(2).value;
  if (A1 !== "X" && B1 !== "Y") {
    throw new Error("File is not in the correct format");
  }
}

export async function genPracticalFile(data = []) {
  const workbook = createWorkbook(
    title,
    title,
    new Date(),
    new Date(),
    "Practical file"
  );
  const sheet = workbook.addWorksheet(t("Practical"));
  createCellValue("A1", "X", sheet);
  createCellValue("B1", "Y", sheet);
  data.forEach((item, index) => {
    createCellValue(`A${index + 2}`, item.x, sheet);
    createCellValue(`B${index + 2}`, item.y, sheet);
  });

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
