import config from "@/configs/constant";
import {
  createCellValue,
  createWorkbook,
  loadBuffer,
  setColumnWidth,
  thinBorder,
} from "@/excels/index";
import { messageError } from "@/utils/message";
import { t } from "i18next";
import { parse, isValid } from "date-fns";

const title = config.appTitle || "ICT";

/**
 * Generate rule curve template
 * @returns {Buffer}
 */
export async function genRuleCurveTemplate() {
  const workbook = createWorkbook(
    title,
    title,
    new Date(),
    new Date(),
    "Rule curve file"
  );
  const sheet = workbook.addWorksheet(t("Rule curve"));
  createCellValue("A1", config.validateExcel.time, sheet);
  createCellValue("B1", "Đường phòng phá hoại (m)", sheet);
  createCellValue("C1", "Đường hạn chế cấp nước (m)", sheet);
  createCellValue("D1", "Đường phòng lũ (m)", sheet);
  for (let i = 2; i < 22; i++) {
    createCellValue(`A${i}`, "", sheet);
    createCellValue(`B${i}`, "", sheet);
    createCellValue(`C${i}`, "", sheet);
    createCellValue(`D${i}`, "", sheet);
  }
  const col1 = setColumnWidth(sheet, 1, 10);
  const col2 = setColumnWidth(sheet, 2, 30);
  const col3 = setColumnWidth(sheet, 3, 30);
  const col4 = setColumnWidth(sheet, 4, 30);

  col1.alignment = { vertical: "top", horizontal: "center" };
  col2.alignment = { vertical: "top", horizontal: "center" };
  col3.alignment = { vertical: "top", horizontal: "center" };
  col4.alignment = { vertical: "top", horizontal: "center" };

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
 * Read rule curve file content
 * @param {Buffer} buffer
 * @returns {object}
 */
export async function readRuleCurveFile(buffer) {
  const result = [];
  const keys = [];
  try {
    const workbook = await loadBuffer(buffer);
    const sheet = workbook.getWorksheet(1);
    const row1 = sheet.getRow(1);
    row1.eachCell((cell) => {
      keys.push(cell.value);
    });
    sheet.eachRow((row, rowNumber) => {
      let obj = {};
      if (rowNumber === 1) {
        validateFile(row);
      } else {
        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          if (rowNumber !== 1) {
            if (validateCell(cell, colNumber, rowNumber)) {
              if (cell.value !== "") obj[keys[colNumber - 1]] = cell.value;
            } else {
              throw new Error(
                t("Error on row, col", { col: colNumber, row: rowNumber })
              );
            }
          }
        });
        result.push(obj);
      }
    });
  } catch (error) {
    if (error.message) {
      messageError(error.message);
    } else messageError(t("Fail to load the file content"));
  }
  return { result, keys };
}

export async function genRuleCurveFile(data = [], keys = []) {
  const workbook = createWorkbook(
    title,
    title,
    new Date(),
    new Date(),
    "Rule curve file"
  );
  const sheet = workbook.addWorksheet("zvf table");
  const row1 = sheet.getRow(1);
  for (let i = 0; i < keys.length; i++) {
    row1.getCell(i + 1).value = keys[i];
  }
  for (let i = 0; i < data.length; i++) {
    const row = sheet.getRow(i + 2);
    for (let j = 0; j < keys.length; j++) {
      row.getCell(j + 1).value = data[i][keys[j]];
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

/**
 * Validate rule curve cell
 * @param {WorkSheet.Cell} cell Current cell
 * @param {number} col Current col number
 * @param {number} row Current row number
 * @returns
 */
function validateCell(cell, col, row) {
  if (col === 1) {
    const dateTime = parse(cell.value, config.dateFormat.default, new Date());
    return isValid(dateTime);
  } else if (typeof cell.value !== "number" && cell.value !== "") {
    throw new Error(t("Error on row, col", { col: col, row }));
  } else return true;
}

/**
 * Validate rule curve file content
 * @param {WorkSheet.Row} row
 */
function validateFile(row) {
  const A1 = row.getCell(1).value;
  if (A1 !== config.validateExcel.time) {
    throw new Error(t("The file is not in the correct format"));
  }
}
