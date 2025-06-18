import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/index";
import i18n from "@/lang/index";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "virtual:svg-icons-register";
import { errorHandler } from "@/utils/error-handler";

// import "./styles/element/index.scss";

// import ElementPlus from "element-plus";
// import all element css, uncommented next line
import "element-plus/dist/index.css";

// or use cdn, uncomment cdn link in `index.html`
import "@/styles/style.css";
import "@/styles/index.scss";

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";
// Utility classes for hiding elements
import "element-plus/theme-chalk/display.css";

import "./permission"; // permission control
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

const pinia = createPinia();
library.add(fas);
library.add(far);
library.add(fab);

const app = createApp(App);
app.use(router);
app.use(pinia);

app.config.errorHandler = (error, instance, info) => {
  errorHandler(error);
};

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component("font-awesome-icon", FontAwesomeIcon);

// app.use(ElementPlus);
i18n(app).mount("#app");
