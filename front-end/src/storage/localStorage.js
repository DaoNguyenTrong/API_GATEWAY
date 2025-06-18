import constant, { appTitle } from "@/configs/constant";

const UserInform = constant.userInformation;
const Sidebar = constant.sidebar;
const Language = constant.language;
const ProjectId = constant.projectId;
const SubscriptionEndpoint = constant.subscriptionEndpoint;

// User information accession
export function getInform() {
  const str = localStorage.getItem(UserInform);
  return JSON.parse(str);
}
export function setInform(inform = {}) {
  const str = JSON.stringify(inform);
  return localStorage.setItem(UserInform, str);
}
export function removeInform() {
  return localStorage.removeItem(UserInform);
}

// Sidebar status accession
export function getSidebar() {
  return localStorage.getItem(Sidebar);
}
export function setSidebar(status) {
  return localStorage.setItem(Sidebar, status);
}
export function removeSidebar() {
  return localStorage.removeItem(Sidebar);
}

// Language
export function getLanguage() {
  return localStorage.getItem(Language);
}

export function setLanguage(lang) {
  return localStorage.setItem(Language, lang);
}

export function removeLanguage() {
  return localStorage.removeItem(Language);
}

// Suggestion list
export function getSuggestion(key) {
  const result = localStorage.getItem(`${appTitle}-${key}`);
  return JSON.parse(result);
}

export function setSuggestion(key, value) {
  const string = JSON.stringify(value);
  return localStorage.setItem(`${appTitle}-${key}`, string);
}

export function removeSuggestion(key) {
  return localStorage.removeItem(`${appTitle}-${key}`);
}

// Current project
export function getProjectId() {
  return localStorage.getItem(ProjectId);
}

export function setProjectId(value) {
  return localStorage.setItem(ProjectId, value);
}

export function deleteProjectId() {
  return localStorage.removeItem(ProjectId);
}

function getSubscriptionEndpoint() {
  return localStorage.getItem(SubscriptionEndpoint);
}

function setSubscriptionEndpoint(endpoint) {
  return localStorage.setItem(SubscriptionEndpoint, endpoint);
}

function deleteSubscriptionEndpoint() {
  return localStorage.removeItem(SubscriptionEndpoint);
}

const local = {
  getInform,
  setInform,
  removeInform,
  getSidebar,
  setSidebar,
  removeSidebar,
  getLanguage,
  setLanguage,
  removeLanguage,
  getSuggestion,
  setSuggestion,
  removeSuggestion,
  getProjectId,
  setProjectId,
  deleteProjectId,
  getSubscriptionEndpoint,
  setSubscriptionEndpoint,
  deleteSubscriptionEndpoint,
};

export default local;
