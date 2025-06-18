import reservoir from "./reservoir/index";
import dam from "./dam/index";
import * as Excel from "exceljs/dist/exceljs.min.js";

export const thinBorder = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

/**
 * Download file from buffer
 * @param {buffer} buffer
 * @param {string} fileName
 */
export function downloadFile(buffer, fileName, extension = "xlsx") {
  const url = window.URL.createObjectURL(new Blob([buffer]));
  let linkExist = document.getElementById("download-link");
  if (linkExist) linkExist.remove();
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.${extension}`);
  link.setAttribute("id", "download-link");
  document.body.appendChild(link);
  document.getElementById("download-link").click();
}

/**
 * Load buffer to workbook
 * @param {Buffer} buffer
 * @returns {Promise<Excel.Workbook>}
 */
export async function loadBuffer(buffer) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(buffer);
  return workbook;
}

/**
 *
 * @param {[string, number]} cell Cell
 * @param {any} value Value assign to cell
 * @param {Excel.Workbook.Sheet} sheet Current worksheet
 * @returns {Excel.Workbook.Sheet.Cell} Cell with value
 */
export function createCellValue(cell, value, sheet) {
  const tmp = sheet.getCell(cell);
  tmp.value = value;
  return tmp;
}

/**
 * Create exceljs workbook
 * @param {string} creator File creator
 * @param {string} lastModifiedBy Last modifier by
 * @param {Date} created Creation time
 * @param {Date} modified Modify time
 * @param {string} description Workbook description
 * @returns {Excel.Workbook}
 */
export function createWorkbook(
  creator,
  lastModifiedBy,
  created,
  modified,
  description
) {
  const workbook = new Excel.Workbook();
  workbook.creator = creator;
  workbook.lastModifiedBy = lastModifiedBy;
  workbook.created = created;
  workbook.modified = modified;
  workbook.description = description;
  return workbook;
}

/**
 * Set column width
 * @param {Excel.Workbook.WorkSheet} sheet
 * @param {[string, number]} col Col name or col index
 * @param {number} width Col width
 * @returns {Excel.Workbook.WorkSheet.Column}
 */
export function setColumnWidth(sheet, col = 1, width = 80) {
  const column = sheet.getColumn(col);
  column.width = width;
  return column;
}

export default {
  reservoir,
  dam,
  downloadFile,
  loadBuffer,
  createCellValue,
  createWorkbook,
  setColumnWidth,
};
