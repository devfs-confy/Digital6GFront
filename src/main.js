import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import "./style.css";
import "./assets/main.css";
import "./assets/base.css";
import App from "./App.vue";
import AppIcon from "@/components/shared/AppIcon.vue";
import { vPermission } from "./directives/v-permission";
import "@/assets/table-system.css";

const app = createApp(App);

app.component("AppIcon", AppIcon);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.directive("permission", vPermission);
app.use(pinia);
app.use(router);
app.mount("#app");
