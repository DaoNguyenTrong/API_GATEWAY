export { projectInfoParams } from "./params";

export function exportLaTeX(params, form) {
  let doc = ``;
  params.forEach((item) => {
    doc += createCommand(item, form[item]);
  });
  return doc;
}

export function downloadReport(text, fileName) {
  var hiddenElement = document.createElement("a");

  hiddenElement.download = fileName;
  var blob = new Blob([text], {
    type: "text/plain",
  });
  hiddenElement.href = window.URL.createObjectURL(blob);
  hiddenElement.click();
  hiddenElement.remove();
}

function createCommand(param, value) {
  return `\\newcommand{\\${param}}{${value}}\n`;
}
