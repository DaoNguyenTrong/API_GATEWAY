import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import api from "@/api";
import storage from "@/storage";
import config from "@/configs/constant";
import { role } from "@/api/index";

export const useOptionsStore = defineStore("optionsStore", () => {
  const projects = ref([]);
  const roles = ref([]);
  const suggestions = ref({
    documentTypes: [],
    regulatoryIssuer: [],
    source: [],
    projectReportName: [],
    projectReportType: [],
    phase: [],
    rainStationDataType: [],
    periods: [],
    dischargeTypes: [],
    damTypes: [],
    position: [],
    gateTypes: [],
    liftTypes: [],
    gateLiftingDirections: [],
    gateMotorSupply: [],
    waterwayTypes: [],
    waterwayConductTypes: [],
    waterwayConductMethods: [],
    waterwayCanalSectionTypes: [],
    surgeTankTypes: [],
    powerhouseType: [],
  });

  const selections = ref({
    spillwayShape: [],
  });

  /**
   * Get project options for filtering, selections, etc...
   * @returns {Promise<Response.data>}
   */
  async function getProjects() {
    const res = await api.project.getAllProjectOptions();
    projects.value = res;
    return res;
  }

  /**
   * Get role options for filtering, selection, etc...
   * @returns {Promise<Response.data>}
   */
  async function getRoles() {
    const res = await role.getRoleOptions();
    roles.value = res;
    return res;
  }

  /**
   * Get suggestion list by source
   * @param {string} source
   * @returns {array<string>}
   */
  function getSuggestions(source) {
    return suggestions.value[source].map((item) => {
      return { value: item };
    });
  }

  /**
   * Query document type for el-autocomplete
   * @param {string} queryString
   * @param {callback} cb
   * @param {array<object>} options
   */
  function queryDocumentType(queryString, cb, key) {
    let options = suggestions.value[key];
    let array = options.map((item) => {
      return { value: item };
    });
    const results = queryString
      ? array.filter(createFilter(queryString))
      : array;
    cb(results);
  }

  /**
   *
   * @param {string} queryString
   * @returns {callback}
   */
  function createFilter(queryString) {
    return (type) => {
      return type.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    };
  }

  /**
   * Save suggestion to local storage
   * @param {string} key
   * @param {string} value
   */
  function updateSuggestion(key, value) {
    if (!suggestions.value[key].includes(value)) {
      suggestions.value[key].push(value);
      storage.local.setSuggestion(key, suggestions.value[key]);
    }
  }

  /**
   * Suggestion list initial with value in local storage
   */
  function initSuggestions() {
    const keys = Object.keys(config.suggestionList);
    keys.forEach((key) => {
      const list = storage.local.getSuggestion(key);
      if (list) suggestions.value[key] = [...list];
    });
  }

  /**
   * It's an async function that calls an async function that returns a promise that resolves to an
   * object with two properties, suggestions and selections.
   *
   * The function then assigns the value of the suggestions property to the suggestions property of the
   * options object and the value of the selections property to the selections property of the options
   * object.
   *
   * The function is called in the following code:
   */
  async function getOptions() {
    const res = await api.options.getOptions();
    suggestions.value = res.suggestions;
    selections.value = res.selections;
  }

  return {
    projects,
    roles,
    suggestions,
    selections,
    getProjects,
    getRoles,
    getSuggestions,
    queryDocumentType,
    updateSuggestion,
    initSuggestions,
    getOptions,
  };
});
