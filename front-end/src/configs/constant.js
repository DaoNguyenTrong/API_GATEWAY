export const appTitle = import.meta.env.VITE_APP_TITLE;

const baseUrlConfig = runtimeConfig.VITE_BASE_API;
const authURLConfig = runtimeConfig.VITE_BASE_API;
const host = window.location.origin;
const nodeEnv = import.meta.env.VITE_NODE_ENV;
const development = "development";
const production = "production";

const authURL =
  host.includes("10.65.") ||
  host.includes("172.16.") ||
  host.includes("192.168.")
    ? `${host}/api/portal`
    : authURLConfig;

const baseURL =
  host.includes("10.65.") ||
  host.includes("172.16.") ||
  host.includes("192.168.")
    ? `${host}/api/rma`
    : baseUrlConfig;

const constant = {
  nodeEnv: import.meta.env.VITE_NODE_ENV,
  development: development,
  production: production,
  appVersion: import.meta.env.VITE_APP_VERSION_NUMBER,
  appTitle: appTitle,
  apiVersion: import.meta.env.VITE_APP_API_VERSION,
  publicVapidKey: import.meta.env.VITE_APP_PUBLIC_VAPID_KEY,

  baseUrl: nodeEnv === development ? baseUrlConfig : baseURL,
  baseApi: nodeEnv === development ? baseUrlConfig : baseURL,
  authApi: nodeEnv === development ? authURLConfig : authURL,

  // key storage in cookies, localStorage, ...
  token: "Token",
  refreshToken: "Refresh-Token",
  userInformation: "UserInformation",
  sidebar: "SidebarStatus",
  language: "Language",
  projectId: "ProjectId",
  subscriptionEndpoint: "SubscriptionEndpoint",
  mapCenter: "MapCenter",
  mapZoom: "MapZoom",
  mapStyle: "MapStyle",
  formData: {
    headers: { "Content-Type": "multipart/form-data" },
    formSerializer: {
      indexes: false, // array indexes format null - no brackets, false - empty brackets, true - brackets with indexes
      dots: false,
      metaTokens: false,
    },
  },
  documentStatus: {
    public: "public",
    private: "private",
    internal: "internal",
  },
  suggestionList: {
    regulatoryIssuer: "regulatoryIssuer",
    source: "source",
    projectReportName: "projectReportName",
    documentTypes: "documentTypes",
    projectReportType: "projectReportType",
    phase: "phase",
    rainStationDataType: "rainStationDataType",
  },
  fileAccept: {
    excel:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    image: "image/*",
  },
  validateExcel: {
    time: "Thời đoạn",
    capacityCurveZ: "Z (10⁶m³)",
    capacityCurveV: "V (m)",
    capacityCurveF: "F (km²)",
  },
  dateFormat: {
    default: "HH:mm:ss dd-MM-yyyy",
  },
  spillwayShape: {
    practicalSection: "practical",
    trapezoidSection: "trapezoid",
    pianoKeySection: "pianoKey",
  },
  position: { right: "Right side", left: "Left side", center: "Center" },
  observationType: {
    SYNOP: "SYNOP",
    AWS: "AWS",
  },
  texFileName: { projectInfo: "ProjectInfo.tex" },
  dateTimeFormat: "HH:mm:ss dd/MM/yyyy",
  timeFormat: "HH:mm:ss",
  dateFormat: "dd/MM/yyyy",
  hourMinuteFormat: "HH:mm",
  dateMonthFormat: "dd/MM",
  background: {
    tet: "tet",
    womenDay: "women-day",
    summer: "summer",
    autumn: "autumn",
    winter: "winter",
    christmas: "christmas",
  },
  userType: { employee: "EMPLOYEE", customer: "CUSTOMER" },
  projectTypes: { ADVANCE: "ADVANCE", RENEW: "RENEW", TOOL: "TOOL" },
  problemStatus: {
    created: 0,
    received: 1,
    processing: 2,
    completed: 3,
    canceled: 4,
  },
  problem: { priority: { high: 1, medium: 2, low: 3 } },
  validateFailed: "Validate failed",
  themeStorageKey: "portal-color-scheme",
};
export default constant;
